import React, { useEffect, useState } from "react";
import { ListOneCharging } from "./one_charging/ListOneCharging";
import request from "../../services/ApiClient";

// FETCH API ELIXIR API:
const fetchOneChargingApi = async () => {
  const response = await request.get(`Uom/GetAllUomWithPaginationOrig/true?PageNumber=1&PageSize=10000`);

  return response.data;
};

const OneCharging = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [oneChargingData, setOneChargingData] = useState([]);

  // GET ELIXIR UOM
  const fetchOneCharging = () => {
    fetchOneChargingApi().then((res) => {
      setOneChargingData(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchOneCharging();

    return () => {
      setOneChargingData([]);
    };
  }, []);

  return <ListOneCharging oneChargingData={oneChargingData} fetchingData={isLoading} />;
};

export default OneCharging;
