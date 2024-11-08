import React from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  HStack,
  ModalOverlay,
} from "@chakra-ui/react";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";

export const ViewModal = ({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              View Fuel Request
            </Text>
          </Flex>
        </ModalHeader>

        <ModalBody mb={5}>
          <Flex direction="row" gap={1} alignItems="flex-start">
            <HStack w="50%">
              <VStack alignItems="start" spacing={1} mt={4}>
                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    ID:
                  </Text>
                  <Text fontSize="xs">{data?.id}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Driver:
                  </Text>
                  <Text fontSize="xs">{data?.driver}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Remarks:
                  </Text>
                  <Text fontSize="xs">{data?.remarks}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Requested Date:
                  </Text>
                  <Text fontSize="xs">{moment(data.created_At).format("MM/DD/yyyy")}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Approved Date:
                  </Text>
                  <Text fontSize="xs">{moment(data.approve_At).format("MM/DD/yyyy")}</Text>
                </HStack>
              </VStack>
            </HStack>

            <HStack w="50%">
              <VStack alignItems="start" spacing={1} mt={4}>
                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Company:
                  </Text>
                  <Text fontSize="xs">{data?.company_Code ? `${data?.company_Code} - ${data?.company_Name}` : "-"}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Department
                  </Text>
                  <Text fontSize="xs">{data?.department_Code ? `${data?.department_Code} - ${data?.department_Name}` : "-"}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Location
                  </Text>
                  <Text fontSize="xs">{data?.location_Code ? `${data?.location_Code} - ${data?.location_Name}` : "-"}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Account Title
                  </Text>
                  <Text fontSize="xs">{data?.account_Title_Code ? `${data?.account_Title_Code} - ${data?.account_Title_Name}` : "-"}</Text>
                </HStack>

                {data?.empId && (
                  <>
                    <HStack>
                      <Text fontSize="xs" fontWeight="semibold">
                        Employee ID:
                      </Text>
                      <Text fontSize="xs">{data?.empId ? data?.empId : "-"}</Text>
                    </HStack>

                    <HStack>
                      <Text fontSize="xs" fontWeight="semibold">
                        FullName:
                      </Text>
                      <Text fontSize="xs">{data?.fullname ? data?.fullname : "-"}</Text>
                    </HStack>
                  </>
                )}
              </VStack>
            </HStack>
          </Flex>

          <VStack justifyContent="center" mt={4}>
            <PageScroll minHeight="320px" maxHeight="321px">
              <Table size="sm" variant="striped">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      SOURCE
                    </Th>
                    <Th color="white" fontSize="xs">
                      ITEM CODE
                    </Th>
                    <Th color="white" fontSize="xs">
                      ITEM DESCRIPTION
                    </Th>
                    <Th color="white" fontSize="xs">
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      LITERS
                    </Th>
                    <Th color="white" fontSize="xs">
                      ASSET
                    </Th>
                    <Th color="white" fontSize="xs">
                      UNIT COST
                    </Th>
                    <Th color="white" fontSize="xs">
                      ODOMETER
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontSize="xs">{data.source}</Td>
                    <Td fontSize="xs">{data.item_Code}</Td>
                    <Td fontSize="xs">{data.item_Description}</Td>
                    <Td fontSize="xs">{data.uom}</Td>
                    <Td fontSize="xs">
                      {data.liters.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">{data.asset}</Td>
                    <Td fontSize="xs">
                      {data.unit_Cost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {data.odometer.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Requested By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {data?.driver}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>

              {data?.approve_By && (
                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Approved By:
                  </Text>
                  <Text textDecoration="underline" fontSize="xs">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {data?.approve_By}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </HStack>
              )}
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
