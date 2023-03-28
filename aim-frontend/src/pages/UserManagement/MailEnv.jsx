import React, { useEffect, useState } from "react";
import {
  PageHeader,
  Form,
  Card,
  PageFooter,
  Button,
  FormSelect,
  FormInput,
  FormPassword,
} from "../../components";
import { toast } from "react-toastify";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
const MailEnv = () => {
  const [ID, setID] = useState("");
  const [service, setService] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleService = (e, { value }) => {
    setService(value);
  };
  const handleUser = (e) => {
    setUser(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
  };
  useEffect(async () => {
    let data = await userService.getEnvList();
    setID(data.envDetails[0]._id);
    setService(data.envDetails[0].NODEMAILER_SERVICE);
    setPassword(data.envDetails[0].NODEMAILER_PASSWORD);
    setUser(data.envDetails[0].NODEMAILER_USER);
    setAddress(data.envDetails[0].NODEMAILER_FROM_ADDRESS);
  }, []);
  const handleSubmit = async () => {
    let values = {
      NODEMAILER_SERVICE: service,
      NODEMAILER_USER: user,
      NODEMAILER_PASSWORD: password,
      NODEMAILER_FROM_ADDRESS: address,
    };
    let datas = await userService.updateEnv(ID, values);
    toast.success("Mail environment updated successfully");
    navigate("/user-management");
  };

  const EnvData = [
    {
      value: "1und1",
      text: "1und1",
    },
    {
      value: "Gmail",
      text: "Gmail",
    },
    {
      value: "AOL",
      text: "AOL",
    },
    {
      value: "DebugMail.io",
      text: "DebugMail.io",
    },
    {
      value: "DynectEmail",
      text: "DynectEmail",
    },
    {
      value: "FastMail",
      text: "FastMail",
    },
    {
      value: "GandiMail",
      text: "GandiMail",
    },
    {
      value: "Godaddy",
      text: "Godaddy",
    },
    {
      value: "GodaddyAsia",
      text: "GodaddyAsia",
    },
    {
      value: "GodaddyEurope",
      text: "GodaddyEurope",
    },
    {
      value: "hot.ee",
      text: "hot.ee",
    },
    {
      value: "Hotmail",
      text: "Hotmail",
    },
    {
      value: "iCloud",
      text: "iCloud",
    },
    {
      value: "mail.ee",
      text: "mail.ee",
    },

    {
      value: "Mail.ru",
      text: "Mail.ru",
    },
    {
      value: "Mailgun",
      text: "Mailgun",
    },
    {
      value: "Mailjet",
      text: "Mailjet",
    },
    {
      value: "Mandrill",
      text: "Mandrill",
    },
    {
      value: "Naver",
      text: "Naver",
    },
    {
      value: "Postmark",
      text: "Postmark",
    },
    {
      value: "QQ",
      text: "QQ",
    },
    {
      value: "QQex",
      text: "QQex",
    },
    {
      value: "SendCloud",
      text: "SendCloud",
    },
    {
      value: "SendGrid",
      text: "SendGrid",
    },
    {
      value: "SES",
      text: "SES",
    },
    {
      value: "Sparkpost",
      text: "Sparkpost",
    },
    {
      value: "Yahoo",
      text: "Yahoo",
    },

    {
      value: "Yandex",
      text: "Yandex",
    },
    {
      value: "Zoho",
      text: "Zoho",
    },
  ];
  return (
    <>
      <PageHeader title={"SMTP Services"} />
      <Card title={"Edit SMTP Services"}>
        <Form>
          <Row>
            <Col lg={6} md={6}>
              <FormSelect
                id={"service"}
                value={service}
                data={EnvData}
                name={"service"}
                className={"env-input"}
                label={"Mailer Service"}
                onChange={handleService}
              />
            </Col>
            <Col lg={6} md={6}>
              <FormInput
                id={"user"}
                name={"user"}
                value={user}
                className={"env-input"}
                label={"Mailer User"}
                onChange={handleUser}
              />
            </Col>
            <Col lg={6} md={6}>
              <FormPassword
                id={"password"}
                name={"password"}
                value={password}
                className={"env-input"}
                label={"Mailer Password"}
                onChange={handlePassword}
              />
            </Col>
            <Col lg={6} md={6}>
              <FormInput
                id={"address"}
                name={"address"}
                value={address}
                className={"env-input"}
                label={"Mailer From Address"}
                onChange={handleAddress}
              />
            </Col>
          </Row>
        </Form>
      </Card>
      <PageFooter>
        <Button
          variant={"click-gray"}
          size={"click-lg"}
          type={"button"}
          onClick={() => navigate("/user-management")}
        >
          Cancel
        </Button>
        <Button
          variant={"click-primary"}
          size={"click-lg"}
          type={"submit"}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </PageFooter>
    </>
  );
};

export default MailEnv;
