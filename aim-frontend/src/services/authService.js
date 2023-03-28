import axios from '../axios';

//AUTH SERVICE
const login = (username, password, expresTime) => {
  try{
      return axios
      .post('/login', {
        username,
        password
      })
      .then(response => {
        
        if(response.data.accessToken) {
            const item = {
              value: response.data.accessToken,
              expiry: expresTime,
          }
          if (response.data.user.userRole !="normal-user"){

          localStorage.setItem("user",JSON.stringify(response.data.user));
          localStorage.setItem("accessToken",JSON.stringify(item));
          //localStorage.setItem("accessToken",response.data.accessToken);
          localStorage.setItem("refreshToken",JSON.stringify(response.data.refreshToken));

          }
        }
        return response.data;
      });
  }
  catch(e){
    console.log(e)
  }
};

const logout = ( ) => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const resetPassword = (email) => {
  try {
    return axios
      .post('/forgotPassword', {
        email
      })
      .then(response => {
        return response;
      });
  }
  catch(e){
      console.log(e)
  }
};

const updatePassword = (token, password) => {
  try {
    return axios
      .post('/updatePassword', {
        token,
        password
      })
      .then(response => {
        return response;
      });
  }
  catch(e){
      console.log(e)
  }
};

const resetTokenCheck = (token) => {
  try {
    return axios
      .get('/resetTokenCheck?token='+token )
      .then(response => {
        return response;
      });
      }
  catch(e){
      console.log(e)
  }
};


const authService = {
    login,
    logout,
    resetPassword,
    updatePassword,
    resetTokenCheck
};

export default authService;