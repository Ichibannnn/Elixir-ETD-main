import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
  HStack,
  Select,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";

export const BorrowedMatsHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
  search,
}) => {
  const [borrowedData, setBorrowedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchBorrowedHistoryApi = async (dateFrom, dateTo, search) => {
    const dayaDate = moment(dateTo).add(1, "day").format("yyyy-MM-DD");

    const res = await request.get(
      `Reports/BorrowedTransactionReports?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dayaDate}`,
      {
        params: {
          search: search,
        },
      }
    );
    return res.data;
  };

  const fetchBorrowedHistory = () => {
    fetchBorrowedHistoryApi(dateFrom, dateTo, search).then((res) => {
      setBorrowedData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            ID: item.borrowedId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            "Aging Days": item.agingDays.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Borrowed Qty": item.borrowedQuantity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Borrowed Date": moment(item.borrowedDate).format("MM-DD-YYYY"),
            "Employee Id": item.empId,
            "Employee Name": item.fullName,
            Status: item.status,
            "Transaction By": item.transactedBy,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchBorrowedHistory();

    return () => {
      setBorrowedData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
          <Table size="md" variant="striped">
            <Thead
              bgColor="primary"
              h="40px"
              position="sticky"
              top={0}
              zIndex="1"
            >
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Borrowed ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Information
                </Th>
                {buttonChanger ? (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Information
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Aging Days
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Borrowed Date
                    </Th>
                  </>
                ) : (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Employee Information
                    </Th>

                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Status
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Requested By
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {borrowedData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.borrowedId}</Td>

                  {/* Customer Information */}
                  <Td>
                    <Flex flexDirection="column" gap="10px">
                      <Flex flexDirection="column" justifyContent="left">
                        <HStack fontSize="sm" spacing="5px">
                          <Text color="gray.700" fontWeight="bold">
                            {item.customerName}
                          </Text>
                        </HStack>

                        <HStack fontSize="xs" spacing="5px">
                          <Text color="gray.700">{item.customerCode}</Text>
                        </HStack>
                      </Flex>
                    </Flex>
                  </Td>
                  {buttonChanger ? (
                    <>
                      {/* Item Information  */}
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="left">
                            <HStack fontSize="sm" spacing="5px">
                              <Text color="gray.700" fontWeight="bold">
                                {item.itemDescription}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700">{item.itemCode}</Text>
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700" fontWeight="semibold">
                              {item.uom}
                            </Text>
                          </HStack>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700" fontWeight="semibold">
                              {item.agingDays.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </Text>
                          </HStack>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700" fontWeight="semibold">
                              {item.borrowedQuantity.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </Text>
                          </HStack>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">
                              {item.borrowedDate !== null
                                ? moment(item.borrowedDate).format("MM/DD/yyyy")
                                : "Pending Borrowed"}
                            </Text>
                          </HStack>
                        </Flex>
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="left">
                            <HStack fontSize="sm" spacing="5px">
                              <Text color="gray.700" fontWeight="bold">
                                {item.fullName}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700">{item.empId}</Text>
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item.status}</Text>
                          </HStack>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item.transactedBy}</Text>
                          </HStack>
                        </Flex>
                      </Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        {/* <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="primary"
                color="white"
                p={1}
                _hover={{ bg: "btnColor", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "btnColor", color: "white" }}
                    _focus={{ bg: "btnColor" }}
                    p={3}
                    bg="primary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="primary"
                  color="white"
                  p={1}
                  _hover={{ bg: "btnColor", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select
                  onChange={handlePageSizeChange}
                  variant="outline"
                  fontSize="md"
                >
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                  <option value={Number(100)}>100</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack> */}

        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {borrowedData?.inventory?.length}
        </Text>
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => setButtonChanger(!buttonChanger)}
        >
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
