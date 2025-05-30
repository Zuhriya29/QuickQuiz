import { useLocation, useNavigate } from "react-router-dom";
import "../assets/style.css";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div>
        <h2>No result found.</h2>
        <button onClick={() => navigate("/")}>Back to Quiz</button>
      </div>
    );
  }

  return (
    <div>
        <img className="img-2" src="./images/full.png" alt="" />
    <div className="hasil-quiz">
      <h1>Quiz Result</h1>
      <div className="detail-result">
        <div className="text-result" style={{ color: "#2f7521" }}>
            <p>Correct</p>
            <p>{state.correct}</p>
        </div>
        <div className="text-result" style={{ color: "#a02828" }}>
            <p>Wrong</p>
            <p>{state.wrong}</p>
        </div>
        <div className="text-result" style={{ color: "#750173" }}>
            <p>Answered</p>
            <p>{state.answered}</p>
        </div>
      </div>
      <div className="button-result" onClick={() => navigate("/")}>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
            Back to Quiz</div>
    </div>
    </div>
  );
};

export default Result;
