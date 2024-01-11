import type { FC, InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const Input: FC<InputProps> = ({ name, label, ...rest }) => {
  const { error, getInputProps } = useField(name);

  return (
    <span className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-3">
          {label}
        </label>
      )}
      <input
        className="border-2 border-indigo-500 rounded-2xl p-4 w-[320px] "
        {...rest}
        {...getInputProps({ id: name })}
      />

      {error && <span className="label-text-alt mt-3">{error}</span>}
    </span>
  );
};
