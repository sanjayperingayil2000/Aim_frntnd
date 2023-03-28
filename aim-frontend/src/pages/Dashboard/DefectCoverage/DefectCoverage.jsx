import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  PageHeader,
  PageFooter,
  Button,
  Card,
  TimeFilter,
  DateRange,
} from "../../../components";
import { Spinner } from "../../../components";
import {
  CoverageInspections,
  CoverageCurrent,
} from "../../../components/Charts";
import * as moment from "moment";
import { useNavigate } from "react-router-dom";
import dashboardService from "../../../services/dashboardService";

const DefectCoverage = () => {
  const [dates, setDates] = useState({});
  const navigate = useNavigate();
  const [values, setValues] = useState({
    startDate: "2022-05-18",
    endDate: moment().format("YYYY-MM-DD"),
  });
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState([]);
  const [inspectionStage, setInspectionStage] = useState([]);

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

  const getdefectCoverage = async () => {
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
          return
        }

      datas = await dashboardService.getAlldefectCoverage(data);
      setLoading(false);
      setCurrentStage(datas?.data?.data?.currentStage);
      setInspectionStage(datas?.data?.data?.inspectionStage);
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

  useEffect(() => {
    getdefectCoverage();
  }, [values]);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Defect Coverage">
        <DateRange
          handleFrom={handleStartRange}
          handleTo={handleEndRange}
          fromDate={moment(values.startDate).format("DD-MMM-YYYY")}
          toDate={moment(values.endDate).format("DD-MMM-YYYY")}
          variable="chart-range"
        />
        <TimeFilter onChange={timefilterOnchnage} />
      </PageHeader>
      <Row>
        <Col xl={12} lg={12}>
          <Card
            title="Defect Coverage - Inspections Stage"
            variant="chart-card"
            className="mb-4"
          >
            {!loading ? (
              <CoverageInspections inspectionStage={inspectionStage} values={values} navigate={navigate} />
            ) : (
              <Spinner />
            )}
          </Card>
        </Col>
        <Col xl={12} lg={12}>
          <Card title="Defect Coverage - Current Stage" variant="chart-card">
            {!loading ? (
              <CoverageCurrent currentStage={currentStage} values={values} navigate={navigate} />
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
          onClick={()=>{navigate("/asset-register",{state:{values}})}}
        >
          Show Data
        </Button>
      </PageFooter>
    </>
  );
};

export default DefectCoverage;
