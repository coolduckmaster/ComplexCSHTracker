import React from "react";
import Login from "./Login";
import Home from "./Home";
import Admin from "./Admin";
import CSHRequest from "./CSHRequest";
import CSHPanel from "./CSHPanel";
import { useAutoDarkDetect } from "./misc";
import DashboardSide from "./DashboardSide";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router";

export const backendUrl = "http://localhost:4000";

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
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!adtoken) {
    return <Navigate to="/" replace />;
  }
  return <Outlet context={{}} />;
};

const TrProtectedLink = () => {
  const token = localStorage.getItem("token");
  const trtoken = localStorage.getItem("trtoken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!trtoken) {
    return <Navigate to="/" replace />;
  }
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
  //const [completeOnBoard, setCompleteOnBoard] = React.useState(
  //localStorage.getItem("CompleteOnboard") || "",
  //);
  const [token, setToken] = React.useState(localStorage.getItem("token") || "");
  const [adtoken, setAdToken] = React.useState(
    localStorage.getItem("adtoken") || "",
  );
  const [trtoken, setTrToken] = React.useState(
    localStorage.getItem("trtoken") || "",
  );

  React.useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("adtoken", adtoken);
    localStorage.setItem("trtoken", trtoken);

    if (token === "") {
      localStorage.removeItem("token");
    }

    if (adtoken === "") {
      localStorage.removeItem("adtoken");
    }

    if (trtoken === "") {
      localStorage.removeItem("trtoken");
    }
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

            <Route element={<VeryProtectedLink />}>
              <Route
                path="/admin"
                element={<Admin setToken={setToken} setAdToken={setAdToken} />}
              />
            </Route>

            <Route element={<TrProtectedLink />}>
              <Route
                path="/approval"
                element={
                  <CSHPanel setToken={setToken} setTrToken={setTrToken} />
                }
              />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Route>,
    ),
  );

  return (
    <div>
      <ToastContainer theme={isDark ? "dark" : "light"} />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
