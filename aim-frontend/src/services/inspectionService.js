import axios from '../axios';

const getAllInspectionReport = (type) => {
    try {
        return axios.get(`/assets/report/`, { params: { type: type } })
        .then(response => response.data[0].workOrders)
    }
    catch(e){
        console.log(e)
    }
};

const getInspectionReferenceNum = ( locationId ) => {
    try {
        return axios.post(`/inspectionReference`,  
            {locationId: locationId}
        )
        .then(response => response.data )
    }
    catch(e){
        console.log(e)
    }
}

const getAllInspectionList = (values) => {
 
    try {
        return axios.get(`/inspectionChecklist`, { params: values })
        .then(response =>  response?.data
        )
    }
    catch(e){
        console.log(e)
    }
}

const inspectionService = {
    getAllInspectionReport,
    getAllInspectionList,
    getInspectionReferenceNum
}

export default inspectionService;