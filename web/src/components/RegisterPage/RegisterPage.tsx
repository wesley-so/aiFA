import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { ChangeEventHandler, FC, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";
import { register } from "../../services/aifaAPI/user";
import UserNavigationBar from "../UserNavigationBar/UserNavigationBar";

const RegisterPage: FC = () => {
  const loginUri = useHref("/login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<Error>();

  const navigate = useNavigate();

  const onTextFieldChange = (
    setValue: (value: string) => void
  ): ChangeEventHandler<HTMLInputElement> => {
    return (event) => {
      setValue(event.currentTarget.value);
    };
  };

  const clickRegisterHandler = async (): Promise<void> => {
    console.log(
      `Registerd with username: ${username}, email: ${email} and password: ${password}.`
    );
    try {
      setIsRegistering(true);
      await register(username, email, password, passwordConfirm);
      navigate("/login");
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError &&
        error.response?.status === 400 &&
        error.response?.data?.error
          ? error.response.data.error
          : "Unknown error occurred.";
      setIsRegistering(false);
      setRegisterError(new Error(errorMsg, { cause: error }));
      console.error(error);
    }
  };

  return (
    <>
      <UserNavigationBar />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              autoFocus
              fullWidth
              label="Username"
              margin="normal"
              onChange={onTextFieldChange(setUsername)}
              required
            />
            <TextField
              autoComplete="email"
              fullWidth
              label="Email Address"
              margin="normal"
              onChange={onTextFieldChange(setEmail)}
              required
            />
            <TextField
              autoComplete="current-password"
              error={password !== passwordConfirm}
              fullWidth
              label="Password"
              margin="normal"
              onChange={onTextFieldChange(setPassword)}
              required
              type="password"
            />
            <TextField
              error={password !== passwordConfirm}
              fullWidth
              helperText={
                password !== passwordConfirm
                  ? "Password do not match!"
                  : undefined
              }
              label="Password Confirm"
              margin="normal"
              onChange={onTextFieldChange(setPasswordConfirm)}
              required
              type="password"
            />
            {registerError && (
              <Typography variant="h5">{registerError?.message}</Typography>
            )}
            <Button
              disabled={
                !username.trim() ||
                !email.trim() ||
                !password ||
                !passwordConfirm ||
                password !== passwordConfirm ||
                isRegistering === true
              }
              fullWidth
              type="submit"
              onClick={clickRegisterHandler}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={loginUri} variant="body2">
                  {"Already have account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default RegisterPage;
