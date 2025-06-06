import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import { FcInfo } from "react-icons/fc";

import * as yup from "yup";
import axios from "axios";
import request from "../../services/ApiClient";

import { yupResolver } from "@hookform/resolvers/yup";
import { decodeUser } from "../../services/decode-user";
import { ToastComponent } from "../../components/Toast";

import { FaExclamationTriangle } from "react-icons/fa";

const currentUser = decodeUser();

export const AddConfirmation = ({
  isOpen,
  onClose,
  closeAddModal,
  transactionDate,
  details,
  rawMatsInfo,
  setRawMatsInfo,
  warehouseId,
  setWarehouseId,
  remarks,
  employeeFormData,
  setEmployeeData,
  fetchRawMats,
  fetchActiveBorrowed,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  console.log("Employee FormData: ", employeeFormData);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const addSubmit = {
        warehouseId: warehouseId,
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        uom: rawMatsInfo.uom,
        quantity: rawMatsInfo.quantity,
        remarks: remarks,
        details: details,
        transactionDate: transactionDate,
        preparedBy: currentUser.fullName,

        // EMPLOYEE DATA
        empId: employeeFormData?.empId?.value?.full_id_number,
        fullName: employeeFormData?.empId?.value?.full_name,
      };
      setEmployeeData((current) => [...current, addSubmit]);
      const res = request
        .post(`Borrowed/AddNewBorrowedIssueDetails`, addSubmit)
        .then((res) => {
          ToastComponent("Success", "Item added", "success", toast);
          setRawMatsInfo({
            itemCode: "",
            itemDescription: "",
            customerName: rawMatsInfo.customerName,
            customer: rawMatsInfo.customerName,
            uom: "",
            warehouseId: "",
            quantity: "",
          });
          setWarehouseId("");
          fetchRawMats();
          setIsLoading(false);
          fetchActiveBorrowed();
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
          <Flex justifyContent="center" alignItems="center" flexDirection="column">
            <FcInfo fontSize="90px" />
            <Text>Confirmation</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to add this information?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button size="sm" onClick={submitHandler} isLoading={isLoading} colorScheme="blue">
              Yes
            </Button>
            <Button size="sm" onClick={onClose} isLoading={isLoading} variant="outline">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CancelConfirmation = ({ isOpen, onClose, selectorId, setSelectorId, fetchActiveBorrowed, fetchBarcodeNo, fetchRawMats }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Borrowed/CancelItemForTransactBorrow`, [{ id: selectorId }])
        .then((res) => {
          ToastComponent("Success", "Item has been cancelled", "success", toast);
          fetchActiveBorrowed();
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

  //   console.log(selectorId)

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDirection="column">
            <FaExclamationTriangle color="red" fontSize="90px" />
            {/* <Text>Warning</Text> */}
          </Flex>
        </ModalHeader>

        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            {`Are you sure you want to cancel ID number ${selectorId}? `}
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button size="sm" height="28px" width="100px" onClick={cancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="blue">
              Yes
            </Button>
            <Button
              size="sm"
              height="28px"
              width="100px"
              onClick={onClose}
              isLoading={isLoading}
              //   colorScheme="blackAlpha"
              variant="outline"
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
    companyId: yup.number().required().typeError("Company Name is required"),
    departmentId: yup.number().required().typeError("Department Category is required"),
    locationId: yup.number().required().typeError("Location Name is required"),
    accountId: yup.number().required().typeError("Account Name is required"),
  }),
});

export const SaveConfirmation = ({
  isOpen,
  onClose,
  totalQuantity,
  customerData,
  setCustomerData,
  setTotalQuantity,
  rawMatsInfo,
  borrowedData,
  fetchActiveBorrowed,
  isLoading,
  setIsLoading,
  customerRef,
  details,
  setDetails,
  setRawMatsInfo,
  setHideButton,
  remarks,
  setRemarks,
  remarksRef,
  setTransactionDate,
  transactionDate,
  fetchRawMats,
  employeeData,
  setEmployeeData,
}) => {
  const toast = useToast();

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setDepartment(res.data.result.departments);
      console.log(res.data.result.departments);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setLocation(res.data.result.locations);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCompanyApi();
  }, []);

  // FETCH ACcount API
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
        addedBy: currentUser.userName,
      },
    },
  });

  const saveSubmitHandler = () => {
    // console.log("Employee Data: ", employeeData[0]?.empId);
    // console.log("Fullname Data: ", employeeData[0]?.fullName);

    if (totalQuantity > 0) {
      setIsLoading(true);
      try {
        const res = request
          .post(`Borrowed/AddNewBorrowedIssues`, {
            customerCode: customerData.customerCode,
            customerName: customerData.customerName,
            totalQuantity: totalQuantity,
            preparedBy: currentUser.fullName,
            remarks: remarks,
            details: details,
            transactionDate: transactionDate,
            empId: employeeData[0]?.empId,
            fullName: employeeData[0]?.fullName,
            addedBy: currentUser.fullName,
          })
          .then((res) => {
            const borrowedPKey = res.data.id;

            //SECOND Update IF MAY ID
            if (borrowedPKey) {
              // console.log(borrowedPKey)
              const arrayofId = borrowedData?.map((item) => {
                return {
                  borrowedPKey: borrowedPKey,
                  id: item.id,
                  customerCode: customerData.customerCode,
                  customerName: customerData.customerName,
                  empId: employeeData.empId,
                  fullName: employeeData.fullName,
                  //   isTransact: true
                };
              });
              try {
                const res = request.put(`Borrowed/UpdateBorrowedIssuePKey`, arrayofId).then((res) => {
                  fetchActiveBorrowed();
                  ToastComponent("Success", "Information saved", "success", toast);

                  fetchRawMats();
                  setEmployeeData([]);
                  setTotalQuantity("");
                  setTransactionDate("");
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
                  onClose();
                });
              } catch (error) {
                console.log(error);
              }
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

    //             <HStack w="full">
    //               <Controller
    //                 control={control}
    //                 name="formData.companyId"
    //                 defaultValue={
    //                   company?.find((x) => x.name === customerData?.companyName)
    //                     ?.id
    //                 }
    //                 render={({ field }) => (
    //                   <Select
    //                     {...field}
    //                     value={field.value || ""}
    //                     placeholder="Select Company"
    //                     fontSize="sm"
    //                     onChange={(e) => {
    //                       field.onChange(e);
    //                       setValue("formData.departmentId", "");
    //                       setValue("formData.locationId", "");
    //                       fetchDepartmentApi(e.target.value);
    //                     }}
    //                   >
    //                     {company?.map((item) => (
    //                       <option key={item.id} value={item.id}>
    //                         {item.code} - {item.name}
    //                       </option>
    //                     ))}
    //                   </Select>
    //                 )}
    //               />
    //             </HStack>

    //             <Text color="red" fontSize="xs">
    //               {errors.formData?.companyId?.message}
    //             </Text>
    //           </Box>

    //           <Box>
    //             <FormLabel fontSize="sm">Department</FormLabel>
    //             <Controller
    //               control={control}
    //               name="formData.departmentId"
    //               defaultValue={
    //                 department?.find(
    //                   (x) => x.name === customerData?.departmentName
    //                 )?.id
    //               }
    //               render={({ field }) => (
    //                 <Select
    //                   {...field}
    //                   value={field.value || ""}
    //                   placeholder="Select Department"
    //                   fontSize="sm"
    //                   onChange={(e) => {
    //                     field.onChange(e);
    //                     setValue("formData.locationId", "");
    //                     fetchLocationApi(e.target.value);
    //                   }}
    //                 >
    //                   {department?.map((dept) => (
    //                     <option key={dept.id} value={dept.id}>
    //                       {dept.code} - {dept.name}
    //                     </option>
    //                   ))}
    //                 </Select>
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
    //               defaultValue={
    //                 location?.find((x) => x.name === customerData?.locationName)
    //                   ?.id
    //               }
    //               render={({ field }) => (
    //                 <Select
    //                   {...field}
    //                   value={field.value || ""}
    //                   placeholder="Select Location"
    //                   fontSize="sm"
    //                 >
    //                   {location?.map((item) => (
    //                     <option key={item.id} value={item.id}>
    //                       {item.code} - {item.name}
    //                     </option>
    //                   ))}
    //                 </Select>
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
    //               defaultValue={
    //                 account?.find((x) => x.name === customerData?.accountTitles)
    //                   ?.id
    //               }
    //               render={({ field }) => (
    //                 <Select
    //                   {...field}
    //                   value={field.value || ""}
    //                   placeholder="Select Account"
    //                   fontSize="sm"
    //                   bgColor="#fff8dc"
    //                   isSearchable
    //                 >
    //                   {account?.map((item) => (
    //                     <option key={item.id} value={item.id}>
    //                       {item.code} - {item.name}
    //                     </option>
    //                   ))}
    //                 </Select>
    //               )}
    //             />
    //             <Text color="red" fontSize="xs">
    //               {errors.formData?.accountId?.message}
    //             </Text>
    //           </Box>
    //         </Stack>
    //       </ModalBody>
    //       <ModalFooter gap={2}>
    //         <Button
    //           size="sm"
    //           colorScheme="blue"
    //           type="submit"
    //           isLoading={isLoading}
    //           disabled={
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
        <ModalCloseButton onClick={closeHandler} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to save this list of request materials?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="md"
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
            <Button size="md" onClick={closeHandler} isLoading={isLoading} variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
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
  borrowedData,
  setSelectorId,
  fetchActiveBorrowed,
  setHideButton,
  fetchBarcodeNo,
  fetchRawMats,
  customerRef,
  setDetails,
  setTransactionDate,
  setCustomerData,
  setRawMatsInfo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const allCancelSubmitHandler = () => {
    setIsLoading(true);
    const allId = borrowedData.map((item) => {
      return {
        id: item.id,
      };
    });
    try {
      const res = request
        .put(`Borrowed/CancelItemForTransactBorrow`, allId)
        .then((res) => {
          ToastComponent("Success", "Items has been cancelled", "success", toast);
          fetchActiveBorrowed();
          fetchRawMats();
          // customerRef.current.value = "";
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
          fetchBarcodeNo();
          setSelectorId("");
          setHideButton(false);
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
          // console.log(err);
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
            Are you sure you want to cancel all items from the list of requested materials?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button onClick={allCancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="red" height="28px" width="100px" borderRadius="none" fontSize="xs">
              Yes
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              //   colorScheme="blackAlpha"
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
