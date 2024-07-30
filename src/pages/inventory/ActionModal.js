import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
    departmentId: yup.object().required().typeError("Department Category is required"),
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
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);

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

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
        },
      });
      setCompany(res.data.result.companies);
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

  // location
  useEffect(() => {
    const order = moveData?.orders?.find((item) => item.id === orderId);

    if (location.length && !watch("formData.locationId") && !watch("formData.departmentId")) {
      setValue("formData.locationId", {
        label: `${order.locationCode} - ${order.locationName}`,
        value: location?.find((item) => item.code === order.locationCode),
      });
    }
  }, [orderId, location]);

  // department
  useEffect(() => {
    const order = moveData?.orders?.find((item) => item.id === orderId);

    if (department.length && !watch("formData.departmentId") && !watch("formData.companyId")) {
      setValue("formData.departmentId", {
        label: `${order.departmentCode} - ${order.department}`,
        value: department?.find((item) => item.code === order.departmentCode),
      });
    }
  }, [orderId, department]);

  // company
  useEffect(() => {
    const order = moveData?.orders?.find((item) => item.id === orderId);

    if (company.length && !watch("formData.companyId")) {
      setValue("formData.companyId", {
        label: `${order.companyCode} - ${order.companyName}`,
        value: company?.find((item) => item.code === order.companyCode),
      });
    }
  }, [orderId, company]);

  const submitHandler = async (data) => {
    console.log("example");
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
          companyCode: data.formData.companyId.value.code,
          companyName: data.formData.companyId.value.name,
          departmentCode: data.formData.departmentId.value.code,
          departmentName: data.formData.departmentId.value.name,
          locationCode: data.formData.locationId.value.code,
          locationName: data.formData.locationId.value.name,
        };
      });

      const genusStatus = moveData?.orders?.map((item) => {
        return {
          mir_id: item.id,
          status: "Ready to Pick-up",
          orders: orderListData.map((item) => ({
            order_id: item.orderNo,
            quantity_serve: item.preparedQuantity,
          })),
        };
      });

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
        try {
          axios.patch(`http://genus-aio.rdfmis.ph/etd/backend/public/api/order/elixir_update`, genusStatus, {
            headers: {
              Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
            },
          });
        } catch (error) {
          console.log(error);
          ToastComponent("Error", "Genus ETD update status failed", "error", toast);
        }
      }
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
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
                  <FormLabel fontSize="sm">Company</FormLabel>
                  <Controller
                    control={control}
                    name="formData.companyId"
                    render={({ field }) => (
                      <AutoComplete
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
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Controller
                    control={control}
                    name="formData.departmentId"
                    render={({ field }) => (
                      <AutoComplete
                        size="sm"
                        ref={field.ref}
                        value={field.value}
                        placeholder="Select Department"
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("formData.locationId", "");
                          fetchLocationApi(e?.value?.id || "");
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
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Controller
                    control={control}
                    name="formData.locationId"
                    render={({ field }) => (
                      <AutoComplete
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
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={!watch("formData.companyId") || !watch("formData.departmentId") || !watch("formData.locationId")}
                colorScheme="blue"
                px={4}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
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
          preparedBy: currentUser.userName,
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
