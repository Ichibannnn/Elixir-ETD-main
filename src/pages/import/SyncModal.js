import React, { useRef } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  VStack,
  HStack,
  useToast,
  Input,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { RiFileList3Fill } from "react-icons/ri";

import moment from "moment";
import request from "../../services/ApiClient";
import Swal from "sweetalert2";
import { ToastComponent } from "../../components/Toast";

import PageScroll from "../../utils/PageScroll";
import { decodeUser } from "../../services/decode-user";
import { MdOutlineSync } from "react-icons/md";

import noRecordsFound from "../../../src/assets/svg/noRecordsFound.svg";

const currentUser = decodeUser();

const SyncModal = ({ isOpen, onClose, ymirPO, fetchData, setFetchData, fromDate, setFromDate, toDate, setToDate, onErrorSyncModal, errorData, setErrorData }) => {
  const toast = useToast();

  const dateVar = new Date();
  const minDate = moment(dateVar.setDate(dateVar.getDate() - 3)).format("yyyy-MM-DD");

  // const ymirResultArray = ymirPO?.map((item) => {
  //   return {
  //     pR_Number: item?.pr_year_number_id?.toString().trim(),
  //     pR_Date: moment(item?.pr_date)?.format("YYYY-MM-DD")?.toString().trim(),
  //     pO_Number: item?.po_number?.toString().trim(),
  //     pO_Date: moment(item?.po_date)?.format("YYYY-MM-DD")?.toString().trim(),
  //     itemCode: item?.item_code?.toString().trim(),
  //     itemDescription: item?.item_name?.toString()?.trim(),
  //     ordered: item?.ordered?.toString().trim(),
  //     delivered: item?.delivered?.toString().trim(),
  //     billed: 0,
  //     uom: item?.uom?.toString().trim(),
  //     unitPrice: item?.unit_price?.toString().trim(),
  //     vendorName: item?.supplier_name?.toString().trim(),
  //     addedBy: currentUser?.username?.toString().trim(),

  //   };
  // });

  const ymirResultArray = ymirPO?.flatMap((data) =>
    data.rr_orders.map((subData) => {
      return {
        rrNo: data?.rr_year_number_id.toString().trim(),
        rrDate: moment(subData?.rr_date)?.format("YYYY-MM-DD")?.toString().trim(),
        pR_Number: data?.pr_transaction?.pr_year_number_id?.toString().trim(),
        pR_Date: moment(data?.pr_transaction?.created_at)?.format("YYYY-MM-DD")?.toString().trim(),
        pO_Number: data?.po_transaction?.po_year_number_id?.toString().trim(),
        pO_Date: moment(data?.po_transaction?.created_at)?.format("YYYY-MM-DD")?.toString().trim(),

        itemCode: subData?.item_code?.toString().trim(),
        itemDescription: subData?.item_name?.toString()?.trim(),

        ordered: data?.po_transaction?.order?.[0]?.quantity?.toString().trim(),
        delivered: subData?.quantity_receive?.toString().trim(),
        actualRemaining: subData?.remaining.toString().trim(),
        billed: 0,
        unitPrice: data?.po_transaction?.order?.[0]?.price?.toString().trim(),
        siNumber: subData?.shipment_no?.toString().trim(),
        receiveDate: moment(subData?.delivery_Date)?.format("YYYY-MM-DD")?.toString().trim(),
        vendorName: data?.po_transaction?.supplier_name?.toString().trim(),
        addedBy: currentUser?.fullName?.toString().trim(),
      };
    })
  );

  console.log("YMIR RESULT: ", ymirResultArray);

  const submitSyncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync this purchase order list?",
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
      if (result.isConfirmed) {
        console.log("YMIR Submit Payload: ", ymirResultArray);
        if (ymirResultArray.length > 0) {
          try {
            setFetchData(true);
            const res = request
              .post("Import/AddNewPOSummary", ymirResultArray)
              .then((res) => {
                ToastComponent("Success!", "Sync purchase orders successfully", "success", toast);
                setFetchData(false);
                // setIsDisabled(false);
              })
              .catch((err) => {
                ToastComponent("Error!", "Sync error.", "error", toast);
                setFetchData(false);
                setErrorData(err.response.data);
                if (err.response.data) {
                  // console.log("ErrorData: ", err);
                  onErrorSyncModal();
                }
              });
          } catch (err) {
            ToastComponent("Error!", "Sync error.", "error", toast);
          }
        } else {
          ToastComponent("Error!", "Sync error.", "error", toast);
        }
      }
    });
  };

  const closeModalHandler = () => {
    setFromDate(moment(new Date()).format("yyyy-MM-DD"));
    setToDate(moment(new Date()).format("yyyy-MM-DD"));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text fontSize="13px" fontWeight="semibold">
              Sync Purchase Orders from YMIR
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={() => closeModalHandler()} />

        <PageScroll>
          <ModalBody>
            <Flex width="full" justifyContent="center" alignItems="center" mb={8}>
              <VStack>
                <Text fontSize="13px" fontWeight="semibold">
                  Select Date:{" "}
                </Text>
                <HStack>
                  <Badge fontSize="xs" colorScheme="blue" variant="solid">
                    From:
                  </Badge>
                  <Input onChange={(date) => setFromDate(date.target.value)} defaultValue={fromDate} type="date" fontSize="11px" fontWeight="semibold" />
                  <Badge fontSize="xs" colorScheme="blue" variant="solid">
                    To:
                  </Badge>
                  <Input
                    onChange={(date) => setToDate(date.target.value)}
                    defaultValue={moment(new Date()).format("yyyy-MM-DD")}
                    min={fromDate}
                    type="date"
                    fontSize="11px"
                    fontWeight="semibold"
                  />
                </HStack>
              </VStack>
            </Flex>

            <Flex p={4}>
              <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
                <Text color="white" fontSize="13px" textAlign="center">
                  LIST OF PURCHASE ORDERS
                </Text>
              </VStack>
            </Flex>

            <Flex p={4}>
              <VStack alignItems="center" w="100%" mt={-8}>
                <PageScroll minHeight="300px" maxHeight="720px" maxWidth="full">
                  {fetchData ? (
                    <Stack width="full">
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                    </Stack>
                  ) : (
                    <Table size="sm" width="full" border="none" boxShadow="md" bg="gray.200" variant="striped">
                      <Thead bg="secondary" position="sticky" top={0} zIndex={1}>
                        <Tr>
                          <Th color="#D6D6D6" fontSize="10px">
                            Line Number
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            RR Number
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            RR Date
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            PO Number
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            PO Date
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            PR Number
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            PR Date
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Item Code
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Item Description
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Qty Ordered
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Qty Delivered
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Unit Cost
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Supplier Name
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {ymirResultArray?.map((d, i) => (
                          <Tr key={i}>
                            <Td color="gray.600" fontSize="11px">
                              {i + 1}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.rrNo}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.rrDate}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.pR_Number}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {moment(d?.pR_Date).format("yyyy-MM-DD")}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.pO_Number}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {moment(d?.pO_Date).format("yyyy-MM-DD")}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.itemCode}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.itemDescription}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.ordered?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigi: 2,
                              })}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.delivered?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigi: 2,
                              })}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.unitPrice?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigi: 2,
                              })}
                            </Td>
                            <Td color="gray.600" fontSize="11px">
                              {d?.vendorName}
                            </Td>
                          </Tr>
                        ))}

                        {!ymirResultArray?.length && (
                          <Tr>
                            <Td colSpan={14} align="center">
                              <Flex width="100%" justifyContent="center" alignItems="center">
                                <VStack>
                                  <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                                  <Text color="black" marginLeft={2}>
                                    No records found.
                                  </Text>
                                </VStack>
                              </Flex>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  )}
                </PageScroll>
              </VStack>
            </Flex>
          </ModalBody>
        </PageScroll>

        <ModalFooter>
          {/* <Button size="xs" colorScheme="blue">
                View Purchase Orders
              </Button> */}
          <Button size="sm" leftIcon={<MdOutlineSync fontSize="19px" />} colorScheme="teal" isLoading={fetchData} onClick={() => submitSyncHandler()} isDisabled={!ymirPO?.length}>
            Sync Purchase Orders
          </Button>

          {/* <Button mr={3} onClick={onClose} color="gray.600" fontSize="11px">
            Close
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SyncModal;
