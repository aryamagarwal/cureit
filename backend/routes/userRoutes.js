const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const verifyToken = require("../config/verifyToken");
const sendOtp = require("../services/OtpService");
const validateOtp = require("../services/validateOtpService");
// const verifyToken = async (req, res, next) => {
//   // console.log(req.headers.authorization);
//   const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
//   console.log("in verify token", token);
//   // console.log("in access token");
//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   try {
//     const { data: user, error } = await supabase.auth.getUser(token);

//     if (error || !user) {
//       return res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }

//     req.user = user; // Attach user info to request
//     next(); // Proceed to next middleware or route
//   } catch (error) {
//     res.status(500).json({ error: "Server error verifying token" });
//   }
// };

// router.post("/register", async (req, res) => {
//   console.log("Hit /register route");
//   const { email, mobile, password, name, role } = req.body;
//   if (!email || !mobile || !password || !name || !role) {
//     console.log("Missing fields in request body");
//     return res.status(400).json({ error: "All fields are required" });
//   }
//   console.log("Request body:", req.body);
//   try {
//     const { data, error } = await supabase.from("users").insert([
//       {
//         email: email,
//         full_name: name,
//         role: role,
//         phone_number: mobile,
//       },
//     ]).select("*").single();
//     if (error) {
//       console.error("Error inserting user into Supabase:", error);
//       return res.status(400).json({ error: error.message });
//     }
//     console.log("Inserted user:", data);
//     res.status(201).json({ message: "User registered successfully", user: data });
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     res.status(500).json({ error: "Internal server error" });
// const User = require("../models/user");

// const { createClient } = require("@supabase/supabase-js");
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );
//later this route can be used as forgot password route
router.get("/sendOtp/:id", async (req, res) => {
  const { id } = req.params;
  const info = await sendOtp(id);
  res.json({ info });
});
//later this route can be used with forgot password route
router.get("/validateOtp/:id", async (req, res) => {
  const id = req.params.id;
  const { otp } = req.query;
  const info = await validateOtp(id, otp);
  res.json({ info });
});
router.get("/allusers", async (req, res) => {
  const { data, error } = await supabase.from("user").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

router.get("/userById/:Id", async (req, res) => {
  const { Id } = req.params;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", Id)
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error(error);

      return res.status(400).json({ error: "Error checking email" });
    }

    if (data) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/check-verified", async (req, res) => {
  const { email } = req.body;
  const { data, error } = await supabase
    .from("profiles")
    .select("email_verified") // Fetch the text field
    .eq("email", email)
    .maybeSingle(); // Ensures single or null result

  if (error) {
    return res.status(400).json({ error: "Error checking email verification" });
  }

  if (!data) {
    return res.status(404).json({ message: "User not found" });
  }

  // Ensure text values are correctly converted to boolean
  const isVerified = data.email_verified === "true";

  return res.status(200).json({ verified: isVerified });
});

router.post("/check-phone", async (req, res) => {
  const { phone } = req.body;
  console.log(phone);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();

    if (error) {
      console.error(error);

      return res.status(400).json({ error: "Error checking email" });
    }

    if (data) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-auth-email-pass", async (req, res) => {
  const { old_email, new_email, new_password } = req.body;
  console.log(old_email, " ", new_email);

  try {
    // Fetch the user ID from auth.users based on the phone number
    const { data: users, error: fetchError } =
      await supabase.auth.admin.listUsers();

    if (fetchError) {
      console.error(fetchError);
      return res.status(400).json({ error: "Error fetching user list" });
    }
    //FINDING OL EMAIL's D USER ID
    const user = users.users.find((u) => u.email === old_email);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User with this email not found" });
    }
    // Use Supabase Admin API to update the email in auth.user table
    const { data, error: updateError } =
      await supabase.auth.admin.updateUserById(user.id, {
        email: new_email,
        password: new_password,
        // email_confirm: false,
        // user_metadata: { force_email_confirmation: true },
      });

    if (updateError) {
      // console.log(updateError);
      console.error(updateError);
      return res.status(400).json({ error: "Error updating email" });
    }
    // return res
    //   .status(200)
    //   .json({ message: "Email updated successfully", data });

    //profile table changed too
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        email: new_email,
        // password: new_password, // Make sure the password is hashed before storing it
      })
      .eq("id", user.id); // Match by user id

    if (profileError) {
      console.error(profileError);
      return res.status(400).json({ error: "Error updating profile" });
    }

    // //update user by id
    // const { data: updateData, error: updateErrorr } =
    //   await supabaseAdmin.auth.admin.updateUserById(user.id, {
    //     email_confirm: false,
    //     user_metadata: { ...userData.user.user_metadata, force_reverify: true },
    //   });
    // if (updateErrorr) throw updateErrorr;

    //send email
    // const { data1, error } = await supabase.auth.resend({
    //   type: "signup", // This is for email verification
    //   email: new_email,
    //   // options: {
    //   //   emailRedirectTo: '' // Optional redirect URL
    //   // }
    // });

    // if (error) {
    //   return res
    //     .status(400)
    //     .json({ error: "Error sending verification email" });
    // } else {
    //   console.log(data1);
    // }

    return res
      .status(200)
      .json({ message: "Email and password updated successfully", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/user", async (req, res) => {
  const { data, error } = await supabase.from("user").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

router.put("/update-user-details", async (req, res) => {
  try {
    // Extract fields from the request body
    const { id, age, gender, phoneNumber, phone_verified, name } = req.body;

    // Validate that 'id' is provided
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Construct the dynamic update query
    let updateFields = {};
    if (age !== undefined) updateFields.age = age;
    if (gender !== undefined) updateFields.gender = gender;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    if (phone_verified !== undefined)
      updateFields.phone_verified = phone_verified;
    if (name !== undefined) updateFields.name = name;

    // Check if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Execute update query
    const { data, error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: "Database update failed", error });
    }

    res.json({ message: "User details updated successfully", data });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/addUserIfNotExist", async (req, res) => {
  console.log("in backendP");
  console.log(req.body);
  const {
    id,
    email,
    name,
    phoneNumber,
    password,
    aadhaarNumber,
    emailVerified,
    createdAt,
  } = req.body;
  const { data, error } = await supabase.from("profiles").insert([
    {
      id,
      email,
      name,
      phone_number: phoneNumber,
      // password, // ⚠ Consider hashing before storing
      aadhar_number: aadhaarNumber,
      email_verified: emailVerified,
      created_at: createdAt || new Date().toISOString(),
    },
  ]);
  console.log(data, " ", error);

  if (error) {
    console.error("Insert error:", error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ message: "Profile created successfully", data });
});

router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Get all users (requires Service Role Key)
    const { data: users, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError) {
      return res.status(400).json({ error: "Error retrieving users" });
    }

    // Find the user by email manually
    const user = users.users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Resend email confirmation
    // const { data, error } = await supabase.auth.admin.resendEmail(email);
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      console.error("Error resending email:", error);
    } else {
      console.log("Confirmation email resent:", data);
    }

    if (error) {
      throw error;
    }

    res.json({ message: "Verification email resent successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
  should return an object containing
    1)email
    2)name
    3)profile pic
    4)address
    5)age
    6)gender
    7)phone 
    8)phone confirmed or not
