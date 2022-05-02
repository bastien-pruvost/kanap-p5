import { apiUrl } from './config.js';

/**
 * Get all products data or a single product data if an id is specified
 * @param { string } [productId] - The id of the product we want to get (optional)
 * @return { Promise } - The response of the API with the data of one product or all the products
 */
function getApiData(productId) {
  const fetchRequest = productId ? `${apiUrl}/api/products/${productId}` : `${apiUrl}/api/products`;
  return fetch(fetchRequest)
    .then(response => response.json())
    .catch(error => alert(`Impossible d'accéder au serveur (${error.message})`));
}

export { getApiData };
