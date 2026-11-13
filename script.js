/* Elviti Works site interactions */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      toggle.textContent = isOpen ? '×' : '☰';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        toggle.textContent = '☰';
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        toggle.textContent = '☰';
        toggle.focus();
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const form = document.querySelector('[data-whatsapp-form]');
  const status = document.querySelector('[data-form-status]');

  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const value = (key, fallback = 'Not provided') => {
        const raw = data.get(key);
        return raw && String(raw).trim() ? String(raw).trim() : fallback;
      };

      const message = [
        'Hello Elviti Works, I would like to enquire about a project.',
        '',
        'Name: ' + value('name', ''),
        'Company / organisation: ' + value('company'),
        'Contact number: ' + value('phone', ''),
        'Email: ' + value('email'),
        'Service area: ' + value('service', ''),
        'Project location: ' + value('location'),
        'Timing: ' + value('timing'),
        '',
        'Requirement details:',
        value('details', '')
      ].join('\n');

      const whatsappUrl = 'https://wa.me/27726267179?text=' + encodeURIComponent(message);
      const fallbackLink = document.createElement('a');
      fallbackLink.href = whatsappUrl;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.textContent = 'Open your prepared WhatsApp enquiry';
      status.replaceChildren(
        document.createTextNode('Your enquiry is ready. WhatsApp should open in a new tab. If it does not, '),
        fallbackLink,
        document.createTextNode('. Review the message and press Send in WhatsApp.')
      );

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();