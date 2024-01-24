import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";
import { Redirect } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setTimeout(() => {
          setLoading(false);
          history.push("/devicepage");
          window.location.reload();
        }, 800);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError("Wrong email or password. Please try again.");

        setTimeout(() => {
          setError("");
        }, 1500);
      });
  };

  if (authenticated) {
    return <Redirect to="/devicepage" />;
  }

  return (
    <>
      {loading && (
        <div className="overlay">
          <div className="spinner-container">
            <Spinner animation="border" role="status" variant="red">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      )}
      <div className="container bold-text">
        <Form onSubmit={signIn}>
          {error && <Alert className="text-danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="wide-button">
            Sign In
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Login;
