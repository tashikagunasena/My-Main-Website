type CSSCustomProperty = `--${string}`;

const setCSSVar = (element: HTMLElement, property: CSSCustomProperty, value: string): void => {
  element.style.setProperty(property, value);
};

const cards = document.querySelectorAll<HTMLElement>(".jelly-card");

const resetCardTransform = (card: HTMLElement): void => {
  setCSSVar(card, "--rx", "0deg");
  setCSSVar(card, "--ry", "0deg");
  setCSSVar(card, "--lift", "0px");
  setCSSVar(card, "--scale", "1");
};

cards.forEach((card) => {
  card.addEventListener("pointermove", (event: PointerEvent): void => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * 8).toFixed(2);
    const rotateY = (x * 8).toFixed(2);
    setCSSVar(card, "--rx", `${rotateX}deg`);
    setCSSVar(card, "--ry", `${rotateY}deg`);
    setCSSVar(card, "--lift", "-10px");
    setCSSVar(card, "--scale", "1.03");
  });
  card.addEventListener("pointerleave", () => resetCardTransform(card));
  resetCardTransform(card);
});

const CAROUSEL_CONFIG = {
  visibleItems: 4,
  itemGap: 18,
  scrollThreshold: 50,
  swipeThreshold: 30,
  buttonTransitionDelay: 200,
} as const;

document.addEventListener("DOMContentLoaded", (): void => {
  const carousel = document.getElementById("projects-carousel");
  const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement | null;
  const nextBtn = document.getElementById("next-btn") as HTMLButtonElement | null;
  if (!carousel || !prevBtn || !nextBtn) return;
  
  const items = carousel.querySelectorAll(".carousel-item");
  if (items.length === 0) return;
  
  const itemWidth = (items[0] as HTMLElement).offsetWidth + CAROUSEL_CONFIG.itemGap;
  const maxPosition = -(itemWidth * (items.length - CAROUSEL_CONFIG.visibleItems));
  let currentPosition = 0;

  const updateButtonStates = (): void => {
    const atStart = currentPosition >= 0;
    const atEnd = currentPosition <= maxPosition;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
    prevBtn.style.opacity = atStart ? "0.4" : "1";
    nextBtn.style.opacity = atEnd ? "0.4" : "1";
  };

  const scrollToNext = (): void => {
    if (currentPosition > maxPosition + CAROUSEL_CONFIG.scrollThreshold) {
      currentPosition -= itemWidth;
      carousel.scrollTo({ left: Math.abs(currentPosition), behavior: "smooth" });
      setTimeout(updateButtonStates, CAROUSEL_CONFIG.buttonTransitionDelay);
    }
  };

  const scrollToPrev = (): void => {
    if (currentPosition < 0) {
      currentPosition += itemWidth;
      carousel.scrollTo({ left: Math.abs(currentPosition), behavior: "smooth" });
      setTimeout(updateButtonStates, CAROUSEL_CONFIG.buttonTransitionDelay);
    }
  };

  updateButtonStates();
  nextBtn.addEventListener("click", scrollToNext);
  prevBtn.addEventListener("click", scrollToPrev);

  let touchStartX = 0;
  let touchStartY = 0;
  carousel.addEventListener("touchstart", (event: TouchEvent): void => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });
  
  carousel.addEventListener("touchend", (event: TouchEvent): void => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    const isSignificantSwipe = Math.abs(diffX) > CAROUSEL_CONFIG.swipeThreshold;
    if (isHorizontalSwipe && isSignificantSwipe) {
      diffX > 0 ? scrollToNext() : scrollToPrev();
    }
  }, { passive: true });
});
