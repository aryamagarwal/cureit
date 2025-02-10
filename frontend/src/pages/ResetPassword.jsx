import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { AuthApiError } from "@supabase/supabase-js";
import { useCheckLogin } from "../hooks/useCheckLogin";

function ResetPassword() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const sendResetPasswordEmail = async (email) => {
    try {
      const response = await fetch(
        `${API_URL}/api/users/sendResetPasswordEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }
      setSuccessMessage("Reset password email sent successfully");
      console.log("Reset password email sent successfully:", data);
      navigate("/user/resetPasswordEmailSent", {
        state: { email: loginData.email },
      });
    } catch (error) {
      setErrorMessage("Error sending reset password email");
      console.error("Error sending reset password email:", error.message);
    }
  };
  const handlereset = () => {
    console.log("in handle reset");
    sendResetPasswordEmail(loginData.email);
    // const email = loginData.email;
    // if (successMessage)
  };

  return (
    <div className="dotted flex h-screen items-center justify-center">
      <div className="relative my-6 flex w-11/12 flex-col gap-y-4 rounded-md border-2 bg-white p-8 font-inter text-sm font-medium text-[#5d5d5d] shadow-2xl shadow-indigo-300 sm:w-8/12 md:w-6/12 lg:w-4/12">
        <div className="absolute left-3 top-3 -z-10 h-full w-full animate-fade-up rounded-md bg-gradient-to-r from-violet-300 to-indigo-400"></div>
        <div className="mb-2 flex select-none justify-center text-center font-noto text-base font-semibold md:text-lg">
          Reset Password.
        </div>

        <div className="flex flex-col gap-y-1">
          <span className="">Email</span>
          <TextField.Root
            placeholder="Email"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            value={loginData.email}
          ></TextField.Root>
        </div>
        <Button color="iris" size="3" onClick={handlereset}>
          Reset Password
        </Button>

        <div>{errorMessage}</div>
        <div>{successMessage}</div>
        <p
          className="w-fit cursor-pointer select-none border-b border-white text-indigo-700 transition-all duration-200 hover:border-b hover:border-indigo-700"
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Sign Up
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
