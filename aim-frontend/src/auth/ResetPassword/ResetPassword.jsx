import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import validator from "validator";
import { Alert } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";
import { Form, FormPassword, Button } from "../../components";
import { images } from "../../constants";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [strong, setStrong] = useState(false);
  let { token } = useParams();
  let tokenData =  token;
;
  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    if (show) {
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [show, showError]);

  useEffect(() => {
    if(tokenData){
    authService.resetTokenCheck(tokenData).then(
      (response)=>{
        let status = response?.data?.status;
        if(status === false){
            navigate("/reset-password/invalid");
        }
      }
    )
    }
  },[tokenData]);


  const validatorFunction = (value) => {
    if (value) {
      if (
        validator.isLength(value, {
          min: 6,
          max: 12,
        })
      ) {
        setErrorMessage("Is Strong Password");
        setStrong(true);
      } else {
        setErrorMessage("Is Not Strong Password");
        return;
      }
      if (validator.isAlphanumeric(value)) {
        setStrong(true);
        setPassword(value);
      } else {
        setErrorMessage("Password should contain only alphanumeric characters");
        return;
      }
    } else {
      setStrong(false);
      setErrorMessage("required");
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strong && password) {
      if (password === confirmPassword) {
        try {
          await authService.updatePassword(token, password).then(
            (response) => {
              let status = response.data.status;
              let msg = response.data.msg;
              if (status === true) {
                setShow(true);
                setStatusMsg(msg);
               
                setTimeout(function () {
                  navigate("/login");
                }, 2000);
              } else {
                setShowError(true);
                setStatusMsg(msg);
              }
            },
            (error) => {
              console.log("###err###", error);
            }
          );
        } catch (err) {
          console.log("###err###", err);
        }
      } else {
        setShowError(true);
        setStatusMsg("Passwords do not match");
      }
    } else {
      setErrorMessage("Is Not Strong Password");
    }
  };

  return (
    <>
      <section className="auth">
        <Container>
          <Row className="align-items-center">
            <Col xl={5} lg={5} md={12}>
              <div className="auth__logo">
                <img src={images.logo} alt="Asset Integrity Management" />
              </div>
            </Col>
            <Col xl={{ span: 5, offset: 2 }} md={12}>
              <h1 className="auth__title">Reset Password</h1>
              <span className="auth__sub">Enter your new password below</span>
              <Form className="auth__form">
                <FormPassword
                  type="text"
                  label="Password"
                  placeholder="Enter New Password"
                  className="auth__input"
                  onChange={(e) => validatorFunction(e.target.value)}
                  errormsg={errorMessage}
                />
                <FormPassword
                  type="text"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  className="auth__input"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="click-primary"
                  size="click-xl"
                  type="submit"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Submit
                </Button>
                {show && (
                  <Alert
                    className="alert-fixed"
                    variant="success"
                    dismissible
                    onClose={() => setShow(false)}
                  >
                    <p>{statusMsg}</p>
                  </Alert>
                )}
                {showError && (
                  <Alert
                    className="alert-fixed"
                    variant="danger"
                    dismissible
                    onClose={() => setShowError(false)}
                  >
                    <p>{statusMsg}</p>
                  </Alert>
                )}
                <Link className="auth__back" to="/login">
                  <BsArrowLeft size={30} />
                  Back to Log in
                </Link>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ResetPassword;
