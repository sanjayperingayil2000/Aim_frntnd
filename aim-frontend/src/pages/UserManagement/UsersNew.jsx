import React, { useEffect, useState } from "react";
import {
  Form,
  FormInput,
  FormSelect,
  Button,
  Card,
  FormPassword,
  AddTable,
  PageHeader,
  PageFooter,
} from "../../components";
import { Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userTypeData, userStatusData } from "../../data/createUserData";
import { toast } from "react-toastify";
import userService from "../../services/userService";
import { RiDeleteBinLine } from "react-icons/ri";
import Table from "react-bootstrap/Table";
import * as moment from "moment";
import validator from "validator";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const UsersNew = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [workOrderData, setWorkOrderData] = useState(state);
  const [users, setUsers] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    accountStatus: "active",
  });
  const [requiredFirstName, setFirstName] = useState("");
  const [requiredLastname, setLastname] = useState("");
  const [requiredUsername, setUsername] = useState("");
  const [requiredEmail, setEmail] = useState("");
  const [requiredPassword, setPassword] = useState("");
  const [userCount, setUserCount] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const handleUserType = (e, { value }) => {
    setUsers({ ...users, userRole: value });
  };
  const handleUserStatus = (e, { value }) => {
    setUsers({ ...users, accountStatus: value });
  };
  const handleFirstname = (e) => {
    setUsers({ ...users, firstName: e.target.value });
  };
  const handleLastname = (e) => {
    setUsers({ ...users, lastName: e.target.value });
  };
  const handleUsername = (e) => {
    setUsers({ ...users, username: e.target.value });
  };
  const handleEmail = (e) => {
    setUsers({ ...users, email: e.target.value });
  };
  const handlePassword = (e) => {
    setUsers({ ...users, password: e.target.value });
  };

  //functionality for deleting the asset from workorder
  let newList = [];
  const onDelete = (setItem) => {
    newList = workOrderData.filter((item) => {
      return setItem._id !== item._id;
    });
    setWorkOrderData(newList);
  };

  useEffect(async () => {
    let data = await userService.getAllUsers();
    if (data?.info[0]?.total===undefined) {
      setUserCount(0);
    }
    else{
     setUserCount(data?.info[0]?.total);}
  },[]);

  useEffect(async () => {
    try {
      let datas = await userService.getLimitToken();
      // const bytes = CryptoJS.AES.decrypt(
      //   datas?.Tokens[0]?.LimitToken,
      //   "softnotions"
      // );

      // const token = bytes.toString(CryptoJS.enc.Utf8);
      // setTokenValue(token.split(",")[1]);
      // console.log(token.split(",")[1]);

      const key = CryptoJS.enc.Utf8.parse("softnotions_test");
      const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

      const bytes = CryptoJS.AES.decrypt(datas?.Tokens[0]?.LimitToken, key, {
        iv: iv,
      });
      const token = bytes.toString(CryptoJS.enc.Utf8);
      setTokenValue(token.split(",")[1]);
    } catch (error) {
      console.log(error);
    }
  },[]);

  const handleSubmit = async (e) => {
    const error = {
      firstName: false,
      lastname: false,
      username: false,
      email: false,
      password: false,
      userRole: false,
    };
    setFirstName("");
    setLastname("");
    setUsername("");
    setEmail("");
    setPassword("");

    if (validator.isEmpty(users.firstName)) {
      setFirstName("Required*");
      error.firstName = true;
    }
    if (users.userRole === undefined) {
      toast.error("Please select User Type");
      error.userRole = true;
    }
    if (validator.isEmpty(users.lastName)) {
      setLastname("Required *");
      error.lastname = true;
    }
    if (!validator.isLength(users.username, 3, 12)) {
      setUsername("Username must be between 3 and 12 characters long");
      error.username = true;
      if (validator.isEmpty(users.username)) {
        setUsername("Required*");
      }
    }
    if (!validator.isEmail(users.email)) {
      setEmail("Invalid Format");
      error.email = true;
      if (validator.isEmpty(users.email)) {
        setEmail("Required*");
      }
    }
    if (!validator.isLength(users.password, 5, 12)) {
      setPassword("Password must be between 5 and 12 characters long");
      error.password = true;
      if (validator.isEmpty(users.password)) {
        setPassword("Required*");
      }
    }

    if (
      error.firstName != true &&
      error.lastname != true &&
      error.username != true &&
      error.email != true &&
      error.password != true &&
      error.userRole != true
    ) {
      try {
        if (workOrderData !== null) {
          let datas = {};
          if (userCount < tokenValue) {
               datas = {
              accountStatus: users.accountStatus,
              email: users.email,
              firstName: users.firstName,
              lastName: users.lastName,
              userRole: users.userRole,
              username: users.username,
              password: users.password,
            };
          } else {
            toast.error("maximum usercount exceeded");
          }
          const workOrder = state.map((item) => ({ woId: item._id }));
          await userService.postUserNew(users, workOrder).then(
            (response) => {
              if (
                response.data.additionalInfo === "Please change your username"
              ) {
                setUsername("Username already exist");
              }
              if (response.data.additionalInfo === "Please change your email") {
                setEmail("Email already exist");
              }
              let status = response.data.status;

              if (status === true && response?.data?.userId) {
                let userId =response?.data?.userId;

                let text = userId;
                const key = CryptoJS.enc.Utf8.parse("softnotions_test");
                const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
                const ciphertext = CryptoJS.AES.encrypt(text, key, { iv: iv }).toString();
                let usersArray = { ...users, registerKey: ciphertext };
                userService.postUserById(userId, usersArray, workOrder).then(
                  (response) => {
                    if(response?.data?.status === true){
                    toast.success("User updated successfully");
                    navigate("/user-management");
                    }
                  },
                  (error) => {
                    toast.error(error?.response?.data?.message);
                  }
                );
              }
            },
            (error) => {
              toast.error(error?.response?.data?.message);
            }
          );
        } else {
          let datas = {};
          if (userCount < tokenValue) {
            datas = {
              accountStatus: users.accountStatus,
              email: users.email,
              firstName: users.firstName,
              lastName: users.lastName,
              userRole: users.userRole,
              username: users.username,
              password: users.password,
            };
          } else {
            toast.error("maximum usercount exceeded");
          }
          await userService.postUserNew(datas).then(
            (response) => {
              if (
                response.data.additionalInfo === "Please change your username"
              ) {
                setUsername("Username already exist");
              }
              if (response.data.additionalInfo === "Please change your email") {
                setEmail("Email already exist");
              }
              let status = response.data.status;
              if (status === true && response?.data?.userId) {
                let userId =response?.data?.userId;

                let text = userId;
                const key = CryptoJS.enc.Utf8.parse("softnotions_test");
                const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
                const ciphertext = CryptoJS.AES.encrypt(text, key, { iv: iv }).toString();
                let usersArray = { ...users, registerKey: ciphertext };
                userService.postUserById(userId, usersArray).then(
                  (response) => {
                    if(response?.data?.status === true){
                      toast.success("User updated successfully");
                      navigate("/user-management");
                      }
                  },
                  (error) => {
                    toast.error(error?.response?.data?.message);
                  }
                );
              }
            },
            (error) => {
              toast.error(error?.response?.data?.message);
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <PageHeader title="User Management" />
      {console.log(userCount)}
      <Card title="Create Users">
        <Form>
          <Row>
            <Col xxl={3} lg={4} md={6}>
              <AddTable
                label="Work Orders"
                placeholder="Choose"
                onClick={() => navigate("/work-order", { state: "addUser" })}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Enter here"
                label="First Name"
                onChange={(e) => handleFirstname(e)}
                required
                errormsg={requiredFirstName}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Enter here"
                label="Last Name"
                onChange={(e) => handleLastname(e)}
                required
                errormsg={requiredLastname}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Enter here"
                label="Username"
                onChange={(e) => handleUsername(e)}
                required
                errormsg={requiredUsername}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="email"
                placeholder="Enter here"
                label="Email Address"
                onChange={(e) => handleEmail(e)}
                required
                errormsg={requiredEmail}
                autoComplete="off"
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="User Type"
                placeholder="Select "
                data={userTypeData}
                onChange={handleUserType}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="Status"
                placeholder="Select "
                data={userStatusData}
                onChange={handleUserStatus}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormPassword
                id="userPass"
                name="userPass"
                label="Password"
                placeholder="Enter here"
                onChange={(e) => handlePassword(e)}
                required
                errormsg={requiredPassword}
                autoComplete="new-password"
              />
            </Col>
          </Row>
        </Form>
      </Card>
      <PageFooter>
        <Link className="btn-link" to="/user-management">
          <Button variant="click-gray" size="click-lg" type="button">
            Cancel
          </Button>
        </Link>
        <Button
          onClick={(e) => handleSubmit(e)}
          variant="click-primary"
          size="click-lg"
          type="submit"
        >
          Save
        </Button>
      </PageFooter>
      {workOrderData && (
        <PageFooter>
          <div className="asset-table spacing-in table-align-left">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="card-subtitle">Selected Assets</h4>
            </div>
            <Table striped>
              <thead>
                <tr>
                  <th>WO Number</th>
                  <th>WO Date</th>
                  <th>Department</th>
                  <th>Maintenance Type</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Work Order Type</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {workOrderData &&
                  workOrderData.map((workOrder) => (
                    <tr key={workOrder._id}>
                      <td>{workOrder.woNumber}</td>
                      <td>{moment(workOrder.woDate).format("DD/MM/YYYY")}</td>
                      <td>{workOrder.department}</td>
                      <td>{workOrder.maintanaceType}</td>
                      <td>{workOrder.description}</td>
                      <td>
                        {moment(workOrder.startDate).format("DD/MM/YYYY")}
                      </td>
                      <td>{workOrder.duration}</td>
                      <td>{workOrder.status}</td>
                      <td>{workOrder.permitType}</td>
                      <td>
                        <div className="table-action">
                          <Button
                            onClick={() => {
                              onDelete(workOrder);
                            }}
                            variant="click-none"
                            size="click-resize"
                            className="delete-btn"
                          >
                            <RiDeleteBinLine size={20} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </PageFooter>
      )}
    </>
  );
};

export default UsersNew;
