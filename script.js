// Subtle interactive glow for cards.
// Uses CSS variables so the animations and hover states do not fight each other.
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

    const rotateX = (-y * 8).toFixed(2);
    const rotateY = (x * 8).toFixed(2);

    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
    card.style.setProperty("--lift", "-10px");
    card.style.setProperty("--scale", "1.03");
  });

  card.addEventListener("pointerleave", reset);
  reset();
});

// Carousel functionality
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("projects-carousel");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const items = carousel.querySelectorAll(".carousel-item");
  const itemWidth = items[0].offsetWidth + 18;
  let currentPosition = 0;
  const maxPosition = -(itemWidth * (items.length - 4)); // adjust for visible items

  // Initially hide prevBtn
  prevBtn.style.opacity = 0.4;
  prevBtn.disabled = true;

  function updateButtons() {
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition <= maxPosition;

    prevBtn.style.opacity = prevBtn.disabled ? 0.4 : 1;
    nextBtn.style.opacity = nextBtn.disabled ? 0.4 : 1;
  }

  // Next button
  nextBtn.addEventListener("click", function () {
    if (currentPosition > maxPosition + 50) {
      currentPosition -= itemWidth;
      carousel.scrollTo({
        left: Math.abs(currentPosition),
        behavior: "smooth",
      });
      setTimeout(updateButtons, 200); // update buttons after scroll
    }
  });

  // Previous button
  prevBtn.addEventListener("click", function () {
    if (currentPosition < 0) {
      currentPosition += itemWidth;
      carousel.scrollTo({
        left: Math.abs(currentPosition),
        behavior: "smooth",
      });
      setTimeout(updateButtons, 200);
    }
  });

  // Previous button functionality
  prevBtn.addEventListener("click", function () {
    if (currentPosition < 0) {
      currentPosition += itemWidth;
      carousel.scrollTo({
        left: Math.abs(currentPosition),
        behavior: "smooth",
      });
    }
  });

  // Touch/swipe support
  let startX = 0;
  let startY = 0;

  carousel.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  carousel.addEventListener("touchend", function (e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // Horizontal swipe detection
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      if (diffX > 0) {
        // Swipe left - next
        nextBtn.click();
      } else {
        // Swipe right - previous
        prevBtn.click();
      }
    }
  });
});
