import React, { useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { BiExport } from "react-icons/bi";

import * as XLSX from "xlsx";
import moment from "moment";
import request from "../../services/ApiClient";

import { WarehouseReceivingHistory } from "./report_dropdown/WarehouseReceivingHistory";
import { MoveOrderHistory } from "./report_dropdown/MoveOrderHistory";
import { TransactedMOHistory } from "./report_dropdown/TransactedMOHistory";
import { ServedUnservedReports } from "./report_dropdown/ServedUnservedReports";
import { MiscReceiptHistory } from "./report_dropdown/MiscReceiptHistory";
import { MiscIssueHistory } from "./report_dropdown/MiscIssueHistory";
import { BorrowedMatsHistory } from "./report_dropdown/BorrowedMatsHistory";
import { ReturnedQuantityTransaction } from "./report_dropdown/ReturnedQuantityTransaction";
import { CancelledOrders } from "./report_dropdown/CancelledOrders";
import { ConsolidatedReportsFinance } from "./report_dropdown/ConsolidatedReportsFinance";
import { ConsolidatedReportsAudit } from "./report_dropdown/ConsolidatedReportsAudit";
import { InventoryMovement } from "./report_dropdown/InventoryMovement";
import { FuelRegister } from "./report_dropdown/FuelRegister";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import PageScroll from "../../utils/PageScroll";
import useDebounce from "../../hooks/useDebounce";

const Reports = () => {
  const [dateFrom, setDateFrom] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [dateTo, setDateTo] = useState(moment(new Date()).format("yyyy-MM-DD"));

  const [sample, setSample] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 700);

  const [printData, setPrintData] = useState("");

  const { isOpen: isPrintMiscReceipt, onOpen: openPrinMiscReceipt, onClose: closePrintMiscReceipt } = useDisclosure();
  const { isOpen: isPrintMiscIssue, onOpen: openPrinMiscIssue, onClose: closePrintMiscIssue } = useDisclosure();

  const navigationHandler = (data) => {
    if (data) {
      setSample(data);
    } else {
      setSample("");
      setSheetData([]);
    }
  };

  const handleExport = async () => {
    if (sample === 11) {
      setIsLoading(true);
      try {
        const response = await request.get("Reports/ExportConsolidateFinance", {
          params: {
            DateFrom: dateFrom,
            DateTo: dateTo,
            Search: search,
          },
          responseType: "blob",
        });

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: response.headers["content-type"] });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Consolidated_Finance_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (sample === 12) {
      setIsLoading(true);
      try {
        const response = await request.get("Reports/ConsolidateAuditExport", {
          params: {
            DateFrom: dateFrom,
            DateTo: dateTo,
            Search: search,
          },
          responseType: "blob",
        });

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: response.headers["content-type"] });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Consolidated_Audit_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (sample === 5) {
      setIsLoading(true);
      try {
        const response = await request.get("Reports/ExportMoveOrderReports", {
          params: {
            DateFrom: dateFrom,
            DateTo: dateTo,
            Search: search,
          },
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: response.headers["content-type"] });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Served_Unserved_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (sample === 4) {
      setIsLoading(true);
      try {
        var workbook = XLSX.utils.book_new(),
          worksheet = XLSX.utils.json_to_sheet(sheetData);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "Fuel_Transacted_History.xlsx");
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      var workbook = XLSX.utils.book_new(),
        worksheet = XLSX.utils.json_to_sheet(sheetData);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, "Elixir_ETD_Reports_ExportFile.xlsx");
      setIsLoading(false);
    }
  };

  const printMiscTransaction = () => {
    if (sample === 6) {
      setIsLoading(true);
      setPrintData(sheetData);
      openPrinMiscReceipt();
    } else if (sample === 7) {
      setIsLoading(true);
      setPrintData(sheetData);
      openPrinMiscIssue();
    } else {
    }
  };

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearchValue(inputValue);
  };

  const minimumDateForInventoryMovement = "2022-01-01";

  return (
    <>
      <Flex w="full" p={3} bg="form">
        <Flex w="full" justifyContent="start" flexDirection="column">
          <Flex w="full" justifyContent="space-between">
            <HStack>
              <Text fontSize="2xl" color="black" fontWeight="semibold">
                Report Details
              </Text>
            </HStack>

            {/* Dropdown value */}
            <Flex justifyContent="space-around" flexDirection="row" gap={2}>
              <Flex alignItems="center">
                <Badge>Report Name:</Badge>
              </Flex>

              <HStack>
                <Select onChange={(e) => navigationHandler(Number(e.target.value))} placeholder=" " bgColor="#fff8dc" w="full" fontSize="xs">
                  <option value={1}>Warehouse Receiving History</option>
                  <option value={2}>Move Order For Transaction History</option>
                  <option value={3}>Move Order Transacted History</option>
                  <option value={4}>Fuel Transacted History</option>
                  <option value={5}>Service Level History</option>
                  <option value={6}>Miscellaneous Receipt History</option>
                  <option value={7}>Miscellaneous Issue History</option>
                  <option value={8}>Borrowed Materials History</option>
                  <option value={9}>Returned Materials History</option>
                  <option value={10}>Unserved Orders History</option>
                  <option value={11}>Consolidated Report (Finance)</option>
                  <option value={12}>Consolidated Report (Audit)</option>
                  <option value={13}>Inventory Movement</option>
                </Select>
              </HStack>
            </Flex>

            <Flex justifyContent="center" alignItems="end">
              <Button onClick={handleExport} isLoading={isLoading} isDisabled={sheetData?.length === 0 || !sample} size="sm" leftIcon={<BiExport fontSize="20px" />} bg="none">
                <Text fontSize="xs">Export</Text>
              </Button>

              {(sample === 6 || sample === 7) && (
                <>
                  <Button
                    onClick={printMiscTransaction}
                    isLoading={isLoading}
                    isDisabled={sheetData?.length === 0 || !sample}
                    size="sm"
                    leftIcon={<FaPrint fontSize="20px" />}
                    bg="none"
                  >
                    <Text fontSize="xs">Print</Text>
                  </Button>
                </>
              )}
            </Flex>
          </Flex>

          {/* Rendering Reports Components  */}
          <Flex w="full" mt={2} justifyContent="center" flexDirection="column" className="boxShadow" borderRadius="xl" p={4} bg="form" gap={2} maxHeight="1000px">
            <Flex justifyContent="space-between" gap={2}>
              <Flex flexDirection="column" w="full">
                <Flex justifyContent="start">
                  <Badge>Search:</Badge>
                </Flex>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<FiSearch bg="black" fontSize="18px" />} />
                  <Input fontSize="xs" isDisabled={!sample} borderColor="gray.400" onChange={(e) => searchHandler(e.target.value)} />
                </InputGroup>
              </Flex>

              {/* Viewing Condition  */}
              <Flex justifyContent="start">
                {sample < 14 ? (
                  <Flex justifyContent="start" flexDirection="row">
                    {sample != 13 && (
                      <Flex flexDirection="column" ml={1}>
                        <Flex>
                          <Badge>Date from:</Badge>
                        </Flex>
                        <Input
                          fontSize="xs"
                          bgColor="#fff8dc"
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          min={sample === 13 ? minimumDateForInventoryMovement : undefined}
                        />
                      </Flex>
                    )}

                    <Flex flexDirection="column" ml={1}>
                      <Flex>
                        <Badge>{sample === 13 ? `Rollback Date:` : `Date To:`}</Badge>
                      </Flex>
                      <Input fontSize="xs" bgColor="#fff8dc" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </Flex>
                  </Flex>
                ) : (
                  ""
                )}
              </Flex>
            </Flex>

            {sample === 1 ? (
              <WarehouseReceivingHistory search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 2 ? (
              <MoveOrderHistory search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 3 ? (
              <TransactedMOHistory search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 4 ? (
              <FuelRegister search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 5 ? (
              <ServedUnservedReports search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} isLoading={isLoading} />
            ) : sample === 6 ? (
              <MiscReceiptHistory search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 7 ? (
              <MiscIssueHistory search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 8 ? (
              <BorrowedMatsHistory search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 9 ? (
              <ReturnedQuantityTransaction search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 10 ? (
              <CancelledOrders search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 11 ? (
              <ConsolidatedReportsFinance search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} isLoading={isLoading} />
            ) : sample === 12 ? (
              <ConsolidatedReportsAudit search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} isLoading={isLoading} />
            ) : sample === 13 ? (
              <InventoryMovement search={search} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : (
              ""
            )}

            {isPrintMiscReceipt && (
              <PrintMiscReceiptModal
                isOpen={isPrintMiscReceipt}
                onClose={closePrintMiscReceipt}
                printData={printData}
                setPrintData={setPrintData}
                dateFrom={dateFrom}
                dateTo={dateTo}
                setIsLoading={setIsLoading}
              />
            )}

            {isPrintMiscIssue && (
              <PrintMiscIssueModal
                isOpen={openPrinMiscIssue}
                onClose={closePrintMiscIssue}
                printData={printData}
                setPrintData={setPrintData}
                dateFrom={dateFrom}
                dateTo={dateTo}
                setIsLoading={setIsLoading}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Reports;

const PrintMiscReceiptModal = ({ isOpen, onClose, printData, setPrintData, dateFrom, dateTo, setIsLoading }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const closeHandler = () => {
    setIsLoading(false);
    setPrintData("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => closeHandler()} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody mt={5}>
            <PageScroll minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="striped" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th color="white" colSpan={17} textAlign="center">{`Miscellaneous Receipt History from ${moment(dateFrom).format("l")} - ${moment(dateTo).format("l")}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top="40px" zIndex={2} h="40px">
                  <Tr>
                    <Th color="white">Receipt ID</Th>
                    <Th color="white">Receipt Date</Th>
                    <Th color="white">Supplier Code</Th>
                    <Th color="white">Supplier Name</Th>
                    <Th color="white">Details</Th>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">UOM</Th>
                    <Th color="white">Quantity</Th>
                    <Th color="white">Unit Cost</Th>
                    <Th color="white">Transacted by</Th>
                    <Th color="white">Transaction Date</Th>
                    <Th color="white">Company</Th>
                    <Th color="white">Department</Th>
                    <Th color="white">Location</Th>
                    <Th color="white">Account Title</Th>
                    <Th color="white">Employee</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item["Receipt Id"]}</Td>
                      <Td>{item["Receipt Date"]}</Td>
                      <Td>{item["Supplier Code"]}</Td>
                      <Td>{item["Supplier Name"]}</Td>
                      <Td>{item["Details"]}</Td>
                      <Td>{item["Item Code"]}</Td>
                      <Td>{item["Item Description"]}</Td>
                      <Td>{item["UOM"]}</Td>
                      <Td>{item["Quantity"]}</Td>
                      <Td>{item["Unit Cost"]}</Td>
                      <Td>{item["Transacted By"]}</Td>
                      <Td>{item["Transaction Date"]}</Td>
                      <Td>{item["Company"]}</Td>
                      <Td>{item["Department"]}</Td>
                      <Td>{item["Location"]}</Td>
                      <Td>{item["Account Title"]}</Td>
                      <Td>{item["Employee"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </ModalBody>

          <ModalFooter mt={7}>
            <ButtonGroup size="sm">
              <Button variant="outline" onClick={() => closeHandler()}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
            </ButtonGroup>
          </ModalFooter>

          {/* PRINT */}
          <Box display="none">
            <PageScroll minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="simple" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={2} h="40px">
                  <Tr>
                    <Th color="white" fontSize="10px" colSpan={17} textAlign="center">{`Miscellaneous Receipt History from ${moment(dateFrom).format("l")} - ${moment(
                      dateTo
                    ).format("l")}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th color="white" fontSize="8px">
                      Receipt ID
                    </Th>
                    <Th color="white" fontSize="8px">
                      Receipt Date
                    </Th>
                    <Th color="white" fontSize="8px">
                      Supplier Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Supplier Name
                    </Th>
                    <Th color="white" fontSize="8px">
                      Details
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="8px">
                      UOM
                    </Th>
                    <Th color="white" fontSize="8px">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="8px">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transacted by
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transaction Date
                    </Th>
                    <Th color="white" fontSize="8px">
                      Company
                    </Th>
                    <Th color="white" fontSize="8px">
                      Department
                    </Th>
                    <Th color="white" fontSize="8px">
                      Location
                    </Th>
                    <Th color="white" fontSize="8px">
                      Account Title
                    </Th>
                    <Th color="white" fontSize="8px">
                      Employee
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="10px">{item["Receipt Id"]}</Td>
                      <Td fontSize="10px">{item["Receipt Date"]}</Td>
                      <Td fontSize="10px">{item["Supplier Code"]}</Td>
                      <Td fontSize="10px">{item["Supplier Name"]}</Td>
                      <Td fontSize="10px">{item["Details"]}</Td>
                      <Td fontSize="10px">{item["Item Code"]}</Td>
                      <Td fontSize="10px">{item["Item Description"]}</Td>
                      <Td fontSize="10px">{item["UOM"]}</Td>
                      <Td fontSize="10px">{item["Quantity"]}</Td>
                      <Td fontSize="10px">{item["Unit Cost"]}</Td>
                      <Td fontSize="10px">{item["Transacted By"]}</Td>
                      <Td fontSize="10px">{item["Transaction Date"]}</Td>
                      <Td fontSize="10px">{item["Company"]}</Td>
                      <Td fontSize="10px">{item["Department"]}</Td>
                      <Td fontSize="10px">{item["Location"]}</Td>
                      <Td fontSize="10px">{item["Account Title"]}</Td>
                      <Td fontSize="10px">{item["Employee"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Box>

          <style>
            {`
            @media print {
            @page {
              size: landscape;
              margin: 10mm; /* Adjust this for padding */
            }

            body {
              padding: 2px; /* Equivalent to padding-4 */
            }

            thead {
              display: table-header-group;
            }

            tfoot {
              display: table-footer-group;
            }

            tbody {
              display: table-row-group;
            }

            tr {
              break-inside: avoid; /* Prevent row from splitting */
              page-break-inside: avoid;
            }

            td, th {
              padding: 4px; /* Ensures better spacing */
               border: 1px solid black; 
            }
      
          }

          `}
          </style>
        </ModalContent>
      </Modal>
    </>
  );
};

const PrintMiscIssueModal = ({ isOpen, onClose, printData, setPrintData, dateFrom, dateTo, setIsLoading }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const closeHandler = () => {
    setIsLoading(false);
    setPrintData("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => closeHandler()} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody mt={5}>
            <PageScroll minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="striped" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th color="white" colSpan={17} textAlign="center">{`Miscellaneous Issue History from ${moment(dateFrom).format("l")} - ${moment(dateTo).format("l")}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top="40px" zIndex={2} h="40px">
                  <Tr>
                    <Th color="white">Issue ID</Th>
                    <Th color="white">Customer Code</Th>
                    <Th color="white">Customer Name</Th>
                    <Th color="white">Details</Th>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">UOM</Th>
                    <Th color="white">Quantity</Th>
                    <Th color="white">Unit Cost</Th>
                    <Th color="white">Transacted by</Th>
                    <Th color="white">Transaction Date</Th>
                    <Th color="white">Company</Th>
                    <Th color="white">Department</Th>
                    <Th color="white">Location</Th>
                    <Th color="white">Account Title</Th>
                    <Th color="white">Employee</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item["Issue ID"]}</Td>
                      <Td>{item["Customer Code"]}</Td>
                      <Td>{item["Customer Name"]}</Td>
                      <Td>{item["Details"]}</Td>
                      <Td>{item["Item Code"]}</Td>
                      <Td>{item["Item Description"]}</Td>
                      <Td>{item["UOM"]}</Td>
                      <Td>{item["Quantity"]}</Td>
                      <Td>{item["Unit Cost"]}</Td>
                      <Td>{item["Transacted By"]}</Td>
                      <Td>{item["Transaction Date"]}</Td>
                      <Td>{item["Company"]}</Td>
                      <Td>{item["Department"]}</Td>
                      <Td>{item["Location"]}</Td>
                      <Td>{item["Account Title"]}</Td>
                      <Td>{item["Employee"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </ModalBody>

          <ModalFooter mt={7}>
            <ButtonGroup size="sm">
              <Button variant="outline" onClick={() => closeHandler()}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
            </ButtonGroup>
          </ModalFooter>

          {/* PRINT */}
          <Box display="none">
            <PageScroll minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="simple" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={2} h="40px">
                  <Tr>
                    <Th color="white" fontSize="10px" colSpan={17} textAlign="center">{`Miscellaneous Issue History from ${moment(dateFrom).format("l")} - ${moment(dateTo).format(
                      "l"
                    )}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th color="white" fontSize="8px">
                      Issue ID
                    </Th>
                    <Th color="white" fontSize="8px">
                      Customer Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Customer Name
                    </Th>
                    <Th color="white" fontSize="8px">
                      Details
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="8px">
                      UOM
                    </Th>
                    <Th color="white" fontSize="8px">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="8px">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transacted by
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transaction Date
                    </Th>
                    <Th color="white" fontSize="8px">
                      Company
                    </Th>
                    <Th color="white" fontSize="8px">
                      Department
                    </Th>
                    <Th color="white" fontSize="8px">
                      Location
                    </Th>
                    <Th color="white" fontSize="8px">
                      Account Title
                    </Th>
                    <Th color="white" fontSize="8px">
                      Employee
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="10px">{item["Issue ID"]}</Td>
                      <Td fontSize="10px">{item["Customer Code"]}</Td>
                      <Td fontSize="10px">{item["Customer Name"]}</Td>
                      <Td fontSize="10px">{item["Details"]}</Td>
                      <Td fontSize="10px">{item["Item Code"]}</Td>
                      <Td fontSize="10px">{item["Item Description"]}</Td>
                      <Td fontSize="10px">{item["UOM"]}</Td>
                      <Td fontSize="10px">{item["Quantity"]}</Td>
                      <Td fontSize="10px">{item["Unit Cost"]}</Td>
                      <Td fontSize="10px">{item["Transacted By"]}</Td>
                      <Td fontSize="10px">{item["Transaction Date"]}</Td>
                      <Td fontSize="10px">{item["Company"]}</Td>
                      <Td fontSize="10px">{item["Department"]}</Td>
                      <Td fontSize="10px">{item["Location"]}</Td>
                      <Td fontSize="10px">{item["Account Title"]}</Td>
                      <Td fontSize="10px">{item["Employee"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Box>

          <style>
            {`
            @media print {
            @page {
              size: landscape;
              margin: 10mm; /* Adjust this for padding */
            }

            body {
              padding: 2px; /* Equivalent to padding-4 */
            }

            thead {
              display: table-header-group;
            }

            tfoot {
              display: table-footer-group;
            }

            tbody {
              display: table-row-group;
            }

            tr {
              break-inside: avoid; /* Prevent row from splitting */
              page-break-inside: avoid;
            }

            td, th {
              padding: 4px; /* Ensures better spacing */
               border: 1px solid black; 
            }
      
          }

          `}
          </style>
        </ModalContent>
      </Modal>
    </>
  );
};
