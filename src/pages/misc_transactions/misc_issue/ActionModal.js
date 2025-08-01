import { useEffect, useState } from "react";
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import { FcInfo } from "react-icons/fc";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";
import { BsPatchQuestionFill } from "react-icons/bs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaExclamationTriangle } from "react-icons/fa";

const currentUser = decodeUser();

export const AddConfirmation = ({
  isOpen,
  onClose,
  closeAddModal,
  details,
  rawMatsInfo,
  setRawMatsInfo,
  warehouseId,
  setWarehouseId,
  customerData,
  remarks,
  transactionDate,
  unitCost,
  setUnitCost,
  chargingAccountTitle,
  chargingCoa,
  setCoaData,
  fetchActiveMiscIssues,
  fetchRawMats,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const addSubmit = {
        warehouseId: warehouseId,
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        uom: rawMatsInfo.uom,
        unitCost: unitCost,
        customer: rawMatsInfo.customerName,
        customerCode: customerData.customerCode,
        quantity: rawMatsInfo.quantity,
        remarks: remarks,
        details: details,
        transactionDate: transactionDate,
        preparedBy: currentUser.fullName,

        //One Charging Code
        oneChargingCode: chargingCoa?.oneChargingCode?.value?.code,

        // Account Title
        accountCode: chargingAccountTitle?.accountId?.value?.accountCode,
        accountTitles: chargingAccountTitle?.accountId?.value?.accountDescription,
        empId: chargingAccountTitle?.empId?.value?.full_id_number,
        fullName: chargingAccountTitle?.empId?.value?.full_name,
      };
      setCoaData((current) => [...current, addSubmit]);
      const res = request
        .post(`Miscellaneous/AddNewMiscellaneousIssueDetails`, addSubmit)
        .then((res) => {
          ToastComponent("Success", "Item added", "success", toast);
          setRawMatsInfo({
            itemCode: "",
            itemDescription: "",
            customerName: rawMatsInfo.customerName,
            uom: "",
            warehouseId: "",
            quantity: "",
          });
          setWarehouseId("");
          fetchRawMats();
          setUnitCost("");
          setIsLoading(false);
          fetchActiveMiscIssues();
          onClose();
          closeAddModal();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not added", "error", toast);
        });
    } catch (error) {}
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
            <Button size="sm" onClick={submitHandler} isLoading={isLoading} colorScheme="blue" height="28px" width="100px" borderRadius="none" fontSize="xs">
              Yes
            </Button>
            <Button size="sm" onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CancelConfirmation = ({ isOpen, onClose, selectorId, setSelectorId, fetchActiveMiscIssues, fetchBarcodeNo, fetchRawMats }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, [{ id: selectorId }])
        .then((res) => {
          ToastComponent("Success", "Item has been cancelled", "success", toast);
          fetchActiveMiscIssues();
          fetchRawMats();
          fetchBarcodeNo();
          setIsLoading(false);
          setSelectorId("");
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDirection="center">
            <FaExclamationTriangle color="red" fontSize="90px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            {`Are you sure you want to cancel ID number ${selectorId}?`}
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="sm"
              onClick={cancelSubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="red"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
              Yes
            </Button>
            <Button size="sm" onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    orderId: yup.string(),
    companyId: yup.object().required().typeError("Company Name is required"),
    departmentId: yup.object().required().typeError("Department Category is required"),
    locationId: yup.object().required().typeError("Location Name is required"),
    accountId: yup.object().required().typeError("Account Name is required"),
    empId: yup.object().nullable(),
    fullName: yup.string(),
  }),
});

