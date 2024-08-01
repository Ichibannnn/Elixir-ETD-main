import React from "react";
import { Button, ButtonGroup, Flex, useDisclosure } from "@chakra-ui/react";
import { SaveConfirmation } from "./ActionModals";
import { CancelConfirmation } from "./ActionModals";

export const ActionButtons = ({
  listDataTempo,
  setListDataTempo,
  totalQuantity,
  supplierData,
  setSupplierData,
  selectorId,
  rowIndex,
  setDetails,
  setRawMatsInfo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
}) => {
  const { isOpen: isSave, onClose: closeSave, onOpen: openSave } = useDisclosure();
  const saveHandler = () => {
    openSave();
  };

  const { isOpen: isCancel, onClose: closeCancel, onOpen: openCancel } = useDisclosure();
  const cancelHandler = () => {
    openCancel();
  };

  return (
    <>
      <Flex w="full" justifyContent="end">
        <ButtonGroup size="xs">
          <Button colorScheme="blue" px={5} disabled={listDataTempo.length === 0} onClick={saveHandler} borderRadius="none" width="100px">
            Save
          </Button>

          <Button colorScheme="red" px={3} isDisabled={!selectorId} onClick={cancelHandler} borderRadius="none" width="100px">
            Cancel
          </Button>
        </ButtonGroup>
      </Flex>

      {isSave && (
        <SaveConfirmation
          isOpen={isSave}
          onClose={closeSave}
          listDataTempo={listDataTempo}
          setListDataTempo={setListDataTempo}
          supplierData={supplierData}
          setSupplierData={setSupplierData}
          totalQuantity={totalQuantity}
          setDetails={setDetails}
          setRawMatsInfo={setRawMatsInfo}
          remarks={remarks}
          setRemarks={setRemarks}
          remarksRef={remarksRef}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
        />
      )}

      {isCancel && <CancelConfirmation isOpen={isCancel} onClose={closeCancel} rowIndex={rowIndex} setListDataTempo={setListDataTempo} listDataTempo={listDataTempo} />}
    </>
  );
};
