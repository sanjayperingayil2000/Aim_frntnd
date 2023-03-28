import axios from "../axios";

const getAllUsers = (data) => {
  try {
    return axios
      .get("/users", { params: data })
      .then((response) => response.data[0]);
  } catch (e) {
    console.log(e);
  }
};

const postUserNew = (user, workOrders) => {
  try {
    return axios.post("/users", { user, workOrders }).then((response) => {
      return response;
    });
  } catch (e) {
    console.log(e);
  }
};

const UpdateToken = (ID, LimitToken) => {
  try {
    return axios.post(`limit-token/${ID}`, { LimitToken }).then((response) => {
      return response;
    });
  } catch (e) {
    console.log(e);
  }
};

const postUserById = (ID, user, workOrders) => {
  try {
    return axios.post(`/users/${ID}`, { user, workOrders }).then((response) => {
      return response;
    });
  } catch (error) {
    console.log(error, "service error");
  }
};

const deleteUser = (_id) => {
  return axios
    .post(`/user-delete/${_id}`)
    .then((response) => {
      return response;
    });
};

const deleteDevice = (_id) => {
  return axios.post(`/device-delete/${_id}`).then((response) => {
    return response;
  });
};


const getUserId = (ID) => {
  try {
    return axios.get(`/users/${ID}`).then((response) => response.data?.data);
  } catch (e) {
    console.log(e);
  }
};
const getLimitToken = () => {
  try {
    return axios.get(`limit-token`).then((response) => response?.data[0]);
  } catch (e) {
    console.log(e);
  }
};
const getDeviceList = () => {
  try {
    return axios.get(`device-management`).then((response) => response?.data[0]);
  } catch (e) {
    console.log(e);
  }
};

const updateDevice = (_id, DeviceMngmnt) => {
  try {
    return axios
      .post(`/device-management/${_id}`, { DeviceMngmnt })
      .then((response) => {
        return response;
      });
  } catch (e) {
    console.log(e);
  }
};

const updateEnv = (_id, EnvModel) => {
  try {
    return axios.post(`/env-setup/${_id}`, { EnvModel }).then((response) => {
      return response;
    });
  } catch (e) {
    console.log(e);
  }
};

const getEnvList = () => {
  try {
    return axios.get(`env-setup`).then((response) => response?.data[0]);
  } catch (e) {
    console.log(e);
  }
};

const userService = {
  getAllUsers,
  postUserNew,
  deleteUser,
  getUserId,
  postUserById,
  getLimitToken,
  UpdateToken,
  getDeviceList,
  deleteDevice,
  updateDevice,
  updateEnv,
  getEnvList,
};

export default userService;
