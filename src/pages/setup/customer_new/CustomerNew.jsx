import React, { useEffect, useState } from "react";
import axios from "axios";
import request from "../../../services/ApiClient";
import { ListOfCustomers } from "./ListOfCustomers";

const fetchGenusApi = async () => {
  const res = await axios.get(`http://genus-aio.rdfmis.ph/etd/backend/public/api/customer`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
    },
  });
  return res.data;
};

const fetchFistoDepartmentsApi = async () => {
  const res = await axios.get(`http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
    },
  });
  return res.data;
};

const fetchFistoLocationsApi = async () => {
  const res = await axios.get(`http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
    },
  });
  return res.data;
};

// FETCH API CUSTOMER:
const fetchElixirApi = async () => {
  const response = await request.get(`Customer/GetAllCustomerWithPagination/true?PageNumber=1&PageSize=10000`);

  return response.data;
};

const CustomerNew = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [genusCustomers, setGenusCustomers] = useState([]);
  const [fistoDepartments, setFistoDepartments] = useState([]);
  const [fistoLocations, setFistoLocations] = useState([]);
  const [elixirCustomers, setElixirCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchGenusCustomer = () => {
    fetchGenusApi().then((res) => {
      setGenusCustomers(res);
      setIsLoading(false);
    });

    fetchFistoDepartmentsApi().then((res) => {
      setFistoDepartments(res);
    });

    fetchFistoLocationsApi().then((res) => {
      setFistoLocations(res);
    });
  };

  useEffect(() => {
    fetchGenusCustomer();

    return () => {
      setGenusCustomers([]);
    };
  }, []);

  // GET ELIXIR SUPPLIERS
  const fetchElixirCustomers = () => {
    fetchElixirApi().then((res) => {
      setElixirCustomers(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchElixirCustomers();

    return () => {
      setElixirCustomers([]);
    };
  }, []);

  return <ListOfCustomers genusCustomers={genusCustomers} fetchingData={isLoading} elixirCustomers={elixirCustomers} fetchElixirCustomers={fetchElixirCustomers} />;
};

export default CustomerNew;
