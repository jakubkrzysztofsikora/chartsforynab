import { TextField } from "@mui/material";
import React from "react";

export type TextfieldProps = {
  defaultValue?: string | number;
  placeholder?: string | number;
  className?: string;
  type?: "number" | "text";
  max?: number;
  min?: number;
  onChange?: (value: string | number) => void;
};

export const Textfield: React.FC<TextfieldProps> = ({
  className,
  type,
  min,
  max,
  defaultValue,
  placeholder,
  onChange,
}) => {
  console.log({ defaultValue });
  const [value, setValue] = React.useState<string | number | undefined>(
    defaultValue
  );
  const [focused, setFocused] = React.useState<boolean>(false);
  const dirty = focused || (!focused && value);

  return (
    <TextField
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(
          type === "number" ? parseInt(e.target.value) : e.target.value
        );
      }}
      className={`${className} ${!dirty ? "clean" : ""}`}
      variant="standard"
      type={type}
      value={
        focused && !value
          ? ""
          : value || (type === "number" ? placeholder : `${placeholder} *`)
      }
      inputProps={{
        min,
        max,
      }}
    />
  );
};
