/* eslint-disable react-refresh/only-export-components */
import React from "react";
import Login from "./Login";
import Home from "./Home";
import Admin from "./Admin";
import CSHRequest from "./CSHRequest";
import CSHPanel from "./CSHPanel";
import Notfound from "./404";
import DashboardSide from "./DashboardSide";
import CSHHistory from "./CSHHistory";
import { useAutoDarkDetect } from "./misc";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router";

export const backendUrl = "http://localhost:4000";
export const backendUrltest = import.meta.env.VITE_BACKEND_URL || "";
export const Placeholder =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const ProtectedLink = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const VeryProtectedLink = () => {
  const token = localStorage.getItem("token");
  const adtoken = localStorage.getItem("adtoken");
  if (!token) return <Navigate to="/login" replace />;
  if (!adtoken) return <Navigate to="/" replace />;
  return <Outlet context={{}} />;
};

const StaffProtectedLink = () => {
  const token = localStorage.getItem("token");
  const adtoken = localStorage.getItem("adtoken");
  const trtoken = localStorage.getItem("trtoken");

  if (!token) return <Navigate to="/login" replace />;
  if (!adtoken && !trtoken) return <Navigate to="/" replace />;
  return <Outlet />;
};

const PublicLink = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const App = () => {
  const isDark = useAutoDarkDetect();
  const [token, setToken] = React.useState(
    localStorage.getItem("token") || ""
  );
  const [adtoken, setAdToken] = React.useState(
    localStorage.getItem("adtoken") || ""
  );
  const [trtoken, setTrToken] = React.useState(
    localStorage.getItem("trtoken") || ""
  );

  React.useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("adtoken", adtoken);
    localStorage.setItem("trtoken", trtoken);

    if (token === "") localStorage.removeItem("token");
    if (adtoken === "") localStorage.removeItem("adtoken");
    if (trtoken === "") localStorage.removeItem("trtoken");
  }, [token, adtoken, trtoken]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<PublicLink />}>
          <Route
            path="/login"
            element={
              <Login
                setToken={setToken}
                setAdToken={setAdToken}
                setTrToken={setTrToken}
              />
            }
          />
        </Route>

        <Route element={<ProtectedLink />}>
          <Route element={<DashboardSide />}>
            <Route path="/" element={<Home setToken={setToken} />} />
            <Route
              path="/requests"
              element={<CSHRequest setToken={setToken} />}
            />
            <Route
              path="/history"
              element={<CSHHistory setToken={setToken} />}
            />

            <Route element={<VeryProtectedLink />}>
              <Route
                path="/admin"
                element={
                  <Admin setToken={setToken} setAdToken={setAdToken} />
                }
              />
            </Route>

            <Route element={<StaffProtectedLink />}>
              <Route
                path="/approval"
                element={
                  <CSHPanel setToken={setToken} setTrToken={setTrToken} />
                }
              />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Notfound />} />
      </Route>
    )
  );

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        <ToastContainer theme={isDark ? "dark" : "light"} />
        <RouterProvider router={router} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;