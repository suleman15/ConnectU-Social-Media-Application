import { Link } from "react-router-dom";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import {
  BiBell,
  BiDownArrow,
  BiMoon,
  BiSearch,
  BiSearchAlt,
  BiSearchAlt2,
  BiSun,
} from "react-icons/bi";
import { setTheme } from "../features/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";
import { useState } from "react";

const TopBar = () => {
  const { user } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const dispatch = useDispatch();
  let handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(setTheme(themeValue));
  };

  let show = ({ setter, getter }) => {
    setter(!getter);
  };
  return (
    <div className="sticky top-[10px]  flex justify-between items-center py-2 z-40  bg-secondary/80 backdrop-blur-lg  border my-2 rounded p-3 flex-row gap-[20px]">
      <Link to={"/"}>
        <img className="h-8" src="/logo.png" alt="" />
      </Link>
      <div>
        <div
          onClick={() => show({ setter: setShowSearch, getter: showSearch })}
          className=" lg:hidden  hover:bg-primary/80 bg-primary/70 w-8 h-8 text-white text-lg flex justify-center items-center rounded-full"
        >
          <BiSearchAlt />
        </div>
        {showSearch && (
          <form className="  h-auto lg:flex lg:relative  w-full  absolute lg:top-0 top-[55px] lg:left-0 left-[0px]  bg-white flex   rounded-lg text-sm overflow-hidden border-[2px] border-[#4a32c32b] hover:border-Clrhv group hover:bg-[#4a32c32b] focus-within:border-[#5035d8] ">
            <InputField
              styles={`  lg:w-[250px] w-[100%]  border-none  h-full bg-[transparent] rounded-none`}
              type={"text"}
              placeholder="Search.."
            />
            <CustomButton
              styles={`py-[3px]  m-[2px] `}
              type={"submit"}
              title={<BiSearchAlt />}
            />
          </form>
        )}
      </div>
      <div className="flex gap-3 text-xl items-center">
        <button onClick={handleTheme}>
          {theme == "light" ? (
            <BiMoon className="bg-primary/70 hover:bg-primary/80 text-white w-8 h-8 p-2 cursor-pointer rounded-full" />
          ) : (
            <BiSun className="bg-primary/70 hover:bg-primary/80 text-white w-8 h-8 p-2 cursor-pointer rounded-full" />
          )}
        </button>
        <BiBell className="bg-primary/70 hover:bg-primary/80 text-white w-8 h-8 p-2 cursor-pointer rounded-full" />

        <div className="relative">
          <img
            onClick={() => {
              show({ setter: setShowMenu, getter: showMenu });
            }}
            className=" w-8 aspect-square rounded-full ring-primary ring-1 ring-offset-2"
            src={
              user?.profileUrl ??
              `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
            }
            alt="avatar"
          />{" "}
          {showMenu && (
            <div className="bg-white flex flex-col capitalize text-sm  absolute  top-[55px] w-[200px] z-50 shadow-2xl right-[-10px]  py-3 rounded-lg ">
              <Link
                className=" hover:bg-[#80808030] hover:text-primary/50 hover:font-bold p-3"
                to={`/profile/${user?._id}`}
              >
                Profile
              </Link>
              <div
                className="cursor-pointer hover:bg-[#80808030] hover:text-primary/50 hover:font-bold p-3"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
