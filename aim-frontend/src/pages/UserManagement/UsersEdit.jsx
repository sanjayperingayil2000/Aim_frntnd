import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  Form,
  FormInput,
  FormSelect,
  Button,
  Card,
  FormPassword,
  Modal,
  PageFooter,
} from "../../components";
import { Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { userTypeData, userStatusData } from "../../data/createUserData";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import userService from "../../services/userService";
import * as moment from "moment";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import validator from "validator";
import bcrypt from "bcryptjs";

const UsersEdit = () => {
  const navigate = useNavigate();
  const id = useParams();
  const ID = id._id;
  const [users, setUsers] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [workOrder, setWorkOrder] = useState([]);
    const [selectedItem, setId] = useState();
    const [showModal, setShowModal] = useState(false);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [requiredFirstName, setFirstName] = useState("");
  const [requiredLastname, setLastname] = useState("");
  const [requiredUsername, setUsername] = useState("");
  const [requiredEmail, setEmail] = useState("");
  const [requiredPassword, setPassword] = useState("");
  // const [passcheck,setPasscheck] = useState(false)

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

  //retriveing of user data from api
  useEffect(() => {
    try {
      userService.getUserId(String(ID)).then((data) => {
        setUsers(data?.user);
        setWorkOrder(data?.workOrderAssignments);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  //data passing from work-order page is on workOrderData
  const { state } = useLocation();
  const workOrderData = state;

  //array mixing from api and asset register page
  useEffect(() => {
    if (workOrder != null) {
      setWorkOrderList(workOrder);

      if (workOrderData != null) {
        setWorkOrderList([
          ...new Map(
            [...workOrder, ...workOrderData].map((m) => [m?._id, m])
          ).values(),
        ]);
      }
    }
  }, [workOrder, workOrderData]);

  //functionality for deleting the asset from workorder
  const onDelete = () => {
  
    setWorkOrderList(workOrderList.filter((item) => selectedItem !== item._id));
    setShowModal(false);
      toast.success("Work order deleted successfully");
  };

   const openModal = (selected) => {
     setShowModal(true);
     setId(selected);
   };

   const closeModal = () => {
     setShowModal(false);
   };

  //functionality for submitting
  const handleSubmit = async (e) => {
    setFirstName("");
    setLastname("");
    setUsername("");
    setEmail("");

    if (validator.isEmpty(users.firstName)) {
      setFirstName("Required*");
    }
    if (validator.isEmpty(users.lastName)) {
      setLastname("Required*");
    }
    if (!validator.isLength(users.username, 3, 12)) {
      setUsername("Minimum 3 characters");
      if (validator.isEmpty(users.username)) {
        setUsername("Required*");
      }
    }
    if (!validator.isEmail(users.email)) {
      setEmail("Invalid Format");
      if (validator.isEmpty(users.email)) {
        setEmail("Required*");
      }
    }
    // if (!validator.isLength(users.password, 5, 12)) {
    //   setPassword("Password must be between 5 and 12 characters long");
    //   // error.password = true;
    //   // setPasscheck(true)
    //   if (validator.isEmpty(users.password)) {
    //     // setPassword("Required*");
    //   }
    // }

    if (
      requiredFirstName == "" &&
      requiredLastname == "" &&
      requiredUsername == "" &&
      requiredEmail == "" &&
      requiredPassword == ""
    ) {
      try {
    
        const workOrder = workOrderList.map((item) => ({ woId: item?._id }));
          // let datas = {
          //   accountStatus: users.accountStatus,
          //   email: users.email,
          //   firstName: users.firstName,
          //   lastName: users.lastName,
          //   userRole: users.userRole,
          //   username: users.username,
          //   password: bcrypt.hashSync(
          //     users.password,
          //     "$2a$10$CwTycUXWue0Thq9StjUM0u"
          //   ),
          // };
          
      //  if(passcheck===false){  
        await userService.postUserById(ID, users, workOrder).then(
          (response) => {
            toast.success("User updated successfully");
            navigate("/user-management");
          },
          (error) => {
            toast.error(error?.response?.data?.message);
          }
        );
      // }
      } catch (err) {}
    }
  };

  return (
    <>
      <Card title="User Management">
        <Form>
          <Row>
            <Col xl={3} lg={3} md={6}>
              <FormInput
                type="text"
                placeholder="Enter First Name"
                label="First Name"
                value={users?.firstName}
                onChange={handleFirstname}
                required
                errormsg={requiredFirstName}
              />
            </Col>
            <Col xl={3} lg={3} md={6}>
              <FormInput
                type="text"
                placeholder="Enter Last Name"
                label="Last Name"
                value={users?.lastName}
                onChange={handleLastname}
                required
                errormsg={requiredLastname}
              />
            </Col>
            <Col xl={3} lg={3} md={6}>
              <FormInput
                type="text"
                placeholder="Enter Username"
                label="Username"
                value={users?.username}
                onChange={handleUsername}
                readOnly
                required
                errormsg={requiredUsername}
              />
            </Col>
            <Col xl={3} lg={3} md={6}>
              <FormInput
                type="email"
                placeholder="Enter Email Address"
                label="Email Address"
                autocomplete="off"
                value={users?.email}
                readOnly
                onChange={handleEmail}
                required
                errormsg={requiredEmail}
              />
            </Col>
            <Col xl={3} lg={3} md={6}>
              {users?.userRole != "ADMIN" && (
                <FormSelect
                  label="User Type"
                  placeholder="Select User Type"
                  data={userTypeData}
                  value={users?.userRole}
                  onChange={handleUserType}
                />
              )}
            </Col>
            <Col xl={3} lg={3} md={6}>
              <FormSelect
                label="Status"
                placeholder="Select Status"
                data={userStatusData}
                value={users?.accountStatus}
                onChange={handleUserStatus}
              />
            </Col>
            <Col xl={3} lg={3} md={6}>
              <FormPassword
                label="Password"
                placeholder="Enter Password"
                onChange={handlePassword}
                value={users?.password}
                // required
                errormsg={requiredPassword}
              />
            </Col>
          </Row>
        </Form>
      </Card>
      <Card variant="remove-header">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="card-subtitle">Selected Work Orders</h4>
          <Button
            onClick={() =>
              navigate("/work-order", { state: { ID, workOrderList } })
            }
            variant="click-info"
            size="click-sm"
          >
            <AiOutlinePlusCircle size={20} />
            <span>Add Work Orders</span>
          </Button>
        </div>
        <div className="asset-table spacing-in table-align-left">
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
                <th> Permit type</th>
                <th>Priority</th>
                <th>Attachments</th>
                <th>Work Order Type</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {workOrderList &&
                workOrderList?.map((workOrder) => (
                  <tr key={workOrder?._id}>
                    <td>{workOrder?.woNumber}</td>
                    <td>{moment(workOrder?.woDate).format("DD/MM/YYYY")}</td>
                    <td>{workOrder?.department}</td>
                    <td>{workOrder?.maintanaceType}</td>
                    <td>{workOrder?.description}</td>
                    <td>{moment(workOrder?.startDate).format("DD/MM/YYYY")}</td>
                    <td>{workOrder?.duration}</td>
                    <td>{workOrder?.status}</td>
                    <td>{workOrder?.permitType}</td>
                    <td>{workOrder?.priority}</td>
                    <td>{workOrder?.attachments}</td>
                    <td></td>
                    <td>
                      <div className="table-action">
                        <Button
                          onClick={() => openModal(workOrder?._id)}
                          variant="click-none"
                          size="click-resize"
                          className="delete-btn"
                        >
                          <RiDeleteBinLine size={20} />
                        </Button>
                        {showModal && (
                          <Modal
                            closeModal={closeModal}
                            title="Delete Work Order ?"
                            text="Are you sure you want to delete this Work Order !"
                          >
                            <Button
                              variant="click-gray"
                              size="click-lg"
                              onClick={closeModal}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => onDelete(workOrder._id)}
                              variant="click-primary"
                              size="click-lg"
                            >
                              Delete
                            </Button>
                          </Modal>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
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
    </>
  );
};

export default UsersEdit;
