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
} from "@chakra-ui/react";
import PageScroll from "../../../utils/PageScroll";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";
import axios from "axios";

export const ViewModal = ({ isOpen, onClose, moveOrderInformation, moveOrderViewTable }) => {
  const TableHead = [
    "Line",
    "Order Date",
    "Item Code",
    "Item Description",
    "UOM",
    "Quantity",
    // "Unit Cost",
    // "Total Cost",
    "Item Remarks",
    "Asset Tag",
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
                  <Text fontSize="sm"> {moveOrderInformation.deliveryStatus}</Text>
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

            <Flex w="full" flexDirection="column">
              <VStack spacing={0}>
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
                          <Td fontSize="sm">{list.uom}</Td>
                          <Td fontSize="sm">
                            {list.quantity.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>
                          {/* <Td fontSize="sm">
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
                          </Td> */}
                          {list.itemRemarks ? <Td fontSize="sm">{list.itemRemarks}</Td> : <Td fontSize="sm">-</Td>}
                          {list.assetTag ? <Td fontSize="sm">{list.assetTag}</Td> : <Td fontSize="sm">-</Td>}
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

    // console.log("Submit Data: ", checkedItems);
    // console.log("Orders: ", moveOrderViewTable);

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

    // console.log("genusStatus: ", genusStatus);

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
      axios.patch(`http://genus-aio.rdfmis.ph/etd/backend/public/api/order/elixir_update`, genusStatus, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_GENUS_PROD_TOKEN,
        },
      });
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
            <Text fontSize="sm">Are you sure you want to transact this move order?</Text>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <ButtonGroup size="sm" mt={7}>
            <Button onClick={submitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="blue">
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} disabled={isLoading} colorScheme="blackAlpha">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
