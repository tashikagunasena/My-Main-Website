// ============================================================================
// Interactive Glow Effect for Cards
// Uses CSS variables so animations and hover states don't conflict
// ============================================================================

type CSSCustomProperty = `--${string}`;

/**
 * Safely set a CSS custom property on an element
 */
const setCSSVar = (
  element: HTMLElement,
  property: CSSCustomProperty,
  value: string,
): void => {
  element.style.setProperty(property, value);
};

const cards = document.querySelectorAll<HTMLElement>(".jelly-card");

/**
 * Reset card transform CSS variables to default state
 */
const resetCardTransform = (card: HTMLElement): void => {
  setCSSVar(card, "--rx", "0deg");
  setCSSVar(card, "--ry", "0deg");
  setCSSVar(card, "--lift", "0px");
  setCSSVar(card, "--scale", "1");
};

cards.forEach((card: HTMLElement) => {
  card.addEventListener("pointermove", (event: PointerEvent): void => {
    const rect = card.getBoundingClientRect();

    // Normalize pointer position to range [-0.5, 0.5]
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    // Calculate rotation values (max ±8deg)
    const rotateX = (-y * 8).toFixed(2);
    const rotateY = (x * 8).toFixed(2);

    // Apply interactive styles
    setCSSVar(card, "--rx", `${rotateX}deg`);
    setCSSVar(card, "--ry", `${rotateY}deg`);
    setCSSVar(card, "--lift", "-10px");
    setCSSVar(card, "--scale", "1.03");
  });

  card.addEventListener("pointerleave", () => resetCardTransform(card));
  resetCardTransform(card); // Initialize state
});

// ============================================================================
// Carousel Functionality
// ============================================================================

interface CarouselConfig {
  visibleItems: number;
  itemGap: number;
  scrollThreshold: number;
  swipeThreshold: number;
  buttonTransitionDelay: number;
}

const CAROUSEL_CONFIG: Readonly<CarouselConfig> = {
  visibleItems: 4,
  itemGap: 18,
  scrollThreshold: 50,
  swipeThreshold: 30,
  buttonTransitionDelay: 200,
} as const;

document.addEventListener("DOMContentLoaded", (): void => {
  // DOM Elements with type assertions and null checks
  const carousel = document.getElementById("projects-carousel");
  const prevBtn = document.getElementById(
    "prev-btn",
  ) as HTMLButtonElement | null;
  const nextBtn = document.getElementById(
    "next-btn",
  ) as HTMLButtonElement | null;

  // Guard clause: ensure required elements exist
  if (!carousel || !prevBtn || !nextBtn) {
    console.warn("Carousel components not found in DOM");
    return;
  }

  const items = carousel.querySelectorAll<HTMLElement>(".carousel-item");
  if (items.length === 0) return;

  // Carousel state
  const itemWidth = items[0].offsetWidth + CAROUSEL_CONFIG.itemGap;
  const maxPosition = -(
    itemWidth *
    (items.length - CAROUSEL_CONFIG.visibleItems)
  );
  let currentPosition = 0;

  /**
   * Update navigation button states based on carousel position
   */
  const updateButtonStates = (): void => {
    const atStart = currentPosition >= 0;
    const atEnd = currentPosition <= maxPosition;

    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;

    prevBtn.style.opacity = atStart ? "0.4" : "1";
    nextBtn.style.opacity = atEnd ? "0.4" : "1";
  };

  /**
   * Scroll carousel to the next set of items
   */
  const scrollToNext = (): void => {
    if (currentPosition > maxPosition + CAROUSEL_CONFIG.scrollThreshold) {
      currentPosition -= itemWidth;
      carousel.scrollTo({
        left: Math.abs(currentPosition),
        behavior: "smooth",
      });
      setTimeout(updateButtonStates, CAROUSEL_CONFIG.buttonTransitionDelay);
    }
  };

  /**
   * Scroll carousel to the previous set of items
   */
  const scrollToPrev = (): void => {
    if (currentPosition < 0) {
      currentPosition += itemWidth;
      carousel.scrollTo({
        left: Math.abs(currentPosition),
        behavior: "smooth",
      });
      setTimeout(updateButtonStates, CAROUSEL_CONFIG.buttonTransitionDelay);
    }
  };

  // Initialize button states
  updateButtonStates();

  // Event listeners for navigation buttons
  nextBtn.addEventListener("click", scrollToNext);
  prevBtn.addEventListener("click", scrollToPrev);

  // ============================================================================
  // Touch/Swipe Support
  // ============================================================================

  let touchStartX = 0;
  let touchStartY = 0;

  carousel.addEventListener(
    "touchstart",
    (event: TouchEvent): void => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true },
  );

  carousel.addEventListener(
    "touchend",
    (event: TouchEvent): void => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Detect horizontal swipe (more horizontal than vertical movement)
      const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
      const isSignificantSwipe =
        Math.abs(diffX) > CAROUSEL_CONFIG.swipeThreshold;

      if (isHorizontalSwipe && isSignificantSwipe) {
        if (diffX > 0) {
          scrollToNext(); // Swipe left → next
        } else {
          scrollToPrev(); // Swipe right → previous
        }
      }
    },
    { passive: true },
  );
});
