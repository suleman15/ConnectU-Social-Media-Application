import { Link } from "react-router-dom";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import { BiBell, BiMoon } from "react-icons/bi";
import { SetTheme } from "../features/themeSlice";
import { useDispatch, useSelector } from "react-redux";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  let handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  return (
    <div className="flex justify-between items-center py-2  bg-white my-2 rounded p-3 ">
      <Link to={"/"}>
        <img className="h-8" src="/logo.png" alt="" />
      </Link>
      <form className=" h-auto flex items-stretch rounded-2xl overflow-hidden border-2 border-Clr hover:border-Clrhv focus-within:border-Clrhv ">
        <InputField
          styles={`   w-[350px] border-none rounded-none`}
          type={"text"}
          placeholder="Search.."
        />
        <CustomButton
          styles={`py-0 rounded-none`}
          type={"submit"}
          title={"Search"}
        />
      </form>
      <div className="flex gap-3 text-xl ">
        <BiMoon
          onClick={() => handleTheme()}
          className="bg-Clr text-white w-8 h-8 p-2 hover:bg-Clrhv cursor-pointer rounded-full"
        />
        <BiBell className="bg-Clr text-white w-8 h-8 p-2 hover:bg-Clrhv cursor-pointer rounded-full" />
      </div>
    </div>
  );
};

export default TopBar;
