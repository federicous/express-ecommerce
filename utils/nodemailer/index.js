const transporter = require('./transport');
const pino = require('../logger/pino');
require("dotenv").config();
let adminEmail = process.env.NODEMAILER_ADMIN;
let userEmail = process.env.NODEMAILER_USER;
let bccEmail = process.env.NODEMAILER_BCC;

// let dolar = process.env.DOLAR;

function ccyFormat(num) {
	let numFloat = parseFloat(num)
	      return `${numFloat.toFixed(2)}`;
}

class Correo {
	async registro(user,emailVendedor) {
		try {
			const option = {
				from: `BRMTOOLS - Registro de usuario <${userEmail}>`,
				to: `${[...new Set([user.email,emailVendedor])].filter(Boolean).join(",")}`,
				bcc: `${adminEmail},${bccEmail}`,
				subject: `👤 Usuario Registrado: ${user.email} - ${user.name}`,
				text: `El usuario ${user.email} ha sido registrado`,
				html:`
<table style="vertical-align: top; border-collapse: collapse;">
	<thead>
		<tr>
			<td style="min-width: 100px; border: 1px solid black; background-color: white;"></td>
			<td style="text-align: center;min-width: 100px; border: 1px solid black; background-color: white;"><strong>Datos</strong></td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="border: 1px solid black; background-color: white;"><strong>Nombre</strong></td>
			<td style="border: 1px solid black; background-color: white;">${user.name}</td>
		</tr>
		<tr>
			<td style="border: 1px solid black; background-color: white;"><strong>Correo</strong></td>
			<td style="border: 1px solid black; background-color: white;">${user.email}</td>
		</tr>
		<tr>
			<td style="border: 1px solid black; background-color: white;"><b>Ferreter&iacute;a</b></td>
			<td style="border: 1px solid black; background-color: white;">${user.ferreteria}</td>
		</tr>
		<tr>
			<td style="border: 1px solid black; background-color: white;"><b>Tel&eacute;fono</b></td>
			<td style="border: 1px solid black; background-color: white;">${user.phone}</td>
		</tr>
		<tr>
			<td style="border: 1px solid black; background-color: white;"><strong>Direcci&oacute;n</strong></td>
			<td style="border: 1px solid black; background-color: white;">${user.address}, ${user.provincia}, ${user.localidad}</td>
		</tr>
		<tr>
			<td style="border: 1px solid black; background-color: white;"><strong>CUIT</strong></td>
			<td style="border: 1px solid black; background-color: white;">${user.cuit}</td>
		</tr>
		<tr>
			<td style="border: 1px solid black; background-color: white;"><strong>Vendedor</strong></td>
			<td style="border: 1px solid black; background-color: white;">${user.vendedor}</td>
		</tr>
	</tbody>
</table>
				
				
				`
			}
			const response = await transporter.sendMail(option)
			pino.info(`Enviando correo a: ${user.email}`)
			return response
		} catch (error) {
			pino.error(`Tuvimos este error enviando la confirmación de registro: ${error}`)
		}
	}

