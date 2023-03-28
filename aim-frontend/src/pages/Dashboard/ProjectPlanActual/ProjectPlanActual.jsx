import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  PageHeader,
  PageFooter,
  Button,
  Card,
  DateRange,
} from "../../../components";
import { Spinner } from "../../../components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MonthlyData from "../../../components/ChartFilter/MonthlyData";
import { InspectionsPlan, RepairsPlan } from "../../../components/Charts";
import * as moment from "moment";
import dashboardService from "../../../services/dashboardService";

const startDate = new Date().setFullYear(new Date().getFullYear() - 17);
const endDate = new Date();

const ProjectPlanActual = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    startDate: "2022-05-18",
    endDate: moment().format("YYYY-MM-DD"),
    type: "monthly",
  });

  const [inspectionActual, setInspectionActual] = useState([]);
  const [inspectionPlan, setInspectionPlan] = useState([]);
  const [repairActual, setRepairActual] = useState([]);
  const [repairPlan, setRepairPlan] = useState([]);
  const [dates, setDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [filtervalue, setFiltervalue] = useState();

  function getFirstDayPreviousMonth() {
    const now = new Date();
    return new Date(now.getFullYear() - 1, now.getMonth(), 1);
  }

  const handleStartRange = (event, data) => {
    setValues({ ...values, startDate: data.value });
    dates.startDate = data.value;
  };
  const handleEndRange = (event, data) => {
    setValues({ ...values, endDate: data.value });
    dates.endDate = moment(data.value).format("YYYY-MM-25");
    // getStatics('between', dates)
  };

  const getProjectPlan = async () => {
    setLoading(true);
    let filter = {
      dateFrom: moment(values.startDate).format("YYYY-MM"),
      dateTo: moment(values.endDate).format("YYYY-MM"),
      type: values.type.toLowerCase(),
    };
    setFiltervalue(filter);
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

    let datas = await dashboardService.getAllProVsPlan(filter);
    setLoading(false);
    setInspectionActual(datas?.data?.data?.inspectionActual);
    setInspectionPlan(datas?.data?.data?.inspectionPlan);
    setRepairActual(datas?.data?.data?.repairActual);
    setRepairPlan(datas?.data?.data?.repairPlan);
  };
  const timefilterOnchnage = (value) => {
    setValues({ ...values, type: value });
  };
  // const getStaticsIntial = async () => {
  //   let filter = {
  //     dateFrom:"2020-05-05",
  //     dateTo: moment(new Date()).format("YYYY-MM"),
  //     type: "monthly",
  //   };

  //   let datas = await dashboardService.getAllProVsPlan(filter);
  //   console.log(datas);
  //   setInspectionActual(datas?.data?.data?.inspectionActual);
  //   setInspectionPlan(datas?.data?.data?.inspectionPlan);
  //   setRepairActual(datas?.data?.data?.repairActual);
  //   setRepairPlan(datas?.data?.data?.repairPlan);
  // };
  useEffect(() => {
    getProjectPlan();
  }, [values]);

  const Navigate = () => {
    navigate("/asset-register");
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Project Plan vs Actual">
        <DateRange
          handleFrom={handleStartRange}
          handleTo={handleEndRange}
          fromDate={moment(values.startDate).format("DD-MMM-YYYY")}
          toDate={moment(values.endDate).format("DD-MMM-YYYY")}
          variable="chart-range"
        />
        <MonthlyData onChange={timefilterOnchnage} />
      </PageHeader>
      <Row>
        <Col xl={12} lg={12}>
          <Card
            title="Inspections Plan vs Actual"
            variant="chart-card"
            className="mb-4"
          >
            {!loading ? (
              <InspectionsPlan
                inspectionActual={inspectionActual}
                inspectionPlan={inspectionPlan}
                navigate={navigate}
                values={values}
                filtervalue={filtervalue}
              />
            ) : (
              <Spinner />
            )}
          </Card>
          <PageFooter className='mb-4'>
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
          <Card title="Repairs Plan vs Actual" variant="chart-card">
            {!loading ? (
              <RepairsPlan
                repairActual={repairActual}
                repairPlan={repairPlan}
                navigate={navigate}
                values={values}
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

export default ProjectPlanActual;
