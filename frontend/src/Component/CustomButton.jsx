import React from "react";

const CustomButton = ({ title, styles, iconRight, type, btnAttribute }) => {
  return (
    <button
      type={type || "button"}
      className={`px-3 py-2 rounded-md text-background font-bold bg-primary w-sm capitalize  ${styles}`}
      {...btnAttribute}
    >
      {title} {iconRight && <div>{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
