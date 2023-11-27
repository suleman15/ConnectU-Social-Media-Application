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

export default function Register() {
  let {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  let onSubmit = async (data) => {};

  return (
    <div className="bg-bgColor w-full h-screen flex p-6 justify-center items-center ">
      <div className="  bg-primary rounded-lg shadow-sm h-fit  overflow-hidden gap-3 flex ">
        {/* LEFT */}
        <div className="w-1/2 h-auto bg-[#1e8fffbe] relative   bg-black px-20 flex justify-center items-center">
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
        <div className="w-1/2  p-5 flex gap-3 flex-col">
          <Link to={"/"}>
            {" "}
            <img className="h-8" src="/logo.png" />{" "}
          </Link>
          <p>Register your account</p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-3 flex-col"
          >
            <div className="flex gap-2 ">
              <InputField
                type="text"
                placeholder="First Name"
                label="First Name: "
                register={register("firstName", {
                  required: "First Name is required",
                })}
                styles=""
                LabelStyle=""
                error={errors.firstName ? errors.firstName.message : ""}
              />
              <InputField
                type="email"
                placeholder="Last Name"
                label="Last Name: "
                register={register("lastName", {
                  required: "Last Name is required",
                })}
                styles=""
                LabelStyle=""
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
              styles=""
              LabelStyle=""
              error={errors.email ? errors.email.message : ""}
            />
            <div className="flex gap-2">
              <InputField
                type="password"
                placeholder="Password"
                label="Password: "
                register={register("password", {
                  required: "Password  is required",
                })}
                styles=""
                LabelStyle=""
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
                styles=""
                LabelStyle=""
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

            {errMsg?.message && <div>{errMsg?.message}</div>}
            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton type={"submit"} title={"register"} />
            )}
          </form>
          <div className="text-xs  flex items-center justify-center">
            Already have an account?
            <Link className="text-Clr mx-2 hover:text-Clrhv" to={"/login"}>
              Login
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
