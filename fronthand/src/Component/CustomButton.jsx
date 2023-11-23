import React from "react";

const CustomButton = ({ title, containerStyle, iconRight, type, onClick }) => {
  return (
    <button
      type={type || "button"}
      className={`px-3 py-4 rounded-md  bg-Clr hover:bg-Clrhv    text-white capitalize  ${containerStyle}`}
    >
      {title} {iconRight && <div>{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
