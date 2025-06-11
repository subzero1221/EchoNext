"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "../_contextComponents/AuthProvider";
import { ChatProvider } from "../_contextComponents/ChatProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
