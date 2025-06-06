import React, { useEffect, useState } from "react";
import { Flex, VStack } from "@chakra-ui/react";
import { usePagination } from "@ajna/pagination";
import request from "../../../services/ApiClient";
import { MrpTable } from "./MrpTable";
import useDebounce from "../../../hooks/useDebounce";

const fetchMRPApi = async (pageNumber, pageSize, search) => {
  const res = await request.get(`Inventory/GetAllItemForInventoryPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    params: {
      search: search,
    },
  });

  return res.data;
};

const fetchMRPForSheetApi = async (pageTotalSheet) => {
  const res = await request.get(`Inventory/GetAllItemForInventoryPaginationOrig?pageNumber=1&pageSize=${pageTotalSheet}`);
  return res.data;
};

// const fetchMRPApi = async (pageNumber, pageSize, search) => {
//   const res = await request.get(`Inventory/GetMRP?PageNumber=${pageNumber}&a=${pageSize}`, {
//     params: {
//       search: search,
//     },
//   });

//   return res.data;
// };

// const fetchMRPForSheetApi = async (pageTotalSheet) => {
//   const res = await request.get(`Inventory/GetMRP?PageNumber=1&PageSize=${pageTotalSheet}`);
//   return res.data;
// };

const MrpPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [pageTotalSheet, setPageTotalSheet] = useState(100000);

  const [mrpData, setMrpData] = useState([]);
  const [printMRPData, setPrintMrpData] = useState([]);
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

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 700);

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
    fetchMRPForSheetApi(pageTotalSheet).then((res) => {
      setSheetData(
        res.inventory?.map((item) => {
          return {
            ID: item.id,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            "Item Category": item.itemCategory,
            "Unit Cost": item.unitCost,
            "Total Inventory Cost": item.totalCost,
            SOH: item.soh,
            "Prepared Quantity": item.preparedQuantity,
            Reserve: item.reserve,
            "Buffer Level": item.bufferLevel,
            Receive: item.receiveIn,
            "Miscellaneous Receipt": item.receiptIn,
            "Move Order": item.moveOrderOut,
            "Miscellaneous Issue": item.issueOut,
            Borrowed: item.borrowedOut,
            Returned: item.returnedBorrowed,
            Consumed: item.borrowConsume,
            "Suggested PO": item.suggestedPo,
            "Reserve Usage": item.reserveUsage,
            // "Average Issuance": item.averageIssuance,
            // "Days Level": item.daysLevel,
          };
        })
      );
      setPrintMrpData(res.inventory);
    });
  };

  useEffect(() => {
    if (pageTotalSheet) {
      fetchMRPForSheet();
    }

    return () => {
      setSheetData([]);
    };
  }, [pageTotalSheet]);

  useEffect(() => {
    if (sheetData?.length > 0) {
      setLoadingExport(false);
    } else {
      setLoadingExport(true);
    }
  }, [sheetData]);

  return (
    <Flex flexDirection="column" w="full" bg="form" p={4}>
      <VStack w="full" p={5} justifyContent="space-between" spacing={5}>
        <MrpTable
          mrpData={mrpData}
          printMRPData={printMRPData}
          fetchingData={isLoading}
          loadingExport={loadingExport}
          setSelectorId={setSelectorId}
          selectorId={selectorId}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          pagesCount={pagesCount}
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          pageTotal={pageTotal}
          pageTotalSheet={pageTotalSheet}
          sheetData={sheetData}
          mrpDataLength={mrpData?.inventory?.length}
        />
      </VStack>
    </Flex>
  );
};

export default MrpPage;
