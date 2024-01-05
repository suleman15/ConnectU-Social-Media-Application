import React, { useState } from "react";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { axiosInstance, axiosRequest } from "../api";
import { login, updateSocial, userEdited } from "../features/userSlice";
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
  });

  const updateSocialMediaURL = async (data) => {
    try {
      const result = {};
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
          result[key] = data[key];
        }
      }
      console.log(result);
      const res = await axios
        .put("http://localhost:8800/users/update-social", result, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        // const res = await axios
        //   .put("http://localhost:8800/users/update-user", data, {
        //     headers: {
        //       Authorization: token ? `Bearer ${token}` : "",
        //     },
        //     onUploadProgress: (progressEvent) => {
        //       console.log(progressEvent);
        //       // const totalLength = progressEvent.lengthComputable
        //       //   ? progressEvent.total
        //       //   : progressEvent.target.getResponseHeader("content-length") ||
        //       //     progressEvent.target.getResponseHeader(
        //       //       "x-decompressed-content-length"
        //       //     );
        //       // if (totalLength) {
        //       //   const progressPercent = Math.round(
        //       //     (progressEvent.loaded * 100) / totalLength
        //       //   );
        //       //   console.log(progressPercent);
        //       // }
        //     },
        //   })
        .then((res) => {
          const data = { token: res.data?.token, ...res.data?.user };
          console.log(data);
          dispatch(login(data));
          toast.success("Sucessfully updated");
          return res.data;
        });
      console.log(res);

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
        <div className=" border-b-2 border-[#8080805d] p-3 flex justify-between">
          <div>UpdateSocial </div>

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

        {errMsg && <div className="text-[red] text-sm">{errMsg.message}</div>}
        <CustomButton type={"submit"} title={"submit"} />
      </form>
    </div>
  );
};

export default UpdateUserForm;
