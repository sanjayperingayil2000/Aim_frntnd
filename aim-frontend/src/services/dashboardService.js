import axios from '../axios';

const getAllinspectionOverview = (values) => {
    try {
        return axios.get('/inspectionOverview', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const getAllinspectionStatistics = (values) => {
    try {
        return axios.get('/inspectionStatistics', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const getAlldefectCoverage = (values) => {
    try {
        return axios.get('/defectCoverage', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const getAllRepairOverdue = (values) => {
    try {
        return axios.get('/repairOverview', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const getAllProVsPlan = (values) => {
    try {
        return axios.get('/projectPlanVsActual', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const getAllfailureTrend = (values) => {
    try {
        return axios.get('/failureTrendAnalysis', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const getAllassetConditionAnalysis = (values) => {
    try {
        return axios.get('/assetConditionAnalysis', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const getAllActivitiesoverdue = (values) => {
    try {
        return axios.get('/activitiesOverdue', { params: values })
            .then(response => response
        )
    }
    catch (e) {
        console.log(e)
    }
}

const dashboardService = {
    getAllinspectionOverview,
    getAllinspectionStatistics,
    getAllRepairOverdue,
    getAllProVsPlan,
    getAlldefectCoverage,
    getAllfailureTrend,
    getAllassetConditionAnalysis,
    getAllActivitiesoverdue
}

export default dashboardService;