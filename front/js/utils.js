let apiUrl = 'http://localhost:3000';

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

/**
 * Post the order to backend, and redirects the user to the confirmation page with the order id in url parameter
 * @param { string } [productId] - The id of the product we want to get (optional)
 * @return { Promise } - The response of the API with the data of one product or all the products
 */
function postApiOrder(orderData) {
  const fetchSettings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  };
  fetch(`${apiUrl}/api/products/order`, fetchSettings)
    .then(response => response.json())
    .then(bodyResponse => {
      localStorage.setItem('cartData', JSON.stringify([]));
      window.location.href = `./confirmation.html?orderid=${bodyResponse.orderId}`;
    })
    .catch(error => alert(`Votre commande n'a pas pu aboutir (${error.message})`));
}

export { getApiData, postApiOrder };
