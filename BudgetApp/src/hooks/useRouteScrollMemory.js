// src/hooks/useRouteScrollMemory.js
import { useEffect } from "react";

export function useRouteScrollMemory(location) {
  useEffect(() => {
    const routeKey = `scrollPosition:${location.pathname}${location.search}`;
    const pos = localStorage.getItem(routeKey);
    requestAnimationFrame(() => {
      window.scrollTo(0, pos ? Number(pos) : 0);
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    const routeKey = `scrollPosition:${location.pathname}${location.search}`;

    function handleScroll() {
      localStorage.setItem(routeKey, window.scrollY.toString());
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, location.search]);
}
