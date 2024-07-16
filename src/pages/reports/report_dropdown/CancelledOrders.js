import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button, HStack, Select, Stack, Text } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import InfiniteScroll from "react-infinite-scroll-component";

export const CancelledOrders = ({ dateFrom, dateTo, sample, setSheetData, search }) => {
  const [buttonChanger, setButtonChanger] = useState(true);
  const [cancelledData, setCancelledData] = useState([]);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchCancelledOrdersApi = async (dateFrom, dateTo, search) => {
    const res = await request.get(`Reports/CancelledOrderedReports?PageNumber=1&PageSize=1000000&dateFrom=${dateFrom}&dateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchCancelledOrders = () => {
    fetchCancelledOrdersApi(dateFrom, dateTo, search).then((res) => {
      setCancelledData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "MIR ID": item.mirId,
            "Order ID": item.orderId,
            "Date Ordered": item.dateOrdered,
            "Date Needed": item.dateNeeded,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Charging Department": `${item.departmentCode} - ${item.department}`,
            "Charging Location": `${item.locationCode} - ${item.locationName}`,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            "Quantity Unserved": item.quantityOrdered.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Item Remarks": item.itemRemarks ? item.itemRemarks : "-",
            Reason: item.reason,
            "Cancelled Date": moment(item.cancelledDate).format("yyyy-MM-DD"),
            "Cancelled By": item.cancelledBy,
          };
        })
      );

      setDisplayedData(res?.inventory?.slice(0, itemsPerPage));
      setHasMore(res?.inventory?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= cancelledData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(cancelledData?.inventory?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchCancelledOrders();

    return () => {
      setCancelledData([]);
      setDisplayedData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
          <InfiniteScroll dataLength={displayedData.length} next={fetchMoreData} hasMore={hasMore} loader={<h4>Loading...</h4>} height={740} scrollThreshold={0.9}>
            <Table size="md" variant="striped">
              <Thead bgColor="primary" h="40px" position="sticky" top={0} zIndex="1">
                <Tr>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    MIR ID
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Order ID
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Date Ordered
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Date Needed
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Customer Code
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Customer Name
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Charging Department
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Charging Location
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Item Code
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Item Description
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Quantity Unserved
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Item Remarks
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Reason
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Cancelled Date
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Cancelled By
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{item.mirId}</Td>
                    <Td fontSize="xs">{item.orderId}</Td>
                    <Td fontSize="xs">{item.dateOrdered}</Td>
                    <Td fontSize="xs">{item.dateNeeded}</Td>
                    <Td fontSize="xs">{item.customerCode}</Td>
                    <Td fontSize="xs">{item.customerName}</Td>
                    <Td fontSize="xs">
                      {item.departmentCode} - {item.department}
                    </Td>
                    <Td fontSize="xs">
                      {item.locationCode} - {item.locationName}
                    </Td>
                    <Td fontSize="xs">{item.itemCode}</Td>
                    <Td fontSize="xs">{item.itemDescription}</Td>
                    <Td fontSize="xs">
                      {item.quantityOrdered.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Td>
                    {item.itemRemarks ? <Td fontSize="xs">{item.itemRemarks}</Td> : <Td fontSize="xs">-</Td>}
                    <Td fontSize="xs">{item.reason}</Td>
                    {item.cancelledDate ? <Td fontSize="xs">{moment(item.cancelledDate).format("yyyy-MM-DD")}</Td> : <Td fontSize="xs">-</Td>}

                    {item.cancelledBy ? <Td fontSize="xs">{item.cancelledBy}</Td> : <Td fontSize="xs">-</Td>}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </InfiniteScroll>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {cancelledData?.inventory?.length}
        </Text>
      </Flex>
    </Flex>
  );
};
