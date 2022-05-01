import { apiUrl } from './config.js';

function getApiData(productId) {
  const fetchRequest = productId ? `${apiUrl}/api/products/${productId}` : `${apiUrl}/api/products`;
  return fetch(fetchRequest)
    .then(response => response.json())
    .catch(error => alert(`Impossible d'accéder au serveur (${error.message})`));
}

export { getApiData };
