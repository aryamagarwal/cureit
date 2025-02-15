import AIChatbot from "../assets/features/AIFeedback.png";

function SingleFeaturePageFeedback() {
  return (
    <div className="my-16 flex h-svh w-full flex-col items-center">
      <div className="my-6 text-center font-noto text-xl font-semibold">
        AI-powered Feedback System
      </div>
      <div className="mb-6 w-9/12 text-center font-noto font-medium">
        It analyzes patient reviews and generates insightful tags for doctors,
        helping users quickly identify expertise and patient satisfaction for
        informed healthcare choices.
      </div>
      <img
        src={AIChatbot}
        className="w-11/12 rounded-lg object-contain md:w-9/12"
        alt=""
      />
    </div>
  );
}

export default SingleFeaturePageFeedback;
