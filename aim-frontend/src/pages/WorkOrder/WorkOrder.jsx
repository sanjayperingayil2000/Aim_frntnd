import React, { useState, useEffect, useRef, useContext } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaSort } from "react-icons/fa";
import { AiOutlinePaperClip } from "react-icons/ai";
import workOrderService from "../../services/workOrderService";
import { Link, Navigate } from "react-router-dom";
import * as moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiFilterAlt } from "react-icons/bi";
import { images } from "../../constants";
import { statusDate } from "../../data/createWorkData";
import axios from "axios";
import { MyContext } from "../../routes/Routes";
import { toast } from "react-toastify";
import {
  Form,
  FormSelect,
  Button,
  FormCheckbox,
  TablePagination,
  Modal,
  DateRange,
  PageHeader,
  MultiSelect,
  PageFooter,
} from "../../components";
import { Row, Col } from "react-bootstrap";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { statusData, priorityData } from "../../data/workOrderFilterData";
import * as XLSX from "xlsx";
import { GiConsoleController } from "react-icons/gi";
import WorkOrderPdf from "./WorkOrderPdf";

const style = {
  height: 30,
  margin: 6,
  padding: 8,
};
const WorkOrder = ({ className }) => {
  const [workOrder, setworkOrder] = useState([]);
  const { myState, setMyState } = useContext(MyContext);

  const [workOrderList, setWorkOrderList] = useState([]);
    const [endingDate, setEndingDate] = useState("");
    const [startingDate, setStartingDate] = useState("");
  const [isChecked, setIsChecked] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [workdlt, setDlt] = useState([]);
  const [id, setId] = useState();
  const [order, setOrder] = useState("descending"); // default seeting state as descending as descending happens first
  const [orderMore, setOrderMore] = useState(""); //state to get the previously sorted order because after each sort order changes but it should not affect loadmore
  const [sortField, setSortField] = useState(""); // store  the name of the field that is sorted
  const [sortChecked, setSortChecked] = useState(false); //state to check whether sort is applid or not
  const [count, setCount] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const { state } = useLocation();
  const targetRef = useRef(null);
  const previouspage = state;
  const [filterChecked, setFilterChecked] = useState(false);
  const [isFilter, setFilter] = useState(true);
  const [overDue, setOverDue] = useState("");
  const [values, setValues] = useState({});
  const [limit, setLimit] = useState(30);
  const [offset, setOfset] = useState(0);
  const [total, setTotal] = useState(0);
  const [Loadmore, setLoadmore] = useState(false);
  const toggleFilter = () => setFilter(!isFilter);

  useEffect(() => {
    getWorkprders();
  }, []);

  const fetchMoreData = async () => {
    setLoadmore(true);
    setLimit(limit + 30);
    setOfset(offset);
    let data = {};
    if (sortChecked) {
      data = {
        limit: limit + 30,
        skip: offset,
        sortBy: sortField,
        order: orderMore || "",
      };
    }
    if (filterChecked) {
      let total = {
        limit: limit + 30,
        skip: offset,
      };
      data = { ...values, ...total };
    }
    if (!sortChecked && !filterChecked) {
      data = {
        limit: limit + 30,
        skip: offset,
      };
    }

    try {
      workOrderService.getAllWorkOrder(data).then((workOrderData) => {
        setLoadmore(false);
        setworkOrder(workOrderData?.workOrders);
        setTotal(workOrderData?.info[0]?.total);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkprders = () => {
    let data = {
      limit: limit,
      skip: offset,
    };

    try {
      const statusArray = [];
      workOrderService.getAllWorkOrder(data).then((workOrderData) => {
        setworkOrder(workOrderData?.workOrders);
        setTotal(workOrderData?.info[0]?.total);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    Overuduehandle();
  }, []);
  const Overuduehandle = async () => {
    const statusArray = [];
    let workOrderData = await workOrderService.getAllWorkOrder();
    console.log(workOrderData);
    let date = moment(new Date()).format("YYYYMMDD");

    workOrderData?.workOrders?.map((item) => {
      console.log(date - moment(item?.woDate).format("YYYYMMDD"));
      console.log(date);
      console.log(moment(item?.woDate).format("YYYYMMDD"));
      if (
        item.status != "cancelled" &&
        item.status != "closed" &&
        date - moment(item?.woDate).format("YYYYMMDD") > 1
      ) {
        // console.log(item.status);
        statusArray.push(item.status);
      }
      setOverDue(statusArray.length);
    });
  };

  const deleteWorkOrders = () => {
    try {
      workOrderService.deleteWorkOrder(id).then(
        (response) => {
          setShowModal(false);
          getWorkprders();
          toast.success("Work order deleted successfully");
          Overuduehandle();
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

  useEffect(() => {
    function handleMedia() {
      if (window.innerWidth < 992) {
        setFilter(false);
      } else {
        setFilter(true);
      }
    }
    handleMedia();
    window.addEventListener("resize", handleMedia);
  }, []);

  const handleStatus = (event, data) => {
    setValues({ ...values, status: data.value });
  };
  const handlePriority = (event, data) => {
    setValues({ ...values, priority: data.value });
  };
  const handleStartRange = (event, data) => {
    setValues({ ...values, startDate: data.value });
  };
  const handleEndRange = (event, data) => {
    setEndingDate(data.value);
    setValues({ ...values, endDate: moment(data.value).format("YYYY-MM-DD") });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    try {
      workOrderService.getAllWorkOrder(values).then((workOrderData) => {
        setworkOrder(workOrderData?.workOrders);
        setTotal(workOrderData?.info[0]?.total);
        setFilterChecked(true);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterClear = async (event) => {
    setStartingDate("");
    setEndingDate("");

    let data = {
      limit: limit,
      skip: offset,
    };
    event.preventDefault();
    try {
      workOrderService.getAllWorkOrder(data).then((workOrderData) => {
        setworkOrder(workOrderData?.workOrders);
        setTotal(workOrderData?.info[0]?.total);
        setSortChecked(false);
        setFilterChecked(false);
      });
    } catch (error) {
      console.log(error);
    }

     setValues({
       ...values,
       priority: "",
       status: "",
     });
  };

  //functionality for downloading excel sheet

  const handleExcel = () => {
    setMyState(true);

    try {
      workOrderService.getExcel(values).then((datas) => {
        dowloadExcel(datas);
      });
    } catch (error) {
      console.log(error);
    }
    //  dispatch(getLookup());
    //  dispatch(getSubLookup());
  };
  // const dowloadExcel = (data) => {
  //   var config = {
  //     method: "get",
  //     url: data.url,
  //     timeout: 6000000, // Set the timeout to 60 seconds (or any value that fits your needs)
  //   };
  //   axios(config)
  //     .then(function (response) {
  //       downloadURIexcel(data.url, data.fileName);
  //       assetService.removeExcel(data.fileName).then((res) => {
  //         if (res) {
  //           setMyState(false);
  //         }
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       if (error.response.status === 400) {
  //         setTimeout(() => {
  //           dowloadExcel(data);
  //         }, 5000);
  //       }
  //       if (error.code === "ECONNABORTED") {
  //         console.log("Timeout error:", error.message);
  //         // Handle the timeout error as needed (retry the request, show an error message, etc.)
  //       }
  //     });
  // };

  const dowloadExcel = (data) => {
    var config = {
      method: "get",
      url: data.url,
    };
    axios(config)
      .then(function (response) {
        downloadURIexcel(data.url, data.fileName);
        workOrderService.removeExcel(data.fileName).then((res) => {
          if (res) {
            setMyState(false);
          }
        });
      })
      .catch(function (error) {
        console.log(error, "this is error");
        if (error.response.status === 400 || error.response.status === 524) {
          setTimeout(() => {
            dowloadExcel(data);
          }, 5000);
        }
      });
  };

  const downloadURIexcel = (uri, name, data) => {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      headers: {
        Authorization: `Bearer ${JSON.parse(accessToken).value}`,
      },
    };
    // fetch(uri, options)
    //   .then((res) => res.blob())
    //   .then((blob) => {
    //     const fileURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    console.log("URI", uri);
    downloadLink.href = uri;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  const filterAnim = {
    hidden: {
      opacity: 0,
      height: "0px",
      marginBottom: "0",
      transition: {
        all: 0.5,
      },
    },
    show: {
      opacity: 1,
      height: "220px",
      marginBottom: "50px",
      transition: {
        all: 0.5,
      },
    },
  };

  const formAnim = {
    hidden: {
      opacity: 0,
      display: "none",
      transition: {
        all: 0.5,
      },
    },
    show: {
      opacity: 1,
      display: "block",
      transition: {
        all: 0.5,
      },
    },
  };
  function handleClick() {
    const targetElement = targetRef.current;
    if (targetElement) {
      targetElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }
  //functionality for handling the checkbox multi-select
  const handleCheckboxChange = (e, index) => {
    if (previouspage === "adduser" || previouspage.ID !== null) {
      if (e.target.checked) {
        setIsChecked([...isChecked, index]);
      } else {
        setIsChecked(isChecked.filter((item) => item !== index));
      }
    } else {
      if (e.target.checked) {
        setIsChecked([index]);
      } else {
        setIsChecked([]);
      }
    }
  };

  //functionality for passing selected  work-order to user add or edit
  const handleAddUser = () => {
    let data = isChecked.map((selected) => {
      return workOrder[selected];
    });

    let datas = [];
    if (previouspage.workOrder !== undefined) {
      datas = [...data, ...previouspage.workOrder];
    }
    if (previouspage === "addUser") {
      navigate("/user-management/add", { state: data });
    } else if (previouspage.ID !== null) {
      navigate(`/user-management/edit/${previouspage.ID}`, { state: data });
    }
  };
  //functionalty for sorting as well as the ascending & descending based on the new field and old field
  const handleSort = (e) => {
    let data = {};
    let sort_order = order;
    setSortField(e);
    if (sortField === "" || sortField === e) {
      data = {
        sortBy: e,
        order: sort_order,
        priority: values?.priority,
        status: values?.status,
      };
    } else {
      data = {
        sortBy: e,
        order: "descending",
        priority: values?.priority,
        status: values?.status,
      };
    }
    try {
      workOrderService.getAllWorkOrder(data).then((workOrderData) => {
        setworkOrder(workOrderData?.workOrders);

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

  return (
    <>
      <PageHeader title="Work Order" className="filter-btns">
        <Button variant="click-info" size="click-sm" disabled>
          <div className="disabled__data">
            <span className="disabled__label">Overdue WO's</span>
            <span className="disabled__divider">|</span>
            <span className="disabled__value">{overDue}</span>
          </div>
        </Button>
        <Link to="/work-order/add" className="btn-link">
          <Button variant="click-info" size="click-sm">
            <AiOutlinePlusCircle size={20} />
            <span>Add</span>
          </Button>
        </Link>
        <Button onClick={handleExcel} variant="click-info" size="click-sm">
          <img src={images.excel} alt="Export to Excel" />
          <span>Excel</span>
        </Button>
        <PDFDownloadLink document={<WorkOrderPdf workOrder={workOrder} />}>
          {workOrder[0] && (
            <Button variant="click-info" size="click-sm">
              <img src={images.print} alt="Print Document" />
              <span>Print</span>
            </Button>
          )}
        </PDFDownloadLink>
        <Button
          size="click-sm"
          onClick={toggleFilter}
          className="filter-btn"
          variant={`${isFilter ? "click-primary" : "click-info"}`}
        >
          <BiFilterAlt size={20} />
          <span>Filter</span>
        </Button>
      </PageHeader>
      <div
        className={`app__filter work_filter ${className} ${isFilter && "show"}`}
      >
        <Form className="filter" onSubmit={handleFilter}>
          <Row>
            <Col xl={4} lg={4} md={6}>
              <FormSelect
                label="WO by Status"
                placeholder="Select"
                value={values.status}
                data={statusDate}
                onChange={handleStatus}
              />
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormSelect
                label="Work Order Priority"
                placeholder="Select "
                value={values.priority}
                data={priorityData}
                onChange={handlePriority}
              />
            </Col>
            <Col xl={4} lg={4} md={6}>
              <DateRange
                handleFrom={handleStartRange}
                handleTo={handleEndRange}
                fromDate={values.startDate}
                toDate={values.endDate}
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12} lg={12}>
              <div className="app__btns submit">
                <Button
                  onClick={handleFilterClear}
                  variant="click-gray"
                  size="click-lg"
                  type="button"
                >
                  Clear
                </Button>
                <Button variant="click-primary" size="click-lg" type="submit">
                  Apply
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="app__content">
        <div className="asset-table selectable spacing-in" ref={targetRef}>
          <Table striped>
            <thead>
              <tr>
                <th></th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>WO Number</span>
                    <FaSort size={18} onClick={(e) => handleSort("woNumber")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>WO Date</span>
                    <FaSort size={18} onClick={(e) => handleSort("woDate")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Department</span>
                    <FaSort
                      size={18}
                      onClick={(e) => handleSort("department")}
                    />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Maintenance Type</span>
                    <FaSort
                      size={18}
                      onClick={(e) => handleSort("maintanaceType")}
                    />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Description</span>
                    <FaSort
                      size={18}
                      onClick={(e) => handleSort("description")}
                    />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Start Date</span>
                    <FaSort
                      size={18}
                      onClick={(e) => handleSort("startDate")}
                    />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Duration</span>
                    <FaSort size={18} onClick={(e) => handleSort("duration")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>End Date</span>
                    {/* <FaSort size={18} 
                    onClick={(e) => handleSort("inspectedBy")}
                    /> */}
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Status</span>
                    <FaSort size={18} onClick={(e) => handleSort("status")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Permit Type</span>
                    <FaSort
                      size={18}
                      onClick={(e) => handleSort("permitType")}
                    />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Priority</span>
                    <FaSort size={18} onClick={(e) => handleSort("priority")} />
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Attachments</span>
                    {/* <FaSort
                      size={18}
                      onClick={(e) => handleSort("inspectedBy")}
                    /> */}
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Completed/Total</span>
                    <FaSort size={18} onClick={(e) => handleSort("total")} />
                  </Button>
                </th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {workOrder &&
                workOrder.map((workOrder, index) => (
                  <tr style={style} key={index}>
                    <td>
                      <FormCheckbox
                        onChange={(e) => handleCheckboxChange(e, index)}
                        checked={isChecked.some((item) => item === index)}
                        name={"assetCheckbox"}
                      />
                    </td>
                    <td>
                      <Link
                        to={{ pathname: `/work-order/edit/${workOrder?._id}` }}
                      >
                        {workOrder?.woNumber}
                      </Link>
                    </td>
                    {/* <td>{workOrder.woTypeId}</td> */}
                    <td>{moment(workOrder?.woDate).format("DD/MM/YYYY")}</td>
                    <td>{workOrder?.department}</td>
                    <td>{workOrder?.maintanaceType}</td>
                    <td>{workOrder?.description}</td>
                    <td>{moment(workOrder?.startDate).format("DD/MM/YYYY")}</td>
                    <td>{workOrder?.duration}</td>
                    <td>
                      {moment(workOrder?.startDate)
                        .add(workOrder?.duration, "days")
                        .format("DD/MM/YYYY")}
                    </td>
                    <td>{workOrder?.status}</td>
                    <td>{workOrder?.permitType}</td>
                    <td>{workOrder?.priority}</td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(
                          `${process.env.REACT_APP_BACKEND_BASE_URL}/${workOrder?.attachementUrl}`
                        );
                      }}
                    >
                      {workOrder?.attachments}
                    </td>
                    <td>
                      {" "}
                      {workOrder?.total ? (
                        <>
                          {workOrder?.completed} / {workOrder?.total}
                        </>
                      ) : (
                        ""
                      )}{" "}
                    </td>
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
                              onClick={() => deleteWorkOrders()}
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
          {workOrder.length === 0 ? (
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
          showingResult={workOrder}
          handleClick={handleClick}
        />
        {console.log(workOrder.length, "hh")}
        {console.log(total, "hh")}
        {previouspage && (
          <PageFooter>
            <Button
              onClick={handleAddUser}
              variant="click-primary"
              size="click-lg"
              type="submit"
            >
              Add to User
            </Button>
          </PageFooter>
        )}
      </div>
    </>
  );
};

export default WorkOrder;
