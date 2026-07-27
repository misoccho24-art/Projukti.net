/*
  Loads saved content from Firestore and applies it over the page's
  built-in default text. If Firestore has no value for a field yet
  (or the request fails / the visitor is offline), the original
  hard-coded text already in the HTML stays exactly as-is — so the
  site always looks right, even before the client edits anything.
*/
(function () {
  function applyValue(el, value) {
    if (el.hasAttribute('data-edit-html')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }

    // If this field lives inside a "tap to call" link, keep the
    // phone link working by updating its href to match the new number.
    if (el.hasAttribute('data-edit-tel')) {
      var link = el.closest('a[href^="tel:"]');
      if (link) {
        var digits = value.replace(/[^0-9+]/g, '');
        if (digits) link.setAttribute('href', 'tel:' + digits);
      }
    }
  }

  function init() {
    if (typeof CONTENT_DOC === 'undefined') return;

    CONTENT_DOC.get().then(function (doc) {
      if (!doc.exists) return;
      var data = doc.data() || {};

      document.querySelectorAll('[data-edit-id]').forEach(function (el) {
        var id = el.getAttribute('data-edit-id');
        if (Object.prototype.hasOwnProperty.call(data, id) && data[id] !== undefined && data[id] !== null) {
          applyValue(el, data[id]);
        }
      });
    }).catch(function (err) {
      // Fails silently — visitors just see the default hard-coded text.
      console.warn('Could not load site content from Firestore:', err.message);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
