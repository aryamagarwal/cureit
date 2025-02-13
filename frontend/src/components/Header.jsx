import {
  BellIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import CureitLogo from "../assets/CureitLogo";
import { useCureitContext } from "../utils/ContextProvider";
import {
  Avatar,
  Box,
  Button,
  DropdownMenu,
  Separator,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./logout";
import { supabase } from "../utils/supabaseClient";
import { useGetUserDetails } from "../hooks/useGetUserDetails";
import { useQueryClient } from "@tanstack/react-query";

function Header() {
  const cureitContext = useCureitContext();
  const { theme, setTheme, profile, setProfile } = cureitContext;
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [tokenString, setTokenString] = useState(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        console.log("User signed out successfully");
        // invalidate query client
        setTokenString(null);
        setProfile(null);
        queryClient.invalidateQueries("userDetails");
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };
  console.log("accessToken", accessToken, "userId", userId);

  useEffect(() => {
    const tokenStringTemp = localStorage.getItem(
      "sb-vakmfwtcbdeaigysjgch-auth-token",
    );
    setTokenString(tokenStringTemp);
    const token = JSON.parse(tokenStringTemp);
    if (token) {
      setAccessToken(token?.access_token);
    }

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      if (error) console.error("Error fetching user:", error);
    };
    fetchUser();
  }, []);

  const {
    isLoading: isLoadingDetails,
    data: dataDetails,
    error: errorDetails,
    refetch: refetchDetails,
    isFetching: isFetchingDetails,
  } = useGetUserDetails(userId, accessToken);

  useEffect(() => {
    // console.log("xxxxxx", dataDetails);

    if (dataDetails) {
      setProfile(dataDetails.profile);
    }
  }, [dataDetails, isLoadingDetails]);

  const name = profile?.name || "";
  const displayName = name.replace("Dr. ", "").split(" ");

  return (
    <div
      // border-b-[1px]
      className={`fixed top-0 z-50 flex h-11 w-full justify-between border-b-[#55555550] bg-[#ffffff00] px-3 backdrop-blur-md transition-all duration-300`}
      style={{
        // boxShadow bottom outline
        boxShadow: scrollPosition > 0 ? "0px 0px 2px 0px #00000050" : "none",
        backgroundColor: scrollPosition > 0 ? "#ffffff50" : "#ffffff00",
      }}
    >
      <div
        className="my-auto w-16 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <CureitLogo fillColor={"#000000"} />
      </div>

      <div className="mx-3 my-auto flex items-center justify-center gap-x-5">
        <div className="flex w-fit gap-x-3">
          <Tooltip content="Home" side="bottom">
            <Button
              onClick={() => navigate("/")}
              color="iris"
              size={"1"}
              variant="ghost"
            >
              <HomeIcon />
            </Button>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip content="Notifications" side="bottom">
            <Button color="iris" size={"1"} variant="ghost">
              <BellIcon />
            </Button>
          </Tooltip>
          <Separator orientation="vertical" />
        </div>
        {!tokenString ? (
          <Button
            color="iris"
            size={"2"}
            variant="ghost"
            style={{
              fontWeight: "500",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        ) : (
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger>
              <Button variant="ghost" color="gray">
                <div className="flex items-center justify-center gap-x-2 font-noto text-sm font-medium">
                  <Avatar
                    color="blue"
                    size={{
                      initial: "1",
                      sm: "1",
                      md: "1",
                    }}
                    radius="full"
                    src={profile?.avatar_url || ""}
                    fallback={displayName[0][0]}
                  />
                  <div className="mr-1 font-semibold">
                    {name.includes("Dr. ") ? "Dr." : ""} {displayName[0]}
                  </div>
                </div>
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-black">
              <DropdownMenu.Item
                shortcut=""
                onClick={() => navigate("/user/dashboard")}
              >
                Dashboard
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                shortcut=""
                onClick={() => navigate("/user/dashboard?tab=profile")}
              >
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                shortcut=""
                onClick={() =>
                  navigate(
                    `/user/dashboard?tab=${
                      profile?.role === "doctor" ? "queue" : "appointments"
                    }`,
                    {},
                  )
                }
              >
                {profile?.role === "doctor" ? "Queue" : "Appointments"}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                shortcut=""
                onClick={() => navigate(`/user/dashboard?tab=history`)}
              >
                History
              </DropdownMenu.Item>
              <DropdownMenu.Separator />

              <DropdownMenu.Item color="red" onClick={handleLogout}>
                <div className="flex w-full items-center justify-between gap-x-3">
                  Sign Out <ExitIcon />
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>
    </div>
  );
}

export default Header;
