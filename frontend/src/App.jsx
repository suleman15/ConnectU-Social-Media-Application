import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateUserForm from "./Component/UpdateUserForm";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  return user?.token ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
}
function IfLogin() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  return !user?.token ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to={"/"} state={{ from: location }} replace />
  );
}
function App() {
  const { theme } = useSelector((state) => state.theme);
  const { edit } = useSelector((state) => state.user);
  return (
    <div data-theme={theme} className="w-full h-screen">
      <ToastContainer />
      {edit && <UpdateUserForm />}
      <Routes>
        {/* This is called Protected Route */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId?" element={<Profile />} />
        </Route>
        <Route element={<IfLogin />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
