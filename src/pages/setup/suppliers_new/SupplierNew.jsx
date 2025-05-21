import React, { useEffect, useState } from "react";
import request from "../../../services/ApiClient";

import axios from "axios";
import { ListOfSuppliers } from "./ListOfSuppliers";
import { usePagination } from "@ajna/pagination";

const fetchFistoApi = async () => {
  const res = await axios.get(`http://10.10.2.76:8000/api/dropdown/suppliers?paginate=0&status=1&api_for=vladimir`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
    },
  });
  return res.data;
};

// FETCH API ELIXIR API:
const fetchElixirApi = async (pageNumber, pageSize, search) => {
  const response = await request.get(`Supplier/GetAllSupplierithPaginationOrig/true?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`);

  return response.data;
};

const SupplierNew = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [fistoSuppliers, setFistoSuppliers] = useState([]);
  const [elixirSuppliers, setElixirSuppliers] = useState([]);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");

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

  // GET FISTO SUPPLIERS
  const fetchFistoSuppliers = () => {
    fetchFistoApi().then((res) => {
      setFistoSuppliers(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchFistoSuppliers();

    return () => {
      setFistoSuppliers([]);
    };
  }, []);

  // GET ELIXIR SUPPLIERS
  const fetchElixirSuppliers = () => {
    setIsLoading(true);
    fetchElixirApi(currentPage, pageSize, search).then((res) => {
      setElixirSuppliers(res);
      setIsLoading(false);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchElixirSuppliers();
    return () => {
      setElixirSuppliers([]);
    };
  }, [currentPage, pageSize, search]);

  return (
    <ListOfSuppliers
      fetchElixirSuppliers={fetchElixirSuppliers}
      elixirSuppliers={elixirSuppliers}
      fistoSuppliers={fistoSuppliers}
      fetchingData={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      pagesCount={pagesCount}
      setPageSize={setPageSize}
      pages={pages}
      search={search}
      setSearch={setSearch}
    />
  );
};

export default SupplierNew;
