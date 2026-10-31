import React from "react";
import { api, publicApi } from "./api";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const loggedIncheck = async ({ token, userId, name, avatarUrl, grade }) => {
  localStorage.clear();
  sessionStorage.clear();
  //backup cleansing

  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("userName", name);
  if (avatarUrl) localStorage.setItem("userAvatar", avatarUrl);
  localStorage.setItem("userGrade", grade);
  try {
    const { data } = await api.post(
      "extracheck",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (data.adtoken) {
      localStorage.setItem("adtoken", data.adtoken);
    } else if (data.trtoken) {
      localStorage.setItem("trtoken", data.trtoken);
    }
  } catch (error) {
    console.error(error);
  }

  window.location.replace("/");
};

const Login = () => {
  const [currentState, setCurrentState] = React.useState("Login");
  const [name, setName] = React.useState("");
  const [NLemail, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [iamsubmit, setIamsubmit] = React.useState(false);

  const formHandler = async (event) => {
    event.preventDefault();
    if (iamsubmit) return;
    setIamsubmit(true);
    try {
      const email = NLemail.toLowerCase();
      if (currentState === "Sign Up") {
        const response = await publicApi.post("register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          toast.success("Account created successfully!");
          await loggedIncheck({
            token: response.data.token,
            userId: response.data.userId,
            name: response.data.fetchname,
            grade: response.data.grade,
          });
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
        const response = await publicApi.post("login", { email, password });
        if (response.data.success) {
          toast.success("Logged in successfully!");
          await loggedIncheck({
            token: response.data.token,
            userId: response.data.userId,
            name: response.data.fetchname,
            grade: response.data.grade,
          });
        } else {
          toast.error("Invalid email or password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error(error.message);
    } finally {
      setIamsubmit(false);
    }
  };

  const handleGoogleAuth = async (credentials) => {
    try {
      const response = await publicApi.post("oauthlogin", {
        OAuthtoken: credentials.credential,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        toast.success("Google Sign-In successful!");
        await loggedIncheck({
          token,
          userId: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          grade: response.data.grade,
        });
      } else {
        toast.error(response.data.message || "Google authentication failed.");
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
          <div></div>
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
        <button
          disabled={iamsubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
