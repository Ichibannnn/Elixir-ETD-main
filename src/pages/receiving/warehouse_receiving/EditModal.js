import {
  Button,
  Flex,
  FormLabel,
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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";

// import request from '../../../services/ApiClient'
import moment from "moment";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
import EditAddRejectionModal from "./EditAddRejectionModal";
import { ReceivingContext } from "../../../components/context/ReceivingContext";
import EditModalSave from "./EditModalSave";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import { NumericFormat } from "react-number-format";
import { Select as AutoComplete } from "chakra-react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const currentUser = decodeUser();

const fetchLotCategoryApi = async () => {
  const res = await request.get("Lot/GetAllActiveLotNames");
  return res.data;
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    lotCategories: yup.object(),
  }),
});

export const EditModal = ({
  editData,
  isOpen,
  onClose,
  getAvailablePOHandler,
  setReceivingDate,
  lotCategory,
  receivingDate,
  actualGood,
  setActualGood,
  setReceivingId,
  receivingId,
  unitPrice,
  setUnitPrice,
}) => {
  const [actualDelivered, setActualDelivered] = useState(null);
  const [siNumber, setSINumber] = useState(null);

  const [lotSection, setLotSection] = useState(null);
  const [expectedDelivery, setExpectedDelivery] = useState(null);
  const toast = useToast();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [quantity, setQuantity] = useState(undefined);

  const [sumQuantity, setSumQuantity] = useState(0);
  const [submitDataThree, setSubmitDataThree] = useState([]);
  const [submitDataTwo, setSubmitDataTwo] = useState([]);
  const [lotCategories, setLotCategories] = useState([]);
  const [receivingDateDisplay, setReceivingDateDisplay] = useState(null);
  const [disableQuantity, setDisableQuantity] = useState(0);

  // FETCH LOT CATEGORY
  const fetchLotCategory = async () => {
    fetchLotCategoryApi().then((res) => {
      setLotCategories(res);
    });
  };

  useEffect(() => {
    fetchLotCategory();
  }, [setLotCategories]);

  const {
    register,
    control,
    // formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      submitData: {
        po_summary_id: editData.id,
        expected_delivery: "",
        actual_delivered: "",
        si_number: "",
        addedBy: currentUser.fullName,
      },
      formData: {
        lotCategories: "",
      },
      displayData: {
        id: editData.id,
        prNumber: editData.prNumber,
        prDate: moment(editData.prDate).format("MM/DD/YYYY"),
        poNumber: editData.poNumber,
        poDate: moment(editData.poDate).format("MM/DD/YYYY"),
        itemCode: editData.itemCode,
        itemDescription: editData.itemDescription,
        supplier: editData.supplier,
        uom: editData.uom,
        quantityOrdered: editData.quantityOrdered.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
        actualGood: editData.actualGood.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
        unitPrice: editData.unitPrice.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }),
        checkingDate: moment().format("MM/DD/YYYY"),
        actualRemaining: editData.actualRemaining.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
      },
    },
  });

  const expectedDeliveryRef = useRef();

  const expectedDeliveryProvider = (data) => {
    // if (data > actualDelivered) {
    //   setExpectedDelivery("");
    //   ToastComponent("Warning!", "Amount is greater than actual delivered", "warning", toast);
    //   expectedDeliveryRef.current.value = "";
    // } else {
    //   setExpectedDelivery(data);
    // }

    if (data < 1) {
      setExpectedDelivery("");
      expectedDeliveryRef.current.value = "";
    } else {
      setExpectedDelivery(data);
    }
  };

  useEffect(() => {
    if (expectedDelivery > actualDelivered) {
      setExpectedDelivery("");
      expectedDeliveryRef.current.value = "";
      ToastComponent("Warning!", "Amount is greater than actual delivered", "warning", toast);
    }
  }, [expectedDelivery, actualDelivered]);

  const lotSectionProvider = (data) => {
    console.log("Controller: ", data.value.sectionName);
    setLotSection(data.value.sectionName);
  };

  const actualDeliveredRef = useRef();

  // const actualDeliveredProvider = (data) => {
  //   const allowablePercent = editData.quantityOrdered * 1.1;
  //   const allowableAmount = allowablePercent - editData.actualGood;
  //   if (data > allowableAmount) {
  //     setActualDelivered("");
  //     ToastComponent("Warning!", "Amount is greater than allowable", "warning", toast);
  //     actualDeliveredRef.current.value = "";
  //   } else {
  //     setActualDelivered(data);
  //   }

  //   if (data < 1) {
  //     setActualDelivered("");
  //     actualDeliveredRef.current.value = "";
  //   } else {
  //     setActualDelivered(data);
  //   }
  // };

  const actualDeliveredProvider = (data) => {
    // const allowablePercent = editData.quantityOrdered * 1.1;
    // const allowableAmount = allowablePercent - editData.actualGood;

    if (data > editData.actualRemaining) {
      setActualDelivered("");
      ToastComponent("Warning!", "Amount is greater than actual remaining", "warning", toast);
      actualDeliveredRef.current.value = "";
    } else {
      setActualDelivered(data);
    }

    if (data < 1) {
      setActualDelivered("");
      actualDeliveredRef.current.value = "";
    } else {
      setActualDelivered(data);
    }
  };

  const siNumberProvider = (data) => {
    setSINumber(data);
    // console.log(siNumber);
  };

  const unitPriceRef = useRef();
  const unitPriceProvider = (data) => {
    if (data < 1) {
      setUnitPrice("");
      unitPriceRef.current.value = "";
    } else {
      setUnitPrice(data);
    }
  };

  let submitDataOne = {
    poSummaryId: editData.id,
    poNumber: editData.poNumber,
    itemCode: editData.itemCode,
    itemDescription: editData.itemDescription,
    expectedDelivery: Number(expectedDelivery),
    actualDelivered: Number(actualDelivered),
    uom: editData.uom,
    supplier: editData.supplier,
    actualDelivered: Number(actualDelivered),
    unitPrice: unitPrice,
    siNumber: siNumber,
    totalReject: sumQuantity,
    addedBy: currentUser.fullName,
    lotSection: lotSection,
  };

  useEffect(() => {
    setActualGood(editData.actualDelivered - sumQuantity);
  }, [sumQuantity]);

  useEffect(() => {}, [receivingDate]);

  const receivingDateProvider = (event) => {
    const data = event.target.value;
    if (data) {
      setReceivingDateDisplay(data);
      const newData = moment(data).format("yyyy-MM-DD");
      setReceivingDate(newData);
    } else {
      setReceivingDateDisplay(null);
      setReceivingDate(null);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#ffffe0",
    }),
  };

  return (
    <ReceivingContext.Provider
      value={{
        setSumQuantity,
        setSubmitDataTwo,
        setSubmitDataThree,
        setReceivingId,
      }}
    >
      <Flex>
        <Modal size="5xl" isOpen={isOpen} onClose={() => {}} isCentered>
          <ModalOverlay />
          <ModalContent h="95vh">
            <ModalHeader h="130px" boxShadow="xl" bg="primary" color="white">
              <Flex justifyContent="left">
                <Text fontSize="15px" letterSpacing="1px">
                  WAREHOUSE RECEIVING
                </Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton onClick={onClose} color="white" />
            <ModalBody bg="#F8FAFC">
              <PageScroll minHeight="780px" maxHeight="800px">
                <Stack spacing={2}>
                  <Flex justifyContent="left" p={1} bg="primary">
                    <Text fontSize="13px" fontWeight="semibold" color="white">
                      MATERIALS INFORMATION
                    </Text>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      Item Code
                      <Input {...register("displayData.itemCode")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                    <FormLabel w="50%" fontSize="12px">
                      Description
                      <Input {...register("displayData.itemDescription")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent="space-between" mt={2} p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      Supplier
                      <Input {...register("displayData.supplier")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                    <FormLabel w="50%" fontSize="12px">
                      Date of Checking
                      <Input {...register("displayData.checkingDate")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                  </Flex>
                </Stack>

                <Stack spacing={1} mt={2}>
                  <Flex justifyContent="left" p={1} bg="primary">
                    <Text fontSize="13px" fontWeight="semibold" color="white">
                      RECEIVING INFORMATION
                    </Text>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      PO Number
                      <Input {...register("displayData.poNumber")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                    <FormLabel w="50%" fontSize="12px">
                      PO Date
                      <Input {...register("displayData.poDate")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      PR Number
                      <Input {...register("displayData.prNumber")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                    <FormLabel w="50%" fontSize="12px">
                      PR Date
                      <Input {...register("displayData.prDate")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="100%" fontSize="12px">
                      UOM
                      <Input {...register("displayData.uom")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>

                    <FormLabel w="100%" fontSize="12px">
                      Unit Cost
                      <Input
                        {...register("displayData.unitPrice")}
                        fontSize="13px"
                        size="sm"
                        placeholder="Unit Cost"
                        bgColor="#ffffe0"
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                        min="1"
                        onChange={(e) => unitPriceProvider(e.target.value)}
                        value={unitPrice}
                        ref={unitPriceRef}
                      />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      Qty. Ordered
                      <Input {...register("displayData.quantityOrdered")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>

                    <FormLabel w="50%" fontSize="12px">
                      Actual Remaining
                      <Input {...register("displayData.actualRemaining")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      Expected Delivery
                      <Input
                        {...register("submitData.expected_delivery")}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                        min="1"
                        fontSize="13px"
                        size="sm"
                        placeholder="Please provide quantity of expected delivery  (Required)"
                        bgColor="#ffffe0"
                        onChange={(e) => expectedDeliveryProvider(e.target.value)}
                        ref={expectedDeliveryRef}
                      />
                    </FormLabel>
                    <FormLabel w="50%" fontSize="12px">
                      Qty Actual Delivered
                      <Input
                        {...register("submitData.actualDelivered")}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                        min="1"
                        fontSize="13px"
                        size="sm"
                        placeholder="Please enter quantity (Required)"
                        bgColor="#ffffe0"
                        onChange={(e) => actualDeliveredProvider(e.target.value)}
                        ref={actualDeliveredRef}
                      />
                    </FormLabel>

                    <FormLabel w="50%" fontSize="12px">
                      SI Number
                      <Input
                        fontSize="13px"
                        size="sm"
                        placeholder="SI Number (Optional)"
                        // bgColor="white"
                        bgColor="#ffffe0"
                        onChange={(e) => siNumberProvider(e.target.value)}
                      />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      Receiving Date
                      <Input
                        size="sm"
                        border="1px"
                        borderColor="gray.400"
                        fontSize="13px"
                        bgColor="#ffffe0"
                        onChange={receivingDateProvider}
                        min={moment(new Date(new Date().setDate(new Date().getDate() - 3))).format("yyyy-MM-DD")}
                        max={moment(new Date()).format("yyyy-MM-DD")}
                        type="date"
                      />
                    </FormLabel>

                    <FormLabel w="50%" fontSize="12px">
                      LOT Section
                      {/* {lotCategories.length > 0 ? (
                        <Select
                          size="sm"
                          fontSize="13px"
                          onChange={(e) => lotSectionProvider(e.target.value)}
                          disabled={!receivingDate}
                          placeholder="Select a lot section"
                          title={
                            !receivingDate
                              ? "Please provide a Receiving Date first"
                              : "Select a lot section"
                          }
                          bgColor="#ffffe0"
                        >
                          {lotCategories?.map((lot) => (
                            <option key={lot.id} value={lot.sectionName}>
                              {lot.sectionName}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        "Loading"
                      )} */}
                      <Controller
                        control={control}
                        name="formData.lotCategories"
                        render={({ field }) => (
                          <AutoComplete
                            // className="react-select-layout"
                            className="chakra-react-select"
                            classNamePrefix="chakra-react-select"
                            variant="filled"
                            ref={field.ref}
                            value={field.value}
                            isDisabled={!receivingDate}
                            size="sm"
                            placeholder="Select Lot Section"
                            onChange={(e) => {
                              field.onChange(e);
                              lotSectionProvider(e);
                            }}
                            options={lotCategories?.map((item) => {
                              return {
                                label: `${item.sectionName}`,
                                value: item,
                              };
                            })}
                          />
                        )}
                      />
                    </FormLabel>
                  </Flex>
                </Stack>

                <Stack spacing={2} bg="gray.200" mt={2}>
                  <EditAddRejectionModal
                    sumQuantity={sumQuantity}
                    receivingId={receivingId}
                    actualGood={actualGood}
                    setDisableQuantity={setDisableQuantity}
                    disableQuantity={disableQuantity}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    actualDelivered={actualDelivered}
                  />
                </Stack>
              </PageScroll>
            </ModalBody>

            <ModalFooter bg="#F8FAFC" h="50px">
              <EditModalSave
                quantity={quantity}
                sumQuantity={sumQuantity}
                po_ReceivingId={submitDataOne.poSummaryId}
                submitDataOne={submitDataOne}
                // submitUnitPriceNull={submitUnitPriceNull}
                submitDataTwo={submitDataTwo}
                submitDataThree={submitDataThree}
                expectedDelivery={expectedDelivery}
                actualDelivered={actualDelivered}
                getAvailablePOHandler={getAvailablePOHandler}
                siNumber={siNumber}
                unitPrice={unitPrice}
                isSubmitDisabled={isSubmitDisabled}
                closeModal={onClose}
                editData={editData}
                receivingDate={receivingDate}
                setReceivingDate={setReceivingDate}
                lotSection={lotSection}
                lotCategory={lotCategory}
                setDisableQuantity={setDisableQuantity}
                disableQuantity={disableQuantity}
                receivingId={receivingId}
                setReceivingId={setReceivingId}
                // isValid={isValid}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </ReceivingContext.Provider>
  );
};
