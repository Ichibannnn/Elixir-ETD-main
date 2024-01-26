import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import PageScroll from "../../utils/PageScroll";
import { CancelConfirmation } from "./ActionModal";
// import { CancelConfirmation } from './Action-Modal'

export const ListOfBorrowed = ({
  borrowedData,
  selectorId,
  setSelectorId,
  setTotalQuantity,
  fetchActiveBorrowed,
  fetchBarcodeNo,
  fetchRawMats,
  remarks,
}) => {
  const TableHead = [
    "Line",
    "ID",
    "Item Code",
    "Item Description",
    "UOM",
    "Quantity",
    "Cancel",
  ];

  const {
    isOpen: isCancel,
    onClose: closeCancel,
    onOpen: openCancel,
  } = useDisclosure();
  const cancelHandler = (id) => {
    if (id) {
      setSelectorId(id);
      openCancel();
    } else {
      setSelectorId("");
    }
  };

  useEffect(() => {
    if (borrowedData.length) {
      let sumQuantity = borrowedData.map((q) => parseFloat(q.totalQuantity));
      let sum = sumQuantity.reduce((a, b) => a + b);
      setTotalQuantity(sum);
    }
  }, [borrowedData]);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <VStack justifyContent="center" w="full" spacing={-1}>
        <Text
          bgColor="primary"
          w="full"
          color="white"
          textAlign="center"
          fontSize="sm"
          py={1}
          h="30px"
        >
          List of Request Materials
        </Text>
        <Flex justifyContent="center" w="full">
          <PageScroll minHeight="350px" maxHeight="351px">
            <Table size="sm">
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
                {borrowedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="sm">{i + 1}</Td>
                    <Td fontSize="sm">{item?.id}</Td>
                    <Td fontSize="sm">{item?.itemCode}</Td>
                    <Td fontSize="sm">{item?.itemDescription}</Td>
                    <Td fontSize="sm">{item?.uom}</Td>
                    <Td fontSize="sm">
                      {item?.totalQuantity.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="sm">
                      <Button
                        onClick={() => cancelHandler(item.id)}
                        colorScheme="red"
                        size="xs"
                        borderRadius="none"
                      >
                        Cancel
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScroll>
        </Flex>
      </VStack>

      {isCancel && (
        <CancelConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          selectorId={selectorId}
          setSelectorId={setSelectorId}
          fetchActiveBorrowed={fetchActiveBorrowed}
          fetchBarcodeNo={fetchBarcodeNo}
          fetchRawMats={fetchRawMats}
        />
      )}
    </Flex>
  );
};
