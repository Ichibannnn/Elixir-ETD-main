import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
// import { useLocation } from 'react-router-dom'
// import { AddConfirmation } from './Action-Modals'
import moment from "moment";
import request from "../../../services/ApiClient";
import { AddConfirmation } from "./ActionModals";
import { Select as AutoComplete } from "chakra-react-select";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { decodeUser } from "../../../services/decode-user";
import { RiAddFill } from "react-icons/ri";
import { NumericFormat } from "react-number-format";

const currentUser = decodeUser();

const schema = yup.object().shape({
  formData: yup.object().shape({
    suppliers: yup.object(),
    companyId: yup.object().required().typeError("Company Name is required"),
    departmentId: yup.object().required().typeError("Department Category is required"),
    locationId: yup.object().required().typeError("Location Name is required"),
    // accountId: yup.object().required().typeError("Account Name is required"),
    // empId: yup.object().nullable(),
    // fullName: yup.string(),
  }),
});

export const MaterialsInformation = ({
  rawMatsInfo,
  setRawMatsInfo,
  listDataTempo,
  setListDataTempo,
  details,
  setDetails,
  suppliers,
  materials,
  uoms,
  setSelectorId,
  supplierData,
  setSupplierData,
  supplierRef,
  remarks,
  setRemarks,
  remarksRef,
  transactionDate,
  setTransactionDate,
  transactionType,
  setTransactionType,
  chargingInfo,
  setChargingInfo,
}) => {
  // COA
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
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
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
        },
      });
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.departments);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
        },
      });
      setLocation(res.data.result.locations);
    } catch (error) {}
  };

  useEffect(() => {
    fetchLocationApi().then(() => fetchDepartmentApi().then(() => fetchCompanyApi()));
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
        suppliers: "",
        companyId: "",
        departmentId: "",
        locationId: "",
        // accountId: "",
        // empId: "",
        // fullName: "",
        addedBy: currentUser.fullName,
      },
    },
  });

  const { isOpen: isModal, onClose: closeModal, onOpen: openModal } = useDisclosure();

  const detailHandler = (data) => {
    if (data) {
      setDetails(data);
    } else {
      setDetails("");
    }
  };

  const supplierHandler = (data) => {
    // console.log("Data: ", data);
    // console.log("Supplier Name: ", data.value.supplierName);
    if (data) {
      // const newData = JSON.stringify(data);
      // const supplierCode = newData.supplierCode;
      // const supplierName = newData.supplierName;
      setSupplierData({
        supplierCode: data.value.supplierCode,
        supplierName: data.value.supplierName,
      });
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        supplierName: data.value.supplierName,
        uom: rawMatsInfo.uom,
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
    } else {
      setSupplierData({
        supplierCode: "",
        supplierName: "",
      });
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        supplierName: "",
        uom: rawMatsInfo.uom,
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
    }
  };

  useEffect(() => {
    if (supplierData.supplierName === "") {
      reset();
    }
  }, [supplierData]);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <Box bgColor="primary" w="full" pl={2} h="20px" alignItems="center">
        <Flex flexDirection="row" justifyContent="space-around" gap={2}>
          <Text color="white" textAlign="center" fontSize="sm">
            Miscellaneous Receipt
          </Text>
        </Flex>
      </Box>

      <VStack w="full" spacing={6}>
        <Box bgColor="secondary" w="full" pl={2} h="30px" alignItems="center">
          <Flex flexDirection="row" justifyContent="space-around" gap={2}>
            <Text color="white" textAlign="center" fontSize="sm">
              Supplier Information
            </Text>
            <Text color="white" textAlign="center" fontSize="sm">
              Charging of Accounts
            </Text>
          </Flex>
        </Box>

        <Flex w="full" justifyContent="space-between">
          <VStack alignItems="start" w="40%" mx={5}>
            {/* Supplier Code */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Supplier Code:{" "}
              </Text>

              <Controller
                control={control}
                name="formData.suppliers"
                render={({ field }) => (
                  <AutoComplete
                    className="react-select-layout"
                    ref={field.ref}
                    value={field.value}
                    size="sm"
                    placeholder="Select Supplier"
                    onChange={(e) => {
                      field.onChange(e);
                      supplierHandler(e);
                    }}
                    options={suppliers?.map((item) => {
                      return {
                        label: `${item.supplierCode} - ${item.supplierName}`,
                        value: item,
                      };
                    })}
                  />
                )}
              />
            </HStack>

            {/* Supplier Name */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Supplier Name:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={2} py={1.5}>
                {supplierData.supplierName ? supplierData.supplierName : "Select a supplier code"}
              </Text>
            </HStack>

            {/* Transaction Type */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Transaction Type:{" "}
              </Text>
              {transactionType?.length > 0 ? (
                <Select
                  fontSize="sm"
                  onChange={(e) => setRemarks(e.target.value)}
                  ref={remarksRef}
                  w="full"
                  placeholder="Select Transaction Type"
                  border="1px"
                  borderColor="gray.400"
                  borderRadius="none"
                  // bgColor="#fff8dc"
                >
                  {transactionType?.map((tt) => (
                    <option key={tt.id} value={tt.transactionName}>
                      {tt.transactionName}
                    </option>
                  ))}
                </Select>
              ) : (
                <Spinner />
              )}
            </HStack>

            {/* Transaction Date */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Transaction Date:{" "}
              </Text>
              <Input
                type="date"
                fontSize="sm"
                pl={2}
                w="full"
                onChange={(e) => setTransactionDate(e.target.value)}
                value={transactionDate}
                // defaultValue={moment(new Date()).format("yyyy-MM-DD")}
                max={moment(new Date()).format("yyyy-MM-DD")}
                // bgColor="#fff8dc"
                py={1.5}
                border="1px"
                borderRadius="none"
                borderColor="gray.400"
              />
            </HStack>
          </VStack>

          <VStack alignItems="start" w="40%" mx={5}>
            {/* Company */}
            <HStack w="100%">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Company:{" "}
              </Text>
              <Controller
                control={control}
                name="formData.companyId"
                render={({ field }) => (
                  <AutoComplete
                    className="react-select-layout"
                    ref={field.ref}
                    value={field.value}
                    size="sm"
                    placeholder="Select Company"
                    onChange={(e) => {
                      field.onChange(e);
                      setValue("formData.departmentId", "");
                      setValue("formData.locationId", "");
                      fetchDepartmentApi(e?.value?.id || "");
                    }}
                    options={company?.map((item) => {
                      return {
                        label: `${item.code} - ${item.name}`,
                        value: item,
                      };
                    })}
                  />
                )}
              />
              <Text color="red" fontSize="xs">
                {errors.formData?.companyId?.message}
              </Text>
            </HStack>

            {/* Department */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Department:{" "}
              </Text>
              <Controller
                control={control}
                name="formData.departmentId"
                render={({ field }) => (
                  <AutoComplete
                    className="react-select-layout"
                    size="sm"
                    ref={field.ref}
                    value={field.value}
                    placeholder="Select Department"
                    onChange={(e) => {
                      field.onChange(e);
                      setValue("formData.locationId", "");
                      fetchLocationApi(e?.value?.id);
                    }}
                    options={department?.map((item) => {
                      return {
                        label: `${item.code} - ${item.name}`,
                        value: item,
                      };
                    })}
                  />
                )}
              />

              <Text color="red" fontSize="xs">
                {errors.formData?.departmentId?.message}
              </Text>
            </HStack>

            {/* Location */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Location:{" "}
              </Text>
              <Controller
                control={control}
                name="formData.locationId"
                render={({ field }) => (
                  <AutoComplete
                    className="react-select-layout"
                    size="sm"
                    ref={field.ref}
                    value={field.value}
                    placeholder="Select Location"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    options={location?.map((item) => {
                      return {
                        label: `${item.code} - ${item.name}`,
                        value: item,
                      };
                    })}
                  />
                )}
              />
              <Text color="red" fontSize="xs">
                {errors.formData?.locationId?.message}
              </Text>
            </HStack>
          </VStack>
        </Flex>

        <VStack alignItems="start" w="full">
          {/* Details */}
          <HStack w="full">
            <Text w="auto" bgColor="primary" color="white" pl={2} pr={5} py={2.5} fontSize="xs">
              Details:{" "}
            </Text>
            <Input
              fontSize="sm"
              onChange={(e) => detailHandler(e.target.value)}
              value={details}
              w="full"
              // bgColor="#ffffe0"
              border="1px"
              borderColor="gray.400"
              borderRadius="none"
            />
          </HStack>
        </VStack>
        <Flex w="full" justifyContent="end">
          <Button
            onClick={() => openModal()}
            isDisabled={
              !isValid ||
              !supplierData.supplierName ||
              !details ||
              !remarks ||
              !transactionDate ||
              !watch("formData.companyId") ||
              !watch("formData.departmentId") ||
              !watch("formData.locationId")
            }
            size="sm"
            width="100px"
            colorScheme="blue"
            borderRadius="none"
            leftIcon={<RiAddFill fontSize="17px" />}
          >
            New
          </Button>
        </Flex>
      </VStack>

      {isModal && (
        <RawMatsInfoModal
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          listDataTempo={listDataTempo}
          setListDataTempo={setListDataTempo}
          chargingInfo={chargingInfo}
          setChargingInfo={setChargingInfo}
          details={details}
          setDetails={setDetails}
          supplierRef={supplierRef}
          materials={materials}
          uoms={uoms}
          setSelectorId={setSelectorId}
          isOpen={isModal}
          onClose={closeModal}
          remarks={remarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          supplierData={supplierData}
          chargingCoa={watch("formData")}
          resetCOA={reset}
        />
      )}
    </Flex>
  );
};

export const RawMatsInfoModal = ({
  isOpen,
  onClose,
  details,
  setDetails,
  rawMatsInfo,
  setRawMatsInfo,
  listDataTempo,
  setListDataTempo,
  chargingInfo,
  setChargingInfo,
  supplierRef,
  materials,
  setSelectorId,
  remarks,
  transactionDate,
  setTransactionDate,
  supplierData,
  chargingCoa,
  resetCOA,
}) => {
  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();
  const openAddConfirmation = () => {
    openAdd();
  };

  const schema = yup.object().shape({
    formData: yup.object().shape({
      materials: yup.object(),
      accountId: yup.object().required().typeError("Account Name is required"),
      empId: yup.object().nullable(),
      fullName: yup.string(),
    }),
  });

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

  // FETCH ACcount API
  const fetchAccountApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
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
        materials: "",
        accountId: "",
        empId: "",
        fullName: "",
        addedBy: currentUser.fullName,
      },
    },
  });

  const triggerPointHandler = (event) => {
    const selectAccountTitle = account?.find((item) => {
      return item.id === parseInt(event);
    });

    if (!selectedAccount?.name?.match(/Advances to Employees/gi) || !selectedAccount?.name?.match(/Advances from Employees/gi)) {
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
          return item?.general_info?.full_id_number_full_name.toLowerCase().includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

  const itemCodeHandler = (data) => {
    console.log("Data: ", data);

    if (data) {
      // const newData = JSON.parse(data);
      const itemCode = data.value.itemCode;
      const itemDescription = data.value.itemDescription;
      const uom = data.value.uom;
      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        supplierName: rawMatsInfo.supplierName,
        uom: uom,
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
    } else {
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        supplierName: rawMatsInfo.supplierName,
        uom: "",
        quantity: rawMatsInfo.quantity,
        unitPrice: rawMatsInfo.unitPrice,
      });
    }
  };

  const newDate = new Date();
  const minDate = moment(newDate).format("yyyy-MM-DD");

  // console.log("Raw Mats :", rawMatsInfo);
  // console.log("Account title :", watch("formData"));

  // console.log("Materials: ", materials);

  const closeHandler = () => {
    setRawMatsInfo({
      itemCode: "",
      itemDescription: "",
      supplierName: rawMatsInfo.supplierName,
      uom: "",
      quantity: "",
      unitPrice: "",
    });
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text>Materials Information</Text>
              <Text fontSize="xs">Miscellaneous Receipt</Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody mb={5}>
            <Flex justifyContent="space-between">
              <VStack alignItems="start" w="full" mx={5}>
                {/* Item Code */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Item Code:{" "}
                  </Text>
                  <Controller
                    control={control}
                    name="formData.materials"
                    render={({ field }) => (
                      <AutoComplete
                        className="react-select-layout"
                        ref={field.ref}
                        value={field.value}
                        size="sm"
                        placeholder="Select Item Code"
                        onChange={(e) => {
                          console.log("E: ", e);

                          field.onChange(e);
                          itemCodeHandler(e);
                        }}
                        options={materials?.map((item) => {
                          return {
                            label: `${item.itemCode}`,
                            value: item,
                          };
                        })}
                      />
                    )}
                  />
                </HStack>

                {/* Item Description */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Item Description:{" "}
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {rawMatsInfo.itemDescription ? rawMatsInfo.itemDescription : "Item Code required"}
                  </Text>
                </HStack>

                {/* UOM */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    UOM:{" "}
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {rawMatsInfo.uom ? rawMatsInfo.uom : "Item Code required"}
                  </Text>
                </HStack>

                {/* Quantity */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Quantity:{" "}
                  </Text>
                  <NumericFormat
                    customInput={Input}
                    fontSize="sm"
                    onValueChange={(e) =>
                      setRawMatsInfo({
                        itemCode: rawMatsInfo.itemCode,
                        itemDescription: rawMatsInfo.itemDescription,
                        supplierName: rawMatsInfo.supplierName,
                        uom: rawMatsInfo.uom,
                        quantity: Number(e?.value),
                        unitPrice: rawMatsInfo.unitPrice,
                      })
                    }
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                    // onPaste={(e) => e.preventDefault()}
                    min="1"
                    placeholder="Enter Quantity"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    thousandSeparator=","
                  />
                </HStack>

                {/* Unit Cost */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Unit Cost:{" "}
                  </Text>
                  <InputGroup>
                    <NumericFormat
                      customInput={Input}
                      fontSize="sm"
                      onValueChange={(e) =>
                        setRawMatsInfo({
                          itemCode: rawMatsInfo.itemCode,
                          itemDescription: rawMatsInfo.itemDescription,
                          supplierName: rawMatsInfo.supplierName,
                          uom: rawMatsInfo.uom,
                          quantity: rawMatsInfo.quantity,
                          unitPrice: Number(e?.value),
                        })
                      }
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                      // onPaste={(e) => e.preventDefault()}
                      min="1"
                      w="full"
                      placeholder="Enter Unit Cost"
                      border="1px"
                      borderColor="gray.400"
                      borderRadius="none"
                      thousandSeparator=","
                    />
                  </InputGroup>
                </HStack>

                {/* Account Title */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Account Title:{" "}
                  </Text>
                  <Box w="full">
                    <Controller
                      control={control}
                      name="formData.accountId"
                      render={({ field }) => (
                        <Box w="full">
                          <AutoComplete
                            className="react-select-layout"
                            size="sm"
                            ref={field.ref}
                            value={field.value}
                            placeholder="Select Account"
                            onChange={(e) => {
                              field.onChange(e);
                              triggerPointHandler(e?.value.id);
                            }}
                            options={account?.map((item) => {
                              return {
                                label: `${item.code} - ${item.name}`,
                                value: item,
                              };
                            })}
                          />
                        </Box>
                      )}
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.accountId?.message}
                    </Text>
                  </Box>
                </HStack>

                {/* Employee ID */}
                {!!selectedAccount.match(/Advances to Employees/gi) && (
                  <>
                    <HStack w="full">
                      <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                        Employee ID:{" "}
                      </Text>
                      <Box w="full">
                        <Controller
                          control={control}
                          name="formData.empId"
                          render={({ field }) => (
                            <AutoComplete
                              className="react-select-layout"
                              size="sm"
                              ref={field.ref}
                              value={field.value}
                              placeholder="Enter Employee ID"
                              onChange={(e) => {
                                field.onChange(e);
                                setValue("formData.fullName", e.value.full_name);
                              }}
                              options={pickerItems?.map((item) => {
                                return {
                                  label: item.general_info?.full_id_number,
                                  value: {
                                    full_id_number: item.general_info?.full_id_number,
                                    full_name: item.general_info?.full_name,
                                  },
                                };
                              })}
                            />
                          )}
                        />
                        <Text color="red" fontSize="xs">
                          {errors.formData?.empId?.message}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack w="full">
                      <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                        Full Name:{" "}
                      </Text>
                      <Box w="full">
                        <Input
                          // className="react-select-layout"
                          fontSize="sm"
                          {...register("formData.fullName")}
                          disabled={disableFullName}
                          readOnly={disableFullName}
                          _disabled={{ color: "black" }}
                          bgColor={disableFullName && "gray.200"}
                          autoFocus
                          autoComplete="off"
                          border="1px"
                          borderColor="gray.200"
                          borderRadius="none"
                        />
                        <Text color="red" fontSize="xs">
                          {errors.formData?.fullName?.message}
                        </Text>
                      </Box>
                    </HStack>
                  </>
                )}
              </VStack>

              {/* <VStack alignItems="start" w="full" mx={5}>
              </VStack> */}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="xs">
              <Button
                onClick={openAddConfirmation}
                isDisabled={
                  !rawMatsInfo.itemCode ||
                  !rawMatsInfo.supplierName ||
                  !rawMatsInfo.uom ||
                  !rawMatsInfo.quantity ||
                  !rawMatsInfo.unitPrice ||
                  !details ||
                  !watch("formData.accountId")
                }
                colorScheme="blue"
                px={4}
              >
                Add
              </Button>
              <Button color="black" variant="outline" onClick={closeHandler}>
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isAdd && (
        <AddConfirmation
          isOpen={isAdd}
          onClose={closeAdd}
          closeAddModal={onClose}
          details={details}
          setDetails={setDetails}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          listDataTempo={listDataTempo}
          setListDataTempo={setListDataTempo}
          chargingInfo={chargingInfo}
          setChargingInfo={setChargingInfo}
          supplierRef={supplierRef}
          setSelectorId={setSelectorId}
          remarks={remarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          supplierData={supplierData}
          chargingAccountTitle={watch("formData")}
          chargingCoa={chargingCoa}
          resetCOA={resetCOA}
        />
      )}
    </>
  );
};
