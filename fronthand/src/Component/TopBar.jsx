import { Link } from "react-router-dom";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import { BiBell, BiMoon } from "react-icons/bi";
import { SetTheme } from "../features/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import logoImage from "/logo.png";

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
        <img className="h-8" src={logoImage} alt="" />
      </Link>
      <div className="flex items-stretch gap-2 ">
        <InputField
          styles={` h-full w-[250px]`}
          type={"text"}
          placeholder="...."
        />
        <CustomButton title={"Search"} />
      </div>
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
