import React from "react";
import "../assets/style.css";
import { Offcanvas, Row, Col, Modal, Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function FinishConfirmationModal({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header style={{ border: "none" }} closeButton></Modal.Header>
      <Modal.Body className="pesan-modal" style={{ border: "none" }}>
        <p>Are you sure you want to finish this quiz?</p>
      </Modal.Body>
      <Modal.Footer className="utama-button-modal" style={{ border: "none" }}>
        <Button className="true" onClick={onHide}>
          No
        </Button>
        <Button className="false" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Quiz() {
  const [questions, setQuestions] = useState([]);

  // Contoh saat fetch data API
  const fetchQuestions = async () => {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple"
    );
    const data = await response.json();

    const formattedQuestions = data.results.map((item, index) => {
      // Gabungkan correct dan incorrect answers, lalu acak
      const answers = shuffleArray([
        ...item.incorrect_answers,
        item.correct_answer,
      ]);

      return {
        id: index + 1,
        question: decodeHtml(item.question), // decode HTML entities
        correctAnswer: item.correct_answer,
        answers: answers.map(decodeHtml), // decode setiap jawaban
      };
    });

    setQuestions(formattedQuestions);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const handleAnswerClick = (answerIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(updatedAnswers);
    // Tandai soal ini sudah dijawab
    if (!answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
    // Pindah ke soal berikutnya
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleNumberClick = (index) => {
    setCurrentQuestion(index);
    setShow(false); // tutup Offcanvas
  };

  const [direction, setDirection] = useState(0);

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1); // previous
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1); // next
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const [showFinishModal, setShowFinishModal] = useState(false);

  const navigate = useNavigate();

  const handleConfirmFinish = (
    customQuestions = questions,
    customAnswers = selectedAnswers
  ) => {
    setShowFinishModal(false);
    localStorage.removeItem("quiz_data"); // Hapus data quiz

    const totalAnswered = customAnswers.filter((a) => a !== undefined).length;
    let correct = 0;

    customAnswers.forEach((answerIndex, index) => {
      const selectedAnswer = customQuestions[index].answers[answerIndex];
      if (selectedAnswer === customQuestions[index].correctAnswer) {
        correct++;
      }
    });

    const wrong = totalAnswered - correct;

    navigate("/Result", {
      state: {
        correct,
        wrong,
        answered: totalAnswered,
      },
    });
  };

  const [timeLeft, setTimeLeft] = useState(5); // 300 detik = 5

  const questionsRef = useRef([]);
  const selectedAnswersRef = useRef([]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // gunakan ref agar selalu mendapat data terbaru
          handleConfirmFinish(questionsRef.current, selectedAnswersRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")} : ${m
      .toString()
      .padStart(2, "0")} : ${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(
        "quiz_data",
        JSON.stringify({
          questions,
          selectedAnswers,
          answeredQuestions,
          currentQuestion,
          timeLeft,
        })
      );
    }
  }, [
    questions,
    selectedAnswers,
    answeredQuestions,
    currentQuestion,
    timeLeft,
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem("quiz_data");
    if (savedData) {
      const {
        questions,
        selectedAnswers,
        answeredQuestions,
        currentQuestion,
        timeLeft,
      } = JSON.parse(savedData);

      setQuestions(questions);
      setSelectedAnswers(selectedAnswers);
      setAnsweredQuestions(answeredQuestions);
      setCurrentQuestion(currentQuestion);
      setTimeLeft(timeLeft);
    } else {
      fetchQuestions();
    }
  }, []);

  return (
    <div>
      {/* Tombol toggle */}
      <img className="img-2" src="./images/full.png" alt="" />

      <div className="timer">{formatTime(timeLeft)}</div>

      <div className="terjawab">
        <p>Soal terjawab</p>
        <p className="lg" style={{ color: "#231E61", fontSize: "1.3em", fontWeight: "900" }}>
          {answeredQuestions.length} / {questions.length}
        </p>
      </div>
      <div
        className={`total-soal ${show ? "kanan" : "kiri"}`}
        onClick={show ? handleClose : handleShow}>
        {show ? "X" : "Check the Questions"}
      </div>

      {/* Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="title-soal">Soal</div>
          <Row className="utama-no-sol">
            {questions.map((q, index) => (
              <Col
                key={q.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="nomor-soal"
                onClick={() => handleNumberClick(index)}
                style={{
                  boxShadow: answeredQuestions.includes(index)
                    ? "inset 2px 2px 4px rgba(0, 0, 0, 0.4)"
                    : "3px 3px 4px rgba(0, 0, 0, 0.4)",
                  backgroundColor: answeredQuestions.includes(index)
                    ? "#6058c5"
                    : currentQuestion === index
                    ? "#AA36A5"
                    : "#AA36A5",
                  color: answeredQuestions.includes(index) ? "white" : "white",
                }}>
                {q.id}
              </Col>
            ))}
          </Row>
        </Offcanvas.Body>
      </Offcanvas>

      <div className={`utama-soal-test ${show ? "geser-kanan" : ""}`}>
        {questions.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.3 }}>
              <div className="soal">
                <p>{questions[currentQuestion].id}.</p>
                <p>{questions[currentQuestion].question}</p>
              </div>

              {questions[currentQuestion].answers.map((answer, index) => (
                <div
                  key={index}
                  className={`jawaban ${
                    selectedAnswers[currentQuestion] === index ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerClick(index)}>
                  <p
                    className={`no-jawaban ${
                      selectedAnswers[currentQuestion] === index
                        ? "selected"
                        : ""
                    }`}>
                    {String.fromCharCode(65 + index)}.
                  </p>
                  <p className="teks-jawaban">{answer}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="utama-button-soal">
          <div className="button-soal" onClick={handlePrevious}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
            Previous
          </div>

          <div
            className="button-soal"
            onClick={
              currentQuestion === questions.length - 1
                ? () => setShowFinishModal(true)
                : handleNext
            }>
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-right-circle-fill"
              viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
            </svg>
            {currentQuestion !== questions.length - 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-right-circle-fill"
                viewBox="0 0 16 16">
                <path d="..." />
              </svg>
            )}
          </div>
        </div>
      </div>

      <FinishConfirmationModal
        show={showFinishModal}
        onHide={() => setShowFinishModal(false)}
        onConfirm={() => handleConfirmFinish(questions, selectedAnswers)}
      />
    </div>
  );
}

export default Quiz;
