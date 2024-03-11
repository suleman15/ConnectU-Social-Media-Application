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
import { Post } from "./Pages";
import UpdateSocial from "./Component/UpdateSocial";

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
  const { edit, editSocial } = useSelector((state) => state.user);
  return (
    <div data-theme={theme} className="w-full min-h-screen  bg-background ">
      {/* <div className="w-full h-screen bg-cover bg-[url('assets/bg.jpg')] fixed top-0 left-0 ">
        <div className="w-full h-full bg-input/50 backdrop-blur-sm"></div>
      </div> */}
      <ToastContainer />
      {edit && <UpdateUserForm />}
      {editSocial && <UpdateSocial />}
      <Routes>
        {/* This is called Protected Route */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:userId?" element={<Profile />} />
          <Route path="/post/:postId?" element={<Post />} />
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
