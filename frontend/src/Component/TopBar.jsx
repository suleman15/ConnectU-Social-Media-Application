import { Link } from "react-router-dom";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import { BiBell, BiMoon, BiSun } from "react-icons/bi";
import { setTheme } from "../features/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  let handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(setTheme(themeValue));
  };

  return (
    <div className="sticky top-[10px] shadow-lg flex justify-between items-center py-2 z-40  bg-white my-2 rounded p-3 md:flex-row flex-col gap-[20px]">
      <Link to={"/"}>
        <img className="h-8" src="/logo.png" alt="" />
      </Link>
      <form className="  h-auto flex   rounded-lg text-sm overflow-hidden border-[2px] border-[#4a32c32b] hover:border-Clrhv group hover:bg-[#4a32c32b] focus-within:border-[#5035d8] ">
        <InputField
          styles={`  w-[250px] border-none h-full bg-[transparent] rounded-none`}
          type={"text"}
          placeholder="Search.."
        />
        <CustomButton
          styles={`py-[3px]  m-[2px] `}
          type={"submit"}
          title={"Search"}
        />
      </form>
      <div className="flex gap-3 text-xl items-center">
        <button onClick={handleTheme}>
          {theme == "light" ? (
            <BiMoon className="bg-Clr text-white w-8 h-8 p-2 hover:bg-Clrhv cursor-pointer rounded-full" />
          ) : (
            <BiSun className="bg-Clr text-white w-8 h-8 p-2 hover:bg-Clrhv cursor-pointer rounded-full" />
          )}
        </button>
        <BiBell className="bg-Clr text-white w-8 h-8 p-2 hover:bg-Clrhv cursor-pointer rounded-full" />
        <CustomButton
          title={"Sign Out"}
          styles={`bg-black text-xs py-1 rounded-3xl px-4`}
          btnAttribute={{
            onClick: () => {
              dispatch(logout());
            },
          }}
        />
      </div>
    </div>
  );
};

export default TopBar;
