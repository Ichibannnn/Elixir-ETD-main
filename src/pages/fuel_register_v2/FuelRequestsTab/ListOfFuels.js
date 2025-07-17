import React, { useEffect } from "react";
import { Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { RiDeleteBack2Fill } from "react-icons/ri";

import PageScroll from "../../../utils/PageScroll";
import { CancelConfirmation } from "./ActionModal";

export const ListOfFuels = ({ fuelData, fetchBarcode, selectorId, setSelectorId, fetchActiveFuelRequests }) => {
  const TableHead = ["ID", "Item Code", "Item Description", "Diesel PO#", "Fuel Pump", "UOM", "Unit Cost", "Liters", "Cancel"];

  const { isOpen: isCancel, onClose: closeCancel, onOpen: openCancel } = useDisclosure();

  const cancelHandler = (id) => {
    if (id) {
      setSelectorId(id);
      openCancel();
    } else {
      setSelectorId("");
    }
  };

  // console.log("FuelData: ", fuelData);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <VStack justifyContent="center" w="full" spacing={-1}>
        <Text bgColor="primary" w="full" color="white" textAlign="center" fontSize="sm" py={1} h="30px">
          List of Fuel Requests
        </Text>
        <Flex justifyContent="center" w="full">
          <PageScroll minHeight="350px" maxHeight="351px">
            <Table size="sm">
              <Thead bgColor="secondary" position="sticky" top={0}>
                <Tr>
                  {TableHead?.map((item, i) => (
                    <Th color="white" fontSize="11px" key={i}>
                      {item}
                    </Th>
                  ))}
                </Tr>
              </Thead>

              <Tbody>
                {fuelData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="sm">{item?.id}</Td>

                    <Td fontSize="sm">{item?.item_Code}</Td>
                    <Td fontSize="sm">{item?.item_Description}</Td>
                    <Td fontSize="sm">{item?.dieselPONumber}</Td>
                    <Td fontSize="sm">{item?.fuelPump}</Td>
                    <Td fontSize="sm">{item?.uom}</Td>
                    <Td fontSize="sm">
                      {item?.unit_Cost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="sm">
                      {item?.liters.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
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
          fetchBarcode={fetchBarcode}
          fetchActiveFuelRequests={fetchActiveFuelRequests}
        />
      )}
    </Flex>
  );
};
