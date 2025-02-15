import AIChatbot from "../assets/features/AIChatbotImage.png";

function SingleFeaturePageChatbot() {
  return (
    <div className="my-16 flex h-svh w-full flex-col items-center">
      <div className="my-6 font-noto text-center text-xl font-semibold">
        AI-Powered ChatBot
      </div>
      <div className="mb-6 w-9/12 text-center font-noto font-medium">
        A Retrieval-Augmented Generation (RAG) based AI chatbot to assist users
        with queries. It provides medical guidance based on pre-trained models
        and verified sources.
      </div>
      <img
        src={AIChatbot}
        className="w-11/12 rounded-lg object-contain md:w-9/12"
        alt=""
      />
    </div>
  );
}

export default SingleFeaturePageChatbot;
