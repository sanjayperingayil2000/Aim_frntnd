import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import { Button, Modal, PageHeader } from "../../components";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import { RiDeleteBinLine } from "react-icons/ri";
function UserDeviceList() {
  const [deviceList, setDeviceList] = useState([]);
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deviceName, setDeviceName] = useState("")
  const [ID, setID] = useState("")

  useEffect(() => {
    getList();
  },[]);

  const getList = async () => {
    let datas = await userService.getDeviceList();
    setDeviceList(datas?.DeviceDetails);
  };
  const handleSubmit=async()=>{
    let DeviceMngmnt = {
      DeviceName: deviceName,
    };
    let datas = await userService.updateDevice(ID, DeviceMngmnt);
      toast.success("Device Name added successfully");
  }


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  const deleteDeviceList = () => {
    try {
      userService.deleteDevice(id).then(
        (response) => {
          setShowModal(false);
          toast.success("Device deleted successfully");
          getList();
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

  return (
    <div>
      <PageHeader title="Device Management"></PageHeader>
      <div className="app__content">
        <div className="asset-table spacing-in">
          <Table striped>
            <thead>
              <tr>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Device Name</span>
                    {/* <FaSort
                      size={18}
                    //   onClick={(e) => handleSort("firstName")}
                    /> */}
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Android ID</span>
                    {/* <FaSort
                      size={18}
                    //   onClick={(e) => handleSort("firstName")}
                    /> */}
                  </Button>
                </th>
                <th>
                  <Button
                    variant="click-none"
                    size="resize"
                    className="sort-btn"
                  >
                    <span>Seriel Key</span>
                    {/* <FaSort size={18} onClick={(e) => handleSort("username")} /> */}
                  </Button>
                </th>
                <th></th>

                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deviceList?.map((item, i) => {
                return (
                  <tr>
                    <td>
                      <input
                        className="wo-input"
                        
                        type="text"
                        value={item?.DeviceName}
                        onChange={(ev) => {
                          item.DeviceName = ev.target.value;
                          setDeviceName(item.DeviceName);
                          setID(item._id);
                          // setAssetDetails({ ...assetDetails });
                        }}
                        onKeyDown={handleKeyDown}
                      />
                    </td>
                    <td>{item?.AndroidID}</td>
                    <td>{item?.AndroidLicenSeKey}</td>
                    <td>{/* <RiDeleteBinLine size={20} /> */}</td>

                    <td>
                      <Button
                        onClick={() => openModal(item?._id)}
                        variant="click-none"
                        size="click-resize"
                        className="delete-btn float-right"
                      >
                        <RiDeleteBinLine size={20} />
                      </Button>
                      {showModal && (
                        <Modal
                          closeModal={closeModal}
                          title="Delete Device ?"
                          text="Are you sure you want to delete this Device!"
                        >
                          <Button
                            variant="click-gray"
                            size="click-lg"
                            onClick={closeModal}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => deleteDeviceList()}
                            variant="click-primary"
                            size="click-lg"
                          >
                            Delete
                          </Button>
                        </Modal>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>{" "}
        </div>{" "}
      </div>
    </div>
  );
}

export default UserDeviceList;
