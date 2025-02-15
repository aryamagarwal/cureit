import { Theme } from "@radix-ui/themes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import BookAppointment from "./pages/BookAppointment";
import AccountVerification from "./pages/AccountVerification";
import AccountVerified from "./pages/AccountVerified";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard.jsx";
import ResetPasswordEmailSent from "./pages/ResetPasswordEmailSent";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { useCureitContext } from "./utils/ContextProvider";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import SingleFeaturePageChatbot from "./pages/SingleFeaturePageChatbot";
import SingleFeaturePageMedSpecRec from "./pages/SingleFeaturePageMedSpecRec";
import SingleFeaturePageFeedback from "./pages/SingleFeaturePageFeedback";

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/signup",
          element: <SignUpPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/verification",
          element: <AccountVerification />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/verified",
          element: <AccountVerified />,
          errorElement: <ErrorPage />,
        },
        // {
        //   path: "/bookappointment",
        //   element: <BookAppointment />,
        //   // path: "/user/dashboard",
        //   // element: <UserDashboard />,
        //   errorElement: <ErrorPage />,
        // },
        {
          element: <ProtectedRoutes />,
          children: [
            {
              path: "/bookappointment",
              element: <BookAppointment />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/user/dashboard/",
              element: <Dashboard />,
              errorElement: <ErrorPage />,
            },
          ],
        },
        // {
        //   path: "/user/dashboard",
        //   element: <UserDashboard />,
        //   errorElement: <ErrorPage />,
        // },
        // {
        //   path: "/user/dashboard",
        //   element: <UserDashboard />,
        //   errorElement: <ErrorPage />,
        // },
        {
          path: "/user/resetPassword",
          element: <ForgotPassword />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/user/resetPasswordEmailSent",
          element: <ResetPasswordEmailSent />,
          errorElement: <ErrorPage />,
        },
        {
          path: "user/resetPassEnterEmail",
          element: <ResetPassword />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/featureAIChatbot",
          element: <SingleFeaturePageChatbot />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/featureAIRecommendation",
          element: <SingleFeaturePageMedSpecRec />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/featureAIFeedback",
          element: <SingleFeaturePageFeedback />,
          errorElement: <ErrorPage />,
        },
      ],
    },
  ],
  {
    basename: "/cureit",
  },
);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <div data-lenis-prevent="true">
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
