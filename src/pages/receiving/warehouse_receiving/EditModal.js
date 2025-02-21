import { Flex, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { Select as AutoComplete } from "chakra-react-select";

import request from "../../../services/ApiClient";
import moment from "moment";
import { ToastComponent } from "../../../components/Toast";
import { decodeUser } from "../../../services/decode-user";
import { ReceivingContext } from "../../../components/context/ReceivingContext";
import PageScroll from "../../../utils/PageScroll";

import EditAddRejectionModal from "./EditAddRejectionModal";
import EditModalSave from "./EditModalSave";

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
  receivingDate,
  setReceivingDate,
  lotCategory,
  actualGood,
  setActualGood,
  setReceivingId,
  receivingId,
  unitPrice,
  setUnitPrice,
  fromYmir,
}) => {
  const [actualDelivered, setActualDelivered] = useState(null);

  const [lotSection, setLotSection] = useState(null);
  const toast = useToast();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [quantity, setQuantity] = useState(undefined);

  const [sumQuantity, setSumQuantity] = useState(0);
  const [submitDataThree, setSubmitDataThree] = useState([]);
  const [submitDataTwo, setSubmitDataTwo] = useState([]);
  const [lotCategories, setLotCategories] = useState([]);

  const [siNumber, setSINumber] = useState(null);

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
    setValue,
    watch,
    // formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      submitData: {
        po_summary_id: editData.id,
        expected_delivery: "",
        actual_delivered: editData.siNumber
          ? editData.actualRemaining.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })
          : "",
        si_number: "",
        addedBy: currentUser.fullName,
      },
      formData: {
        lotCategories: null,
      },
      displayData: {
        id: editData.id,

        rrNumber: editData.rrNumber,
        rrDate: moment(editData.rrDate).format("MM/DD/YYYY"),

        unitPrice: editData.unitPrice.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),

        actualDelivered: editData?.siNumber
          ? editData.quantityDelivered.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })
          : "",

        siNumber: editData.siNumber ? editData.siNumber : null,
        receiveDate: editData.siNumber ? moment(editData.receiveDate).format("MM/DD/YYYY") : null,

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

        checkingDate: moment().format("MM/DD/YYYY"),
        actualRemaining: editData.actualRemaining?.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
        lotSection: editData.lotSection === null ? "Setup a lot section for this material before receiving" : editData.lotSection,
      },
    },
  });

  // console.log("Edit Data: ", editData);
  // console.log("Display Data: ", watch("displayData"));

  const expectedDeliveryRef = useRef();
  const actualDeliveredRef = useRef();

  const lotSectionProvider = (data) => {
    setLotSection(data.value.sectionName);
  };

  // ALLOWABLE -----------
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

  useEffect(() => {
    if (fromYmir) {
      unitPriceProvider(editData.unitPrice);
      actualDeliveredProvider(editData.quantityDelivered);
      setReceivingDate(moment(editData.receivingDate).format("MM/DD/YYYY"));
      siNumberProvider(editData.siNumber);
    }
  }, []);

  const actualDeliveredProvider = (data) => {
    if (data > editData.actualRemaining) {
      setActualDelivered("");
      ToastComponent("Warning!", "Actual delivered is greater than actual remaining", "warning", toast);
    } else {
      setActualDelivered(data);
    }
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
    uom: editData.uom,
    supplier: editData.supplier,

    rrNo: editData.rrNumber,
    rrDate: moment(editData.rrDate).format("MM/DD/YYYY"),

    unitPrice: editData.siNumber ? editData.unitPrice : unitPrice,
    siNumber: editData.siNumber ? editData.siNumber : siNumber,
    actualDelivered: editData.siNumber ? editData.quantityDelivered : Number(actualDelivered),
    // actualReceiving: editData.quantityDelivered,
    receivingDate: editData.receiveDate ? moment(editData.receiveDate).format("MM/DD/YYYY") : receivingDate,
    actualReceivingDate: editData.receiveDate ? moment(editData.receiveDate).format("MM/DD/YYYY") : receivingDate,

    totalReject: sumQuantity,
    addedBy: currentUser.fullName,
    lotSection: lotSection,
  };

  useEffect(() => {
    setActualGood(editData.actualDelivered - sumQuantity);
  }, [sumQuantity]);

  useEffect(() => {
    if (editData) {
      setValue("formData.lotCategories", {
        label: editData?.lotSection,
        value: {
          id: editData?.lotSection,
        },
      });

      setLotSection(editData.lotSection);
    }
  }, [editData]);

  const siNumberProvider = (data) => {
    setSINumber(data);
  };

  const receivingDateProvider = (event) => {
    const data = event.target.value;

    console.log("Data: ", data);

    if (data) {
      const newData = moment(data).format("MM/DD/YYYY");
      setReceivingDate(newData);
    } else {
      setReceivingDate(null);
    }
  };

  // console.log("Receiving date: ", receivingDate);

  const closeModalHandler = () => {
    setReceivingDate(null);
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
        <Modal size="5xl" isOpen={isOpen} onClose={() => closeModalHandler()} isCentered>
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

                  {/* <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      RR Number
                      <Input {...register("displayData.rrNumber")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                    <FormLabel w="50%" fontSize="12px">
                      RR Date
                      <Input {...register("displayData.rrDate")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                    </FormLabel>
                  </Flex> */}

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
                      {/* <Input
                        {...register("displayData.unitPrice")}
                        fontSize="13px"
                        size="sm"
                        placeholder="Unit Cost"
                        bgColor="#ffffe0"
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        // onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                        min="1"
                        onChange={(e) => unitPriceProvider(e.target.value)}
                        value={unitPrice}
                        ref={unitPriceRef}
                      /> */}
                      <Input
                        {...register("displayData.unitPrice")}
                        placeholder="Please enter unit cost (Required)"
                        disabled={editData.siNumber ? true : false}
                        readOnly={editData.siNumber ? true : false}
                        _disabled={{ color: "black" }}
                        fontSize="13px"
                        size="sm"
                        bg={editData.siNumber ? "gray.300" : "#ffffe0"}
                        // editable
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        autoComplete="off"
                        min="1"
                        onChange={(e) => unitPriceProvider(Number(e.target.value))}
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
                    {/* ExpectedDelivery */}
                    {/* <FormLabel w="50%" fontSize="12px">
                      Expected Delivery
                      <Input {...register("displayData.expectedDelivery")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" />
                      
                      <Input
                        {...register("submitData.expected_delivery")}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        // onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                        min="1"
                        fontSize="13px"
                        size="sm"
                        placeholder="Please provide quantity of expected delivery  (Required)"
                        bgColor="#ffffe0"
                        onChange={(e) => expectedDeliveryProvider(e.target.value)}
                        ref={expectedDeliveryRef}
                      />
                    </FormLabel> */}

                    <FormLabel w="50%" fontSize="12px">
                      Qty Actual Delivered
                      <Input
                        {...register("displayData.actualDelivered")}
                        placeholder="Please enter quantity (Required)"
                        disabled={editData.siNumber ? true : false}
                        readOnly={editData.siNumber ? true : false}
                        _disabled={{ color: "black" }}
                        fontSize="13px"
                        size="sm"
                        bg={editData.siNumber ? "gray.300" : "#ffffe0"}
                        // editable
                        // type="number"
                        min="1"
                        autoComplete="off"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        onChange={(e) => actualDeliveredProvider(Number(e.target.value))}
                        // ref={actualDeliveredRef}
                      />
                      {/* <Input
                        {...register("submitData.actualDelivered")}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        // onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                        min="1"
                        fontSize="13px"
                        size="sm"
                        placeholder="Please enter quantity (Required)"
                        bgColor="#ffffe0"
                        onChange={(e) => actualDeliveredProvider(e.target.value)}
                        ref={actualDeliveredRef}
                      /> */}
                    </FormLabel>

                    <FormLabel w="50%" fontSize="12px">
                      SI Number
                      <Input
                        {...register("displayData.siNumber")}
                        placeholder="Please enter SI Number (Required)"
                        disabled={editData.siNumber ? true : false}
                        readOnly={editData.siNumber ? true : false}
                        _disabled={{ color: "black" }}
                        autoComplete="off"
                        fontSize="13px"
                        size="sm"
                        bg={editData.siNumber ? "gray.300" : "#ffffe0"}
                        onChange={(e) => siNumberProvider(e.target.value)}
                      />
                      {/* <Input
                        fontSize="13px"
                        size="sm"
                        placeholder="Enter SI Number"
                        // bgColor="white"
                        bgColor="#ffffe0"
                        onChange={(e) => siNumberProvider(e.target.value)}
                      /> */}
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent="space-between" p={1}>
                    <FormLabel w="50%" fontSize="12px">
                      Receiving Date
                      {/* <Input {...register("displayData.receiveDate")} disabled={true} readOnly={true} _disabled={{ color: "black" }} fontSize="13px" size="sm" bg="gray.300" /> */}
                      <Input
                        {...register("displayData.receiveDate")}
                        disabled={editData.receiveDate ? true : false}
                        readOnly={editData.receiveDate ? true : false}
                        _disabled={{ color: "black" }}
                        fontSize="13px"
                        size="sm"
                        bg={editData.receiveDate ? "gray.300" : "#ffffe0"}
                        type={editData.receiveDate ? "text" : "date"}
                        onChange={receivingDateProvider}
                      />
                      {/* <Input
                        size="sm"
                        border="1px"
                        borderColor="gray.400"
                        fontSize="13px"
                        bgColor="#ffffe0"
                        onChange={receivingDateProvider}
                        min={moment(new Date(new Date().setDate(new Date().getDate() - 3))).format("yyyy-MM-DD")}
                        max={moment(new Date()).format("yyyy-MM-DD")}
                        type="date"
                      /> */}
                    </FormLabel>

                    <FormLabel w="50%" fontSize="12px">
                      LOT Section
                      <Controller
                        control={control}
                        name="formData.lotCategories"
                        render={({ field }) => (
                          <AutoComplete
                            className="chakra-react-select"
                            classNamePrefix="chakra-react-select"
                            variant="filled"
                            ref={field.ref}
                            value={field.value}
                            isDisabled={watch("formData.lotCategories")?.label === null && receivingDate === null}
                            size="sm"
                            placeholder={watch("formData.lotCategories")?.label === null && !receivingDate ? "Select Lot Section" : "Select Lot Section"}
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

                {/* REMOVED REJECT PO */}
                {/* <Stack spacing={2} bg="gray.200" mt={2}>
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
                </Stack> */}
              </PageScroll>
            </ModalBody>

            <ModalFooter bg="#F8FAFC" h="50px">
              <EditModalSave
                sumQuantity={sumQuantity}
                po_ReceivingId={submitDataOne.poSummaryId}
                submitDataOne={submitDataOne}
                submitDataTwo={submitDataTwo}
                submitDataThree={submitDataThree}
                actualDelivered={actualDelivered}
                getAvailablePOHandler={getAvailablePOHandler}
                unitPrice={unitPrice}
                isSubmitDisabled={isSubmitDisabled}
                closeModal={onClose}
                editData={editData}
                siNumber={siNumber}
                setSINumber={setSINumber}
                receivingDate={receivingDate}
                setReceivingDate={setReceivingDate}
                lotSection={lotSection}
                lotCategory={lotCategory}
                receivingId={receivingId}
                setReceivingId={setReceivingId}
                // display data
                formData={watch("displayData")}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </ReceivingContext.Provider>
  );
};
