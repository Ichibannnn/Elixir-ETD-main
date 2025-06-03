import {
  Badge,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Tbody,
  Td,
  useToast,
} from "@chakra-ui/react";
import { TiArrowSync } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";

import { useEffect, useState } from "react";
import PageScroll from "../../../utils/PageScroll";
import request from "../../../services/ApiClient";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";

import OrdersConfirmation from "./OrdersConfirmation";

export const ListOrders = ({ genusOrders, fetchingData, setFromDate, setToDate, fromDate, toDate, fetchNotification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [errorData, setErrorData] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dateVar = new Date();
  const minDate = moment(dateVar.setDate(dateVar.getDate() - 5)).format("yyyy-MM-DD");

  // ARRAY FOR THE LIST DATA
  const resultArray = genusOrders?.result?.map((item) =>
    item.orders?.map((itemsub) => {
      return {
        trasactId: itemsub?.transaction_id,
        requestor: item?.requestor_name,
        approver: item?.approver_name,
        cip_No: item?.cip_no,
        orderNo: itemsub?.id,
        orderDate: item?.date_ordered,
        dateNeeded: item?.date_needed,
        department: item?.charge_department_name,
        customerCode: item?.customer_code,
        customerName: item?.customer_name,
        customerType: item?.order_type,
        itemCode: itemsub?.material_code,
        itemdDescription: itemsub?.material_name,
        category: itemsub?.category_name,
        uom: itemsub?.uom_code,
        quantityOrdered: itemsub?.quantity,
        // companyCode: item?.charge_company_code,
        // companyName: item?.charge_company_name,
        // departmentCode: item?.charge_department_code,
        // departmentName: item?.charge_department_name,
        // locationCode: item?.charge_location_code,
        // locationName: item?.charge_location_name,
        rush: item?.rush,
        itemRemarks: itemsub?.remarks,
        accountCode: itemsub?.account_title_code,
        accountTitles: itemsub?.account_title_name,
        assetTag: itemsub?.plate_no,
        helpdeskNo: item?.helpdesk_no,
        dateApproved: item?.date_approved,

        oneChargingCode: 10,
      };
    })
  );

  // SYNC ORDER BUTTON
  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these orders?",
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#1B1C1D",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
      footer:
        '<span style="color: orange; border-color: none !important;">' +
        '<FaExclamationTriangle style="margin-right: 5px;" />' +
        "Note: Before synching, please check that every Genus ETD orders has been fulfilled.</span>",
    }).then((result) => {
      const submitBody = resultArray.flat().map((submit) => {
        return {
          trasactId: submit?.trasactId,
          requestor: submit?.requestor,
          approver: submit?.approver,
          cip_No: submit?.cip_No,
          orderNo: submit?.orderNo,
          orderDate: moment(submit?.orderDate).format("yyyy-MM-DD"),
          dateNeeded: moment(submit?.dateNeeded).format("yyyy-MM-DD"),
          department: submit?.department,
          customerCode: submit?.customerCode,
          customerName: submit?.customerName,
          customerType: submit?.customerType,
          itemCode: submit?.itemCode,
          itemdDescription: submit?.itemdDescription,
          category: submit?.category,
          uom: submit?.uom,
          quantityOrdered: submit?.quantityOrdered,
          // companyCode: submit?.companyCode,
          // companyName: submit?.companyName,
          // departmentCode: submit?.departmentCode,
          // departmentName: submit?.departmentName,
          // locationCode: submit?.locationCode,
          // locationName: submit?.locationName,
          rush: submit?.rush,
          itemRemarks: submit?.itemRemarks,
          accountCode: submit?.accountCode,
          accountTitles: submit?.accountTitles,
          assetTag: submit?.assetTag,
          helpdeskNo: submit?.helpdeskNo ? submit?.helpdeskNo : null,
          dateApproved: moment(submit?.dateApproved).format("yyyy-MM-DD"),

          oneChargingCode: submit?.oneChargingCode,
        };
      });
      if (result.isConfirmed) {
        console.log("Result without errors: ", submitBody);
        try {
          setIsLoading(true);
          const res = request
            .post(`Ordering/AddNewOrders`, submitBody)
            .then((res) => {
              ToastComponent("Success", "Orders Synced!", "success", toast);
              fetchNotification();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  const filteredLength = genusOrders?.result
    ?.filter((val) => {
      const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
      return val?.customer_name?.toLowerCase().match(newKeyword, "*");
    })
    .reduce((a, item) => {
      return [...a, ...item.orders];
    }, []);

  const [ordersCount, setOrdersCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  useEffect(() => {
    if (keyword) {
      genusOrders.result?.map((orders) => {
        if (orders?.customer_name.toString().toLowerCase().includes(keyword)) {
          setFilteredCount((prevState) => prevState + orders.orders.length);
        }
      });
    }
  }, [keyword]);

  useEffect(() => {
    setOrdersCount(0);
    if (genusOrders.result) {
      genusOrders?.result?.map((orders) => {
        orders?.orders?.map((order) => {
          setOrdersCount((prevState) => prevState + 1);
        });
      });
    }
  }, [genusOrders]);

  return (
    <Flex color="fontColor" h="100vh" w="full" flexDirection="column" p={2} bg="form">
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="center">
          <HStack>
            <Badge fontSize="xs" colorScheme="blue" variant="solid">
              From:
            </Badge>
            <Input
              onChange={(date) => setFromDate(date.target.value)}
              defaultValue={fromDate}
              min={minDate}
              type="date"
              fontSize="11px"
              fontWeight="semibold"
              onKeyDown={(e) => e.preventDefault()}
            />
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
              onKeyDown={(e) => e.preventDefault()}
            />
          </HStack>
        </Flex>

        {fromDate && toDate ? (
          <>
            <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
              <HStack>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none" children={<FiSearch bg="black" fontSize="18px" />} />
                  <Input
                    fontSize="13px"
                    size="sm"
                    type="text"
                    placeholder="Search: Customer Name"
                    onChange={(e) => setKeyword(e.target.value)}
                    disabled={isLoading}
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.400" }}
                  />
                </InputGroup>
              </HStack>

              <HStack>
                <Button colorScheme="blue" size="sm" fontSize="13px" leftIcon={<TiArrowSync fontSize="19px" />} onClick={() => syncHandler()} isLoading={isLoading}>
                  Sync
                </Button>
              </HStack>
            </Flex>

            <Flex p={4}>
              <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
                <Text color="white" fontSize="13px" textAlign="center">
                  LIST OF ORDERS
                </Text>
              </VStack>
            </Flex>

            <Flex p={4}>
              <VStack alignItems="center" w="100%" mt={-8}>
                <PageScroll minHeight="640px" maxHeight="720px" maxWidth="full">
                  {fetchingData ? (
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
                            MIR ID
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Ordered Date
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Ordered Needed
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Customer Code
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Customer
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Customer Type
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Charging Department
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Charging Location
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Item Code
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Item Description
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Category
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            UOM
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Quantity Order
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Item Remarks
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Asset Tag
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {genusOrders?.result
                          ?.filter((val) => {
                            const newKeyword = new RegExp(`${keyword.toLowerCase()}`);

                            return val?.customer_name?.toLowerCase().match(newKeyword, "*");
                          })
                          ?.map((order, i) =>
                            order.orders?.map((sub, i) => (
                              <Tr key={i}>
                                <Td fontSize="12px">{sub.transaction_id}</Td>
                                <Td fontSize="12px">{moment(order.date_ordered).format("yyyy-MM-DD")}</Td>
                                <Td fontSize="12px">{moment(order.date_needed).format("yyyy-MM-DD")}</Td>
                                <Td fontSize="12px">{order.customer_code}</Td>
                                <Td fontSize="12px">{order.customer_name}</Td>
                                <Td fontSize="12px">{order.order_type}</Td>
                                <Td fontSize="12px">{order.charge_department_name}</Td>
                                <Td fontSize="12px">{order.charge_location_name}</Td>
                                <Td fontSize="12px">{sub.material_code}</Td>
                                <Td fontSize="12px">{sub.material_name}</Td>
                                <Td fontSize="12px">{sub.category_name}</Td>
                                <Td fontSize="12px">{sub.uom_code}</Td>
                                <Td fontSize="12px">
                                  {sub.quantity.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigi: 2,
                                  })}
                                </Td>
                                {sub.remarks ? <Td fontSize="12px">{sub.remarks}</Td> : <Td fontSize="12px">-</Td>}
                                {sub.plate_no ? <Td fontSize="12px">{sub.plate_no}</Td> : <Td fontSize="12px">-</Td>}
                              </Tr>
                            ))
                          )}
                      </Tbody>
                    </Table>
                  )}
                </PageScroll>
              </VStack>
            </Flex>
          </>
        ) : (
          ""
        )}

        {fromDate && toDate ? (
          <Flex>
            <HStack>
              <Badge colorScheme="cyan">
                <Text color="secondary">
                  {genusOrders?.result?.length > 0 && genusOrders?.result?.orders?.length}
                  {!keyword
                    ? `Number of records: ${ordersCount}`
                    : // : `Results for ${keyword}`}
                      `Number of records from ${keyword}: ${filteredLength.length}`}
                </Text>
              </Badge>
            </HStack>
          </Flex>
        ) : (
          ""
        )}

        {isOpen && (
          <>
            <OrdersConfirmation
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              resultArray={resultArray}
              errorData={errorData}
              setErrorData={setErrorData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              fetchNotification={fetchNotification}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
};
