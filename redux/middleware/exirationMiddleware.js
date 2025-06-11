import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearUser } from "../features/auth/authSlice";

export const expirationMiddleware = createListenerMiddleware();

expirationMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    return action.type === "auth/setUser" && action.payload !== null;
  },
  effect: async (action, listenerApi) => {
    setTimeout(() => {
      listenerApi.dispatch(clearUser());
    }, 24 * 60 * 60 * 1000);
  },
});
