import { useQuery } from "@tanstack/react-query";
import { chatBot } from "../utils/api";

export default function useChatBot(message) {
  const { isLoading, isFetching, data, error, status, refetch } = useQuery({
    queryKey: ["chat_bot"],
    queryFn: () => {
      if (message !== null) return chatBot(message);
      return null;
    },
    staleTime: 0, // 1 second
    enabled: false,
    cacheTime: 0,
    retry: 1,
  });

  return { isLoading, isFetching, data, error, status, refetch  };
}
