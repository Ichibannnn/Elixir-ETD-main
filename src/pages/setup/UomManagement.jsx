import React, { useEffect, useState } from "react";
import axios from "axios";
import request from "../../services/ApiClient";
import { ListOfUom } from "./uom_sync/ListOfUom";

const fetchGenusApi = async () => {
  const res = await axios.get(`http://genus-aio.rdfmis.ph/etd_v2/backend/public/api/elixir_uom?pagination=none`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
      "api-key": "hello world!",
    },
  });
  return res.data;
};

// FETCH API ELIXIR API:
const fetchElixirApi = async () => {
  const response = await request.get(`Uom/GetAllUomWithPaginationOrig/true?PageNumber=1&PageSize=10000`);

  return response.data;
};

const UomManagement = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [genusUom, setGenusUom] = useState([]);
  const [elixirUom, setElixirUom] = useState([]);

  // GET GENUS SUPPLIERS
  const fetchGenusUom = () => {
    fetchGenusApi().then((res) => {
      setGenusUom(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchGenusUom();

    return () => {
      setGenusUom([]);
    };
  }, []);

  // GET ELIXIR UOM
  const fetchElixirUom = () => {
    fetchElixirApi().then((res) => {
      setElixirUom(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchElixirUom();

    return () => {
      setElixirUom([]);
    };
  }, []);

  return <ListOfUom genusUom={genusUom} fetchElixirUom={fetchElixirUom} elixirUom={elixirUom} fetchingData={isLoading} />;
};

export default UomManagement;
