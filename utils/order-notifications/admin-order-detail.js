'use strict';

const MAX_NOTIFICATION_HTML_BYTES = 512 * 1024;
const MONEY_RE = /^\d+\.\d{2}$/;
const IVA_RE = /^(\d+(?:\.\d+)?)%$/;

function unavailable(reason) {
  return { status: 'unavailable', source: 'none', reason };
}

function parseIvaNumber(raw) {
  if (raw === undefined || raw === null || raw === '') return NaN;
  const normalized = typeof raw === 'string' ? raw.replace(/,/g, '.').replace(/%/g, '').trim() : raw;
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function extractTbodyInner(html, tbodyId) {
  const marker = `<tbody id="${tbodyId}">`;
  const start = html.indexOf(marker);
  if (start === -1) return null;
  if (html.indexOf(marker, start + marker.length) !== -1) return false;
  const contentStart = start + marker.length;
  const end = html.indexOf('</tbody>', contentStart);
  if (end === -1) return false;
  const inner = html.slice(contentStart, end);
  if (inner.includes('<tbody')) return false;
  return inner;
}

function extractRows(tbodyInner) {
  const rows = [];
  let pos = 0;
  while (pos < tbodyInner.length) {
    const trStart = tbodyInner.indexOf('<tr', pos);
    if (trStart === -1) {
      if (tbodyInner.slice(pos).trim()) return null;
      break;
    }
    if (tbodyInner.slice(pos, trStart).trim()) return null;
    const openEnd = tbodyInner.indexOf('>', trStart);
    if (openEnd === -1) return null;
    const trEnd = tbodyInner.indexOf('</tr>', openEnd + 1);
    if (trEnd === -1) return null;
    const rowInner = tbodyInner.slice(openEnd + 1, trEnd);
    if (rowInner.includes('<tr')) return null;
    rows.push(rowInner);
    pos = trEnd + 5;
  }
  return rows;
}

function extractCells(rowInner) {
  const cells = [];
  let pos = 0;
  while (pos < rowInner.length) {
    const tdStart = rowInner.indexOf('<td', pos);
    if (tdStart === -1) {
      if (rowInner.slice(pos).trim()) return null;
      break;
    }
    if (rowInner.slice(pos, tdStart).trim()) return null;
    const openEnd = rowInner.indexOf('>', tdStart);
    if (openEnd === -1) return null;
    const tdEnd = rowInner.indexOf('</td>', openEnd + 1);
    if (tdEnd === -1) return null;
    const cellInner = rowInner.slice(openEnd + 1, tdEnd);
    if (cellInner.includes('<td')) return null;
    cells.push(cellInner);
    pos = tdEnd + 5;
  }
  return cells;
}

function parseGroup({ html, tbodyId, section, expectedEntries }) {
  const inner = extractTbodyInner(html, tbodyId);
  if (expectedEntries.length === 0) {
    return inner === null ? { ok: true, items: [], summary: null } : { ok: false, reason: 'unexpected_section' };
  }
  if (typeof inner !== 'string') {
    return { ok: false, reason: 'missing_or_duplicate_section' };
  }
  const rows = extractRows(inner);
  if (!rows || rows.length !== expectedEntries.length + 3) {
    return { ok: false, reason: 'row_count_mismatch' };
  }

  const items = [];
  let sumLineNet = 0;
  let sumLineIva = 0;
  let totalQty = 0;
  let maxIva = 0;

  for (let i = 0; i < expectedEntries.length; i += 1) {
    const { index, product } = expectedEntries[i];
    const cells = extractCells(rows[i]);
    if (!cells || cells.length !== 6) {
      return { ok: false, reason: 'malformed_item_row' };
    }
    if (cells.some(c => c.includes('<') || c.includes('>'))) {
      return { ok: false, reason: 'unexpected_markup_in_cell' };
    }

    const htmlLista = cells[1].trim();
    const htmlCode = cells[2].trim();
    const htmlQty = cells[3].trim();
    const htmlIva = cells[4].trim();
    const htmlPrice = cells[5].trim();

    const expectedLista = String(product.lista).trim();
    const expectedCode = String(product.code ?? '').trim();
    const expectedQtyRaw = String(product.qty ?? '').trim();
    const qtyNum = Number(expectedQtyRaw);
    const expectedIva = parseIvaNumber(product.iva);

    if (!expectedCode || htmlLista !== expectedLista || htmlCode !== expectedCode) {
      return { ok: false, reason: 'product_mismatch' };
    }
    if (!Number.isFinite(qtyNum) || qtyNum <= 0 || htmlQty !== expectedQtyRaw) {
      return { ok: false, reason: 'qty_mismatch' };
    }

    const ivaMatch = IVA_RE.exec(htmlIva);
    if (!ivaMatch || !Number.isFinite(expectedIva)) {
      return { ok: false, reason: 'iva_mismatch' };
    }
    const ivaPercent = Number(ivaMatch[1]);
    if (!Number.isFinite(ivaPercent) || Math.abs(ivaPercent - expectedIva) > 0.001) {
      return { ok: false, reason: 'iva_mismatch' };
    }

    if (!MONEY_RE.test(htmlPrice)) {
      return { ok: false, reason: 'invalid_unit_price' };
    }
    const unitNetPrice = Number(htmlPrice);
    if (!Number.isFinite(unitNetPrice) || unitNetPrice < 0) {
      return { ok: false, reason: 'invalid_unit_price' };
    }

    const lineNetSubtotal = Number((unitNetPrice * qtyNum).toFixed(2));
    sumLineNet += unitNetPrice * qtyNum;
    sumLineIva += qtyNum * unitNetPrice * (ivaPercent / 100);
    totalQty += qtyNum;
    if (ivaPercent > maxIva) maxIva = ivaPercent;

    items.push({
      index,
      code: expectedCode,
      qty: qtyNum,
      unitNetPrice,
      ivaPercent,
      lineNetSubtotal,
      section,
    });
  }

  const summaryLabels = ['<b>Subtotal</b>', '<b>IVA</b>', '<b>TOTAL</b>'];
  const summaryValues = [];
  for (let s = 0; s < 3; s += 1) {
    const cells = extractCells(rows[expectedEntries.length + s]);
    if (!cells || cells.length !== 2) {
      return { ok: false, reason: 'malformed_summary_row' };
    }
    if (cells[0].trim() !== summaryLabels[s]) {
      return { ok: false, reason: 'summary_label_mismatch' };
    }
    const amountText = cells[1].trim();
    if (!MONEY_RE.test(amountText)) {
      return { ok: false, reason: 'invalid_summary_amount' };
    }
    const amount = Number(amountText);
    if (!Number.isFinite(amount) || amount < 0) {
      return { ok: false, reason: 'invalid_summary_amount' };
    }
    summaryValues.push(amount);
  }

  const [subtotal, iva, total] = summaryValues;
  const subTolerance = Math.max(0.05, totalQty * 0.006 + 0.02);
  const ivaTolerance = Math.max(0.05, totalQty * (maxIva / 100) * 0.006 + 0.02);
  if (Math.abs(sumLineNet - subtotal) > subTolerance) {
    return { ok: false, reason: 'subtotal_mismatch' };
  }
  if (Math.abs(sumLineIva - iva) > ivaTolerance) {
    return { ok: false, reason: 'iva_total_mismatch' };
  }
  if (Math.abs((subtotal + iva) - total) > 0.02) {
    return { ok: false, reason: 'total_mismatch' };
  }

  const summary = { subtotal, iva, total };
  if (section === 'einhell') {
    summary.listDiscountNotice = html.includes('Los precios Einhell/KWB son precios de lista');
  }

  return { ok: true, items, summary };
}

function extractHistoricalPricing(order) {
  if (!order || !Array.isArray(order.productList) || order.productList.length === 0) {
    return unavailable('missing_product_list');
  }
  const html = order?.notification?.content?.html;
  if (typeof html !== 'string' || !html) {
    return unavailable('missing_notification_html');
  }
  if (html.length > MAX_NOTIFICATION_HTML_BYTES) {
    return unavailable('notification_html_too_large');
  }

  const expectedOther = [];
  const expectedEinhell = [];
  for (let i = 0; i < order.productList.length; i += 1) {
    const product = order.productList[i];
    if (!product || typeof product !== 'object') {
      return unavailable('invalid_product_entry');
    }
    if (product.lista === 'einhell') {
      expectedEinhell.push({ index: i, product });
    } else {
      expectedOther.push({ index: i, product });
    }
  }

  const otherResult = parseGroup({ html, tbodyId: 'tablaProductosOther', section: 'other', expectedEntries: expectedOther });
  if (!otherResult.ok) return unavailable(otherResult.reason);

  const einhellResult = parseGroup({ html, tbodyId: 'tablaProductosEinhell', section: 'einhell', expectedEntries: expectedEinhell });
  if (!einhellResult.ok) return unavailable(einhellResult.reason);

  const itemsByIndex = new Array(order.productList.length);
  for (const item of [...otherResult.items, ...einhellResult.items]) {
    itemsByIndex[item.index] = item;
  }

  const subtotal = Number((((otherResult.summary?.subtotal || 0) + (einhellResult.summary?.subtotal || 0))).toFixed(2));
  const iva = Number((((otherResult.summary?.iva || 0) + (einhellResult.summary?.iva || 0))).toFixed(2));
  const total = Number((((otherResult.summary?.total || 0) + (einhellResult.summary?.total || 0))).toFixed(2));

  return {
    status: 'verified',
    source: 'notification_html',
    currency: 'ARS',
    priceBasis: 'net_unit_without_iva',
    items: itemsByIndex,
    sections: {
      other: otherResult.summary,
      einhell: einhellResult.summary,
    },
    totals: { subtotal, iva, total },
  };
}

function createAdminOrderDetailHandler(Order, isValidId) {
  return async (req, res) => {
    const id = req.params?.id;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'ID de pedido inválido' });
    }
    try {
      // notification is Schema.Types.Mixed with select:false; Mongoose requires
      // selecting '+notification' (nested '+notification.*' drops it on Mixed),
      // then stripping notification completely before serializing.
      const order = await Order.findById(id)
        .select('+notification')
        .lean();
      if (!order) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      const { notification, ...publicOrder } = order;
      return res.status(200).json({
        ...publicOrder,
        notificationStatus: notification?.status || 'unavailable',
        historicalPricing: extractHistoricalPricing(order),
      });
    } catch (_) {
      return res.status(500).json({ message: 'No se pudo consultar el pedido' });
    }
  };
}

module.exports = { extractHistoricalPricing, createAdminOrderDetailHandler };
