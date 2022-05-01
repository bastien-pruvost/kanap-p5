import { getApiData } from './utils.js';
import { apiUrl } from './config.js';

let productsData;
let cartData = JSON.parse(localStorage.getItem('cartData'));

displayCart();
initOrderForm();

async function createCartItemElement(cartItem) {
  const productData = productsData.find(product => product._id === cartItem.id);
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
  productsData = await getApiData();
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

function updateTotal() {
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
  const form = document.querySelector('.cart__order__form');
  const inputs = document.querySelectorAll('.cart__order__form__question>input');
  form.addEventListener('submit', event => {
    event.preventDefault();
    isFormValid(inputs) && sendOrder(formatedOrder(form));
  });
}

function isFormValid(inputs) {
  let isValid = true;
  inputs.forEach(input => (isValid &= input.reportValidity()));
  return isValid;
}

function formatedOrder(form) {
  const formData = new FormData(form);
  const formEntries = formData.entries();
  let contactObject = Object.fromEntries(formEntries);
  let productsArray = [];
  cartData.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      productsArray.push(item.id);
    }
  });
  order.contact = contactObject;
  order.products = productsArray;
  return order;
}

function sendOrder(orderData) {
  const fetchSettings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  };
  fetch(`${apiUrl}/api/products/order`, fetchSettings)
    .then(response => response.json())
    .then(bodyResponse => {
      window.location.href = `./confirmation.html?orderid=${bodyResponse.orderId}`;
    });
}
