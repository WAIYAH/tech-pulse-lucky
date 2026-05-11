import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnNavigate = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const targetId = decodeURIComponent(hash.replace("#", ""));
    let attempts = 0;
    const maxAttempts = 8;

    const scrollToHashTarget = () => {
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        requestAnimationFrame(scrollToHashTarget);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    scrollToHashTarget();
  }, [pathname, hash]);

  return null;
};

export default ScrollToTopOnNavigate;
