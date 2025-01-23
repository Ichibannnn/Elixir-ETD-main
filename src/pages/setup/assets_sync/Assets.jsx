import React, { useEffect, useState } from "react";
import request from "../../../services/ApiClient";
import axios from "axios";
import { ListOfAssets } from "./ListOfAssets";
import { usePagination } from "@ajna/pagination";

const fetchGenusApi = async () => {
  const res = await axios.get(`http://genus-aio.rdfmis.ph/fa/backend/public/api/material?paginate=0&status=etd_asset&rows=10&page=1`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_GENUS_FE_PROD_TOKEN,
    },
  });
  return res.data;
};

// FETCH API ELIXIR API:
const fetchElixirApi = async (pageNumber, pageSize, status, search) => {
  const response = await request.get(`asset/page?PageNumber=${pageNumber}&PageSize=${pageSize}&Archived=${status}`, {
    params: {
      Search: search,
    },
  });

  return response.data;
};

const Assets = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [genusAssets, setGenusAssets] = useState([]);
  const [elixirAssets, setElixirAssets] = useState([]);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 100 },
  });

  // GET GENUS ASSETS
  const fetchGenusAssets = () => {
    fetchGenusApi().then((res) => {
      setGenusAssets(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchGenusAssets();

    return () => {
      setGenusAssets([]);
    };
  }, []);

  // GET ELIXIR ASSETS
  const fetchElixirAssets = () => {
    setIsLoading(true);
    fetchElixirApi(currentPage, pageSize, status, search).then((res) => {
      setElixirAssets(res);
      setIsLoading(false);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchElixirAssets();

    return () => {
      setElixirAssets([]);
    };
  }, [currentPage, pageSize, status, search]);

  return (
    <ListOfAssets
      fetchElixirAssets={fetchElixirAssets}
      elixirAssets={elixirAssets}
      genusAssets={genusAssets}
      fetchingData={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      pagesCount={pagesCount}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pages={pages}
      search={search}
      setSearch={setSearch}
      status={status}
      setStatus={setStatus}
    />
  );
};

export default Assets;
