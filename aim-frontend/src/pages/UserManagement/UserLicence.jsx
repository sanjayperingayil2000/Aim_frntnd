import React, { useEffect, useState } from "react";
import { Form, FormInput, Card, Button, PageHeader } from "../../components";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import userService from "../../services/userService";
import * as moment from "moment";
import { FiCalendar, FiKey, FiUsers } from "react-icons/fi";

function UserLicence() {
  const navigate = useNavigate();
  const [LimitToken, setUserLimit] = useState({
    LimitToken: {

    }
  });
  const [DateLimit, setDateLimit] = useState("");
  const [serielKey, setSerielkey] = useState("");
  const [Limit, setLimit] = useState("");
  const [ID, setId] = useState("");
  const [licenseDate, setDate] = useState("");
  const [maximumUserLimit, setMaxuserLimit] = useState("");



  const handleLicencekey = (e) => {
    setUserLimit({ ...LimitToken, ...LimitToken, LimitToken: e.target.value });
    setLimit(e.target.value);
  };

  const handleDateRenewel = (e) => {
    setDateLimit(e.target.value);
  };


  useEffect(async () => {
    let datas = await userService.getLimitToken();
    setSerielkey(datas?.Tokens[0]?.LimitToken);
    setId(datas?.Tokens[0]?._id);

 const key = CryptoJS.enc.Utf8.parse("softnotions_test");
 const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

 const bytes = CryptoJS.AES.decrypt(datas?.Tokens[0]?.LimitToken, key, {
   iv: iv,
 });
 const data = bytes.toString(CryptoJS.enc.Utf8);
 
 
    setDate(data?.split(",")[0]);
    setMaxuserLimit(data?.split(",")[1]);


  },[]);

  const handleSubmit = async () => {
    const datas = CryptoJS.AES.encrypt(
      JSON.stringify("19"),
      "softnotions"
    ).toString();

    try {


  const key = CryptoJS.enc.Utf8.parse("softnotions_test");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

  const bytes = CryptoJS.AES.decrypt(Limit, key, {
    iv: iv,
  });
  const data = bytes.toString(CryptoJS.enc.Utf8);
      if (serielKey === Limit) {
        toast.error("License key already used");
      }
    
      else if(Limit.length>24){
          toast.error("invalid seriel key");
      }
      else if (data?.split(",")[1] > 5) {
        try {
          let datas = await userService.UpdateToken(ID, LimitToken);
          toast.success(`License Updated successfully    
          Validity:${data?.split(",")[0]} / User Limit:${data?.split(",")[1]}`);
          navigate("/user-management");
        } catch {
          toast.error("invalid seriel key");
        }
      } else {
        toast.error("invalid seriel key");
      }
    } catch {
      toast.error("invalid seriel key");
    }
  };
  return (
    <>
      <PageHeader title="License Updation" />
      <Card variant="remove-header">
        <Row>
          <Col xxl={3} lg={12} md={6}>
            <FormInput
              type="text"
              placeholder="Enter New License key"
              label="License Key"
              onChange={(e) => handleLicencekey(e)}
            />
            <div className="app__btns submit">
              <Button variant="click-gray" size="click-lg" type="button">
                Clear
              </Button>
              <Button onClick={handleSubmit} variant="click-primary" size="click-lg" type="submit">
                Apply
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
      <Card title="License Details" className="dual">
        <table class="table table-bordered user-license--table">
          <tbody>
            <tr>
              <th className="license-head" scope="row"><FiKey size={17} /><span style={{ marginLeft: "7px" }}>Current License key</span></th>
              <td>{serielKey}</td>
            </tr>
            <tr>
              <th className="license-head" scope="row"><FiCalendar size={17} /><span style={{ marginLeft: "7px" }}>License Expiry Date</span></th>
              <td>{licenseDate}</td>
            </tr>
            <tr>
              <th className="license-head" scope="row"><FiUsers size={17} /><span style={{ marginLeft: "7px" }}>Maximum Userlimit</span></th>
              <td>{maximumUserLimit}</td>
            </tr>
          </tbody>
        </table>
      </Card>

    </>
  );
}

export default UserLicence;
