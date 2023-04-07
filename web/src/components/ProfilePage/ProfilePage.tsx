import {
  Alert,
  Box,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, FC, useEffect, useState } from "react";
import { changePassword } from "../../services/aifaAPI/user";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";
import { AxiosError } from "axios";
import { getSessionToken } from "../../services/session";
import useUserProfile from "../../hooks/useUserProfile";

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
      `Change password with new password: ${newPassword}, and new password confirmed: ${newPasswordConfirm}.`
    );
    setIsChanging(true);
    setIsChangingDone(false);
    setChangeError(undefined);
    try {
      const token = getSessionToken();
      if (token) {
        await changePassword(token, newPassword);
        setIsChangingDone(true);
      }
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

  const token = getSessionToken();
  const { user, isLoading, fetch, error, success } = useUserProfile(
    token ?? ""
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Container component="main" maxWidth="md">
      <Grid
        alignItems="flex-start"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        container
        spacing={2}
        rowSpacing={10}
        direction="row"
        justifyContent="center"
        padding="26px"
      >
        {isLoading && (
          <Grid item>
            <CircularProgress />
          </Grid>
        )}
        {!isLoading && !success && (
          <Grid item>
            <Typography variant="h5">{error}</Typography>
          </Grid>
        )}
        {success && (
          <>
            <Grid item xs={4}>
              <Typography variant="h5">User Information</Typography>
              <br />
              <Typography variant="body1">
                User cannot change their username or email.
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl disabled fullWidth>
                <InputLabel htmlFor="component-outlined">Username</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  value={user?.username}
                  label="Username"
                />
              </FormControl>
              <br />
              <br />
              <FormControl disabled fullWidth>
                <InputLabel htmlFor="component-outlined">Email</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  value={user?.email}
                  label="Email"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5">Change password</Typography>
              <br />
              <Typography variant="subtitle1">
                After changing password, there will be no redirection to any
                other pages.
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Box
                component="form"
                noValidate
                onSubmit={(e) => e.preventDefault()}
                sx={{ mt: 1 }}
              >
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
          </>
        )}
      </Grid>
    </Container>
  );
};

export default ProfilePage;
