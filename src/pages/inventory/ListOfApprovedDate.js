import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Pagination, PaginationContainer, PaginationNext, PaginationPage, PaginationPageGroup, PaginationPrevious } from "@ajna/pagination";
import { FaSort } from "react-icons/fa";
import { GoArrowSmallRight } from "react-icons/go";
import { FiSearch } from "react-icons/fi";

import moment from "moment";
import PageScroll from "../../utils/PageScroll";

import { CancelApprovedDate } from "./ActionModal";

export const ListofApprovedDate = ({
  moveData,
  pagesCount,
  currentPage,
  fetchApprovedMoveOrders,
  lengthIndicator,
  setCurrentPage,
  setItemCode,
  setWarehouseId,
  setHighlighterId,
  setOrderId,
  orderId,
  preparedLength,
  status,
  setStatus,
  searchValue,
  setSearchValue,
  pages,
  setPageSize,
  notification,
  fetchNotification,
  setButtonChanger,
}) => {
  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    setItemCode("");
    setWarehouseId("");
    setHighlighterId("");
    setOrderId("");
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const handleId = (data) => {
    setItemCode("");
    setHighlighterId("");
    if (data) {
      setOrderId(data);
    } else {
      setOrderId("");
    }
  };

  // Return to Page 1 once length === 0
  useEffect(() => {
    if (lengthIndicator === 0) {
      setCurrentPage(1);
      fetchApprovedMoveOrders();
    }
  }, [lengthIndicator]);

  //Sort by date start line
  const [order, setOrder] = useState("asc");
  function descendingComparator(a, b) {
    if (moment(b?.preparedDate).format("yyyy-MM-DD") < moment(a?.preparedDate).format("yyyy-MM-DD")) {
      return -1;
    }
    if (moment(b?.preparedDate).format("yyyy-MM-DD") > moment(a?.preparedDate).format("yyyy-MM-DD")) {
      return 1;
    }
    return 0;
  }

  //Sort by date end line
  function getComparator(order) {
    return order === "desc" ? (a, b) => descendingComparator(a, b) : (a, b) => -descendingComparator(a, b);
  }

  const { isOpen: isCancel, onOpen: openCancel, onClose: closeCancel } = useDisclosure();
  const cancelHandler = (id) => {
    if (id) {
      setOrderId(id);
      openCancel();
    }
  };

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearchValue(inputValue);
    setOrderId("");
    setHighlighterId("");
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setOrderId("");
    setItemCode("");
    setButtonChanger("");
  };

  useEffect(() => {
    if (searchValue) {
      setCurrentPage(1);
    }
  }, [searchValue]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex w="full" direction="row" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={!status ? "blue" : "gray"}
            variant={!status ? "solid" : "outline"}
            onClick={() => handleStatusChange(false)}
          >
            Regular Orders
            {notification?.moveOrderlistNotRush?.moveorderlistcountNotRush === 0 ? (
              ""
            ) : (
              <Badge ml={2} fontSize="10px" variant="solid" colorScheme="red" mb={1}>
                {notification?.moveOrderlistNotRush?.moveorderlistcountNotRush}
              </Badge>
            )}
          </Button>
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={status ? "blue" : "gray"}
            variant={status ? "solid" : "outline"}
            onClick={() => handleStatusChange(true)}
          >
            Rush Orders
            {notification?.moveOrderlist?.moveorderlistcount === 0 ? (
              ""
            ) : (
              <Badge ml={2} fontSize="10px" variant="solid" colorScheme="red" mb={1}>
                {notification?.moveOrderlist?.moveorderlistcount}
              </Badge>
            )}
          </Button>
        </HStack>
        <HStack flexDirection="row" borderRadius="2xl">
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none" children={<FiSearch color="blackAlpha" fontSize="18px" />} />
            <Input
              mb={1}
              color="blackAlpha"
              value={searchValue}
              onChange={(e) => searchHandler(e.target.value)}
              type="text"
              fontSize="xs"
              placeholder="Search..."
              focusBorderColor="btnColor"
              bg="whiteAlpha"
              borderColor="gray.300"
              borderRadius="md"
            />
          </InputGroup>
        </HStack>
      </Flex>

      <VStack w="full" spacing={0} justifyContent="center">
        <Box w="full" bgColor="primary" h="22px">
          <Text fontWeight="semibold" color="white" textAlign="center" justifyContent="center" fontSize="xs">
            List of Approved Orders
          </Text>
        </Box>
        <PageScroll minHeight="180px" maxHeight="210px">
          <Table size="xs" variant="simple">
            <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
              <Tr p={3}>
                <Th color="white" fontSize="10px">
                  Line
                </Th>
                <Th color="white" fontSize="10px">
                  MIR ID
                </Th>

                <Th color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Name
                </Th>
                <Th color="white" fontSize="10px">
                  Total Ordered Qty
                </Th>
                <Th color="white" fontSize="10px">
                  Order Date
                </Th>
                <Th color="white" fontSize="10px">
                  Date Needed
                </Th>
                <Th color="white" fontSize="10px">
                  <HStack>
                    <Text>Preparation Date</Text>
                    <Button
                      cursor="pointer"
                      onClick={() => {
                        setOrder(order === "asc" ? "desc" : "asc");
                      }}
                      size="xs"
                      p={0}
                      m={0}
                      background="none"
                      _hover={{ background: "none" }}
                    >
                      <FaSort />
                    </Button>
                  </HStack>
                </Th>
                <Th color="white" fontSize="10px">
                  Cancel
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {moveData?.orders?.sort(getComparator(order)).map((order, i) => (
                <Tr
                  key={i}
                  title={order.isReject ? order.remarks : ""}
                  onClick={() => handleId(order.id)}
                  bgColor={orderId === order.id ? "blue.100" : "none"}
                  _hover={order.isReject ? { bgColor: "gray.200" } : { bgColor: "none" }}
                  cursor="pointer"
                >
                  {orderId === order.id ? (
                    <Td>
                      <GoArrowSmallRight fontSize="27px" />
                    </Td>
                  ) : (
                    <Td fontSize="11px">{i + 1}</Td>
                  )}
                  <Td fontSize="xs">{order.id}</Td>
                  <Td fontSize="xs">{order.customerCode}</Td>
                  <Td fontSize="xs">{order.customerName}</Td>
                  <Td fontSize="xs">
                    {order.totalOrders.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">{moment(order.orderDate).format("yyyy-MM-DD")}</Td>
                  <Td fontSize="xs">{moment(order.dateNeeded).format("yyyy-MM-DD")}</Td>
                  <Td fontSize="xs">{moment(order.preparedDate).format("MM/DD/yyyy")}</Td>
                  <Td fontSize="11px">
                    <Button
                      size="xs"
                      fontSize="11px"
                      colorScheme="red"
                      onClick={() => cancelHandler(order.id)}
                      isDisabled={preparedLength > 0 || orderId !== order.id}
                      title={preparedLength > 0 ? "Please cancel all prepared items first" : ""}
                    >
                      Cancel
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </VStack>
      <Flex justifyContent="right" mt={1}>
        <Stack>
          <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
            <PaginationContainer>
              <PaginationPrevious borderRadius="none" bg="primary" color="white" p={1} _hover={{ bg: "btnColor", color: "white" }} size="xs">
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    borderRadius="none"
                    _hover={{ bg: "btnColor", color: "white" }}
                    _focus={{ bg: "btnColor" }}
                    p={3}
                    bg="primary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                    size="xs"
                  />
                ))}
              </PaginationPageGroup>

              <PaginationNext borderRadius="none" bg="primary" color="white" p={1} _hover={{ bg: "btnColor", color: "white" }} size="xs">
                {">>"}
              </PaginationNext>
              <Select borderRadius="none" onChange={handlePageSizeChange} variant="outline" size="xs" fontSize="md" ml={1}>
                <option value={Number(5)}>5</option>
                <option value={Number(10)}>10</option>
                <option value={Number(25)}>25</option>
                <option value={Number(50)}>50</option>
              </Select>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {isCancel && (
        <CancelApprovedDate
          isOpen={isCancel}
          onClose={closeCancel}
          id={orderId}
          setOrderId={setOrderId}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
