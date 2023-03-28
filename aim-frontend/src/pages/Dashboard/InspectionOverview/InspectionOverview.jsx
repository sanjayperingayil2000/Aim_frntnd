import React, { useEffect, useState } from "react";
import {
  PageHeader,
  PageFooter,
  DateRange,
  Button,
  Card,
  TimeFilter,
  NoData,
} from "../../../components";
import { toast } from "react-toastify";
import { InspectionStatus, InspectionGrade } from "../../../components/Charts";
import { Spinner } from "../../../components";
import { Row, Col } from "react-bootstrap";
import dashboardService from "../../../services/dashboardService";
import * as moment from "moment";
import { useNavigate } from "react-router-dom";

const InspectionOverview = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    startDate: "2022-05-18",
    endDate: moment().format("YYYY-MM-DD"),
  });
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({});
  const [total, setTotal] = useState("");
  const [total1, setTotal1] = useState("");
  const [red, setRed] = useState("");
  const [green, setGreen] = useState("");
  const [yellow, setYellow] = useState("");
  const [visual, setVisual] = useState("");
  const [close, setClose] = useState("");
  const [detailed, setDetailed] = useState("");
  const [check, setCheck] = useState(false);
  const [check1, setCheck1] = useState(false);

  const handleStartRange = (event, data) => {
    setValues({ ...values, startDate: data.value });
    dates.startDate = moment(data.value).format("YYYY-MM-DD");
  };
  const handleEndRange = (event, data) => {
    setValues({ ...values, endDate: data.value });
    dates.endDate = moment(data.value).format("YYYY-MM-DD");
  };
  function getPreviousDay(date = new Date()) {
    const previous = new Date();
    previous.setDate(date.getDate() - 1);

    return previous;
  }
  var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
  var beforeOneWeek2 = new Date(beforeOneWeek);
  let day = beforeOneWeek.getDay();
  let diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
  let lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
  let lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));

  function getFirstDayPreviousMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }
  function getLastDayPreviousMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 0);
  }

  const Navigate = () => {
    navigate("/asset-register");
  };

  const getInspectionview = async () => {
    try {
      let datas;
      setLoading(true);
      let data = {
        dateFrom: moment(values.startDate).format("YYYY-MM-DD"),
        dateTo: moment(values.endDate).format("YYYY-MM-DD"),
      };
      let startdateCount = data.dateFrom
        .split("-")
        .join()
        .replace(/,/, "")
        .replace(/,/, "");
      let endDateCount = data.dateTo
        .split("-")
        .join()
        .replace(/,/, "")
        .replace(/,/, "");

      if (endDateCount < startdateCount) {
        toast.error("Invalid Date selection");
        return;
      }
      datas = await dashboardService.getAllinspectionOverview(data);
      setLoading(false);
      setRed(datas.data.data.inspectionStatus[0].red);
      setYellow(datas.data.data.inspectionStatus[0].yellow);
      setGreen(datas.data.data.inspectionStatus[0].green);
      setTotal(datas.data.data.inspectionStatus[0].total);
      setTotal1(datas.data.data.inspectionGrade[0].total);
      setVisual(datas.data.data.inspectionGrade[0].visual);
      setClose(datas.data.data.inspectionGrade[0].close);
      setDetailed(datas.data.data.inspectionGrade[0].detailed);
      if (!datas.data.data.inspectionStatus[0].total) {
        setCheck(true);
      } else {
        setCheck(false);
      }
      if (!datas.data.data.inspectionGrade[0].total) {
        setCheck1(true);
      } else {
        setCheck1(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const timefilterOnchnage = (timefilter) => {
    let filter = {};

    if (timefilter === "Yesterday") {
      filter = {
        startDate: moment(getPreviousDay(new Date(new Date()))).format(
          "YYYY-MM-DD"
        ),
        endDate: moment(getPreviousDay(new Date(new Date()))).format(
          "YYYY-MM-DD"
        ),
      };
    } else if (timefilter === "Last Week") {
      filter = {
        startDate: moment(lastMonday).format("YYYY-MM-DD"),
        endDate: moment(lastSunday).format("YYYY-MM-DD"),
      };
    } else if (timefilter === "Last Month") {
      filter = {
        startDate: moment(
          getFirstDayPreviousMonth(new Date(new Date()))
        ).format("YYYY-MM-DD"),
        endDate: moment(getLastDayPreviousMonth(new Date())).format(
          "YYYY-MM-DD"
        ),
      };
    } else if (timefilter === "between") {
      filter = {
        startDate: dates[0].startDate,
        endDate: dates[0].endDate,
      };
    } else if (timefilter === "All Time") {
      filter = {
        startDate: "2022-05-18",
        endDate: moment(new Date()).format("YYYY-MM-DD"),
      };
    }

    setValues({ ...filter });
  };
  // useEffect(() => {
  //   getoverview();
  // }, []);
  // const getoverview = async () => {
  //   let filter = {
  //     dateFrom: "1993-04-04",
  //     dateTo: moment(new Date()).format("YYYY-MM-DD"),
  //   };

  //   let datas = await dashboardService.getAllinspectionOverview(filter);
  //   setRed(datas.data.data.inspectionStatus[0].red);
  //   setYellow(datas.data.data.inspectionStatus[0].yellow);
  //   setGreen(datas.data.data.inspectionStatus[0].green);
  //   setTotal(datas.data.data.inspectionStatus[0].total);
  //   setTotal1(datas.data.data.inspectionGrade[0].total);
  //   setVisual(datas.data.data.inspectionGrade[0].visual);
  //   setClose(datas.data.data.inspectionGrade[0].close);
  //   setDetailed(datas.data.data.inspectionGrade[0].detailed);
  // };
  useEffect(() => {
    getInspectionview();
  }, [values]);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Inspection Overview">
        <DateRange
          handleFrom={handleStartRange}
          handleTo={handleEndRange}
          fromDate={moment(values.startDate).format("DD-MMM-YYYY")}
          toDate={moment(values.endDate).format("DD-MMM-YYYY")}
          variable="chart-range"
        />
        <TimeFilter onChange={timefilterOnchnage} />
      </PageHeader>
      <Row className="row-adjust">
        <Col xl={6} lg={6} md={12}>
          <Card title="Inspection Status" variant="chart-card" className="dual">
            {!loading ? (
              !check ? (
                <InspectionStatus
                  red={red}
                  green={green}
                  yellow={yellow}
                  total={total}
                  navigate={navigate}
                  values={values}
                />
              ) : (
                <NoData />
              )
            ) : (
              <Spinner />
            )}
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12}>
          <Card title="Inspection Grade" variant="chart-card" className="dual">
            {!loading ? (
              !check1 ? (
                <InspectionGrade
                  total1={total1}
                  visual={visual}
                  close={close}
                  detailed={detailed}
                  navigate={navigate}
                  values={values}
                />
              ) : (
                <NoData />
              )
            ) : (
              <Spinner />
            )}
          </Card>
        </Col>
      </Row>
      <PageFooter>
        <Button
          variant="click-primary"
          size="click-sm"
          onClick={() => {
            navigate("/asset-register", { state: { values } });
          }}
        >
          Show Data
        </Button>
      </PageFooter>
    </>
  );
};

export default InspectionOverview;
