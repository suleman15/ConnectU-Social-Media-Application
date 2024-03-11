/* eslint-disable react/display-name */
import React from "react";

const InputField = React.forwardRef(
  (
    {
      type,
      placeholder,
      styles,
      label,
      rest,
      labelStyle,
      register,
      name,
      error,
      parentStyle,
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col w-full gap-1 ${parentStyle}`}>
        {label && (
          <label
            className={`text-sm text-foreground  ${labelStyle}`}
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
          className={`focus:border-purple  border-2 border-primary/10 text-foreground  bg-input hover:border-primary  focus:border-primary  p-3 text-sm  rounded outline-none ${styles} `}
          {...register}
          aria-invalid={error ? true : false}
          {...rest}
        />
        {error && (
          <div className="text-xs bg-destructive px-4 py-1 text-[white]">
            {error}
          </div>
        )}
      </div>
    );
  }
);

export default InputField;
