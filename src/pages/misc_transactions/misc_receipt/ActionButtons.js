import React from "react";
import { Button, ButtonGroup, Flex, useDisclosure } from "@chakra-ui/react";
import { SaveConfirmation } from "./ActionModals";
import { CancelConfirmation } from "./ActionModals";
import { EditModal } from "./ActionModals";

export const ActionButtons = ({
  listDataTempo,
  setListDataTempo,
  selectorId,
  rowIndex,
  totalQuantity,
  supplierData,
  setSupplierData,
  supplierRef,
  setDetails,
  setRawMatsInfo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
}) => {
  const {
    isOpen: isEdit,
    onClose: closeEdit,
    onOpen: openEdit,
  } = useDisclosure();
  const editHandler = () => {
    openEdit();
  };

  const {
    isOpen: isSave,
    onClose: closeSave,
    onOpen: openSave,
  } = useDisclosure();
  const saveHandler = () => {
    openSave();
  };

  const {
    isOpen: isCancel,
    onClose: closeCancel,
    onOpen: openCancel,
  } = useDisclosure();
  const cancelHandler = () => {
    openCancel();
  };

  return (
    <>
      <Flex w="full" justifyContent="end">
        <ButtonGroup size="xs">
          {/* <Button colorScheme='yellow' color='white' px={5} disabled={!selectorId} onClick={editHandler}>Edit</Button> */}
          <Button
            colorScheme="blue"
            px={5}
            disabled={listDataTempo.length === 0}
            onClick={saveHandler}
            borderRadius="none"
            width="100px"
          >
            Save
          </Button>
          <Button
            // color="black"
            // variant="outline"
            colorScheme="red"
            px={3}
            isDisabled={!selectorId}
            onClick={cancelHandler}
            borderRadius="none"
            width="100px"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Flex>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          selectorId={selectorId}
          rowIndex={rowIndex}
          setListDataTempo={setListDataTempo}
          listDataTempo={listDataTempo}
        />
      )}

      {isSave && (
        <SaveConfirmation
          isOpen={isSave}
          onClose={closeSave}
          listDataTempo={listDataTempo}
          setListDataTempo={setListDataTempo}
          totalQuantity={totalQuantity}
          supplierData={supplierData}
          setSupplierData={setSupplierData}
          supplierRef={supplierRef}
          setDetails={setDetails}
          setRawMatsInfo={setRawMatsInfo}
          remarks={remarks}
          setRemarks={setRemarks}
          remarksRef={remarksRef}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
        />
      )}

      {isCancel && (
        <CancelConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          selectorId={selectorId}
          rowIndex={rowIndex}
          setListDataTempo={setListDataTempo}
          listDataTempo={listDataTempo}
        />
      )}
    </>
  );
};
