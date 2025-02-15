import AIChatbot from "../assets/features/MedSpecRec.png";

function SingleFeaturePageMedSpecRec() {
  return (
    <div className="my-16 flex h-svh w-full flex-col items-center">
      <div className="my-6 text-center font-noto text-xl font-semibold">
        AI-Powered Doctor Recommendation
      </div>
      <div className="mb-6 w-9/12 text-center font-noto font-medium">
        Our ML-driven system analyzes symptoms and connects you with the best
        doctors for accurate & personalized care.
      </div>
      <img
        src={AIChatbot}
        className="w-11/12 rounded-lg object-contain md:w-9/12"
        alt=""
      />
    </div>
  );
}

export default SingleFeaturePageMedSpecRec;
