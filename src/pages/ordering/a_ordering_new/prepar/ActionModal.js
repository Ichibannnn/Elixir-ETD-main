import React, { useState, useEffect } from "react";
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import { ToastComponent } from "../../../../components/Toast";
import { decodeUser } from "../../../../services/decode-user";
import Swal from "sweetalert2";
import moment from "moment";
import PageScroll from "../../../../utils/PageScroll";
import { MdGridView } from "react-icons/md";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Select as AutoComplete } from "chakra-react-select";
import { NumericFormat } from "react-number-format";

const currentUser = decodeUser();

export const EditModal = ({ isOpen, onClose, editData, fetchOrderList, fetchCustomerList, orderList }) => {
  const schema = yup.object().shape({
    formData: yup.object().shape({}),
  });

  const { isOpen: isEditRemarks, onOpen: openEditRemarks, onClose: closeEditRemarks } = useDisclosure();

  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  const [quantitySubmit, setQuantitySubmit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [remarksId, setRemarksId] = useState("");

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

  // FETCH Account API
  const fetchAccountApi = async () => {
    try {
      const res = await axios.get(`http://genus-aio.rdfmis.ph/etd/backend/public/api/elixir_order?paginate=0&page=1&row=10&status=all`, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
        },
      });
      // console.log("Response: ", res.data.result);
      setAccount(res.data.result?.find((items) => items.id === editData.mirId)?.orders?.find((items) => items.id === editData.orderNo)?.account_title);
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
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
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

    if (!selectedAccount?.name?.match(/Advances to Employees/gi)) {
      setIdNumber("");
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

  // Bind Account Title
  useEffect(() => {
    if (account.length && !watch("formData.accountId")) {
      const editAccountTitle = orderList?.find((item) => item.id === editData.id);
      setValue("formData.accountId", {
        label: `${editAccountTitle.accountCode} - ${editAccountTitle.accountTitles}`,
        value: account?.find((item) => item.code === editAccountTitle.accountCode),
      });
      setSelectedAccount(editAccountTitle.accountTitles);
    }
  }, [editData.id, account]);

  // console.log(watch("formData.accountId"));

  // Employee id & Fullname && Consumed Quantity (Bind)
  useEffect(() => {
    if (editData.id) {
      setValue("formData.id", editData.id);
      setValue("formData.fullName", editData.fullName);
      setValue("formData.empId", {
        label: editData.empId,
        value: {
          full_id_number: editData.empId,
          full_name: editData.fullName,
        },
      });
    }
  }, [editData]);

  const quantityHandler = (data, editData) => {
    if (data) {
      setQuantitySubmit(parseFloat(data));
    } else {
      setQuantitySubmit("");
    }
  };

  const submitHandler = (data) => {
    if (editData.standardQuantity === quantitySubmit) {
      try {
        setIsLoading(true);
        const res = request
          .put(`Ordering/EditOrderQuantity`, {
            id: editData.id,
            quantityOrdered: quantitySubmit,
            accountCode: data?.formData?.accountId?.value?.code,
          })
          .then((res) => {
            ToastComponent("Success", "Order has been edited!", "success", toast);
            onClose();
            fetchOrderList();
          })
          .catch((err) => {
            ToastComponent("Error", err.response.data, "error", toast);
            setIsLoading(false);
          });
      } catch (error) {}
    } else {
      setRemarksId(editData?.id);
      openEditRemarks();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="5xl">
        <ModalOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <ModalContent>
            <ModalHeader color="black">
              <VStack justifyContent="center" spacing={-2}>
                <Text>Preparation Schedule</Text>
                <Text fontSize="sm">Edit Order</Text>
              </VStack>
            </ModalHeader>

            <ModalBody>
              <Text textAlign="center" mb={3} fontSize="sm">
                Are you sure you want to edit this order?
              </Text>
              <Flex flexDirection="row" justifyContent="space-between" w="full">
                <VStack w="full">
                  {/* MIR ID */}
                  <Box p={2} gap={0} w="full">
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      MIR ID:
                    </FormLabel>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {editData?.mirId ? editData?.mirId : ""}
                    </Text>
                  </Box>

                  {/* Order ID */}
                  <Box p={2} gap={0} w="full">
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Order ID:
                    </FormLabel>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={3} px={4}>
                      {editData?.id ? editData?.id : ""}
                    </Text>
                  </Box>

                  {/* Item Code */}
                  <Box p={2} gap={0} w="full">
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Item Code:
                    </FormLabel>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {editData?.itemCode ? editData?.itemCode : ""}
                    </Text>
                  </Box>

                  {/* Item Description */}
                  <Box p={2} gap={0} w="full">
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Item Description
                    </FormLabel>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {editData?.itemDescription ? editData?.itemDescription : ""}
                    </Text>
                  </Box>

                  {/* UOM */}
                  <Box p={2} gap={0} w="full">
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      UOM:
                    </FormLabel>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {editData?.uom ? editData?.uom : ""}
                    </Text>
                  </Box>
                </VStack>

                <VStack w="full">
                  {/* Quantity Order */}
                  <Box p={2} gap={0} w="full">
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Quantity Order:
                    </FormLabel>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {editData?.standardQuantity ? editData?.standardQuantity : ""}
                    </Text>
                  </Box>

                  {/* Edit Quantity */}
                  <Box p={2} gap={0} w="full">
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Edit Quantity:
                    </FormLabel>
                    <NumericFormat
                      customInput={Input}
                      fontSize="sm"
                      onValueChange={(e) => quantityHandler(e.value)}
                      value={quantitySubmit}
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      min="1"
                      w="full"
                      border="1px"
                      borderColor="gray.400"
                      borderRadius="none"
                      thousandSeparator=","
                    />
                  </Box>
                </VStack>
              </Flex>
            </ModalBody>

            <ModalFooter justifyItems="center">
              <ButtonGroup size="xs" mt={5}>
                <Button px={4} isLoading={isLoading} isDisabled={!quantitySubmit || isLoading || quantitySubmit > editData.standardQuantity} colorScheme="blue" type="submit">
                  Save
                </Button>
                <Button onClick={onClose} isLoading={isLoading} disabled={isLoading} variant="outline" color="black">
                  Cancel
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      {isEditRemarks && (
        <EditRemarksModalConfirmation
          isEditRemarks={isEditRemarks}
          closeEditRemarks={closeEditRemarks}
          onClose={onClose}
          remarksId={remarksId}
          fetchOrderList={fetchOrderList}
          quantitySubmit={quantitySubmit}
          chargingInfo={watch("formData")}
          editData={editData}
        />
      )}
    </>
  );
};

export const EditRemarksModalConfirmation = ({ isEditRemarks, closeEditRemarks, onClose, remarksId, fetchOrderList, quantitySubmit, chargingInfo, editData }) => {
  const [editRemarks, setEditRemarks] = useState("");
  const [reasons, setReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const fetchReasonsApi = async () => {
    const res = await request.get(`Reason/GetAllActiveReasons`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const remarksHandler = (data) => {
    // console.log("remarks: ", data);

    if (data) {
      setEditRemarks(data);
    } else {
      setEditRemarks("");
    }
  };

  const editHandler = () => {
    console.log("Edit Remarks: ", editRemarks);
    // console.log("EditData: ", editData);
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/EditOrderQuantity`, {
          id: remarksId,
          remarks: editRemarks,
          quantityOrdered: quantitySubmit,
          accountCode: editData.accountCode,
          accountTitles: editData.accountTitles,
          empId: chargingInfo?.empId?.value?.full_id_number,
          fullName: chargingInfo?.empId?.value?.full_name,
        })
        .then((res) => {
          ToastComponent("Success", "Order has been edited!", "success", toast);
          setIsLoading(false);
          closeEditRemarks();
          fetchOrderList();
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Edit Order failed!", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isCentered size="xl" isOpen={isEditRemarks} onClose={closeEditRemarks}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="left">
            <Text fontSize="15px">Edit Order</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} color="white" />
        <ModalBody>
          <VStack justifyContent="center" mt={4} mb={7} w="full">
            <Text>Reason of editing order?</Text>
            <HStack w="full">
              <FormLabel>Reason: </FormLabel>
              <Input className="all-capital" fontSize="md" onChange={(e) => remarksHandler(e.target.value.toUpperCase())} placeholder="Enter a reason" w="65%" />
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" color="black" onClick={onClose} disabled={isLoading} isLoading={isLoading} mr={2}>
            No
          </Button>
          <Button onClick={() => editHandler()} isDisabled={!editRemarks} isLoading={isLoading} colorScheme="blue" _hover={{ bgColor: "accent" }}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CancelModalConfirmation = ({ isOpen, onClose, cancelId, fetchOrderList, fetchMirList, fetchCustomerList, setCustomerName, fetchNotification, setIsAllChecked }) => {
  const [cancelRemarks, setCancelRemarks] = useState("");
  const [reasons, setReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const fetchReasonsApi = async () => {
    const res = await request.get(`Reason/GetAllActiveReasons`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const remarksHandler = (data) => {
    if (data) {
      setCancelRemarks(data);
    } else {
      setCancelRemarks("");
    }
  };

  const cancelHandler = () => {
    console.log("Cancel Remarks: ", cancelRemarks);

    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/CancelOrders`, {
          id: cancelId,
          remarks: cancelRemarks,
          isCancelBy: currentUser.fullName,
        })
        .then((res) => {
          // setIsAllChecked([]);
          ToastComponent("Success", "Order has been cancelled!", "success", toast);
          fetchNotification();
          setIsLoading(false);
          onClose();
          fetchOrderList();
          fetchMirList();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed!", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="left">
            <Text fontSize="15px">Cancel Order</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} color="white" />
        <ModalBody>
          <VStack justifyContent="center" mt={4} mb={7}>
            <Text>Are you sure you want to cancel this order?</Text>
            {reasons.length > 0 ? (
              <Select fontSize="md" onChange={(e) => remarksHandler(e.target.value)} placeholder="Please select a reason" w="65%">
                {reasons?.map((item, i) => (
                  <option key={i} value={item.reasonName}>
                    {item.reasonName}
                  </option>
                ))}
              </Select>
            ) : (
              "loading"
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" color="black" onClick={onClose} isDisabled={isLoading} isLoading={isLoading} mr={2}>
            No
          </Button>
          <Button onClick={() => cancelHandler()} isDisabled={!cancelRemarks} isLoading={isLoading} colorScheme="blue" _hover={{ bgColor: "accent" }}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ScheduleModal = ({ isOpen, onClose, fetchMirList, selectedMIRIds, setSelectedMIRIds, setIsAllChecked, setCurrentPage, setSearch, fetchNotification, orderList }) => {
  const [preparationDate, setPreparationDate] = useState();
  const date = new Date();
  // const maxDate = moment(new Date(date.setMonth(date.getMonth() + 6))).format(
  //   "yyyy-MM-DD"
  // );
  const newDate = moment();
  const maxDate = newDate.add(14, "days");

  const [isLoading, setIsLoading] = useState(false);
  const currentUser = decodeUser();
  const toast = useToast();

  const dateProvider = (date) => {
    console.log(date);
    if (date) {
      setPreparationDate(date);
    } else {
      setPreparationDate("");
    }
  };
  // SCHEDULE BUTTON FUNCTION
  const submitValidate = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to schedule selected orders?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
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
      if (result.isConfirmed) {
        const submitArray = selectedMIRIds?.map((item) => {
          // console.log(item);
          return {
            trasactId: item,
            preparedDate: preparationDate,
            preparedBy: currentUser.fullName,
          };
        });

        const genusStatus = selectedMIRIds?.map((item) => {
          return {
            mir_id: item,
            status: "Ready for Preparation",
            orders: orderList.map((item) => ({
              order_id: item.orderNo,
              quantity_serve: item.quantityOrder,
            })),
          };
        });
        console.log("Genus Status: ", genusStatus);
        console.log("Submit Array: ", submitArray);
        setIsLoading(true);
        try {
          const res = request
            .put(`Ordering/PreparationOfSchedule`, submitArray)
            .then((res) => {
              ToastComponent("Success", "Orders were successfully scheduled", "success", toast);
              fetchNotification();
              onClose();
              setSelectedMIRIds([]);
              setIsAllChecked(false);
              setSearch("");
              setCurrentPage(1);
              fetchMirList();
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              ToastComponent("Error", "Schedule failed", "error", toast);
              setIsLoading(false);
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
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="left">
            <Text fontSize="15px">Schedule Order</Text>
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack textAlign="start">
            <HStack spacing={4} w="full" justifyContent="center"></HStack>
            <HStack spacing={4} w="full" justifyContent="center">
              <Text w="40%" pl={2} fontSize="sm">
                Preparation Date:
              </Text>
              <Input
                borderRadius="none"
                bg="#E2E8F0"
                color="fontColor"
                fontSize="sm"
                type="date"
                onChange={(date) => dateProvider(date.target.value)}
                min={moment(new Date()).format("yyyy-MM-DD")}
                max={maxDate.format("yyyy-MM-DD")}
              />
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="end">
          <ButtonGroup size="xs" mt={8}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button px={5} colorScheme="blue" isDisabled={!preparationDate} onClick={submitValidate}>
              Submit
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ViewDetailsModal = (props) => {
  const { isOpen, onClose, viewParams } = props;

  const [viewData, setViewData] = useState([]);

  const id = viewParams;
  const fetchViewDatailsApi = async (id) => {
    const res = await request.get(`Ordering/ViewListOfMirOrders`, {
      params: {
        id: id,
      },
    });
    return res.data;
  };

  const fetchViewDatails = () => {
    fetchViewDatailsApi(id).then((res) => {
      setViewData(res);
    });
  };

  useEffect(() => {
    fetchViewDatails();
  }, [id]);

  console.log(viewData);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left" gap={1} p={0} alignItems="center">
            <MdGridView color="white" />
            <Text fontSize="xs" color="white">
              View MIR Details
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />
        <ModalBody mb={5}>
          <Flex justifyContent="space-between" mt={2}>
            <VStack alignItems="start" spacing={1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  MIR ID:
                </Text>
                <Text fontSize="xs">{viewData[0]?.mirId}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">
                  {viewData[0]?.customerCode} - {viewData[0]?.customerName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Charging Department:
                </Text>
                <Text fontSize="xs">
                  {viewData[0]?.departmentCode} - {viewData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Charging Location:
                </Text>
                <Text fontSize="xs">
                  {viewData[0]?.locationCode} - {viewData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Date Needed:
                </Text>
                <Text fontSize="xs"> {moment(viewData[0]?.dateNeeded).format("MM/DD/yyyy")}</Text>
              </HStack>
            </VStack>
            <VStack alignItems="start" spacing={-1}></VStack>
          </Flex>

          <VStack justifyContent="center" mt={2}>
            <PageScroll minHeight="150px" maxHeight="351px">
              <Table size="sm" bg="gray.100">
                <Thead bgColor="primary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Remarks
                    </Th>
                    <Th color="white" fontSize="xs">
                      Asset Tag
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {viewData?.map((view, i) => (
                    <React.Fragment key={i}>
                      {view?.listOrder?.map((list) => (
                        <Tr>
                          <Td fontSize="xs">{list.itemCode}</Td>
                          <Td fontSize="xs">{list.itemDescription}</Td>
                          <Td fontSize="xs">{list.uom}</Td>
                          <Td fontSize="xs">
                            {list.quantity.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>
                          {list.itemRemarks ? <Td fontSize="xs">{list.itemRemarks}</Td> : <Td fontSize="xs">-</Td>}
                          {list.assetTag ? <Td fontSize="xs">{list.assetTag}</Td> : <Td fontSize="xs">-</Td>}
                        </Tr>
                      ))}
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
