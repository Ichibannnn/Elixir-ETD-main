import React, { useState } from "react";
import {
  Badge,
  Box,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  MdOutlineCheckBox,
  MdOutlinePending,
  MdOutlinePendingActions,
  MdPending,
} from "react-icons/md";
import { GoArrowSmallRight } from "react-icons/go";
import {
  BsCalendar2Check,
  BsCalendar2CheckFill,
  BsCheck2Circle,
} from "react-icons/bs";
import PageScrollImport from "../../components/PageScrollImport";
import moment from "moment";
import PageScroll from "../../utils/PageScroll";
import { BiCheckDouble } from "react-icons/bi";

export const ListOfOrders = ({
  orderListData,
  setItemCode,
  highlighterId,
  setHighlighterId,
  setQtyOrdered,
  setPreparedQty,
  orderId,
  setWarehouseId,
  status,
}) => {
  const rowHandler = ({ id, itemCode, quantityOrder, preparedQuantity }) => {
    // setWarehouseId("");
    if (id && itemCode) {
      setItemCode(itemCode);
      setHighlighterId(id);
      setQtyOrdered(quantityOrder);
      setPreparedQty(preparedQuantity);
    } else {
      setItemCode("");
      setHighlighterId("");
      setQtyOrdered("");
      setPreparedQty("");
    }
  };

  return (
    <VStack w="full" spacing={0} justifyContent="center" mt={10}>
      <Box w="full" bgColor="primary" h="22px">
        <Text
          fontWeight="semibold"
          fontSize="13px"
          color="white"
          textAlign="center"
          justifyContent="center"
        >
          List of Orders
        </Text>
      </Box>
      <PageScroll minHeight="180px" maxHeight="200px">
        <Table size="xs" variant="simple">
          <Thead bgColor="secondary">
            <Tr p={3} position="sticky" top={0} zIndex={1}>
              <Th color="white" fontSize="10px">
                Line
              </Th>
              {/* <Th color="white" fontSize="10px">
                Id
              </Th> */}
              <Th color="white" fontSize="10px">
                Item Code
              </Th>
              <Th color="white" fontSize="10px">
                Item Description
              </Th>
              <Th color="white" fontSize="10px">
                UOM
              </Th>
              <Th color="white" fontSize="10px">
                Qty Ordered
              </Th>
              <Th color="white" fontSize="10px">
                Prepared Qty
              </Th>
              <Th color="white" fontSize="10px">
                Item Remarks
              </Th>
              <Th color="white" fontSize="10px">
                Asset Tag
              </Th>
              {status === false ? (
                ""
              ) : (
                <Th color="white" fontSize="10px">
                  Reason
                </Th>
              )}

              <Th color="white" fontSize="10px">
                Status
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderListData?.map((list, i) => (
              <Tr
                key={i}
                onClick={() => rowHandler(list)}
                bgColor={highlighterId === list.id ? "blue.100" : "none"}
                cursor="pointer"
              >
                {highlighterId === list.id ? (
                  <Td>
                    <GoArrowSmallRight fontSize="27px" />
                  </Td>
                ) : (
                  <Td fontSize="xs">{i + 1}</Td>
                )}
                {/* <Td fontSize="xs">{list.id}</Td> */}
                <Td fontSize="xs">{list.itemCode}</Td>
                <Td fontSize="xs">{list.itemDescription}</Td>
                <Td fontSize="xs">{list.uom}</Td>
                <Td fontSize="xs">
                  {list.quantityOrder.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </Td>
                <Td fontSize="xs">
                  {list.preparedQuantity.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </Td>
                {list.itemRemarks ? (
                  <Td fontSize="xs">{list.itemRemarks}</Td>
                ) : (
                  <Td fontSize="xs">-</Td>
                )}
                {list.assetTag ? (
                  <Td fontSize="xs">{list.assetTag}</Td>
                ) : (
                  <Td fontSize="xs">-</Td>
                )}
                {status === false ? "" : <Td fontSize="xs">{list.rush}</Td>}
                <Td>
                  {list.quantityOrder <= list.preparedQuantity ? (
                    <MdOutlineCheckBox fontSize="20px" title="Done" />
                  ) : (
                    <MdOutlinePendingActions fontSize="20px" title="Pending" />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageScroll>
    </VStack>
  );
};
