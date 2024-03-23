import Axios from "axios";

const updateLoggedUser = async (userID, BASE) => {
  const response = await Axios.post(`${BASE}/user/getUserById`, {
    id: userID,
  });
  sessionStorage.setItem("loggedUser", JSON.stringify(response));
};

export default updateLoggedUser;
