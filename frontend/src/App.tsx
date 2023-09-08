import { Routes, Route } from "react-router-dom";
import DemoPage from "./payments/page";
import ListView from "./pages/___tests___/ListView";
import Detail from "./pages/___tests___/Detail";
import { VideoPlayer } from "./pages/___tests___/VideoPlayer";
import { TestPage } from "./pages/___tests___/test";
import { SnippetCard } from "./components/SnippetCard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/page" element={<DemoPage />} />
        <Route path="/listview" element={<ListView />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/videoplayer" element={<VideoPlayer />} />
        <Route path="/testpage" element={<TestPage />} />
        <Route path="/snippetcard" element={<SnippetCard />} />
      </Routes>
    </>
  );
}

export default App;
