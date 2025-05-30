import React from "react";
import "../assets/style.css";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/Quiz"); // arahkan ke halaman /Quiz
  };
  return (
    <div>
        <img className="img-2" src="./images/full.png" alt="" />
      <div className="form-login">
        <div className="title-login">
            <h1>Let’s Get Quizzing!</h1>
            <p>Log in now and see how much you really know!</p>
        </div>
        <div className="input-login">
          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Email Address"
              />
            </Form.Group>
            <br />
            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              placeholder="Enter Your Password"
            />
            <Form.Text id="passwordHelpBlock" className="ket-password" muted>
              Your password must be 8-20 characters long, contain letters and
              numbers, and must not contain spaces, special characters, or
              emoji.
            </Form.Text>
          </Form>
        </div>
        <p className="forgot-password">Forgot Password?</p>
          <Button className="button-login" onClick={handleSubmit}>Login</Button>
      </div>
    </div>
  );
}

export default Login;
