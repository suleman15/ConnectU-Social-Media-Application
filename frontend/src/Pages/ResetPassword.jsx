import { useForm } from "react-hook-form";
import { CustomButton, InputField, Loading } from "../Component";
import { useState } from "react";
import { axiosRequest } from "../api";
import { toast } from "react-toastify";

export default function ResetPassword() {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const  onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await axiosRequest({
        url: "users/request-resetpassword",
        data: data,
        method: "POST",
      });
      toast.success(res.message)
      setErrMsg(res);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bgColor w-full h-screen flex p-6 justify-center items-center ">
      <div className="  bg-primary rounded-lg shadow-sm h-fit  overflow-hidden gap-3 flex flex-col p-3">
        <div className="text-lg ">Email</div>
        <div className="text-xs text-[gray] mx-3">
          Enter email address used during registration
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <InputField
            type={"email"}
            register={register("email", {
              required: "Email Address is required",
            })}
            name={"email"}
            error={errors.email ? errors.email.message : ""}
          />
          {errMsg?.message && (
            <div className="text-[red] text-xs">{errMsg?.message}</div>
          )}
          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton type={"submit"} title={"reset password"} />
          )}
        </form>
      </div>
    </div>
  );
}
