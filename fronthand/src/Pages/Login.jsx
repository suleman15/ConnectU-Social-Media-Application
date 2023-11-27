import { Link } from "react-router-dom";
import { CustomButton, InputField, Loading } from "../Component/index";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  BiLogoFacebook,
  BiLogoGithub,
  BiLogoGoogle,
  BiShareAlt,
  BiWifi,
} from "react-icons/bi";
import { AiFillInteraction } from "react-icons/ai";

export default function Login() {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  let onSubmit = async (data) => {};

  return (
    <div className=" bg-bgColor w-full lg:h-screen h-auto flex p-6 justify-center items-center md:p-20 ">
      <div className="lg:flex-row flex-col md:w-full lg:w-[1024px]   bg-primary rounded-lg shadow-sm h-fit  overflow-hidden gap-3 flex ">
        {/* LEFT */}
        <div className="lg:w-1/2 w-full h-auto bg-[#1e8fffbe] relative  py-10   bg-black flex justify-center items-center">
          <div
            className={` shrink-0  bg-tg w-[200px] h-[200px] rounded-full bg-cover bg-center mx-10`}
          ></div>
          <div className="absolute   top-5 left-2 bg-white z-10 flex gap-3 items-center px-2 rounded-lg">
            <BiShareAlt />
            <span>Share</span>
          </div>
          <div className="absolute  top-[70px] left-5 bg-white z-10 flex gap-3 items-center px-2 rounded-lg">
            <BiWifi />
            <span>Wifi</span>
          </div>
          <div className="absolute  bottom-5 right-2 bg-white z-10 flex gap-3 items-center px-2 rounded-lg">
            <AiFillInteraction />
            <span>Interact</span>
          </div>
        </div>
        {/* RIGHT */}
        <div className="lg:w-1/2 w-full p-10 flex gap-3  md:w-full  flex-col">
          <Link to={"/"}>
            {" "}
            <img className="h-8" src="/logo.png" />
          </Link>
          <p>Login in to your account</p>
          <span className="text-xs text-[gray]">Welcome Back.</span>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-3 flex-col"
          >
            <InputField
              type="email"
              placeholder="email@example.com"
              label="Email: "
              register={register("email", {
                required: "Email Address is required",
              })}
              styles=""
              LabelStyle=""
              error={errors.email ? errors.email.message : ""}
            />
            <InputField
              type="password"
              placeholder="password"
              label="Password: "
              register={register("password", {
                required: "Password  is required",
              })}
              styles=""
              LabelStyle=""
              error={errors.password ? errors.password.message : ""}
            />
            <Link
              to={"/resetPassword"}
              className="text-xs text-right text-Clr hover:text-Clrhv"
            >
              Forget Password?
            </Link>
            {errMsg?.message && <div>{errMsg?.message}</div>}
            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton type={"submit"} title={"login"} />
            )}
          </form>
          <div className="text-xs justify-center flex items-center">
            Dont have an account?
            <Link className="text-Clr mx-2 hover:text-Clrhv" to={"/register"}>
              Register
            </Link>
          </div>
          <div className="text-[gray] text-sm text-center">
            ------ OR ------
          </div>
          <div className="flex justify-center gap-3 ">
            <BiLogoGoogle className="text-Clr rounded-full hover:text-Clrhv cursor-pointer  w-8 h-8 p-1 bg-[#d4d4d498]" />
            <BiLogoGithub className="text-Clr rounded-full hover:text-Clrhv cursor-pointer  w-8 h-8 p-1 bg-[#d4d4d498]" />
            <BiLogoFacebook className="text-Clr rounded-full hover:text-Clrhv cursor-pointer  w-8 h-8 p-1 bg-[#d4d4d498]" />
          </div>
        </div>
      </div>
    </div>
  );
}
