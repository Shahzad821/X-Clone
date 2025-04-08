import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./ReduxStore/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./AuthProvider/AuthProvider.jsx";
import { SocketAuthProvider } from "./Store/ContextStore.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SocketAuthProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </SocketAuthProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
