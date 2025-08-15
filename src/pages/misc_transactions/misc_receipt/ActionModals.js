import { useState } from "react";
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import { BsPatchQuestionFill } from "react-icons/bs";
import { FaExclamationTriangle } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";

import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";

const currentUser = decodeUser();

export const AddConfirmation = ({
  isOpen,
  onClose,
  closeAddModal,
  details,
  rawMatsInfo,
  setRawMatsInfo,
  setListDataTempo,
  setSelectorId,
  remarks,
  transactionDate,
  supplierData,
  chargingAccountTitle,
  chargingCoa,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const addItemHandler = () => {
    setIsLoading(true);
    const addToArray = {
      itemCode: rawMatsInfo.itemCode,
      itemDescription: rawMatsInfo.itemDescription,
      supplierName: rawMatsInfo.supplierName,
      supplierCode: supplierData.supplierCode,
      uom: rawMatsInfo.uom,
      quantity: rawMatsInfo.quantity,
      unitPrice: rawMatsInfo.unitPrice,
      description: details,
      remarks: remarks,
      transactionDate: transactionDate,

      // One Charging Code
      oneChargingCode: chargingCoa?.oneChargingCode?.value?.code,

      // Charging Account Title
      chargingAccountTitleCode: chargingAccountTitle?.accountId?.value?.accountCode,
      chargingAccountTitleName: chargingAccountTitle?.accountId?.value?.accountDescription,
      chargingEmpId: chargingAccountTitle?.empId?.value?.full_id_number,
      chargingFullName: chargingAccountTitle?.empId?.value?.full_name,
    };
    setListDataTempo((current) => [...current, addToArray]);
    setRawMatsInfo({
      itemCode: "",
      itemDescription: "",
      supplierName: rawMatsInfo.supplierName,
      uom: "",
      quantity: "",
      unitPrice: "",
    });
    setSelectorId("");
    setIsLoading(false);
    onClose();
    closeAddModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsPatchQuestionFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="lg">
            Are you sure you want to add this information?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button onClick={addItemHandler} isLoading={isLoading} colorScheme="blue" height="28px" width="100px" borderRadius="none" fontSize="xs">
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const SaveConfirmation = ({
  isOpen,
  onClose,
  listDataTempo,
  setListDataTempo,
  supplierData,
  setSupplierData,
  totalQuantity,
  setDetails,
  setRawMatsInfo,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  setShowChargingData,
  assetTag,
  setAssetTag,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const saveSubmitHandler = () => {
    const firstSubmit = {
      supplierCode: supplierData.supplierCode,
      supplier: supplierData.supplierName,
      totalQuantity: totalQuantity,
      details: listDataTempo[0]?.description,
      remarks: remarks,
      preparedBy: currentUser?.fullName,
      transactionDate: transactionDate,
      oneChargingCode: listDataTempo[0]?.oneChargingCode,
      addedBy: currentUser.fullName,
      assetTag: assetTag,
    };

    if (totalQuantity > 0) {
      setIsLoading(true);
      try {
        const res = request
          .post(`Miscellaneous/AddNewMiscellaneousReceipt`, firstSubmit)
          .then((res) => {
            const id = res.data.id;

            //SECOND POST IF MAY ID
            if (id) {
              const submitArray = listDataTempo.map((item) => {
                return {
                  miscellaneousReceiptId: id,
                  itemCode: item.itemCode,
                  itemDescription: item.itemDescription,
                  uom: item.uom,
                  supplier: item.supplierName,
                  actualGood: item.quantity,
                  unitPrice: item.unitPrice,
                  details: item.description,
                  remarks: item.remarks,
                  transactionDate: item.transactionDate,
                  unitPrice: item.unitPrice,
                  receivedBy: currentUser.userName,
                  accountCode: item.chargingAccountTitleCode,
                  accountTitles: item.chargingAccountTitleName,
                  empId: item.chargingEmpId,
                  fullName: item.chargingFullName,
                };
              });
              try {
                const res = request.post(`Miscellaneous/AddNewMiscellaneousReceiptInWarehouse`, submitArray);
                ToastComponent("Success", "Information saved", "success", toast);
                setListDataTempo([]);
                remarksRef.current.value = "";
                setShowChargingData(null);
                setTransactionDate("");
                setDetails("");
                setRemarks("");
                setSupplierData({
                  supplierName: "",
                });
                setRawMatsInfo({
                  itemCode: "",
                  itemDescription: "",
                  supplier: "",
                  uom: "",
                  quantity: "",
                  unitPrice: "",
                });
                setAssetTag("");
                setIsLoading(false);
                onClose();
              } catch (error) {
                console.log(error);
              }
              console.log("second submit: ", submitArray);
            }
          })
          .catch((err) => {
            ToastComponent("Error", "Information was not saved", "error", toast);
            setIsLoading(false);
          });
      } catch (error) {}
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent color="black" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDir="column">
            <FcInfo fontSize="90px" />
            <Text>Confirmation</Text>
          </Flex>
        </ModalHeader>

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to save this information?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button onClick={saveSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="blue" height="28px" width="100px" borderRadius="none" fontSize="xs">
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CancelConfirmation = ({ isOpen, onClose, rowIndex, setListDataTempo, listDataTempo }) => {
  const [isLoading, setIsLoading] = useState(false);

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    if (listDataTempo.length > 0) {
      const newArray = [...listDataTempo];
      if (rowIndex !== -1) {
        newArray.splice(rowIndex, 1);
        setListDataTempo(newArray);
        onClose();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bgColor="white" color="black" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDirection="center">
            <FaExclamationTriangle color="red" fontSize="90px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to cancel this information?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button onClick={cancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="red" height="28px" width="100px" borderRadius="none" fontSize="xs">
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
