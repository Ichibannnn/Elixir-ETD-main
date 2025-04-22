import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Pagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import PageScroll from "../../../utils/PageScroll";
import { BiExport, BiRightArrow } from "react-icons/bi";
import { FaPrint, FaSearch } from "react-icons/fa";
import { AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import { MaterialInformationModal } from "./MaterialInformationModal";
import { TiWarning } from "react-icons/ti";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const MrpTable = ({
  mrpData,
  printMRPData,
  fetchingData,
  loadingExport,
  setSelectorId,
  selectorId,
  rawMatsInfo,
  setRawMatsInfo,
  pagesCount,
  pages,
  currentPage,
  setCurrentPage,
  setPageSize,
  searchValue,
  setSearchValue,
  sheetData,
}) => {
  const [buttonChanger, setButtonChanger] = useState(false);

  const { isOpen: isInformation, onOpen: openInformation, onClose: closeInformation } = useDisclosure();

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Define the columns with an empty header before "ID"
    worksheet.columns = [
      { header: "⚠️", key: "empty", width: 3 }, // Empty header
      { header: "ID", key: "ID", width: 10 },
      { header: "Item Code", key: "Item Code", width: 20 },
      { header: "Item Description", key: "Item Description", width: 30 },
      { header: "UOM", key: "UOM", width: 15 },
      { header: "Item Category", key: "Item Category", width: 20 },
      { header: "Unit Cost", key: "Unit Cost", width: 15 },
      { header: "Total Inventory Cost", key: "Total Inventory Cost", width: 25 },
      { header: "SOH", key: "SOH", width: 15 },
      { header: "Prepared Quantity", key: "Prepared Quantity", width: 20 },
      { header: "Reserve", key: "Reserve", width: 15 },
      { header: "Buffer Level", key: "Buffer Level", width: 20 },
      { header: "Receive", key: "Receive", width: 20 },
      { header: "Miscellaneous Receipt", key: "Miscellaneous Receipt", width: 20 },
      { header: "Move Order", key: "Move Order", width: 20 },
      { header: "Miscellaneous Issue", key: "Miscellaneous Issue", width: 20 },
      { header: "Borrowed", key: "Borrowed", width: 20 },
      { header: "Returned", key: "Returned", width: 20 },
      { header: "Consumed", key: "Consumed", width: 20 },
      { header: "Suggested PO", key: "Suggested PO", width: 20 },
      { header: "Reserve Usage", key: "Reserve Usage", width: 20 },
    ];

    console.log("Sheet Data: ", sheetData);

    // Style the header row (including the empty header with the warning icon)
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      console.log("Column Number: ", colNumber);

      if (colNumber === 1) {
        cell.value = "⚠️"; // Add warning icon to the first (empty) header
        cell.font = { color: { argb: "FFFF0000", bold: true } }; // Red color for the warning icon
      }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "90CDF4" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Add the rows with the warning icon if the condition is met
    sheetData.forEach((item) => {
      const row = worksheet.addRow({
        empty: item["Buffer Level"] >= item.Reserve ? "⚠️" : "",
        ID: item.ID,
        "Item Code": item["Item Code"],
        "Item Description": item["Item Description"],
        UOM: item.UOM,
        "Item Category": item["Item Category"],
        "Unit Cost": item["Unit Cost"],
        "Total Inventory Cost": item["Total Inventory Cost"],
        SOH: item.SOH,
        "Prepared Quantity": item["Prepared Quantity"],
        Reserve: item.Reserve,
        "Buffer Level": item["Buffer Level"],
        Receive: item.Receive,
        "Miscellaneous Receipt": item["Miscellaneous Receipt"],
        "Move Order": item["Move Order"],
        "Miscellaneous Issue": item["Miscellaneous Issue"],
        Borrowed: item.Borrowed,
        Returned: item.Returned,
        Consumed: item.Consumed,
        "Suggested PO": item["Suggested PO"],
        "Reserve Usage": item["Reserve Usage"],
      });

      // Check if the condition is met and apply the style
      if (item.Reserve <= item["Buffer Level"]) {
        row.eachCell((cell) => {
          if (cell.value === "⚠️") {
            // Apply red color to warning icon cell
            cell.font = {
              color: { argb: "FFFF0000" }, // Red color for text
            };
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CBD5E0" }, // Light red color for critical levels
          };
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Elixir_MRP_ExportFile.xlsx");
  };

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1);
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (searchValue) {
      setCurrentPage(1);
    }
  }, [searchValue]);

  const selectorHandler = (id, { itemCode, itemDescription, soh, bufferLevel, averageIssuance, daysLevel }) => {
    if (id) {
      setSelectorId(id);
      setRawMatsInfo({
        itemCode: itemCode,
        itemDescription: itemDescription,
        soh: soh,
        bufferLevel: bufferLevel,
        averageIssuance: averageIssuance,
        daysLevel: daysLevel,
      });
      openInformation();
    } else {
      setSelectorId("");
      setRawMatsInfo({
        itemCode: "",
        itemDescription: "",
        soh: "",
        bufferLevel: "",
        averageIssuance: "",
        daysLevel: "",
      });
    }
  };

  const { isOpen: isPrint, onOpen: openPrint, onClose: closePrint } = useDisclosure();
  const printMRPHandler = () => {
    openPrint();
  };

  return (
    <Flex w="full" justifyContent="center" flexDirection="column">
      <Flex justifyContent="space-between" mb={1}>
        <InputGroup w="30%">
          <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} fontSize="xs" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            fontSize="xs"
            placeholder="Search"
            focusBorderColor="btnColor"
            borderColor="gray.300"
          />
          <Button
            onClick={printMRPHandler}
            ml={3}
            bgColor="primary"
            _hover={{ bgColor: "btnColor" }}
            leftIcon={<AiOutlinePrinter color="white" fontSize="20px" />}
            fontSize="xs"
            color="white"
            w="40%"
            border="none"
          >
            Print
          </Button>
          <Button
            onClick={handleExport}
            isLoading={loadingExport}
            leftIcon={<BiExport fontSize="20px" />}
            disabled={!sheetData}
            ml={2}
            px={5}
            colorScheme="facebook"
            fontSize="xs"
            w="40%"
          >
            Export
          </Button>
        </InputGroup>

        <Button onClick={() => setButtonChanger(!buttonChanger)} ml={2} px={5} colorScheme="blue" fontSize="xs">
          {buttonChanger ? "<< Previous" : "Next >>"}
        </Button>
      </Flex>

      <Text textAlign="center" bgColor="primary" color="white" fontSize="14px">
        Material Requisition Planning
      </Text>
      <PageScroll minHeight="680px" maxHeight="700px">
        {fetchingData ? (
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
          <Table size="sm">
            <Thead bgColor="primary" position="sticky" top={0}>
              <Tr>
                <Th p={0} color="white" fontSize="xs"></Th>
                <Th p={0} fontSize="xs">
                  <Flex justifyContent="center">
                    <TiWarning fontSize="18px" color="red" />
                  </Flex>
                </Th>
                <Th color="white" fontSize="xs">
                  Line
                </Th>
                <Th color="white" fontSize="xs">
                  Item Code
                </Th>
                <Th color="white" fontSize="xs">
                  Item Description
                </Th>
                {!buttonChanger ? (
                  <>
                    <Th color="white">Item Category</Th>
                    <Th color="white">UOM</Th>
                    <Th color="white">Unit Cost</Th>
                    <Th color="white">Total Inventory Cost</Th>
                    <Th color="white">SOH</Th>
                    <Th color="white">Reserve</Th>
                    <Th color="white">Prepared</Th>
                    <Th color="white">Buffer Level</Th>
                  </>
                ) : (
                  <>
                    <Th color="white">{`Receive`}</Th>
                    <Th color="white">{`Miscellaneous Receipt`}</Th>
                    <Th color="white">{`Move Order`}</Th>
                    <Th color="white">{`Miscellaneous Issue`}</Th>
                    <Th color="white">{`Borrowed`}</Th>
                    <Th color="white">{`Returned`}</Th>
                    <Th color="white">{`Consumed`}</Th>
                    {/* <Th color="white">Average Issuance</Th>
                    <Th color="white">Days Level</Th> */}
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {mrpData?.inventory?.map((item, i) => (
                <Tr
                  key={i}
                  onClick={() => selectorHandler(i + 1, item)}
                  bgColor={selectorId === i + 1 ? "blue.200" : "none" && item.bufferLevel >= item.reserve ? "gray.300" : "none"}
                  cursor="pointer"
                >
                  {selectorId === i + 1 ? (
                    <Td p={0}>
                      <BiRightArrow />
                    </Td>
                  ) : (
                    <Td p={0}></Td>
                  )}
                  <Td fontSize="xs">{item.bufferLevel >= item.reserve ? <TiWarning fontSize="18px" color="red" /> : ""}</Td>
                  <Td fontSize="xs">{i + 1}</Td>
                  <Td fontSize="xs">{item.itemCode}</Td>
                  <Td fontSize="xs">{item.itemDescription}</Td>
                  {!buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.itemCategory}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">
                        {item.unitCost?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.totalCost?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.soh?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.reserve?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.preparedQuantity?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.bufferLevel?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td fontSize="xs">
                        {item.receiveIn?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.receiptIn?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.moveOrderOut?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.issueOut?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.borrowedOut?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.returnedBorrowed?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.borrowConsume?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      {/* <Td fontSize="xs">
                        {item.averageIssuance?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{item.daysLevel?.toLocaleString()}</Td> */}
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </PageScroll>

      <Flex mt={5} justifyContent="space-between" w="full">
        <Text fontSize="xs" fontWeight="semibold">
          Total Records/page: {mrpData?.inventory?.length}
        </Text>
        <Stack>
          <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
            <PaginationContainer>
              <PaginationPrevious bg="primary" color="white" p={1} _hover={{ bg: "btnColor", color: "white" }}>
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "btnColor", color: "white" }}
                    _focus={{ bg: "btnColor", color: "white" }}
                    p={3}
                    bg="primary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext bg="primary" color="white" p={1} _hover={{ bg: "btnColor", color: "white" }}>
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="filled" fontSize="md">
                  <option value={Number(50)}>50</option>
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(10000)}>ALL</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {isPrint && <PrintModal isOpen={isPrint} onClose={closePrint} printMRPData={printMRPData} />}

      {isInformation && <MaterialInformationModal isOpen={isInformation} onClose={closeInformation} rawMatsInfo={rawMatsInfo} />}
    </Flex>
  );
};

const PrintModal = ({ isOpen, onClose, printMRPData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center" gap={1}>
              <Icon as={FaPrint} boxSize={6} />
              <Text fontSize="lg" color="black" fontWeight="semibold">
                Print MRP Data
              </Text>
            </Flex>
          </ModalHeader>

          <ModalBody mt={5}>
            <PageScroll minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="simple" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th p={0} color="white"></Th>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">Item Category</Th>
                    <Th color="white">UOM</Th>
                    <Th color="white">SOH</Th>
                    <Th color="white">Reserve</Th>
                    <Th color="white">Buffer Level</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printMRPData?.map((item, i) => (
                    <Tr key={i} bg={item.bufferLevel >= item.reserve ? "gray.300" : ""}>
                      <Td>{item.bufferLevel >= item.reserve ? <TiWarning fontSize="20px" color="red" /> : ""}</Td>
                      <Td>{item.itemCode}</Td>
                      <Td>{item.itemDescription}</Td>
                      <Td>{item.itemCategory}</Td>
                      <Td>{item.uom}</Td>
                      <Td>
                        {item.soh?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item.reserve?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item.bufferLevel?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </ModalBody>

          <ModalFooter mt={7}>
            <ButtonGroup size="sm">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
