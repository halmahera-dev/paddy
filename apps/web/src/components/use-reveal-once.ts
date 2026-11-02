import { useEffect } from "react";

// Visible by default. Only an element below the fold is hidden, so nothing flashes on load.
export function useRevealOnce(ref: React.RefObject<HTMLElement | null>) {
  useEffect(
    function revealOnceWhenSeen() {
      const element = ref.current;
      if (!element || element.dataset.reveal === "shown") return;
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;

      element.dataset.reveal = "pending";
      const observer = new IntersectionObserver(
        function showElement([entry]) {
          if (!entry.isIntersecting) return;
          element.dataset.reveal = "shown";
          observer.disconnect();
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(element);
      return function stopObserving() {
        observer.disconnect();
      };
    },
    [ref],
  );
}
