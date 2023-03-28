import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  PageHeader,
  PageFooter,
  Button,
  Card,
  DateFilter,
  DateRange,
} from "../../../components";
import { toast } from "react-toastify";
import { InspectionsOverdue, RepairsOverdue } from "../../../components/Charts";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components";
import dashboardService from "../../../services/dashboardService";
import * as moment from "moment";

const startDate = new Date().setFullYear(new Date().getFullYear() - 17);
const endDate = new Date();

const ActivitiesOverdue = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    startDate: "2022-05-18",
    endDate: moment().format("YYYY-MM-DD"),
    type: "monthly",
  });
  const [dates, setDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [data1, setData] = useState();
  const [inspectionOverdue, setInspectionOverdue] = useState([]);
  const [repairOverdue, setRepairOverdue] = useState([]);
  const [filtervalue, setFiltervalue] = useState();

  let fromdate = "18-05-2022";

  const handleStartRange = (event, data) => {
    setValues({ ...values, startDate: data.value });
    dates.startDate = data.value;
  };
  const handleEndRange = (event, data) => {
    setValues({ ...values, endDate: data.value });
    dates.endDate = moment(data.value).format("YYYY-MM-DD");
    // getStatics('between', dates)
  };

  const getActivitiesOverdue = async () => {
    let filter = {
      dateFrom: moment(values.startDate).format("YYYY-MM-DD"),
      dateTo: moment(values.endDate).format("YYYY-MM-DD"),
      type: values.type.toLowerCase(),
    };
    setFiltervalue(filter);
    setLoading(true);
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
    let datas = await dashboardService.getAllActivitiesoverdue(filter);
    setLoading(false);
    setRepairOverdue(datas?.data?.data?.repairOverdue);
    setInspectionOverdue(datas?.data?.data?.inspectionOverdue);
  };
  const timefilterOnchnage = (value) => {
    setValues({ ...values, type: value });
  };

  useEffect(() => {
    getActivitiesOverdue();
  }, [values]);
  const Navigate = () => {
    navigate("/asset-register");
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Activities Overdue">
        <DateRange
          handleFrom={handleStartRange}
          handleTo={handleEndRange}
          fromDate={moment(values.startDate).format("DD-MMM-YYYY")}
          toDate={moment(values.endDate).format("DD-MMM-YYYY")}
          variable="chart-range"
        />
        <DateFilter onChange={timefilterOnchnage} />
      </PageHeader>
      <Row>
        <Col xl={12} lg={12}>
          <Card
            title="Inspections Overdue"
            variant="chart-card"
            className="mb-4"
          >
            {!loading ? (
              <InspectionsOverdue
                inspectionOverdue={inspectionOverdue}
                filtervalue={filtervalue}
                values={values}
                navigate={navigate}
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
                navigate("/asset-register", {
                   state:{ 
                    valid: "true",
                    highlight:"inspectionOverdue",
                    startDate: values.startDate,
                    endDate: values.endDate,                  
                     }
                   });
              }}
            >
              Show Data
            </Button>
          </PageFooter>
          <Card title="Repairs Overdue" variant="chart-card">
            {!loading ? (
              <RepairsOverdue
                filtervalue={filtervalue}
                repairOverdue={repairOverdue}
                values={values}
                navigate={navigate}
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
            navigate("/asset-register", { 
              state: { 
                valid: "true",
                highlight:"repairOverdue",
                startDate: values.startDate,
                endDate: values.endDate,        
               } });
          }}
        >
          Show Data
        </Button>
      </PageFooter>
    </>
  );
};

export default ActivitiesOverdue;
