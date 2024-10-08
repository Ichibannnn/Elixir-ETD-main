import {
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Td,
  Button,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Badge,
  Select,
  Image,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useEffect } from "react";
import { BsFillPrinterFill } from "react-icons/bs";

import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import { useReactToPrint } from "react-to-print";

import React, { useState, useRef } from "react";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import moment from "moment";
import Barcode from "react-barcode";

// RECEIVED MATERIALS ----------------------------------------------
const ReceivedMaterials = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [printData, setPrintData] = useState({
    warehouseId: "",
    rrNumber: "",
    poNumber: "",
    dateReceive: "",
    itemCode: "",
    itemDescription: "",
    uom: "",
    unitPrice: "",
    supplier: "",
    actualGood: "",
    lotSection: "",
    siNumber: "",
  });

  // OPEN MODAL FOR PRINTER
  const { isOpen: isPrintOpen, onClose: closePrint, onOpen: openPrint } = useDisclosure();

  // FETCH API ROLES:
  const fetchReceivedMatsApi = async (pageNumber, pageSize, search) => {
    const response = await request.get(`Warehouse/GetAllReceivedMaterialsPaginationOrig?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      params: {
        search: search,
      },
    });

    return response.data;
  };

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  //SHOW MAIN MENU DATA----
  const getReceivedMatsHandler = () => {
    fetchReceivedMatsApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setWarehouseData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getReceivedMatsHandler();

    return () => {
      setWarehouseData([]);
    };
  }, [currentPage, pageSize, search]);

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    console.log(inputValue);
  };

  // PRINT
  const printHandler = ({ id, rrNumber, poNumber, itemCode, itemDescription, dateReceive, uom, unitPrice, supplier, actualGood, lotSection, siNumber }) => {
    if (id) {
      setPrintData({
        warehouseId: id,
        rrNumber: rrNumber,
        poNumber: poNumber,
        Date: moment().format("MM/DD/YYYY, h:mm:ss a"),
        dateReceive: dateReceive,
        itemCode: itemCode,
        itemDescription: itemDescription,
        uom: uom,
        unitPrice: unitPrice,
        supplier: supplier,
        actualGood: actualGood,
        lotSection: lotSection,
        siNumber: siNumber,
      });
      openPrint();
    } else {
      setPrintData({
        warehouseId: "",
        rrNumber: "",
        poNumber: "",
        Date: "",
        dateReceive: "",
        itemCode: "",
        itemDescription: "",
        uom: "",
        unitPrice: "",
        supplier: "",
        actualGood: "",
        lotSection: "",
        siNumber: "",
      });
    }
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <Flex color="fontColor" h="100vh" w="full" borderRadius="md" flexDirection="column" bg="gray.300">
      <Flex w="full" bg="form" h="100%" p={4} borderRadius="md" flexDirection="column">
        <Flex w="full" borderRadius="lg" h="5%" position="sticky" justifyContent="space-between" alignItems="center" p={3}>
          <HStack>
            <Text fontSize="2xl" color="black" fontWeight="semibold">
              Received Materials
            </Text>
          </HStack>

          <HStack w="15%" p={2} borderRadius="2xl">
            <InputGroup w="full">
              <InputLeftElement pointerEvents="none" children={<FiSearch color="blackAlpha" />} fontSize="sm" />
              <Input
                color="blackAlpha"
                type="text"
                fontSize="sm"
                placeholder="Search..."
                focusBorderColor="btnColor"
                bg="whiteAlpha"
                borderColor="gray.300"
                borderRadius="xl"
                onChange={(e) => searchHandler(e.target.value)}
              />
            </InputGroup>
          </HStack>
        </Flex>

        <Flex w="full" flexDirection="column" className="boxShadow" borderRadius="xl" h="full" p={4} mt={4} bg="form" gap={2}>
          <Text fontSize="lg" color="black" fontWeight="semibold">
            List of Received Materials
          </Text>

          <PageScroll maxHeight="700px">
            {isLoading ? (
              <Stack width="full">
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            ) : (
              <Table width="full" border="none" boxShadow="md" variant="striped">
                <Thead bg="primary" h="40px" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th color="white" fontSize="10px">
                      Warehouse ID
                    </Th>
                    <Th color="white" fontSize="10px">
                      RR Number
                    </Th>
                    <Th color="white" fontSize="10px">
                      PO Number
                    </Th>

                    <Th color="white" fontSize="10px">
                      SI Number
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px">
                      Actual Good
                    </Th>
                    <Th color="white" fontSize="10px">
                      Date Received
                    </Th>
                    <Th color="white" fontSize="10px">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="10px">
                      Total Cost
                    </Th>
                    <Th color="white" fontSize="10px">
                      Transaction Type
                    </Th>
                    <Th color="white" fontSize="10px">
                      Re-Print
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {warehouseData?.warehouse?.map((items) => (
                    <Tr key={items.id}>
                      <Td fontSize="xs">{items.id}</Td>
                      {items.rrNumber === null ? <Td fontSize="xs">-</Td> : <Td fontSize="xs">{items.rrNumber}</Td>}
                      {items.poNumber === 0 ? <Td fontSize="xs">-</Td> : <Td fontSize="xs">{items.poNumber}</Td>}
                      {items.siNumber ? <Td fontSize="xs">{items.siNumber}</Td> : <Td fontSize="xs">-</Td>}
                      <Td fontSize="xs">{items.itemCode}</Td>
                      <Td fontSize="xs">{items.itemDescription}</Td>
                      <Td fontSize="xs">
                        {items.actualGood.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{items.dateReceive}</Td>
                      <Td fontSize="xs">
                        {items.unitPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {items.totalUnitPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{items.transactionType === "MiscellaneousReceipt" ? "Miscellaneous Receipt" : "Receiving"}</Td>
                      <Td pl={0}>
                        <Flex>
                          <Box pl={4}>
                            <Button size="xs" bg="none" onClick={() => printHandler(items)}>
                              <BsFillPrinterFill fontSize="16px" />
                            </Button>
                          </Box>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </PageScroll>

          <Flex justifyContent="space-between">
            <HStack>
              <Badge colorScheme="cyan">
                <Text color="secondary">Number of Records: {warehouseData.warehouse?.length}</Text>
              </Badge>
            </HStack>

            <Stack mt={2}>
              <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
                <PaginationContainer>
                  <PaginationPrevious bg="primary" color="white" p={1} _hover={{ bg: "btnColor", color: "white" }}>
                    {"<<"}
                  </PaginationPrevious>
                  <PaginationPageGroup ml={1} mr={1}>
                    {pages.map((page) => (
                      <PaginationPage
                        _hover={{ bg: "btnColor", color: "white" }}
                        _focus={{ bg: "btnColor" }}
                        p={3}
                        bg="primary"
                        color="white"
                        key={`pagination_page_${page}`}
                        page={page}
                      />
                    ))}
                  </PaginationPageGroup>
                  <HStack>
                    <PaginationNext bg="primary" color="white" p={1}>
                      {">>"}
                    </PaginationNext>
                    <Select onChange={handlePageSizeChange} variant="outline" fontSize="md">
                      <option value={Number(5)}>5</option>
                      <option value={Number(10)}>10</option>
                      <option value={Number(25)}>25</option>
                      <option value={Number(50)}>50</option>
                    </Select>
                  </HStack>
                </PaginationContainer>
              </Pagination>
            </Stack>
          </Flex>

          <Flex justifyContent="end">
            {isPrintOpen && <PrintModal isOpen={openPrint} onClose={closePrint} printData={printData} getReceivedMatsHandler={getReceivedMatsHandler} />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ReceivedMaterials;

const PrintModal = ({ isOpen, onClose, printData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log("PrintData: ", printData);

  const displayData = {
    "RR Number": printData?.rrNumber === !null ? printData?.rrNumber : "-",
    "PO Number": printData?.poNumber,
    Date: moment().format("MM/DD/YYYY, h:mm:ss a"),
    "Receiving Date": moment(printData?.dateReceive).format("MM/DD/YYYY"),
    "Item Code": printData?.itemCode,
    "Item Description": printData?.itemDescription,
    UOM: printData?.uom,
    "Unit Cost": printData?.unitPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    Supplier: printData?.supplier,
    "Quantity Good": printData?.actualGood.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text fontSize="15px">Print Preview</Text>
          </Flex>
          <Flex justifyContent="center">
            <Text fontSize="9px">(Duplicated Copy)</Text>
          </Flex>
        </ModalHeader>

        <ModalBody>
          {/* Printed on Paper */}
          <Box display="none">
            <VStack spacing={0} justifyContent="center" ref={componentRef}>
              <VStack spacing={0} justifyContent="start">
                <Image src="/images/RDF Logo.png" w="20%" ml={3} />
                <Text fontSize="9px" ml={2} textAlign="center">
                  Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
                </Text>
              </VStack>
              <Flex mt={3} w="90%" justifyContent="center">
                <Text fontSize="15px" fontWeight="semibold">
                  Materials
                </Text>
              </Flex>

              {Object.keys(displayData)?.map((key, i) => (
                <Flex w="full" justifyContent="center" key={i}>
                  <Flex ml="10%" w="full">
                    <Flex>
                      <Text fontWeight="semibold" fontSize="8px">
                        {key}:
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex w="full">
                    <Flex>
                      <Text fontWeight="semibold" fontSize="8px">
                        {displayData[key]}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))}

              <VStack spacing={0} w="90%" ml={4} justifyContent="center">
                <Barcode fontSize="16" width={3} height={25} value={printData?.warehouseId} />
              </VStack>

              <Flex w="full"></Flex>
            </VStack>
          </Box>

          {/* Display on Preview */}
          <VStack spacing={0} justifyContent="center">
            <VStack spacing={0} justifyContent="start">
              <Image src="/images/RDF Logo.png" w="20%" ml={3} />
              <Text fontSize="9px" ml={2} textAlign="center">
                Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
              </Text>
            </VStack>
            <Flex mt={3} w="90%" justifyContent="center">
              <Text fontSize="15px" fontWeight="semibold">
                Materials
              </Text>
            </Flex>

            {Object.keys(displayData)?.map((key, i) => (
              <Flex w="full" justifyContent="center" key={i}>
                <Flex ml="10%" w="full">
                  <Flex>
                    <Text fontWeight="semibold" fontSize="13px">
                      {key}:
                    </Text>
                  </Flex>
                </Flex>
                <Flex w="full">
                  <Flex>
                    <Text fontWeight="normal" fontSize="13px">
                      {displayData[key]}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ))}

            <VStack spacing={0} w="90%" ml={4} justifyContent="center">
              <Barcode fontSize="16" width={3} height={25} value={printData?.warehouseId} />
            </VStack>

            <Flex w="full"></Flex>
          </VStack>
        </ModalBody>
        <ModalFooter mt={10}>
          <ButtonGroup size="xs">
            <Button colorScheme="blue" onClick={handlePrint}>
              Re-Print
            </Button>
            <Button color="black" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
