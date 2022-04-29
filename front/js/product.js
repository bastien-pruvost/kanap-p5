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
  const productTemplate = document.querySelector('#template-product');
  const productClone = document.importNode(productTemplate.content, true);
  const colorSelect = productClone.querySelector('#colors');
  const quantityInput = productClone.querySelector('#quantity');
  const addToCartButton = productClone.querySelector('#addToCart');
  productClone.querySelector('img').src = product.imageUrl;
  productClone.querySelector('img').alt = product.altTxt;
  productClone.querySelector('#title').textContent = product.name;
  productClone.querySelector('#price').textContent = product.price;
  productClone.querySelector('#description').textContent = product.description;
  product.colors.forEach(color => {
    const optionElement = document.createElement('option');
    optionElement.value = color;
    optionElement.textContent = color;
    colorSelect.appendChild(optionElement);
  });
  addToCartButton.addEventListener('click', () => {
    addToCart(product._id, colorSelect.value, +quantityInput.value);
  });
  return productClone;
}

function displayProduct(productData) {
  const itemContainer = document.querySelector('.item');
  const productElement = createProductElement(productData);
  itemContainer.appendChild(productElement);
}

function addToCart(id, color, quantity) {
  const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
  const product = { id, color, quantity };
  const productAlreadyInCart = cartData.findIndex(product => product.id === id && product.color === color);
  if (quantity > 0 && quantity <= 100) {
    productAlreadyInCart === -1 ? cartData.push(product) : (cartData[productAlreadyInCart].quantity += quantity);
  } else {
    alert('La quantité de produit à ajouter au panier doit se trouver entre 1 et 100');
  }
  localStorage.setItem('cartData', JSON.stringify(cartData));
}