	async orden(user, carrito, descuento, dolar, emailVendedor, emailUsuarioElegido, presupuesto= '') {
        try {
            // console.log(user);
            // console.log(carrito);
            // console.log(`datos nodemailer`);			
            // console.log(emailUsuarioElegido);
            // console.log(emailVendedor);
            
            // pino.info(descuento);
            // pino.info(emailVendedor);
            
            function aplicarDescuento(precio, porcentaje = 0) {
                precio = Number(precio);
                porcentaje = Number(porcentaje);
                // console.log(`precio: ${precio} - porcentaje: ${porcentaje}`);
                
                if (isNaN(precio) || isNaN(porcentaje)) {
                    throw new Error('Los parámetros deben ser números válidos.');
                }
                
                const factor = 1 - (porcentaje / 100);
                return precio * factor;
            }
                
            function calcularPrecio(precioConIva,iva,precio,usd,qty,oferta,precioOferta) {
                let price = (oferta && oferta=="si" && precioOferta) ? ccyFormat(precioOferta) : precio
                /* le saco el iva si viene incluido */
                // let resultado = (precioConIva ? parseFloat(precioConIva)-parseFloat(precioConIva)*(parseFloat(typeof iva === "string" ? iva.replace(/,/g, '.').replace(/%/g, '') : iva))/100 : (price ? `${price}` : usd*dolar))*(qty ? parseFloat(qty) : 1);\n\t\t\t\t// let resultado = (precioConIva ? parseFloat(precioConIva)/(1+(parseFloat(typeof iva === "string" ? iva.replace(/,/g, '.').replace(/%/g, '') : iva))/100) : (price ? `${price}` : usd*dolar))*(qty ? parseFloat(qty) : 1)\n\t\t\t\tlet resultado = (precioConIva ? parseFloat(precioConIva) / (1 + (parseFloat(typeof iva === "string" ? iva.replace(/,/g, '.').replace(/%/g, '') : iva)) / 100) : ((usd && `${usd}` != "0") ? usd * dolar : `${price}`)) * (qty ? parseFloat(qty) : 1);
				let resultado = (precioConIva ? parseFloat(precioConIva) / (1 + (parseFloat(typeof iva === "string" ? iva.replace(/,/g, '.').replace(/%/g, '') : iva)) / 100) : ((usd && `${usd}` != "0") ? usd * dolar : `${price}`)) * (qty ? parseFloat(qty) : 1);

                // return resultado
                return (parseFloat(aplicarDescuento(resultado,descuento)))
            }
            
            let itemsOther = '';
            let itemsEinhell = '';
            let carritoEinhell = [];
            let carritoOther = [];

            carrito.forEach(item => {
                if (item.lista === "einhell") {
                    carritoEinhell.push(item);
                } else {
                    carritoOther.push(item);
                }
            });

            carritoOther.forEach(item => {
                const description = [
                    item.name,
                    item.color,
                    item.linea,
                    item.presentacion,
                    `${(item.unidades!="0" && item.lista=="buloneria bremen") ? (`${item.unidades} unidades`) : ""}`,
                    `${item.contenido ? (""+item.contenido) : ""}`
                ].filter(Boolean).join(" | ");

                const displayedDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

                itemsOther += `<tr><td style="border: 1px solid black;">${displayedDescription}</td> 
                    <td style="text-align: center; border: 1px solid black;">${item.lista}</td> 
                    <td style="text-align: center; border: 1px solid black;">${item.code}</td> 
                    <td style="text-align: center; border: 1px solid black;">${item.qty}</td> 
                    <td style="text-align: center; border: 1px solid black;">${parseFloat(typeof item.iva === "string" ? item.iva.replace(/,/g, '.').replace(/%/g, '') : item.iva)}%</td> 
                    <td style="text-align: center; border: 1px solid black;">${ccyFormat(calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,1,item.oferta,item.precioOferta))}</td></tr>`
            })

            carritoEinhell.forEach(item => {
                const description = [
                    item.name,
                    item.color,
                    item.linea,
                    item.presentacion,
                    `${(item.unidades!="0" && item.lista=="buloneria bremen") ? (`${item.unidades} unidades`) : ""}`,
                    `${item.contenido ? (""+item.contenido) : ""}`,
                    `${(item.lista == "einhell") ? (item.description || "") : ""}`,
                    `${(item.lista == "einhell") ? (item.medidas || "") : ""}`
                ].filter(Boolean).join(" | ");

                const displayedDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

                itemsEinhell += `<tr><td style="border: 1px solid black;">${displayedDescription}</td> 
                    <td style="text-align: center; border: 1px solid black;">${item.lista}</td> 
                    <td style="text-align: center; border: 1px solid black;">${item.code}</td> 
                    <td style="text-align: center; border: 1px solid black;">${item.qty}</td> 
                    <td style="text-align: center; border: 1px solid black;">${parseFloat(typeof item.iva === "string" ? item.iva.replace(/,/g, '.').replace(/%/g, '') : item.iva)}%</td> 
                    <td style="text-align: center; border: 1px solid black;">${ccyFormat(calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,1,item.oferta,item.precioOferta))}</td></tr>`
            })


            let sumaOther = 0;
            let sumaIvaOther = 0;
            let sumaTotalOther = 0;

            for (const item of carritoOther) {
                sumaOther = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,item.qty,item.oferta,item.precioOferta)+parseFloat(sumaOther)
            }			
            for (const item of carritoOther) {
                let IVA=parseFloat(typeof item.iva === "string" ? item.iva.replace(/,/g, '.').replace(/%/g, '') : item.iva);
                let PRICE = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,1,item.oferta,item.precioOferta)
                let QTY=parseFloat(item.qty);
                sumaIvaOther=parseFloat(QTY*PRICE*IVA/100)+parseFloat(sumaIvaOther);
            }
            sumaTotalOther = parseFloat(sumaOther+sumaIvaOther)

            let sumaEinhell = 0;
            let sumaIvaEinhell = 0;
            let sumaTotalEinhell = 0;

