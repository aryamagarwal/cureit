//use mutations
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPassword } from "../utils/api";
export function useResetPassword() {
  console.log("in reset password2");
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: ({ token, password }) => {
      console.log("password new: ", password);
      return resetPassword(token, password);
    },
    onSuccess: (data) => {
      console.log("Password reset successfully");
    },
    onError: (error) => {
      console.log("Password reset unsucessfully", error);
    },
  });
  return { mutate };
}
