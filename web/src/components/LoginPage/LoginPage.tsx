import { Box, Container, Link, TextField, Typography } from "@mui/material";
import { ChangeEventHandler, FC, useState } from "react";
import { useHref } from "react-router-dom";
import useUser from "../../hooks/useUser";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";

const LoginPage: FC = () => {
  const { fetchLogin, loginStatus } = useUser();
  const registerUri = useHref("/register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onTextFieldChange = (
    setValue: (value: string) => void
  ): ChangeEventHandler<HTMLInputElement> => {
    return (event) => {
      setValue(event.currentTarget.value);
    };
  };

  const clickLoginHandler = () => {
    console.log(
      `Clicked login with user ${username} with password ${password}`
    );
    fetchLogin(username, password);
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
        <Typography variant="h5" component="h1">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{ mt: 1 }}
        >
          <TextField
            autoComplete="username"
            autoFocus
            error={loginStatus.loginError !== null}
            fullWidth
            label="Username"
            margin="normal"
            onChange={onTextFieldChange(setUsername)}
            required
            value={username}
          />
          <TextField
            autoComplete="current-password"
            error={loginStatus.loginError !== null}
            fullWidth
            helperText={loginStatus.loginError?.message}
            label="Password"
            margin="normal"
            onChange={onTextFieldChange(setPassword)}
            required
            type="password"
            value={password}
          />
          <FormSubmitButton
            disabled={
              !username.trim() ||
              !password ||
              loginStatus.isLoginPending ||
              loginStatus.isLoggedIn
            }
            loading={loginStatus.isLoginPending}
            onClick={clickLoginHandler}
            text="Sign In"
          />
          <Typography variant="body2" textAlign="end">
            Don&#39;t have an account? <Link href={registerUri}>Register</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
