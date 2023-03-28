import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, PageHeader, TablePagination, Modal } from "../../components";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdClear } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import Table from "react-bootstrap/Table";
import userService from "../../services/userService";
import { toast } from "react-toastify";
import * as moment from "moment";

const style = {
  height: 30,
  margin: 6,
  padding: 8,
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const targetRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userdlt, setDlt] = useState([]);
  const [count, setCount] = useState(10);
  const [id, setId] = useState();
  const [limit, setLimit] = useState(30);
  const [offset, setOfset] = useState(0);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState("descending");
  const [sortField, setSortField] = useState("");
  const [sortCkecked, setSortChecked] = useState(false);
  const [orderMore, setOrderMore] = useState("");
  const [Loadmore, setLoadmore] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    let data = {
      limit: limit,
      skip: offset,
    };

    try {
      userService.getAllUsers(data).then((userData) => {
        setUsers(userData?.users);
        setTotal(userData?.info[0]?.total);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = () => {
    try {
      userService.deleteUser(id).then(
        (response) => {
          setShowModal(false);
          getUser();
          toast.success("User deleted successfully");
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (err) {
      setShowModal(true);
    }
  };

  const openModal = (id) => {
    setShowModal(true);
    setId(id);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const fetchMoreData = () => {
    setLoadmore(true);
    setLimit(limit + 30);
    setOfset(offset);
    let data = {};
    if (sortCkecked) {
      data = {
        limit: limit + 30,
        skip: offset,
        sortBy: sortField,
        order: orderMore || "",
      };
    } else {
      data = {
        limit: limit + 30,
        skip: offset,
      };
    }

    try {
      userService.getAllUsers(data).then((userData) => {
        setLoadmore(false);
        setUsers(userData?.users);
      });
    } catch (error) {
      console.log(error);
    }
  };
  function handleClick() {
    const targetElement = targetRef.current;
    if (targetElement) {
      targetElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }
  //functionalty for sorting as well as the ascending & descending based on the new field and old field
  const handleSort = (e) => {
    let data = {};
    let sort_order = order;
    setSortField(e);
    if (sortField === "" || sortField === e) {
      data = {
        sortBy: e,
        order: sort_order,
      };
    } else {
      data = {
        sortBy: e,
        order: "descending",
      };
    }
    try {
      userService.getAllUsers(data).then((userData) => {
        setUsers(userData?.users);
        setSortChecked(true);
        setOrderMore(order);
        if (data.order === "descending") {
          setOrder("ascending");
          setLimit(30);
          setOfset(0);
        } else {
          setOrder("descending");
          setLimit(30);
          setOfset(0);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClear = () => {
    setSortChecked(false);
    let data = {
      limit: limit,
      skip: offset,
    };

    try {
      userService.getAllUsers(data).then((userData) => {
        // setUsers(userData);
        // setUserList(userData.slice(0, 10))
        // setCount(count + 10);
        setLoadmore(false);
        setUsers(userData?.users);
        setTotal(userData?.info[0]?.total);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PageHeader title="User Management">
        {sortCkecked && (
          <Button onClick={handleClear} variant="click-info" size="click-sm">
            <MdClear />
            <span>Clear</span>
          </Button>
        )}

        <Link className="btn-link" to="/user-management/licence-updation">
          <Button variant="click-info" size="click-sm">
            <IoMdSettings />
            <span>License </span>
          </Button>
        </Link>

        <Link className="btn-link" to="/user-management/device-list">
          <Button variant="click-info" size="click-sm">
            <BsListTask />
            <span>Device </span>
          </Button>
        </Link>
        <Link className="btn-link" to="/user-management/mail-env">
          <Button variant="click-info" size="click-sm">
            <IoMdSettings />
            <span>SMTP Settings </span>
          </Button>
        </Link>
        <Link className="btn-link" to="/user-management/add">
          <Button variant="click-info" size="click-sm">
            <AiOutlinePlusCircle size={20} />
            <span>Add</span>
          </Button>
        </Link>
      </PageHeader>
      <div className="app__content">
        <div className="asset-table spacing-in" ref={targetRef}>
          <Table striped>
            <thead>
              <tr>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Name</span>
                    <FaSort
                      size={18}
                      onClick={(e) => handleSort("firstName")}
                    />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Username</span>
                    <FaSort size={18} onClick={(e) => handleSort("username")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Email Address</span>
                    <FaSort size={18} onClick={(e) => handleSort("email")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>User Type</span>
                    <FaSort size={18} onClick={(e) => handleSort("userRole")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Status</span>
                    <FaSort
                      size={18}
                      onClick={(e) => handleSort("accountStatus")}
                    />
                  </Button>
                </th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, index) => (
                  <tr style={style} key={index}>
                    <td>
                      <Link
                        to={{ pathname: `/user-management/edit/${user?._id}` }}
                      >
                        {user?.firstName} {user?.lastName}
                      </Link>
                    </td>
                    <td>{user?.username}</td>
                    <td>{user?.email}</td>
                    <td>{user?.userRole}</td>
                    <td>
                      {user?.accountStatus == "active" ? (
                        <span className="status active">Active</span>
                      ) : (
                        <span className="status disable">Disable</span>
                      )}
                    </td>
                    <td>
                      {user.userRole != "ADMIN" && (
                        <Button
                          onClick={() => openModal(user?._id)}
                          variant="click-none"
                          size="click-resize"
                          className="delete-btn float-right"
                        >
                          <RiDeleteBinLine size={20} />
                        </Button>
                      )}
                      {showModal && (
                        <Modal
                          closeModal={closeModal}
                          title="Delete User ?"
                          text="Are you sure you want to delete this User!"
                        >
                          <Button
                            variant="click-gray"
                            size="click-lg"
                            onClick={closeModal}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => deleteUser()}
                            variant="click-primary"
                            size="click-lg"
                          >
                            Delete
                          </Button>
                        </Modal>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {users.length === 0 ? (
            <p className="no-data" style={{ padding: "20px 0" }}>
              No data found
            </p>
          ) : (
            ""
          )}
        </div>
        <TablePagination
          Loadmore={Loadmore}
          fetchMoreData={fetchMoreData}
          totalResult={total}
          isLoading={limit > 30 ? true : false}
          showingResult={users}
          handleClick={handleClick}
        />
      </div>
    </>
  );
};

export default UserManagement;
