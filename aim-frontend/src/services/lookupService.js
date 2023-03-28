import axios from '../axios';

const getLookup = ( ) => {
    try {
        return axios.get('/lookupItems')
        .then(response => response.data.data
        )
    }
    catch(e){
        console.log(e)
    }
}

const getSubLookup = ( ) => {
    try {
        return axios.get('/lookupSubItems')
        .then(response =>  response.data
        )
    }
    catch(e){
        console.log(e)
    }
}

const lookupService = {
    getLookup,
    getSubLookup
}

export default lookupService;
