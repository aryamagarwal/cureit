import { useNavigate } from "react-router-dom";
import Container1 from "./Container1";
import Card1 from "./FeatureCard";

export default function Features() {
  const navigate = useNavigate();
  return (
    <div className="my-12 w-full animate-fade-up md:px-5 lg:px-10">
      <div className="mt- mb-5 pl-5 text-left text-2xl font-semibold text-[#131b20] md:text-3xl">
        Optimizing Hospital Queue Management with AI
      </div>
      <div className="pl-5 text-left text-sm md:text-base">
        Four Simplified Steps to Optimize Hospital Queue Management
      </div>
      {/* <div className="features flex w-full flex-col items-center justify-center border-2 text-left sm:mx-5 sm:max-h-fit sm:flex-col md:mx-10 md:flex-row md:space-x-10 lg:mx-20 lg:space-x-10 xl:space-x-20"> */}
      <div className="features flex w-full flex-col justify-center px-5 md:flex-row md:justify-center">
        <div className="flex flex-col items-center justify-between gap-x-5 gap-y-5 py-5 lg:flex-row">
          <div className="cards left flex h-full w-full flex-col justify-between gap-y-5 lg:w-auto">
            <Card1
              title="AI-Powered ChatBot"
              text="A Retrieval-Augmented Generation (RAG) based AI chatbot to assist users with queries. It provides medical guidance based on pre-trained models and verified sources."
              link="/featureAIChatbot"
              // onClick={() => navigate("/featureAIChatbot")}
              linkName="Learn More"
            />
            <Card1
              title="AI-Powered Doctor Recommendation"
              text="Our ML-driven system analyzes symptoms and connects you with the best doctors for accurate & personalized care."
              link="/featureAIRecommendation"
              linkName="Learn More"
            />
            <Card1
              title="AI-powered Feedback System"
              text="It analyzes patient reviews and generates insightful tags for doctors, helping users quickly identify expertise and patient satisfaction for informed healthcare choices."
              link="/featureAIFeedback"
              linkName="Learn More"
            />
            <Card1
              title="Automated Appointment Scheduling"
              text="Implement automated scheduling systems to reduce patient waiting times and improve overall patient-queue flow efficiency."
              // link="https://www.google.com"
              // linkName="Our Input Guidelines and Methodology"
            />
          </div>
          <Container1 />
        </div>
        <div className="right flex flex-col items-center justify-center"></div>
      </div>
    </div>
  );
}
