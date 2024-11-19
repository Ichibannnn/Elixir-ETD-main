import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, HStack, VStack } from "@chakra-ui/react";

import request from "../../../services/ApiClient";
import { usePagination } from "@ajna/pagination";
import { FuelInformation } from "./FuelInformation";
import { ListOfFuels } from "./ListOfFuels";
import { ActionButton } from "./ActionButton";
import { ListOfViewFuel } from "../ViewTransactedTab/ListOfViewFuel";

const fetchBarcodeApi = async () => {
  const res = await request.get(`FuelRegister/material-available-item`);
  return res.data;
};

const FuelRequestV2 = ({ fuelData, setFuelData, fetchActiveFuelRequests, fuelNav, setFuelNav }) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [barcode, setBarcode] = useState([]);
  const [coaData, setCoaData] = useState([]);

  const [fuelInfo, setFuelInfo] = useState({
    warehouseId: "",
    item_Code: "DIESEL",
    item_Description: "DIESEL",
    soh: "",
    unit_Cost: "",
    liters: "",
    asset: "",
  });

  const [selectorId, setSelectorId] = useState("");
  const remarksRef = useRef();
  const odometerRef = useRef();

  const fetchBarcode = () => {
    fetchBarcodeApi().then((res) => {
      setBarcode(res);
    });
  };

  useEffect(() => {
    fetchBarcode();

    return () => {
      setBarcode([]);
    };
  }, []);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between"></Flex>

      <VStack w="full" p={5} spacing={10} height={fuelData?.length === 0 ? "90vh" : "auto"}>
        {fuelNav === 1 ? (
          <>
            <FuelInformation
              fuelInfo={fuelInfo}
              setFuelInfo={setFuelInfo}
              barcode={barcode}
              fetchActiveFuelRequests={fetchActiveFuelRequests}

              //   barcodeNo={barcodeNo}
              //   rawMats={rawMats}
              //   rawMatsInfo={rawMatsInfo}
              //   setRawMatsInfo={setRawMatsInfo}
              //   details={details}
              //   setDetails={setDetails}
              //   warehouseId={warehouseId}
              //   setWarehouseId={setWarehouseId}
              //   customerData={customerData}
              //   remarks={remarks}
              //   transactionDate={transactionDate}
              //   setTransactionDate={setTransactionDate}
              //   unitCost={unitCost}
              //   setUnitCost={setUnitCost}
              //   employeeData={employeeData}
              //   setEmployeeData={setEmployeeData}
              //   fetchRawMats={fetchRawMats}
              //   fetchActiveBorrowed={fetchActiveBorrowed}
            />
            {fuelData?.length > 0 ? (
              <>
                <ListOfFuels
                //   selectorId={selectorId}
                //   setSelectorId={setSelectorId}
                //   setTotalQuantity={setTotalQuantity}
                //   borrowedData={borrowedData}
                //   fetchActiveBorrowed={fetchActiveBorrowed}
                //   fetchRawMats={fetchRawMats}
                //   fetchBarcodeNo={fetchBarcodeNo}
                //   remarks={remarks}
                //   unitCost={unitCost}
                />
                <ActionButton
                //   setIsLoading={setIsLoading}
                //   isLoading={isLoading}
                //   totalQuantity={totalQuantity}
                //   setTotalQuantity={setTotalQuantity}
                //   customerData={customerData}
                //   setCustomerData={setCustomerData}
                //   selectorId={selectorId}
                //   setSelectorId={setSelectorId}
                //   borrowedData={borrowedData}
                //   fetchActiveBorrowed={fetchActiveBorrowed}
                //   fetchRawMats={fetchRawMats}
                //   customerRef={customerRef}
                //   details={details}
                //   setDetails={setDetails}
                //   setRawMatsInfo={setRawMatsInfo}

                //warehouse Id
                //   warehouseId={warehouseId}
                //   fetchBarcodeNo={fetchBarcodeNo}
                //   remarks={remarks}
                //   setRemarks={setRemarks}
                //   remarksRef={remarksRef}
                //   transactionDate={transactionDate}
                //   setTransactionDate={setTransactionDate}
                //   employeeData={employeeData}
                //   setEmployeeData={setEmployeeData}
                />
              </>
            ) : (
              ""
            )}
          </>
        ) : fuelNav === 2 ? (
          <>
            <ListOfViewFuel
            //   receiptData={receiptData}
            //   setCurrentPage={setCurrentPage}
            //   setPageSize={setPageSize}
            //   search={search}
            //   setSearch={setSearch}
            //   pagesCount={pagesCount}
            //   currentPage={currentPage}
            //   pages={pages}
            />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default FuelRequestV2;
