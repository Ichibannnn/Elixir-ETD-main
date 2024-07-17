import React, { useEffect, useState } from "react";
import { Flex, VStack } from "@chakra-ui/react";
import { usePagination } from "@ajna/pagination";
import request from "../../../services/ApiClient";
import { MrpTable } from "./MrpTable";

const fetchMRPApi = async (pageNumber, pageSize, search) => {
  const res = await request.get(`Inventory/GetAllItemForInventoryPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    params: {
      search: search,
    },
  });
  return res.data;
};

const fetchMRPForSheetApi = async (pageTotal) => {
  const res = await request.get(`Inventory/GetAllItemForInventoryPaginationOrig?pageNumber=1&pageSize=${pageTotal}&search=`);
  return res.data;
};

const MrpPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");

  const [mrpData, setMrpData] = useState([]);
  const [selectorId, setSelectorId] = useState("");
  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: "",
    itemDescription: "",
    soh: "",
    bufferLevel: "",
    averageIssuance: "",
    daysLevel: "",
    lastUsed: "",
  });

  const [sheetData, setSheetData] = useState([]);

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 50 },
  });

  const fetchMRP = () => {
    setIsLoading(true);
    fetchMRPApi(currentPage, pageSize, search).then((res) => {
      setMrpData(res);
      setIsLoading(false);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchMRP();

    return () => {
      setMrpData([]);
    };
  }, [currentPage, pageSize, search]);

  const fetchMRPForSheet = () => {
    fetchMRPForSheetApi(pageTotal).then((res) => {
      setSheetData(res.inventory);
    });
  };

  useEffect(() => {
    if (pageTotal) {
      fetchMRPForSheet();
    }

    return () => {
      setSheetData([]);
    };
  }, [pageTotal]);

  return (
    <Flex flexDirection="column" w="full" bg="form" p={4}>
      <VStack w="full" p={5} justifyContent="space-between" spacing={5}>
        <MrpTable
          mrpData={mrpData}
          fetchingData={isLoading}
          setSelectorId={setSelectorId}
          selectorId={selectorId}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          pagesCount={pagesCount}
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          search={search}
          setSearch={setSearch}
          pageTotal={pageTotal}
          sheetData={sheetData}
          mrpDataLength={mrpData?.inventory?.length}
        />
      </VStack>
    </Flex>
  );
};

export default MrpPage;
