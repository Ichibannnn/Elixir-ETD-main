import React, { useState } from "react";
import { Button, ButtonGroup, Flex, useDisclosure } from "@chakra-ui/react";
import { AllCancelConfirmation, SaveConfirmation } from "./ActionModal";
// import { AllCancelConfirmation, SaveConfirmation } from './Action-Modal'

export const ActionButton = ({
  selectorId,
  setSelectorId,
  totalQuantity,
  customerData,
  setCustomerData,
  details,
  rawMatsInfo,
  warehouseId,
  borrowedData,
  setTotalQuantity,
  fetchActiveBorrowed,
  isLoading,
  setIsLoading,
  customerRef,
  setDetails,
  setRawMatsInfo,
  fetchBarcodeNo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  fetchRawMats,
}) => {
  const [hideButton, setHideButton] = useState(false);

  const {
    isOpen: isSave,
    onClose: closeSave,
    onOpen: openSave,
  } = useDisclosure();
  const saveHandler = () => {
    setHideButton(true);
    openSave();
  };

  const {
    isOpen: allIsCancel,
    onClose: allCloseCancel,
    onOpen: openAllCancel,
  } = useDisclosure();
  const cancelHandler = () => {
    openAllCancel();
  };

  return (
    <>
      <Flex w="full" justifyContent="end">
        <ButtonGroup size="xs">
          <Button
            onClick={saveHandler}
            disabled={borrowedData.length === 0 || isLoading || hideButton}
            isLoading={isLoading}
            colorScheme="blue"
            width="100px"
            borderRadius="none"
            px={5}
          >
            Save
          </Button>
          <Button
            colorScheme="red"
            px={3}
            onClick={cancelHandler}
            width="100px"
            borderRadius="none"
          >
            Cancel All
          </Button>
        </ButtonGroup>
      </Flex>

      {isSave && (
        <SaveConfirmation
          isOpen={isSave}
          onClose={closeSave}
          totalQuantity={totalQuantity}
          setTotalQuantity={setTotalQuantity}
          customerData={customerData}
          setCustomerData={setCustomerData}
          borrowedData={borrowedData}
          fetchActiveBorrowed={fetchActiveBorrowed}
          warehouseId={warehouseId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          customerRef={customerRef}
          details={details}
          setDetails={setDetails}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          setHideButton={setHideButton}
          remarks={remarks}
          setRemarks={setRemarks}
          remarksRef={remarksRef}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          fetchRawMats={fetchRawMats}
        />
      )}

      {allIsCancel && (
        <AllCancelConfirmation
          isOpen={allIsCancel}
          onClose={allCloseCancel}
          borrowedData={borrowedData}
          setSelectorId={setSelectorId}
          fetchActiveBorrowed={fetchActiveBorrowed}
          setHideButton={setHideButton}
          fetchBarcodeNo={fetchBarcodeNo}
          fetchRawMats={fetchRawMats}
          customerRef={customerRef}
          setDetails={setDetails}
          setTransactionDate={setTransactionDate}
          setCustomerData={setCustomerData}
          setRawMatsInfo={setRawMatsInfo}
        />
      )}
    </>
  );
};
