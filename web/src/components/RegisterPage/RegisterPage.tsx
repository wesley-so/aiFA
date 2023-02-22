import {
  Alert,
  Box,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { ChangeEventHandler, FC, useState } from "react";
import { useHref } from "react-router-dom";
import { register } from "../../services/aifaAPI/user";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";
import { isEmail } from "../../utils/email";

const RegisterPage: FC = () => {
  const loginUri = useHref("/login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegisterDone, setIsRegisterDone] = useState(false);
  const [registerError, setRegisterError] = useState<Error>();

  const onTextFieldChange = (
    setValue: (value: string) => void
  ): ChangeEventHandler<HTMLInputElement> => {
    return (event) => {
      setValue(event.currentTarget.value);
    };
  };

  const clickRegisterHandler = async (): Promise<void> => {
    console.log(
      `Registering with username: ${username}, email: ${email} and password: ${password}.`
    );
    setIsRegistering(true);
    setIsRegisterDone(false);
    setRegisterError(undefined);
    try {
      await register(username, email, password, passwordConfirm);
      setIsRegisterDone(true);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError &&
        error.response?.status === 400 &&
        error.response?.data?.error
          ? error.response.data.error
          : "Unknown error occurred.";
      setRegisterError(new Error(errorMsg, { cause: error }));
      console.error(error);
    }
    setPassword("");
    setPasswordConfirm("");
    setIsRegistering(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={(e) => e.preventDefault()}
          sx={{ mt: 1 }}
        >
          <TextField
            autoFocus
            disabled={isRegistering}
            fullWidth
            label="Username"
            margin="normal"
            onChange={onTextFieldChange(setUsername)}
            required
          />
          <TextField
            autoComplete="email"
            disabled={isRegistering}
            error={email.length !== 0 && !isEmail(email)}
            fullWidth
            helperText={
              email.length !== 0 && !isEmail(email)
                ? "Invalid Email!"
                : undefined
            }
            label="Email Address"
            margin="normal"
            onChange={onTextFieldChange(setEmail)}
            required
            type="email"
          />
          <TextField
            autoComplete="current-password"
            disabled={isRegistering}
            fullWidth
            label="Password"
            margin="normal"
            onChange={onTextFieldChange(setPassword)}
            required
            type="password"
          />
          <TextField
            disabled={isRegistering}
            error={passwordConfirm.length !== 0 && password !== passwordConfirm}
            fullWidth
            helperText={
              passwordConfirm.length !== 0 && password !== passwordConfirm
                ? "Password do not match!"
                : undefined
            }
            label="Confirm password"
            margin="normal"
            onChange={onTextFieldChange(setPasswordConfirm)}
            required
            type="password"
          />
          {registerError && (
            <Alert severity="error">
              {registerError.message ?? "Unknown error occurs."}
            </Alert>
          )}
          {isRegisterDone && (
            <Alert severity="success">
              Congratulations! Registration complete! <br />
              <Link href={loginUri}>Proceed to login</Link>
            </Alert>
          )}
          <FormSubmitButton
            disabled={
              !username.trim() ||
              !email.trim() ||
              !password ||
              !passwordConfirm ||
              password !== passwordConfirm ||
              isRegistering === true
            }
            loading={isRegistering}
            onClick={clickRegisterHandler}
            text="Register"
          />
          <Typography variant="body2" textAlign="end">
            Already have an account? <Link href={loginUri}>Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
