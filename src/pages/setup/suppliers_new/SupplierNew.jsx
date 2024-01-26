import React, { useEffect, useState } from "react";
import request from "../../../services/ApiClient";

import axios from "axios";
import { ListOfSuppliers } from "./ListOfSuppliers";
import { usePagination } from "@ajna/pagination";

const fetchGenusApi = async () => {
  // const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD");
  // const toDateFormatted = moment(toDate).format("yyyy-MM-DD");
  const res = await axios.get(
    `http://10.10.2.76:8000/api/dropdown/suppliers?status=1&paginate=0&api_for=vladimir`,
    {
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
      },
    }
  );
  return res.data;
};

// FETCH API ELIXIR API:
const fetchElixirApi = async (pageNumber, pageSize, search) => {
  const response = await request.get(
    `Supplier/GetAllSupplierithPaginationOrig/true?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
  );

  return response.data;
};

const SupplierNew = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [genusSupplier, setGenusSupplier] = useState([]);
  const [elixirSuppliers, setElixirSuppliers] = useState([]);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 100 },
  });

  // GET GENUS SUPPLIERS
  const fetchGenusSuppliers = () => {
    fetchGenusApi().then((res) => {
      setGenusSupplier(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchGenusSuppliers();

    return () => {
      setGenusSupplier([]);
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

  // console.log(elixirSuppliers);

  return (
    <ListOfSuppliers
      fetchElixirSuppliers={fetchElixirSuppliers}
      elixirSuppliers={elixirSuppliers}
      setElixirSuppliers={setElixirSuppliers}
      genusSupplier={genusSupplier}
      setGenusSupplier={setGenusSupplier}
      fetchingData={isLoading}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      pagesCount={pagesCount}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pages={pages}
      search={search}
      setSearch={setSearch}
    />
  );
};

export default SupplierNew;
