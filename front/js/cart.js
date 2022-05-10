import { getApiData } from './utils.js';
import { apiUrl } from './config.js';

// Display the Cart and initialize the Order Form
displayCart();
initOrderForm();

// Displays the products present in the cart (retrieved from the localStorage)
async function displayCart() {
  let cartData = JSON.parse(localStorage.getItem('cartData'));
  const container = document.querySelector('#cart__items');
  for (const cartItem of cartData) {
    const cartItemElement = await createCartItemElement(cartItem);
    container.appendChild(cartItemElement);
  }
  updateTotal();
}

/**
 * Create an HTML Element with the informations of the product passed as argument
 * @param { Object } cartItem - Product as an object (comes from the cart in localStorage)
 * @return { HTMLElement } - HTML Element ready to be displayed in the DOM
 */
async function createCartItemElement(cartItem) {
  const productData = await getApiData(cartItem.id);
  const cartItemTemplate = document.querySelector('#template-cart-item');
  const cartItemClone = document.importNode(cartItemTemplate.content, true);
  const cartItemQuantity = cartItemClone.querySelector('.itemQuantity');
  const cartItemDeleteButton = cartItemClone.querySelector('.deleteItem');
  cartItemClone.querySelector('img').src = productData.imageUrl;
  cartItemClone.querySelector('img').alt = productData.altTxt;
  cartItemClone.querySelector('.cart-item-name').textContent = productData.name;
  cartItemClone.querySelector('.cart-item-color').textContent = cartItem.color;
  cartItemClone.querySelector('.cart-item-price').textContent = `${productData.price} €`;
  cartItemQuantity.value = cartItem.quantity;
  cartItemQuantity.addEventListener('input', event => updateItemQuantity(cartItem, event.target.value));
  cartItemDeleteButton.addEventListener('click', event => deleteItem(cartItem, event));
  return cartItemClone;
}

/**
 * Update the quantity of a product in the cart (localStorage) when the user changes the quantity
 * @param { Object } cartItem - Product to update as an object
 * @param { Number } value - Quantity input value
 */
function updateItemQuantity(cartItem, value) {
  let cartData = JSON.parse(localStorage.getItem('cartData'));
  const itemIndex = cartData.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
  cartData[itemIndex].quantity = +value;
  localStorage.setItem('cartData', JSON.stringify(cartData));
  updateTotal();
}

/**
 * Delete an item in the cart (localStorage) and delete it in the DOM
 * @param { Object } cartItem - Product to delete as an object
 * @param { Event } cartItem - Event from the Delete Button Listener
 */
function deleteItem(cartItem, event) {
  let cartData = JSON.parse(localStorage.getItem('cartData'));
  const itemIndex = cartData.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
  event.target.closest('.cart__item').remove();
  cartData.splice(itemIndex, 1);
  localStorage.setItem('cartData', JSON.stringify(cartData));
  updateTotal();
}

// Update Total quantity & Total price on the page (Check the price of products in the API to improve security)
async function updateTotal() {
  let cartData = JSON.parse(localStorage.getItem('cartData'));
  const productsData = await getApiData();
  const totalQuantityContainer = document.querySelector('#totalQuantity');
  const totalPriceContainer = document.querySelector('#totalPrice');
  const totalQuantity = cartData.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = cartData.reduce((acc, curr) => {
    const currentPrice = productsData.find(item => item._id === curr.id).price;
    return acc + curr.quantity * currentPrice;
  }, 0);
  totalQuantityContainer.textContent = totalQuantity;
  totalPriceContainer.textContent = totalPrice;
}

// Initializes the order form
function initOrderForm() {
  const inputs = document.querySelectorAll('.cart__order__form__question > input');
  const form = document.querySelector('.cart__order__form');
  inputsValidation(inputs);
  form.addEventListener('submit', event => {
    event.preventDefault();
    isFormValid(inputs) && sendOrder(formatOrder(form));
  });
}

/**
 * Run the Regex check function each time an input is modified in the form
 * @param { NodeList } inputs - All inputs of the form
 */
function inputsValidation(inputs) {
  inputs.forEach(input => {
    input.addEventListener('change', event => {
      checkRegex(event.target);
    });
  });
}

/**
 * Check the regex and assign an error message according to the input
 * @param { Element } input - Input element
 * @return { Boolean } - Return true if the input value match with the Regex
 */
function checkRegex(input) {
  let regex;
  let message;
  switch (input.id) {
    case 'firstName':
      regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = 'Le nom ne doit contenir que des lettres, des accents ou des tirets';
      break;
    case 'lastName':
      regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = 'Le prénom ne doit contenir que des lettres, des accents ou des tirets';
      break;
    case 'address':
      regex = /^['0-9 A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = "L'adresse contient des caractères spéciaux non autorisés";
      break;
    case 'city':
      regex = /[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = 'La ville ne doit contenir que des lettres, des accents ou des chiffres';
      break;
    case 'email':
      regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      message = "L'email n'est pas au format standard ( exemple@mail.fr ) ";
      break;
  }
  if (input.value.match(regex)) {
    displayError(input, '');
    return true;
  } else {
    displayError(input, message);
    return false;
  }
}

/**
 * Display an error according to the input element and specified message
 * @param { Element } input - Input where to display the error
 * @param { String } message - Error message to display
 */
function displayError(input, message) {
  const errorContainer = input.nextElementSibling;
  errorContainer.textContent = message;
  if (message !== '') {
    input.classList.add('error');
  } else {
    input.classList.remove('error');
  }
}

/**
 * Check that all form inputs are valid
 * @param { NodeList } inputs - All inputs of the form
 * @return { Boolean } - Returns true if all form inputs are valid
 */
function isFormValid(inputs) {
  let valid = true;
  inputs.forEach(input => {
    valid &= checkRegex(input);
  });
  return valid;
}

/**
 * Formats the form data in the correct format for the backend (Object)
 * @param { Element } form - All inputs of the form
 * @return { Object } - Returns an object containing a 'contact' object and a 'products' array
 */
function formatOrder(form) {
  let cartData = JSON.parse(localStorage.getItem('cartData'));
  const formData = new FormData(form);
  const formEntries = formData.entries();
  let contactObject = Object.fromEntries(formEntries);
  let productsArray = [];
  cartData.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      productsArray.push(item.id);
    }
  });
  let order = {};
  order.contact = contactObject;
  order.products = productsArray;
  return order;
}

/**
 * Sends form data and product list to backend, and redirects the user to the confirmation page with the order id in url parameter
 * @param { Object } orderData - All inputs of the form
 */
function sendOrder(orderData) {
  if (orderData.products && orderData.products.length > 0) {
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
  } else {
    alert('Votre panier est vide, impossible de confirmer la commande');
  }
}
