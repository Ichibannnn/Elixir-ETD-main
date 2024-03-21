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
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";

export const CancelledOrders = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
  search,
}) => {
  const [buttonChanger, setButtonChanger] = useState(true);
  const [cancelledData, setCancelledData] = useState([]);
  const [pageTotal, setPageTotal] = useState(undefined);

  const fetchCancelledOrdersApi = async (
    pageNumber,
    pageSize,
    dateFrom,
    dateTo,
    search
  ) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(
      `Reports/CancelledOrderedReports?PageNumber=${pageNumber}&PageSize=${pageSize}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        params: {
          search: search,
        },
      }
    );
    return res.data;
  };

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
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
    setCurrentPage(1);
  };

  const fetchCancelledOrders = () => {
    fetchCancelledOrdersApi(
      currentPage,
      pageSize,
      dateFrom,
      dateTo,
      search
    ).then((res) => {
      setCancelledData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "MIR ID": item.mirId,
            "Order ID": item.orderId,
            "Date Ordered": item.dateOrdered,
            "Date Needed": item.dateNeeded,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Charging Department": `${item.departmentCode} - ${item.department}`,
            "Charging Location": `${item.locationCode} - ${item.locationName}`,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            "Quantity Unserved": item.quantityOrdered.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            ),
            Reason: item.reason,
            "Cancelled Date": moment(item.cancelledDate).format("yyyy-MM-DD"),
            "Cancelled By": item.cancelledBy,
          };
        })
      );
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchCancelledOrders();

    return () => {
      setCancelledData([]);
    };
  }, [currentPage, pageSize, dateFrom, dateTo, search]);

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

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
                  MIR ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Order ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Date Ordered
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Date Needed
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Name
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Charging Department
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Charging Location
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Item Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Item Description
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Quantity Unserved
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Reason
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Cancelled Date
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Cancelled By
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {cancelledData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.mirId}</Td>
                  <Td fontSize="xs">{item.orderId}</Td>
                  <Td fontSize="xs">{item.dateOrdered}</Td>
                  <Td fontSize="xs">{item.dateNeeded}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  <Td fontSize="xs">
                    {item.departmentCode} - {item.department}
                  </Td>
                  <Td fontSize="xs">
                    {item.locationCode} - {item.locationName}
                  </Td>
                  <Td fontSize="xs">{item.itemCode}</Td>
                  <Td fontSize="xs">{item.itemDescription}</Td>
                  <Td fontSize="xs">
                    {item.quantityOrdered.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">{item.reason}</Td>
                  {item.cancelledDate ? (
                    <Td fontSize="xs">
                      {moment(item.cancelledDate).format("yyyy-MM-DD")}
                    </Td>
                  ) : (
                    <Td fontSize="xs">-</Td>
                  )}

                  {item.cancelledBy ? (
                    <Td fontSize="xs">{item.cancelledBy}</Td>
                  ) : (
                    <Td fontSize="xs">-</Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        <Stack>
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
        </Stack>

        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {cancelledData?.inventory?.length}
        </Text>
        {/* <Button
          size="xs"
          colorScheme="blue"
          onClick={() => setButtonChanger(!buttonChanger)}
        >
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button> */}
      </Flex>

      {/* <Flex justifyContent='end' mt={2}>
          <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
              {buttonChanger ? `>>>>` : `<<<<`}
          </Button>
      </Flex> */}
    </Flex>
  );
};
