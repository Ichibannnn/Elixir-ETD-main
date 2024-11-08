import React, { useState } from "react";
import { Badge, Button, Flex, HStack, Input, InputGroup, InputLeftElement, Select, Text } from "@chakra-ui/react";
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

const Reports = () => {
  const [dateFrom, setDateFrom] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [dateTo, setDateTo] = useState(moment(new Date()).format("yyyy-MM-DD"));

  const [sample, setSample] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const minimumDateForInventoryMovement = "2022-01-01";

  console.log("object");

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

            {/* Dropdown value  */}
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
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Reports;
