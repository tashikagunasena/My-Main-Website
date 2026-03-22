// Subtle interactive glow for cards.
// Uses CSS variables so the animations and hover states do not fight each other.
const cards = document.querySelectorAll('.jelly-card');

cards.forEach((card) => {
  const reset = () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--lift', '0px');
    card.style.setProperty('--scale', '1');
  };

  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const rotateX = (-y * 8).toFixed(2);
    const rotateY = (x * 8).toFixed(2);

    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
    card.style.setProperty('--lift', '-10px');
    card.style.setProperty('--scale', '1.03');
  });

  card.addEventListener('pointerleave', reset);
  reset();
});
