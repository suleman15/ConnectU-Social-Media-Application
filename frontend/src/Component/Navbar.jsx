import { Link } from "react-router-dom";
import HomeLogo from "../assets/home.svg";

const Navbar = () => {
  return (
    <div>
      <nav className="border-b-2 items-center  flex justify-between px-[50px] py-3 border-gray-100">
        <div className="flex  gap-3 items-center">
          <img className="w-12" src={HomeLogo} alt="logo" />
          <div className="text-2xl text-bold uppercase font-bold">
            SocioLogy
          </div>
        </div>
        <div className="flex gap-3 ">
          <Link className=" p-3 rounded cursor-pointer " to="/">
            Home
          </Link>
          <Link className=" p-3 rounded cursor-pointer " to="/login">
            Login
          </Link>
          <Link
            className=" p-3 rounded cursor-pointer bg-[#4B32C3] text-white"
            to="/register"
          >
            Register
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