export const SaveConfirmation = ({
  isOpen,
  onClose,
  totalQuantity,
  setTotalQuantity,
  details,
  setDetails,
  customerData,
  setCustomerData,
  miscData,
  isLoading,
  setIsLoading,
  setRawMatsInfo,
  setHideButton,
  remarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  fetchActiveMiscIssues,
  fetchRawMats,
  coaData,
  setShowChargingData,
}) => {
  const toast = useToast();
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [pickerItems, setPickerItems] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://rdfsedar.com/api/data/employee/filter/active", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_SEDAR_TOKEN,
        },
      });
      setPickerItems(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // FETCH ACcount API```````
  const fetchAccountApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setAccount(res.data.result.account_titles);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAccountApi();
  }, []);

  const {
    formState: {},
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        accountId: "",
        empId: "",
        fullName: "",
        addedBy: currentUser.fullName,
        customerData: {
          customerCode: "",
        },
      },
    },
  });

  const saveSubmitHandler = () => {
    if (totalQuantity > 0) {
      setIsLoading(true);
      try {
        const res = request
          .post(`Miscellaneous/AddNewMiscellaneousIssue`, {
            customercode: customerData.customerCode,
            customer: customerData.customerName,
            totalQuantity: totalQuantity,
            preparedBy: currentUser.fullName,
            remarks: remarks,
            details: details,
            transactionDate: transactionDate,
            oneChargingCode: coaData[0]?.oneChargingCode,
            addedBy: currentUser.fullName,
          })
          .then((res) => {
            const issuePKey = res.data.id;

            //SECOND Update IF MAY ID
            if (issuePKey) {
              const arrayofId = miscData?.map((item) => {
                return {
                  issuePKey: issuePKey,
                  id: item.id,
                };
              });

              try {
                const res = request.put(`Miscellaneous/UpdateMiscellaneousIssuePKey`, arrayofId).then((res) => {
                  fetchActiveMiscIssues();
                  ToastComponent("Success", "Information saved", "success", toast);
                  onClose();
                  fetchRawMats();
                  setCustomerData({
                    customerCode: "",
                    customerName: "",
                  });
                  setTotalQuantity("");
                  setTransactionDate("");
                  setShowChargingData(null);
                  remarksRef.current.value = "";
                  setDetails("");
                  setRawMatsInfo({
                    itemCode: "",
                    itemDescription: "",
                    customerName: "",
                    uom: "",
                    quantity: "",
                  });
                  setIsLoading(false);
                  setHideButton(false);
                });
              } catch (error) {}
            }
          })
          .catch((err) => {
            ToastComponent("Error", "Information was not saved", "error", toast);
            setIsLoading(false);
          });
      } catch (error) {}
      setIsLoading(false);
    }
  };

  const closeHandler = () => {
    setHideButton(false);
    onClose();
  };

  const triggerPointHandler = (event) => {
    const selectAccountTitle = account?.find((item) => {
      return item.id === parseInt(event);
    });

    if (!selectedAccount?.name?.match(/Advances to Employees/gi)) {
      setIdNumber("");
      setValue("formData.empId", "");
      setValue("formData.fullName", "");
    }
    setSelectedAccount(selectAccountTitle?.name);
  };

  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();

  useEffect(() => {
    setInfo(
      pickerItems
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name.toLowerCase().includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
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
            <Button
              size="sm"
              onClick={saveSubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
              Yes
            </Button>
            <Button size="sm" onClick={closeHandler} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const AllCancelConfirmation = ({
  isOpen,
  onClose,
  miscData,
  setSelectorId,
  fetchActiveMiscIssues,
  setHideButton,
  fetchBarcodeNo,
  fetchRawMats,
  customerRef,
  setDetails,
  setTransactionDate,
  setCustomerData,
  setRawMatsInfo,
  remarksRef,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const allCancelSubmitHandler = () => {
    setIsLoading(true);

    const allId = miscData.map((item) => {
      return {
        id: item.id,
      };
    });

    try {
      const res = request
        .put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, allId)
        .then((res) => {
          ToastComponent("Success", "Items has been cancelled", "success", toast);
          fetchActiveMiscIssues();
          fetchRawMats();
          setTransactionDate("");
          setDetails("");
          setCustomerData({
            customerName: "",
          });
          setRawMatsInfo({
            itemCode: "",
            itemDescription: "",
            supplier: "",
            uom: "",
            quantity: "",
          });
          remarksRef.current.value = "";
          fetchBarcodeNo();
          setSelectorId("");
          setHideButton(false);
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent color="black" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDirection="center">
            <FaExclamationTriangle color="red" fontSize="90px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to cancel all items in the list?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button onClick={allCancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="red" height="28px" width="100px" borderRadius="none" fontSize="xs">
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
