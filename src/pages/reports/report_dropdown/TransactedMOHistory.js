import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button, HStack, Select, Stack, Text, Box } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import InfiniteScroll from "react-infinite-scroll-component";

export const TransactedMOHistory = ({ dateFrom, dateTo, sample, setSheetData, search }) => {
  const [moData, setMoData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchTransactedMoveOrdersApi = async (dateFrom, dateTo, search) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(`Reports/TransactionReport?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchTransactedMoveOrderHistory = () => {
    fetchTransactedMoveOrdersApi(dateFrom, dateTo, search).then((res) => {
      setMoData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "MIR ID": item.mirId,
            "CIP#": item.cip_No === null ? "-" : item.cip_No,
            "Transaction Date": item.transactedDate ? new Date(moment(item.transactedDate).format("MM/DD/YYYY")) : "",
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Customer Type": item.customerType,
            "Transacted By": item.transactedBy ? item.transactedBy : "",
            "Account Title Code": item.accountCode,
            "Account Title": item.accountTitles,
            "Company Code": item.companyCode,
            "Company Name": item.companyName,
            "Department Code": item.departmentCode,
            "Department Name": item.departmentName,
            "Location Code": item.locationCode,
            "Location Name": item.locationName,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            "Qty.": item.quantity,
            UOM: item.uom,
            "Unit Cost": item.unitCost,
            "Line Amount": item.lineAmount,
            Remarks: item.itemRemarks === null ? "-" : item.itemRemarks,
            Category: item.category,
            "Asset Tag": item.assetTag === null ? "-" : item.assetTag,
            "Helpdesk #": item.helpDesk === 0 ? "-" : item.helpDesk,
            Rush: item.rush === null ? "-" : item.rush,
            "Order Date": item.orderDate ? new Date(moment(item.orderDate).format("MM/DD/YYYY")) : "",
            "Date Needed": item.dateNeeded ? new Date(moment(item.dateNeeded).format("MM/DD/YYYY")) : "",
            "Date Approved": item.dateApproved ? new Date(moment(item.dateApproved).format("MM/DD/YYYY")) : "-",
            Status: item.transactedDate ? "Transacted" : "For Transaction",
            Requestor: item.requestor,
            Approver: item.approver,
            "Move Order Date": item.moveOrderDate ? new Date(moment(item.moveOrderDate).format("MM/DD/YYYY")) : "",
            "Move Order By": item.moveOrderBy,
          };
        })
      );

      setDisplayedData(res?.inventory?.slice(0, itemsPerPage));
      setHasMore(res?.inventory?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= moData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(moData?.inventory?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchTransactedMoveOrderHistory();

    return () => {
      setMoData([]);
      setDisplayedData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
          <InfiniteScroll dataLength={displayedData.length} next={fetchMoreData} hasMore={hasMore} loader={<h4>Loading...</h4>} height={740} scrollThreshold={0.9}>
            <Table size="md" variant="striped">
              <Thead bgColor="primary" h="40px" position="sticky" top={0} zIndex={1}>
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
                        LIne Amount
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
                        Account Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Account Title
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Status
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Transacted Date
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Transacted By
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData?.map((item, i) => (
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
                        {/* <Td fontSize="xs">
                        {item.transactedDate ? "Transacted" : "For Transaction"}
                      </Td> */}
                        {/* <Td fontSize="xs">{item.batchNo}</Td> */}
                      </>
                    ) : (
                      <>
                        <Td fontSize="xs">{item.companyCode}</Td>
                        <Td fontSize="xs">{item.companyName}</Td>
                        <Td fontSize="xs">{item.departmentCode}</Td>
                        <Td fontSize="xs">{item.departmentName}</Td>
                        <Td fontSize="xs">{item.locationCode}</Td>
                        <Td fontSize="xs">{item.locationName}</Td>
                        <Td fontSize="xs">{item.accountCode}</Td>
                        <Td fontSize="xs">{item.accountTitles}</Td>
                        <Td fontSize="xs">{item.transactedDate ? "Transacted" : "For Transaction"}</Td>
                        <Td fontSize="xs">{item.transactedDate ? moment(item.transactedDate).format("yyyy-MM-DD") : "-"}</Td>
                        <Td fontSize="xs">{item.transactedBy ? item.transactedBy : "-"}</Td>
                      </>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </InfiniteScroll>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
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
