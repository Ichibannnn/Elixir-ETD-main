import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { usePagination } from "@ajna/pagination";
import request from "../../../services/ApiClient";
import { MrpTable } from "./MrpTable";
import { MaterialsInformation } from "./MaterialsInformation";

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
  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");
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

  // const fetchMRP = (ignore) => {
  //   fetchMRPApi(currentPage, pageSize, search).then((res) => {
  //     if (!ignore) {
  //       setMrpData(res);
  //       // setSheetData(res.inventory);
  //       setPageTotal(res.totalCount);
  //       console.log("Page Total: ", res.totalCount);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   let ignore = false;

  //   fetchMRP(ignore);

  //   return () => {
  //     ignore = true;
  //     // setMrpData([]);
  //   };
  // }, [currentPage, pageSize, search]);

  const fetchMRP = (signal) => {
    fetchMRPApi(currentPage, pageSize, search, { signal })
      .then((res) => {
        setMrpData(res);
        setPageTotal(res.totalCount);
        console.log("Page Total: ", res.totalCount);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchMRP(signal);

    return () => {
      controller.abort();
    };
  }, [currentPage, pageSize, search]);

  // console.log(sheetData);

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

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  console.log("Search: ", search);

  return (
    <Flex flexDirection="column" w="full" bg="form" p={4}>
      <VStack w="full" p={5} justifyContent="space-between" spacing={5}>
        <MrpTable
          mrpData={mrpData}
          setSelectorId={setSelectorId}
          selectorId={selectorId}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          pagesCount={pagesCount}
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          pageTotal={pageTotal}
          sheetData={sheetData}
          mrpDataLength={mrpData?.inventory?.length}
        />
        {/* <MrpTable
          mrpData={mrpData}
          setSelectorId={setSelectorId}
          selectorId={selectorId}
          setRawMatsInfo={setRawMatsInfo}
          pagesCount={pagesCount}
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          pageTotal={pageTotal}
          sheetData={sheetData}
        />
        {selectorId ? (
          <MaterialsInformation
            mrpDataLength={mrpData?.inventory?.length}
            rawMatsInfo={rawMatsInfo}
          />
        ) : (
          <Flex w="full" justifyContent="center">
            <Text fontSize="xs" fontWeight="semibold">
              Total Records/page: {mrpData?.inventory?.length}
            </Text>
          </Flex>
        )} */}
      </VStack>
    </Flex>
  );
};

export default MrpPage;
