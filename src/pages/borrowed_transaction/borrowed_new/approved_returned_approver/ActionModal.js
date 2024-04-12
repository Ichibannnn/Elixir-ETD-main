import React, { useEffect, useRef, useState } from "react";
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
  useDisclosure,
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { GrView } from "react-icons/gr";

export const ViewModal = ({
  isOpen,
  onClose,
  statusBody,
  fetchBorrowed,
  setIsLoading,
}) => {
  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [coaId, setCoaId] = useState("");

  const { isOpen: isCoa, onOpen: openCoa, onClose: closeCoa } = useDisclosure();

  const idparams = statusBody?.id;
  const fetchBorrowedDetailsApi = async (idparams) => {
    const res = await request.get(
      `Borrowed/ViewBorrowedReturnDetails?id=${idparams}`
    );
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(idparams).then((res) => {
      setBorrowedDetailsData(res);
    });
  };

  const coaIdHandler = (data) => {
    if (data) {
      setCoaId(data);
      console.log(coaId);
      openCoa();
    } else {
      setCoaId("");
    }
  };

  useEffect(() => {
    fetchBorrowedDetails();
  }, [idparams]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Returned Details
            </Text>
          </Flex>
        </ModalHeader>

        <ModalBody mb={5}>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={1} mt={4}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.customerCode}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customer}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.details}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Borrowed Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.transactionDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Returned Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.returnedDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={1} mt={4}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.borrowedPKey}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee Id:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.empId
                    ? borrowedDetailsData[0]?.empId
                    : "-"}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee Name:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.fullName
                    ? borrowedDetailsData[0]?.fullName
                    : "-"}
                </Text>
              </HStack>
            </VStack>
          </Flex>

          <VStack justifyContent="center" mt={4}>
            <PageScroll minHeight="320px" maxHeight="321px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Id
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="xs">
                      Returned Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      View
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">{borrowdetails.uom}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.borrowedQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.consume.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.returnQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td>
                        {borrowdetails.consume === 0 ? (
                          <Button isDisabled size="xs" bg="none">
                            <GrView
                              fontSize="18px"
                              onClick={() => coaIdHandler(borrowdetails.id)}
                            />
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            bg="none"
                            onClick={() => coaIdHandler(borrowdetails.id)}
                          >
                            <GrView fontSize="18px" />
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Returned By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {borrowedDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
      {isCoa && <ViewCOA isOpen={isCoa} onClose={closeCoa} coaId={coaId} />}
    </Modal>
  );
};

export const PrintModal = ({
  isOpen,
  onClose,
  statusBody,
  fetchBorrowed,
  setIsLoading,
}) => {
  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const idparams = statusBody?.id;
  const fetchBorrowedDetailsApi = async (idparams) => {
    const res = await request.get(
      `Borrowed/ViewBorrowedReturnDetails?id=${idparams}`
    );
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(idparams).then((res) => {
      setBorrowedDetailsData(res);
    });
  };

  useEffect(() => {
    fetchBorrowedDetails();
  }, [idparams]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        {/* <ModalCloseButton color="white" onClick={onClose} /> */}
        <ModalBody mb={5} ref={componentRef}>
          {/* Display */}
          <Flex spacing={0} justifyContent="start" flexDirection="column">
            <Image src="/images/RDF Logo.png" w="13%" ml={3} />
            <Text fontSize="8px" ml={2}>
              Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
            </Text>
          </Flex>

          <Flex justifyContent="center" my={1}>
            <Text fontSize="xs" fontWeight="semibold">
              Approved Returned Details
            </Text>
          </Flex>

          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={1} mt={4}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.customerCode}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customer}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.details}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Borrowed Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.preparedDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Returned Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.preparedDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={1} mt={4}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.borrowedPKey}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.empId
                    ? borrowedDetailsData[0]?.empId
                    : "-"}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee Name:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.fullName
                    ? borrowedDetailsData[0]?.fullName
                    : "-"}
                </Text>
              </HStack>
            </VStack>
          </Flex>

          <VStack justifyContent="center" mt={4}>
            <PageScroll minHeight="320px" maxHeight="321px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Id
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="xs">
                      Returned Qty
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">{borrowdetails.uom}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.borrowedQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.consume.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.returnQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Returned By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {borrowedDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ViewCOA = ({ isOpen, onClose, coaId }) => {
  const [coaList, setCoaList] = useState([]);

  //RETURN REQUEST
  const id = coaId;
  const fetchCOAListApi = async (id) => {
    const res = await request.get(`Borrowed/ViewConsumeForReturn?`, {
      params: {
        id: id,
      },
    });
    return res.data;
  };

  const fetchCOAList = () => {
    fetchCOAListApi(id).then((res) => {
      setCoaList(res);
    });
  };

  useEffect(() => {
    if (id) {
      fetchCOAList();
    }
    return () => {
      setCoaList([]);
    };
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              List of Consumed Materials
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />
        <ModalBody mb={5} fontSize="xs">
          <Flex flexDirection="column" w="full" mt={4}>
            <PageScroll minHeight="430px" maxHeight="450px">
              <Table size="sm" variant="striped">
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th h="40px" color="white" fontSize="10px">
                      Item Information
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      Service Report #
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      Charging of Accounts
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {coaList?.map((item, i) => (
                    <Tr key={i}>
                      {/* Item Information */}
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="left">
                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Item:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.itemCode} - {item.itemDescription}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                UOM:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.uom}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Consumed Quantity:
                              </Text>
                              <Text color="blue.400" fontWeight="bold">
                                {item.consume.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>

                      {/* Service Report # */}
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="center">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="bold">
                                {item.reportNumber}
                              </Text>
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>

                      {/* Charging of Accounts */}
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="left">
                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Company:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.companyCode} - {item.companyName}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Department:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.departmentCode} - {item.departmentName}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Location:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.locationCode} - {item.locationName}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Account Title:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.accountCode} - {item.accountTitles}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Employee:
                              </Text>
                              {item.empId && item.fullName ? (
                                <Text color="gray.700" fontWeight="bold">
                                  {item.empId} -{item.fullName}
                                </Text>
                              ) : (
                                <Text>-</Text>
                              )}
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
