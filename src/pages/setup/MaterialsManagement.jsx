import React, { useEffect, useState } from "react";
import request from "../../services/ApiClient";
import axios from "axios";
import { ListOfMaterials } from "./materials_sync/ListOfMaterials";
import { usePagination } from "@ajna/pagination";

const fetchGenusApi = async () => {
  const res = await axios.get(`http://genus-aio.rdfmis.ph/etd_v2/backend/public/api/elixir_material?pagination=none`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
      "api-key": "hello world!",
    },
  });
  return res.data;
};

// FETCH API ELIXIR API:
const fetchElixirApi = async (pageNumber, pageSize, search) => {
  const response = await request.get(`Material/GetAllMaterialWithPaginationOrig/true?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
    params: {
      search: search,
    },
  });

  return response.data;
};

const ItemCategory = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [genusMaterials, setGenusMaterials] = useState([]);
  const [elixirMaterials, setElixirMaterials] = useState([]);
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

  // GET GENUS SUPPLIERS
  const fetchGenusMaterials = () => {
    fetchGenusApi().then((res) => {
      setGenusMaterials(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchGenusMaterials();

    return () => {
      setGenusMaterials([]);
    };
  }, []);

  // GET ELIXIR SUPPLIERS
  const fetchElixirMaterials = () => {
    setIsLoading(true);
    fetchElixirApi(currentPage, pageSize, search).then((res) => {
      setElixirMaterials(res);
      setIsLoading(false);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchElixirMaterials();

    return () => {
      setElixirMaterials([]);
    };
  }, [currentPage, pageSize, search]);

  return (
    <ListOfMaterials
      fetchElixirMaterials={fetchElixirMaterials}
      elixirMaterials={elixirMaterials}
      genusMaterials={genusMaterials}
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

export default ItemCategory;
