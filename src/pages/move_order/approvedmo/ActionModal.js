import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import "../../../styles/Tracking.css";

import moment from "moment";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";

import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";
import { RiCheckboxBlankLine } from "react-icons/ri";

const currentUser = decodeUser();

// PRINT MODAL --------------------------------------
export const PrintModal = ({ isOpen, onClose, printData, closeApprove, fetchApprovedMO, orderId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const printAndUpdate = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/UpdatePrintStatus`, [{ orderNo: orderId }])
        .then((res) => {
          setIsLoading(false);
          handlePrint();
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } catch (error) {}
  };

  const dateToday = new Date();

  const closeHandler = () => {
    fetchApprovedMO();
    onClose();
    if (closeApprove) {
      closeApprove();
    }
  };

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxes = (newSelected) => {
    console.log(newSelected);
    setSelectedCheckboxes(newSelected);
  };

  console.log("Print Data: ", printData);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center"></Flex>
        </ModalHeader>
        <ModalCloseButton onClick={closeHandler} />

        <ModalBody>
          {/* MO SLIP Display*/}
          <Flex w="full" mt={8} p={5} flexDirection="column">
            <Flex spacing={0} justifyContent="start" flexDirection="column">
              <Image src="/images/RDF Logo.png" w="13%" ml={3} />
              <Text fontSize="8px" ml={2}>
                Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
              </Text>
            </Flex>

            <Flex justifyContent="center" my={1}>
              <Text fontSize="md" fontWeight="semibold">
                Move Order Slip
              </Text>
            </Flex>

            <Flex justifyContent="center"></Flex>

            <Flex justifyContent="space-between" mb={3}>
              <Flex flexDirection="column">
                <Text fontSize="xs">MIR ID: {orderId && orderId}</Text>
                <Text fontSize="xs">Unit: {`WAREHOUSE`}</Text>
                <Text fontSize="xs">Customer: {printData[0]?.customerName}</Text>
                <Text fontSize="xs">
                  Charging Department: {printData[0]?.departmentCode} - {printData[0]?.departmentName}
                </Text>
                <Text fontSize="xs">
                  Charging Location: {printData[0]?.locationCode} - {printData[0]?.locationName}
                </Text>
              </Flex>

              <Flex flexDirection="column">
                <Barcode width={3} height={40} value={Number(orderId)} />
                <Text fontSize="xs">Date: {moment(printData[0]?.approvedDate).format("MM/DD/yyyy")}</Text>
              </Flex>
            </Flex>

            <PageScroll minHeight="150px" maxHeight="300px">
              <Table size="xs">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      LINE
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
                      SERVED QTY
                    </Th>
                    <Th color="white" fontSize="xs">
                      UNIT COST
                    </Th>

                    <Th color="white" fontSize="xs">
                      TOTAL COST
                    </Th>
                    <Th color="white" fontSize="xs">
                      ITEM REMARKS
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{i + 1}</Td>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">
                        {item.servedQuantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>

                      <Td fontSize="xs">
                        {item.unitCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>

                      <Td fontSize="xs">
                        {item.totalCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>

                      {item.itemRemarks ? <Td fontSize="xs">{item.itemRemarks}</Td> : <Td fontSize="xs">-</Td>}
                    </Tr>
                  ))}

                  {/* FOR ALL TOTAL */}
                  <Tr>
                    <Td fontSize="xs"></Td>
                    <Td fontSize="xs"></Td>
                    <Td fontSize="xs"></Td>

                    <Td fontSize="xs" fontWeight="bold">
                      Total:
                    </Td>
                    <Td fontSize="xs" fontWeight="bold">
                      {printData[0]?.tQuantity.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs" fontWeight="bold">
                      {printData[0]?.tUnitCost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs" fontWeight="bold">
                      {printData[0]?.tTotalCost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs"></Td>
                  </Tr>
                </Tbody>
              </Table>
            </PageScroll>

            <Flex justifyContent="space-between" mb={5} mt={4}>
              <HStack>
                <Text fontSize="xs">Delivery Status:</Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {`Pick-Up`}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
              <VStack spacing={0}>
                <HStack>
                  <Text fontSize="xs">Checked By:</Text>
                  <Text textDecoration="underline" fontSize="xs">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </HStack>
              </VStack>
            </Flex>

            <Flex justifyContent="space-between" mb={5}>
              <VStack spacing={0}>
                <HStack>
                  <Text fontSize="xs">Prepared By:</Text>
                  <Text textDecoration="underline" fontSize="xs">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </HStack>
              </VStack>
              <VStack spacing={0}>
                <HStack>
                  <Text fontSize="xs">Received By:</Text>
                  <Text textDecoration="underline" fontSize="xs">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </HStack>
              </VStack>
            </Flex>

            <Flex justifyContent="space-between">
              <VStack spacing={0}></VStack>
              <VStack spacing={0}>
                <HStack>
                  <Text fontSize="xs">Date Received:</Text>
                  <Text textDecoration="underline" fontSize="xs">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Text>
                </HStack>
              </VStack>
            </Flex>

            <Flex mt={10} justifyContent="space-between" alignItems="center">
              <VStack>
                <CheckboxGroup colorScheme="blue" onChange={handleCheckboxes}>
                  <HStack spacing={3}>
                    <Checkbox isDisabled value="Option 1" size="sm"></Checkbox>
                    <Text fontSize="sm">Exceeds Expectation</Text>
                    <Checkbox isDisabled value="Option 2" size="sm"></Checkbox>
                    <Text fontSize="sm">Meets Expectation</Text>
                    <Checkbox isDisabled value="Option 3" size="sm"></Checkbox>
                    <Text fontSize="sm">Needs Improvement</Text>
                  </HStack>
                </CheckboxGroup>
              </VStack>

              <Text fontWeight="semibold" fontSize="xs">
                ETD-FRM-23-001
              </Text>
            </Flex>
          </Flex>

          {/* Printed  */}
          <Box display="none">
            <PageScroll minHeight="150px" maxHeight="300px">
              <VStack spacing={20} w="93%" ml={3} ref={componentRef}>
                {/* Survey Form v2 -------------------------------------------------------------------------------------- */}
                {/* <Flex
                  w="full"
                  mb="480px"
                  p={5}
                  flexDirection="column"
                  border="1px"
                >
                  <HStack w="full">
                    <Image src="/images/RDF Logo.png" w="18%" ml={3} />

                    <VStack mt={5} spacing={0} w="full">
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        textAlign="center"
                        w="full"
                        // borderLeft="1px"
                        // borderBottom="1px"
                      >
                        CUSTOMER SURVEY
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack justifyContent="right">
                    <Text fontWeight="semibold" fontSize="xs">
                      Date:
                    </Text>
                    <Text textDecoration="underline" fontSize="xs">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Text>
                  </HStack>

                  <HStack spacing={5} mt={6}>
                    <Text fontWeight="semibold" fontSize="xs">
                      Evaluated Unit:
                    </Text>
                    <Text textDecoration="underline" fontSize="xs">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {`ETD - Warehouse`}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Text>
                  </HStack>

                  <Table variant="unstyled" size="sm">
                    <Thead border="1px">
                      <Tr>
                        <Th w="15%" textAlign="center" borderRight="1px">
                          SERVICE LEVEL
                        </Th>
                        <Th textAlign="center" borderRight="1px">
                          PARAMETERS
                        </Th>
                        <Th textAlign="center" borderRight="1px">
                          Yes
                        </Th>
                        <Th textAlign="center">No</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr border="1px">
                        <Td
                          fontSize="xs"
                          textAlign="center"
                          borderRight="1px"
                          rowSpan={2}
                        >
                          QUALITY
                        </Td>
                        <Td fontSize="xs" textAlign="left" borderRight="1px">
                          {`Is your order served completely?`}
                          <br />
                          {`(Kumpleto po ba nag nagbigay sa order nyo?)`}
                        </Td>
                        <Td
                          fontSize="sm"
                          textAlign="center"
                          border="1px solid black"
                        ></Td>
                        <Td
                          fontSize="sm"
                          textAlign="center"
                          border="1px solid black"
                        ></Td>
                      </Tr>
                      <Tr border="1px">
                        <Td fontSize="xs" textAlign="left" borderRight="1px">
                          {`Are the items given matched your order?`}
                          <br />
                          {`(Naaayon po ba ang mga gamit na naibigay base sa order nyo?)`}
                        </Td>
                        <Td
                          fontSize="sm"
                          textAlign="center"
                          border="1px solid black"
                        ></Td>
                        <Td
                          fontSize="sm"
                          textAlign="center"
                          border="1px solid black"
                        ></Td>
                      </Tr>
                      <Tr>
                        <Td border="1px solid black"></Td>
                        <Td border="1px solid black"></Td>
                        <Td border="1px solid black"></Td>
                        <Td border="1px solid black"></Td>
                      </Tr>
                      <Tr border="1px">
                        <Td fontSize="xs" textAlign="center" borderRight="1px">
                          CUSTOMER SERVICE
                        </Td>
                        <Td fontSize="xs" textAlign="left" borderRight="1px">
                          {`Are you treated well?`}
                          <br />
                          {"(Maayos po ba ang nagin pakikitungo sa inyo?)"}
                        </Td>
                        <Td
                          fontSize="sm"
                          textAlign="center"
                          borderRight="1px"
                        ></Td>
                        <Td></Td>
                      </Tr>
                    </Tbody>
                  </Table>

                  <Flex w="full" p={2} flexDirection="column">
                    <Text fontWeight="normal" fontSize="xs">
                      Rating: 3. Yes (Exceeds Expectation) 2.Yes (Meets
                      Expection) 1. Yes (Needs Improvement)
                    </Text>
                    <Text fontWeight="normal" fontSize="xs">
                      We value your feedback and suggestion. Please feel free to
                      comment below
                    </Text>
                  </Flex>
                  <Flex w="full" p={2} flexDirection="column" borderTop="3px">
                    <Text fontWeight="semibold" fontSize="xs">
                      _______________________________________________________________________
                    </Text>
                  </Flex>

                  <Flex
                    w="full"
                    flexDirection="column"
                    justifyContent="start"
                    mt={2}
                  >
                    <Text fontWeight="semibold" fontSize="xs">
                      Evaluated By:
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      __________________________________________
                    </Text>
                    <Text fontWeight="normal" fontSize="xs">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      (Name / Department)
                    </Text>
                  </Flex>
                  <Flex w="full" justifyContent="right">
                    <Text fontWeight="normal" fontSize="10px">
                      ETD-ESW-FRM-23-003 [APR. 1, 2023]
                    </Text>
                  </Flex>
                </Flex> */}

                {/* Survey Form v1 -------------------------------------------------------------------------------------- */}
                {/* <Flex
                  w="full"
                  mb="480px"
                  p={5}
                  flexDirection="column"
                  border="1px"
                >
                  <HStack w="full" border="1px">
                    <Image src="/images/RDF Logo.png" w="18%" ml={3} />

                    <VStack mt={5} spacing={0} w="full">
                      <Text
                        fontWeight="semibold"
                        fontSize="md"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        Form
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        textAlign="center"
                        w="full"
                        borderLeft="1px"
                        borderBottom="1px"
                      >
                        Customer Survey
                      </Text>
                      <Flex w="full" justifyContent="space-between">
                        <VStack w="full" spacing={0}>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            Control No.
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            Owner
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                          >
                            Effectivity
                          </Text>
                        </VStack>
                        <VStack w="full" spacing={0}>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            ETD-FRM-23-001
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            PC
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                          >
                            &nbsp;
                          </Text>
                        </VStack>
                        <VStack w="full" spacing={0}>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            Supersedes
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            Revision No.
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                          >
                            Page
                          </Text>
                        </VStack>
                        <VStack w="full" spacing={0}>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            None
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                            borderBottom="1px"
                          >
                            0
                          </Text>
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            textAlign="center"
                            w="full"
                            borderLeft="1px"
                          >
                            1
                          </Text>
                        </VStack>
                      </Flex>
                    </VStack>
                  </HStack>

                  <HStack spacing={20}>
                    <Text fontWeight="semibold" fontSize="xs">
                      Evaluated Unit: _____________________ Warehouse
                    </Text>
                    <Text fontWeight="semibold" fontSize="xs">
                      Date: _______________________________
                    </Text>
                    <Text fontSize="xs" fontWeight="semibold">
                      Order ID: {orderId && orderId}
                    </Text>
                  </HStack>

                  <Table variant="unstyled" size="sm">
                    <Thead border="1px">
                      <Tr>
                        <Th textAlign="center" borderRight="1px">
                          Service Level
                        </Th>
                        <Th></Th>
                        <Th
                          textAlign="center"
                          borderX="1px"
                        >{`Score (Bilugan ang Score)`}</Th>
                        <Th textAlign="center">Remarks/comments/suggestion</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr border="1px">
                        <Td fontSize="xs" textAlign="center" borderRight="1px">
                          Quantity Issue
                        </Td>
                        <Td
                          fontSize="xs"
                          textAlign="center"
                          borderRight="1px"
                        >{`(nauubusan ba ng stock ang customer?)`}</Td>
                        <Td fontSize="sm" textAlign="center" borderRight="1px">
                          1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                        </Td>
                        <Td></Td>
                      </Tr>
                      <Tr border="1px">
                        <Td fontSize="xs" textAlign="center" borderRight="1px">
                          Quality Issue
                        </Td>
                        <Td
                          fontSize="xs"
                          textAlign="center"
                          borderRight="1px"
                        >{`(kalidad ng trabaho/gawa)`}</Td>
                        <Td fontSize="sm" textAlign="center" borderRight="1px">
                          1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                        </Td>
                        <Td></Td>
                      </Tr>
                      <Tr border="1px">
                        <Td fontSize="xs" textAlign="center" borderRight="1px">
                          Customer Service
                        </Td>
                        <Td
                          fontSize="xs"
                          textAlign="center"
                          borderRight="1px"
                        >{`(pakikitungo sa customer)`}</Td>
                        <Td fontSize="sm" textAlign="center" borderRight="1px">
                          1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                        </Td>
                        <Td></Td>
                      </Tr>
                      <Tr border="1px">
                        <Td fontSize="xs" textAlign="center" borderRight="1px">
                          Other Issue <br />
                          {`(ano pa ang problema na hindi nabanggit sa itaas?)`}
                        </Td>
                        <Td
                          fontSize="xs"
                          textAlign="center"
                          borderRight="1px"
                        >{`(nauubusan ba ng stock ang customer?)`}</Td>
                        <Td fontSize="sm" textAlign="center" borderRight="1px">
                          1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
                        </Td>
                        <Td></Td>
                      </Tr>
                    </Tbody>
                  </Table>

                  <Flex w="full" justifyContent="end" mt={2}>
                    <Text fontWeight="semibold" fontSize="xs">
                      Evaluated By: __________________________________________
                    </Text>
                  </Flex>
                </Flex> */}

                {/* MO SLIP Ready to print*/}
                <Flex w="full" mt={2} p={5} flexDirection="column">
                  <Flex spacing={0} justifyContent="start" flexDirection="column">
                    <Image src="/images/RDF Logo.png" w="13%" ml={3} />
                    <Text fontSize="8px" ml={2}>
                      Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
                    </Text>
                  </Flex>

                  <Flex justifyContent="center" my={1}>
                    <Text fontSize="md" fontWeight="semibold">
                      Move Order Slip
                    </Text>
                  </Flex>

                  <Flex justifyContent="center"></Flex>

                  <Flex justifyContent="space-between" mb={3}>
                    <Flex flexDirection="column">
                      <Text fontSize="xs">MIR ID: {orderId && orderId}</Text>
                      <Text fontSize="xs">Unit: {`WAREHOUSE`}</Text>
                      <Text fontSize="xs">Customer: {printData[0]?.customerName}</Text>
                      <Text fontSize="xs">
                        Charging Department: {printData[0]?.departmentCode} - {printData[0]?.departmentName}
                      </Text>
                      <Text fontSize="xs">
                        Charging Location: {printData[0]?.locationCode} - {printData[0]?.locationName}
                      </Text>
                    </Flex>

                    <Flex flexDirection="column">
                      <Barcode width={3} height={40} value={Number(orderId)} />
                      <Text fontSize="xs">Date: {moment(printData[0]?.approvedDate).format("MM/DD/yyyy")}</Text>
                    </Flex>
                  </Flex>

                  <Table size="xs">
                    <Thead bgColor="secondary">
                      <Tr>
                        <Th color="white" fontSize="xx-small">
                          LINE
                        </Th>
                        <Th color="white" fontSize="xx-small">
                          ITEM CODE
                        </Th>
                        <Th color="white" fontSize="xx-small">
                          ITEM DESCRIPTION
                        </Th>
                        <Th color="white" fontSize="xx-small">
                          UOM
                        </Th>

                        <Th color="white" fontSize="xx-small">
                          SERVED QTY
                        </Th>
                        <Th color="white" fontSize="xx-small">
                          UNIT COST
                        </Th>
                        <Th color="white" fontSize="xx-small">
                          TOTAL COST
                        </Th>
                        <Th color="white" fontSize="xx-small">
                          ITEM REMARKS
                        </Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {printData?.map((item, i) => (
                        <Tr borderX="1px" borderBottom="1px" key={i}>
                          <Td fontSize="xs">{i + 1}</Td>
                          <Td fontSize="xs">{item.itemCode}</Td>
                          <Td fontSize="xs">{item.itemDescription}</Td>
                          <Td fontSize="xs">{item.uom}</Td>
                          <Td fontSize="xs">
                            {item.servedQuantity.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>

                          <Td fontSize="xs">
                            {item.unitCost.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>

                          <Td fontSize="xs">
                            {item.totalCost.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </Td>

                          {item.itemRemarks ? <Td fontSize="xs">{item.itemRemarks}</Td> : <Td fontSize="xs">-</Td>}
                        </Tr>
                      ))}

                      {/* FOR ALL TOTAL */}
                      <Tr>
                        <Td fontSize="xs"></Td>
                        <Td fontSize="xs"></Td>
                        <Td fontSize="xs"></Td>

                        <Td fontSize="xs" fontWeight="bold">
                          Total:
                        </Td>

                        <Td fontSize="xs" fontWeight="bold">
                          {printData[0]?.tQuantity.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>

                        <Td fontSize="xs" fontWeight="bold">
                          {printData[0]?.tUnitCost.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>

                        <Td fontSize="xs" fontWeight="bold">
                          {printData[0]?.tTotalCost.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs"></Td>
                      </Tr>
                    </Tbody>
                  </Table>

                  <Flex justifyContent="space-between" mb={5} mt={4}>
                    <HStack>
                      <Text fontSize="xs">Delivery Status:</Text>
                      <Text textDecoration="underline" fontSize="xs">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {`Pick-Up`}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Text>
                    </HStack>
                    <VStack spacing={0}>
                      <HStack>
                        <Text fontSize="xs">Checked By:</Text>
                        <Text textDecoration="underline" fontSize="xs">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </HStack>
                    </VStack>
                  </Flex>

                  <Flex justifyContent="space-between" mb={5}>
                    <VStack spacing={0}>
                      <HStack>
                        <Text fontSize="xs">Prepared By:</Text>
                        <Text textDecoration="underline" fontSize="xs">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </HStack>
                    </VStack>
                    <VStack spacing={0}>
                      <HStack>
                        <Text fontSize="xs">Received By:</Text>
                        <Text textDecoration="underline" fontSize="xs">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </HStack>
                    </VStack>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <VStack spacing={0}></VStack>
                    <VStack spacing={0}>
                      <HStack>
                        <Text fontSize="xs">Date Received:</Text>
                        <Text textDecoration="underline" fontSize="xs">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Text>
                      </HStack>
                    </VStack>
                  </Flex>

                  <Flex mt={10} justifyContent="space-between" alignItems="center">
                    <VStack>
                      <CheckboxGroup colorScheme="blue">
                        <HStack spacing={3}>
                          <HStack>
                            <RiCheckboxBlankLine />
                            <Text fontSize="xs">Exceeds Expectation</Text>
                          </HStack>

                          <HStack>
                            <RiCheckboxBlankLine />
                            <Text fontSize="xs">Meets Expectation</Text>
                          </HStack>

                          <HStack>
                            <RiCheckboxBlankLine />
                            <Text fontSize="xs">Needs Improvement</Text>
                          </HStack>
                        </HStack>
                      </CheckboxGroup>
                    </VStack>

                    <Text fontWeight="semibold" fontSize="xs">
                      ETD-FRM-23-001
                    </Text>
                  </Flex>
                </Flex>
              </VStack>
            </PageScroll>
          </Box>
        </ModalBody>

        <ModalFooter mt={2}>
          <ButtonGroup size="sm">
            <Button isLoading={isLoading} disabled={isLoading} colorScheme="blue" color="white" onClick={printAndUpdate}>
              Print
            </Button>
            <Button isLoading={isLoading} disabled={isLoading} color="black" variant="outline" onClick={closeHandler}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
        <style>
          {`
          @media print {
            @page {
              size: portrait; /* Set the print preview to portrait mode */
            }
          }
        `}
          {/* {`
          @media print {
            @page {
              size: 8.5in 6.5in;
            }
        `} */}
        </style>
      </ModalContent>
    </Modal>
  );
};

// TRACKING OF ORDERS -------------------------------
export const TrackModal = ({ isOpen, onClose, trackData, trackList }) => {
  const TableHead = ["Line", "Item Code", "Item Description", "Ordered Qty", "Item Remarks", "Asset Tag", "Remarks"];

  console.log(trackList);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Track Move Order
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />

        <ModalBody>
          <Flex>
            <div className="tracker">
              <div className="circle">
                <div className={trackData[0]?.isPrepared ? "darkShape" : "lightShape"}>&nbsp;</div>
                <div className="desc">Prepared</div>
              </div>

              <div className={trackData[0]?.isApproved ? "darkLine" : "lightLine"}></div>

              <div className="circle">
                <div className={trackData[0]?.isApproved ? "darkShape" : "lightShape"}>&nbsp;</div>
                <div className="desc">Approved</div>
              </div>

              <div className={trackData[0]?.isApproved ? "darkLine" : "lightLine"}></div>

              <div className="circle">
                <div className={trackData[0]?.isApproved ? "darkShape" : "lightShape"}>&nbsp;</div>
                <div className="desc">Printing Move Order</div>
              </div>

              <div className={trackData[0]?.isTransact ? "darkLine" : "lightLine"}></div>

              <div className="circle">
                <div className={trackData[0]?.isTransact ? "darkShape" : "lightShape"}>&nbsp;</div>
                <div className="desc">Transact Move Order</div>
              </div>
            </div>
          </Flex>

          <Flex mt={8}>
            <PageScroll minHeight="150px" maxHeight="300px">
              <Table size="sm">
                <Thead bgColor="primary">
                  <Tr>
                    {TableHead?.map((head, i) => (
                      <Th color="white" key={i} fontSize="10px">
                        {head}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {trackList?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="11px">{i + 1}</Td>
                      <Td fontSize="11px">{item.itemCode}</Td>
                      <Td fontSize="11px">{item.itemDescription}</Td>
                      <Td fontSize="11px">
                        {item.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>

                      {item.itemRemarks ? <Td fontSize="11px">{item.itemRemarks}</Td> : <Td fontSize="11px">-</Td>}
                      {item.assetTag ? <Td fontSize="11px">{item.assetTag}</Td> : <Td fontSize="11px">-</Td>}

                      {item.rush ? <Td fontSize="11px">{item.rush}</Td> : <Td fontSize="11px">-</Td>}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size="sm" mt={7}>
            <Button color="black" variant="outline" onClick={onClose} borderRadius="none" fontSize="11px">
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

//REJECT APPROVED MO --------------------------------
export const RejectModal = ({ isOpen, onClose, id, fetchApprovedMO }) => {
  const [reasonSubmit, setReasonSubmit] = useState("");

  const [reasons, setReasons] = useState([]);

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const fetchReasonsApi = async () => {
    const res = await request.get(`Reason/GetAllActiveReasons`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/RejectApproveListOfMoveOrder`, {
          orderNo: id,
          remarks: reasonSubmit,
          rejectBy: currentUser?.userName,
        })
        .then((res) => {
          ToastComponent("Success", "Move order has been rejected", "success", toast);
          fetchApprovedMO();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Move order was not rejected", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary" color="white">
          <Flex justifyContent="center">
            <Text fontSize="14px">Reject Move Order</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack justifyContent="center">
            <Text fontSize="sm" mt={2}>
              Are you sure you want to reject this move order?
            </Text>
            {reasons?.length > 0 ? (
              <Select fontSize="xs" onChange={(e) => setReasonSubmit(e.target.value)} w="70%" placeholder="Please select a reason">
                {reasons?.map((reason, i) => (
                  <option key={i} value={reason.reasonName}>
                    {reason.reasonName}
                  </option>
                ))}
              </Select>
            ) : (
              "loading"
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup size="sm" mt={7}>
            <Button onClick={submitHandler} isDisabled={!reasonSubmit || isLoading} isLoading={isLoading} colorScheme="blue">
              Yes
            </Button>
            <Button disabled={isLoading} isLoading={isLoading} color="black" variant="outline" onClick={onClose}>
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
