import React, { useState, useEffect } from "react";
import {
  Form,
  FormInput,
  DatePicker,
  FormSelect,
  Dropdown,
  Button,
  Card,
  Modal,
  PageFooter,
  MixedInput,
  ReadOnlyInput
} from "../../components";
import fileService from "../../services/fileService";

import { AiOutlineFileText } from "react-icons/ai";
import { Row, Col } from "react-bootstrap";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Table from "react-bootstrap/Table";
import { useNavigate, useLocation } from "react-router-dom";
import workOrderService from "../../services/workOrderService";
import {
  Assetlistdropdown,
  statusDate,
  permitTypeData,
  priorityData,
  completeFilterData,
} from "../../data/createWorkData";

import { useParams } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import * as moment from "moment";

const WorkNew = () => {
  const navigate = useNavigate();
  const id = useParams();
  const ID = id._id;
  let arrayFinal = [];
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setId] = useState("");
  const [filename, setFilename] = useState("");
  const [showAreaFile, setShowAreaFile] = useState(false);
  const [workOrder, setValues] = useState({});
  const [assetsList, setAssetsList] = useState([]);
  const [assetsData, setAssetsData] = useState([]);
  const [requiredMsg, setRequired] = useState("");
  const [requiredDepartment, setRequiredDepartment] = useState("");
  const [requiredDescription, setRequiredDescription] = useState("");

  const handleWOnumber = (e) => {
    setValues({ ...workOrder, woNumber: e.target.value });
  };
  const handleDepartment = (e) => {
    setValues({ ...workOrder, department: e.target.value });
  };
  const handleDescription = (e) => {
    setValues({ ...workOrder, description: e.target.value });
  };
  const handleDuration = (e) => {
    setValues({ ...workOrder, duration: e.target.value });
  };
  const handleStatus = (event, { value }) => {
    setValues({ ...workOrder, status: value });
  };
  const handlePermit = (event, { value }) => {
    setValues({ ...workOrder, permitType: value });
  };
  const handlePriority = (event, { value }) => {
    setValues({ ...workOrder, priority: value });
  };
  const handleCompleted = (event, { value }) => {
    setValues({ ...workOrder, completed: value });
  };
  const handleDate = (event, data) => {
    setValues({ ...workOrder, woDate: data.value });
  };
  const handleStartDate = (event, data) => {
    setValues({ ...workOrder, startDate: data.value });
  };
  const handleWorkOrder = (e) => {
    setValues({ ...workOrder, attachment: e.target.value });
  };

  const handleAssetStaus = (id, data) => {
    const newList = assetsList.map((item) => {
      if (item._id === id) {
        const updatedItem = {
          ...item,
          workorderStatus: data.target.value,
        };
        return updatedItem;
      }
      return item;
    });
    setAssetsList(newList);
  };

  const handleAssetRemark = (id, data) => {
    const newList = assetsList.map((item) => {
      if (item._id === id) {
        const updatedItem = {
          ...item,
          remark: data.target.value,
        };
        return updatedItem;
      }
      return item;
    });
    setAssetsList(newList);
  };

  //retriveing of work-order data from api
  useEffect(() => {
    try {
      workOrderService.getWorkOrderId(String(ID)).then((data) => {
        setAssetsData(data?.workOrderAssets);
        setValues(data?.workOrder);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  //data passing from asset register page is on assetRegisterData
  const { state } = useLocation();
  const assetRegisterData = state;

  //functionality for deleting the asset from workorder
  const onDelete = () => {
    setAssetsList(assetsList.filter((item) => selectedItem !== item?._id));
      setShowModal(false);
      toast.success("Asset deleted successfully")
  };

  const openModal = (id) => {
    setShowModal(true);
    setId(id);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const deleteFilename = () => {
    let workOrder = {
      attachment: "",
    };
  };

  //functionality for handling fileupload
  const changeHandler = async (e) => {
    let selFile = e.target.files[0];
    setFile(selFile);
    setFilename(e.target.files[0].name);
    const formData = new FormData();
    formData.append("file", selFile);
    if (selFile !== undefined) {
      setShowAreaFile(true);
    }
    try {
      await fileService.fileUpload(formData, "dataSheet").then(
        (response) => {
          if (response?.data?.status) {
            setValues({
              ...workOrder,
              // attachmentLink: response?.data?.data?.uploadStatus?.file,

              attachments: response?.data?.data?.uploadStatus?.originalName,

              attachementUrl: response?.data?.data?.uploadStatus?.file,
            });
            setName(response?.data?.data?.uploadStatus?.file);
          } else {
            toast.error(" Pdf files are required");
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

  //array mixing from api and asset register page
  useEffect(() => {
    if (assetsData != null) {
      setAssetsList(assetsData);
      if (assetRegisterData != null) {
        setAssetsList([
          ...new Map(
            [...assetsData, ...assetRegisterData].map((m) => [m?._id, m])
          ).values(),
        ]);
      }
    }
  }, [assetsData, assetRegisterData]);

  //functionality foe submitting
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      workOrder.department === undefined &&
      workOrder.description === undefined
    ) {
      setRequired("Required*");
    } else if (
      workOrder.department === undefined ||
      workOrder.department === ""
    ) {
      setRequiredDepartment("Required* department");
      setRequired("");
      setRequiredDescription("");
    } else if (
      workOrder.description === undefined ||
      workOrder.description === ""
    ) {
      setRequiredDescription("Required* description");
      setRequiredDepartment("");
      setRequired("");
    } else {
      setRequired("");
      setRequiredDescription("");
      setRequiredDepartment("");

      try {
        const complete = assetsList?.filter((f) => f?.status !== "Active");

        const assets = assetsList.map((item) => ({
          assetId: item?._id,
          total: assetsList?.length,
          completed: complete?.length,
          remark: item?.remark,
          workorderStatus: item?.workorderStatus,
        }));

        await workOrderService.postworkOrderById(ID, workOrder, assets).then(
          (response) => {
            let status = response?.data?.status;
            if (status === true) {
              toast.success("Work order updated successfully");
              navigate("/work-order");
            }
          },
          (error) => {
            console.log(error);
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <Card title="Work Order">
        <Form>
          <Row className="align-items-end">
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Auto Generated"
                label="WO Number"
                onChange={handleWOnumber}
                value={workOrder.woNumber}
                disabled
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <DatePicker
                label="WO Date"
                handleFrom={handleDate}
                fromDate={moment(workOrder.date)}
                value={moment(workOrder.woDate)}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Enter Department"
                label="Department"
                onChange={handleDepartment}
                value={workOrder.department}
                required
                errormsg={requiredMsg ? requiredMsg : requiredDepartment}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Enter description"
                label="Description"
                onChange={handleDescription}
                value={workOrder.description}
                required
                errormsg={requiredMsg ? requiredMsg : requiredDescription}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <DatePicker
                label="Start Date"
                handleFrom={handleStartDate}
                fromDate={moment(workOrder.startDate)}
                value={moment(workOrder.startDate)}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="number"
                placeholder="Enter Duration in Days"
                label="Duration"
                min="0"
                value={workOrder.duration}
                onChange={handleDuration}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="Permit Type"
                placeholder="Choose Permit Type"
                data={permitTypeData}
                value={workOrder.permitType}
                onChange={handlePermit}
                // defaultValue={workOrder.permitType}
              />
            </Col>

            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="Priority"
                placeholder="Choose Priority"
                data={priorityData}
                value={workOrder.priority}
                onChange={handlePriority}
                // defaultValue={workOrder.priority}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <ReadOnlyInput
                label="Completed/Total"
                placeholder="Auto Updated"
                data={completeFilterData}
                value={workOrder?.completed+"/"+workOrder?.total}
                onChange={handleCompleted}
              />
            </Col>

            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="Status"
                placeholder="Choose Status"
                data={statusDate}
                value={workOrder.status}
                onChange={handleStatus}
              />
              <span className="file-name" style={{ height: 20 }}></span>
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <MixedInput
                labelStyle="form-label"
                label="Attachments"
                textValue={workOrder.attachments ? workOrder.attachments : ""}
                onFileChange={changeHandler}
                onTextChange={handleWorkOrder}
              />
              {showAreaFile ? (
                <span className="file-name">
                  <AiOutlineFileText size={20} />
                  {filename}
                </span>
              ) : (
                <span className="document-name">
                  <span
                    onClick={() => {
                      window.open(
                        `${process.env.REACT_APP_BACKEND_BASE_URL}/${workOrder?.attachementUrl}`
                      );
                    }}
                  >
                    {workOrder.attachments && <AiOutlineFileText size={20} />}
                    {workOrder.attachments}
                  </span>
                  <span style={{ marginLeft: "10px" }} onClick={deleteFilename}>
                    {workOrder.attachments && (
                      <RiDeleteBinLine
                        onClick={() => {
                          workOrder.attachementUrl = "";
                          workOrder.attachments = "";
                          setValues({ ...workOrder });
                        }}
                        size={20}
                      />
                    )}
                  </span>
                </span>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
      <Card variant="remove-header">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="card-subtitle">Selected Assets</h4>
          <Button
            onClick={() =>
              navigate("/asset-register", {
                state: { previouspage: "editworkorder", ID: ID },
              })
            }
            variant="click-info"
            size="click-sm"
          >
            <AiOutlinePlusCircle size={20} />
            <span>Add Assets</span>
          </Button>
        </div>
        <div className="asset-table spacing-in table-align-left">
          <Table striped>
            <thead>
              <tr>
                <th>RFID Reference</th>
                <th>Equipment Tag</th>
                {/* <th>Area</th> */}
                <th>Description</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {assetsList &&
                assetsList.map((asset) => (
                  <tr key={asset?._id}>
                    {asset?._id ? (
                      <>
                        <td>{asset?.rfidRef}</td>
                        <td>{asset?.eqpmtTag}</td>
                        {/* <td>{asset?.area}</td> */}
                        <td>{asset?.description}</td>
                        <td>
                          <select
                            value={asset?.workorderStatus}
                            onChange={(e) => handleAssetStaus(asset?._id, e)}
                            className="wo-select"
                          >
                            <option value="default" disabled>
                              Choose your option
                            </option>
                            {Assetlistdropdown.map((item) => (
                              <option value={item.value}>{item.value}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            className="wo-input"
                            name="remark"
                            type="text"
                            placeholder="Remarks here.."
                            // value={asset?.remark}
                            value={asset?.remark ? asset?.remark : ""}
                            onChange={(e) => handleAssetRemark(asset?._id, e)}
                          />
                        </td>
                        <td>
                          <div className="table-action">
                            {/* <Button
                              onClick={() => {
                                onDelete(asset);
                              }}
                              variant="click-none"
                              size="click-resize"
                              className="delete-btn"
                            >
                              <RiDeleteBinLine size={20} />
                            </Button> */}
                            <Button
                              onClick={() => openModal(asset?._id)}
                              variant="click-none"
                              size="click-resize"
                              className="delete-btn float-right"
                            >
                              <RiDeleteBinLine size={20} />
                            </Button>
                            {showModal && (
                              <Modal
                                closeModal={closeModal}
                                title="Delete Asset ?"
                                text="Are you sure you want to delete this asset!"
                              >
                                <Button
                                  variant="click-gray"
                                  size="click-lg"
                                  onClick={closeModal}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => onDelete(asset)}
                                  variant="click-primary"
                                  size="click-lg"
                                >
                                  Delete
                                </Button>
                              </Modal>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      ""
                    )}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </Card>
      <PageFooter>
        <Button
          onClick={() => navigate("/work-order")}
          variant="click-gray"
          size="click-lg"
          type="button"
        >
          Cancel
        </Button>
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

export default WorkNew;
