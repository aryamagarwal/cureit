import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingProcessGuide from "../components/BookingProcessGuide";
import BookingFormPersonalDetails from "../components/BookingFormPersonalDetails";
import useGetDoctorSlots from "../hooks/useGetDoctorSlots";
import useGetDoctorType from "../hooks/useGetDoctorType";
import { BarLoader } from "react-spinners";
import BookingFormSelectSlots from "../components/BookingFormSelectSlots";
import BookingFormReviewData from "../components/BookingFormReviewData";
import { toast } from "sonner";
import Loader from "../components/Loader";
import usePostBookAppointment from "../hooks/usePostBookAppointment";
import { useAuthContext } from "../utils/ContextProvider";
function BookAppointment() {
  const user = useAuthContext();
  const [patientId, setPatientId] = useState(null);
  useEffect(() => {
    if (user.currentUser != null) {
      setPatientId(user.currentUser.id);
      // console.log(user.currentUser.id);
    }
  }, [user]);
  // if(user.currentUser.id)
  // {
  //   // patientId =user.currentUser.id;
  // // console.log(user.currentUser.id);
  // patientId = user.currentUser.id;
  // }
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    healthIssue:
      "",
    age: "",
    gender: "",
    selectedDoctor: null,
    selectedDate: null,
  });
  const navigate = useNavigate();
  const [formState, setFormState] = useState(0); // 0: Guide, 1: Personal Details, 2: Select Doctor, 3: Review Data

  function handleNext() {
    setFormState((prev) => prev + 1);
  }
  function handlePrev() {
    setFormState((prev) => prev - 1);
  }

  const {
    isLoading: isLoadingDoctorType,
    data: dataDoctorType,
    error: errorDoctorType,
  } = useGetDoctorType(formState === 2 ? formData.healthIssue : null); // Fetch doctor type based on health issue using ML model
  const {
    isLoading: isLoadingSlots,
    data: dataSlots,
    error: errorSlots,
    refetch: refetchSlots,
    isFetching: isFetchingSlots,
  } = useGetDoctorSlots(
    formState === 2 ? { formData, patientId, dataDoctorType } : null,
  ); // Fetch doctor slots based on selected doctor type

  // console.log(isLoadingDoctorType, isLoadingSlots);

  const [doctorSlots, setDoctorSlots] = useState([]);
  const [bookingSuccessful, setBookingSuccessful] = useState(false);

  // Filter doctor slots based on selected date
  useEffect(() => {
    // && !formData.selectedDate
    if (dataSlots) {
      setDoctorSlots(dataSlots);
    }
    // else {
    //   setDoctorSlots(
    //     dataSlots?.filter(
    //       (slot) => slot.available_date === formData.selectedDate,
    //     ),
    //   );
    // }
  }, [dataSlots, formData.selectedDate]);

  const canProceed = () => {
    if (formState === 0) return true;
    if (formState === 1) {
      if (
        formData.fullName === "" ||
        formData.address === "" ||
        formData.healthIssue === "" ||
        formData.age === ""
      )
        return false;
      return true;
    }
    if (formState === 2) {
      if (!formData.selectedDoctor || !formData.selectedDate) return false;
      return true;
    }
    if (formState === 3) return true;
  };

  // // console.log(formData);
  // const base =import.meta.env.VITE_API_BASE_URL;
  const { mutate: bookAppointment } =
    usePostBookAppointment(setBookingSuccessful);
  const onBookAppointment = () => {
    bookAppointment.mutate({ formData, patientId });
  };
  // // console.log(isFetchingSlots);
  // console.log(isLoadingDoctorType, isLoadingSlots, isFetchingSlots);
  // console.log("isLoadingDoctorType", isLoadingDoctorType);
  // console.log("isLoadingSlots", isLoadingSlots);
  // console.log("isFetchingSlots", isFetchingSlots);

  return (
    <>
      {(isLoadingDoctorType || isLoadingSlots || isFetchingSlots) && <Loader />}

      <div
        className="w-full border-2 border-indigo-600 transition-all duration-700"
        style={{
          width: formState === 0 ? "0%" : `${(formState / 3) * 100}%`,
          position: "fixed",
          top: "45px",
          zIndex: "10",
        }}
      ></div>

      <div className="dotted mt-0 flex min-h-screen flex-col items-center justify-center">
        <div className="relative my-24 flex w-11/12 flex-col gap-y-4 rounded-md border-2 bg-white px-6 py-4 font-inter text-sm font-medium text-[#5d5d5d] shadow-2xl shadow-indigo-300 sm:w-10/12 sm:p-8 md:w-10/12 lg:w-8/12 xl:px-12">
          <div className="absolute left-3 top-3 -z-10 h-full w-full animate-fade-up rounded-md bg-gradient-to-r from-violet-300 to-indigo-400"></div>
          {(isLoadingDoctorType || isLoadingSlots) && (
            <div>Loading doctor type...</div>
          )}
          {formState === 0 && <BookingProcessGuide />}
          {formState === 1 && (
            <BookingFormPersonalDetails data={{ formData, setFormData }} />
          )}
          {formState === 2 && (
            <BookingFormSelectSlots
              doctors={doctorSlots}
              formData={formData}
              setFormData={setFormData}
              refetchSlots={refetchSlots}
            />
          )}
          {formState === 3 && (
            <BookingFormReviewData
              data={formData}
              bookingSuccessful={bookingSuccessful}
              setBookingSuccessful={setBookingSuccessful}
            />
          )}

          <div className="flex w-full justify-between">
            {formState > 0 && !bookingSuccessful ? (
              <Button color="iris" size="2" onClick={() => handlePrev()}>
                <ArrowLeftIcon width={15} height={15} /> Go Back
              </Button>
            ) : (
              <div></div>
            )}
            {formState < 3 && canProceed() && (
              <Button color="iris" size="2" onClick={() => handleNext()}>
                Next <ArrowRightIcon width={15} height={15} />
              </Button>
            )}
            {formState < 3 && !canProceed() && (
              <Button
                color="gray"
                size="2"
                onClick={() =>
                  toast.warning("Please fill all the details to proceed.")
                }
              >
                Next <ArrowRightIcon width={15} height={15} />
              </Button>
            )}
            {formState === 3 && !bookingSuccessful && (
              <Button color="iris" size="2" onClick={() => onBookAppointment()}>
                Book Appointment
              </Button>
            )}
            {formState === 3 && bookingSuccessful && (
              <Button
                color="iris"
                size="2"
                onClick={() =>
                  navigate("/user/dashboard?tab=appointments")
                }
              >
                Check out your appointments
              </Button>
            )}
          </div>
          {/* <p
            className="w-fit cursor-pointer select-none border-b border-white text-indigo-700 transition-all duration-200 hover:border-b hover:border-indigo-700"
            onClick={() => navigate("/howitworks")}
          >
            Learn more
          </p> */}
        </div>
      </div>
    </>
  );
}

export default BookAppointment;
