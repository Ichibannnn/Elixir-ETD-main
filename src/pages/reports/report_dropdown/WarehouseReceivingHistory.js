import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
  HStack,
  Select,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import moment from "moment";

export const WarehouseReceivingHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
  search,
}) => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);

  const fetchWarehouseReceivingHistoryApi = async (
    dateFrom,
    dateTo,
    search
  ) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(
      `Reports/WareHouseReceivingReports?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dateTo}`,
      {
        params: {
          search: search,
        },
      }
    );
    return res.data;
  };

  const fetchWarehouseReceivingHistory = () => {
    fetchWarehouseReceivingHistoryApi(dateFrom, dateTo, search).then((res) => {
      setWarehouseData(res);
      // console.log(warehouseData);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            ID: item.warehouseId,
            "Received Date": item.receiveDate,
            "PO Number": item.poNumber,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescrption,
            UOM: item.uom,
            Quantity: item.quantity,
            "Total Reject": item.totalReject,
            Supplier: item.supplierName,
            "Transaction Type": item.transactionType,
            "Received By": item.receivedBy,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchWarehouseReceivingHistory();

    return () => {
      setWarehouseData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
          <Table size="md" variant="striped">
            <Thead
              bgColor="primary"
              h="40px"
              position="sticky"
              top={0}
              zIndex="1"
            >
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Received Date
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  PO Number
                </Th>
                {buttonChanger ? (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Line Amount
                    </Th>
                  </>
                ) : (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Total Reject
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Supplier
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transaction Type
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Received By
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {warehouseData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.warehouseId}</Td>
                  <Td fontSize="xs">{item.receiveDate}</Td>
                  <Td fontSize="xs">{item.poNumber ? item.poNumber : "-"}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescrption}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">
                        {item.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.unitPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.totalUnitPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td fontSize="xs">
                        {item.totalReject.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{item.supplierName}</Td>
                      <Td fontSize="xs">{item.transactionType}</Td>
                      <Td fontSize="xs">
                        {item.receivedBy ? item.receivedBy : "-"}
                      </Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        {/* <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="primary"
                color="white"
                p={1}
                _hover={{ bg: "btnColor", color: "white" }}
              >
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
                <PaginationNext
                  bg="primary"
                  color="white"
                  p={1}
                  _hover={{ bg: "btnColor", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select
                  onChange={handlePageSizeChange}
                  variant="outline"
                  fontSize="md"
                >
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                  <option value={Number(100)}>100</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack> */}

        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {warehouseData?.inventory?.length}
        </Text>
        <Button
          size="md"
          colorScheme="blue"
          onClick={() => setButtonChanger(!buttonChanger)}
        >
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
