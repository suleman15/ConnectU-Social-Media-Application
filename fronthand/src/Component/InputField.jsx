/* eslint-disable react/display-name */
import React from "react";

const InputField = React.forwardRef(
  (
    { type, placeholder, styles, label, labelStyle, register, name, error },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            className={`text-sm text-[#5e5e5e] ${labelStyle}`}
            htmlFor={label}
          >
            {label}
          </label>
        )}
        <input
          id={label}
          name={name}
          type={type}
          placeholder={placeholder}
          ref={ref}
          className={`${styles}   border-[#bbb8b8] border-2 p-3 text-sm  rounded outline-none `}
          {...register}
          aria-invalid={error ? true : false}
        />
        {error && <div className="text-xs text-[#ff0000ad]">{error}</div>}
      </div>
    );
  }
);

export default InputField;
