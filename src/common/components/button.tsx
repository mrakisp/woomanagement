import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

interface ButtonProps {
  isLoading?: boolean;
  onClick: any;
  text: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: "text" | "contained" | "outlined" | undefined;
  size?: "small" | "large" | "medium" | undefined;
  sx?: any;
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
  size = "large",
  sx,
}: ButtonProps) {
  return (
    <LoadingButton
      onClick={onClick}
      loading={isLoading}
      // loadingPosition="end"
      endIcon={icon}
      variant={variant}
      disabled={disabled}
      size={size}
      color={color}
      sx={sx}
    >
      {text}
    </LoadingButton>
  );
}
