displayOrderId();

// Retrieve the order id in url parameters
function getOrderId() {
  const currentUrl = new URL(location);
  return currentUrl.searchParams.get('orderid');
}

// Displays the order id in the DOM
function displayOrderId() {
  const orderId = getOrderId();
  const container = document.querySelector('#orderId');
  container.textContent = orderId;
}
