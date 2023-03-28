import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


const instance = axios.create( {
    baseURL:process.env.REACT_APP_BACKEND_BASE_URL
} );

const accessToken = localStorage.getItem("accessToken");

// if(accessToken!==null) 
//     console.log("*********************", JSON.parse(accessToken).value)

//Request interceptor
instance.interceptors.request.use( (req) => {
    
    if(accessToken!==null) 
    req.headers.authorization = `Bearer ${JSON.parse(accessToken).value}`;
    return req;
},
    (err) =>  {Promise.reject(err)

    return err 
},
);


instance.interceptors.response.use( (response) => {
    return response;
}, (error) => {
    console.log(error);
    if (error.response.data.status === 401 ) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    } else {
      return error;
    }
} );


export default instance;