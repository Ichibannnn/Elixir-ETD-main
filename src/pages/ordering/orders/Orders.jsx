import {} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { ListOrders } from "./ListOrders";
import axios from "axios";
import moment from "moment";

const fetchGenusApi = async (fromDate, toDate) => {
  const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD");
  const toDateFormatted = moment(toDate).format("yyyy-MM-DD");
  const res = await axios.get(
    `http://genus-aio.rdfmis.ph/etd_v2/backend/public/api/elixir_order?status=active&per_page=10&pagination=none&from=${fromDateFormatted}&to=${toDateFormatted}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
        "api-key": "hello world!",
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
