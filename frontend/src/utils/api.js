import { supabase } from "../utils/supabaseClient";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAddressFromCoords(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address from coordinates.");
    }

    const data = await response.json();
    console.log(data);

    const address = data.display_name;
    if (!address) {
      throw new Error("No address found for the given coordinates.");
    }

    return address;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch address.");
  }
}

export async function getDoctorSlots(date, specialization, userId) {
  // const userId = appointmentData.userId;
  // const specialization = appointmentData.specialization;
  // const date = appointmentData.date;
  console.log("Get Doctor Slots: ", date, specialization, userId);

  const response = await fetch(
    `${API_URL}/api/doctors/availableSlots/${userId}?specialization=${specialization}&date=${date}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    console.log("error in getDoctorSlots: ", response.status);
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log(data);
  return data;
  // const testData = [
  //   {
  //     name: "Dr. Emily Carter",
  //     hospital: "CityCare General Hospital",
  //     specialization: "Dentist",
  //     available_date: "28-09-2021",
  //     available_time: "10:00 AM - 2:00 PM",
  //     uid: "1",
  //   },
  //   {
  //     name: "Dr. James Rodriguez",
  //     hospital: "Sunrise Medical Center",
  //     specialization: "Dentist",
  //     available_date: "28-09-2021",
  //     available_time: "9:00 AM - 1:00 PM",
  //     uid: "2",
  //   },
  //   {
  //     name: "Dr. Sophia Lee",
  //     hospital: "Harmony Children's Hospital",
  //     specialization: "Dentist",
  //     available_date: "28-09-2021",
  //     available_time: "11:00 AM - 3:00 PM",
  //     uid: "3",
  //   },
  //   {
  //     name: "Dr. Arjun Mehta",
  //     hospital: "Lotus Specialty Clinic",
  //     specialization: "Dentist",
  //     available_date: "01-02-2025",
  //     available_time: "1:00 PM - 5:00 PM",
  //     uid: "4",
  //   },
  //   {
  //     name: "Dr. Olivia Brown",
  //     hospital: "Green Valley Healthcare",
  //     specialization: "Dentist",
  //     available_date: "01-02-2025",
  //     available_time: "2:00 PM - 6:00 PM",
  //     uid: "5",
  //   },
  // ];
}
export async function getProfileDetails(userId) {
  const response = await fetch(`${API_URL}/api/users/userById/${userId}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
export async function getDoctorDetails(doctorId) {
  const response = await fetch(
    `${API_URL}/api/doctors/doctorDetailsById/${doctorId}`,
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
export async function deleteAppointment(appointmentId) {
  const response = await fetch(
    `${API_URL}/api/appointments/delete/${appointmentId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete appointment");
  }

  return response.json();
}
export async function getPatientAppointments(patientId) {
  const today = new Date().toISOString().split("T")[0]; // Formats as YYYY-MM-DD

  try {
    const response = await fetch(
      `${API_URL}/api/appointments/upcomingAppointments/${patientId}?date=${today}`,
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Fetch doctor details for each appointment
    const updatedData = await Promise.all(
      data.map(async (appointment) => {
        try {
          const doctor = await getDoctorDetails(appointment.doctor_id);
          const doctorProfileDetails = await getProfileDetails(
            appointment.doctor_id,
          );
          console.log("Doctor Details:", doctorProfileDetails);
          return {
            ...appointment,
            doctorDetails: doctor,
            doctorProfileDetails: doctorProfileDetails,
          };
        } catch (error) {
          console.error("Failed to fetch doctor details:", error);
          return { ...appointment, doctorDetails: null }; // Avoid breaking the loop
        }
      }),
    );

    // Return an array of appointments with doctor details
    const finalAppointments = updatedData.map((appointment) => ({
      appointmentId: appointment.id,
      doctor: appointment.doctorProfileDetails?.name || "Unknown",
      specialization: appointment.doctorDetails?.specialization || "Unknown",
      hospital: appointment.doctorDetails?.hospital_name || "Unknown",
      appointment_time: appointment.appointment_time?.appointment_time || "N/A",
      appointment_date: appointment.appointment_date,
      queuePosition: appointment.queuePosition || "N/A",
    }));

    return finalAppointments; // Return the array
  } catch (error) {
    console.error("Failed to fetch patient appointments:", error);
    throw new Error("Failed to fetch patient appointments.");
  }
}

export async function getPatientAppointmentHistory(patientId) {
  try {
    const response = await fetch(
      `${API_URL}/api/appointments/completedAppointments/${patientId}`,
    );
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Appointment History:", data);
    const updatedData = await Promise.all(
      data.map(async (appointment) => {
        try {
          const doctor = await getDoctorDetails(appointment.doctor_id);
          const doctorProfileDetails = await getProfileDetails(
            appointment.doctor_id,
          );
          console.log("Doctor Details:", doctorProfileDetails);
          return {
            ...appointment,
            doctorDetails: doctor,
            doctorProfileDetails: doctorProfileDetails,
          };
        } catch (error) {
          console.error("Failed to fetch doctor details:", error);
          return { ...appointment, doctorDetails: null }; // Avoid breaking the loop
        }
      }),
    );

    const finalAppointments = updatedData.map((appointment) => ({
      appointmentId: appointment.id,
      doctor: appointment.doctorProfileDetails?.name || "Unknown",
      specialization: appointment.doctorDetails?.specialization || "Unknown",
      hospital: appointment.doctorDetails?.hospital_name || "Unknown",
      appointment_time: appointment.appointment_time?.appointment_time || "N/A",
      appointment_date: appointment.appointment_date,
    }));

    return finalAppointments;
  } catch (error) {
    console.error("Failed to fetch patient appointments:", error);
    throw new Error("Failed to fetch patient appointments.");
  }
}

export async function getQueueForDoctor(doctorId) {
  const today = new Date().toISOString().split("T")[0]; // Formats as YYYY-MM-DD

  try {
    const response = await fetch(
      `${API_URL}/api/appointments/doctorUpcomingAppointments/${doctorId}?date=${today}`,
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const doctorProfileDetails = await getDoctorDetails(doctorId);
    const finalData = await Promise.all(
      data.map(async (appointment) => {
        return {
          appointmentId: appointment.id,
          patientId: appointment.patient_id,
          patientName: appointment.personal_details.name,
          age: appointment.personal_details.age,
          gender: appointment.personal_details.gender,
          hospital: doctorProfileDetails.hospital_name,
          appointment_date: appointment.appointment_date,
          queuePosition: appointment.queuePosition,
          currentMedication: "N/A",
          issue: "N/A",
          issueDetails: appointment.personal_details.health_issue,
          appointment_time: "N/A",
        };
      }),
    );
    return finalData;
  } catch (error) {
    console.error("Failed to fetch queue for doctor:", error);
    throw new Error("Failed to fetch queue for doctor.");
  }
  // const testData = [
  //   {
  //     patiendId: 1,
  //     patientName: "John Doe",
  //     age: 25,
  //     gender: "Male",
  //     issue: "Toothache",
  //     issueDetails:
  //       "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
  //     currentMedication: "Crocin 500mg, Budamate 200mg",
  //     appointment_date: "28-09-2025",
  //     appointment_time: "10:00 AM - 2:00 PM",
  //     hospital: "CityCare General Hospital",
  //     uid: "132",
  //     queuePosition: 123,
  //   },
  //   {
  //     patiendId: 2,
  //     patientName: "Jane Doe",
  //     age: 25,
  //     gender: "Male",
  //     issue: "Toothache",
  //     issueDetails:
  //       "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
  //     currentMedication: "Crocin 500mg, Budamate 200mg",
  //     appointment_date: "28-09-2025",
  //     appointment_time: "9:00 AM - 1:00 PM",
  //     hospital: "CityCare General Hospital",
  //     uid: "2",
  //     queuePosition: 3,
  //   },
  //   {
  //     patiendId: 1,
  //     patientName: "John Doe",
  //     age: 25,
  //     gender: "Male",
  //     issue: "Toothache",
  //     issueDetails:
  //       "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
  //     currentMedication: "Crocin 500mg, Budamate 200mg",
  //     appointment_date: "28-09-2025",
  //     appointment_time: "11:00 AM - 3:00 PM",
  //     hospital: "CityCare General Hospital",
  //     uid: "3",
  //     queuePosition: 141,
  //   },
  // ];
  // return testData;
}

export async function getHistoryForDoctor(doctorId) {
  try {
    const response = await fetch(
      `${API_URL}/api/appointments/doctorCompletedAppointments/${doctorId}`,
    );
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const doctorProfileDetails = await getDoctorDetails(doctorId);
    const finalData = await Promise.all(
      data.map(async (appointment) => {
        return {
          appointmentId: appointment.id,
          patientId: appointment.patient_id,
          patientName: appointment.personal_details.name,
          age: appointment.personal_details.age,
          gender: appointment.personal_details.gender,
          hospital: doctorProfileDetails.hospital_name,
          appointment_date: appointment.appointment_date,
          queuePosition: "N/A",
          currentMedication: "N/A",
          issue: "N/A",
          issueDetails: appointment.personal_details.health_issue,
          appointment_time: "N/A",
        };
      }),
    );
    return finalData;
  } catch (error) {
    console.error("Failed to fetch patient appointments:", error);
    throw new Error("Failed to fetch patient appointments.");
  }
  // const testData = [
  //   {
  //     patiendId: 1,
  //     patientName: "John Doe",
  //     age: 25,
  //     gender: "Male",
  //     issue: "Toothache",
  //     issueDetails:
  //       "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
  //     currentMedication: "Crocin 500mg, Budamate 200mg",
  //     appointment_date: "28-09-2025",
  //     appointment_time: "10:00 AM - 2:00 PM",
  //     hospital: "CityCare General Hospital",
  //     uid: "132",
  //     queuePosition: 123,
  //     doctorPrescription: `## Medical Prescription Report
  //                           **Patient Name:** John Doe
  //                           **Age:** 45
  //                           **Gender:** Male
  //                           **Date:** 2025-02-02

  //                           ## Diagnosis
  //                           - Hypertension
  //                           - Type 2 Diabetes Mellitus

  //                           ## Prescriptions
  //                           | Medication          | Dosage          | Frequency         | Duration  |
  //                           |---------------------|-----------------|-------------------|-----------|
  //                           | Amlodipine 5mg      | 1 tablet        | Once daily (AM)   | 1 month   |
  //                           | Metformin 500mg     | 1 tablet        | Twice daily (AM/PM) | 1 month   |
  //                           | Atorvastatin 10mg   | 1 tablet        | Nightly (PM)      | 1 month   |

  //                           ## Instructions
  //                           - Maintain a low-sodium diet.
  //                           - Monitor blood sugar levels daily.
  //                           - Engage in moderate exercise for 30 minutes/day.

  //                           ## Notes
  //                           - Follow up in 4 weeks with updated blood pressure and glucose readings.

  //                           **Doctor's Name:** Dr. Emily Carter
  //                           **Contact:** (123) 456-7890
  //                           **Signature:** ______________________`,
  //     doctorRemarks: ``
  //   },
  //   {
  //     patiendId: 2,
  //     patientName: "Jane Doe",
  //     age: 25,
  //     gender: "Male",
  //     issue: "Toothache",
  //     issueDetails:
  //       "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
  //     currentMedication: "Crocin 500mg, Budamate 200mg",
  //     appointment_date: "28-09-2025",
  //     appointment_time: "9:00 AM - 1:00 PM",
  //     hospital: "CityCare General Hospital",
  //     uid: "2",
  //     queuePosition: 3,
  //     doctorPrescription: ``,
  //     doctorRemarks: ``
  //   },
  //   {
  //     patiendId: 1,
  //     patientName: "John Doe",
  //     age: 25,
  //     gender: "Male",
  //     issue: "Toothache",
  //     issueDetails:
  //       "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
  //     currentMedication: "Crocin 500mg, Budamate 200mg",
  //     appointment_date: "28-09-2025",
  //     appointment_time: "11:00 AM - 3:00 PM",
  //     hospital: "CityCare General Hospital",
  //     uid: "3",
  //     queuePosition: 141,
  //     doctorPrescription: `Crocin 500mg, Budamate 200mg`,
  //     doctorRemarks: ``
  //   },
  // ];
}
export async function postBookAppointment(bookingData) {
  const formData = bookingData.formData;
  const patientId = bookingData.patientId;
  const response = await fetch(`${API_URL}/api/appointments/book/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientId: patientId, //logged in user's id will come here
      doctorId: formData.selectedDoctor.id,
      appointment_date: formData.selectedDate.split("-").reverse().join("-"),
      book_status: "completed",
      personal_details: JSON.stringify({
        name: formData.fullName,
        address: formData.address,
        age: formData.age,
        gender: formData.gender,
        health_issue: formData.healthIssue,
      }),
    }),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log(data);
}
export async function getDoctorType(healthIssue) {
  console.log("in side ml");
  console.log(healthIssue);
  try {
    const response = await fetch(`https://hackofiesta.onrender.com/predict/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: healthIssue,
      }),
    });
    if (!response.ok) {
      console.log(response.status);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("docotor type: ", data);
    return data.predicted_specialist;
  } catch (error) {
    console.error("Failed to fetch doctor type:", error);
    throw new Error("Failed to fetch doctor type.");
  }
}

export async function logIn(loginData) {
  console.log("Attempting log-in...");
  console.log(loginData);
  const { email, password } = loginData;
  console.log("email :", email);
  console.log("pasword :", password);

  // try {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // }

  if (error) {
    // Throw an error to tigger onError
    throw new Error(error.message || "Login failed");
  }
  return data;

  // return data;
}

export async function getUserRoleById(userId, accessToken) {
  const response = await fetch(`${API_URL}/api/users/getRole/${userId}`, {
    method: "GET", // Use POST method to send data
    headers: {
      Authorization: `Bearer ${accessToken}`, // Send the token as part of the header
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch role");
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function getCurrentActiveUser() {
  console.log("Attempting log-in...");
  const { error, data } = await supabase.auth.getUser();
  // console.log("in api", data);
  return data;
}

export async function signUpNewUser(userData) {
  const apiUrl = `${API_URL}/api/users/addUserIfNotExist`;
  console.log(apiUrl);
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const result = await response.json();
}

export async function getUserDetailsByID(userId, accessToken) {
  const response = await fetch(`${API_URL}/api/users/getUserById/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // Send the token as part of the header
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user data");

  const data = await response.json();
  return data;
}

export async function updateUserDetailsById(
  userId,
  accessToken,
  editedProfile,
) {
  const response = await fetch(`${API_URL}/api/users/updateDetails/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Include token
    },
    body: JSON.stringify(editedProfile),
  });
  const data = await response.json(); // Parse response JSON
  // console.log("Updated User:", data);

  // console.log("User updated successfully:", data);
  // fetchUserProfile();

  return data;
}

export async function updateUserProfilePicture(userId, accessToken, formData) {
  console.log("in api", formData.file);
  const response = await fetch(`${API_URL}/api/uploadProfiles/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Include token
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error uploading file");
  }

  const data = await response.json();
  return data;
}

export async function chatBot(message) {
  const response = await fetch(
    `https://hackofiesta-1.onrender.com/faq/?query="${message}"`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chatbot response");
  }

  const data = await response.json();
  return data;
}

export async function getDoctorProfileDetails(userId, accessToken) {
  // console.log(accessToken);
  console.log("in api:", userId);
  const response = await fetch(
    `${API_URL}/api/doctorProfileRoutes/getDoctorDetailsById/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Include token
      },
    },
  );

  if (!response.ok) return Error("Failed to fetch user data");

  const data = await response.json();
  console.log(data);
  return data;
}
