# Documentación de Implementación Backend: Catálogo Público y Configuración de Precios

Este documento detalla los cambios backend realizados en `express-ecommerce` para dar soporte al catálogo público y la configuración administrable de precios.

---

## Cambios Aplicados en `express-ecommerce`
- **Rama**: `feature/catalogo-publico-precios`
- **Esquema de Configuración MongoDB**:
  - `schema/configuracion.js`: Módulo Mongoose para almacenar configuraciones clave-valor globales.
- **Servicios y Controladores de Configuración**:
  - `components/configuracion/index.js`
  - `components/configuracion/controllers/configuracionController.js`
  - `components/configuracion/services/configuracionService.js`
  - Endpoint `GET /api/config/public-prices` (acceso público): Retorna `{ mostrarPreciosPublicos: boolean }` (default `false`).
  - Endpoint `POST /PUT /api/config/public-prices` (protegido por `Autenticacion.administrador`): Guarda cambios realizados desde el panel de administración.
- **Acceso Público a Endpoints GET**:
  - Desprotegidos con `Autenticacion.usuario`:
    - `components/pruducts/index.js` (productos)
    - `components/categorias/index.js` (categorías)
    - `components/search/index.js` (búsqueda)
    - `components/ofertas/index.js` (ofertas)
    - `components/novedades/index.js` (novedades)
    - `components/promo/index.js` (promociones)
  - `components/permisos/controllers/permisosController.js`: `GET /permisos/nivel` retorna `false` cuando no hay token activo en lugar de un error HTTP `401 Unauthorized`.
