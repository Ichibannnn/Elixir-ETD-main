import axios from "axios";
import { decodeUser } from "./decode-user";

const user = decodeUser();

// Set config defaults when creating the instance
const request = axios.create({
  baseURL: "https://localhost:7151/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  },
});

export default request;

//LIVE
// Set config defaults when creating the instance
// const request = axios.create({
//   baseURL: "http://10.10.2.31:72/api/",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + user?.token,
//   },
// });

// export default request;

// PRE_TEST
// const request = axios.create({
//   baseURL: "https://pretest-api.elixir-etd.rdfmis.com/api/",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + user?.token,
//   },
// });

// export default request;

// Sir Vince Backend
// const request = axios.create({
//   baseURL: "https://10.10.13.5:5001/api/",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + user?.token,
//   },
// });

// export default request;
