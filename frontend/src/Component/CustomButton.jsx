import React from "react";

const CustomButton = ({ title, styles, iconRight, type, btnAttribute }) => {
  return (
    <button
      type={type || "button"}
      className={`px-3 py-4 rounded-md  bg-purple hover:bg-hover-purple text-white capitalize  ${styles}`}
      {...btnAttribute}
    >
      {title} {iconRight && <div>{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
