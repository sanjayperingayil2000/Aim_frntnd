import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import assetService from "../../services/assetService";
import { useDispatch, useSelector } from "react-redux";
import { getLookup, getSubLookup } from "../../Redux/Actions/lookupActions";
import { motion } from "framer-motion";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiFilterAlt } from "react-icons/bi";
import { images } from "../../constants";
import { useContext } from "react";
import * as moment from "moment-timezone";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import GeneratePdf from "../../components/TestReport/GeneratePdf";
import { MyContext } from "../../routes/Routes";
import inspectionService from "../../../src/services/inspectionService";
import axios from "axios";
import userService from "../../services/userService";

import {
  Form,
  Modal,
  FormInput,
  FormCheckbox,
  FormSelect,
  DateRange,
  Button,
  TablePagination,
  PageFooter,
  PageHeader,
  CustomLayout,
  Search,
  Spinner,
  ProgressBar,
  ProgressExcelBar,
} from "../../components";
import { Row, Col } from "react-bootstrap";
import {
  layoutData,
  groupByData,
  highlightData,
  showOnlyData,
  statusData,
  CategoryData,
} from "../../data/assetFilterData";
import * as XLSX from "xlsx";
import InfiniteScroll from "react-infinite-scroll-component";
import Table from "react-bootstrap/Table";
import { FaSort } from "react-icons/fa";
import redFlag from "../../assets/img/red-flag.svg";
import yellowFlag from "../../assets/img/yellow-flag.svg";
import greenFlag from "../../assets/img/green-flag.svg";
import { MdOutlineClose, MdCheck } from "react-icons/md";
import { RiDeleteBinLine, RiExternalLinkLine } from "react-icons/ri";
import { toast } from "react-toastify";

import {
  LocationDetails,
  EquipmentTag,
  InspectionChecklist,
  DefectAnalysis,
  CorrectiveActions,
} from "../../components/TestReport";

const style = {
  height: 30,
  margin: 6,
  padding: 8,
};

