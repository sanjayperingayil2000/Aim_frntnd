import axios from '../axios';

const addEquipmentTag = ( asset ) => {
    try {
        return axios.post('/assets', {
            asset:asset
        })
        .then(response => response)
    }
    catch(e){
        console.log(e)
    }
};

const addEquipmentTagById = ( Id, asset ) => {
    try {
        return axios
        .post(`/assets/${Id}`, {"asset": asset })
        .then(response => response)
    }
    catch(e){
        console.log(e)
    }
}

const equipmentService = {
    addEquipmentTag,
    addEquipmentTagById
}

export default equipmentService;
