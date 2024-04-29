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

export const ReturnedQuantityTransaction = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
  search,
}) => {
  const [returnedData, setReturnedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchReturnedHistoryApi = async (dateFrom, dateTo, search) => {
    const dayaDate = moment(dateTo).add(1, "day").format("yyyy-MM-DD");

    const res = await request.get(
      `Reports/BorrowedReturnedReports?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dayaDate}`,
      {
        params: {
          search: search,
        },
      }
    );
    return res.data;
  };

  const fetchReturnedHistory = () => {
    fetchReturnedHistoryApi(dateFrom, dateTo, search).then((res) => {
      setReturnedData(res);
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
            "Borrowed Qty": item.borrowedQuantity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Borrowed Date": moment(item.borrowedDate).format("MM-DD-YYYY"),
            Consumed: item.consumed.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Returned Qty": item.returnedQuantity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Returned Date": item.isApproveReturnDate
              ? moment(item.isApproveReturnDate).format("MM-DD-YYYY")
              : "-",
            "Aging Days": `${item.agingDays} Day(s)`,
            "Service Report No.": item.reportNumber ?? "-",
            "Employee Id": item.empIdByIssue,
            "Employee Name": item.fullNameByIssue,
            "Company Code": item.companyCode ? item.companyCode : "-",
            "Company Name": item.companyName ? item.companyName : "-",
            "Department Code": item.departmentCode ? item.departmentCode : "-",
            "Department Name": item.departmentName ? item.departmentName : "-",
            "Location Code": item.locationCode ? item.locationCode : "-",
            "Location Name": item.locationName ? item.locationName : "-",
            "Account Code": item.accountCode ? item.accountCode : "-",
            "Account Title": item.accountTitles ? item.accountTitles : "-",
            "COA Emp ID": item.empId ? item.empId : "-",
            "COA Fullname": item.fullName ? item.fullName : "-",
            Status: item.status,
            "Transaction By": item.transactedBy,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchReturnedHistory();

    return () => {
      setReturnedData([]);
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
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Borrowed Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Returned Qty
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Returned Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Aging Days
                    </Th>
                  </>
                ) : (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Company
                    </Th>

                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Deparment
                    </Th>

                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Location
                    </Th>

                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Account Title
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
              {returnedData?.inventory?.map((item, i) => (
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

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700" fontWeight="semibold">
                              {item.consumed.toLocaleString(undefined, {
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
                              {item.returnedQuantity.toLocaleString(undefined, {
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
                              {item.isApproveReturnDate !== null
                                ? moment(item.isApproveReturnDate).format(
                                    "MM/DD/yyyy"
                                  )
                                : item.isApproveReturnDate === null &&
                                  item.isActive === true
                                ? "Pending Return"
                                : item.isActive === false &&
                                  item.isApproveReturnDate === null
                                ? "Rejected"
                                : ""}
                            </Text>
                          </HStack>
                        </Flex>
                      </Td>

                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700" fontWeight="semibold">
                              {item.agingDays} Day(s)
                            </Text>
                          </HStack>
                        </Flex>
                      </Td>
                    </>
                  ) : (
                    <>
                      {item.companyCode && item.companyName ? (
                        <Td fontSize="xs">
                          {item.companyCode} - {item.companyName}
                        </Td>
                      ) : (
                        <Td fontSize="xs">-</Td>
                      )}

                      {item.departmentCode && item.departmentName ? (
                        <Td fontSize="xs">
                          {item.departmentCode} - {item.departmentName}
                        </Td>
                      ) : (
                        <Td fontSize="xs">-</Td>
                      )}

                      {item.locationCode && item.locationName ? (
                        <Td fontSize="xs">
                          {item.locationCode} - {item.locationName}
                        </Td>
                      ) : (
                        <Td fontSize="xs">-</Td>
                      )}

                      {item.accountCode && item.accountTitles ? (
                        <Td fontSize="xs">
                          {item.accountCode} - {item.accountTitles}
                        </Td>
                      ) : (
                        <Td fontSize="xs">-</Td>
                      )}

                      <Td fontSize="xs">{item.status}</Td>

                      <Td fontSize="xs">{item.transactedBy}</Td>
                      {/* <Td fontSize="xs">{item.isApproveBy}</Td> */}
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
          Total Records: {returnedData?.inventory?.length}
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
