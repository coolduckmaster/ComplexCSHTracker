/* eslint-disable no-unused-vars */
import React from "react";
import Login from "./Login";
import Home from "./Home";
import Admin from "./Admin";
import CSHRequest from "./CSHRequest";
import CSHPanel from "./CSHPanel";
import Notfound from "./404";
import DashboardSide from "./DashboardSide";
import CSHHistory from "./CSHHistory";
import TrReport from "./TrReport";
import LeaderBoard from "./LeaderBoard"
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

export const Placeholder =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"; //This file is licensed under the Creative Commons Attribution-Share Alike 4.0 International license. Wikimedia.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const hasStaffToken = () =>
  localStorage.getItem("adtoken") || localStorage.getItem("trtoken");

const ProtectedLink = () =>
  localStorage.getItem("token") ? <Outlet /> : <Navigate to="/login" replace />;

const VeryProtectedLink = () =>
  localStorage.getItem("adtoken") ? <Outlet /> : <Navigate to="/" replace />;

const StaffProtectedLink = () =>
  hasStaffToken() ? <Outlet /> : <Navigate to="/" replace />;

const PublicLink = () =>
  localStorage.getItem("token") ? <Navigate to="/" replace /> : <Outlet />;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PublicLink />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedLink />}>
        <Route element={<DashboardSide />}>
          <Route path="/" element={<Home />} />
          <Route path="/requests" element={<CSHRequest />} />
          <Route path="/history" element={<CSHHistory />} />
          <Route path="/leaderboard" element={<LeaderBoard/>}/>

          <Route element={<VeryProtectedLink />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<StaffProtectedLink />}>
            <Route path="/approval" element={<CSHPanel />} />
            {/* <Route path="/report" element={<TrReport />} /> */}
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Notfound />} />
    </Route>,
  ),
);

const App = () => {
  const isDark = useAutoDarkDetect();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        <ToastContainer theme={isDark ? "dark" : "light"} />
        <RouterProvider router={router} />
      </div>
    </GoogleOAuthProvider>
  );
};
//router revamp with help from my mate K.V.
export default App;
