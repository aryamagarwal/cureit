import { useEffect, useState } from "react";
import ChatbotLogo from "../../assets/cai.jpg";
import CureitLogo from "../../assets/CureitLogo";
import { Cross1Icon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Button, Spinner, TextField } from "@radix-ui/themes";
import useChatBot from "../../hooks/useChatBot";
function ChatBot() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const { isLoading, isFetching, data, error, status, refetch } =
    useChatBot(message);
  console.log(data);

  const [chatbotMessages2, setChatbotMessages2] = useState([
    {
      message: "Hello, I am CureIt AI ChatBot. How can I help you today?",
      type: "bot",
    },
    {
      message: "How to book an appointment?",
      type: "user",
    },
    {
      message:
        "To book an appointment, you can click on the 'Book Appointment' button on the top right corner of the page.",
      type: "bot",
    },
    {
      message: "Thank you!",
      type: "user",
    },
    {
      message: "You're welcome!",
      type: "bot",
    },
    {
      message: "Is there anything else you would like to know?",
      type: "bot",
    },
    {
      message: "Yes, I would like to know more about CureIt.",
      type: "user",
    },
    {
      message:
        "CureIt is an online platform that allows you to book appointments with doctors and healthcare professionals. You can also consult with doctors online.",
      type: "bot",
    },
    {
      message: "That's great!",
      type: "user",
    },
    {
      message: "I'm glad you think so!",
      type: "bot",
    },
  ]);
  const [chatbotMessages, setChatbotMessages] = useState([
    {
      type: "bot",
      message: "Hello, I'm CureIt AI ChatBot. How can I help you today?",
    },
  ]);

  useEffect(() => {
    if (data) {
      setChatbotMessages([
        ...chatbotMessages,
        { type: "bot", message: data.answer },
      ]);
    }
  }, [data]);

  return (
    <div className="absolute bottom-0 left-0 z-50 w-full border-red-600 p-4 font-noto text-sm font-medium">
      <div className="flex h-full w-full">
        {!chatbotOpen && (
          <div
            className="pointer-events-auto animate-fade cursor-pointer transition-all duration-200 animate-duration-300 hover:scale-105"
            onClick={() => setChatbotOpen(true)}
          >
            <img
              src={ChatbotLogo}
              alt=""
              className="w-12 rounded-md shadow-lg drop-shadow-md"
            />
          </div>
        )}
        {chatbotOpen && (
          <div className="absolute bottom-0 mb-4 h-[25rem] w-11/12 animate-fade-up rounded-md border border-indigo-300 bg-white drop-shadow-2xl animate-duration-500 md:w-7/12 lg:w-4/12">
            <div className="pointer-events-auto flex h-full w-full flex-col">
              <div className="chatbot_navbar flex h-10 w-full justify-between">
                <div className="mx-1 flex w-14 items-center">
                  <CureitLogo fillColor="#4f4fcc" />
                </div>
                <div className="flex items-center px-1">
                  <Button
                    size={"1"}
                    radius=""
                    color="iris"
                    variant="soft"
                    onClick={() => setChatbotOpen(false)}
                  >
                    <Cross1Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border_under_navbar h-[1px] w-full bg-gradient-to-r from-transparent via-[#4f4fcca7] to-transparent"></div>

              <div
                data-lenis-prevent="true"
                className="chat_messages flex h-full flex-col gap-2 overflow-scroll p-2 text-gray-700"
              >
                {chatbotMessages.map((message, index) =>
                  message.type === "bot" ? (
                    <div
                      className="w-10/12 self-start rounded-md border bg-gray-100 px-3 py-2"
                      key={index}
                    >
                      {message.message}
                    </div>
                  ) : (
                    <div
                      className="text w-10/12 self-end rounded-md border border-indigo-300 bg-[#d0d0ff58] px-3 py-2"
                      key={index}
                    >
                      {message.message}
                    </div>
                  ),
                )}
                {isFetching && (
                  <div className="self-start rounded-md border bg-gray-100 px-3 py-2">
                    <Spinner />
                  </div>
                )}
              </div>

              <div className="flex h-12 w-full items-center gap-x-2 border-red-600 p-2">
                <TextField.Root
                  className="w-full"
                  placeholder="Talk with CureIt AI ChatBot..."
                  value={message || ""}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setChatbotMessages([
                        ...chatbotMessages,
                        { type: "user", message: message },
                      ]);
                      setMessage(null);
                      refetch();
                    }
                  }}
                >
                  <TextField.Slot></TextField.Slot>
                </TextField.Root>
                <Button
                  size={"2"}
                  radius=""
                  color="iris"
                  variant=""
                  onClick={() => {
                    setChatbotMessages([
                      ...chatbotMessages,
                      { type: "user", message: message },
                    ]);
                    setMessage(null);
                    refetch();
                  }}
                >
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBot;
