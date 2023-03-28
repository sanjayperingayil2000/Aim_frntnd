import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Form,
  FormInput,
  FormPassword,
  Button,
  FormCheckbox,
} from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constants";
import authService from "../../services/authService";
import { Alert } from "react-bootstrap";
import { List } from "semantic-ui-react";
import { toast } from "react-toastify";

const Login = () => {
  const formRef = useRef(null);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, handleSignedIn] = useState(false);
  const [emptymsg, setEmpty] = useState("")
  const [failure, setFailure] = useState(false);
  const navigate = useNavigate();
  const focusElement = useRef(null);

  const uName = localStorage.getItem("username");
  const pWord = localStorage.getItem("password");
  let checked = Boolean(localStorage.getItem("isChecked"));
  const [msg, setMsg] = useState("");

  useEffect(() => {
    focusElement.current.focus();
    if (uName !== "" && pWord !== "" && checked) {
      setUserName(uName);
      setPassword(pWord);
      handleSignedIn(checked);
    }
  }, []);

  useEffect(() => {
    if (failure) {
      setTimeout(() => {
        setFailure(false);
      }, 3000);
    }
  }, [failure]);

  const handleLogin = async (e) => {
    e.preventDefault();
    let noOfDaysForExpiry = 1;
    if (isChecked) {
      noOfDaysForExpiry = 14;
      localStorage.setItem("password", password);
      localStorage.setItem("username", username);
      localStorage.setItem("isChecked", isChecked);
    } else {
      localStorage.clear();
    }

    const expresTime = new Date(
      new Date().getTime() + 3600 * 24 * noOfDaysForExpiry * 1000
    );

    try {
      await authService.login(username, password, expresTime).then(
        (response) => {
          setEmpty(response?.msg);
          setMsg(response.message);
          if (response.accessToken) {
            if (response.user.userRole != "normal-user") {
              window.location.reload();
            } else {
              toast.error("You need an Android device to login");
              setUserName("");
              setPassword("");
            }
          } else {
            setFailure(true);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const usernameChangeHandler = (e) => {
    setUserName(e.target.value);
  };

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <section className="auth">
        <Container>
          <Row className="align-items-center">
            <Col xl={5} lg={5} md={12}>
              <div className="auth__logo aim_login_logo">
                <img
                  src={images.logo}
                  alt="Asset Integrity Management"
                  className="desktop"
                />
                <img
                  src={images.logoWhite}
                  alt="Asset Integrity Management"
                  className="mobile"
                />
              </div>
            </Col>
            <Col xl={{ span: 5, offset: 2 }} md={12}>
              <h1 className="auth__title">Welcome</h1>
              <span className="auth__sub">Login to your account</span>
              <Form
                className="auth__form"
                onSubmit={(e) => handleLogin(e)}
                formRef={formRef}
              >
                <FormInput
                  name="username"
                  type="text"
                  label="Username/Email"
                  placeholder="Enter Username/Email"
                  className="auth__input"
                  onChange={(e) => usernameChangeHandler(e)}
                  value={username}
                  focusref={focusElement}
                />
                <FormPassword
                  name="password"
                  label="Password"
                  placeholder="Enter Password"
                  className="auth__input"
                  onChange={(e) => passwordChangeHandler(e)}
                  value={password}
                />
                <div className="form-group d-flex align-items-center justify-content-between">
                  <FormCheckbox
                    label="Remember Me?"
                    onChange={(e) => {
                      handleSignedIn(e.target.checked);
                    }}
                    checked={isChecked}
                  />
                  <Link className="auth__forgot" to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  variant="click-primary"
                  className="w-100"
                  size="click-xl"
                  type="submit"
                >
                  Login
                </Button>
              </Form>
              {failure && msg == "Invalid Password!" ? (
                <Alert
                  className="alert-fixed"
                  variant="danger"
                  dismissible
                  onClose={() => setFailure(false)}
                >
                  <p>Password you have entered is incorrect</p>
                </Alert>
              ) : failure && msg == "User Not found." ? (
                <Alert
                  className="alert-fixed"
                  variant="danger"
                  dismissible
                  onClose={() => setFailure(false)}
                >
                  <p>The username / password you have entered is incorrect</p>
                </Alert>
              ) :failure&& emptymsg == "Username/Password cannot be left empty" ? (
                <Alert
                  className="alert-fixed"
                  variant="danger"
                  dismissible
                  onClose={() => setFailure(false)}
                >
                  <p>Username/Password field cannot be empty</p>
                </Alert>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
