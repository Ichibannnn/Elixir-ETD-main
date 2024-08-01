import React, { useEffect } from "react";
import { Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import PageScroll from "../../../utils/PageScroll";
import { CancelConfirmation } from "./ActionModal";

export const ListOfIssue = ({ miscData, selectorId, setSelectorId, setTotalQuantity, fetchActiveMiscIssues, fetchBarcodeNo, fetchRawMats }) => {
  const TableHead = ["Line", "ID", "Item Code", "Item Description", "UOM", "Quantity", "Unit Cost", "Account Title", "Employee Information", "Cancel"];

  const { isOpen: isCancel, onClose: closeCancel, onOpen: openCancel } = useDisclosure();
  const cancelHandler = (id) => {
    if (id) {
      setSelectorId(id);
      openCancel();
    } else {
      setSelectorId("");
    }
  };

  useEffect(() => {
    if (miscData.length) {
      let sumQuantity = miscData.map((q) => parseFloat(q.totalQuantity));
      let sum = sumQuantity.reduce((a, b) => a + b);
      setTotalQuantity(sum);
    }
  }, [miscData]);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <VStack justifyContent="center" w="full" spacing={-1}>
        <Text bgColor="primary" w="full" color="white" textAlign="center" fontSize="sm" py={1} h="30px">
          List of Issue
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
                {miscData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="sm">{i + 1}</Td>
                    <Td fontSize="sm">{item?.id}</Td>
                    <Td fontSize="sm">{item?.itemCode}</Td>
                    <Td fontSize="sm">{item?.itemDescription}</Td>
                    <Td fontSize="sm">{item?.uom}</Td>
                    <Td fontSize="sm">{item?.totalQuantity}</Td>
                    <Td fontSize="sm">
                      {item?.unitCost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="sm">
                      {item?.accountCode} - {item?.accountTitles}
                    </Td>

                    {item?.empId && item?.fullName ? (
                      <Td fontSize="sm">
                        {item?.empId} - {item?.fullName}
                      </Td>
                    ) : (
                      <Td fontSize="sm">-</Td>
                    )}

                    <Td fontSize="xs">
                      <Button title="Cancel" onClick={() => cancelHandler(item.id)} size="xs" bg="none">
                        {/* Cancel */}
                        <RiDeleteBack2Fill fontSize="26px" color="#E53E3E" />
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
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          fetchBarcodeNo={fetchBarcodeNo}
          fetchRawMats={fetchRawMats}
        />
      )}
    </Flex>
  );
};
