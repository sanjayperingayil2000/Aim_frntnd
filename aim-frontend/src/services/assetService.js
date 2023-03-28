import axios from "../axios";

const getAllAssets = (data) => {
  try {
    return axios
      .get("/assets", { params: data })
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};

const getpdf = (data) => {
  try {
    return axios
      .get("/asset-pdfdownload", { params: data })
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};

const removepdf = (filename) => {
  try {
    return axios
      .get("/remove-pdf-file/" + filename)
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};

const getExcel = (data) => {
  try {
    return axios
      .get("/asset-excel", { params: data })
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};

const removeExcel = (filenames) => {
  try {
    return axios
      .get("/remove-excel-file/" + filenames)
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};

const getAllAssetsReport = (type) => {
  try {
    return axios
      .get(`/assets/report/`, { params: { type: type } })
      .then((response) => console.log(response));
  } catch (e) {
    console.log(e);
  }
};

const getCustomLayout = () => {
  try {
    return axios.get(`/assetRegisterLayout`).then((response) => response);
  } catch (e) {
    console.log(e);
  }
};

const addCustomLayout = (data) => {
  try {
    return axios
      .post("/assetRegisterLayout", { assetRegisterLayout: data })
      .then((response) => response);
  } catch (e) {
    console.log(e);
  }
};

const deleteAsset = (id) => {
  console.log("id", id);
  return axios
    .post(`/assets/${id}`, {
      asset: {
        isActive: false,
      },
    })
    .then((response) => {
      return response;
    });
};

const assetFilter = (filterData) => {
  try {
    return axios
      .get("/assets", { params: filterData })
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};

const getAssetById = (ID) => {
  try {
    return axios
      .get(`/assets/${ID}`)
      .then((response) => response.data?.data?.assetDetails);
  } catch (e) {
    console.log(e);
  }
};

const assetService = {
  getAllAssets,
  getAllAssetsReport,
  deleteAsset,
  assetFilter,
  getAssetById,
  addCustomLayout,
  getCustomLayout,
  getpdf,
  removepdf,
  getExcel,
  removeExcel

};

export default assetService;
