(function () {
  var cart = [];
  var orderCounter = 100;
  var recognition = null;
  var isListening = false;
  var callActive = false;

  var micBtn = document.getElementById('micBtn');
  var micHint = document.getElementById('micHint');
  var callStatus = document.getElementById('callStatus');
  var transcriptBox = document.getElementById('transcriptBox');
  var cartList = document.getElementById('cartList');
  var cartTotalEl = document.getElementById('cartTotal');
  var finalizeBtn = document.getElementById('finalizeBtn');
  var resetBtn = document.getElementById('resetBtn');
  var menuGrid = document.getElementById('menuGrid');
  var textInput = document.getElementById('textInput');
  var textSendBtn = document.getElementById('textSendBtn');

  var SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  var speechSupported = !!SpeechRecognitionCtor && 'speechSynthesis' in window;

  function money(n) { return '฿' + n; }

  function renderMenu() {
    window.MENU.forEach(function (item) {
      var btn = document.createElement('button');
      btn.className = 'menu-item';
      btn.type = 'button';
      btn.innerHTML =
        '<span class="icon">' + item.icon + '</span>' +
        '<span><span class="name">' + item.name + '</span><br><span class="price">' + money(item.price) + '</span></span>';
      btn.addEventListener('click', function () {
        addToCart(item.id, 1);
        renderCart();
      });
      menuGrid.appendChild(btn);
    });
  }

  function addToCart(id, qty) {
    var menuItem = window.MENU.find(function (m) { return m.id === id; });
    if (!menuItem) return;
    var existing = cart.find(function (c) { return c.id === id; });
    if (existing) existing.qty += qty;
    else cart.push({ id: id, name: menuItem.name, price: menuItem.price, qty: qty });
  }

  function cartTotal() {
    return cart.reduce(function (sum, c) { return sum + c.price * c.qty; }, 0);
  }

  function renderCart() {
    cartList.innerHTML = '';
    if (!cart.length) {
      cartList.innerHTML = '<li class="cart-empty">Aucun article pour l\'instant.</li>';
    } else {
      cart.forEach(function (c) {
        var li = document.createElement('li');
        li.className = 'cart-row';
        li.innerHTML =
          '<span><span class="qty">' + c.qty + '×</span>' + c.name + '</span>' +
          '<span>' + money(c.price * c.qty) + '</span>';
        cartList.appendChild(li);
      });
    }
    cartTotalEl.textContent = money(cartTotal());
    finalizeBtn.disabled = cart.length === 0;
  }

  function setTranscript(you, ai) {
    var html = '';
    html += you
      ? '<div class="transcript-you">🗣️ ' + you + '</div>'
      : '<div class="transcript-placeholder">Appuyez sur le micro et parlez, ou tapez votre commande ci-dessous.</div>';
    if (ai) html += '<div class="transcript-ai">🤖 ' + ai + '</div>';
    transcriptBox.innerHTML = html;
  }

  function speak(text, onEnd) {
    if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.rate = 1;
    utter.onend = function () { if (onEnd) onEnd(); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function startCall() {
    callActive = true;
    cart = [];
    renderCart();
    callStatus.textContent = 'Appel en cours';
    callStatus.classList.add('live');
    setTranscript(null, null);
    speak('Bonjour, ' + window.NM_RESTAURANT_NAME + ', je vous écoute.', function () {
      setTranscript(null, 'Bonjour, ' + window.NM_RESTAURANT_NAME + ', je vous écoute.');
      if (speechSupported) listenOnce();
    });
  }

  function listenOnce() {
    if (!speechSupported || !callActive) return;
    recognition = new SpeechRecognitionCtor();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      isListening = true;
      micBtn.classList.add('listening');
    };
    recognition.onerror = function () {
      isListening = false;
      micBtn.classList.remove('listening');
    };
    recognition.onend = function () {
      isListening = false;
      micBtn.classList.remove('listening');
    };
    recognition.onresult = function (e) {
      var text = e.results[0][0].transcript;
      handleUtterance(text);
    };
    recognition.start();
  }

  function handleUtterance(text) {
    if (window.NMOrderNLU.isStop(text)) {
      setTranscript(text, null);
      finalizeOrder();
      return;
    }
    var found = window.NMOrderNLU.parseOrder(text);
    if (!found.length) {
      var reply = 'Désolé, je n\'ai pas compris. Vous pouvez répéter ou taper votre commande.';
      setTranscript(text, reply);
      speak(reply, function () { if (callActive) listenOnce(); });
      return;
    }
    found.forEach(function (f) { addToCart(f.id, f.qty); });
    renderCart();
    var summary = found.map(function (f) { return f.qty + ' ' + f.name; }).join(', ');
    var reply = 'Noté : ' + summary + '. Autre chose ?';
    setTranscript(text, reply);
    speak(reply, function () { if (callActive) listenOnce(); });
  }

  function finalizeOrder() {
    callActive = false;
    callStatus.textContent = 'Appel terminé';
    callStatus.classList.remove('live');
    if (!cart.length) {
      var reply = 'Pas de souci, rappelez quand vous voulez !';
      setTranscript(null, reply);
      speak(reply);
      return;
    }
    orderCounter += 1;
    var total = cartTotal();
    var order = {
      id: 'order-' + Date.now(),
      number: orderCounter,
      restaurant: window.NM_RESTAURANT_NAME,
      items: cart.map(function (c) { return { name: c.name, qty: c.qty, price: c.price }; }),
      total: total,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    window.NMOrderBus.pushOrder(order);
    var reply = 'Parfait, commande n°' + orderCounter + ', total ' + money(total) + '. Ce sera prêt dans dix minutes, merci !';
    setTranscript(null, reply);
    speak(reply);
    cart = [];
    renderCart();
  }

  micBtn.addEventListener('click', function () {
    if (!speechSupported) return;
    if (!callActive) { startCall(); return; }
    if (isListening && recognition) { recognition.stop(); return; }
    listenOnce();
  });

  finalizeBtn.addEventListener('click', function () {
    if (!cart.length) return;
    finalizeOrder();
  });

  resetBtn.addEventListener('click', function () {
    cart = [];
    callActive = false;
    callStatus.textContent = 'En attente';
    callStatus.classList.remove('live');
    setTranscript(null, null);
    renderCart();
  });

  textSendBtn.addEventListener('click', function () {
    var text = textInput.value.trim();
    if (!text) return;
    textInput.value = '';
    if (!callActive) { callActive = true; callStatus.textContent = 'Appel en cours'; callStatus.classList.add('live'); }
    handleUtterance(text);
  });
  textInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') textSendBtn.click();
  });

  if (!speechSupported) {
    micBtn.disabled = true;
    micHint.textContent = '';
    document.getElementById('micUnsupported').style.display = 'block';
  }

  renderMenu();
  renderCart();
  setTranscript(null, null);
})();
