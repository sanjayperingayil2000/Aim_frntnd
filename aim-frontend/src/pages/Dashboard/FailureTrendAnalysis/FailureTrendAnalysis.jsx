import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  PageHeader,
  PageFooter,
  Button,
  Card,
  TimeFilter,
  DateRange,
} from "../../../components";
import { Spinner, Photospinner } from "../../../components";
import { toast } from "react-toastify";
import { FailureTrend } from "../../../components/Charts";
import { failureCol, failureRow } from "../../../data/failureTrendData";
import { FaSort } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import dashboardService from "../../../services/dashboardService";
import * as moment from "moment";
import { useNavigate } from "react-router-dom";

const FailureTrendAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    startDate: "2022-05-18",
    endDate: moment().format("YYYY-MM-DD"),
  });
  let [trend, setTrend] = useState();
  let [resultvalue, setResultvalue] = useState();
  let [check, setCheck] = useState(false);
  const [description, setDescription] = useState([]);
  const [description1, setDescription1] = useState([]);
  const [condition, setCondition] = useState(false);

  const [dates, setDates] = useState({});
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

      datas = await dashboardService.getAllfailureTrend(data);
      setLoading(false);

      let keys = Object.keys(datas?.data?.data?.results);
      let result = keys.map((k) => datas?.data?.data?.results[k]);
      setResultvalue(result);
      setDescription(datas?.data?.data?.defectCodeDescription);
      setTrend(keys);
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
    getInspectionview();
  }, [values]);

  const ReverseDefectcode = async () => {
    let datas;
setCondition(true);
    let data = {
      dateFrom: moment(values.startDate).format("YYYY-MM-DD"),
      dateTo: moment(values.endDate).format("YYYY-MM-DD"),
    };

    if (check === false) {
      datas = await dashboardService.getAllfailureTrend(data);
      setDescription(datas?.data?.data?.defectCodeDescription.reverse());
      setCheck(true);
      setCondition(false)
      
    }
    if (check === true) {
      datas = await dashboardService.getAllfailureTrend(data);
      setDescription(datas?.data?.data?.defectCodeDescription);
      setCheck(false);
        setCondition(false);
    }
  };

  const ReverseDescription = async () => {
    if (check === false) {
      setDescription1(
        description.sort((a, b) => a.description.localeCompare(b.description))
      );
      setCheck(true);
    }
    if (check === true) {
      setDescription1(
        description.sort((a, b) => b.description.localeCompare(a.description))
      );
      setCheck(false);
    }
  };

  const countReverse = () => {
    if (check === false) {
      setDescription1(
        description.sort((a, b) => parseFloat(a.count) - parseFloat(b.count))
      );
      setCheck(true);
    }
    if (check === true) {
      setDescription1(
        description.sort((a, b) => parseFloat(b.count) - parseFloat(a.count))
      );
      setCheck(false);
    }
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Failure Trend Analysis">
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
          <Card title="Failure Trends" variant="chart-card" className="mb-4">
            {!loading ? (
              <FailureTrend
                trend={trend}
                resultvalue={resultvalue}
                description={description}
              />
            ) : (
              <Spinner />
            )}
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12} lg={12}>
          <div className="asset-table spacing-in table-align-left failure-table">
            <Table striped>
              <thead>
                <tr>
                  <th style={{ width: 120 }}>
                    {" "}
                    <Button
                      variant="click-none"
                      size="resize"
                      className="sort-btn"
                      onClick={() => {
                        ReverseDefectcode();
                      }}
                    >
                      <span> Defect Code</span>
                      {!condition ? (
                        <FaSort size={18} />
                      ) : (
                        <Photospinner size={18} />
                      )}
                    </Button>
                  </th>
                  <th>
                    {" "}
                    <Button
                      variant="click-none"
                      size="resize"
                      className="sort-btn"
                      onClick={() => {
                        ReverseDescription();
                      }}
                    >
                      <span> Description</span>
                      <FaSort size={18} />
                    </Button>
                  </th>
                  <th style={{ maxWidth: "65px" }}>
                    <Button
                      variant="click-none"
                      size="resize"
                      className="sort-btn"
                      onClick={() => {
                        countReverse();
                      }}
                    >
                      <span> Count</span>
                      <FaSort size={18} />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {description?.map((item, index) => {
                  return (
                    <tr>
                      <button
                        className="btn btn-light text-dark"
                        style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
                        onClick={() =>
                          navigate("/asset-register", {
                            state: {
                              valid: "true",
                              defectCode: item?.defectCode,
                              startDate: values.startDate,
                              endDate: values.endDate,
                            },
                          })
                        }
                      >
                        {item?.defectCode}
                      </button>
                      <td>{item?.description}</td>
                      <td>{item?.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
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

export default FailureTrendAnalysis;
