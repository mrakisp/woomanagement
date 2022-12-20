import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

interface ButtonProps {
  isLoading?: boolean;
  onClick: any;
  text: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "text" | "contained" | "outlined" | undefined;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | undefined;
}

export default function Button({
  isLoading = false,
  text,
  disabled = false,
  onClick,
  icon,
  variant = "contained",
  color,
}: ButtonProps) {
  return (
    <LoadingButton
      // color="secondary"
      onClick={onClick}
      loading={isLoading}
      // loadingPosition="end"
      endIcon={icon}
      variant={variant}
      disabled={disabled}
      size="large"
      color={color}
      sx={{ marginLeft: 5 }}
    >
      {text}
    </LoadingButton>
  );
}
