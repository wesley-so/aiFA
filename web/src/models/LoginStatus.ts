interface LoginStatus {
  isLoginPending: boolean;
  isLoggedIn: boolean;
  loginError?: Error | null;
}

export default LoginStatus;
