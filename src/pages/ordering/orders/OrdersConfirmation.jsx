import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiFileList3Fill } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";

import React from "react";
import moment from "moment";
import request from "../../../services/ApiClient";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";

import PageScrollImport from "../../../components/PageScrollImport";
import PageScroll from "../../../utils/PageScroll";

const OrdersConfirmation = ({ isOpen, onClose, errorData, setErrorData, isLoading, setIsLoading }) => {
  const toast = useToast();

  const duplicateList = errorData?.duplicateList?.map((list) => {
    return {
      trasactId: list?.trasactId,
      orderDate: list?.orderDate,
      dateNeeded: list?.dateNeeded,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      category: list?.category,
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      itemRemarks: list?.itemRemarks,
      quantityOrdered: list?.quantityOrdered,
    };
  });

  const filteredOrders = errorData?.availableImport?.map((list) => {
    return {
      trasactId: list?.trasactId,
      cip_No: list?.cip_No,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
      companyCode: list?.companyCode,
      companyName: list?.companyName,
      departmentCode: list?.departmentCode,
      departmentName: list?.departmentName,
      locationCode: list?.locationCode,
      locationName: list?.locationName,
      rush: list?.rush,
      itemRemarks: list?.itemRemarks,
      accountCode: list?.accountCode,
      accountTitles: list?.accountTitles,
      empId: list?.empId,
      fullName: list?.fullName,
      requestor: list?.requestor,
      approver: list?.approver,
      helpdeskNo: list?.helpdeskNo,
      helpdeskNo: list?.helpdeskNo,
    };
  });

  const itemCodesExist = errorData?.itemCodesExist?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
    };
  });

  const itemDescriptionNotExist = errorData?.itemDescriptionNotExist?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
    };
  });

  const uomNotExist = errorData?.uomNotExist?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
    };
  });

  const departmentNotExist = errorData?.departmentNotExist?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
    };
  });

  const customerNameNotExist = errorData?.customerNameNotExist?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
    };
  });

  const previousDateNeeded = errorData?.previousDateNeeded?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
    };
  });

  const accountCodeEmpty = errorData?.accountCodeEmpty?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
      accountCode: list?.accountCode,
      accountTitles: list?.accountTitles,
    };
  });

  const accountTitleEmpty = errorData?.accountTitleEmpty?.map((list) => {
    return {
      trasactId: list?.trasactId,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      orderDate: moment(list?.orderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(list?.dateNeeded).format("yyyy-MM-DD"),
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
      accountCode: list?.accountCode,
      accountTitles: list?.accountTitles,
    };
  });

  const resultArray = filteredOrders?.map((list) => {
    return {
      trasactId: list?.trasactId,
      cip_No: list?.cip_No,
      department: list?.department,
      customercode: list?.customercode,
      customerName: list?.customerName,
      customerType: list?.customerType,
      orderNo: list?.orderNo,
      batchNo: list?.batchNo,
      orderDate: list?.orderDate,
      dateNeeded: list?.dateNeeded,
      itemCode: list?.itemCode,
      itemdDescription: list?.itemdDescription,
      uom: list?.uom,
      quantityOrdered: list?.quantityOrdered,
      category: list?.category,
      companyCode: list?.companyCode,
      companyName: list?.companyName,
      departmentCode: list?.departmentCode,
      departmentName: list?.departmentName,
      locationCode: list?.locationCode,
      locationName: list?.locationName,
      rush: list?.rush,
      itemRemarks: list?.itemRemarks,
      accountCode: list?.accountCode,
      accountTitles: list?.accountTitles,
      empId: list?.empId,
      fullName: list?.fullName,
      assetTag: list?.assetTag,
      requestor: list?.requestor,
      approver: list?.approver,
      helpdeskNo: list?.helpdeskNo,
      dateApproved: list?.dateApproved,
    };
  });

  const validationAvailableToSync = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these orders?",
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
        console.log("Result with errors: ", resultArray);
        try {
          setIsLoading(true);
          const res = request
            .post(
              `Ordering/AddNewOrders`,
              resultArray.map((submit) => {
                return {
                  trasactId: submit?.trasactId,
                  cip_No: submit?.cip_No,
                  department: submit?.department,
                  customercode: submit?.customercode,
                  customerName: submit?.customerName,
                  customerType: submit?.customerType,
                  orderNo: submit?.orderNo,
                  orderDate: moment(submit?.orderDate).format("yyyy-MM-DD"),
                  dateNeeded: moment(submit?.dateNeeded).format("yyyy-MM-DD"),
                  itemCode: submit?.itemCode,
                  itemdDescription: submit?.itemdDescription,
                  uom: submit?.uom,
                  quantityOrdered: submit?.quantityOrdered,
                  category: submit?.category,
                  companyCode: submit?.companyCode,
                  companyName: submit?.companyName,
                  departmentCode: submit?.departmentCode,
                  departmentName: submit?.departmentName,
                  locationCode: submit?.locationCode,
                  locationName: submit?.locationName,
                  rush: submit?.rush,
                  itemRemarks: submit?.itemRemarks,
                  accountCode: submit?.accountCode,
                  accountTitles: submit?.accountTitles,
                  empId: submit?.empId,
                  fullName: submit?.fullName,
                  assetTag: submit?.assetTag,
                  requestor: submit?.requestor,
                  approver: submit?.approver,
                  helpdeskNo: submit?.helpdeskNo,
                  dateApproved: submit?.dateApproved,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Orders Synced!", "success", toast);
              // fetchNotification();
              onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              console.log("Error: ", err);
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                onClose();
                // onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent color="white" bg="linear-gradient(rgba(0, 0, 0, 0.850),rgba(0, 0, 0, 3))">
        <ModalHeader>
          <Flex justifyContent="left">
            <Text fontSize="11px" color="white">
              Orders were not synced due to the following reasons:
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <PageScroll>
          <ModalBody>
            <Accordion allowToggle>
              {/* FILTERED ORDERS */}
              {filteredOrders?.length > 0 ? (
                <AccordionItem bgColor="gray.300">
                  <Flex>
                    <AccordionButton fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        <Text color="green">
                          Available for syncing <Badge color="green">{filteredOrders?.length}</Badge>
                        </Text>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll minHeight="500px" maxHeight="501px">
                      {filteredOrders ? (
                        <Table variant="striped" size="sm" bg="form">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Order Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Date Needed
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Type
                              </Th>
                              <Th color="white" fontSize="9px">
                                Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Remarks
                              </Th>
                              <Th color="white" fontSize="9px">
                                Quantity Order
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {filteredOrders?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.orderDate).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.dateNeeded).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerType}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.category}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemdDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                {d?.itemRemarks ? (
                                  <Td color="gray.600" fontSize="11px">
                                    {d?.itemRemarks}
                                  </Td>
                                ) : (
                                  <Td color="gray.600" fontSize="11px">
                                    -
                                  </Td>
                                )}

                                <Td color="gray.600" fontSize="11px">
                                  {d?.quantityOrdered}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
                    {filteredOrders ? (
                      <Flex justifyContent="end" mt={2}>
                        <Button onClick={() => validationAvailableToSync()} size="sm" _hover={{ bgColor: "accent", color: "white" }} colorScheme="blue" isLoading={isLoading}>
                          Sync
                        </Button>
                      </Flex>
                    ) : (
                      ""
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* DUPLICATED LIST */}
              {duplicateList?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Duplicated Lists <Badge color="red">{duplicateList?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {duplicateList ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Order Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Date Needed
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Type
                              </Th>
                              <Th color="white" fontSize="9px">
                                Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Remarks
                              </Th>
                              <Th color="white" fontSize="9px">
                                Quantity Order
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {duplicateList?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.orderDate).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.dateNeeded).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerType}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.category}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemdDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                {d?.itemRemarks ? (
                                  <Td color="gray.600" fontSize="11px">
                                    {d?.itemRemarks}
                                  </Td>
                                ) : (
                                  <Td color="gray.600" fontSize="11px">
                                    -
                                  </Td>
                                )}
                                <Td color="gray.600" fontSize="11px">
                                  {d?.quantityOrdered}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* MATERIAL INFO DOES NOT EXIST */}
              {itemCodesExist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Material Information does not exist <Badge color="red">{itemCodesExist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {itemCodesExist ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Category
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemCodesExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemdDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.category}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated material lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* ITEM DESCRIPTION EXIST */}
              {itemDescriptionNotExist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Item Description Does Exist <Badge color="red">{itemDescriptionNotExist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {itemDescriptionNotExist ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Order Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Date Needed
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Quantity Order
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemDescriptionNotExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.orderDate).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.dateNeeded).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.category}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemdDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.quantityOrdered}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated item description lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* UOM DOEST NO EXIST */}
              {uomNotExist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        UOM does not exist <Badge color="red">{uomNotExist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {uomNotExist ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Order Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Date Needed
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Quantity Order
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {uomNotExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.orderDate).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.dateNeeded).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.category}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemdDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.quantityOrdered}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated uom lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* DEPARTMENT DOES NOT EXIST */}
              {departmentNotExist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Department does not exist <Badge color="red">{departmentNotExist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {departmentNotExist ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Order Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Date Needed
                              </Th>
                              <Th color="white" fontSize="9px">
                                Department
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Quantity Order
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {departmentNotExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.orderDate).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.dateNeeded).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.department}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.category}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemdDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.quantityOrdered}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated customer code lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* CUSTOMER INFORMATION DOES NOT EXIST */}
              {customerNameNotExist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Customer Information does not exist <Badge color="red">{customerNameNotExist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {customerNameNotExist ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Type
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {customerNameNotExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerType}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated customer name lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* Invalid Date Needed */}
              {previousDateNeeded?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Invalid Date Needed <Badge color="red">{previousDateNeeded?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {previousDateNeeded ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Order Date
                              </Th>
                              <Th color="white" fontSize="9px">
                                Date Needed
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                              <Th color="white" fontSize="9px">
                                Quantity Order
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {previousDateNeeded?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.orderDate).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {moment(d?.dateNeeded).format("yyyy-MM-DD")}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.category}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemdDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uom}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.quantityOrdered}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* ACCOUNT CODE EMPTY */}
              {accountCodeEmpty?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Check Empty Account Title Code <Badge color="red">{accountCodeEmpty?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {accountCodeEmpty ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Type
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {accountCodeEmpty?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerType}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountTitles}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated Accunt Title Code lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* ACCOUNT CODE EMPTY */}
              {accountTitleEmpty?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Check Empty Account Title Name <Badge color="red">{accountTitleEmpty?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {accountTitleEmpty ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600" position="sticky" top={0} zIndex={1}>
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                MIR ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Name
                              </Th>
                              <Th color="white" fontSize="9px">
                                Customer Type
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Account Title
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {accountTitleEmpty?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.trasactId}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customercode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.customerType}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.accountTitles}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated Accunt Title Name lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}
            </Accordion>

            <HStack mt={20} textAlign="center" fontWeight="semibold">
              <TiWarning color="orange" />
              <Text fontSize="12px" color="orange">
                Note: Before synching, please check that every Genus ETD orders has been fulfilled.
              </Text>
            </HStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </PageScroll>
      </ModalContent>
    </Modal>
  );
};

export default OrdersConfirmation;
