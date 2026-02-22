// ===================================
// Footer Year
// ===================================
document.getElementById('footer-year').textContent = new Date().getFullYear();

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
