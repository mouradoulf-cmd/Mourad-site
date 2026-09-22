(function () {
  var rail = document.getElementById('ticketRail');

  function money(n) { return '฿' + n; }

  function timeLabel(iso) {
    var d = new Date(iso);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function render(orders) {
    rail.innerHTML = '';
    var active = orders.slice().reverse();
    if (!active.length) {
      rail.innerHTML =
        '<div class="ticket-empty"><div class="pulse-dot"></div>En attente de commandes…<br>' +
        'Passe un appel depuis l\'écran "Appel" pour voir une commande apparaître ici.</div>';
      return;
    }
    active.forEach(function (order) {
      var el = document.createElement('div');
      el.className = 'ticket' + (order.status === 'done' ? ' done' : '');
      var itemsHtml = order.items.map(function (it) {
        return '<li><span><span class="qty">' + it.qty + '×</span>' + it.name + '</span><span>' + money(it.price * it.qty) + '</span></li>';
      }).join('');
      el.innerHTML =
        '<div class="ticket-top"><span class="ticket-num">Commande #' + order.number + '</span>' +
        '<span class="ticket-time">' + timeLabel(order.createdAt) + '</span></div>' +
        '<ul class="ticket-items">' + itemsHtml + '</ul>' +
        '<div class="ticket-total"><span>Total</span><span>' + money(order.total) + '</span></div>' +
        '<button class="btn ' + (order.status === 'done' ? 'btn-ghost' : 'btn-primary') + '" data-id="' + order.id + '">' +
        (order.status === 'done' ? 'Terminée' : 'Marquer prête') + '</button>';
      rail.appendChild(el);
    });

    rail.querySelectorAll('button[data-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.NMOrderBus.updateOrder(btn.getAttribute('data-id'), { status: 'done' });
      });
    });
  }

  window.NMOrderBus.onOrders(render);
})();
