import axios from '../axios';

const getAllWorkOrder = (data) => {
    try {
      return axios.get('/work-order', { params: data })
      .then(response => response.data[0])       
    }
    catch(e){
      console.log(e)
    }
}

const getWorkOrderId = (ID) => {
    try {
      return axios.get(`/work-order/${ID}`)
      .then(response => response.data?.data)    
    }
    catch(e){
      console.log(e)
    }
}

const getAllWorkOrderPdf = (type) => {
    try {
      return axios.get(`/work-order/report/`, { type: "CSV" })
      .then(response => response.data[0].workOrders)
    }
    catch(e){
      console.log(e)
    }
}

const getExcel = (data) => {
  try {
    return axios
      .get("/work-order-excel", { params: data })
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};

const removeExcel = (filenames) => {
  try {
    return axios
      .get("/remove-woexcel-file/" + filenames)
      .then((response) => response.data.data);
  } catch (e) {
    console.log(e);
  }
};
  const postworkOrderNew = (workOrder,assets) => {
    try {
      return axios.post('/work-order', {workOrder,assets})
      .then(response => {return response;});
    }
    catch(e){
      console.log(e)
    }
  };

const postworkOrderById = (ID,workOrder,assets) => {
  try {
    return axios.post(`/work-order/${ID}`, {workOrder,assets})
      .then(response => {       
        return response;
      }
    );
  }
  catch(e){
    console.log(e)
}
};

  // const postfilterWorkOrder = (values) => {

  //   return axios
  //     .post('/work-order/filter',  { filter: values })
  //     .then(response => {       
  //       return response.data.data?.workOrders;
  //       }
  //     );
  // };
  const deleteWorkOrder = (_id) => {
    return axios
      
      .post(`/work-order/${_id}` , {"workOrder": { "isActive": false }}
      
      )
      .then(response => {       
        return response;
        }
      );
  };

  const singleFileUpload = ( data ) => {

    try {
        return axios.post('/file-upload/workOrder', data, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
            })
        .then(response => console.log(response))
    }
    catch(e){
        console.log(e)
    }
}





const workOrderService = {
    getAllWorkOrder,
    getWorkOrderId,
    getAllWorkOrderPdf,
    postworkOrderNew,
    // postfilterWorkOrder,
    postworkOrderById,
    deleteWorkOrder,
    getExcel,
    removeExcel,
    singleFileUpload
    
}

export default workOrderService;