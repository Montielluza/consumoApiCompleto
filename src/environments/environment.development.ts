export const environment = {
    production: false,
    apiUrl: '/api'

};
// En desarrollo apuntamos a /api: el proxy.conf.json reenvía las peticiones
  // hacia https://sla-api.areasoftccyt.com y evita problemas de CORS.