import { useForm } from "react-hook-form";
import { CustomButton, InputField } from "../Component";

export default function ResetPassword() {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  let onSubmit = async (data) => {};

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
            error={errors.email ? errors.email.message : ""}
          />
          <CustomButton type={"submit"} title={"reset password"} />
        </form>
      </div>
    </div>
  );
}
