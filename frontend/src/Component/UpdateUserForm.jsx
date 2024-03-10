import React, { useState } from "react";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { axiosInstance, axiosRequest } from "../api";
import { login, userEdited } from "../features/userSlice";
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
      firstName: user?.firstName,
      lastName: user?.lastName,
      profession: user?.profession,
      location: user?.location,
    },
  });

  const selectedImage = useWatch({
    control,
    name: "profileUrl", // replace with your file input name
  });

  const imagePreview = selectedImage
    ? URL.createObjectURL(selectedImage[0])
    : null;

  const updUser = async (data) => {
    try {
      const formData = new FormData();
      console.log(data?.backgroundUrl);
      Object.keys(data).map((key) => {
        key != "profileUrl"
          ? key != "backgroundUrl"
            ? formData.set(key, getValues(key))
            : formData.set(key, getValues(key)[0])
          : formData.set(key, getValues(key)[0]);
      });
      console.log(formData.get("backgroundUrl"));
      console.log(formData.get("profileUrl"));

      const res = await axios
        .put("http://localhost:8800/users/update-user", formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          onUploadProgress: (progressEvent) => {
            console.log(progressEvent);
            // const totalLength = progressEvent.lengthComputable
            //   ? progressEvent.total
            //   : progressEvent.target.getResponseHeader("content-length") ||
            //     progressEvent.target.getResponseHeader(
            //       "x-decompressed-content-length"
            //     );
            // if (totalLength) {
            //   const progressPercent = Math.round(
            //     (progressEvent.loaded * 100) / totalLength
            //   );
            //   console.log(progressPercent);
            // }
          },
        })
        .then((res) => {
          const data = { token: res.data?.token, ...res.data?.user };
          console.log(data);
          dispatch(login(data));
          toast.success("Sucessfully updated");
          return res.data;
        });
      console.log(res);

      dispatch(userEdited());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="fixed w-full overflow-auto   h-screen  top-0 p-5 items-start   flex justify-center  bg-[#00000080] z-50"
      style={{}}
    >
      <form
        onSubmit={handleSubmit(updUser)}
        className=" p-3 w-[500px] h-auto  gap-3 flex flex-col rounded-lg relative bg-white"
        encType="multipart/form-data"
      >
        {/* {imagePreview && <img src={imagePreview} alt="Selected" />} */}
        <div
          onClick={() => dispatch(userEdited())}
          className="bg-[#80008056] text-purple rounded-full  absolute right-3 p-2 top-3"
        >
          <RxCross2 />
        </div>
        <img
          className="w-[150px] h-[150px] bg-contain  rounded-full mx-auto"
          src={
            imagePreview ??
            user?.profileUrl ??
            `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
          }
          alt=""
        />
        <InputField
          type="file"
          placeholder="Background Url"
          label="Background Url"
          register={register("backgroundUrl", {
            required: "Image Is Required",
          })}
          error={errors.backgroundUrl ? errors.backgroundUrl.message : ""}
        />
        <InputField
          type="file"
          placeholder="Profile-Image"
          label="Profile-Image"
          register={register("profileUrl", {
            required: "Image Is Required",
          })}
          error={errors.profileUrl ? errors.profileUrl.message : ""}
        />
        <InputField
          type="text"
          placeholder="First Name"
          label="First Name"
          register={register("firstName", {
            required: "First Name is required.",
          })}
          error={errors.firstName ? errors.firstName.message : ""}
        />
        <InputField
          type="text"
          placeholder="Last Name"
          label="Last Name"
          register={register("lastName", {
            required: "Last Name is required.",
          })}
          error={errors.lastName ? errors.lastName.message : ""}
        />

        <InputField
          type="text"
          placeholder="Add Location"
          label="Add Location"
          register={register("location", {
            required: "Location is required.",
          })}
          error={errors.location ? errors.location.message : ""}
        />
        <InputField
          type="text"
          placeholder="Add Profession"
          label="Add Profession"
          register={register("profession", {
            required: "Profession Is required.",
          })}
          error={errors.profession ? errors.profession.message : ""}
        />

        {errMsg && <div className="text-[red] text-sm">{errMsg.message}</div>}
        <CustomButton type={"submit"} title={"submit"} />
      </form>
    </div>
  );
};

export default UpdateUserForm;
