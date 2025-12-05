import { useEffect, useState } from "react";

export default function useStateless() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("jwt");

    if (saved) {
      setToken(saved); 
    }
  }, []);

  return { token };
}
