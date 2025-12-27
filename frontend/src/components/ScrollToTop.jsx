import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // optional: adds a nice smooth scroll
    });
  }, [pathname]); // runs every time the route changes

  return null;
};

export default ScrollToTop;