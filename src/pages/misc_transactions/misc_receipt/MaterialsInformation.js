import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  InputGroup,
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
import { AddConfirmation } from "./ActionModals";
import { RiAddFill } from "react-icons/ri";

import moment from "moment";
import { Select as AutoComplete } from "chakra-react-select";
import { decodeUser } from "../../../services/decode-user";
import { NumericFormat } from "react-number-format";

import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import request from "../../../services/ApiClient";

const currentUser = decodeUser();

const schema = yup.object().shape({
  formData: yup.object().shape({
    suppliers: yup.object(),
    oneChargingCode: yup.object().required().typeError("Charging Code is required"),
  }),
});

export const MaterialsInformation = ({
  rawMatsInfo,
  setRawMatsInfo,
  details,
  setDetails,
  setListDataTempo,
  suppliers,
  materials,
  setSelectorId,
  supplierData,
  setSupplierData,
  remarks,
  setRemarks,
  remarksRef,
  transactionType,
  transactionDate,
  setTransactionDate,
  showOneChargingData,
  setShowChargingData,
}) => {
  // ONE CHARGING CODE
  const [oneChargingCode, setOneChargingCode] = useState([]);

  //  FETCH ONE CHARGING CODE
  const fetchOneChargingApi = async () => {
    const res = await request.get(`OneCharging/GetOneCharging`);
    return res.data;
  };

  const fetchOneCharging = () => {
    fetchOneChargingApi().then((res) => {
      setOneChargingCode(res);
    });
  };

  useEffect(() => {
    fetchOneCharging();

    return () => {
      setOneChargingCode([]);
    };
  }, []);

  const {
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
        oneChargingCode: "",
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
    if (data) {
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

  const cutOff = 7;
  const today = moment();
  const isSeventhDay = today.date() < cutOff;
  const minDate = isSeventhDay
    ? today.clone().subtract(1, "month").format("YYYY-MM-DD") // If today is before the 7th, set minDate to one month ago
    : today.startOf("month").format("YYYY-MM-DD"); // If today is on or after the 7th, set minDate to the start of the current month

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

              {suppliers?.length > 0 ? (
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
              ) : (
                <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
              )}
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
                min={minDate}
                max={moment(new Date()).format("yyyy-MM-DD")}
                // bgColor="#fff8dc"
                py={1.5}
                border="1px"
                borderRadius="none"
                borderColor="gray.400"
                onKeyDown={(e) => e.preventDefault()}
              />
            </HStack>

            {/* Details */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={5} py={2.5} fontSize="xs">
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

          <VStack alignItems="start" w="40%" mx={5}>
            {/* One Charging Code */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Charging Code:
              </Text>

              {oneChargingCode?.oneChargingList?.length > 0 ? (
                <Controller
                  control={control}
                  name="formData.oneChargingCode"
                  render={({ field }) => (
                    <AutoComplete
                      className="react-select-layout"
                      ref={field.ref}
                      value={field.value}
                      size="sm"
                      placeholder="Select Code"
                      onChange={(e) => {
                        field.onChange(e);
                        setShowChargingData(e?.value);
                      }}
                      options={oneChargingCode?.oneChargingList?.map((item) => {
                        return {
                          label: `${item.code} - ${item.name}`,
                          value: item,
                        };
                      })}
                    />
                  )}
                />
              ) : (
                <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
              )}
            </HStack>

            {/* Company */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Company:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.company_code} - ${showOneChargingData?.company_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Business Unit */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Business Unit:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.business_unit_code} - ${showOneChargingData?.business_unit_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Department */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Department:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.department_code} - ${showOneChargingData?.department_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Unit */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Unit:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.department_unit_code} - ${showOneChargingData?.department_unit_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Sub Unit */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Sub Unit:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.sub_unit_code} - ${showOneChargingData?.sub_unit_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Location */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Location:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.location_code} - ${showOneChargingData?.location_name}` : "Select Charging Code"}
              </Text>
            </HStack>
          </VStack>
        </Flex>

        <VStack alignItems="start" w="full"></VStack>
        <Flex w="full" justifyContent="end">
          <Button
            onClick={() => openModal()}
            isDisabled={!supplierData.supplierName || !details || !remarks || !transactionDate || !watch("formData.oneChargingCode")}
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
          isOpen={isModal}
          onClose={closeModal}
          details={details}
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          setListDataTempo={setListDataTempo}
          materials={materials}
          setSelectorId={setSelectorId}
          remarks={remarks}
          transactionDate={transactionDate}
          supplierData={supplierData}
          chargingCoa={watch("formData")}
        />
      )}
    </Flex>
  );
};

export const RawMatsInfoModal = ({
  isOpen,
  onClose,
  details,
  rawMatsInfo,
  setRawMatsInfo,
  setListDataTempo,
  materials,
  setSelectorId,
  remarks,
  transactionDate,
  supplierData,
  chargingCoa,
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
    if (data) {
      const itemCode = data.value.itemCode;
      const itemDescription = data.value.itemDescription;
      const uomCode = data.value.uomCode;
      const unitCost = data.value.unitCost;

      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        supplierName: rawMatsInfo.supplierName,
        uom: uomCode,
        quantity: rawMatsInfo.quantity,
        unitPrice: unitCost,
      });
    } else {
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        supplierName: rawMatsInfo.supplierName,
        uom: "",
        quantity: rawMatsInfo.quantity,
        unitPrice: "",
      });
    }
  };

  const newDate = new Date();
  const minDate = moment(newDate).format("yyyy-MM-DD");

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

                  {materials?.length > 0 ? (
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
                  ) : (
                    <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
                  )}
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

                {/* Unit Cost */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Unit Cost:{" "}
                  </Text>
                  <InputGroup>
                    <NumericFormat
                      customInput={Input}
                      fontSize="sm"
                      value={rawMatsInfo.unitPrice ? rawMatsInfo.unitPrice : ""}
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
                      min="0"
                      w="full"
                      placeholder="Enter Unit Cost"
                      border="1px"
                      borderColor="gray.400"
                      borderRadius="none"
                      thousandSeparator=","
                    />
                  </InputGroup>
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
                    min="1"
                    placeholder="Enter Quantity"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    thousandSeparator=","
                  />
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
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          setListDataTempo={setListDataTempo}
          setSelectorId={setSelectorId}
          remarks={remarks}
          transactionDate={transactionDate}
          supplierData={supplierData}
          chargingAccountTitle={watch("formData")}
          chargingCoa={chargingCoa}
        />
      )}
    </>
  );
};
