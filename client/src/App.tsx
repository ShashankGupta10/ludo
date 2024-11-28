import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Home from "./pages/Home";
import Board from "./pages/Board";
import WaitingArea from "./pages/WaitingArea";
import Providers from "./Providers";

const App = () => {
  return (
    <BrowserRouter>
      <Providers>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waiting-area/:id" element={<WaitingArea />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
};

export default App;
