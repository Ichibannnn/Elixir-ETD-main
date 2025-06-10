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
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiQuestionnaireLine } from "react-icons/ri";

import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import { decodeUser } from "../../services/decode-user";
import { Select as AutoComplete } from "chakra-react-select";

import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { set } from "lodash";

const currentUser = decodeUser();

//Cancel Approved Date
export const CancelApprovedDate = ({ isOpen, onClose, id, setOrderId, fetchApprovedMoveOrders, fetchNotification }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    console.log(id);
    try {
      const res = request
        .put(`Ordering/CancelOrdersInMoveOrder`, [{ trasactId: id }])
        .then((res) => {
          ToastComponent("Success", "Successfully cancelled approved date", "success", toast);
          setOrderId("");
          fetchApprovedMoveOrders();
          fetchNotification();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want to cancel this approved date for re-scheduling?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter mt={10} justifyContent="center">
            <ButtonGroup size="sm" mt={3}>
              <Button onClick={submitHandler} isLoading={isLoading} isDisabled={isLoading} colorScheme="blue" px={4}>
                Yes
              </Button>
              <Button onClick={onClose} isLoading={isLoading} disabled={isLoading} colorScheme="red" px={4}>
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Save Button
export const SaveButton = ({
  orderId,
  deliveryStatus,
  batchNumber,
  orderListData,
  fetchApprovedMoveOrders,
  fetchOrderList,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setDeliveryStatus,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  fetchNotification,
  moveData,
}) => {
  const { isOpen: isPlateNumber, onClose: closePlateNumber, onOpen: openPlateNumber } = useDisclosure();

  return (
    <Flex w="full" justifyContent="end">
      <Button
        onClick={() => openPlateNumber()}
        title={deliveryStatus ? `Save with delivery status "${deliveryStatus}" and batch number "${batchNumber}"` : "Please select a delivery status and batch number."}
        size="xs"
        colorScheme="blue"
        px={6}
      >
        Save
      </Button>
      {
        <AccountTitleModal
          orderId={orderId}
          isOpen={isPlateNumber}
          onClose={closePlateNumber}
          orderListData={orderListData}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          fetchOrderList={fetchOrderList}
          setOrderId={setOrderId}
          setHighlighterId={setHighlighterId}
          setItemCode={setItemCode}
          setDeliveryStatus={setDeliveryStatus}
          setButtonChanger={setButtonChanger}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchNotification={fetchNotification}
          moveData={moveData}
        />
      }
    </Flex>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    orderId: yup.string(),
    companyId: yup.object().required().typeError("Company Name is required"),
    businessUnit: yup.object().required().typeError("Business Unit is required"),
    departmentId: yup.object().required().typeError("Department Category is required"),
    unit: yup.object().required().typeError("Business Unit is required"),
    subUnit: yup.object().required().typeError("Business Unit is required"),
    locationId: yup.object().required().typeError("Location Name is required"),
  }),
});

//ACCOUNT TITLE
export const AccountTitleModal = ({
  orderId,
  isOpen,
  onClose,
  fetchApprovedMoveOrders,
  fetchOrderList,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  moveData,
  fetchNotification,
  orderListData,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [oneChargingData, setOneChargingData] = useState("");

  // FETCH SEDAR EMPLOYEE ID
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

  const userToken = decodeUser();

  useEffect(() => {
    fecthOneCharging();
  }, []);

  //one charging
  const fecthOneCharging = async () => {
    try {
      const res = await axios.get("https://10.10.10.14:7001/api/OneCharging/GetOneCharging?UsePagination=false", {
        headers: {
          Authorization: "Bearer " + userToken?.token,
        },
      });
      // setCompany(res.data.result.companies);

      const charging = moveData?.orders?.find((item) => item?.id === orderId);
      setOneChargingData(res.data.oneChargingList?.find((item) => item.code === charging?.oneChargingCode));

      // console.log(res.data.oneChargingList?.find((item) => item.code === charging?.oneChargingCode));
    } catch (error) {}
  };

  console.log("oneChargingData: ", oneChargingData);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        orderNo: orderId,
        companyId: "",
        departmentId: "",
        locationId: "",
        preparedBy: currentUser.fullName,
      },
    },
  });

  const submitHandler = async () => {
    console.log("Triggered submitHandler");

    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this move order list?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      const submitArrayBody = moveData?.orders?.map((item) => {
        return {
          orderNo: orderId,
          companyCode: oneChargingData?.company_code,
          companyName: oneChargingData?.company_name,
          business_unit_code: oneChargingData?.business_unit_code,
          business_unit_name: oneChargingData?.business_unit_name,
          departmentCode: oneChargingData?.department_code,
          departmentName: oneChargingData?.department_name,
          department_unit_code: oneChargingData?.department_unit_code,
          department_unit_name: oneChargingData?.department_unit_name,
          sub_unit_code: oneChargingData?.sub_unit_code,
          sub_unit_name: oneChargingData?.sub_unit_name,
          locationCode: oneChargingData?.location_code,
          locationName: oneChargingData?.location_name,
          preparedBy: currentUser?.fullName,
        };
      });

      console.log("submitArrayBody: ", submitArrayBody);

      // const genusStatus = moveData?.orders?.map((item) => {
      //   return {
      //     mir_id: item.id,
      //     status: "Ready to Pick-up",
      //     orders: orderListData.map((item) => ({
      //       order_id: item.orderNo,
      //       quantity_serve: item.preparedQuantity,
      //     })),
      //   };
      // });

      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = request
            .put(`Ordering/AddSavePreparedMoveOrder`, submitArrayBody)
            .then((response) => {
              ToastComponent("Success", "Items prepared successfully.", "success", toast);
              setOrderId("");
              setHighlighterId("");
              setItemCode("");
              setButtonChanger(false);
              setCurrentPage(currentPage);
              fetchApprovedMoveOrders();
              fetchNotification();
              fetchOrderList();
              setIsLoading(false);
              setCurrentPage(1);
              onClose();
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.log(error);
        }

        // GENUS STATUS
        // try {
        //   axios.patch(`http://genus-aio.rdfmis.ph/etd/backend/public/api/order/elixir_update`, genusStatus, {
        //     headers: {
        //       Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
        //     },
        //   });
        // } catch (error) {
        //   console.log(error);
        //   ToastComponent("Error", "Genus ETD update status failed", "error", toast);
        // }
      }
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <Text>Charge of Accounts</Text>
            </Flex>
          </ModalHeader>

          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <Stack spacing={2} p={6}>
              <Box>
                <HStack gap={0.5}>
                  <FormLabel fontSize="sm">Company</FormLabel>
                </HStack>

                <Input
                  value={`${oneChargingData?.company_code} - ${oneChargingData?.company_name}`}
                  disabled={true}
                  readOnly={true}
                  _disabled={{ color: "black" }}
                  fontSize="13px"
                  size="sm"
                  bg="gray.300"
                />
              </Box>

              <Box>
                <HStack gap={0.5}>
                  <FormLabel fontSize="sm">Business Unit</FormLabel>
                </HStack>

                <Input
                  value={`${oneChargingData?.business_unit_code} - ${oneChargingData?.business_unit_name}`}
                  disabled={true}
                  readOnly={true}
                  _disabled={{ color: "black" }}
                  fontSize="13px"
                  size="sm"
                  bg="gray.300"
                />
              </Box>

              <Box>
                <HStack gap={0.5}>
                  <FormLabel fontSize="sm">Department</FormLabel>
                </HStack>

                <Input
                  value={`${oneChargingData?.department_code} - ${oneChargingData?.department_name}`}
                  disabled={true}
                  readOnly={true}
                  _disabled={{ color: "black" }}
                  fontSize="13px"
                  size="sm"
                  bg="gray.300"
                />
              </Box>

              <Box>
                <HStack gap={0.5}>
                  <FormLabel fontSize="sm">Unit</FormLabel>
                </HStack>

                <Input
                  value={`${oneChargingData?.department_unit_code} - ${oneChargingData?.department_unit_name}`}
                  disabled={true}
                  readOnly={true}
                  _disabled={{ color: "black" }}
                  fontSize="13px"
                  size="sm"
                  bg="gray.300"
                />
              </Box>

              <Box>
                <HStack gap={0.5}>
                  <FormLabel fontSize="sm">Sub Unit</FormLabel>
                </HStack>

                <Input
                  value={`${oneChargingData?.sub_unit_code} - ${oneChargingData?.sub_unit_name}`}
                  disabled={true}
                  readOnly={true}
                  _disabled={{ color: "black" }}
                  fontSize="13px"
                  size="sm"
                  bg="gray.300"
                />
              </Box>

              <Box>
                <HStack gap={0.5}>
                  <FormLabel fontSize="sm">Location</FormLabel>
                </HStack>

                <Input
                  value={`${oneChargingData?.location_code} - ${oneChargingData?.location_name}`}
                  disabled={true}
                  readOnly={true}
                  _disabled={{ color: "black" }}
                  fontSize="13px"
                  size="sm"
                  bg="gray.300"
                />
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => submitHandler()} isLoading={isLoading} isDisabled={!oneChargingData} colorScheme="blue" px={4}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const AddQuantityConfirmation = ({
  isOpen,
  onClose,
  id,
  orderNo,
  itemCode,
  fetchOrderList,
  fetchPreparedItems,
  setQuantity,
  setHighlighterId,
  warehouseId,
  setWarehouseId,
  quantity,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .post(`Ordering/PrepareItemForMoveOrder`, {
          warehouseId: warehouseId,
          orderNoPkey: id,
          orderNo: orderNo,
          itemCode: itemCode,
          quantityOrdered: Number(quantity),
          preparedBy: currentUser.fullName,
        })
        .then((res) => {
          ToastComponent("Success", "Quantity has been prepared.", "success", toast);
          setQuantity("");
          setHighlighterId("");
          setWarehouseId("");
          setIsLoading(false);
          onClose();
          fetchOrderList();
          fetchPreparedItems();
        })
        .catch((err) => {
          ToastComponent("Error", "Add Failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text fontSize="sm">Are you sure you want to add this quantity?</Text>
              <Text fontSize="sm">{`[ MIR ID: ${orderNo} ] [ Item Code: ${itemCode} ] [ Quantity Ordered: ${quantity} ]`}</Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <ButtonGroup size="sm" mt={3}>
              <Button onClick={submitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="blue" px={4} size="xs">
                Yes
              </Button>
              <Button onClick={onClose} isLoading={isLoading} disabled={isLoading} color="black" variant="outline" px={4} size="xs">
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Cancel Prepared
export const CancelConfirmation = ({ isOpen, onClose, id, fetchPreparedItems, fetchOrderList, setCancelId, fetchNotification }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/CancelPreparedItems`, { id: id })
        .then((res) => {
          ToastComponent("Success", "Successfully cancelled prepared item", "success", toast);
          setCancelId("");
          fetchPreparedItems();
          fetchNotification();
          fetchOrderList();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want to cancel this prepared item?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <ButtonGroup size="sm" mt={3}>
              <Button onClick={submitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="blue" px={4}>
                Yes
              </Button>
              <Button onClick={onClose} isLoading={isLoading} disabled={isLoading} color="black" variant="outline" px={4}>
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
