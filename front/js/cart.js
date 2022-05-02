import { getApiData } from './utils.js';
import { apiUrl } from './config.js';

let cartData = JSON.parse(localStorage.getItem('cartData'));

displayCart();
initOrderForm();

async function createCartItemElement(cartItem) {
  // const productData = productsData.find(product => product._id === cartItem.id);
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

async function displayCart() {
  // const productsData = await getApiData();
  const container = document.querySelector('#cart__items');
  for (const cartItem of cartData) {
    const cartItemElement = await createCartItemElement(cartItem);
    container.appendChild(cartItemElement);
  }
  updateTotal();
}

function updateItemQuantity(cartItem, value) {
  const itemIndex = cartData.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
  cartData[itemIndex].quantity = +value;
  localStorage.setItem('cartData', JSON.stringify(cartData));
  updateTotal();
}

function deleteItem(cartItem, event) {
  const itemIndex = cartData.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
  event.target.closest('.cart__item').remove();
  cartData.splice(itemIndex, 1);
  localStorage.setItem('cartData', JSON.stringify(cartData));
  updateTotal();
}

async function updateTotal() {
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

function initOrderForm() {
  const inputs = document.querySelectorAll('.cart__order__form__question > input');
  const form = document.querySelector('.cart__order__form');
  inputsValidation(inputs);
  form.addEventListener('submit', event => {
    event.preventDefault();
    isFormValid(inputs) && sendOrder(formatOrder(form));
  });
}

function inputsValidation(inputs) {
  inputs.forEach(input => {
    input.addEventListener('change', event => {
      checkRegex(event.target);
    });
  });
}

function checkRegex(input) {
  let regex;
  let message;
  switch (input.id) {
    case 'firstName':
      regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = 'Le nom ne doit contenir que des lettres, lettres avec accents ou tirets';
      break;
    case 'lastName':
      regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = 'Le prénom ne doit contenir que des lettres, lettres avec accents ou tirets';
      break;
    case 'address':
      regex = /^['0-9 A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = "L'adresse n'est pas au bon format (pas de caractères spéciaux)";
      break;
    case 'city':
      regex = /[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
      message = "La ville n'est pas au bon format";
      break;
    case 'email':
      regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      message = 'email test';
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

function isFormValid(inputs) {
  let valid = true;
  inputs.forEach(input => {
    valid &= checkRegex(input);
  });
  return valid;
}

function displayError(input, message) {
  const errorContainer = input.nextElementSibling;
  errorContainer.textContent = message;
  if (message !== '') {
    input.classList.add('error');
  } else {
    input.classList.remove('error');
  }
}

function formatOrder(form) {
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
