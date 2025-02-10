import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button, TextField } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";
import { supabase } from "../utils/supabaseClient";
import { isValid } from "date-fns";

function ResetPage() {
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
    token: "",
  });
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    const tokenString = localStorage.getItem(
      "sb-vakmfwtcbdeaigysjgch-auth-token",
    );
    if (tokenString) {
      const token = JSON.parse(tokenString);
      setResetData((prevData) => ({ ...prevData, token: token.access_token }));
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const { mutate, onSuccess, onError } = useResetPassword();

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPasswordRequest = async (token, password) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("successful password update");
      navigate("/login");
    }
  };

  const validateField = (name, value) => {
    let isValid = false;

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    } else if (name === "phoneNumber") {
      const phoneRegex = /^[6-9]\d{9}$/;
      isValid = phoneRegex.test(value);
    } else if (name === "aadhaarNumber") {
      const aadhaarRegex = /^\d{12}$/;
      isValid = aadhaarRegex.test(value);
    } else if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      isValid = passwordRegex.test(value);
    } else if (name === "name") {
      // isValid = true;
      return;
    } else if (name === "confirmPassword") {
      console.log("in confirmPassword", " ", value, " ", resetData.password);
      // isValid = true;
      if (resetData.password === value) {
        // return true;
        isValid = true;
      } else {
        isValid = false;
      }
    }
    setValidation((prev) => ({ ...prev, [name]: isValid }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    console.log(name, " ", value);
    validateField(name, value);
  };

  const [validation, setValidation] = useState({
    password: null,
    confirmPassword: null,
  });

  const handleResetPassword = () => {
    console.log("in rese pasword 0,", resetData);
    console.log(resetData.token, resetData.password);
    handleResetPasswordRequest(resetData.token, resetData.password);
  };
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    console.log(validation);
    setIsFormValid(Object.values(validation).every(Boolean));
    console.log(validation);
  }, [validation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));

    // Clear previous timer
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timer for 2 seconds for validation
    const newTimeout = setTimeout(() => {
      validateField(name, value);
    }, 500);

    setTypingTimeout(newTimeout);
  };
  return (
    <div className="dotted flex h-screen items-center justify-center">
      <div className="relative my-6 flex w-11/12 flex-col gap-y-4 rounded-md border-2 bg-white p-8 font-inter text-sm font-medium text-[#5d5d5d] shadow-2xl shadow-indigo-300 sm:w-8/12 md:w-6/12 lg:w-4/12">
        <div className="absolute left-3 top-3 -z-10 h-full w-full animate-fade-up rounded-md bg-gradient-to-r from-violet-300 to-indigo-400"></div>
        <div className="mb-2 flex select-none justify-center text-center font-noto text-base font-semibold md:text-lg">
          Welcome back to CureIt.
        </div>

        <div className="flex flex-col gap-y-1">
          <span className="">Password</span>
          <TextField.Root
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onBlur={handleBlur}
            name="password"
            onChange={handleChange}
            value={resetData.password}
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
        {validation.password === false && (
          <p className="mt-2 text-red-500">
            Password must be at least 8 characters long, include an uppercase
            letter, a lowercase letter, a number, and a special character.
          </p>
        )}

        <div className="flex flex-col gap-y-1">
          <span className="">Confirm Password</span>
          <TextField.Root
            type={showPassword2 ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            value={resetData.confirm_password}
          >
            <TextField.Slot className="relatives">
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
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </Button>
            </TextField.Slot>
          </TextField.Root>
        </div>
        {validation.confirmPassword === false && (
          <p className="mt-2 text-red-500">
            Oops! The passwords don’t match. Make sure both fields are the same.
          </p>
        )}
        <Button
          color="iris"
          size="3"
          onClick={handleResetPassword}
          disabled={!isFormValid}
        >
          Confirm Reset Password
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

export default ResetPage;
