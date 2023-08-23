import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import DemoPage from "./payments/page";
import { Video } from "./components/video";

function App() {
  return (
    <>
      <Routes>
        <Route path="/page" element={<DemoPage />} />
      </Routes>

      <Navbar></Navbar>

      <div className="grid grid-cols-2 gap-4 mx-4 content-center">
        <div className="justify-self-center">
          <Video></Video>
        </div>
        <div>
          <DemoPage />
        </div>
      </div>
    </>
  );
}

export default App;
