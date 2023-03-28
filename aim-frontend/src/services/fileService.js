import axios from '../axios';

const singleFileUpload = ( data ) => {
    try {
        return axios.post('/file-upload',  data, {
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

const fileUpload = ( data , type ) => {
    try {
        return axios.post('/file?fileOf='+type , data, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
        })
        .then(response => response)
    }
    catch(e){
        console.log(e)
    }
}

const fileService = {
    singleFileUpload,
    fileUpload
}

export default fileService;
