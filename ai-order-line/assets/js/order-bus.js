(function () {
  var CHANNEL = 'nm-order-line';
  var STORAGE_KEY = 'nmOrderLine.orders';
  var bc = ('BroadcastChannel' in window) ? new BroadcastChannel(CHANNEL) : null;

  function loadOrders() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveOrders(orders) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch (e) {}
  }

  function pushOrder(order) {
    var orders = loadOrders();
    orders.push(order);
    saveOrders(orders);
    if (bc) bc.postMessage({ type: 'sync' });
    window.dispatchEvent(new CustomEvent('nm-order-local'));
  }

  function updateOrder(id, patch) {
    var orders = loadOrders().map(function (o) {
      return o.id === id ? Object.assign({}, o, patch) : o;
    });
    saveOrders(orders);
    if (bc) bc.postMessage({ type: 'sync' });
    window.dispatchEvent(new CustomEvent('nm-order-local'));
  }

  function clearOrders() {
    saveOrders([]);
    if (bc) bc.postMessage({ type: 'sync' });
    window.dispatchEvent(new CustomEvent('nm-order-local'));
  }

  function onOrders(cb) {
    cb(loadOrders());
    if (bc) bc.onmessage = function () { cb(loadOrders()); };
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) cb(loadOrders());
    });
    window.addEventListener('nm-order-local', function () { cb(loadOrders()); });
  }

  window.NMOrderBus = {
    loadOrders: loadOrders,
    pushOrder: pushOrder,
    updateOrder: updateOrder,
    clearOrders: clearOrders,
    onOrders: onOrders
  };
})();
