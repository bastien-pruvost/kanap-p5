import { getData } from './utils.js';

const productsData = await getData();
let cartData = JSON.parse(localStorage.getItem('cartData'));
displayCart(cartData, productsData);

function createCartItemElement(cartItem) {
  const productData = productsData.find(product => product._id === cartItem.id);
  const cartItemTemplate = document.querySelector('#template-cart-item');
  const cartItemClone = document.importNode(cartItemTemplate.content, true);
  const cartItemQuantity = cartItemClone.querySelector('.itemQuantity');
  const cartItemDeleteButton = cartItemClone.querySelector('.deleteItem');
  // cartItemClone.querySelector('.cart__item__content__description').append(cartItemName, cartItemColor, cartItemPrice);
  cartItemClone.querySelector('img').src = productData.imageUrl;
  cartItemClone.querySelector('img').alt = productData.altTxt;
  cartItemClone.querySelector('.cart-item-name').textContent = productData.name;
  cartItemClone.querySelector('.cart-item-color').textContent = cartItem.color;
  cartItemClone.querySelector('.cart-item-price').textContent = `${productData.price} €`;
  cartItemQuantity.value = cartItem.quantity;
  cartItemQuantity.addEventListener('input', event => updateItemQuantity(cartItem, event.target.value));
  cartItemDeleteButton.addEventListener('click', event => deleteItem(cartItem));
  return cartItemClone;
}

function displayCart() {
  const cartContainer = document.querySelector('#cart__items');
  cartContainer.textContent = '';
  for (const cartItem of cartData) {
    const cartItemElement = createCartItemElement(cartItem);
    cartContainer.appendChild(cartItemElement);
  }
  updateTotal();
}

function updateItemQuantity(cartItem, value) {
  const itemIndex = cartData.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
  cartData[itemIndex].quantity = value;
  updateTotal();
}

function deleteItem(cartItem) {
  const itemIndex = cartData.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
  cartData.splice(itemIndex, 1);
  displayCart();
}

function updateTotal() {
  const totalQuantityContainer = document.querySelector('#totalQuantity');
  const totalPriceContainer = document.querySelector('#totalPrice');

  // totalPrice = cartData.reduce((acc, curr) => acc.)
}