*/

router.get("/getUserById/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  const id = userId;
  console.log(req.params);

  console.log(userId);
  // Return the user data
  // return res.json({ user });

  // Fetch user profile from public.profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (profileError) {
    return res.status(500).json({ error: "Profile fetch failed" });
  }
  return res.json({ profile });
});

router.put("/updateDetails/:id", verifyToken, async (req, res) => {
  const id = req.params;
  const userId = id.id;
  console.log(userId);

  const { name, address, age, gender } = req.body;
  // console.log(req.body);
  console.log(
    "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
  );
  console.log("in update user backend", userId);

  // Ensure user can only update their own profile
  // console.log(req.body.userId, " ", id);
  // if (req.body.userId !== id) {
  //   return res
  //     .status(403)
  //     .json({ error: "Forbidden: Cannot update other users" });
  // }

  try {
    console.log("request to update user recieved");
    const { data, error } = await supabase
      .from("profiles")
      .update({ name, address, age, gender })
      .eq("id", userId);
    console.log("request to update user completed");

    if (error) {
      console.log(error);
      throw error;
    }

    console.log(data);
    return res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/getRole/:userId", verifyToken, async (req, res) => {
  // console.log("hhhhhh", req.params);
  const { userId } = req.params;
  console.log(userId);
  console.log(req.body);
  console.log("in getRole", userId);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role") // Pass 'role' as a string
      .eq("id", userId);

    if (error) {
      console.log(error);
      // console.log(data);
      throw error;
    }
    // console.log(data);
    return res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/sendResetPasswordEmail", async (req, res) => {
  // console.log("hhhhhh", req.params);
  const { email } = req.body;
  console.log(email);
  console.log(req.body);
  console.log("in updatePasswordEmail", email);

  if (!email) {
    console.log(" email not found");
    return "Email not found";
  }
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/user/resetPassword",
    });

    if (error) {
      console.log(error);
      // console.log(data);
      throw error;
    }
    // console.log(data);
    return res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/updatePassword", verifyToken, async (req, res) => {
  // console.log("hhhhhh", req.params);
  const { new_password } = req.body;
  const password = new_password;
  console.log("22222222222222222222222222222222", password);
  console.log(req.body);
  console.log("in updatePassword", password);

  if (!password) {
    console.log("password cannot be null");
    return "password cannot be null";
  }
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.log(error);
      // console.log(data);
      throw error;
    }
    // console.log(data);
    return res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    return { error: error.message };
  }
});

module.exports = router;
