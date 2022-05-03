// Configure the api url depending on whether backend is hosted or local

let apiUrl =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://kanap-backend.pruvostbastien.fr';

export { apiUrl };
