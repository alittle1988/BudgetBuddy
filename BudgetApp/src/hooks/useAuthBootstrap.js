// src/hooks/useAuthBootstrap.js
import { useEffect } from "react";

export function useAuthBootstrap(setUser, navigate) {
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUserRaw = sessionStorage.getItem("user");

    if (storedToken && storedUserRaw) {
      try {
        const parsedUser = JSON.parse(storedUserRaw);
        setUser(parsedUser);

        // Ensure session storage is populated
        sessionStorage.setItem("token", storedToken);
        sessionStorage.setItem("user", JSON.stringify(parsedUser));
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    }
  }, [setUser, navigate]);
}