            for (const item of carritoEinhell) {
                sumaEinhell = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,item.qty,item.oferta,item.precioOferta)+parseFloat(sumaEinhell)
            }			
            for (const item of carritoEinhell) {
                let IVA=parseFloat(typeof item.iva === "string" ? item.iva.replace(/,/g, '.').replace(/%/g, '') : item.iva);
                let PRICE = calcularPrecio(item.precioConIva,item.iva,item.price,item.usd,1,item.oferta,item.precioOferta)
                let QTY=parseFloat(item.qty);
                sumaIvaEinhell=parseFloat(QTY*PRICE*IVA/100)+parseFloat(sumaIvaEinhell);
            }
            sumaTotalEinhell = parseFloat(sumaEinhell+sumaIvaEinhell)


            const option = {
                from: `BRMTOOLS - ${presupuesto ? "PRESUPUESTO" : "Orden de compra"} <${userEmail}>`,
                to: `${[...new Set([user.email,emailVendedor,emailUsuarioElegido])].filter(Boolean).join(",")}`,
                bcc: `${adminEmail},${bccEmail}`,
                subject: `${presupuesto ? "💰 PRESUPUESTO" : "🛒 Orden creada"}`,
                html: `
                    <div>
                        <h3><strong>${presupuesto ? "💰 Presupuesto" : "✅ Su compra ha sido registrada"}</strong></h3>
                        <p><strong>Vendedor:</strong> ${user.vendedor}</p>
                        ${emailUsuarioElegido ? 
                            `<p><strong>Cliente:</strong> ${emailUsuarioElegido}</p> 
                             <p><strong>Pedido generado por:</strong> ${user.name} - ${user.email}</p>
                            `
                             : 
                            `<p><strong>Cliente:</strong> ${user.name} - ${user.email}</p>`
                        }

                        ${carritoOther.length > 0 ? `
                            <h3>Productos BRM Tools</h3>
                            <table style="border: 1px solid black; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th scope="col" style="border: 1px solid black;">Producto</th>
                                        <th scope="col" style="border: 1px solid black;">Lista</th>
                                        <th scope="col" style="border: 1px solid black;">Código</th>
                                        <th scope="col" style="border: 1px solid black;">Cantidad</th>
                                        <th scope="col" style="border: 1px solid black;">iva</th>
                                        <th scope="col" style="border: 1px solid black;">Price</th>
                                    </tr>
                                </thead>
                                <tbody id="tablaProductosOther">
                                    ${itemsOther}
                                    <tr>
                                        <td colspan="5" style="text-align: right;"><b>Subtotal</b></td>
                                        <td style="text-align: center; border: 1px solid black;">${ccyFormat(sumaOther)}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" style="text-align: right;"><b>IVA</b></td>
                                        <td style="text-align: center; border: 1px solid black;">${ccyFormat(sumaIvaOther)}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" style="text-align: right;"><b>TOTAL</b></td>
                                        <td style="text-align: center; border: 1px solid black;">${ccyFormat(sumaTotalOther)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        ` : ''}

                        ${carritoEinhell.length > 0 ? `
                            <h3>Productos Einhell / KWB</h3>
                            <table style="border: 1px solid black; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th scope="col" style="border: 1px solid black;">Producto</th>
                                        <th scope="col" style="border: 1px solid black;">Lista</th>
                                        <th scope="col" style="border: 1px solid black;">Código</th>
                                        <th scope="col" style="border: 1px solid black;">Cantidad</th>
                                        <th scope="col" style="border: 1px solid black;">iva</th>
                                        <th scope="col" style="border: 1px solid black;">Price</th>
                                    </tr>
                                </thead>
                                <tbody id="tablaProductosEinhell">
                                    ${itemsEinhell}
                                    <tr>
                                        <td colspan="5" style="text-align: right;"><b>Subtotal</b></td>
                                        <td style="text-align: center; border: 1px solid black;">${ccyFormat(sumaEinhell)}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" style="text-align: right;"><b>IVA</b></td>
                                        <td style="text-align: center; border: 1px solid black;">${ccyFormat(sumaIvaEinhell)}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" style="text-align: right;"><b>TOTAL</b></td>
                                        <td style="text-align: center; border: 1px solid black;">${ccyFormat(sumaTotalEinhell)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        ` : ''}

                        <ul>
                        <li style="text-align: justify;"><strong> Los precios Einhell/KWB son precios de lista, por lo que debe aplicarse un descuento del 23%+5%. </strong></li>
                        <li style="text-align: justify;"><strong>Debido a los constantes cambios de precios de las marcas, es posible que haya modificaciones y correcciones en el pedido. </strong></li>
                        <li style="text-align: justify;"><strong>Considerar que pueda haber faltante de stock de algunos productos. Cualquier duda consulte con su vendedor.</strong></li>
                        <li style="text-align: justify;"><b>TENER EN CUENTA que una vez enviado el pedido pasar&aacute; al &aacute;rea de facturaci&oacute;n directamente, por lo que no se podr&aacute;n realizar cambios al mismo.</b></li>
                        <li style="text-align: justify;"><strong> Adem&aacute;s, tenga en cuenta que la aplicaci&oacute;n se encuentra en una etapa de pruebas. </strong><strong>Si encuentra alg&uacute;n error en la misma, por favor informar a <a href="mailto:contacto@distribuidorabrmtools.com">contacto@distribuidorabrmtools.com</a>.</strong></li>
                        </ul>
                    </div>
                    `
            }
            const response = await transporter.sendMail(option)
            // console.log(option);			
            pino.info(`Enviando correo a: ${[...new Set([user.email,emailVendedor,emailUsuarioElegido])].filter(Boolean).join(",")}`)
            // console.log(\n\t\t\t// \t`from: BRMTOOLS - Orden de compra <${userEmail}>,\n\t\t\t// \tto: ${[...new Set([user.email,emailVendedor,emailUsuarioElegido])].filter(Boolean).join(",")}\n\t\t\t// \tbcc: ${adminEmail},${bccEmail},\n\t\t\t// \tsubject: 'Orden creada',`\n\t\t\t// );
            
            return response
        } catch (error) {
            pino.error(`Tuvimos este error enviando la orden por correo: ${error}`)
        }
    }
}

module.exports = new Correo()