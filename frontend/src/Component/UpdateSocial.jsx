import React, { useState } from "react";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { axiosInstance, axiosRequest, updateSocialApi } from "../api";
import {
  login,
  updateSocial,
  updateUser,
  userEdited,
} from "../features/userSlice";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";

const UpdateUserForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const token = user?.token;
  const [errMsg, setErrMsg] = useState("");

  let dispatch = useDispatch();

  let {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      github: user?.social?.github,
      twitter: user?.social?.twitter,
      instagram: user?.social?.instagram,
      linkedin: user?.social?.linkedin,
      facebook: user?.social?.facebook,
    },
  });

  const updateSocialMediaURL = async (data) => {
    try {
      await updateSocialApi({ token, data }).then(async (res) => {
        const data = { token: res?.token, ...res?.findUser };
        console.log(data);
        dispatch(login(data));
        toast.success(res?.message);
        return res.data;
      });
      dispatch(updateSocial());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed w-full overflow-auto   h-screen  top-0 p-5 items-start   flex justify-center  bg-[#00000080] z-50">
      <form
        onSubmit={handleSubmit(updateSocialMediaURL)}
        className=" p-3 w-[500px] h-auto  gap-3 flex flex-col rounded-lg relative bg-white"
        encType="multipart/form-data"
      >
        <div className=" border-b-2 border-[#8080805d] p-3 flex justify-between items-center">
          <div className="text-purple">Update Social </div>

          <div
            className="bg-[#80008056] text-purple rounded-full  w-8 h-8 justify-center items-center flex cursor-pointer"
            onClick={() => dispatch(updateSocial())}
          >
            <RxCross2 />
          </div>
        </div>
        <InputField
          type="text"
          placeholder="Facebook Link"
          label="Facebook Link"
          register={register("facebook")}
        />
        <InputField
          type="text"
          placeholder="Instagram Link"
          label="Instagram Link"
          register={register("instagram")}
        />

        <InputField
          type="text"
          placeholder="Github Link"
          label="Github Link"
          register={register("github")}
        />
        <InputField
          type="text"
          placeholder="Twitter(X) Link"
          label="Twitter(X) Link"
          register={register("twitter")}
        />
        <InputField
          type="text"
          placeholder="LinkedIn Link"
          label="LinkedIn Link"
          register={register("linkedin")}
        />

        {errMsg && <div className="text-[red] text-sm">{errMsg.message}</div>}
        <CustomButton type={"submit"} title={"submit"} />
      </form>
    </div>
  );
};

export default UpdateUserForm;
