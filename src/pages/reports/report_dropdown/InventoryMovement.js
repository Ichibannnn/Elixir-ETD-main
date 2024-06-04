import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment/moment";

export const InventoryMovement = ({ dateTo, setSheetData, search }) => {
  const [movementData, setMovementData] = useState([]);

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
    });
  };

  useEffect(() => {
    fetchInventoryMovement();

    return () => {
      setMovementData([]);
    };
    // }, [dateFrom, dateTo])
  }, [dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
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
              {movementData?.inventory?.map((item, i) => (
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
        </PageScroll>
      </Flex>

      {/* <Flex justifyContent='end' mt={2}>
        <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex> */}
    </Flex>
  );
};
