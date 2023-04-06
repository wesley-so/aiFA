import {
  Alert,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, FC, useState } from "react";
import DashboardNavigationBar from "../DashboardNavigationBar/DashboardNavigationBar";
import { changePassword } from "../../services/aifaAPI/user";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";
import { AxiosError } from "axios";

const ProfilePage: FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [isChangingDone, setIsChangingDone] = useState(false);
  const [changeError, setChangeError] = useState<Error>();
  const onTextFieldChange = (
    setValue: (value: string) => void
  ): ChangeEventHandler<HTMLInputElement> => {
    return (event) => {
      setValue(event.currentTarget.value);
    };
  };

  const clickPasswordChangeHandler = async (): Promise<void> => {
    console.log(
      `Change password with new password: ${newPassword} and new password confirmed ${newPasswordConfirm}.`
    );
    setIsChanging(true);
    setIsChangingDone(false);
    setChangeError(undefined);
    try {
      await changePassword(newPassword, newPasswordConfirm);
      setIsChangingDone(true);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError &&
        error.response?.status === 400 &&
        error.response?.data?.error
          ? error.response.data.error
          : "Unknown error occurred.";
      setChangeError(new Error(errorMsg, { cause: error }));
      console.log(error);
    }
    setNewPassword("");
    setNewPasswordConfirm("");
    setIsChanging(false);
  };

  return (
    <>
      <DashboardNavigationBar />
      <Container component="main" maxWidth="md">
        <br />
        <br />
        <Grid
          alignItems="flex-start"
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          container
          spacing={2}
          rowSpacing={10}
          direction="row"
          justifyContent="center"
        >
          <Grid item xs={4}>
            <br />
            <Typography variant="h5">Password</Typography>
            <br />
            <Typography variant="subtitle1">
              After changing password, there will be no redirection to any other
              pages.
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Box
              component="form"
              noValidate
              onSubmit={(e) => e.preventDefault()}
              sx={{ mt: 1 }}
            >
              <Typography variant="body1">Change password</Typography>
              <TextField
                autoComplete="current-password"
                autoFocus
                disabled={isChanging}
                fullWidth
                label="New Password"
                margin="normal"
                onChange={onTextFieldChange(setNewPassword)}
                required
                type="password"
                value={newPassword}
              />
              <TextField
                autoComplete="current-password"
                disabled={isChanging}
                fullWidth
                label="Confirm New Password"
                margin="normal"
                onChange={onTextFieldChange(setNewPasswordConfirm)}
                required
                type="password"
                value={newPasswordConfirm}
              />
              {changeError && (
                <Alert severity="error">
                  {changeError.message ?? "Unknow error occurs."}
                </Alert>
              )}
              {isChangingDone && (
                <Alert severity="success">
                  Congratulations! Password changed!
                </Alert>
              )}
              <FormSubmitButton
                disabled={
                  !newPassword ||
                  !newPasswordConfirm ||
                  newPassword !== newPasswordConfirm ||
                  isChanging === true
                }
                loading={isChanging}
                onClick={clickPasswordChangeHandler}
                text="Change Password"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProfilePage;
