/* eslint-disable no-unused-vars */
import React from "react";
import Home from "./Home";

// eslint-disable-next-line react-refresh/only-export-components
export function useAutoDarkDetect() {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme:dark)");
    const handleChange = (event) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return darkMode;
}

const WelcomeBackExtra = () => {
  const [showNext, setShowNext] = React.useState(() => {
    return sessionStorage.getItem("seenwelcome") === "true";
  });
  const [isFaded, setIsFaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const storedName = localStorage.getItem("userName") || "User";
  const CompleteOnboard = localStorage.getItem("CompleteOnboard") === "true";
  const handleClick = () => {
    if (isFaded) return;
    setIsFaded(true);
    setTimeout(() => {
      setShowNext(true);
      sessionStorage.setItem("seenwelcome", "true");
      setIsFaded(false);
    }, 1000);
  };

  React.useEffect(() => {
    const loadingCheck = async () => {
      try {
        const response = await fetch("http://localhost:5173")
        const data = await response.json()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    } //future me pls find a better solution to this. maybe remove it entirely?

    loadingCheck()
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white transition-opacity duration-1000 ease-in-out">
        <p>Loading...</p>
      </div>
    );
  }

  if (CompleteOnboard & !showNext) {
    return (
      <div className="bg-white dark:bg-black">
        <div
          onClick={handleClick}
          className={`fixed inset-0 z-50 flex justify-center items-center bg-gray-100 dark:bg-black dark:text-white cursor-pointer select-none transition-opacity duration-1000 ease-in-out ${
            isFaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <p className="font-mono text-3xl"> Welcome back {storedName} </p>
        </div>
      </div>
    );
  }

  return null;
};

export default WelcomeBackExtra;
