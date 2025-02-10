import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { AuthApiError } from "@supabase/supabase-js";
import { useCheckLogin } from "../hooks/useCheckLogin";
import { useQueryClient } from "@tanstack/react-query";

function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate, onSuccess, onError } = useCheckLogin();

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    mutate.mutate(loginData, {
      onSuccess: (data) => {
        console.log("Login Success:", data);
        // if (data.user) {
        setSuccessMessage("Logging in....");
        // navigate("/user/dashboard"); // Redirect on success
        window.location.href = "/user/dashboard";
        queryClient.invalidateQueries("userDetails");
        // } else {
        //   setErrorMessage("Wrong credentials. Please Try Again.");
        // }
      },
      onError: (error) => {
        console.error("Login Error:", error);
        setErrorMessage("Wrong credentials. Please Try Again.");
        window.alert("Wrong credentials. Please Try Again.");
        // setErrorMessage("Wrong credentials. Please Try Again.");
      },
    });
  };

  return (
    <div className="dotted flex h-screen items-center justify-center">
      <div className="relative my-6 flex w-11/12 flex-col gap-y-4 rounded-md border-2 bg-white p-8 font-inter text-sm font-medium text-[#5d5d5d] shadow-2xl shadow-indigo-300 sm:w-8/12 md:w-6/12 lg:w-4/12">
        <div className="absolute left-3 top-3 -z-10 h-full w-full animate-fade-up rounded-md bg-gradient-to-r from-violet-300 to-indigo-400"></div>
        <div className="mb-2 flex select-none justify-center text-center font-noto text-base font-semibold md:text-lg">
          Welcome back to CureIt.
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

        <div className="flex flex-col gap-y-1">
          <span className="">Password</span>
          <TextField.Root
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            value={loginData.password}
          >
            <TextField.Slot className="relative">
              <Button
                variant="soft"
                color="gray"
                style={{
                  left: "0",
                  top: "0",
                  bottom: "0",
                  padding: "0 10px",
                  marginLeft: "-7px",
                  borderRadius: "4px 0 0 4px",
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </Button>
            </TextField.Slot>
          </TextField.Root>
        </div>
        <Button color="iris" size="3" onClick={handleSignIn}>
          Login
        </Button>

        <div>{errorMessage}</div>
        <div>{successMessage}</div>
        <p
          className="w-fit cursor-pointer select-none border-b border-white text-indigo-700 transition-all duration-200 hover:border-b hover:border-indigo-700"
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Sign Up
        </p>
        <p
          className="w-fit cursor-pointer select-none border-b border-white text-indigo-700 transition-all duration-200 hover:border-b hover:border-indigo-700"
          onClick={() => navigate("/user/resetPassEnterEmail")}
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
