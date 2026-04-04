const cards = document.querySelectorAll(".jelly-card");

cards.forEach((card) => {
  const reset = () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--lift", "0px");
    card.style.setProperty("--scale", "1");
  };
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    card.style.setProperty("--lift", "-10px");
    card.style.setProperty("--scale", "1.03");
  });
  card.addEventListener("pointerleave", reset);
  reset();
});

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("projects-carousel");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  if (!carousel || !prevBtn || !nextBtn) return;
  
  const items = carousel.querySelectorAll(".carousel-item");
  if (items.length === 0) return;
  
  const itemWidth = items[0].offsetWidth + 18;
  const maxPosition = -(itemWidth * (items.length - 4));
  let currentPosition = 0;

  const updateButtons = () => {
    const atStart = currentPosition >= 0;
    const atEnd = currentPosition <= maxPosition;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
    prevBtn.style.opacity = atStart ? "0.4" : "1";
    nextBtn.style.opacity = atEnd ? "0.4" : "1";
  };

  nextBtn.addEventListener("click", () => {
    if (currentPosition > maxPosition + 50) {
      currentPosition -= itemWidth;
      carousel.scrollTo({ left: Math.abs(currentPosition), behavior: "smooth" });
      setTimeout(updateButtons, 200);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPosition < 0) {
      currentPosition += itemWidth;
      carousel.scrollTo({ left: Math.abs(currentPosition), behavior: "smooth" });
      setTimeout(updateButtons, 200);
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  carousel.addEventListener("touchend", (e) => {
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      diffX > 0 ? nextBtn.click() : prevBtn.click();
    }
  }, { passive: true });
  
  updateButtons();
});
