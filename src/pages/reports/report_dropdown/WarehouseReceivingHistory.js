import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, HStack, Text } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import InfiniteScroll from "react-infinite-scroll-component";

export const WarehouseReceivingHistory = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchWarehouseReceivingHistoryApi = async (dateFrom, dateTo, search) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(`Reports/WareHouseReceivingReports?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchWarehouseReceivingHistory = () => {
    fetchWarehouseReceivingHistoryApi(dateFrom, dateTo, search).then((res) => {
      setWarehouseData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            ID: item.warehouseId,
            "Received Date": item.receiveDate,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescrption,
            "PO. #": item.poNumber,
            "SI #": item.siNumber,
            Supplier: item.supplierName,
            Quantity: item.quantity,
            UOM: item.uom,
            "Unit Price": item.unitPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            Amount: item.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Total Reject": item.totalReject.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Received By": item.receivedBy ? item.receivedBy : "-",
          };
        })
      );

      setDisplayedData(res?.inventory?.slice(0, itemsPerPage));
      setHasMore(res?.inventory?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= warehouseData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(warehouseData?.inventory?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchWarehouseReceivingHistory();

    return () => {
      setWarehouseData([]);
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
                    ID
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Received Date
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    PO Number
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    SI Number
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
                        Quantity
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Unit Cost
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Line Amount
                      </Th>
                    </>
                  ) : (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Total Reject
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Supplier
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Received By
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{item.warehouseId}</Td>
                    <Td fontSize="xs">{item.receiveDate}</Td>
                    <Td fontSize="xs">{item.poNumber ? item.poNumber : "-"}</Td>
                    <Td fontSize="xs">{item.siNumber ? item.siNumber : "-"}</Td>
                    {buttonChanger ? (
                      <>
                        {/* Item Information */}
                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <Flex flexDirection="column" justifyContent="left">
                              <HStack fontSize="sm" spacing="5px">
                                <Text color="gray.700" fontWeight="bold">
                                  {item.itemDescrption}
                                </Text>
                              </HStack>

                              <HStack fontSize="xs" spacing="5px">
                                <Text color="gray.700">{item.itemCode}</Text>
                              </HStack>
                            </Flex>
                          </Flex>
                        </Td>

                        <Td fontSize="xs">{item.uom}</Td>
                        <Td fontSize="xs">
                          {item.quantity.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {item.unitPrice.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {item.amount.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                      </>
                    ) : (
                      <>
                        <Td fontSize="xs">
                          {item.totalReject.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">{item.supplierName}</Td>
                        <Td fontSize="xs">{item.receivedBy ? item.receivedBy : "-"}</Td>
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
          Total Records: {warehouseData?.inventory?.length}
        </Text>
        <Button size="md" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
