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
import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { useHref, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import UserNavigationBar from "../UserNavigationBar/UserNavigationBar";

const LoginPage: FC = () => {
  const { fetchLogin, loginStatus } = useUser();
  const registerUri = useHref("/register");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus.isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate, loginStatus.isLoggedIn]);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

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
    <>
      <UserNavigationBar />
      <Container component="main" maxWidth="xs">
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          marginTop={20}
        >
          <Typography variant="h5" component="h1">
            Login
          </Typography>
          <Box component="form" onSubmit={onFormSubmit} sx={{ mt: 1 }}>
            <TextField
              autoComplete="username"
              autoFocus
              error={loginStatus.loginError !== null}
              fullWidth
              helperText={loginStatus.loginError?.message}
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
                loginStatus.isLoginPending ||
                loginStatus.isLoggedIn
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
