import { getApiData } from './utils.js';

displayProduct();

// Displays the product whose id is in the url. Product information is retrieved from the API
async function displayProduct() {
  const productId = getProductId();
  const productData = await getApiData(productId);
  const container = document.querySelector('.item');
  const productElement = createProductElement(productData);
  container.appendChild(productElement);
}

/**
 * Retrieve the product id present in the url
 * @return { String } - Id of the product
 */
function getProductId() {
  const currentUrl = new URL(location);
  return currentUrl.searchParams.get('id');
}

/**
 * Create an HTML Element with the informations of the product passed as argument
 * @param { Object } product - Product as an object (comes from api)
 * @return { HTMLElement } - HTML Element ready to be displayed in the dom
 */
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

/**
 * Create a product object and add it to the cart (Cart is in the LocalStorage with the key 'cartData')
 * @param { String } id - Id of the product we want to add in cart
 * @param { String } color - Color of the product we want to add in cart
 * @param { Number } quantity - Quantity of the product we want to add in cart
 */
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
