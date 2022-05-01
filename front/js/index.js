import { getApiData } from './utils.js';

displayProductCards();

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

async function displayProductCards() {
  const productsData = await getApiData();
  const container = document.querySelector('#items');
  for (const product of productsData) {
    const productElement = createProductCardElement(product);
    container.appendChild(productElement);
  }
}
