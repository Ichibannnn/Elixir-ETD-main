import React, { useState } from "react";
import { Button, ButtonGroup, Flex, useDisclosure } from "@chakra-ui/react";

import { AllCancelConfirmation, SaveConfirmation } from "./ActionModal";

export const ActionButton = ({
  coaData,
  isLoading,
  setIsLoading,
  totalQuantity,
  setTotalQuantity,
  customerData,
  setCustomerData,
  details,
  setDetails,
  setSelectorId,
  miscData,
  customerRef,
  setRawMatsInfo,
  warehouseId,
  fetchBarcodeNo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  fetchActiveMiscIssues,
  fetchRawMats,
}) => {
  const [hideButton, setHideButton] = useState(false);

  const { isOpen: isSave, onClose: closeSave, onOpen: openSave } = useDisclosure();
  const { isOpen: allIsCancel, onClose: allCloseCancel, onOpen: openAllCancel } = useDisclosure();

  const saveHandler = () => {
    setHideButton(true);
    openSave();
  };

  const cancelHandler = () => {
    openAllCancel();
  };

  return (
    <>
      <Flex w="full" justifyContent="end">
        <ButtonGroup size="xs">
          <Button onClick={saveHandler} isDisabled={miscData.length === 0 || isLoading || hideButton} isLoading={isLoading} colorScheme="blue" borderRadius="none" width="100px">
            Save
          </Button>

          <Button colorScheme="red" borderRadius="none" width="100px" px={3} onClick={cancelHandler}>
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
          details={details}
          setDetails={setDetails}
          customerData={customerData}
          setCustomerData={setCustomerData}
          miscData={miscData}
          warehouseId={warehouseId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setRawMatsInfo={setRawMatsInfo}
          setHideButton={setHideButton}
          remarks={remarks}
          remarksRef={remarksRef}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          fetchRawMats={fetchRawMats}
          coaData={coaData}
        />
      )}

      {allIsCancel && (
        <AllCancelConfirmation
          isOpen={allIsCancel}
          onClose={allCloseCancel}
          miscData={miscData}
          setSelectorId={setSelectorId}
          setHideButton={setHideButton}
          fetchRawMats={fetchRawMats}
          customerRef={customerRef}
          remarksRef={remarksRef}
          setDetails={setDetails}
          setTransactionDate={setTransactionDate}
          setCustomerData={setCustomerData}
          setRawMatsInfo={setRawMatsInfo}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          fetchBarcodeNo={fetchBarcodeNo}
          setRemarks={setRemarks}
        />
      )}
    </>
  );
};
