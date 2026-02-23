// ===================================
// Footer Year
// ===================================
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ===================================
// Auto-open all sections on load
// ===================================
['section-work', 'section-projects', 'section-about'].forEach(id => {
  const section = document.getElementById(id);
  if (!section) return;
  const header = section.querySelector('.acc-header');
  const body = section.querySelector('.acc-body');
  if (header && body) {
    header.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
  }
});

// ===================================
// Section Accordions
// ===================================
document.querySelectorAll('.acc-header').forEach(header => {
  header.addEventListener('click', () => {
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    const bodyId = header.getAttribute('aria-controls');
    const body = document.getElementById(bodyId);

    header.setAttribute('aria-expanded', String(!isOpen));
    body.classList.toggle('open', !isOpen);
  });
});

// ===================================
// Role / Project Inner Accordions
// ===================================
document.querySelectorAll('.role-header').forEach(header => {
  header.addEventListener('click', () => {
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    const detailId = header.getAttribute('aria-controls');
    const detail = document.getElementById(detailId);

    header.setAttribute('aria-expanded', String(!isOpen));
    detail.classList.toggle('open', !isOpen);
  });
});
