import { getData } from './utils.js';

(async function () {
  const productsData = await getData();
  displayProducts(productsData);
})();

function createProductCardElement(product) {
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
    const productElement = createProductCardElement(product);
    itemsContainer.appendChild(productElement);
  }
}
