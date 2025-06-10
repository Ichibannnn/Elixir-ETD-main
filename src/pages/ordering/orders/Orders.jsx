import {} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import axios from "axios";
import moment from "moment";
import { ListOrders } from "./ListOrders";

const fetchGenusApi = async (fromDate, toDate) => {
  const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD");
  const toDateFormatted = moment(toDate).format("yyyy-MM-DD");
  const res = await axios.get(
    // `http://genus-aio.rdfmis.ph/etd/backend/public/api/elixir_order?paginate=0&page=1&row=10&status=all&from=${fromDateFormatted}&to=${toDateFormatted}`, // GENUS V1
    // `http://genus-aio.rdfmis.ph/etd_v2/backend/public/api/elixir_order?status=active&per_page=10&pagination=none`, // GENUS V2
    `http://10.10.12.14:8000/api/elixir_order?status=approved_elixir&per_page=10&pagination=none`,
    {
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
        API_KEY: `hello world!`,
      },
    }
  );
  return res.data;
};

const Orders = ({ fetchNotification }) => {
  const [isLoading, setIsLoading] = useState(true);

  //ORDERS
  const dateVar = new Date();
  const startDate = moment(dateVar).format("yyyy-MM-DD");
  const [genusOrders, setGenusOrders] = useState([]);
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(new Date());
  const [search, setSearch] = useState();

  // GET GENUS ORDERS
  const getGenusOrders = () => {
    fetchGenusApi(fromDate, toDate).then((res) => {
      setGenusOrders(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (fromDate && toDate) {
      getGenusOrders();
    }
    return () => {
      setGenusOrders([]);
    };
  }, [fromDate, toDate]);

  //LIST ORDERS
  return (
    <ListOrders
      genusOrders={genusOrders}
      setGenusOrders={setGenusOrders}
      search={search}
      setSearch={setSearch}
      fetchingData={isLoading}
      setFromDate={setFromDate}
      setToDate={setToDate}
      fromDate={fromDate}
      toDate={toDate}
      fetchNotification={fetchNotification}
    />
  );
};

export default Orders;
