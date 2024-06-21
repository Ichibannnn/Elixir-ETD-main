import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button, HStack, Select, Stack, Text } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";

export const MoveOrderHistory = ({ dateFrom, dateTo, sample, setSheetData, search }) => {
  const [moData, setMoData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);

  const fetchMoveOrderHistoryApi = async (dateFrom, dateTo, search) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(`Reports/MoveOrderHistory?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchMoveOrderHistory = () => {
    fetchMoveOrderHistoryApi(dateFrom, dateTo, search).then((res) => {
      setMoData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "MIR ID": item.mirId,
            "CIP #": item.cip_No === null ? "-" : item.cip_No,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Customer Type": item.customerType,
            "Account Title Code": item.accountCode,
            "Account Title": item.accountTitles,
            "Company Code": item.companyCode,
            "Company Name": item.companyName,
            "Department Code": item.departmentCode,
            "Department Name": item.departmentName,
            "Location Code": item.locationCode,
            "Location Name": item.locationName,
            Description: `${item.itemCode} - ${item.itemDescription}`,
            "Qty.": item.quantity,
            UOM: item.uom,
            "Unit Cost": item.unitCost,
            "Line Amount": item.lineAmount,
            Remarks: item.itemRemarks === null ? "-" : item.itemRemarks,
            Category: item.category,
            "Asset Tag": item.assetTag === null ? "-" : item.assetTag,
            "Helpdesk #": item.helpdeskNo === 0 ? "-" : item.helpdeskNo,
            Rush: item.rush === null ? "-" : item.rush,
            "Order Date": item.orderDate ? new Date(moment(item.orderDate).format("MM/DD/YYYY")) : "-",
            "Date Needed": item.dateNeeded ? new Date(moment(item.dateNeeded).format("MM/DD/YYYY")) : "-",
            "Date Approved": item.dateApproved ? new Date(moment(item.dateApproved).format("MM/DD/YYYY")) : "-",
            Status: item.transactedDate ? "Transacted" : "For Transaction",
            Requestor: item.requestor,
            Approver: item.approver,
            "Move Order Date": item.moveOrderDate ? new Date(moment(item.moveOrderDate).format("MM/DD/YYYY")) : "",
            "Move Order By": item.moveOrderBy,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchMoveOrderHistory();

    return () => {
      setMoData([]);
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
                  MIR ID
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
                      Customer Type
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
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Category
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Line Amount
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Asset Tag
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      CIP No.
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Order Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Date Needed
                    </Th>

                    {/* <Th color="white" fontSize="10px" fontWeight="semibold">
                      Batch Number
                    </Th> */}
                  </>
                ) : (
                  <>
                    {/* <Th color='white'>Expiration Date</Th> */}
                    {/* <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transaction Type
                    {/* <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transacted Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transacted By
                    </Th> */}
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
                      Account Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Account Title
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Status
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Move Order Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Move Order By
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {moData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.mirId}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.customerType}</Td>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">{item.category}</Td>
                      <Td fontSize="xs">
                        {item.quantity.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.unitCost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.lineAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{item.assetTag === null ? "-" : item.assetTag}</Td>
                      <Td fontSize="xs">{item.cip_No === null ? "-" : item.cip_No}</Td>
                      <Td fontSize="xs">{item.orderDate ? moment(item.orderDate).format("yyyy-MM-DD") : "-"}</Td>
                      <Td fontSize="xs">{item.dateNeeded ? moment(item.dateNeeded).format("yyyy-MM-DD") : "-"}</Td>
                      {/* <Td fontSize="xs">{item.batchNo}</Td> */}
                    </>
                  ) : (
                    <>
                      {/* <Td>{item.expirationDate ? moment(item.expirationDate).format('yyyy-MM-DD') : ''}</Td> */}
                      {/* <Td fontSize="xs">{item.transactionType}</Td> */}

                      {/* <Td fontSize="xs">
                        {item.transactedDate
                          ? moment(item.transactedDate).format("yyyy-MM-DD")
                          : ""}
                      </Td>
                      <Td fontSize="xs">
                        {item.transactedBy ? item.transactedBy : ""}
                      </Td> */}
                      <Td fontSize="xs">{item.companyCode}</Td>
                      <Td fontSize="xs">{item.companyName}</Td>
                      <Td fontSize="xs">{item.departmentCode}</Td>
                      <Td fontSize="xs">{item.departmentName}</Td>
                      <Td fontSize="xs">{item.locationCode}</Td>
                      <Td fontSize="xs">{item.locationName}</Td>
                      <Td fontSize="xs">{item.accountCode}</Td>
                      <Td fontSize="xs">{item.accountTitles}</Td>
                      <Td fontSize="xs">{item.transactedDate ? "Transacted" : "For Transaction"}</Td>
                      <Td fontSize="xs">{item.moveOrderDate ? moment(item.moveOrderDate).format("yyyy-MM-DD") : ""}</Td>
                      <Td fontSize="xs">{item.moveOrderBy}</Td>
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
          Total Records: {moData?.inventory?.length}
        </Text>
        <Button size="xs" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
