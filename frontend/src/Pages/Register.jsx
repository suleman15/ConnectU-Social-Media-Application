import { Link, useNavigate } from "react-router-dom";
import { CustomButton, InputField, Loading } from "../Component/index";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import {
  BiLogoFacebook,
  BiLogoGithub,
  BiLogoGoogle,
  BiMoon,
  BiShareAlt,
  BiSun,
  BiWifi,
} from "react-icons/bi";
import { AiFillInteraction } from "react-icons/ai";
import { axiosRequest } from "../api";
import { toast } from "react-toastify";
import Logo from "../Component/Logo";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../features/themeSlice";

export default function Register() {
  let {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  let handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(setTheme(themeValue));
  };

  let onSubmit = async (data) => {
    console.log("AUTH/REGISTER");
    setIsSubmitting(true);
    try {
      const res = await axiosRequest({
        url: "auth/register",
        data: data,
        method: "POST",
      });

      if (res?.success == "failed") {
        setErrMsg(res);
        toast.success(res?.message);
      } else {
        setErrMsg(res);
        toast.success(res?.message);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="  w-full lg:h-screen text-foreground  bg-card h-auto flex p-6  justify-center items-center md:p-20 ">
      <button onClick={handleTheme} className="absolute top-4 right-4 z-50">
        {theme == "light" ? (
          <BiMoon className="bg-primary/70 hover:bg-primary/80  w-8 h-8 p-2 cursor-pointer rounded-full" />
        ) : (
          <BiSun className="bg-primary/70 hover:bg-primary/80  w-8 h-8 p-2 cursor-pointer rounded-full" />
        )}
      </button>
      <div className="p-2 bg-secondary border-4 border-foreground/10 lg:flex-row flex-col md:w-full lg:w-[1024px]    rounded-lg shadow-sm h-fit  overflow-hidden gap-3 flex ">
        {/* LEFT */}
        <div className="lg:w-1/2 w-full h-auto bg-cover bg-[url('assets/background.jpg')]  relative  py-10 rounded-lg  bg-black flex justify-center items-center">
          <div className="text-center my-20 mx-2 bg-secondary/70 backdrop-blur-lg  p-3 rounded-lg ">
            <div>Connect Your Friend & have share for fun.</div>
            <div className="text-sm  ">
              Share families with friends and the world
            </div>
          </div>
          <div className="absolute   bottom-[10%] left-2  z-10 flex gap-3 bg-secondary/70 backdrop-blur-lg items-center px-2 rounded-lg  ">
            <BiShareAlt />
            <span>Share</span>
          </div>
          <div className="absolute  top-[20%] left-5  z-10 flex gap-3 bg-secondary/70 backdrop-blur-lg items-center px-2 rounded-lg">
            <BiWifi />
            <span>Wifi</span>
          </div>
          <div className="absolute  bottom-5 right-2  z-10 flex gap-3 bg-secondary/70 backdrop-blur-lg items-center px-2 rounded-lg">
            <AiFillInteraction />
            <span>Interact</span>
          </div>
        </div>
        {/* RIGHT */}
        <div className="order-2 lg:order-1 lg:w-1/2  p-5 flex gap-3 flex-col">
          <Link to={"/"} className="flex ">
            <Logo
              fill={theme == "dark" ? "white" : "black"}
              style={{ width: "30px", height: "auto" }}
            />
          </Link>
          <p>Register your account</p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-3 flex-col text-foreground"
          >
            <div className="flex  gap-2 flex-col   md:flex-row">
              <InputField
                type="text"
                placeholder="First Name"
                label="First Name: "
                register={register("firstName", {
                  required: "First Name is required",
                })}
                error={errors.firstName ? errors.firstName.message : ""}
              />
              <InputField
                type="text"
                placeholder="Last Name"
                label="Last Name: "
                register={register("lastName", {
                  required: "Last Name is required",
                })}
                error={errors.lastName ? errors.lastName.message : ""}
              />
            </div>
            <InputField
              type="email"
              placeholder="email@example.com"
              label="Email: "
              register={register("email", {
                required: "Email Address is required",
              })}
              error={errors.email ? errors.email.message : ""}
            />
            <div className="flex-col flex gap-2 md:flex-row">
              <InputField
                type="password"
                placeholder="Password"
                label="Password: "
                register={register("password", {
                  required: "Password  is required",
                })}
                error={errors.password ? errors.password.message : ""}
              />
              <InputField
                type="password"
                placeholder="Confirm Password"
                label="Password: "
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();
                    if (password != value) {
                      return "Password do not match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

            {errMsg?.message && (
              <div className="text-[red] text-xs">{errMsg?.message}</div>
            )}
            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton type={"submit"} title={"register"} />
            )}
          </form>
          <div className="text-xs  flex items-center justify-center">
            Already have an account?
            <Link
              className="text-primary/70 mx-1  border-b border-primary/50 hover:border-primary hover:text-primary"
              to={"/login"}
            >
              Login
            </Link>
          </div>
          <div className="text-[gray] text-sm text-center">
            ------ OR ------
          </div>
          <div className="flex justify-center gap-3 text-3xl text-primary">
            <BiLogoGoogle className="bg-primary/80 hover:bg-primary rounded-lg p-1 text-secondary hover:ring-primary cursor-pointer ring-2 ring-offset-2 ring-offset-secondary" />
            <BiLogoGithub className="bg-primary/80 hover:bg-primary rounded-lg p-1 text-secondary hover:ring-primary cursor-pointer ring-2 ring-offset-2 ring-offset-secondary" />
            <BiLogoFacebook className="bg-primary/80 hover:bg-primary rounded-lg p-1 text-secondary hover:ring-primary cursor-pointer ring-2 ring-offset-2 ring-offset-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
