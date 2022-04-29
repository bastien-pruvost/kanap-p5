import { apiUrl } from './config.js';

(async function () {
  const productId = await getProductId();
  const productData = await getProductData(productId);
  displayProduct(productData);
})();

function getProductId() {
  const currentUrl = new URL(location);
  const idSearchParam = currentUrl.searchParams.get('id');
  return idSearchParam;
}

function getProductData(productId) {
  return fetch(`${apiUrl}/api/products/${productId}`)
    .then(response => response.json())
    .catch(error => alert(`Impossible d'accéder au serveur (${error.message})`));
}

function createProductElement(product) {
  const productTemplateElement = document.querySelector('#template-product');
  const productCloneElement = document.importNode(productTemplateElement.content, true);
  const colorsSelect = productCloneElement.querySelector('#colors');
  const quantityInput = productCloneElement.querySelector('#quantity');
  const addToCartButton = productCloneElement.querySelector('#addToCart');
  productCloneElement.querySelector('img').src = product.imageUrl;
  productCloneElement.querySelector('img').alt = product.altTxt;
  productCloneElement.querySelector('#title').textContent = product.name;
  productCloneElement.querySelector('#price').textContent = product.price;
  productCloneElement.querySelector('#description').textContent = product.description;
  product.colors.forEach(color => {
    const optionElement = document.createElement('option');
    optionElement.value = color;
    optionElement.textContent = color;
    colorsSelect.appendChild(optionElement);
  });
  addToCartButton.addEventListener('click', () => {
    addToCart(product._id, quantityInput.value);
  });
  return productCloneElement;
}

function displayProduct(productData) {
  const itemContainer = document.querySelector('.item');
  const productElement = createProductElement(productData);
  console.log(productData);
  itemContainer.appendChild(productElement);
}

function addToCart(id, quantity) {
  return '';
}
