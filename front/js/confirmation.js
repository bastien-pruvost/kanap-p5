displayOrderId();

function getOrderId() {
  const currentUrl = new URL(location);
  return currentUrl.searchParams.get('orderid');
}

function displayOrderId() {
  const orderId = getOrderId();
  const container = document.querySelector('#orderId');
  container.textContent = orderId;
}
