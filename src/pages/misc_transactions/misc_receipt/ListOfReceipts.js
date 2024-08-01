import React, { useEffect } from "react";
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";

import PageScroll from "../../../utils/PageScroll";

export const ListOfReceipts = ({ listDataTempo, selectorId, setSelectorId, setEditableData, setRowIndex, setTotalQuantity }) => {
  const TableHead = ["Line", "Item Code", "Item Description", "UOM", "Quantity", "Unit Cost", "Account Title", "Employee Information"];

  const rowHandler = (item, i) => {
    setSelectorId(i + 1);
    setEditableData(item);
    const index = listDataTempo.indexOf(item);
    setRowIndex(index);
  };

  useEffect(() => {
    if (listDataTempo.length) {
      let sumQuantity = listDataTempo.map((q) => parseFloat(q.quantity));
      let sum = sumQuantity.reduce((a, b) => a + b);
      setTotalQuantity(sum);
    }
  }, [listDataTempo]);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <VStack justifyContent="center" w="full" spacing={-1}>
        <Text bgColor="primary" w="full" color="white" textAlign="center" fontSize="sm" py={1} h="30px">
          List of Miscellaneous Receipts
        </Text>

        <Flex justifyContent="center" w="full">
          <PageScroll minHeight="350px" maxHeight="351px">
            <Table size="md">
              <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
                <Tr>
                  {TableHead?.map((item, i) => (
                    <Th color="white" fontSize="11px" key={i}>
                      {item}
                    </Th>
                  ))}
                </Tr>
              </Thead>

              <Tbody>
                {listDataTempo?.map((item, i) => (
                  <Tr key={i} onClick={() => rowHandler(item, i)} bgColor={selectorId === i + 1 ? "blue.200" : "none"} cursor="pointer">
                    <Td fontSize="sm">{i + 1}</Td>
                    <Td fontSize="sm">{item?.itemCode}</Td>
                    <Td fontSize="sm">{item?.itemDescription}</Td>
                    <Td fontSize="sm">{item?.uom}</Td>
                    <Td fontSize="sm">
                      {item?.quantity.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="sm">
                      {item?.unitPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="sm">
                      {item?.chargingAccountTitleCode} - {item?.chargingAccountTitleName}
                    </Td>
                    {item?.chargingEmpId && item.chargingFullName ? (
                      <Td fontSize="sm">
                        {item?.chargingEmpId} - {item?.chargingFullName}
                      </Td>
                    ) : (
                      <Td>-</Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScroll>
        </Flex>
      </VStack>
    </Flex>
  );
};