const AssetRegister = ({ className, locatorFilter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const targetRef = useRef(null);
  const [signaturePath2, setSignaturePath2] = useState("");
  const [signaturePath, setSignaturePath] = useState("");
  const [assets, setAssets] = useState([]);
  const [loadings, setLoading] = useState(false);
  const [FilterSkip, setFilterSkip] = useState(false);
  const [Loadmore, setLoadmore] = useState(false);
  const [repairedUser, setRepairedUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [inspectedUser, setInspectedUser] = useState("");
  const [loader, setLoader] = useState(false);
  const [resultA, setResultA] = useState([]);
  const { myState, setMyState } = useContext(MyContext);
  const [resultB, setResultB] = useState([]);
  const [resultC, setResultC] = useState([]);
  const [inspectionDetails, setInspectionDetails] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [layout, setLayout] = useState("Classic Layout");
  const [layoutList, setLayoutList] = useState([]);
  const [layoutFieldList, setLayoutFields] = useState([]);
  const [inspectionChecklist, setInspectionChecklist] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [order, setOrder] = useState("descending");
  const [ItrValues, setItrvalues] = useState({});
  const [totalA, setDefectA] = useState([]);
  const [totalB, setDefectB] = useState([]);
  const [totalC, setDefectC] = useState([]);
  const [defectCountA, setDefectCountA] = useState([]);
  const [defectCountB, setDefectCountB] = useState([]);
  const [defectCountC, setDefectCountC] = useState([]);
  const [sortChecked, setSortChecked] = useState(false);
  const [filterChecked, setFilterChecked] = useState(false);
  const [sortField, setSortField] = useState("");
  const [orderMore, setOrderMore] = useState("");
  const [group, setGroup] = useState("");
  const [locationId, setLocationId] = useState("");
  const [SearchValue, setSearchValue] = useState("");
  const [highlight, setHighlight] = useState("");
  const [statusValue, setStatus] = useState("");
  const [showOnly, setShowOnly] = useState("");
  const [values, setValues] = useState([]);
  const [list, SetList] = useState([]);
  const [isFilter, setFilter] = useState(true);
  const [showLayout, setShowLayout] = useState(false);
  const filterFormRef = useRef(null);
  const [id, setId] = useState();
  const [limit, setLimit] = useState(30);
  const [offset, setOfset] = useState(0);
  const [total, setTotal] = useState(0);
  const [defaultLayout, setDefaultLayout] = useState(true);
  const [fromdate, setFromDate] = useState("");
  const [todate, setTodate] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [defectCode, setDefectCode] = useState("");
  const [inspectionStatus, setInspectionStatus] = useState("");
  const [equipcat, setEquipcat] = useState("");
  const [repairddate, setRepairedDate] = useState("");
  const [inspecteddate, setInspectedDate] = useState("");
  const [repairedanalysis, setRepairedAnalysis] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [inspectionGrade, setInspectedGrade] = useState("");
  const [highlightCell, setHighlightCell] = useState([]);
  const [activitiesOverdue, setActivitiesOverdue] = useState("");
  const previouspage = state;

  useEffect(() => {
    assetData();
  }, []);

  const handlepdf = () => {
    setMyState(true);
    let data = {};
    if (sortChecked) {
      data = {
        sortBy: sortField,
        order: orderMore || "",
      };
    }
    if (filterChecked) {
      data = { ...values };
    }
    if (!sortChecked) {
      data = {
        search: SearchValue,
        currentStatus: currentStatus,
        defectCode: defectCode,
        inspectionStatus: inspectionStatus,
        repairedDate: repairddate,
        eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
        inspectedDate: inspecteddate,
        repairAnalysis: repairedanalysis,
        inspectionGrade: inspectionGrade,
        activitiesOverdue: activitiesOverdue,
        group: values.group,
        highlight: values.highlight,
        location: values.locations,
        protectionType: values.protectionTypes,
        status: values.status,
        showOnly: values.showOnly,
        fromDate: fromdate ? fromdate : values.fromDate,
        toDate: todate ? todate : values.toDate,
        locationId: locationId,
      };
    }
    try {
      assetService.getpdf(data).then((datas) => {
        //  setLoading(false);
        //  setAssets(assetData?.assets);
        //  setTotal(assetData?.info[0]?.total);

        dowloadpdf(datas);
      });
    } catch (error) {
      console.log(error);
    }
    //  dispatch(getLookup());
    //  dispatch(getSubLookup());
  };
  const dowloadpdf = (data) => {
    var config = {
      method: "get",
      url: data.url,
    };
    axios(config)
      .then(function (response) {
        downloadURI(data.url, data.fileName);
        assetService.removepdf(data.fileName).then((res) => {
          if (res) {
            setMyState(false);
          }
        });
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          setTimeout(() => {
            dowloadpdf(data);
          }, 5000);
        }
      });
  };
  const downloadURI = (uri, name) => {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      headers: {
        Authorization: `Bearer ${JSON.parse(accessToken).value}`,
      },
    };
    fetch(uri, options)
      .then((res) => res.blob())
      .then((blob) => {
        const fileURL = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = fileURL;
        downloadLink.download = name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
  };

  const handleExcel = () => {
    setMyState(true);
    let data = {};
    if (sortChecked) {
      data = {
        sortBy: sortField,
        order: orderMore || "",
      };
    }
    if (filterChecked) {
      data = { ...values };
    }
    if (!sortChecked) {
      data = {
        search: SearchValue,
        currentStatus: currentStatus,
        defectCode: defectCode,
        inspectionStatus: inspectionStatus,
        repairedDate: repairddate,
        eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
        inspectedDate: inspecteddate,
        repairAnalysis: repairedanalysis,
        inspectionGrade: inspectionGrade,
        activitiesOverdue: activitiesOverdue,
        group: values.group,
        highlight: values.highlight,
        location: values.locations,
        protectionType: values.protectionTypes,
        status: values.status,
        showOnly: values.showOnly,
        fromDate: fromdate ? fromdate : values.fromDate,
        toDate: todate ? todate : values.toDate,
        locationId: locationId,
        defectCode: defectCode,
      };
    }
    try {
      assetService.getExcel(data).then((datas) => {
        dowloadExcel(datas);
      });
    } catch (error) {
      console.log(error);
    }
    //  dispatch(getLookup());
    //  dispatch(getSubLookup());
  };
  // const dowloadExcel = (data) => {
  //   var config = {
  //     method: "get",
  //     url: data.url,
  //     timeout: 6000000, // Set the timeout to 60 seconds (or any value that fits your needs)
  //   };
  //   axios(config)
  //     .then(function (response) {
  //       downloadURIexcel(data.url, data.fileName);
  //       assetService.removeExcel(data.fileName).then((res) => {
  //         if (res) {
  //           setMyState(false);
  //         }
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       if (error.response.status === 400) {
  //         setTimeout(() => {
  //           dowloadExcel(data);
  //         }, 5000);
  //       }
  //       if (error.code === "ECONNABORTED") {
  //         console.log("Timeout error:", error.message);
  //         // Handle the timeout error as needed (retry the request, show an error message, etc.)
  //       }
  //     });
  // };

  const dowloadExcel = (data) => {
    var config = {
      method: "get",
      url: data.url,
    };
    axios(config)
      .then(function (response) {
        downloadURIexcel(data.url, data.fileName);
        assetService.removeExcel(data.fileName).then((res) => {
          if (res) {
            setMyState(false);
          }
        });
      })
      .catch(function (error) {
        console.log(error,"this is error");
        if (error.response.status === 400 || error.response.status === 524) {
          setTimeout(() => {
            dowloadExcel(data);
          }, 5000);
        }
      });
  };

  const downloadURIexcel = (uri, name, data) => {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      headers: {
        Authorization: `Bearer ${JSON.parse(accessToken).value}`,
      },
    };
    // fetch(uri, options)
    //   .then((res) => res.blob())
    //   .then((blob) => {
    //     const fileURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    console.log("URI", uri);
    downloadLink.href = uri;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  const assetData = () => {
    setLoading(true);
    let data = {};
    if (previouspage != null) {
      if (previouspage.previousPage == "Location") {
        data = {
          limit: limit,
          skip: offset,
          search: previouspage?.locatorFilter?.locatorFilter,
          locationId: previouspage?.locationId?.locationId,
        };
        setSearchValue(previouspage?.locatorFilter?.locatorFilter);
        setLocationId(previouspage?.locationId?.locationId);
      }
    }
    if (previouspage != null) {
      if (previouspage?.valid) {
        if (previouspage.valid === "true") {
          if (previouspage.inspectionStatus) {
            data = {
              inspectionStatus: previouspage.inspectionStatus,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setInspectionStatus(previouspage.inspectionStatus);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }
          if (previouspage.currentStatus) {
            data = {
              currentStatus: previouspage.currentStatus,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setCurrentStatus(previouspage.currentStatus);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }
          if (previouspage.defectCode) {
            data = {
              defectCode: previouspage.defectCode,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setDefectCode(previouspage.defectCode);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }
          if (previouspage.repairedDate) {
            data = {
              repairedDate: previouspage.repairedDate,
              eqpmtCatg: previouspage.eqpmtCatg,

              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setRepairedDate(previouspage.repairedDate);
            setEquipcat(previouspage.eqpmtCatg);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }
          if (previouspage.repairAnalysis) {
            data = {
              repairAnalysis: previouspage.repairAnalysis,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setRepairedAnalysis(previouspage.repairAnalysis);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }

          if (previouspage.inspectedDate) {
            data = {
              inspectedDate: previouspage.inspectedDate,
              eqpmtCatg: previouspage.eqpmtCatg,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setInspectedDate(previouspage.inspectedDate);
            setEquipcat(previouspage.eqpmtCatg);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }
          if (previouspage.inspectionGrade) { 
            data = {
              inspectionGrade: previouspage.inspectionGrade,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setInspectedGrade(previouspage.inspectionGrade);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }

          if (previouspage.activitiesOverdue) {
            data = {
              activitiesOverdue: previouspage.activitiesOverdue,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
            setActivitiesOverdue(previouspage.activitiesOverdue);
            setTodate(moment(previouspage?.endDate).format("YYYY-MM-DD"));
            setFromDate(moment(previouspage?.startDate).format("YYYY-MM-DD"));
          }

          if (previouspage.highlight) {
            data = {
              highlightData: previouspage.highlight,
              fromDate: moment(previouspage?.startDate).format("YYYY-MM-DD"),
              toDate: moment(previouspage?.endDate).format("YYYY-MM-DD"),
              limit: limit,
              skip: offset,
            };
          }
        }
      }
    }
    if (previouspage != null) {
      if (previouspage?.values) {
        setTodate(moment(previouspage?.values?.endDate).format("YYYY-MM-DD"));
        setFromDate(
          moment(previouspage?.values?.startDate).format("YYYY-MM-DD")
        );
        data = {
          fromDate: moment(previouspage?.values?.startDate).format(
            "YYYY-MM-DD"
          ),
          toDate: moment(previouspage?.values?.endDate).format("YYYY-MM-DD"),
          limit: limit,
          skip: offset,
        };
      }
    } else {
      data = {
        limit: limit,
        skip: offset,
      };
    }

    try {
      assetService.getAllAssets(data).then((assetData) => {
        setLoading(false);
        setAssets(assetData?.assets);
        setTotal(assetData?.info[0]?.total);
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(getLookup());
    dispatch(getSubLookup());
  };
  const Popup = () => {
    toast.error("No location found");
  };
  useEffect(() => {
    try {
      assetService.getCustomLayout().then((data) => {
        let list = data?.data;
        SetList(data?.data);
        let newlist = [];
        list?.map((ele) => {
          newlist.push({
            key: ele.layoutName,
            text: ele.layoutName,
            value: ele.layoutName,
          });

          if (layout == ele.layoutName) {
            setLayoutFields(ele?.layoutFields);
          }
        });
        setLayoutList(newlist);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    function handleMedia() {
      if (window.innerWidth < 992) {
        setFilter(false);
      } else {
        setFilter(true);
      }
    }
    handleMedia();
    window.addEventListener("resize", handleMedia);
  }, []);

  const handleCheckboxChange = (e, index, id) => {
    // if (previouspage === "addworkorder" || previouspage.ID !== null) {
    //   if (e.target.checked) {
    let _index = isChecked.indexOf(index);
    if (_index == -1) setIsChecked([...isChecked, index]);
    else {
      isChecked.splice(_index, 1);
      setIsChecked([...isChecked]);
    }
    //   } else {
    //     setIsChecked(isChecked.filter((item) => item !== index));
    //   }
    // } else {
    //   if (e.target.checked) {
    //     setIsChecked([index]);
    //   } else {
    //     setIsChecked([]);
    //   }
    // }

    setSelectedId(id);
    let filter = {};
    // if (id !== undefined) {

    // }
  };

  useEffect(async () => {
    let data = await userService.getAllUsers();
    data?.users?.map((item) => {
      if (item.username?.includes(values?.repairedBy)) {
        setSignaturePath(item?.signature);
      }
      if (item.username?.includes(values?.inspectedBy)) {
        setSignaturePath2(item?.signature);
      }
    });
  }, [repairedUser, inspectedUser]);

  useEffect(async () => {
    let filter = {};
    try {
      if (isChecked.length !== 1) return;
      let ourId = assets[isChecked[0]]._id;

      await assetService.getAssetById(String(ourId)).then((assetData) => {
        setValues(assetData);
        setItrvalues(assetData);
        setChecklist(assetData?.checkList);
        setRepairedUser(assetData?.repairedBy);
        setInspectedUser(assetData?.inspectedBy);
        filter = {
          inspectionType: assetData?.inspectionType,
          equipmentType: assetData?.equipmentEquipmentType,
          checklistName: assetData?.inspectionChecklistType,
          inspectionGrade: assetData?.inspectionGrade,
        };

        setDefectCountA(
          assetData?.checkList?.filter((f) =>
            f.defectCode.toLowerCase().startsWith("a")
          )
        );
        setDefectCountB(
          assetData?.checkList?.filter((f) =>
            f.defectCode.toLowerCase().startsWith("b")
          )
        );
        setDefectCountC(
          assetData?.checkList?.filter((f) =>
            f.defectCode.toLowerCase().startsWith("c")
          )
        );
      });
    } catch (error) {
      console.log(error);
    }

    try {
      inspectionService.getAllInspectionList(filter).then((response) => {
        setInspectionChecklist(response);
        let details = response?.checkListDetails.filter(
          (ele, ind) =>
            ind ===
            response?.checkListDetails.findIndex(
              (elem) => elem.defectCode === ele.defectCode
            )
        );
        setInspectionDetails(details);
        setDefectA(
          details.filter((item) => {
            return item.defectCategory == "A";
          })
        );
        setDefectB(
          details.filter((item) => {
            return item.defectCategory == "B";
          })
        );
        setDefectC(
          details.filter((item) => {
            return item.defectCategory == "C";
          })
        );
      });
    } catch (error) {
      console.log(error);
    }
  }, [isChecked]);

  useEffect(() => {
    setResultA(
      inspectionDetails.filter(
        (inspectionDetails) => inspectionDetails.defectCategory === "A"
      )
    );
    setResultB(
      inspectionDetails.filter(
        (inspectionDetails) => inspectionDetails.defectCategory === "B"
      )
    );
    setResultC(
      inspectionDetails.filter(
        (inspectionDetails) => inspectionDetails.defectCategory === "C"
      )
    );
  }, [inspectionDetails]);

  const fetchMoreData = async () => {
    setLoadmore(true);
    setLimit(limit + 30);
    setOfset(offset + 30);
    let data = {};
    if (sortChecked) {
      data = {
        limit: 30,
        skip: offset + 30,
        sortBy: sortField,
        order: orderMore || "",
      };
    }
    if (filterChecked) {
      let limit = {
        limit: 30,
        skip: offset + 30,
      };
      data = { ...values, ...limit };
    }
    if (!sortChecked) {
      data = {
        limit: 30,
        skip: offset + 30,
        search: SearchValue,
        currentStatus: currentStatus,
        defectCode: defectCode,
        inspectionStatus: inspectionStatus,
        repairedDate: repairddate,
        inspectedDate: inspecteddate,
        repairAnalysis: repairedanalysis,
        inspectionGrade: inspectionGrade,
        activitiesOverdue: activitiesOverdue,
        group: values.group,
        highlight: values.highlight,
        eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
        location: values.locations,
        protectionType: values.protectionTypes,
        status: values.status,
        showOnly: values.showOnly,
        fromDate: fromdate ? fromdate : values.fromDate,
        toDate: todate ? todate : values.toDate,
        locationId: locationId,
      };
    }
    if (values.status === "Repaired Partially") {
      data = {
        limit: 30,
        skip: offset + 30,
        search: SearchValue,
        currentStatus: currentStatus,
        defectCode: defectCode,
        inspectionStatus: inspectionStatus,
        repairedDate: repairddate,
        inspectedDate: inspecteddate,
        repairAnalysis: repairedanalysis,
        inspectionGrade: inspectionGrade,
        activitiesOverdue: activitiesOverdue,
        group: values.group,
        highlight: values.highlight,
        eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
        location: values.locations,
        protectionType: values.protectionTypes,
        showOnly: values.showOnly,
        fromDate: fromdate ? fromdate : values.fromDate,
        status: statusValue,
        toDate: todate ? todate : values.toDate,
        locationId: locationId,
      };
    }

    try {
      assetService.getAllAssets(data).then((assetData) => {
        setLoadmore(false);
        let fetchdata = [];
        fetchdata = assetData?.assets;
        setAssets(assets.concat(fetchdata));
      });
    } catch (error) {
      console.log(error);
    }
  };
  //functionality for passing selected asset to work-order add or edit
  const handleAddWokrORder = () => {
    let oldIds = [];
    let oldAssetsArr = [];
    for (let key in state.assetData) {
      oldIds.push(state.assetData[key]._id);
      oldAssetsArr.push(state.assetData[key]);
    }
    let data = [];
    isChecked.forEach((selected) => {
      if (oldIds?.indexOf(assets[selected]._id) === -1)
        data.push(assets[selected]);
    });
    data = [...oldAssetsArr, ...data];
    if (previouspage === "addworkorder") {
      navigate("/work-order/add", { state: data });
    } else if (state?.ID !== null) {
      navigate(`/work-order/edit/${state?.ID}`, { state: data });
    }
  };

  const openModal = (id) => {
    setShowModal(true);
    setId(id);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const openLayout = () => {
    setShowLayout(true);
  };

  const closeLayout = () => {
    setShowLayout(false);
    // assetService.getCustomLayout().then((res) => {
    //   if (res.status == 200 && res.data?.length > 0) {
    //     const options = res?.data?.map((row) => {
    //       return { value: row.layoutName, text: row.layoutName };
    //     });
    //     setLayoutList([...layoutData, ...options]);
    //   } else {
    //     setLayoutList(layoutData);
    //   }
    // });
    getLayout();
    setValues({
      layout: "Classic Layout",
    });
  };

  const addLayout = (name, fields) => {
    let data = {
      layoutName: name.layoutName,
      layoutFields: fields,
    };

    // setShowLayout(false);
    assetService.addCustomLayout(data).then((res) => {
      if (res.data?.status) {
        toast.success("Custom layout added Successfully");
        setShowLayout(false);
        try {
          assetService.getCustomLayout().then((data) => {
            SetList(data?.data);
            let list = data?.data;
            let newlist = [];
            list?.map((ele) => {
              newlist.push({
                key: ele[17].layoutName,
                text: ele[17].layoutName,
                value: ele[17].layoutName,
              });
              if (layout == ele.layoutName) {
                setLayoutFields(ele.layoutFields);
              }
            });
            setLayoutList(newlist);
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
    getLayout();
    setValues({
      layout: "Classic Layout",
    });
  };

  const toggleFilter = () => setFilter(!isFilter);

  const getLayout = () => {
    try {
      assetService.getCustomLayout().then((data) => {
        let list = data?.data;
        let newlist = [];
        list?.map((ele) => {
          newlist.push({
            key: ele.layoutName,
            text: ele.layoutName,
            value: ele.layoutName,
          });

          if (ele.layoutName == "Classic Layout") {
            setLayoutFields(ele.layoutFields);
          }
        });
        setLayoutList(newlist);
      });
    } catch (error) {
      console.log(error);
    }
  };
  function handleClick() {
    const targetElement = targetRef.current;
    if (targetElement) {
      targetElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  const handleLayout = (event, data) => {
    setDefaultLayout(false);
    const { value } = data;
    setValues({ ...values, layout: value });
    setLayout(value);
    if (value == "Custom Layout") {
      openLayout();
    }
    try {
      assetService.getCustomLayout().then((data) => {
        let list = data?.data;
        let newlist = [];
        list?.map((ele) => {
          newlist.push({
            key: ele.layoutName,
            text: ele.layoutName,
            value: ele.layoutName,
          });

          if (value == ele.layoutName) {
            setLayoutFields(ele.layoutFields);
          }
        });
        setLayoutList(newlist);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroupBy = (event, data) => {
    const { value } = data;
    //const { key } = data.options.find(o => o.value === value);
    setValues({ ...values, group: value });
    setGroup(value);
  };
  const handleHighlight = (event, data) => {
    const { value } = data;
    //const { key } = data.options.find(o => o.value === value);
    setValues({ ...values, highlight: value });
    setHighlight(value);
  };

  const handleStatus = (event, data) => {
    const { value } = data;
    //const { key } = data.options.find(o => o.value === value);
    setValues({ ...values, status: value });
    setStatus(value);
  };

  const handleShowOnly = (event, data) => {
    const { value } = data;
    //const { key } = data.options.find(o => o.value === value);
    setValues({ ...values, showOnly: value });
    setShowOnly(value);
  };

  const handleLocation = (event) => {
    setValues({ ...values, locations: event.target.value });
  };

  // const handleEquipmentType = (event) => {
  //   setValues({ ...values, eqpmtCatg : event.target.value });
  // };

  const handleEquipmentType = (event, data) => {
    const { value } = data;

    setValues({ ...values, eqpmtCatgory: value });
  };

  const handleExProtection = (event) => {
    setValues({ ...values, protectionTypes: event.target.value });
  };

  // Asset Filter
  const handleFilter = async (e) => {
    setLoading(true);
    setOfset(0);
    setFilterSkip(!FilterSkip);
    if (FilterSkip === true) {
      setOfset(0);
    }
    e.preventDefault();
    let datas = {};

    datas = {
      limit: 30,
      skip: offset,
      search: SearchValue,

      currentStatus: currentStatus,
      defectCode: defectCode,
      inspectionStatus: inspectionStatus,
      repairedDate: repairddate,
      eqpmtCatg: equipcat,
      inspectedDate: inspecteddate,
      repairAnalysis: repairedanalysis,
      inspectionGrade: inspectionGrade,
      activitiesOverdue: activitiesOverdue,
      group: values.group,
      highlight: values.highlight,
      eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
      location: values.locations,
      protectionType: values.protectionTypes,
      status: values.status,
      showOnly: values.showOnly,
      fromDate: values.fromDate ? values.fromDate : fromdate,
      toDate: values.toDate ? values.toDate : todate,
      locationId: locationId,
    };
    try {
      await assetService.assetFilter(datas).then((data) => {
        setLoading(false);
        setAssets(data?.assets);
        setHighlightCell(data?.highlightCell);

        setTotal(data?.info[0]?.total);
        setFilterChecked(true);
        if (
          values.fromDate === "Invalid date" ||
          values.toDate === "Invalid date"
        ) {
          assetData();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Asset Clear Filter
  const handleFilterClear = () => {
    setHighlightCell([]);
    setLoading(true);
    setSearchValue("");
    setFromDate("");
    setTodate("");
    setStartingDate("");
    setEndingDate("");
    setValues({
      protectionTypes: "",
      locations: "",
      showOnly: "",
      group: "",
      highlight: "",
      layout: "Classic Layout",
      eqpmtCatgory: "",
      status: "",
    });

    getLayout();
    try {
      let data = {
        limit: limit,
        skip: offset,
      };
      assetService.getAllAssets(data).then((assetData) => {
        setLoading(false);
        setAssets(assetData?.assets);
        setTotal(assetData?.info[0]?.total);
        setSortChecked(false);
        setFilterChecked(false);
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(getLookup());
    dispatch(getSubLookup());
  };

  // For delete Asset
  const deleteAsset = () => {
    try {
      assetService.deleteAsset(id).then(
        (response) => {
          setShowModal(false);

          toast.success("Asset deleted successfully");
          assetData();
          handleFilterClear();
        },
        (error) => {
          console.log(error);
          handleFilterClear();
        }
      );
    } catch (err) {
      setShowModal(true);
    }
  };

  const handleStartRange = (event, data) => {
    setStartingDate(data.value);
    setValues({ ...values, fromDate: moment(data.value).format("YYYY-MM-DD") });
  };
  const handleEndRange = (event, data) => {
    setEndingDate(data.value);
    setValues({ ...values, toDate: moment(data.value).format("YYYY-MM-DD") });
  };
  //functionality for search
  const handleSearch = async (event) => {
    setLoading(true);
    let data = {};
    if (previouspage == "Location") {
      data = {
        limit: limit,
        skip: offset,
        search: previouspage.locatorFilter.locatorFilter.replace("+", /\s/g),
      };
    } else {
      data = {
        limit: limit,
        skip: offset,
        search: event.target.value.replace("+", /\s/g),

        currentStatus: currentStatus,
        defectCode: defectCode,
        inspectionStatus: inspectionStatus,
        repairedDate: repairddate,
        eqpmtCatg: equipcat,
        inspectedDate: inspecteddate,
        repairAnalysis: repairedanalysis,
        inspectionGrade: inspectionGrade,
        activitiesOverdue: activitiesOverdue,
        group: values.group,
        highlight: values.highlight,
        eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
        location: values.locations,
        protectionType: values.protectionTypes,
        status: values.status,
        showOnly: values.showOnly,
        fromDate: fromdate ? fromdate : values.fromDate,
        toDate: todate ? todate : values.toDate,
        locationId: locationId,
      };
    }
    setSearchValue(event.target.value.replace("+", /\s/g));
    setTimeout(() => {
      try {
        assetService.getAllAssets(data).then((assetData) => {
          setLoading(false);
          setAssets(assetData?.assets);
          setTotal(assetData?.info?.[0].total);
        });
      } catch (error) {
        console.log(error);
      }
    }, 3000);
  };

  const formAnim = {
    hidden: {
      opacity: 0,
      display: "none",
      transition: {
        all: 0.5,
      },
    },
    show: {
      opacity: 1,
      display: "block",
      transition: {
        all: 0.5,
      },
    },
  };

  //functionalty for sorting as well as the ascending & descending based on the new field and old field
  const handleSort = (e) => {
    setLoader(true);
    let data = {};
    let sort_order = order;
    setSortField(e);
    if (sortField === "" || sortField === e) {
      data = {
        sortBy: e,
        order: sort_order,
        search: SearchValue,
        currentStatus: currentStatus,
        defectCode: defectCode,
        inspectionStatus: inspectionStatus,
        repairedDate: repairddate,
        inspectedDate: inspecteddate,
        repairAnalysis: repairedanalysis,
        inspectionGrade: inspectionGrade,
        activitiesOverdue: activitiesOverdue,
        group: values.group,
        highlight: values.highlight,
        eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
        location: values.locations,
        protectionType: values.protectionTypes,
        status: values.status,
        showOnly: values.showOnly,
        fromDate: values.fromDate ? values.fromDate : fromdate,
        toDate: values.toDate ? values.toDate : todate,
        locationId: locationId,
      };
    } else {
      data = {
        sortBy: e,
        order: "descending",
        search: SearchValue,
        currentStatus: currentStatus,
        defectCode: defectCode,
        inspectionStatus: inspectionStatus,
        repairedDate: repairddate,
        eqpmtCatg: equipcat,
        inspectedDate: inspecteddate,
        repairAnalysis: repairedanalysis,
        inspectionGrade: inspectionGrade,
        activitiesOverdue: activitiesOverdue,
        group: values.group,
        highlight: values.highlight,
        eqpmtCatg: equipcat ? equipcat : values.eqpmtCatgory,
        location: values.locations,
        protectionType: values.protectionTypes,
        status: values.status,
        showOnly: values.showOnly,
        fromDate: values.fromDate ? values.fromDate : fromdate,
        toDate: values.toDate ? values.toDate : todate,
        locationId: locationId,
      };
    }
    try {
      assetService.getAllAssets(data).then((assetData) => {
        setIsChecked([]);
        setLoader(false);
        setAssets(assetData.assets);
        setSortChecked(true);
        setOrderMore(order);
        if (data.order === "descending") {
          setOrder("ascending");
          setLimit(30);
          setOfset(0);
        } else {
          setOrder("descending");
          setLimit(30);
          setOfset(0);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <PageHeader title="Asset Register" className="filter-btns">
          <Search
            name="assetRegister"
            placeholder="Search Here..."
            onChange={handleSearch}
            value={SearchValue ? SearchValue : ""}
          />

          {isChecked.length === 1 && (
            <PDFDownloadLink
              fileName="Inspection test report"
              document={
                <GeneratePdf
                  values={ItrValues}
                  inspectionChecklist={inspectionChecklist}
                  totalA={totalA}
                  totalB={totalB}
                  totalC={totalC}
                  inspectionDetails={inspectionDetails}
                  defectCountA={defectCountA}
                  defectCountB={defectCountB}
                  defectCountC={defectCountC}
                  checklist={checklist}
                  resultA={resultA}
                  resultB={resultB}
                  resultC={resultC}
                  signaturePath={signaturePath}
                  signaturePath2={signaturePath2}
                />
              }
              filename="inspection-test-report"
              style={{ width: "100%" }}
            >
              {!values._id ? (
                <Button
                  className="generate-btn"
                  variant="click-info"
                  size="click-sm"
                >
                  {" "}
                  <span>
                    <Spinner />
                  </span>
                </Button>
              ) : (
                <Button
                  className="generate-btn"
                  variant="click-info"
                  size="click-sm"
                >
                  <span>Generate ITR</span>
                </Button>
              )}
            </PDFDownloadLink>
          )}

          <Link to="/asset-register/add" className="btn-link">
            <Button variant="click-info" size="click-sm">
              <AiOutlinePlusCircle size={20} />
              <span>Add</span>
            </Button>
          </Link>
          <Button onClick={handleExcel} variant="click-info" size="click-sm">
            <img src={images.excel} alt="Export to Excel" />
            <span>Excel</span>
          </Button>
          {/* <PDFDownloadLink document={<AssetPdf assets={assets} />}>
            {assets[0] && (
              <Button variant="click-info" size="click-sm">
                <img src={images.print} alt="Print Document" />
                <span>Print</span>
              </Button>
            )}
          </PDFDownloadLink> */}

          <Button variant="click-info" size="click-sm" onClick={handlepdf}>
            <img src={images.print} alt="Print Document" />
            <span>Print</span>
          </Button>
          <Button
            size="click-sm"
            className="filter-btn"
            onClick={toggleFilter}
            variant={`${isFilter ? "click-primary" : "click-info"}`}
          >
            <BiFilterAlt size={20} />
            <span>Filter</span>
          </Button>
        </PageHeader>
        <div
          className={`app__filter asset_filter ${className} ${
            isFilter && "show"
          }`}
        >
          <Form
            className="filter"
            onSubmit={(e) => handleFilter(e)}
            formRef={filterFormRef}
          >
            <Row>
              <Col xl={4} lg={4} md={6}>
                <FormSelect
                  data={layoutList}
                  name="layout"
                  label="Choose Layout"
                  onChange={handleLayout}
                  placeholder="Classic Layout"
                  value={values.layout}
                />
              </Col>
              <Col xl={4} lg={4} md={6}>
                <FormSelect
                  name="group"
                  data={groupByData}
                  value={values.group}
                  label="Group By"
                  onChange={handleGroupBy}
                  placeholder="Standard"
                />
              </Col>
              <Col xl={4} lg={4} md={6}>
                <FormSelect
                  name="highlight"
                  data={highlightData}
                  value={values.highlight}
                  label="Highlight Cells"
                  onChange={handleHighlight}
                  placeholder="Highlight Cells"
                />
              </Col>
              <Col xl={4} lg={4} md={6}>
                <FormInput
                  name="location"
                  type="text"
                  placeholder="Enter Location"
                  label="Location"
                  onChange={handleLocation}
                  value={values.locations}
                />
              </Col>

              <Col xl={4} lg={4} md={6}>
                <FormSelect
                  name="eqpmtCatg"
                  data={CategoryData}
                  label="Equipment Category"
                  onChange={handleEquipmentType}
                  placeholder="Select Equipment Category "
                  value={values.eqpmtCatgory}
                />
              </Col>
              <Col xl={4} lg={4} md={6}>
                <FormInput
                  value={values.protectionTypes}
                  type="text"
                  placeholder="Enter Protection Type"
                  label="Protection Type"
                  onChange={handleExProtection}
                />
              </Col>
              <Col xl={4} lg={4} md={6}>
                <FormSelect
                  value={values.status}
                  name="status"
                  data={statusData}
                  label="Equipment Status"
                  onChange={handleStatus}
                  placeholder="Select Equipment Status"
                />
              </Col>
              <Col xl={4} lg={4} md={6}>
                <FormSelect
                  value={values.showOnly}
                  data={showOnlyData}
                  label="Show Only"
                  onChange={handleShowOnly}
                  placeholder=" Show Only"
                  name="showOnly"
                />
              </Col>
              <Col xl={4} lg={8} md={6}>
                <DateRange
                  handleFrom={handleStartRange}
                  handleTo={handleEndRange}
                  fromDate={
                    fromdate
                      ? moment(fromdate).format("DD-MMM-YYYY")
                      : startingDate
                  }
                  toDate={
                    todate ? moment(todate).format("DD-MMM-YYYY") : endingDate
                  }
                  name="toDate"
                />
              </Col>
            </Row>
            <Row>
              <Col xl={12} lg={12}>
                <div className="app__btns submit">
                  <Button
                    variant="click-gray"
                    size="click-lg"
                    type="button"
                    onClick={handleFilterClear}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="click-primary"
                    size="click-lg"
                    type="submit"
                  >
                    Apply
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        {showLayout && (
          <CustomLayout
            closeLayout={closeLayout}
            list={list}
            addLayout={addLayout}
          />
        )}
      </div>
      <div className="app__content">
        <div className="asset-table selectable" ref={targetRef}>
          <div>
            {!loadings ? (
              <Table striped>
                <thead>
                  <tr>
                    <th></th>

                    {layoutFieldList?.includes("Sl. No.") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Sl. No.</span>
                          {/* <FaSort  onClick={(e)=>handleSort("Sl.No")} size={18} /> */}
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("RFID Reference") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>RFID Reference</span>
                          <FaSort
                            onClick={(e) => handleSort("rfidRef")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Inspection Reference") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Inspection Reference</span>
                          <FaSort
                            onClick={(e) =>
                              handleSort("inspectionReferenceNumber")
                            }
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Location") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Location</span>
                          <FaSort
                            onClick={(e) => handleSort("location")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Area") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Area</span>
                          <FaSort
                            onClick={(e) => handleSort("area")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Sub-Area") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Sub-Area</span>
                          <FaSort
                            onClick={(e) => handleSort("subArea")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("GPS Co-ordinates") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>GPS Co-ordinates</span>
                          <FaSort
                            onClick={(e) => handleSort("locationLatitude")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Zone") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span> Zone </span>
                          <FaSort
                            onClick={(e) => handleSort("zone")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Area Gas group") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span> Area Gas group</span>
                          <FaSort
                            onClick={(e) => handleSort("locationGasGroup")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Area T-Class") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span> Area T-Class</span>
                          <FaSort
                            onClick={(e) => handleSort("locationTClass")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("IP Rating") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>IP Rating</span>
                          <FaSort
                            onClick={(e) => handleSort("locationIpRating")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes(
                      "Area Classification Drawing Number"
                    ) ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          Area Classification
                          <br /> Drawing Number
                          <FaSort
                            onClick={(e) => handleSort("areaClassDrawNo")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes(
                      "Equipment Layout Drawing Number"
                    ) ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          Equipment Layout
                          <br /> Drawing Number{" "}
                          <FaSort
                            onClick={(e) => handleSort("eqpmtLytDrawNo")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Equipment Tag") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Equipment Tag</span>
                          <FaSort
                            onClick={(e) => handleSort("eqpmtTag")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Circuit ID") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Circuit ID</span>
                          <FaSort
                            onClick={(e) => handleSort("circuitId")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Manufacturer") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Manufacturer</span>
                          <FaSort
                            onClick={(e) => handleSort("manufacturer")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Description") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Description</span>
                          <FaSort
                            onClick={(e) => handleSort("description")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Type / Model") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Type / Model</span>
                          <FaSort
                            onClick={(e) => handleSort("type")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Serial Number") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Serial Number</span>
                          <FaSort
                            onClick={(e) => handleSort("serialNumber")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Equipment Category") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Equipment Category</span>
                          <FaSort
                            onClick={(e) => handleSort("eqpmtCatg")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("ATEX Category") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>ATEX Category</span>
                          <FaSort
                            onClick={(e) => handleSort("atexCatg")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("EPL") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>EPL</span>
                          <FaSort
                            onClick={(e) => handleSort("epl")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Protection Standard") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Protection Standard</span>
                          <FaSort
                            onClick={(e) => handleSort("protectionStd")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Protection type") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span> Protection type </span>
                          <FaSort
                            onClick={(e) => handleSort("protectionType")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Equip. Gas Group") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Equip. Gas Group </span>
                          <FaSort
                            onClick={(e) => handleSort("equipmentGasGroup")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Equip. T-Class") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span> Equip. T-Class </span>
                          <FaSort
                            onClick={(e) => handleSort("equipmentTClass")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("IP Rating") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>IP Rating </span>
                          <FaSort
                            onClick={(e) => handleSort("locationIpRating")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("T-Ambient") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>T-Ambient</span>
                          <FaSort
                            onClick={(e) => handleSort("tAmbient")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Certification Body") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Certification Body</span>
                          <FaSort
                            onClick={(e) => handleSort("certfnBody")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Certification Number") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Certification Number</span>
                          <FaSort
                            onClick={(e) => handleSort("certfnNo")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Special Conditions") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Special Conditions</span>
                          <FaSort
                            onClick={(e) => handleSort("specialCond")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Inspection Type") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Inspection Type</span>
                          <FaSort
                            onClick={(e) => handleSort("inspectionType")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Inspection Checklist") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>
                            <div>Inspection</div>
                            <div>Checklist</div>
                          </span>
                          <FaSort
                            onClick={(e) => handleSort("inspectionChecklist")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Inspection Grade") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Inspection Grade</span>
                          <FaSort
                            onClick={(e) => handleSort("inspectionGrade")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Findings") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn align-left"
                        >
                          <span>Findings</span>
                          {/* <FaSort onClick={(e)=>handleSort("finding")} size={18} /> */}
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Remedial Actions") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn align-left"
                        >
                          <span>Remedial Actions</span>
                          {/* <FaSort onClick={(e)=>handleSort("remedialAction")} size={18} /> */}
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Faulty Items") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Faulty Items</span>
                          <FaSort
                            onClick={(e) => handleSort("faultyItems")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Inspection Photos") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Inspection Photos</span>
                          {/* <FaSort size={18} /> */}
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Inspection Status") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn align-left"
                        >
                          <span>Inspection Status</span>

                          <FaSort
                            onClick={(e) => handleSort("inspectionStatus")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Defect Category") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Defect Category</span>
                          <FaSort
                            onClick={(e) => handleSort("defectDefectCategory")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Overall Condition") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Overall Condition</span>
                          <FaSort
                            onClick={(e) =>
                              handleSort("correctiveOverallCondition")
                            }
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes(" Isolations") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Isolations</span>
                          <FaSort
                            onClick={(e) => handleSort("defectIsolation")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes(" Other Requirements") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Other Requirements</span>
                          <FaSort
                            onClick={(e) =>
                              handleSort("defectOtherRequirements")
                            }
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Material Requirements") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Material Requirements</span>
                          {/* <FaSort
                          onClick={(e) => handleSort("materialReq")}
                          size={18}
                        /> */}
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Equipment Data Sheet") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Equipment Data Sheet </span>
                          <FaSort
                            onClick={(e) => handleSort("equpmentData")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Inspected By") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Inspected By</span>
                          <FaSort
                            onClick={(e) => handleSort("inspectedBy")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Inspected Date") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Inspected Date</span>
                          <FaSort
                            onClick={(e) => handleSort("inspectedDate")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Repairs Done") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn align-left"
                        >
                          <span>Repairs Done</span>
                          <FaSort
                            onClick={(e) => handleSort("isDone")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Existing Faults") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Existing Faults</span>
                          <FaSort
                            onClick={(e) => handleSort("existingFaults")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Current Photos") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Current Photos</span>
                          {/* <FaSort size={18} /> */}
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Current Status") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Current Status</span>
                          <FaSort
                            onClick={(e) => handleSort("currentStatus")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes(" Defect Category") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Defect Category</span>
                          <FaSort
                            onClick={(e) =>
                              handleSort("correctiveDefectCategory")
                            }
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Current Condition") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn align-left"
                        >
                          <span>Current Condition</span>
                          <FaSort
                            onClick={(e) =>
                              handleSort("correctiveOverallCondition")
                            }
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Isolations") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Isolations</span>
                          <FaSort
                            onClick={(e) => handleSort("correctiveisolation")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}
                    {layoutFieldList?.includes("Other Requirements") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Other Requirements</span>
                          <FaSort
                            onClick={(e) =>
                              handleSort("correctiveOtherRequirements")
                            }
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Repaired By") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Repaired By</span>
                          <FaSort
                            onClick={(e) => handleSort("repairedBy")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    {layoutFieldList?.includes("Repaired Date") ? (
                      <th>
                        <Button
                          variant="click-none"
                          size="resize"
                          className="sort-btn"
                        >
                          <span>Repaired Date</span>
                          <FaSort
                            onClick={(e) => handleSort("repairedDate")}
                            size={18}
                          />
                        </Button>
                      </th>
                    ) : (
                      ""
                    )}

                    <th style={{ textAlign: "right", paddingRight: "15px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets?.map((asset, index) => {
                    var letter = asset?.location?.indexOf(
                      " ",
                      asset?.location?.indexOf(" ") + 1
                    );

                    var word1 = asset?.location?.substr(0, letter);
                    var word2 = asset?.location?.substr(letter + 1);

                    var letter2 = asset?.manufacturer?.indexOf(
                      " ",
                      asset?.manufacturer?.indexOf(" ") + 1
                    );
                    var letter3 = asset?.defectOverallCondition?.indexOf(
                      " ",
                      asset?.defectOverallCondition?.indexOf(" ") + 1
                    );
                    let Name = "";
                    if (highlightCell?.includes(asset._id)) {
                      Name = " assetmanager";
                    }
                    return (
                      <tr
                        className={`${Name && "hilite"}`}
                        style={style}
                        key={index}
                      >
                        <td>
                          <FormCheckbox
                            onChange={(e) =>
                              handleCheckboxChange(e, index, asset._id)
                            }
                            checked={isChecked.some((item) => item === index)}
                            name={"assetCheckbox"}
                          />
                        </td>

                        {layoutFieldList?.includes("Sl. No.") ? (
                          <td>
                            <Link
                              to={{
                                pathname: `/asset-register/edit/${asset?._id}`,
                              }}
                            >
                              {index + 1}
                            </Link>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("RFID Reference") ? (
                          <td>{asset?.rfidRef}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspection Reference") ? (
                          <td>
                            <Link
                              to={{
                                pathname: `/asset-register/edit/${asset._id}`,
                              }}
                            >
                              {asset?.inspectionReferenceNumber}
                            </Link>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Location") ? (
                          <td>
                            <div>{word1}</div>
                            <div>{word2}</div>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Area") ? (
                          <td>{asset?.area}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Sub-Area") ? (
                          <td>{asset?.subArea}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("GPS Co-ordinates") ? (
                          <td>
                            <div> {asset?.locationLatitude},</div>
                            <div> {asset?.locationLongitude}</div>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Zone") ? (
                          <td>{asset?.zone} </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Area Gas group") ? (
                          <td>{asset?.locationGasGroup} </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Area T-Class") ? (
                          <td>{asset?.locationTClass}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("IP Rating") ? (
                          <td>{asset?.locationIpRating}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes(
                          "Area Classification Drawing Number"
                        ) ? (
                          <td>{asset?.areaClassDrawNo}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes(
                          "Equipment Layout Drawing Number"
                        ) ? (
                          <td>{asset?.eqpmtLytDrawNo}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Equipment Tag") ? (
                          <td>{asset?.eqpmtTag}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Circuit ID") ? (
                          <td>{asset?.circuitId}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Manufacturer") ? (
                          <td>
                            <div>{asset?.manufacturer?.substr(0, letter2)}</div>
                            <div>
                              {asset?.manufacturer?.substr(letter2 + 1)}
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Description") ? (
                          <td
                            style={{
                              whiteSpace: "break-spaces",
                              minWidth: "225px",
                            }}
                          >
                            {asset?.description}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Type / Model") ? (
                          <td>{asset?.type}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Serial Number") ? (
                          <td>{asset?.serialNumber}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Equipment Category") ? (
                          <td>{asset?.eqpmtCatg}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("ATEX Category") ? (
                          <td>{asset?.atexCatg}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("EPL") ? (
                          <td>{asset?.epl}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Protection Standard") ? (
                          <td>{asset?.protectionStd}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Protection type") ? (
                          <td>{asset?.protectionType} </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Equip. Gas Group") ? (
                          <td>{asset?.equipmentGasGroup}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Equip. T-Class") ? (
                          <td>{asset?.equipmentTClass}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("IP Rating") ? (
                          <td>{asset?.equipmentIpRating}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("T-Ambient") ? (
                          <td>{asset?.tAmbient}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Certification Body") ? (
                          <td>{asset?.certfnBody}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Certification Number") ? (
                          <td>{asset?.certfnNo}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Special Conditions") ? (
                          <td>{asset?.specialCond}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspection Type") ? (
                          <td>{asset?.inspectionType}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspection Checklist") ? (
                          <td>{asset?.inspectionChecklist}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspection Grade") ? (
                          <td>{asset?.inspectionGrade}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Findings") ? (
                          <td
                            className="text-left"
                            style={{
                              whiteSpace: "break-spaces",
                              minWidth: "300px",
                            }}
                          >
                            {asset?.checkList?.map((item, i) =>
                              item?.findingsAndActions?.map((list, i) => {
                                if (list.isSelected != undefined) {
                                  if (list?.isSelected === true) {
                                    return (
                                      <>
                                        <div key={i}>
                                          <span>{list?.defectCode}. </span>
                                          <span>{list?.finding}</span>
                                        </div>
                                      </>
                                    );
                                  }
                                }
                              })
                            )}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Remedial Actions") ? (
                          <td className="text-left">
                            {asset?.checkList?.map((item, i) =>
                              item?.findingsAndActions?.map((list, i) => {
                                if (list.isSelected != undefined) {
                                  if (list?.isSelected === true) {
                                    return (
                                      <>
                                        <div key={i}>
                                          <span>{list?.defectCode}. </span>
                                          <span>{list?.remedialAction}</span>
                                        </div>
                                      </>
                                    );
                                  }
                                }
                              })
                            )}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Faulty Items") ? (
                          <td>{asset?.faultyItems}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspection Photos") ? (
                          <td>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                window.open(
                                  `${process.env.REACT_APP_BACKEND_BASE_URL}/${asset?.defectivePhoto1}`
                                );
                              }}
                            >
                              {asset?.defectivePhoto1OrgName}
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                window.open(
                                  `${process.env.REACT_APP_BACKEND_BASE_URL}/${asset?.defectivePhoto2}`
                                );
                              }}
                            >
                              {asset?.defectivePhoto2OrgName}
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                window.open(
                                  `${process.env.REACT_APP_BACKEND_BASE_URL}/${asset?.defectivePhoto3}`
                                );
                              }}
                            >
                              {asset?.defectivePhoto3OrgName}
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspection Status") ? (
                          <td className="text-left">
                            {asset?.inspectionStatus == "Red" ? (
                              <span className="status-flag">
                                <img src={redFlag} alt="status" />
                                <span>Red</span>
                              </span>
                            ) : asset?.inspectionStatus == "Green" ? (
                              <span className="status-flag">
                                <img src={greenFlag} alt="status" />
                                <span>Green</span>
                              </span>
                            ) : asset?.inspectionStatus == "Yellow" ? (
                              <span className="status-flag">
                                <img src={yellowFlag} alt="status" />
                                <span>Yellow</span>
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Defect Category") ? (
                          <td>{asset?.defectDefectCategory}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Overall Condition") ? (
                          <td>
                            <div>
                              {asset?.defectOverallCondition?.substr(
                                0,
                                letter3
                              )}
                            </div>
                            <div>
                              {asset?.defectOverallCondition?.substr(
                                letter3 + 1
                              )}
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes(" Isolations") ? (
                          <td>{asset?.defectIsolation}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes(" Other Requirements") ? (
                          <td>{asset?.defectOtherRequirements}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Material Requirements") ? (
                          <td>
                            {asset?.materials?.map((item, i) => {
                              return (
                                <div>
                                  <span>{item?.specification}</span>
                                  <span></span>
                                  {item?.qty && <span>-</span>}
                                  <span>{item?.qty}</span>
                                  <span></span>
                                  {item?.unit && <span>-</span>}
                                  <span>{item?.unit}</span>
                                </div>
                              );
                            })}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Equipment Data Sheet") ? (
                          <td>{asset?.dataSheetOrgName}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspected By") ? (
                          <td>{asset?.inspectedBy}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Inspected Date") ? (
                          <td>
                            {asset.inspectedDate &&
                            asset.inspectedDate.includes("+")
                              ? moment
                                  .utc(asset.inspectedDate)
                                  .format("DD/MM/YYYY hh:mm A")
                              : asset.inspectedDate
                              ? moment(asset.inspectedDate).format(
                                  "DD/MM/YYYY hh:mm A"
                                )
                              : ""}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Repairs Done") ? (
                          // <td>{asset?.repairedDone}</td>

                          <td className="text-left">
                            {asset?.checkList?.map((item, index) =>
                              item.findingsAndActions?.map((list, i) => {
                                if (list?.isSelected === true) {
                                  return (
                                    <>
                                      {list.defectCode != null ? (
                                        <span className="repairs-done">
                                          <p>{list?.defectCode}</p>
                                          {list.isDone ? (
                                            <span className="success">
                                              <MdCheck />
                                            </span>
                                          ) : (
                                            <span className="failed">
                                              <MdOutlineClose />
                                            </span>
                                          )}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  );
                                }
                              })
                            )}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Existing Faults") ? (
                          <td>{asset?.existingFaults}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Current Photos") ? (
                          <td>
                            {" "}
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                window.open(
                                  `${process.env.REACT_APP_BACKEND_BASE_URL}/${asset?.correctivePhoto1}`
                                );
                              }}
                            >
                              {asset?.correctivePhoto1OrgName}
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                window.open(
                                  `${process.env.REACT_APP_BACKEND_BASE_URL}/${asset?.correctivePhoto2}`
                                );
                              }}
                            >
                              {asset?.correctivePhoto2OrgName}
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                window.open(
                                  `${process.env.REACT_APP_BACKEND_BASE_URL}/${asset?.correctivePhoto3}`
                                );
                              }}
                            >
                              {asset?.correctivePhoto3OrgName}
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Current Status") ? (
                          <td className="text-left">
                            {asset?.currentStatus == "Red" ? (
                              <span className="status-flag">
                                <img src={redFlag} alt="status" />
                                <span>Red</span>
                              </span>
                            ) : asset?.currentStatus == "Green" ? (
                              <span className="status-flag">
                                <img src={greenFlag} alt="status" />
                                <span>Green</span>
                              </span>
                            ) : asset?.currentStatus == "Yellow" ? (
                              <span className="status-flag">
                                <img src={yellowFlag} alt="status" />
                                <span>Yellow</span>
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes(" Defect Category") ? (
                          <td>{asset?.correctiveDefectCategory}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Current Condition") ? (
                          <td className="text-left">
                            {asset?.correctiveOverallCondition}
                          </td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Isolations") ? (
                          <td>{asset?.correctiveisolation}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Other Requirements") ? (
                          <td>{asset?.correctiveOtherRequirements}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Repaired By") ? (
                          <td>{asset?.repairedBy}</td>
                        ) : (
                          ""
                        )}
                        {layoutFieldList?.includes("Repaired Date") ? (
                          <td>
                            {asset.repairedDate &&
                            asset.repairedDate.includes("+")
                              ? moment
                                  .utc(asset.repairedDate)
                                  .format("DD/MM/YYYY hh:mm A")
                              : asset.repairedDate
                              ? moment(asset.repairedDate).format(
                                  "DD/MM/YYYY hh:mm A"
                                )
                              : ""}
                          </td>
                        ) : (
                          ""
                        )}
                        <td>
                          <div className="table-action">
                            <Button
                              onClick={() => openModal(asset._id)}
                              variant="click-none"
                              size="click-resize"
                              className="delete-btn"
                            >
                              <RiDeleteBinLine size={20} />
                            </Button>
                            {showModal && (
                              <Modal
                                closeModal={closeModal}
                                title="Delete Asset ?"
                                text="Are you sure you want to delete this Asset !"
                              >
                                <Button
                                  variant="click-gray"
                                  size="click-lg"
                                  onClick={closeModal}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => deleteAsset()}
                                  variant="click-primary"
                                  size="click-lg"
                                >
                                  Delete
                                </Button>
                              </Modal>
                            )}
                            <Button
                              variant="click-none"
                              size="click-resize"
                              className="external-btn"
                            >
                              <RiExternalLinkLine
                                size={20}
                                onClick={() => {
                                  {
                                    asset.eqpmtLatitude
                                      ? window.open(
                                          `https://www.google.com/maps/?q=${asset.eqpmtLatitude},${asset.eqpmtLongitude}`
                                        )
                                      : Popup();
                                  }
                                }}
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <Spinner />
            )}
            {loadings === false && assets?.length === 0 ? (
              <p className="no-data" style={{ padding: "20px 0" }}>
                No data found
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <TablePagination
          fetchMoreData={fetchMoreData}
          Loadmore={Loadmore}
          totalResult={total}
          isLoading={limit > 30 ? true : false}
          showingResult={assets}
          handleClick={handleClick}
        />

        {previouspage != null &&
        previouspage.previouspage === "editworkorder" ? (
          <PageFooter>
            <Button
              onClick={handleAddWokrORder}
              variant="click-primary"
              size="click-lg"
              type="submit"
            >
              Add to Work Order
            </Button>
          </PageFooter>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default AssetRegister;
