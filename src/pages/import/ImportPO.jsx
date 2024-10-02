import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Input, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { BiImport } from "react-icons/bi";
import { MdOutlineError, MdOutlineSync } from "react-icons/md";

import * as XLSX from "xlsx";
import moment from "moment/moment";
import request from "../../services/ApiClient";
import DateConverter from "../../components/DateConverter";
import { decodeUser } from "../../services/decode-user";
import { ToastComponent } from "../../components/Toast";
import Swal from "sweetalert2";

import ErrorList from "./ErrorList";
import PageScroll from "../../utils/PageScroll";
import axios from "axios";
import SyncModal from "./SyncModal";

const currentUser = decodeUser();

const fetchYMIRApi = async (fromDate, toDate) => {
  const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD");
  const toDateFormatted = moment(toDate).format("yyyy-MM-DD");
  const res = await axios.get(`http://10.10.13.6:8080/api/etd_api?system_name=ESG WAREHOUSE ETD&from=${fromDateFormatted}&to=${toDateFormatted}`, {
    headers: {
      Authorization: "Bearer " + process.env.REACT_APP_YMIR_PROD_TOKEN,
    },
  });
  return res.data;
};

const ImportPO = () => {
  const [excelData, setExcelData] = useState([]);
  const [ymirPO, setYmirPo] = useState([]);

  const dateVar = new Date();
  const startDate = moment(dateVar).format("yyyy-MM-DD");
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(new Date());

  const [workbook, setWorkbook] = useState([]);
  const [sheetOption, setSheetOption] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchData, setFetchData] = useState(false);

  const [errorOpener, setErrorOpener] = useState(false);
  const [errorData, setErrorData] = useState([]);
  const toast = useToast();

  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();
  const { isOpen: isSyncOpen, onOpen: onSyncOpen, onClose: onSyncClose } = useDisclosure();

  const clearExcelFile = useRef();

  // GET YMIR PO
  const getYmirPo = () => {
    fetchYMIRApi(fromDate, toDate).then((res) => {
      setYmirPo(res);
      setFetchData(false);
    });
  };

  useEffect(() => {
    if (fromDate && toDate) {
      getYmirPo();
    }
    return () => {
      setYmirPo([]);
    };
  }, [fromDate, toDate]);

  // console.log("YMIR PO: ", ymirPO);

  // EXCEL DATA TRIM TO LOWERCASE
  const fileRender = (jsonData) => {
    setExcelData([]);

    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });
    setExcelData(jsonData);
  };

  // EXCEL DATA
  const fileHandler = async (e) => {
    setWorkbook([]);

    const file = e[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.readFile(data);

    setWorkbook(workbook);
    setSheetOption(workbook.SheetNames);

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet);

    const isColumnComplete = jsonData.every((item) => {
      return Object.keys(item).length === 12;
    });

    fileRender(jsonData);

    // console.log("workbook", workbook);

    if (isColumnComplete) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const resultArray = excelData.map((item) => {
    let newPrData = DateConverter(item.pr_date);
    let newPoDate = DateConverter(item.po_date);

    return {
      pR_Number: item?.pr_number?.toString().trim(),
      pR_Date: moment(newPrData)?.format("YYYY-MM-DD")?.toString().trim(),
      pO_Number: item?.po_number?.toString().trim(),
      pO_Date: moment(newPoDate)?.format("YYYY-MM-DD")?.toString().trim(),
      itemCode: item?.item_code?.toString().trim(),
      itemDescription: item?.item_description?.toString()?.trim(),
      ordered: item?.qty_ordered?.toString().trim(),
      delivered: item?.qty_delivered?.toString().trim(),
      billed: item?.qty_billed?.toString().trim(),
      uom: item?.uom?.toString().trim(),
      unitPrice: item?.unit_cost?.toString().trim(),
      vendorName: item?.supplier_name?.toString().trim(),
      addedBy: currentUser?.username?.toString().trim(),
    };
  });

  // console.log("resultArray: ", resultArray);

  const submitExcelHandler = (resultArray) => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to import this purchase order list?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          if (resultArray.length > 0) {
            console.log(resultArray);

            const hasZeroUnitCost = resultArray.some((eData) => eData.unitPrice <= 0);

            if (hasZeroUnitCost) {
              ToastComponent("Warning!", "Unit Cost cannot be zero value", "warning", toast);
            } else {
              try {
                setIsLoading(true);
                const res = request
                  .post("Import/AddNewPOSummary", resultArray)
                  .then((res) => {
                    ToastComponent("Success!", "PO Imported", "success", toast);
                    setIsLoading(false);
                    setIsDisabled(false);
                    clearExcelFile.current.value = "";
                    setExcelData([]);
                  })
                  .catch((err) => {
                    setIsLoading(false);
                    setErrorData(err.response.data);
                    if (err.response.data) {
                      setErrorOpener(true);
                      onErrorOpen();
                    }
                  });
              } catch (err) {
                ToastComponent("Error!", "Wrong excel format imported for PO", "error", toast);
              }
            }
          } else {
            ToastComponent("Error!", "No data provided, please check your import", "error", toast);
          }
        }
      }
    });
  };

  const openErrorModal = () => {
    onErrorOpen();
  };

  const openSyncYMIRModal = () => {
    onSyncOpen();
  };

  const [bufferError, setBufferError] = useState(false); // Set it to false initially
  const [toastShown, setToastShown] = useState(false); // Set it to false initially

  useEffect(() => {
    // Check if any value in resultArray's any is a letter
    const hasLetterValue = resultArray.some((eData) => isNaN(eData.ordered) || isNaN(eData.delivered) || isNaN(eData.delivered) || isNaN(eData.billed) || isNaN(eData.unitPrice));

    setBufferError(hasLetterValue);
    setIsDisabled(hasLetterValue || resultArray.length === 0); // Disable if there's any letter value or if resultArray is empty

    if (resultArray.length > 0 && bufferError && !toastShown) {
      ToastComponent("Warning!", "Check column fields", "warning", toast);
      setToastShown(true);
    }
  }, [resultArray, toastShown]);

  return (
    <Flex bg="form" h="920px" w="full" flexDirection="column">
      <Flex justifyContent="space-between">
        <Box />
        <Box p={2} gap={3}>
          {errorOpener === true ? (
            <Button
              onClick={() => openErrorModal()}
              type="submit"
              isLoading={isLoading}
              isDisabled={isDisabled}
              w="170px"
              leftIcon={<MdOutlineError fontSize="19px" />}
              borderRadius="none"
              colorScheme="red"
              fontSize="12px"
              size="xs"
            >
              Error List
            </Button>
          ) : (
            <HStack gap={1}>
              <Button
                type="submit"
                leftIcon={<MdOutlineSync fontSize="19px" />}
                colorScheme="teal"
                borderRadius="none"
                fontSize="12px"
                size="xs"
                isLoading={isLoading}
                isDisabled={true}
                onClick={() => openSyncYMIRModal()}
              >
                Sync from YMIR
              </Button>

              <Button
                type="submit"
                leftIcon={<BiImport fontSize="19px" />}
                colorScheme="blue"
                borderRadius="none"
                fontSize="12px"
                size="xs"
                isLoading={isLoading}
                isDisabled={isDisabled}
                onClick={() => submitExcelHandler(resultArray)}
              >
                Import Purchase Order
              </Button>
            </HStack>
          )}
        </Box>
      </Flex>

      <Flex w="100%" h="full" p={2} mt={-4} flexDirection="column" justifyContent="space-between">
        <Flex w="full" h="full">
          <PageScroll maxHeight="840px">
            <Table variant="striped" size="sm">
              <Thead bg="primary" position="sticky" zIndex="0" top={0}>
                <Tr>
                  <Th h="40px" color="white" fontSize="10px">
                    Line
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    PR Number
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    PR Date
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    PO Number
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    PO Date
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Item Code
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Item Description
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Qty Ordered
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Qty Delivered
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Qty Billed
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    UOM
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Unit Cost
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Supplier Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((eData, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{i + 1}</Td>
                    <Td fontSize="xs">
                      {eData.pR_Number ? (
                        eData.pR_Number
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {eData.pR_Date ? (
                        eData.pR_Date
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO Date is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {eData.pO_Number ? (
                        eData.pO_Number
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {eData.pO_Date ? (
                        eData.pO_Date
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {eData.itemCode ? (
                        eData.itemCode
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {eData.itemDescription ? (
                        eData.itemDescription
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {!isNaN(eData.ordered)
                        ? eData.ordered.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : `${eData.ordered} is not a number`}
                    </Td>
                    <Td fontSize="xs">
                      {!isNaN(eData.delivered)
                        ? eData.delivered.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : `${eData.delivered} is not a number`}
                    </Td>
                    <Td fontSize="xs">
                      {!isNaN(eData.billed)
                        ? eData.billed.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : `${eData.billed} is not a number`}
                    </Td>
                    <Td fontSize="xs">
                      {eData.uom ? (
                        eData.uom
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {!isNaN(eData.unitPrice)
                        ? eData.unitPrice.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : `${eData.unitPrice} is not a number`}
                    </Td>
                    <Td fontSize="xs">
                      {eData.vendorName ? (
                        eData.vendorName
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for PO is uploaded.
                        </Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScroll>
        </Flex>
        <Flex p={2} bg="primary" w="100%">
          <Input ref={clearExcelFile} color="white" type="file" w="25%" size="25px" fontSize="13px" onChange={(e) => fileHandler(e.target.files)} />
        </Flex>
      </Flex>

      {isSyncOpen && (
        <SyncModal
          isOpen={isSyncOpen}
          onClose={onSyncClose}
          onErrorSyncModal={onErrorOpen}
          ymirPO={ymirPO}
          fetchData={fetchData}
          setFetchData={setFetchData}
          errorData={errorData}
          setErrorData={setErrorData}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />
      )}

      {isErrorOpen && (
        <ErrorList
          isOpen={isErrorOpen}
          onClose={onErrorClose}
          onOpen={onErrorOpen}
          errorData={errorData}
          setErrorData={setErrorData}
          setErrorOpener={setErrorOpener}
          errorOpener={errorOpener}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setExcelData={setExcelData}
          excelData={excelData}
          setIsDisabled={setIsDisabled}
        />
      )}
    </Flex>
  );
};

export default ImportPO;
