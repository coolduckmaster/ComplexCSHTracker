import React from "react";
import axios from "axios";
import { backendUrl } from "./App";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setToken, setAdToken, setTrToken }) => {
  const [currentState, setCurrentState] = React.useState("Login");
  const [name, setName] = React.useState("");
  const [NLemail, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const formHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const email = NLemail.toLowerCase();
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          toast.success("Account created successfully!");
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("userName", response.data.fetchname);
          window.location.reload();
        } else if (response.data.message === "User already exists") {
          toast.error("User already exists. Please login instead.");
        } else if (response.data.message === "Invalid email") {
          toast.error("Invalid email. Please enter a valid email address.");
        } else if (
          response.data.message ===
          "Password must be at least 8 characters long"
        ) {
          toast.error("Password must be at least 8 characters long.");
        } else {
          toast.error(
            "An error occurred during registration. Please try again.",
          );
        }
      } else {
        const email = NLemail.toLowerCase();
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("userName", response.data.fetchname);
          const userId = response.data.userId;

          try {
            const response = await axios.post(
              backendUrl + "/api/user/extracheck",
              { userId },
            );
            if (response.data.adtoken) {
              setAdToken(response.data.adtoken);
            } else if (response.data.trtoken) {
              setTrToken(response.data.trtoken);
            }

            if (response.data.message) {
              toast.success(response.data.message);
            }
            window.location.reload();
          } catch (error) {
            console.error(error);
          }
          setToken(response.data.token);
          toast.success("Logged in successfully!");
        } else if (response.data.message === "User does not exist") {
          toast.error("User does not exist. Please sign up first.");
        } else {
          toast.error("Invalid email or password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error(error.message);
    }
  };

  const handleGoogleAuth = async (credentials) => {
    try {
      const response = await axios.post(backendUrl + "/api/user/oauthlogin", {
        OAuthtoken: credentials.credential,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        if (user.avatarUrl) {
          localStorage.setItem("userAvatar", user.avatarUrl);
        }
        try {
          const extraCheck = await axios.post(
            backendUrl + "/api/user/extracheck",
            { userId: user.id },
          );
          if (extraCheck.data.adtoken) {
            setAdToken(extraCheck.data.adtoken);
          } else if (extraCheck.data.trtoken) {
            setTrToken(extraCheck.data.trtoken);
          }
        } catch (error) {
          console.log(error);
        }

        setToken(token)
        toast.success("Google Sign-In successful!");
        window.location.replace("/")
      } else {
        toast.error(response.data.message || "Google authentication failed.")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black dark:text-white">
      <p className="text-4xl font-mono">Complex CSH Tracker</p>
      <form
        onSubmit={formHandler}
        className="w-full max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg space-y-6 dark:bg-mist-950 dark:text-white"
      >
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800 dark:text-white">
            {currentState}
          </p>
        </div>
        {currentState === "Login" ? null : (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nickname/Name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={NLemail}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-full flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleAuth}
              onError={() => toast.error("Google Sign-In failed")}
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
            />
          </div>
        </div>
        <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
          <p className="cursor-pointer hover:underline">Forgot password</p>
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer hover:underline"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:underline"
            >
              Already have an account? Login
            </p>
          )}
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
