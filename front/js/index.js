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
  const productTemplateElement = document.querySelector('#template-product');
  const productCloneElement = document.importNode(productTemplateElement.content, true);
  productCloneElement.querySelector('a').href = `./product.html?id=${product._id}`;
  productCloneElement.querySelector('img').src = product.imageUrl;
  productCloneElement.querySelector('img').alt = product.altTxt;
  productCloneElement.querySelector('.productName').textContent = product.name;
  productCloneElement.querySelector('.productDescription').textContent = product.description;
  return productCloneElement;
}

function displayProducts(productsData) {
  const itemsContainer = document.querySelector('#items');
  for (const product of productsData) {
    const productElement = createProductElement(product);
    itemsContainer.appendChild(productElement);
  }
}
