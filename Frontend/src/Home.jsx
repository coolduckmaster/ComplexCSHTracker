import React from "react";
import axios from "axios";
import Onboarding from "./Onboarding";
import { backendUrl } from "./App";
import Dashboard from "./Dashboard";

const Home = ({ setToken }) => {
  const [isFaded, setIsFaded] = React.useState(false);
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [showNext, setShowNext] = React.useState(
    () => sessionStorage.getItem("seenwelcome") === "true",
  );

  const [completeOnboard, setCompleteOnboard] = React.useState(() => {
    return localStorage.getItem("CompleteOnboard") === "true";
  });
  const [isLoading, setIsLoading] = React.useState(() => {
    return localStorage.getItem("CompleteOnboard") === "true" ? false : true;
  });
  const storedName = localStorage.getItem("userName") || "User";

  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    const localstatus = localStorage.getItem("CompleteOnboard");

    if (localstatus === "true") {
      return;
    }

    const checkonboard = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/user/onboarding", {
          userId,
        });
        if (
          response.data.completeOnboard === "true" ||
          response.data.message === "User has already completed."
        ) {
          setCompleteOnboard(true);
          localStorage.setItem("CompleteOnboard", true);
          setIsLoading(false);
        }
        return;
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkonboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white">
        <p>Loading infomation...</p>
      </div>
    );
  }

  const handleClick = () => {
    if (isFaded) return;
    setIsFaded(true);
    setTimeout(() => {
      setShowNext(true);
      sessionStorage.setItem("seenwelcome", true);
      setIsFaded(false);
    }, 1000);
  };

  const handleOnboardCompleted = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setCompleteOnboard(true);
      localStorage.setItem("CompleteOnboard", true);
      setIsFadingOut(false);
    }, 1000);
  };

  if (completeOnboard === true) {
    if (!showNext) {
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

    return <Dashboard setToken={setToken} />;
  }

  return (
    <div className="bg-white dark:bg-black">
      {showNext === false ? (
        <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-black">
          <div
            onClick={handleClick}
            className={`fixed inset-0 z-50 flex justify-center items-center bg-gray-100 dark:bg-black dark:text-white cursor-pointer select-none transition-opacity duration-1000 ease-in-out ${
              isFaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <p className="font-mono text-3xl"> Welcome {storedName} </p>
          </div>
        </div>
      ) : (
        <div
          className={`fixed inset-0 z-50 flex justify-center items-center bg-gray-100 dark:bg-black transition-opacity duration-1000 ease-in-out ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <Onboarding startVisible={true} SetOnboard={handleOnboardCompleted} />
        </div>
      )}
    </div>
  );
};

export default Home;
