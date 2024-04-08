import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
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
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { AddConfirmation } from "./ActionModal";
import { RiAddFill } from "react-icons/ri";
import { NumericFormat } from "react-number-format";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Select as AutoComplete } from "chakra-react-select";
import axios from "axios";
import { decodeUser } from "../../services/decode-user";

const schema = yup.object().shape({
  formData: yup.object().shape({
    empId: yup.object().required().label("Employee ID"),
    fullName: yup.string().required().label("Fullname"),
  }),
});

export const BorrowedInformation = ({
  rawMatsInfo,
  setRawMatsInfo,
  details,
  setDetails,
  customerRef,
  customers,
  rawMats,
  uoms,
  barcodeNo,
  setSelectorId,
  setWarehouseId,
  warehouseId,
  fetchActiveBorrowed,
  customerData,
  setCustomerData,
  remarks,
  setRemarks,
  transactionDate,
  setTransactionDate,
  unitCost,
  setUnitCost,
  fetchRawMats,
  itemCode,
  employeeData,
  setEmployeeData,
}) => {
  const [employees, setEmployees] = useState([]);
  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();
  const [disableFullName, setDisableFullName] = useState(true);

  const currentUser = decodeUser();

  const {
    isOpen: isModal,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://rdfsedar.com/api/data/employees", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_SEDAR_TOKEN,
        },
      });
      setEmployees(res.data.data);
    } catch (error) {}
  };

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
        empId: "",
        fullName: "",
        addedBy: currentUser.fullName,
      },
    },
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setInfo(
      employees
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name
            .toLowerCase()
            .includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

  const detailHandler = (data) => {
    if (data) {
      setDetails(data);
    } else {
      setDetails("");
    }
  };

  const customerHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      const customerCode = newData.customerCode;
      const customerName = newData.customerName;
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

  const newDate = moment();
  const maxDate = newDate.add(14, "days");

  if (employees.length <= 0) {
    return (
      <Flex
        width="full"
        height="full"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={1}
      >
        <Spinner
          thickness="4px"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text>Loading....</Text>
      </Flex>
    );
  }

  // console.log("Employee Data: ", employeeData);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <Box bgColor="primary" w="full" pl={2} h="30px" alignItems="center">
        <Flex flexDirection="row" justifyContent="space-around" gap={2}>
          <Text color="white" textAlign="center" fontSize="sm">
            Add Borrow Request
          </Text>
        </Flex>
      </Box>
      <VStack w="full" spacing={6}>
        <Text
          bgColor="secondary"
          w="full"
          color="white"
          textAlign="center"
          // fontWeight="semibold"
          fontSize="sm"
          p={2}
        >
          Customer Information
        </Text>
        <Flex w="95%" justifyContent="space-between">
          <VStack alignItems="start" w="40%" mx={5}>
            {/* Customer Code */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                fontSize="xs"
                pl={2}
                pr={10}
                py={2.5}
              >
                Customer:{" "}
              </Text>

              <Text
                fontSize="sm"
                w="full"
                border="1px"
                bg="gray.300"
                borderColor="gray.400"
                pl={4}
                py={2.5}
                // onChange={(e) => customerHandler(e.target.value)}
              >
                {customerData.customerCode
                  ? customerData.customerCode
                  : "Select a customer"}
              </Text>
            </HStack>

            {/* Customer Name */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                pl={2}
                pr={10}
                py={2.5}
                fontSize="xs"
              >
                Customer Name:{" "}
              </Text>
              <Text
                fontSize="sm"
                w="full"
                border="1px"
                bg="gray.300"
                borderColor="gray.400"
                pl={4}
                py={2.5}
              >
                {customerData.customerName
                  ? customerData.customerName
                  : "Select a customer"}
              </Text>
            </HStack>

            {/* Details */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                pl={2}
                pr={5}
                py={2.5}
                fontSize="xs"
              >
                Details:{" "}
              </Text>
              <Input
                fontSize="sm"
                onChange={(e) => detailHandler(e.target.value)}
                value={details}
                w="full"
                // bgColor="#fff8dc"
                border="1px"
                borderRadius="none"
                borderColor="gray.400"
              />
            </HStack>
          </VStack>

          <VStack alignItems="start" w="40%" mx={5}>
            {/* Transaction Date */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                pl={2}
                py={2.5}
                fontSize="xs"
              >
                Transaction Date:{" "}
              </Text>
              <Input
                type="date"
                fontSize="sm"
                pl={2}
                w="full"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                defaultValue={moment(new Date()).format("yyyy-MM-DD")}
                min={moment(new Date()).format("yyyy-MM-DD")}
                max={maxDate.format("yyyy-MM-DD")}
                // bgColor="#fff8dc"
                py={1.5}
                border="1px"
                borderRadius="none"
                borderColor="gray.400"
              />
            </HStack>

            {/* Employee ID*/}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                pl={2}
                py={2.5}
                fontSize="xs"
              >
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
                      options={employees?.map((item) => {
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

            {/* Fullname */}
            <HStack w="full">
              <Text
                minW="50%"
                w="auto"
                bgColor="primary"
                color="white"
                pl={2}
                py={2.5}
                fontSize="xs"
              >
                Fullname:{" "}
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
          </VStack>
        </Flex>

        <Flex w="full" justifyContent="end" mt={4}>
          <Button
            onClick={() => openModal()}
            isDisabled={
              // !rawMatsInfo.customerName ||
              !details ||
              !watch("formData.empId") ||
              !watch("formData.fullName") ||
              // !remarks ||
              !transactionDate
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
          details={details}
          setDetails={setDetails}
          customerRef={customerRef}
          rawMats={rawMats}
          uoms={uoms}
          barcodeNo={barcodeNo}
          setSelectorId={setSelectorId}
          customerData={customerData}
          setCustomerData={setCustomerData}
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          isOpen={isModal}
          onClose={closeModal}
          remarks={remarks}
          setRemarks={setRemarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          unitCost={unitCost}
          setUnitCost={setUnitCost}
          fetchActiveBorrowed={fetchActiveBorrowed}
          fetchRawMats={fetchRawMats}
          itemCode={itemCode}
          employeeFormData={watch("formData")}
          employeeData={employeeData}
          setEmployeeData={setEmployeeData}
        />
      )}
    </Flex>
  );
};

export const RawMatsInfoModal = ({
  isOpen,
  onClose,
  transactionDate,
  setTransactionDate,
  details,
  setDetails,
  rawMatsInfo,
  setRawMatsInfo,
  customerRef,
  rawMats,
  barcodeNo,
  setSelectorId,
  setCustomerData,
  setWarehouseId,
  warehouseId,
  fetchActiveBorrowed,
  customerData,
  remarks,
  setRemarks,
  unitCost,
  setUnitCost,
  fetchRawMats,
  itemCode,
  employeeFormData,
  employeeData,
  setEmployeeData,
}) => {
  const [availableStock, setAvailableStock] = useState("");
  const [reserve, setReserve] = useState("");
  const [barcode, setBarcode] = useState("");

  const schema = yup.object().shape({
    formData: yup.object().shape({
      rawMats: yup.object(),
    }),
  });

  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();
  const openAddConfirmation = () => {
    openAdd();
  };

  useEffect(() => {
    if (barcodeNo?.length) {
      const barcodeData = barcodeNo[0];
      setBarcode(JSON.stringify(barcodeData));
      setAvailableStock(barcodeData.remainingStocks);
      setUnitCost(barcodeData.unitCost);
      setWarehouseId(barcodeData.warehouseId);
      setRawMatsInfo({
        itemCode: rawMatsInfo.itemCode,
        itemDescription: rawMatsInfo.itemDescription,
        customerName: rawMatsInfo.customerName,
        uom: rawMatsInfo.uom,
        warehouseId: barcodeData.warehouseId,
        quantity: rawMatsInfo.quantity,
      });
    }
  }, [barcodeNo]);

  // console.log("Available: ", availableStock);
  // console.log("Unit Cost: ", unitCost);
  // console.log("Warehouse ID: ", warehouseId);
  // console.log("Raw Materials: ", rawMatsInfo);

  const itemCodeHandler = (data) => {
    if (data) {
      // const newData = JSON.parse(data);
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
    // console.log(data)
    if (data) {
      setBarcode(data);
      const newData = JSON.parse(data);
      // console.log(newData);
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
        rawMats: "",
      },
    },
  });

  const closeHandler = () => {
    setRawMatsInfo({
      itemCode: "",
      itemDescription: "",
      customerName: rawMatsInfo.customerName,
      uom: "",
      warehouseId: rawMatsInfo.warehouseId,
      quantity: rawMatsInfo.quantity,
    });
    onClose();
  };

  useEffect(() => {
    setAvailableStock("");
    setUnitCost("");
  }, [rawMatsInfo.itemCode]);

  const newDate = new Date();
  const minDate = moment(newDate).format("yyyy-MM-DD");

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text> Materials Information</Text>
              <Text fontSize="xs">Borrowed Materials</Text>
            </VStack>
          </ModalHeader>
          <ModalBody mb={5}>
            <Flex w="95%" justifyContent="space-between">
              <VStack alignItems="start" w="full" mx={5}>
                {/* Item Code */}
                <HStack w="full">
                  <Text
                    minW="25%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    Item Code:{" "}
                  </Text>

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
                            label: `${item.itemCode} - ${item.itemDescription}`,
                            value: item,
                          };
                        })}
                      />
                    )}
                  />
                </HStack>

                {/* Barcode No */}
                <HStack w="full">
                  <Text
                    minW="25%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Barcode Number:{" "}
                  </Text>
                  <Select
                    fontSize="sm"
                    onChange={(e) => barcodeNoHandler(e.target.value)}
                    w="full"
                    placeholder=""
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    value={barcode}
                  >
                    {barcodeNo?.map((item, i) => (
                      <option key={i} value={JSON.stringify(item)}>
                        {item?.warehouseId}
                      </option>
                    ))}
                  </Select>
                </HStack>

                {/* Quantity */}
                <HStack w="full">
                  <Text
                    minW="25%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
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
                        quantity: Number(e.value),
                      })
                    }
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    onPaste={(e) => e.preventDefault()}
                    min="1"
                    w="full"
                    placeholder="Enter Quantity"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    thousandSeparator=","
                  />
                </HStack>
              </VStack>

              <VStack alignItems="start" w="full" mx={5}>
                {/* Item Description */}
                <HStack w="full">
                  <Text
                    minW="30%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    Item Description:{" "}
                  </Text>
                  <Text
                    fontSize="sm"
                    textAlign="left"
                    bgColor="gray.200"
                    w="full"
                    border="1px"
                    borderColor="gray.200"
                    py={1.5}
                    px={4}
                  >
                    {rawMatsInfo.itemDescription
                      ? rawMatsInfo.itemDescription
                      : "Select an item code"}
                  </Text>
                </HStack>

                {/* UOM */}
                <HStack w="full">
                  <Text
                    minW="30%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    UOM:{" "}
                  </Text>
                  <Text
                    fontSize="sm"
                    textAlign="left"
                    bgColor="gray.200"
                    w="full"
                    border="1px"
                    borderColor="gray.200"
                    py={1.5}
                    px={4}
                  >
                    {rawMatsInfo.uom ? rawMatsInfo.uom : "Select an item code"}
                  </Text>
                </HStack>

                {/* Reserve */}
                <HStack w="full">
                  <Text
                    minW="30%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    Available stocks:{" "}
                  </Text>
                  {rawMats.length === 0 ? (
                    <Text
                      textAlign="center"
                      fontSize="xs"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                    >
                      No stock
                    </Text>
                  ) : (
                    <Text
                      fontSize="sm"
                      textAlign="left"
                      bgColor="gray.200"
                      w="full"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                      px={4}
                    >
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
                  <Text
                    minW="30%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    SOH per Barcode:{" "}
                  </Text>
                  {barcodeNo.length === 0 ? (
                    <Text
                      fontSize="sm"
                      textAlign="left"
                      bgColor="gray.200"
                      w="full"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                      px={4}
                    >
                      No Stock on Hand
                    </Text>
                  ) : (
                    <Text
                      textAlign="left"
                      fontSize="sm"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                      px={4}
                    >
                      {availableStock
                        ? availableStock.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : "Select a barcode number"}
                    </Text>
                  )}
                </HStack>

                {/* Unit Cost */}
                <HStack w="full">
                  <Text
                    minW="30%"
                    w="auto"
                    bgColor="primary"
                    color="white"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    Unit Cost:{" "}
                  </Text>
                  {barcodeNo.length === 0 ? (
                    <Text
                      fontSize="sm"
                      textAlign="left"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                      px={4}
                    >
                      Select a barcode number
                    </Text>
                  ) : (
                    <Text
                      textAlign="left"
                      fontSize="sm"
                      w="full"
                      bgColor="gray.200"
                      border="1px"
                      borderColor="gray.200"
                      py={1.5}
                      px={4}
                    >
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
              <Button variant="outline" onClick={closeHandler}>
                Cancel
              </Button>

              <Button
                onClick={openAddConfirmation}
                isDisabled={
                  !rawMatsInfo.itemCode ||
                  // !rawMatsInfo.customerName ||
                  !rawMatsInfo.uom ||
                  !rawMatsInfo.warehouseId ||
                  !rawMatsInfo.quantity ||
                  !details ||
                  rawMatsInfo.quantity > availableStock ||
                  rawMatsInfo.quantity > reserve ||
                  reserve === 0
                }
                colorScheme="blue"
                px={4}
              >
                Add
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
          customerRef={customerRef}
          setSelectorId={setSelectorId}
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          customerData={customerData}
          remarks={remarks}
          setRemarks={setRemarks}
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          unitCost={unitCost}
          setUnitCost={setUnitCost}
          fetchActiveBorrowed={fetchActiveBorrowed}
          fetchRawMats={fetchRawMats}
          employeeFormData={employeeFormData}
          employeeData={employeeData}
          setEmployeeData={setEmployeeData}
        />
      )}
    </>
  );
};
