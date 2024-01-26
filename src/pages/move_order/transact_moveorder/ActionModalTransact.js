import React, { useState } from "react";
import {
  Flex,
  HStack,
  Button,
  ButtonGroup,
  Text,
  useToast,
  VStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  ModalOverlay,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import PageScroll from "../../../utils/PageScroll";
import { BsQuestionDiamondFill } from "react-icons/bs";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import DatePicker from "react-datepicker";
import { ToastComponent } from "../../../components/Toast";
import axios from "axios";

const currentUser = decodeUser();

export const ViewModal = ({
  isOpen,
  onClose,
  moveOrderInformation,
  moveOrderViewTable,
}) => {
  const TableHead = [
    "Line",
    "Order Date",
    // "Farm Code", "Farm",
    "Item Code",
    "Item Description",
    // "Category",
    "UOM",
    "Quantity",
    "Unit Cost",
    "Total Cost",
    "Item Remarks",
    "Asset Tag",
    // "Expiration Date",
  ];

  console.log("Orders: ", moveOrderViewTable);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl" mt={4}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="primary">
            <Flex justifyContent="left">
              <Text fontSize="xs" color="white">
                View Transact Move Order
              </Text>
            </Flex>
            {/* <Text textAlign="center" fontSize="15px">
              View Transact Move Order
            </Text> */}
          </ModalHeader>
          <ModalCloseButton color="white" onClick={onClose} />
          <ModalBody mb={5}>
            <Flex justifyContent="space-between">
              <VStack alignItems="start" spacing={1} mt={4}>
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold">
                    MIR ID:
                  </Text>
                  <Text fontSize="sm">{moveOrderInformation.orderNo}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="sm" fontWeight="semibold">
                    Delivery Status:
                  </Text>
                  <Text fontSize="sm">
                    {" "}
                    {moveOrderInformation.deliveryStatus}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold">
                    Customer Code:
                  </Text>
                  <Text fontSize="sm">{moveOrderInformation.customerCode}</Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold">
                    Customer Name:
                  </Text>
                  <Text fontSize="sm">{moveOrderInformation.customerName}</Text>
                </HStack>
              </VStack>
              <VStack alignItems="start" spacing={-1}></VStack>
              <VStack alignItems="start" spacing={-1}></VStack>
            </Flex>

            {/* <Flex w="full" flexDirection="column" className="bosmhadow">
              <VStack w="full" spacing={0} mb={6}>
                <Text
                  w="full"
                  textAlign="center"
                  bgColor="primary"
                  color="white"
                  fontSize="sm"
                >
                  Transact Move Order
                </Text>
                <Text
                  w="full"
                  textAlign="center"
                  bgColor="secondary"
                  color="white"
                  fontSize="xs"
                >
                  Move Order Information
                </Text>
                <VStack w="99%" mb={6}>
                  <Stack w="full" mt={2}>
                    <Flex justifyContent="space-between">
                      <FormLabel fontSize="xs" w="40%">
                        MIR ID:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.orderNo
                            ? moveOrderInformation.orderNo
                            : "Please select a list"}
                        </Text>
                      </FormLabel>

                      <FormLabel fontSize="xs" w="40%">
                        Delivery Status:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.deliveryStatus
                            ? moveOrderInformation.deliveryStatus
                            : "Please select a list"}
                        </Text>
                      </FormLabel>
                    </Flex>
                  </Stack>
                  <Stack w="full" mt={2}>
                    <Flex justifyContent="space-between">
                      <FormLabel fontSize="xs" w="40%">
                        Customer Code:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.customerName
                            ? moveOrderInformation.customerName
                            : "Please select a list"}
                        </Text>
                      </FormLabel>

                      <FormLabel fontSize="xs" w="40%">
                        Customer Name:
                        <Text
                          textAlign="center"
                          w="full"
                          fontSize="xs"
                          bgColor="gray.200"
                          border="1px"
                          py={1}
                        >
                          {moveOrderInformation.customerCode
                            ? moveOrderInformation.customerCode
                            : "Please select a list"}
                        </Text>
                      </FormLabel>
                    </Flex>
                  </Stack>
                </VStack>
              </VStack>
            </Flex> */}

            <Flex w="full" flexDirection="column">
              <VStack spacing={0}>
                {/* <Text
                  pb={2}
                  textAlign="center"
                  fontSize="sm"
                  color="white"
                  bgColor="primary"
                  w="full"
                  mb={-1.5}
                  mt={2}
                >
                  List of Move Orders
                </Text> */}
                <PageScroll minHeight="350px" maxHeight="400px">
                  <Table mt={2} size="sm" variant="simple" bg="gray.200">
                    <Thead bgColor="secondary">
                      <Tr>
                        {TableHead?.map((t, i) => (
                          <Th color="white" fontSize="xs" key={i}>
                            {t}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {moveOrderViewTable?.map((list, i) => (
                        <Tr key={i}>
                          <Td fontSize="sm">{i + 1}</Td>
                          <Td fontSize="sm">{list.orderDate}</Td>
                          <Td fontSize="sm">{list.itemCode}</Td>
                          <Td fontSize="sm">{list.itemDescription}</Td>
                          {/* <Td fontSize="sm">{list.category}</Td> */}
                          <Td fontSize="sm">{list.uom}</Td>
                          <Td fontSize="sm">{list.quantity}</Td>
                          <Td fontSize="sm">
                            {list.unitCost.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>
                          <Td fontSize="sm">
                            {list.totalCost.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>
                          {list.itemRemarks ? (
                            <Td fontSize="sm">{list.itemRemarks}</Td>
                          ) : (
                            <Td fontSize="sm">-</Td>
                          )}
                          {list.assetTag ? (
                            <Td fontSize="sm">{list.assetTag}</Td>
                          ) : (
                            <Td fontSize="sm">-</Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </PageScroll>
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const TransactConfirmation = ({
  isOpen,
  onClose,
  deliveryDate,
  checkedItems,
  setCheckedItems,
  fetchMoveOrderList,
  setDeliveryDate,
  fetchNotification,
  moveOrderViewTable,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    const arraySubmit = checkedItems?.map((item) => {
      return {
        orderNo: item.orderNo,
        customerName: item.customerName,
        customerCode: item.customerCode,
        orderNoPKey: item.orderNoPKey,
        isApprove: item.isApprove,
        deliveryDate: deliveryDate,
      };
    });

    console.log("Submit Data: ", checkedItems);
    console.log("Orders: ", moveOrderViewTable);

    const genusStatus = checkedItems?.map((item) => {
      return {
        mir_id: item.orderNo,
        status: "Served",
        orders: moveOrderViewTable?.map((item) => ({
          order_id: item.orderNoGenus,
          quantity_serve: item.quantity,
        })),
      };
    });

    console.log("genusStatus: ", genusStatus);

    setIsLoading(true);
    try {
      const res = request
        .post(`Ordering/TransactListOfMoveOrders`, arraySubmit)
        .then((res) => {
          ToastComponent("Success", "Move order transacted", "success", toast);
          fetchNotification();
          setDeliveryDate("");
          setCheckedItems([]);
          fetchMoveOrderList();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Transaction failed", "error", toast);
          setIsLoading(false);
          console.log(err);
        });
    } catch (error) {}

    // GENUS STATUS
    try {
      axios.patch(
        `http://genus-aio.rdfmis.ph/etd/backend/public/api/order/elixir_update`,
        genusStatus,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
          },
        }
      );
    } catch (error) {
      console.log(error);
      ToastComponent("Error", "Genus ETD update status failed", "error", toast);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="center">
            <Text fontSize="14px">Confirmation</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Flex justifyContent="center" mt={7}>
            <Text fontSize="sm">
              Are you sure you want to transact this move order?
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <ButtonGroup size="sm" mt={7}>
            <Button
              onClick={submitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blackAlpha"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
