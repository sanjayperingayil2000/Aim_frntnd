import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Form, FormInput, Button } from '../../components';
import { Link } from 'react-router-dom';
import { images } from '../../constants';
import { BsArrowLeft } from 'react-icons/bs';
import { useState } from 'react';
import authService from '../../services/authService';
import { Alert } from 'react-bootstrap';

const Forgot = () => {

  const [email, setEmail] = useState('');
  const [statusMsg, setstatusMsg] = useState('');
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(()=>{
    if(showError){
      setTimeout(()=>{
        setShowError(false)
      },3000)
    }
    if(show){
      setTimeout(()=>{
        setShow(false)
      },3000)
    }
  },[show,showError])

  const handleSubmit = async ( e ) => {

    e.preventDefault();
    try {
      await authService.resetPassword(email).then(
        (response) => {
          let status = response.data.status;
          if(status === true){
            setstatusMsg(response.data.msg);
            setShow(true);
          } else {
            setstatusMsg(
              "Unregistered email address ! Please use a registered email id"
            );
            setShowError(true);
          }
        },
        (error) => {
          console.log("###err###",error);
        }
      );
    } catch (err) {
      console.log("###err###",err);
    }
  };

  return (
    <>
      <section className='auth'>
        <Container>
          <Row className='align-items-center'>
            <Col xl={5} lg={5} md={12}>
              <div className='auth__logo'>
                <img src={images.logo} alt='Asset Integrity Management' />
              </div>
            </Col>
            <Col xl={{ span: 5, offset: 2 }} md={12}>
              <h1 className='auth__title'>Forgot Password?</h1>
              <span className='auth__sub'>We will send you reset instructions</span>
              <Form className='auth__form'>
                <FormInput 
                  type='text'
                  label='Email'
                  placeholder='Enter Email'
                  className='auth__input'
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <Button variant="click-primary" size='click-xl' type="submit" onClick={(e)=>{handleSubmit(e)}}>
                  Submit
                </Button>
                {
                  show&&(
                    <Alert className='alert-fixed' variant="success" dismissible onClose={() => setShow(false)}>
                      <p>{statusMsg}</p>
                    </Alert>
                  )
                }
                {
                  showError&&(
                    <Alert className='alert-fixed' variant="danger" dismissible onClose={() => setShowError(false)}>
                      <p>{statusMsg}</p>
                    </Alert>
                  )
                }
                <Link className='auth__back' to='/login'>
                    <BsArrowLeft size={30} />
                    Back to Log in
                </Link>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Forgot