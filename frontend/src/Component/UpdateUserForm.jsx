import React from "react";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const UpdateUserForm = () => {
  const { user: user } = useSelector((state) => state);
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const updUser = async (data) => {
    console.log(data);
  };

  return (
    <div className="absolute w-full h-screen flex justify-center items-center bg-[#ff000049] z-10">
      <form
        onSubmit={handleSubmit(updUser)}
        className="bg-white p-3 w-[500px] gap-3 flex flex-col rounded-lg"
      >
        <img
          className="w-[100px] rounded-full mx-auto"
          src={
            user?.profileUrl ??
            `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
          }
          alt=""
        />
        <InputField
          type="file"
          placeholder="Profile-Image"
          label="Profile-Image"
          register={register("file")}
        />
        <InputField
          type="text"
          placeholder="Add Location"
          label="Add Location"
          register={register("location")}
        />
        <InputField
          type="text"
          placeholder="Add Profession"
          label="Add Profession"
          register={register("profession")}
        />

        <CustomButton type={"submit"} title={"submit"} />
      </form>
    </div>
  );
};

export default UpdateUserForm;
