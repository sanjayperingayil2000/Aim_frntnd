import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  PageHeader,
  PageFooter,
  FormInput,
  FormSelect,
  YearSelector,
  Card,
  Button,
} from "../../components";
import plannerService from "../../services/plannerService";
import { toast } from "react-toastify";

const Planner = () => {
  const [planners, setPlanner] = useState({});
  const [category, setCategory] = useState("Inspection Plan");

  let sample_category = "inspection-plan";
  let sample_year = new Date().getFullYear();

  const [year, setYear] = useState(sample_year);
  const [catData, setCatData] = useState();

  const categories = [
    {
      value: "Inspection Plan",
      text: "Inspection Plan",
    },
    {
      value: "Repair Plan",
      text: "Repair Plan",
    },
  ];
  
  const handleJanuary = (e) => {
    setPlanner({ ...planners, january: e.target.value });
  };
  const handleFebruary = (e) => {
    setPlanner({ ...planners, february: e.target.value });
  };
  const handleMarch = (e) => {
    setPlanner({ ...planners, march: e.target.value });
  };
  const handleApril = (e) => {
    setPlanner({ ...planners, april: e.target.value });
  };
  const handleMay = (e) => {
    setPlanner({ ...planners, may: e.target.value });
  };
  const handleJune = (e) => {
    setPlanner({ ...planners, june: e.target.value });
  };
  const handleJuly = (e) => {
    setPlanner({ ...planners, july: e.target.value });
  };
  const handleAugust = (e) => {
    setPlanner({ ...planners, august: e.target.value });
  };
  const handleSeptember = (e) => {
    setPlanner({ ...planners, september: e.target.value });
  };
  const handleOctober = (e) => {
    setPlanner({ ...planners, october: e.target.value });
  };
  const handleNovember = (e) => {
    setPlanner({ ...planners, november: e.target.value });
  };
  const handleDecember = (e) => {
    setPlanner({ ...planners, december: e.target.value });
  };

  const handleCategory = (e, { value }) => {
    setCategory(value);
    setCatData(value);
    setPlanner({ ...planners, category: value });

    try {
      plannerService.getAllPlans(year, value).then((plannersData) => {
        setPlanner(plannersData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleYear = (e, data) => {
    setPlanner({ ...planners, year: data.value });
    let sample_year = data.value;
    setYear(sample_year);
    plan(sample_year, catData);

    try {
      plannerService.getAllPlans(data.value, category).then((plannersData) => {
        setPlanner(plannersData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //functionality and api call for chooseing category
  // const handleCategory = (e,{value}) => {
  //     setPlanner({...planners, category: value});
  //     if(value == "inspection-plan"){
  //         setCategory({category});
  //         setCatData(value)
  //         plan(year,value)
  //     }
  //     if(value == "repair-plan"){
  //         setCategory({category});
  //         setCatData(value)
  //         plan(year,value)
  //         // let sample_category = "repair-plan";
  //         // if(planners){
  //         //     let sample_year = planners.year;
  //         //     setCatData(sample_category);
  //         //     setYear(sample_year);
  //         //     plan(sample_year,sample_category);
  //         // }
  //         // else{
  //         //     setCatData(sample_category);
  //         //     setYear(sample_year);
  //         //     plan(sample_year,sample_category);
  //         // }
  //     }
  // };
  // end choose category

  //functionality for getting data by year & category
  const plan = (year, cat) => {
    console.log(year, cat);
    try {
      setPlanner("");

      plannerService.getAllPlans(year, category).then((plannersData) => {
        if (plannersData) {
          setPlanner(plannersData[0]);
        }
        if (!plannersData) {
          setPlanner();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //functionality for initially getting data
  useEffect(() => {
    try {
      plannerService.getAllPlans(year, category).then((plannersData) => {
        setPlanner(plannersData);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = () => {
    if (planners?._id) {
      plannerService.postPlansId(planners._id, planners).then((response) => {
        let status = response.data.status;
        if (status === true) {
            toast.success("Plan updated successfully");
          }
        }); 
    } else {
      planners.year = year;
      planners.category = catData;
      plannerService.postPlans(planners).then((response) => {
        let status = response.data.status;
        if (status === true) {
          toast.success("Plan added successfully");
        }
      });
    }
  };

  const handleClear = () => {
    setPlanner({ ...planners, 
      january:"",
      february:"",
      march:"",
      april:"",
      may:"",
      june:"",
      july:"",
      august:"",
      september:"",
      october:"",
      november:"",
      december:"",
      year:year,
      category:category,
     });

  };

  return (
    <>
      <PageHeader title="Project Plan">
        <YearSelector
          label="Choose Year"
          variant="transparent"
          placeholder="Select Year"
          value={year}
          onChange={handleYear}
        />

        <FormSelect
          value={category}
          name="category"
          variant="transparent"
          data={categories}
          label="Choose Category"
          groupClass="planners-select"
          onChange={handleCategory}
          placeholder="Choose Category"
        />
      </PageHeader>
      <Card title={`${category} - ${year}`}>
        <Row>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              type="number"
              label="January"
              placeholder="Type here..."
              min="0"
              onChange={handleJanuary}
              value={planners ? planners.january : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="February"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleFebruary}
              value={planners ? planners.february : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="March"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleMarch}
              value={planners ? planners.march : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="April"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleApril}
              value={planners ? planners.april : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="May"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleMay}
              value={planners ? planners.may : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="June"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleJune}
              value={planners ? planners.june : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="July"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleJuly}
              value={planners ? planners.july : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="August"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleAugust}
              value={planners ? planners.august : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="September"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleSeptember}
              value={planners ? planners.september : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="October"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleOctober}
              value={planners ? planners.october : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="November"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleNovember}
              value={planners ? planners.november : ""}
            />
          </Col>
          <Col xl={3} lg={6} sm={6}>
            <FormInput
              label="December"
              type="number"
              min="0"
              placeholder="Type here..."
              onChange={handleDecember}
              value={planners ? planners.december : ""}
            />
          </Col>
        </Row>
      </Card>
      <PageFooter>
        <Button onClick={handleClear} variant="click-gray" size="click-lg">
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          variant="click-primary"
          size="click-lg"
        >
          Save
        </Button>
      </PageFooter>
    </>
  );
};

export default Planner;
