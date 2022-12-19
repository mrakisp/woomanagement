import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

interface ButtonProps {
  isLoading?: boolean;
  onClick: any;
  text: string;
  disabled?: boolean;
}

export default function Button({
  isLoading = false,
  text,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <LoadingButton
      // color="secondary"
      onClick={onClick}
      loading={isLoading}
      loadingPosition="end"
      endIcon={<SaveIcon />}
      variant="contained"
      disabled={disabled}
      size="large"
    >
      {text}
    </LoadingButton>
  );
}
