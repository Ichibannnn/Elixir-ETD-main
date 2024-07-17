import React, { useEffect, useState } from "react";
import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment/moment";
import InfiniteScroll from "react-infinite-scroll-component";

export const InventoryMovement = ({ dateTo, setSheetData, search }) => {
  const [movementData, setMovementData] = useState([]);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchInventoryMovementApi = async (dateTo, search) => {
    const res = await request.get(`Reports/InventoryMovementReport?PageNumber=1&PageSize=1000000&DateFrom=2023-01-01&PlusOne=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchInventoryMovement = () => {
    fetchInventoryMovementApi(dateTo, search).then((res) => {
      setMovementData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            // "Item Category": item.itemCategory,
            "Ending IN": item.totalIn.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            "Ending Out": item.totalOut.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            Ending: item.ending.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            "Purchased Order": item.purchaseOrder.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            Others: item.otherPlus.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
            "Current Stock": item.currentStock.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }),
          };
        })
      );

      setDisplayedData(res?.inventory?.slice(0, itemsPerPage));
      setHasMore(res?.inventory?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= movementData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(movementData?.inventory?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchInventoryMovement();

    return () => {
      setMovementData([]);
      setDisplayedData([]);
    };
    // }, [dateFrom, dateTo])
  }, [dateTo, search]);

  // console.log("Display Data: ", displayedData);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
          <InfiniteScroll dataLength={displayedData.length} next={fetchMoreData} hasMore={hasMore} loader={<h4>Loading...</h4>} height={740} scrollThreshold={0.9}>
            <Table size="md" variant="striped">
              <Thead bgColor="primary" h="40px" position="sticky" top={0} zIndex="1">
                <Tr>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Item Code
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Item Description
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">{`Ending (IN)`}</Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">{`Ending (OUT)`}</Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Ending
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Purchased Order
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Others
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Current Stock
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{item.itemCode}</Td>
                    <Td fontSize="xs">{item.itemDescription}</Td>
                    <Td fontSize="xs">
                      {item.totalIn.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.totalOut.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.ending.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.purchaseOrder.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.otherPlus.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {item.currentStock.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </InfiniteScroll>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {movementData?.inventory?.length}
        </Text>
        <Box />
      </Flex>
    </Flex>
  );
};
