import React, { useState } from "react";
import {
  Form,
  FormInput,
  MixedInput,
  DatePicker,
  FormSelect,
  Button,
  Card,
  AddTable,
  FileUpload,
  PageHeader,
  PageFooter,
} from "../../components";
import { Row, Col } from "react-bootstrap";
import { AiOutlineFileText } from "react-icons/ai";
import {
  statusDate,
  permitTypeData,
  priorityData,
} from "../../data/createWorkData";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import workOrderService from "../../services/workOrderService";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import fileService from "../../services/fileService";

const WorkNew = () => {
  const navigate = useNavigate();
  const [workOrder, setValues] = useState({});
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [showAreaFile, setShowAreaFile] = useState(false);
  const [requiredMsg, setRequired] = useState("");
  const [name, setName] = useState("");
  const [requiredDepartment, setRequiredDepartment] = useState("");
  const [requiredDescription, setRequiredDescription] = useState("");

  const handleDepartment = (e) => {
    setValues({ ...workOrder, department: e.target.value });
  };
  const handleDescription = (e) => {
    setValues({ ...workOrder, description: e.target.value });
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
  const handleDate = (event, data) => {
    setValues({ ...workOrder, woDate: data.value });
  };
  const handleStartDate = (event, data) => {
    setValues({ ...workOrder, startDate: data.value });
  };
  const handleDuration = (e) => {
    setValues({ ...workOrder, duration: e.target.value });
  };
  const handleWorkOrder = (e) => {
    setValues({ ...workOrder, attachment: e.target.value });
  };

  const { state } = useLocation();
  const [assetData, setAssetData] = useState(state);
  let newList = [];

  //functionality for deleting the asset from workorder
  const onDelete = (setItem) => {
    newList = assetData.filter((item) => {
      return setItem._id !== item._id;
    });
    setAssetData(newList);
  };

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
           attachments: response?.data?.data?.uploadStatus?.originalName,
              attachementUrl: response?.data?.data?.uploadStatus?.file,
            });
            console.log(response?.data?.data?.uploadStatus?.file);
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
  const handleSubmit = async (e) => {
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
        if (assetData !== null) {
          const assets = state.map((item) => ({ assetId: item._id }));
          await workOrderService
            .postworkOrderNew({ ...workOrder, isActive: true }, assets)
            .then(
              (response) => {
                let status = response.data.status;
                if (status === true) {
                  toast.success("Work order added successfully");
                  navigate("/work-order");
                }
              },
              (error) => {
                console.log(error);
              }
            );
        } else {
          await workOrderService
            .postworkOrderNew({ ...workOrder, isActive: true })
            .then(
              (response) => {
                let status = response.data.status;
                if (status === true) {
                  toast.success("Work order added successfully");
                  navigate("/work-order");
                }
              },
              (error) => {
                console.log(error);
              }
            );
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <PageHeader title="Work Order" />
      <Card title="Create Work Order">
        <Form>
          <Row className="align-items-start">
            {/* <Col xxl={3} lg={4} md={6}>
              <AddTable
                label='Assets'
                placeholder='Choose Assets'
                value="Asset added"
                onClick={() => navigate("/asset-register", { state: { previousPage: "addworkorder", assetData: { ...assetData } } })}
              />
            </Col> */}
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Auto Generated"
                label="WO Number"
                // onChange={ (e) => handleWOnumber(e)}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <DatePicker
                label="WO Date"
                name="woDate"
                handleFrom={handleDate}
                fromDate={workOrder.woDate}
                value={workOrder.woDate}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Enter here"
                label="Department"
                onChange={(e) => handleDepartment(e)}
                required
                errormsg={requiredMsg ? requiredMsg : requiredDepartment}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="text"
                placeholder="Enter here"
                label="Description"
                onChange={(e) => handleDescription(e)}
                required
                errormsg={requiredMsg ? requiredMsg : requiredDescription}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <DatePicker
                label="Start Date"
                name="startDate"
                handleFrom={handleStartDate}
                fromDate={workOrder.startDate}
                value={workOrder.startDate}
              />
            </Col>

            <Col xxl={3} lg={4} md={6}>
              <FormInput
                type="number"
                placeholder="Enter here"
                label="Duration"
                min="0"
                onChange={(e) => handleDuration(e)}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="Permit Type"
                placeholder="Select"
                data={permitTypeData}
                onChange={handlePermit}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="Priority"
                placeholder="Select"
                data={priorityData}
                onChange={handlePriority}
              />
            </Col>
            <Col xxl={3} lg={4} md={6}>
              <FormSelect
                label="Status"
                placeholder="Select"
                data={statusDate}
                onChange={handleStatus}
              />
            </Col>

            <Col xxl={3} lg={4} md={6}>
              <MixedInput
                labelStyle="form-label"
                label="Attachments"
                textValue={workOrder.attachments ? filename : ""}
                onFileChange={changeHandler}
                onTextChange={handleWorkOrder}
              />
              {showAreaFile && (
                <span className="file-name">
                  <AiOutlineFileText size={20} />
                  {filename}
                </span>
              )}
            </Col>
          </Row>
        </Form>
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
      {assetData && (
        <PageFooter>
          <div className="asset-table spacing-in table-align-left">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="card-subtitle">Selected Assets</h4>
            </div>
            <Table striped>
              <thead>
                <tr>
                  <th>RFID Reference</th>
                  <th>Equipment Tag</th>
                  <th>Area</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {assetData &&
                  assetData.map((asset) => (
                    <tr key={asset._id}>
                      <td>{asset.rfidRef}</td>
                      <td>{asset.eqpmtTag}</td>
                      <td>{asset.description}</td>
                      <td>{asset.manufacturer}</td>
                      <td>{asset.eqpmtCatg}</td>
                      <td>{asset.protectionStd}</td>
                      <td>
                        <div className="table-action">
                          <Button
                            onClick={() => {
                              onDelete(asset);
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

export default WorkNew;
