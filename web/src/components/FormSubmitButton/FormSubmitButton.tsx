import { Button, CircularProgress } from "@mui/material";
import { FC, MouseEventHandler } from "react";

interface FormSubmitButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  text: string;
}

const FormSubmitButton: FC<FormSubmitButtonProps> = ({
  disabled,
  loading = false,
  onClick,
  text,
}) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      sx={{ mt: 3, mb: 2 }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : text}
    </Button>
  );
};

export default FormSubmitButton;
