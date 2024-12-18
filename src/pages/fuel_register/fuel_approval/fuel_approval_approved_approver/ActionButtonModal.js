import React, { useRef } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
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
  Image,
} from "@chakra-ui/react";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";

import { useReactToPrint } from "react-to-print";

export const ViewModal = ({ isOpen, onClose, data }) => {
  console.log("Data: ", data);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              View Fuel RequestSD
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
                    Requestor:
                  </Text>
                  <Text fontSize="xs">{data?.requestorName}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Asset:
                  </Text>
                  <Text fontSize="xs">{data?.asset}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Odometer:
                  </Text>
                  <Text fontSize="xs">
                    {data.odometer
                      ? data.odometer.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : "N/A"}
                  </Text>
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
                      UNIT COST
                    </Th>
                    <Th color="white" fontSize="xs">
                      LITERS
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.getFuelDetails?.map((item) => (
                    <Tr key={item.id}>
                      <Td fontSize="xs">{data.source}</Td>
                      <Td fontSize="xs">{item?.item_Code}</Td>
                      <Td fontSize="xs">{item?.item_Description}</Td>
                      <Td fontSize="xs">{item?.uom}</Td>
                      <Td fontSize="xs">
                        {item?.unit_Cost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.liters.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                    </Tr>
                  ))}
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
                  {data?.requestorName}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transacted By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {data?.added_By}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
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

export const PrintModal = ({ isOpen, onClose, data }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log("Data: ", data);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={5} fontSize="md"></ModalHeader>

        <ModalCloseButton color="black" onClick={onClose} />

        <ModalBody mb={10} ref={componentRef}>
          {/* Display Fuel Details */}
          <Flex spacing={0} justifyContent="start" flexDirection="column">
            <Image src="/images/RDF Logo.png" w="13%" ml={3} />
            <Text fontSize="8px" ml={2}>
              Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
            </Text>
          </Flex>

          <Flex justifyContent="center" my={1}>
            <Text fontSize="xs" fontWeight="semibold">
              Fuel Details
            </Text>
          </Flex>

          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  ID:
                </Text>
                <Text fontSize="xs">{data?.id}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Requestor:
                </Text>
                <Text fontSize="xs">{data?.requestorName}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Asset:
                </Text>
                <Text fontSize="xs">{data?.asset}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Odometer:
                </Text>
                <Text fontSize="xs">
                  {data.odometer
                    ? data.odometer.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "N/A"}
                </Text>
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
                <Text fontSize="xs">{moment(data?.created_At).format("MM/DD/yyyy")}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Approved Date:
                </Text>
                <Text fontSize="xs">{moment(data.approve_At).format("MM/DD/yyyy")}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={-1}>
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
                      UNIT COST
                    </Th>
                    <Th color="white" fontSize="xs">
                      LITERS
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.getFuelDetails?.map((item) => (
                    <Tr key={item.id}>
                      <Td fontSize="xs">{data.source}</Td>
                      <Td fontSize="xs">{item?.item_Code}</Td>
                      <Td fontSize="xs">{item?.item_Description}</Td>
                      <Td fontSize="xs">{item?.uom}</Td>
                      <Td fontSize="xs">
                        {item?.unit_Cost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.liters.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                    </Tr>
                  ))}
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
                  {data?.requestorName}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transacted By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {data?.added_By}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button colorScheme="blue" onClick={handlePrint}>
              Print
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
