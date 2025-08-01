import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, HStack, VStack } from "@chakra-ui/react";

import request from "../../../services/ApiClient";
import { usePagination } from "@ajna/pagination";

import { MaterialsInformation } from "./MaterialsInformation";
import { ListOfReceipts } from "./ListOfReceipts";
import { ActionButtons } from "./ActionButtons";
import { ListViewReceipt } from "./viewReceipts/ListViewReceipt";
import useDebounce from "../../../hooks/useDebounce";

const fetchSuppliersApi = async () => {
  const res = await request.get(`Supplier/GetAllActiveSupplier`);
  return res.data;
};

// const fetchMaterialsApi = async () => {
//   const res = await request.get(`Material/GetAllActiveMaterials`);
//   return res.data;
// };

// New API

const fetchMaterialsApi = async () => {
  const res = await request.get(`Miscellaneous/MiscReceiptItemList`);
  return res.data;
};

const fetchUOMsApi = async () => {
  const res = await request.get(`Uom/GetAllActiveUoms`);
  return res.data;
};

//Receipts Viewing
const fetchReceiptsApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(`Miscellaneous/GetAllMiscellaneousReceiptPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}`);
  return res.data;
};

const fetchTransactApi = async () => {
  const res = await request.get(`TransactionType/GetAllActiveTransactionType`);
  return res.data;
};

const MiscReceiptPage = () => {
  const remarksRef = useRef();

  const [showOneChargingData, setShowChargingData] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [listDataTempo, setListDataTempo] = useState([]);

  const [totalQuantity, setTotalQuantity] = useState("");
  const [navigation, setNavigation] = useState("");
  const [selectorId, setSelectorId] = useState("");
  const [rowIndex, setRowIndex] = useState("");
  const [editableData, setEditableData] = useState({});

  const [transactionDate, setTransactionDate] = useState("");
  const [details, setDetails] = useState("");
  const [remarks, setRemarks] = useState("");

  const [supplierData, setSupplierData] = useState({
    supplierCode: "",
    supplierName: "",
  });

  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: "",
    itemDescription: "",
    supplierName: "",
    uom: "",
    quantity: "",
    unitPrice: "",
  });

  //Supplier Fetching
  const fetchSuppliers = () => {
    fetchSuppliersApi().then((res) => {
      setSuppliers(res);
    });
  };

  useEffect(() => {
    fetchSuppliers();

    return () => {
      setSuppliers([]);
    };
  }, []);

  //Raw Mats Fetching
  const fetchMaterials = () => {
    fetchMaterialsApi().then((res) => {
      setMaterials(res);
    });
  };

  useEffect(() => {
    fetchMaterials();

    return () => {
      setMaterials([]);
    };
  }, []);

  //UOM Fetching
  const fetchUOMs = () => {
    fetchUOMsApi().then((res) => {
      setUoms(res);
    });
  };

  useEffect(() => {
    fetchUOMs();

    return () => {
      setUoms([]);
    };
  }, []);

  // Fetch Transaction Type
  const fetchTransaction = () => {
    fetchTransactApi().then((res) => {
      setTransactionType(res);
    });
  };

  useEffect(() => {
    fetchTransaction();

    return () => {
      setTransactionType([]);
    };
  }, []);

  //Receipts Viewing
  const [receiptData, setReceiptData] = useState([]);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 700);

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  const fetchReceipts = () => {
    fetchReceiptsApi(currentPage, pageSize, search, status).then((res) => {
      setReceiptData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchReceipts();
  }, [status, pageSize, currentPage, search]);

  //Refetch on change navigation
  useEffect(() => {
    if (navigation) {
      fetchReceipts();
      fetchSuppliers();
      fetchMaterials();
      fetchUOMs();
    }
  }, [navigation]);

  //When navigating view receipt
  useEffect(() => {
    if (navigation === 2) {
      setSupplierData({
        supplierCode: "",
        supplierName: "",
      });
      setTransactionDate("");
      setDetails("");
      setListDataTempo([]);
    }
  }, [navigation]);

  // console.log("ListTempo", listDataTempo);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            bgColor={navigation === 1 ? "primary" : ""}
            color={navigation === 1 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(1)}
          >
            Add Receipt
          </Button>
          <Button
            bgColor={navigation === 2 ? "primary" : ""}
            color={navigation === 2 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(2)}
          >
            View Receipts
          </Button>
        </HStack>
      </Flex>

      <VStack h={listDataTempo === 0 ? "87vh" : "auto"} w="full" p={6} bg="form">
        {navigation === 1 ? (
          <>
            <MaterialsInformation
              rawMatsInfo={rawMatsInfo}
              setRawMatsInfo={setRawMatsInfo}
              details={details}
              setDetails={setDetails}
              setListDataTempo={setListDataTempo}
              suppliers={suppliers}
              materials={materials}
              setSelectorId={setSelectorId}
              supplierData={supplierData}
              setSupplierData={setSupplierData}
              remarks={remarks}
              setRemarks={setRemarks}
              remarksRef={remarksRef}
              transactionType={transactionType}
              transactionDate={transactionDate}
              setTransactionDate={setTransactionDate}
              showOneChargingData={showOneChargingData}
              setShowChargingData={setShowChargingData}
              //For resetting the misc receipt section~~~
              navigation={navigation}
            />
            {listDataTempo.length > 0 ? (
              <>
                <ListOfReceipts
                  listDataTempo={listDataTempo}
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  setEditableData={setEditableData}
                  setRowIndex={setRowIndex}
                  setTotalQuantity={setTotalQuantity}
                />
                <ActionButtons
                  listDataTempo={listDataTempo}
                  setListDataTempo={setListDataTempo}
                  totalQuantity={totalQuantity}
                  supplierData={supplierData}
                  setSupplierData={setSupplierData}
                  selectorId={selectorId}
                  setDetails={setDetails}
                  setRawMatsInfo={setRawMatsInfo}
                  setShowChargingData={setShowChargingData}
                  //cancel key
                  rowIndex={rowIndex}
                  remarks={remarks}
                  setRemarks={setRemarks}
                  remarksRef={remarksRef}
                  transactionDate={transactionDate}
                  setTransactionDate={setTransactionDate}
                />
              </>
            ) : (
              ""
            )}
          </>
        ) : navigation === 2 ? (
          <>
            <ListViewReceipt
              receiptData={receiptData}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              pagesCount={pagesCount}
              currentPage={currentPage}
              pages={pages}
            />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default MiscReceiptPage;
