import React, { useEffect, useState } from "react";
import {
  PageHeader,
  PageFooter,
  Button,
  Card,
  DateFilter,
  DateRange,
} from "../../../components";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import {Spinner} from "../../../components"

import {
  InspectionStatisticsStatus,
  InspectionStatisticsGrade,
} from "../../../components/Charts";
import { toast } from "react-toastify";
import { Row, Col } from "react-bootstrap";
import dashboardService from "../../../services/dashboardService";
import * as moment from "moment";

const startDate = new Date().setFullYear(new Date().getFullYear() - 17);
const endDate = new Date();

const InspectionStatistics = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    startDate: "2022-05-18",
    endDate: moment().format("YYYY-MM-DD"),
    type: "monthly",
  });
  const [grade, setGrade] = useState([]);
  const [data1, setData] = useState();
  const [status, setStatus] = useState([]);
  const [dates, setDates] = useState({});
  const [loading,setLoading]=useState(false)
  const [filtervalue, setfilterValue] = useState();
  function getFirstDayPreviousMonth() {
    const now = new Date();
    return new Date(now.getFullYear() - 1, now.getMonth() , 1);
  }

  const handleStartRange = (event, data) => {
    setValues({ ...values, startDate: data.value });
    dates.startDate = data.value;
  };
  const handleEndRange = (event, data) => {
    setValues({ ...values, endDate: data.value });
    dates.endDate = moment(data.value).format("YYYY-MM-DD");
    // getStatics('between', dates)
  };

  const getinspectionStatics = async () => {
    let filter = {
      dateFrom: moment(values.startDate).format("YYYY-MM-DD"),
      dateTo: moment(values.endDate).format("YYYY-MM-DD"),
      type: values.type.toLowerCase(),
    };
    setfilterValue(filter)
   setLoading(true)
      let startdateCount = filter.dateFrom
        .split("-")
        .join()
        .replace(/,/, "")
        .replace(/,/, "");
      let endDateCount = filter.dateTo
        .split("-")
        .join()
        .replace(/,/, "")
        .replace(/,/, "");

      if (endDateCount < startdateCount) {
        toast.error("Invalid Date selection");
        return;
      }
    let datas = await dashboardService.getAllinspectionStatistics(filter);
   setData(datas)
    setGrade(datas?.data?.data?.inspectionGrade);
    setStatus(datas?.data?.data?.inspectionStatus);
    setLoading(false)
  };
  const timefilterOnchnage = (value) => {
    setValues({ ...values, type: value });
  };
  // const getStaticsIntial = async () => {
  //   let filter = {
  //     dateFrom: moment(getFirstDayPreviousMonth(new Date(new Date()))).format(
  //       "YYYY-MM-DD"
  //     ),
  //     dateTo: moment(new Date()).format("YYYY-MM-DD"),
  //     type: "yearly",
  //   };

  //   let datas = await dashboardService.getAllinspectionStatistics(filter);

  //   setGrade(datas?.data?.data?.inspectionGrade);
  //   setStatus(datas?.data?.data?.inspectionStatus);
  // };
// useEffect(()=>{
//    let text = "16/03/2023,38";
//   const key = CryptoJS.enc.Utf8.parse("softnotions_test");
//   const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

//     const ciphertext = CryptoJS.AES.encrypt(text, key, { iv: iv }).toString();
//     console.log(ciphertext)},[])
  


  useEffect(() => {
    getinspectionStatics();
  }, [values]);

  const Navigate = () => {
    navigate("/asset-register");
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Inspection Statistics">
        {!loading &&
        <DateRange
          handleFrom={handleStartRange}
          handleTo={handleEndRange}
          fromDate={moment(values.startDate).format("DD-MMM-YYYY")}
          toDate={moment(values.endDate).format("DD-MMM-YYYY")}
          variable="chart-range"
        />}
        {!loading &&
        <DateFilter onChange={timefilterOnchnage} />}
      </PageHeader>
      <Row>
        <Col xl={12} lg={12} style={{ minHeight: "200px" }}>
          <Card title="Inspection Status" className="mb-4" variant="chart-card">
            {!loading ? (
              <InspectionStatisticsStatus
                status={status}
                values={values}
                navigate={navigate}
                filtervalue={filtervalue}
              />
            ) : (
              <Spinner />
            )}
          </Card>
        </Col>
        <Col xl={12} lg={12} style={{ minHeight: "200px" }}>
          <Card title="Inspection Grade" variant="chart-card">
            {!loading ? (
              <InspectionStatisticsGrade
                grade={grade}
                values={values}
                navigate={navigate}
                filtervalue={filtervalue}
              />
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

export default InspectionStatistics;
