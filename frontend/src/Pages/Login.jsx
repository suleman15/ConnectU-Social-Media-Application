import { Link, useNavigate } from "react-router-dom";
import { CustomButton, InputField, Loading } from "../Component/index";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { BiLogoGithub, BiShareAlt, BiWifi } from "react-icons/bi";
import { AiFillInteraction } from "react-icons/ai";
import { axiosRequest } from "../api";
import { login } from "../features/userSlice";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

export default function Login() {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const res = await axiosRequest({
        url: "auth/login",
        data: data,
        method: "POST",
      });
      console.log(res);
      if (res?.status == "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        const data = { token: res?.token, ...res?.user };
        console.log(data);
        dispatch(login(data));
        if (res.message == "Login Successfully") {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" bg-purple w-full lg:h-screen h-auto flex p-6  justify-center items-center md:p-20 ">
      <div className="border-4 border-white lg:flex-row flex-col md:w-full lg:w-[1024px]   bg-primary rounded-lg shadow-sm h-fit  overflow-hidden gap-3 flex ">
        {/* LEFT */}
        <div className="lg:w-1/2 w-full h-auto bg-cover bg-[url('assets/background.jpg')] relative  py-10 rounded-lg  bg-black flex justify-center items-center">
          <div className="text-center my-20 mx-2 bg-[#ffffff81] p-3 rounded-lg ">
            <div>Connect Your Friend & have share for fun.</div>
            <div className="text-sm text-[#505050]">
              Share families with friends and the world
            </div>
          </div>
          <div className="absolute   bottom-[10%] left-2 bg-white z-10 flex gap-3 items-center px-2 rounded-lg  ">
            <BiShareAlt />
            <span>Share</span>
          </div>
          <div className="absolute  top-[20%] left-5 bg-white z-10 flex gap-3 items-center px-2 rounded-lg">
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
            <img className="h-8" src="/logo.svg" />
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
            {errMsg?.message && (
              <div className="text-[red] text-xs">{errMsg?.message}</div>
            )}{" "}
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
            <FcGoogle className="text-Clr rounded-full cursor-pointer  w-8 h-8 p-1 bg-[#8080804d]" />
            <BiLogoGithub className="text-[#333333] rounded-full  cursor-pointer  w-8 h-8 p-[2px] bg-[#d4d4d498]" />
            <FaFacebook className="text-[#395693] rounded-full  cursor-pointer  w-8 h-8 p-1 bg-[#d4d4d498]" />
          </div>
        </div>
      </div>
    </div>
  );
}
