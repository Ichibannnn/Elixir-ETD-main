import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { saltKey } from "../saltkey";

const Redirect = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const rawData = query.get("data");

  useEffect(() => {
    try {
      const data = JSON.parse(decodeURIComponent(rawData));

      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), saltKey).toString();
      sessionStorage.setItem("userToken", ciphertext);
      sessionStorage.setItem("userDetails", JSON.stringify(data));
      navigate("/");
      window.location.reload(false);
    } catch (e) {
      console.log("Redirect Error: ", e);
      window.location.href = `https://one.rdfmis.com/`;
    }
  }, [rawData]);
  return;
};

export default Redirect;
