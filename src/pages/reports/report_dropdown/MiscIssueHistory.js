import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button, HStack, Select, Stack, Text, Box } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import moment from "moment";

export const MiscIssueHistory = ({ dateFrom, dateTo, sample, setSheetData, search }) => {
  const [miscIssueData, setMiscIssueData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchMiscellaneousIssueHistoryApi = async (dateFrom, dateTo, search) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(`Reports/MiscellaneousIssueReport?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchMiscellaneousIssueHistory = () => {
    fetchMiscellaneousIssueHistoryApi(dateFrom, dateTo, search).then((res) => {
      setMiscIssueData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Issue ID": item.orderId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            Details: item.details,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            Quantity: item.quantity,
            // 'Expiration Date': item.expirationDate,
            "Transacted By": item.transactBy,
            "Transaction Date": new Date(moment(item.transactDate).format("MM/DD/YYYY")),
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchMiscellaneousIssueHistory();

    return () => {
      setMiscIssueData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
          <Table size="md" variant="striped">
            <Thead bgColor="primary" h="40px" position="sticky" top={0} zIndex="1">
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Issue ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Name
                </Th>
                {buttonChanger ? (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Details
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                    {/* <Th color='white'>category</Th>  */}
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transacted By
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transaction Date
                    </Th>
                  </>
                ) : (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Company Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Company Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Department Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Department Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Location Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Location Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Account Title
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {miscIssueData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.issueId}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.details}</Td>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      {/* <Td>Body</Td> */}
                      <Td fontSize="xs">
                        {item.quantity.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{item.transactBy}</Td>
                      <Td fontSize="xs">{moment(item.transactDate).format("yyyy-MM-DD")}</Td>
                    </>
                  ) : (
                    <>
                      {/* <Td>{item.expirationDate}</Td> */}
                      <Td fontSize="xs">{item.companyCode}</Td>
                      <Td fontSize="xs">{item.companyName}</Td>
                      <Td fontSize="xs">{item.departmentCode}</Td>
                      <Td fontSize="xs">{item.departmentName}</Td>
                      <Td fontSize="xs">{item.locationCode}</Td>
                      <Td fontSize="xs">{item.locationName}</Td>
                      <Td fontSize="xs">{item.accountTitles}</Td>
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
          Total Records: {miscIssueData?.inventory?.length}
        </Text>
        <Button size="xs" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
