import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/login"; // Halaman tujuan
import Quiz from "./assets/quiz"; // Halaman tujuan
import Result from "./assets/result"; // Halaman tujuan
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Quiz" element={<Quiz />} />
            <Route path="/Result" element={<Result />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
