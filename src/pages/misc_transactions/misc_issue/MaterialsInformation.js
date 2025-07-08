import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
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
import { RiAddFill } from "react-icons/ri";

import { decodeUser } from "../../../services/decode-user";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Select as AutoComplete } from "chakra-react-select";

import moment from "moment";
import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";

import { AddConfirmation } from "./ActionModal";
import request from "../../../services/ApiClient";

const currentUser = decodeUser();

const schema = yup.object().shape({
  formData: yup.object().shape({
    customers: yup.object(),
    oneChargingCode: yup.object().required().typeError("Charging Code is required"),
  }),
});

export const MaterialsInformation = ({
  setCoaData,
  rawMatsInfo,
  setRawMatsInfo,
  details,
  setDetails,
  customers,
  remarksRef,
  transactions,
  rawMats,
  barcodeNo,
  warehouseId,
  setWarehouseId,
  fetchActiveMiscIssues,
  fetchRawMats,
  customerData,
  setCustomerData,
  remarks,
  setRemarks,
  transactionDate,
  setTransactionDate,
  unitCost,
  setUnitCost,
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
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        customers: "",
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

  const customerHandler = (data) => {
    if (data) {
      const customerCode = data.value.customerCode;
      const customerName = data.value.customerName;
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: customerName,
        uom: rawMatsInfo.uom,
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
        unitCost: rawMatsInfo.unitCost,
      });
      setCustomerData({
        customerCode: customerCode,
        customerName: customerName,
      });
    } else {
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: "",
        uom: rawMatsInfo.uom,
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
        unitCost: rawMatsInfo.unitCost,
      });
      setCustomerData({
        customerCode: "",
        customerName: "",
      });
    }
  };

  useEffect(() => {
    if (customerData.customerName === "") {
      reset();
    }
  }, [customerData]);

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
            Miscellaneous Issue
          </Text>
        </Flex>
      </Box>

      <VStack w="full" spacing={6}>
        <Box bgColor="secondary" w="full" pl={2} h="30px" alignItems="center">
          <Flex flexDirection="row" justifyContent="space-around" gap={2}>
            <Text color="white" textAlign="center" fontSize="sm">
              Customer Information
            </Text>
            <Text color="white" textAlign="center" fontSize="sm">
              Charging of Accounts
            </Text>
          </Flex>
        </Box>

        <Flex w="full" justifyContent="space-between">
          <VStack alignItems="start" w="40%" mx={5}>
            {/* Customer Code */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Customer Code:{" "}
              </Text>

              {customers?.length > 0 ? (
                <Controller
                  control={control}
                  name="formData.customers"
                  render={({ field }) => (
                    <AutoComplete
                      className="react-select-layout"
                      ref={field.ref}
                      value={field.value}
                      size="sm"
                      placeholder="Select customer"
                      onChange={(e) => {
                        field.onChange(e);
                        customerHandler(e);
                      }}
                      options={customers?.map((item) => {
                        return {
                          label: `${item.customerCode} - ${item.customerName}`,
                          value: item,
                        };
                      })}
                    />
                  )}
                />
              ) : (
                <Spinner />
              )}
            </HStack>

            {/* Customer Name */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Customer Name:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {customerData.customerName ? customerData.customerName : "Select a customer code"}
              </Text>
            </HStack>

            {/* Remarks New (Transaction Type) */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Transaction Type:{" "}
              </Text>
              {transactions?.length > 0 ? (
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
                  {transactions?.map((tt) => (
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
                onChange={(e) => setTransactionDate(e.target.value)}
                value={transactionDate}
                pl={2}
                w="full"
                min={minDate}
                max={moment(new Date()).format("yyyy-MM-DD")}
                py={1.5}
                border="1px"
                borderRadius="none"
                borderColor="gray.400"
                onKeyDown={(e) => e.preventDefault()}
              />
            </HStack>

            {/* Details */}
            <HStack w="full">
              <Text minW="30%" bgColor="primary" color="white" pl={2} pr={5} py={2.5} fontSize="xs">
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
                Charging:
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
        <Flex w="full" justifyContent="end" mt={4} p={2}>
          <Button
            onClick={() => openModal()}
            isDisabled={!rawMatsInfo.customerName || !details || !remarks || !transactionDate || !watch("formData.oneChargingCode")}
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
          rawMatsInfo={rawMatsInfo}
          setRawMatsInfo={setRawMatsInfo}
          transactionDate={transactionDate}
          details={details}
          remarks={remarks}
          rawMats={rawMats}
          barcodeNo={barcodeNo}
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          customerData={customerData}
          unitCost={unitCost}
          setUnitCost={setUnitCost}
          chargingCoa={watch("formData")}
          setCoaData={setCoaData}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          fetchRawMats={fetchRawMats}
        />
      )}
    </Flex>
  );
};

export const RawMatsInfoModal = ({
  isOpen,
  onClose,
  rawMatsInfo,
  setRawMatsInfo,
  transactionDate,
  details,
  remarks,
  rawMats,
  barcodeNo,
  warehouseId,
  setWarehouseId,
  customerData,
  unitCost,
  setUnitCost,
  chargingCoa,
  setCoaData,
  fetchActiveMiscIssues,
  fetchRawMats,
}) => {
  const [availableStock, setAvailableStock] = useState("");
  const [reserve, setReserve] = useState("");

  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();
  const openAddConfirmation = () => {
    openAdd();
  };

  const schema = yup.object().shape({
    formData: yup.object().shape({
      rawMats: yup.object(),
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

  const fetchAccountApi = async () => {
    try {
      const res = await request.get("OneCharging/GetAccountTitle?UsePagination=true&status=true");

      console.log("Res: ", res);
      setAccount(res.data.oneChargingList);
    } catch (error) {}
  };

  // Fisto Account Title ~~~~~~
  // const fetchAccountApi = async (id = "") => {
  //   try {
  //     const res = await axios.get("http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0" + id, {
  //       headers: {
  //         Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
  //       },
  //     });
  //     setAccount(res.data.result.account_titles);
  //   } catch (error) {}
  // };

  useEffect(() => {
    fetchAccountApi();
  }, []);

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        rawMats: "",
        accountId: "",
        empId: "",
        fullName: "",
        addedBy: currentUser.fullName,
      },
    },
  });

  const triggerPointHandler = (event) => {
    const selectAccountTitle = account?.find((item) => {
      return item.syncId === parseInt(event);
    });

    if (!selectedAccount?.accountDescription?.match(/Advances to Employees/gi) || !selectedAccount?.accountDescription?.match(/Advances from Employees/gi)) {
      setIdNumber("");
      setValue("formData.empId", "");
      setValue("formData.fullName", "");
    }
    setSelectedAccount(selectAccountTitle?.accountDescription);
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
    console.log("material data: ", data);

    if (data) {
      const itemCode = data.value.itemCode;
      const itemDescription = data.value.itemDescription;
      const uom = data.value.uom;
      setReserve(data.value.remainingStocks);
      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        customerName: rawMatsInfo.customerName,
        uom: uom,
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
      });
    } else {
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        customerName: rawMatsInfo.customerName,
        uom: "",
        warehouseId: rawMatsInfo.warehouseId,
        quantity: rawMatsInfo.quantity,
      });
    }
  };

  const barcodeNoHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      const warehouseId = newData.warehouseId;
      setAvailableStock(newData.remainingStocks);
      setUnitCost(newData.unitCost);
      setWarehouseId(warehouseId);
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: rawMatsInfo.customerName,
        uom: rawMatsInfo.uom,
        warehouseId: warehouseId,
        quantity: rawMatsInfo.quantity,
      });
    } else {
      setAvailableStock("");
      setUnitCost("");
      setWarehouseId("");
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: rawMatsInfo.customerName,
        uom: rawMatsInfo.uom,
        warehouseId: "",
        quantity: rawMatsInfo.quantity,
      });
    }
  };

  useEffect(() => {
    setAvailableStock("");
    setUnitCost("");
  }, [rawMatsInfo.itemCode]);

  const newDate = new Date();
  const minDate = moment(newDate).format("yyyy-MM-DD");

  const closeHandler = () => {
    setRawMatsInfo({
      itemCode: "",
      itemDescription: "",
      customerName: rawMatsInfo.customerName,
      uom: "",
      warehouseId: "",
      quantity: "",
    });
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text> Materials Information</Text>
              <Text fontSize="xs">Miscellaneous Issue</Text>
            </VStack>
          </ModalHeader>

          <ModalBody mb={5}>
            <Flex w="95%" justifyContent="space-between">
              <VStack alignItems="start" w="full" mx={5}>
                {/* Item Code */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Item Code:{" "}
                  </Text>
                  {rawMats?.length > 0 ? (
                    <Controller
                      control={control}
                      name="formData.rawMats"
                      render={({ field }) => (
                        <AutoComplete
                          className="react-select-layout"
                          ref={field.ref}
                          value={field.value}
                          size="sm"
                          placeholder="Select item code"
                          onChange={(e) => {
                            field.onChange(e);
                            itemCodeHandler(e);
                          }}
                          options={rawMats?.map((item) => {
                            return {
                              label: `${item.itemCode}`,
                              value: item,
                            };
                          })}
                        />
                      )}
                    />
                  ) : (
                    <Spinner emptyColor="gray.200" color="blue.500" />
                  )}
                </HStack>

                {/* Barcode No */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Barcode Number:{" "}
                  </Text>
                  <Select
                    fontSize="sm"
                    onChange={(e) => barcodeNoHandler(e.target.value)}
                    w="full"
                    placeholder="Select Barcode"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    // bgColor="#fff8dc"
                  >
                    {barcodeNo?.map((item, i) => (
                      <option key={i} value={JSON.stringify(item)}>
                        {item.warehouseId}
                      </option>
                    ))}
                  </Select>
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
                        customerName: rawMatsInfo.customerName,
                        uom: rawMatsInfo.uom,
                        warehouseId: rawMatsInfo.warehouseId,
                        quantity: Number(e?.value),
                      })
                    }
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                    min="1"
                    w="full"
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
                              triggerPointHandler(e?.value.syncId);
                            }}
                            options={account?.map((item) => {
                              return {
                                label: `${item.accountCode} - ${item.accountDescription}`,
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

              <VStack alignItems="start" w="full" mx={5}>
                {/* Item Description */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Item Description:{" "}
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {rawMatsInfo.itemDescription ? rawMatsInfo.itemDescription : "Select an item code"}
                  </Text>
                </HStack>

                {/* UOM */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    UOM:{" "}
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {rawMatsInfo.uom ? rawMatsInfo.uom : "Select an item code"}
                  </Text>
                </HStack>

                {/* Reserve */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Reserve:{" "}
                  </Text>
                  {rawMats.length === 0 ? (
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      No Reserve
                    </Text>
                  ) : (
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {reserve
                        ? reserve.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : "Select an item code"}
                    </Text>
                  )}
                </HStack>

                {/* SOH */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Stock On Hand:{" "}
                  </Text>
                  {barcodeNo.length === 0 ? (
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      Select an item code
                    </Text>
                  ) : (
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {availableStock
                        ? availableStock.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : "Available Stocks"}
                    </Text>
                  )}
                </HStack>

                {/* Unit Cost */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Unit Cost:{" "}
                  </Text>
                  {barcodeNo.length === 0 ? (
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      Select a barcode number
                    </Text>
                  ) : (
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {unitCost
                        ? unitCost.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : "Select a barcode number"}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="xs">
              <Button
                onClick={openAddConfirmation}
                isDisabled={
                  !rawMatsInfo.itemCode ||
                  !rawMatsInfo.customerName ||
                  !rawMatsInfo.uom ||
                  !rawMatsInfo.warehouseId ||
                  !rawMatsInfo.quantity ||
                  !details ||
                  !watch("formData.accountId") ||
                  // !transactionDate ||
                  rawMatsInfo.quantity > availableStock ||
                  rawMatsInfo.quantity > reserve ||
                  reserve === 0
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
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          customerData={customerData}
          remarks={remarks}
          transactionDate={transactionDate}
          unitCost={unitCost}
          setUnitCost={setUnitCost}
          chargingAccountTitle={watch("formData")}
          chargingCoa={chargingCoa}
          setCoaData={setCoaData}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          fetchRawMats={fetchRawMats}
        />
      )}
    </>
  );
};
