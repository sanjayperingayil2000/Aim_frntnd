import axios from '../axios';

const addLocation = ( location ) => {
    try {
        return axios.post('/location', {
            location:location
        })
        .then(response => response)
    }
    catch(e){
        console.log(e)
    }
};

const addLocationById = ( Id, location ) => {
    try {
        return axios
        .post(`/location/${Id}`, {"location": location })
        .then(response => response)
    }
    catch(e){
        console.log(e)
    }
}

const getLocation= (values) => {
    try {
        return axios.get('/assetLocator',{ params: values })
        .then(response =>  response.data
        )
    }
    catch(e){
        console.log(e)
    }
}

const locationService = {
    addLocation,
    addLocationById,
    getLocation
}

export default locationService;
