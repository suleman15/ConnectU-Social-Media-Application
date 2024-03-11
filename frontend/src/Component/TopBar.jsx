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
import Logo from "./Logo";

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
      <Link to={"/"} className="flex ">
        <Logo
          fill={theme == "dark" ? "#fff9" : "#0009"}
          style={{ width: "30px", height: "auto" }}
        />
      </Link>
      <div>
        <div
          onClick={() => show({ setter: setShowSearch, getter: showSearch })}
          className=" lg:hidden  hover:bg-primary/80 bg-primary/70 w-8 h-8 text-white text-lg flex justify-center items-center rounded-full"
        >
          <BiSearchAlt />
        </div>
        {showSearch && (
          <form className=" p-1 bg-input  h-auto lg:flex lg:relative  w-full  absolute lg:top-0 top-[55px] lg:left-0 left-[0px]  flex   rounded-lg text-sm overflow-hidden border-[2px]  group  focus-within:border-primary ">
            <InputField
              styles={`  lg:w-[250px] w-[100%]  border-none  h-full bg-[transparent] rounded-none`}
              type={"text"}
              placeholder="Search.."
            />
            <CustomButton
              styles={`bg-primary text-secondary  aspect-square`}
              type={"submit"}
              title={<BiSearchAlt />}
            />
          </form>
        )}
      </div>
      <div className="flex gap-3 text-xl items-center">
        <button onClick={handleTheme}>
          {theme == "light" ? (
            <BiMoon className="bg-primary/90 hover:bg-primary text-secondary w-8 h-8 p-2 cursor-pointer rounded-full" />
          ) : (
            <BiSun className="bg-primary/90 hover:bg-primary text-secondary w-8 h-8 p-2 cursor-pointer rounded-full" />
          )}
        </button>
        <BiBell className="bg-primary/90 hover:bg-primary text-secondary w-8 h-8 p-2 cursor-pointer rounded-full" />

        <div className="relative">
          <img
            onClick={() => {
              show({ setter: setShowMenu, getter: showMenu });
            }}
            className=" w-8 aspect-square rounded-full ring-primary ring-1 ring-offset-2 ring-offset-secondary"
            src={
              user?.profileUrl ??
              `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
            }
            alt="avatar"
          />{" "}
          {showMenu && (
            <div className="bg-secondary text-foreground backdrop-blur-lg flex flex-col capitalize text-sm  absolute  top-16 w-[200px] z-50 shadow-2xl right-[-10px]  py-3 rounded-lg ">
              <Link
                className=" hover:bg-primary hover:text-primary-foreground p-3"
                to={`/profile/${user?._id}`}
              >
                Profile
              </Link>
              <div
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground p-3"
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
