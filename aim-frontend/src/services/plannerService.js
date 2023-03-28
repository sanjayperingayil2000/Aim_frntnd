import axios from '../axios';

const getAllPlans = (year,category) => {
  let data = {
    year,
    category
  }
    try {
        return axios.get(`/planners`,  { params: data })
        .then(response =>
        response.data[0]?.plans?.[0])       
    }
    catch(e){
        console.log(e)
    }
}

const postPlans = (planners) => {
    try {
    return axios.post('/planners', {planners})
      .then(response => {return response;});
    }
    catch(e){
      console.log(e)
    }
};

const postPlansId = (ID,planners) => {
    try {
      return axios.post(`/plannersById/${ID}`, {planners})
      .then(response => {return response;});
    }
    catch(e){
      console.log(e)
    }
};

const plannerService={
    getAllPlans,
    postPlans,
    postPlansId
}

export default plannerService;