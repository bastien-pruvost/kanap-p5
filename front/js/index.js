import { apiUrl } from './config.js';

(async function () {
  const productsData = await getProductsData();
  displayProducts(productsData);
})();

function getProductsData() {
  return fetch(`${apiUrl}/api/products`)
    .then(response => response.json())
    .catch(error => alert(`Impossible d'accéder au serveur (${error.message})`));
}

function createProductElement(product) {
  const productTemplate = document.querySelector('#template-product');
  const productClone = document.importNode(productTemplate.content, true);
  productClone.querySelector('a').href = `./product.html?id=${product._id}`;
  productClone.querySelector('img').src = product.imageUrl;
  productClone.querySelector('img').alt = product.altTxt;
  productClone.querySelector('.productName').textContent = product.name;
  productClone.querySelector('.productDescription').textContent = product.description;
  return productClone;
}

function displayProducts(productsData) {
  const itemsContainer = document.querySelector('#items');
  for (const product of productsData) {
    const productElement = createProductElement(product);
    itemsContainer.appendChild(productElement);
  }
}
