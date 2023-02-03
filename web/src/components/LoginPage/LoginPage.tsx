import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, FC, useState } from "react";
import { useHref } from "react-router-dom";
import useUser from "../../hooks/useUser";
import UserNavigationBar from "../UserNavigationBar/UserNavigationBar";

const LoginPage: FC = () => {
  const userContext = useUser();
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
    userContext.fetchLogin(username, password);
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
          <Typography variant="h5" component="h1">
            Login
          </Typography>
          <Box component="div" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={onTextFieldChange(setUsername)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onTextFieldChange(setPassword)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={
                !username.trim() ||
                !password ||
                userContext.loginStatus.isLoginPending ||
                userContext.loginStatus.isLoggedIn
              }
              onClick={clickLoginHandler}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={registerUri} variant="body2">
                  {"Don't have an account? Register "}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
