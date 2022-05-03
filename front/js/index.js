import { getApiData } from './utils.js';

displayProductCards();

// Displays on the page all the products found in the API
async function displayProductCards() {
  const productsData = await getApiData();
  const container = document.querySelector('#items');
  for (const product of productsData) {
    const productElement = createProductCardElement(product);
    container.appendChild(productElement);
  }
}

/**
 * Create an HTML Element with the informations of the product passed as argument
 * @param { Object } product - Product as an object (comes from api)
 * @return { HTMLElement } - HTML Element ready to be displayed in the dom
 */
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
