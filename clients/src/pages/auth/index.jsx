import SignInPage from "./SignInPage/SignInPage";
import SignUpPage from "./SignUpPage/SignUpPage";
import ResetPage from "./ResetPassword/ResetPassword";

const flatRoutes = [
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/reset", element: <ResetPage /> },
];

export default {
  flat: flatRoutes,
};
