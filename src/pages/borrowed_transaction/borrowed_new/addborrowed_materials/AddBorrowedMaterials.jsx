import React, { useEffect, useRef, useState } from "react";
import { Flex, VStack } from "@chakra-ui/react";

import request from "../../../../services/ApiClient";
import { decodeUser } from "../../../../services/decode-user";

import { BorrowedInformation } from "../../BorrowedInformation";
import { ListOfBorrowed } from "../../ListOfBorrowed";
import { ActionButton } from "../../ActionButton";

const fetchRawMatsApi = async () => {
  const res = await request.get(`Borrowed/GetAvailableStocksForBorrowedIssueNoParameters`);
  return res.data;
};

const fetchBarcodeNoApi = async (itemCode) => {
  const res = await request.get(`Borrowed/GetAllAvailableStocksForBorrowedIsssue`, {
    params: {
      itemcode: itemCode,
    },
  });
  return res.data;
};

const currentUser = decodeUser();

const AddBorrowedMaterials = ({ borrowedData, fetchActiveBorrowed, borrowedNav, setBorrowedNav }) => {
  const [isLoading, setIsLoading] = useState(false);
   const [showOneChargingData, setShowChargingData] = useState(null);

  const customerRef = useRef();
  const remarksRef = useRef();

  const [customers, setCustomers] = useState([]);
  const [rawMats, setRawMats] = useState([]);
  const [barcodeNo, setBarcodeNo] = useState([]);

  const [totalQuantity, setTotalQuantity] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [selectorId, setSelectorId] = useState("");

  const [details, setDetails] = useState("");
  const [remarks, setRemarks] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [unitCost, setUnitCost] = useState("");

  const [employeeData, setEmployeeData] = useState([]);

  const [customerData, setCustomerData] = useState({
    customerCode: currentUser?.deparment,
    customerName: currentUser?.fullName,
  });

  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: "",
    itemDescription: "",
    uom: "",
    customerName: currentUser?.fullName,
    warehouseId: "",
    quantity: "",
  });

  const itemCode = rawMatsInfo.itemCode;

  //Raw Mats Fetching
  const fetchRawMats = () => {
    fetchRawMatsApi().then((res) => {
      setRawMats(res);
    });
  };

  useEffect(() => {
    fetchRawMats();

    return () => {
      setRawMats([]);
    };
  }, []);

  //Barcode (Warehouse ID)
  const fetchBarcodeNo = () => {
    fetchBarcodeNoApi(itemCode).then((res) => {
      setBarcodeNo(res);
      console.log(res);
    });
  };

  useEffect(() => {
    fetchBarcodeNo();

    return () => {
      setBarcodeNo([0]);
    };
  }, [itemCode, borrowedNav]);

  //Refetch on change navigation
  useEffect(() => {
    if (borrowedNav) {
      // fetchCustomers();
      fetchRawMats();
      fetchBarcodeNo();
    }
  }, [borrowedNav]);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between"></Flex>

      <VStack w="full" p={5} spacing={10} height={borrowedData?.length === 0 ? "90vh" : "auto"}>
        {borrowedNav === 1 ? (
          <>
            <BorrowedInformation
              barcodeNo={barcodeNo}
              rawMats={rawMats}
              rawMatsInfo={rawMatsInfo}
              setRawMatsInfo={setRawMatsInfo}
              details={details}
              setDetails={setDetails}
              warehouseId={warehouseId}
              setWarehouseId={setWarehouseId}
              customerData={customerData}
              remarks={remarks}
              transactionDate={transactionDate}
              setTransactionDate={setTransactionDate}
              unitCost={unitCost}
              setUnitCost={setUnitCost}
              employeeData={employeeData}
              setEmployeeData={setEmployeeData}
              fetchRawMats={fetchRawMats}
              fetchActiveBorrowed={fetchActiveBorrowed}
            />
            {borrowedData?.length > 0 ? (
              <>
                <ListOfBorrowed
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  setTotalQuantity={setTotalQuantity}
                  borrowedData={borrowedData}
                  fetchActiveBorrowed={fetchActiveBorrowed}
                  fetchRawMats={fetchRawMats}
                  fetchBarcodeNo={fetchBarcodeNo}
                  remarks={remarks}
                  unitCost={unitCost}
                />
                <ActionButton
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  totalQuantity={totalQuantity}
                  setTotalQuantity={setTotalQuantity}
                  customerData={customerData}
                  setCustomerData={setCustomerData}
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  borrowedData={borrowedData}
                  fetchActiveBorrowed={fetchActiveBorrowed}
                  fetchRawMats={fetchRawMats}
                  customerRef={customerRef}
                  details={details}
                  setDetails={setDetails}
                  setRawMatsInfo={setRawMatsInfo}
                  //warehouse Id
                  warehouseId={warehouseId}
                  fetchBarcodeNo={fetchBarcodeNo}
                  remarks={remarks}
                  setRemarks={setRemarks}
                  remarksRef={remarksRef}
                  transactionDate={transactionDate}
                  setTransactionDate={setTransactionDate}
                  employeeData={employeeData}
                  setEmployeeData={setEmployeeData}
                />
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default AddBorrowedMaterials;
