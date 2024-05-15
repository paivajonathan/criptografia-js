import Chat from "./pages/chat/Chat";
import Main from "./pages/main/Main";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/chat/:username",
    element: <Chat />
  },
]);

export default router;