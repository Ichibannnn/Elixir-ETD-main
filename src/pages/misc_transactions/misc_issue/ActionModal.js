import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  toast,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FcAbout, FcInfo } from "react-icons/fc";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";
import { BsPatchQuestionFill } from "react-icons/bs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Select as AutoComplete } from "chakra-react-select";
import { FaExclamationTriangle } from "react-icons/fa";

const currentUser = decodeUser();

export const AddConfirmation = ({
  isOpen,
  onClose,
  closeAddModal,
  transactionDate,
  details,
  setDetails,
  rawMatsInfo,
  setRawMatsInfo,
  customerRef,
  warehouseId,
  setSelectorId,
  setWarehouseId,
  fetchActiveMiscIssues,
  customerData,
  setCustomerData,
  remarks,
  setRemarks,
  remarksRef,
  unitCost,
  setUnitCost,
  fetchRawMats,
  chargingAccountTitle,
  chargingCoa,
  coaData,
  setCoaData,
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

        // Account Title
        accountCode: chargingAccountTitle?.accountId?.value?.code,
        accountTitles: chargingAccountTitle?.accountId?.value?.name,
        empId: chargingAccountTitle?.empId?.value?.full_id_number,
        fullName: chargingAccountTitle?.empId?.value?.full_name,

        //Charging Company, department, location
        companyCode: chargingCoa?.companyId?.value?.code,
        companyName: chargingCoa?.companyId?.value?.name,
        departmentCode: chargingCoa?.departmentId?.value?.code,
        departmentName: chargingCoa?.departmentId?.value?.name,
        locationCode: chargingCoa?.locationId?.value?.code,
        locationName: chargingCoa?.locationId?.value?.name,
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

  // console.log(rawMatsInfo)
  // console.log(customerData)

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
            <Button
              size="sm"
              onClick={submitHandler}
              isLoading={isLoading}
              colorScheme="blue"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
              Yes
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              isLoading={isLoading}
              color="black"
              variant="outline"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CancelConfirmation = ({
  isOpen,
  onClose,
  selectorId,
  setSelectorId,
  fetchActiveMiscIssues,
  fetchBarcodeNo,
  fetchRawMats,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, [
          { id: selectorId },
        ])
        .then((res) => {
          ToastComponent(
            "Success",
            "Item has been cancelled",
            "success",
            toast
          );
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

  console.log(selectorId);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="center"
          >
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
            <Button
              size="sm"
              onClick={onClose}
              isLoading={isLoading}
              color="black"
              variant="outline"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
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
    departmentId: yup
      .object()
      .required()
      .typeError("Department Category is required"),
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
  details,
  setDetails,
  customerData,
  setCustomerData,
  setTotalQuantity,
  miscData,
  fetchActiveMiscIssues,
  isLoading,
  setIsLoading,
  customerRef,
  setRawMatsInfo,
  setHideButton,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  fetchRawMats,
  coaData,
  setCoaData,
  customers,
}) => {
  const toast = useToast();
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://rdfsedar.com/api/data/employees", {
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

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.departments);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setLocation(res.data.result.locations);
    } catch (error) {}
  };

  // FETCH ACcount API
  const fetchAccountApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setAccount(res.data.result.account_titles);
    } catch (error) {}
  };

  useEffect(() => {
    fetchLocationApi().then(() =>
      fetchDepartmentApi().then(() => fetchCompanyApi())
    );
    fetchAccountApi();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        companyId: "",
        departmentId: "",
        locationId: "",
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

  // const defaultValues = { customers: [] };

  // const resetHandler = () => {
  //   reset(defaultValues);
  // };

  const saveSubmitHandler = () => {
    // console.log(coaData);

    console.log("Customers: ", customerData);
    console.log("COA DATA: ", coaData);

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
            companyCode: coaData[0]?.companyCode,
            companyName: coaData[0]?.companyName,
            departmentCode: coaData[0]?.departmentCode,
            departmentName: coaData[0]?.departmentName,
            locationCode: coaData[0]?.locationCode,
            locationName: coaData[0]?.locationName,
            // accountCode: coaData?.departmentCode,
            // accountTitles: data.formData.accountId.value.name,
            // empId: data.formData.empId?.value.full_id_number,
            // fullName: data.formData.fullName,
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
                const res = request
                  .put(`Miscellaneous/UpdateMiscellaneousIssuePKey`, arrayofId)
                  .then((res) => {
                    fetchActiveMiscIssues();
                    ToastComponent(
                      "Success",
                      "Information saved",
                      "success",
                      toast
                    );
                    onClose();
                    fetchRawMats();
                    setCustomerData({
                      customerCode: "",
                      customerName: "",
                    });
                    setTotalQuantity("");
                    setTransactionDate("");
                    // customerRef.current.value = "";
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
              } catch (error) {
                console.log(error);
              }
            }
          })
          .catch((err) => {
            ToastComponent(
              "Error",
              "Information was not saved",
              "error",
              toast
            );
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
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setInfo(
      pickerItems
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name
            .toLowerCase()
            .includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

  return (
    // <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
    //   <ModalOverlay />
    //   <form onSubmit={handleSubmit(saveSubmitHandler)}>
    //     <ModalContent>
    //       <ModalHeader textAlign="center">Charge Of Accounts</ModalHeader>
    //       <ModalCloseButton onClick={closeHandler} />
    //       <ModalBody>
    //         <Stack spacing={2} p={6}>
    //           <Box>
    //             <FormLabel fontSize="sm">Company</FormLabel>
    //             <Controller
    //               control={control}
    //               name="formData.companyId"
    //               render={({ field }) => (

    //                 <AutoComplete
    //                   ref={field.ref}
    //                   value={field.value}
    //                   size="sm"
    //                   placeholder="Select Company"
    //                   onChange={(e) => {
    //                     field.onChange(e);
    //                     setValue("formData.departmentId", "");
    //                     setValue("formData.locationId", "");
    //                     fetchDepartmentApi(e?.value?.id || "");
    //                   }}
    //                   options={company?.map((item) => {
    //                     return {
    //                       label: `${item.code} - ${item.name}`,
    //                       value: item,
    //                     };
    //                   })}
    //                 />
    //               )}
    //             />
    //             <Text color="red" fontSize="xs">
    //               {errors.formData?.companyId?.message}
    //             </Text>
    //           </Box>

    //           <Box>
    //             <FormLabel fontSize="sm">Department</FormLabel>
    //             <Controller
    //               control={control}
    //               name="formData.departmentId"
    //               render={({ field }) => (

    //                 <AutoComplete
    //                   size="sm"
    //                   ref={field.ref}
    //                   value={field.value}
    //                   placeholder="Select Department"
    //                   onChange={(e) => {
    //                     field.onChange(e);
    //                     setValue("formData.locationId", "");
    //                     fetchLocationApi(e?.value?.id);
    //                   }}
    //                   options={department?.map((item) => {
    //                     return {
    //                       label: `${item.code} - ${item.name}`,
    //                       value: item,
    //                     };
    //                   })}
    //                 />
    //               )}
    //             />

    //             <Text color="red" fontSize="xs">
    //               {errors.formData?.departmentId?.message}
    //             </Text>
    //           </Box>

    //           <Box>
    //             <FormLabel fontSize="sm">Location</FormLabel>
    //             <Controller
    //               control={control}
    //               name="formData.locationId"
    //               render={({ field }) => (

    //                 <AutoComplete
    //                   size="sm"
    //                   ref={field.ref}
    //                   value={field.value}
    //                   placeholder="Select Location"
    //                   onChange={(e) => {
    //                     field.onChange(e);
    //                   }}
    //                   options={location?.map((item) => {
    //                     return {
    //                       label: `${item.code} - ${item.name}`,
    //                       value: item,
    //                     };
    //                   })}
    //                 />
    //               )}
    //             />

    //             <Text color="red" fontSize="xs">
    //               {errors.formData?.locationId?.message}
    //             </Text>
    //           </Box>
    //           <Box>
    //             <FormLabel fontSize="sm">Account Title</FormLabel>
    //             <Controller
    //               control={control}
    //               name="formData.accountId"
    //               render={({ field }) => (
    //                 <AutoComplete
    //                   size="sm"
    //                   ref={field.ref}
    //                   value={field.value}
    //                   placeholder="Select Account"
    //                   onChange={(e) => {
    //                     field.onChange(e);
    //                     triggerPointHandler(e?.value.id);
    //                   }}
    //                   options={account?.map((item) => {
    //                     return {
    //                       label: `${item.code} - ${item.name}`,
    //                       value: item,
    //                     };
    //                   })}
    //                 />
    //               )}
    //             />
    //             <Text color="red" fontSize="xs">
    //               {errors.formData?.accountId?.message}
    //             </Text>
    //           </Box>
    //           {!!selectedAccount.match(/Advances to Employees/gi) && (
    //             <>
    //               <Box>
    //                 <FormLabel fontSize="sm">Employee ID</FormLabel>
    //                 <Controller
    //                   control={control}
    //                   name="formData.empId"
    //                   render={({ field }) => (
    //                     <AutoComplete
    //                       size="sm"
    //                       ref={field.ref}
    //                       value={field.value}
    //                       placeholder="Enter Employee ID"
    //                       onChange={(e) => {
    //                         field.onChange(e);
    //                         setValue("formData.fullName", e.value.full_name);
    //                       }}
    //                       options={pickerItems?.map((item) => {
    //                         return {
    //                           label: item.general_info?.full_id_number,
    //                           value: {
    //                             full_id_number:
    //                               item.general_info?.full_id_number,
    //                             full_name: item.general_info?.full_name,
    //                           },
    //                         };
    //                       })}
    //                     />
    //                   )}
    //                 />
    //                 <Text color="red" fontSize="xs">
    //                   {errors.formData?.empId?.message}
    //                 </Text>
    //               </Box>
    //               <Box>
    //                 <FormLabel fontSize="sm">Full Name:</FormLabel>
    //                 <Input
    //                   fontSize="sm"
    //                   {...register("formData.fullName")}
    //                   disabled={disableFullName}
    //                   readOnly={disableFullName}
    //                   _disabled={{ color: "black" }}
    //                   bgColor={disableFullName && "gray.300"}
    //                   autoFocus
    //                   autoComplete="off"
    //                 />
    //                 <Text color="red" fontSize="xs">
    //                   {errors.formData?.fullName?.message}
    //                 </Text>
    //               </Box>
    //             </>
    //           )}
    //         </Stack>
    //       </ModalBody>
    //       <ModalFooter gap={2}>
    //         <Button
    //           size="sm"
    //           colorScheme="blue"
    //           type="submit"
    //           isLoading={isLoading}
    //           isDisabled={
    //             isLoading ||
    //             !isValid ||
    //             // !watch("formData.accountTitles") ||
    //             !watch("formData.companyId") ||
    //             !watch("formData.departmentId") ||
    //             !watch("formData.locationId") ||
    //             !watch("formData.accountId")
    //           }
    //         >
    //           Submit
    //         </Button>
    //         <Button
    //           size="sm"
    //           // colorScheme="red"
    //           onClick={closeHandler}
    //           isLoading={isLoading}
    //           disabled={isLoading}
    //         >
    //           Close
    //         </Button>
    //       </ModalFooter>
    //     </ModalContent>
    //   </form>
    // </Modal>
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
            <Button
              size="sm"
              onClick={closeHandler}
              isLoading={isLoading}
              color="black"
              variant="outline"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
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
          ToastComponent(
            "Success",
            "Items has been cancelled",
            "success",
            toast
          );
          fetchActiveMiscIssues();
          fetchRawMats();
          customerRef.current.value = "";
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
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="center"
          >
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
            <Button
              onClick={allCancelSubmitHandler}
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
            <Button
              onClick={onClose}
              isLoading={isLoading}
              color="black"
              variant="outline"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
