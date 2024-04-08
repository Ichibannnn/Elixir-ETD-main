import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import PageScroll from "../../../../utils/PageScroll";
import request from "../../../../services/ApiClient";
import moment from "moment/moment";
import { decodeUser } from "../../../../services/decode-user";
import {
  ApproveModal,
  ApproveReturnedModal,
  CancelModalApproval,
  ViewModalApproval,
} from "./ActionModal";
import { AiOutlineMore } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { BsCheck2Square } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
// import {
//   ApproveModal,
//   RejectModalApproval,
//   ViewModalApproval,
// } from "./ActionModal";

const fetchBorrowedApprovalApi = async (
  pageNumber,
  pageSize,
  search,
  status
) => {
  const res = await request.get(
    `Borrowed/GetAllForApproveReturnedItemOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}`
  );
  return res.data;
};

const ReturnedApproval = ({ fetchNotification }) => {
  const [borrowedApprovalData, setBorrowedApprovalData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [statusBody, setStatusBody] = useState({
    id: "",
  });

  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();

  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();

  const {
    isOpen: isApprove,
    onClose: closeApprove,
    onOpen: openApprove,
  } = useDisclosure();

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

  const fetchBorrowed = () => {
    fetchBorrowedApprovalApi(currentPage, pageSize, search, status).then(
      (res) => {
        setBorrowedApprovalData(res);
        setPageTotal(res.totalCount);
      }
    );
  };

  useEffect(() => {
    fetchBorrowed();
  }, [status, pageSize, currentPage, search]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const viewHandler = (id) => {
    // console.log(id);
    if (id) {
      setStatusBody({
        id: id,
      });
      openView();
    } else {
      setStatusBody({
        id: "",
      });
    }
  };

  const rejectHandler = (id) => {
    // console.log(id);
    if (id) {
      setStatusBody({
        id: id,
      });
      openReject();
    } else {
      setStatusBody({
        id: "",
      });
    }
  };

  const approveHandler = (id) => {
    if (id) {
      setStatusBody({
        id: id,
      });
      openApprove();
    } else {
      setStatusBody({
        id: "",
      });
    }
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      mb="150px"
      w="full"
      p={5}
    >
      <Flex justifyContent="space-between">
        {/* <Flex mt={2}>
          <Text
            fontWeight="extrabold"
            fontSize="md"
            color="secondary"
            letterSpacing="0px"
          >
            {" "}
            Request Borrowed List
          </Text>
        </Flex> */}
        <InputGroup w="15%">
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            onChange={(e) => searchHandler(e.target.value)}
            type="text"
            fontSize="xs"
            placeholder="Search: ID"
            focusBorderColor="accent"
          />
        </InputGroup>
      </Flex>
      <Box w="full" bgColor="primary" h="22px">
        <Text
          fontWeight="normal"
          fontSize="13px"
          color="white"
          textAlign="center"
          justifyContent="center"
        >
          Approval of Returned Materials
        </Text>
      </Box>
      <Flex>
        <PageScroll minHeight="400px" maxHeight="701px">
          <Table variant="striped">
            <Thead bgColor="primary">
              <Tr>
                <Th h="40px" color="white" fontSize="10px">
                  ID
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Customer
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Customer Name
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Returned Qty
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Returned Date
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Borrowed By
                </Th>
                <Th h="40px" color="white" fontSize="10px" textAlign="center">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {borrowedApprovalData?.issue?.map((borrow, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{borrow.id}</Td>
                  <Td fontSize="xs">{borrow.customerCode}</Td>
                  <Td fontSize="xs">{borrow.customerName}</Td>
                  <Td fontSize="xs">
                    {" "}
                    {borrow.returnedBorrow.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {moment(borrow.returnedDate).format("MM/DD/yyyy")}
                  </Td>
                  <Td fontSize="xs">{borrow.preparedBy}</Td>
                  <Td fontSize="xs">
                    <Flex justifyContent="center">
                      <Box>
                        <Menu>
                          <MenuButton
                            alignItems="center"
                            justifyContent="center"
                            bg="none"
                          >
                            <AiOutlineMore fontSize="20px" />
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<GrView fontSize="17px" />}
                              onClick={() => viewHandler(borrow.id)}
                            >
                              <Text fontSize="15px">View</Text>
                            </MenuItem>
                            <MenuItem
                              icon={
                                <BsCheck2Square fontSize="17px" color="green" />
                              }
                              onClick={() => approveHandler(borrow.id)}
                            >
                              <Text fontSize="15px" color="green">
                                Approve
                              </Text>
                            </MenuItem>
                            <MenuItem
                              icon={<GiCancel fontSize="17px" color="red" />}
                              onClick={() => rejectHandler(borrow.id)}
                            >
                              <Text
                                fontSize="15px"
                                color="red"
                                _hover={{ color: "red" }}
                              >
                                Disapprove
                              </Text>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex mt={5} justifyContent="end">
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="secondary"
                color="white"
                p={1}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "accent", color: "white" }}
                    p={3}
                    bg="secondary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="secondary"
                  color="white"
                  p={1}
                  _hover={{ bg: "accent", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select
                  onChange={handlePageSizeChange}
                  variant="filled"
                  fontSize="md"
                >
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

      {isView && (
        <ViewModalApproval
          isOpen={isView}
          onClose={closeView}
          statusBody={statusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      {isReject && (
        <CancelModalApproval
          isOpen={isReject}
          onClose={closeReject}
          statusBody={statusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchNotification={fetchNotification}
        />
      )}

      {isApprove && (
        <ApproveReturnedModal
          isOpen={isApprove}
          onClose={closeApprove}
          statusBody={statusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};

export default ReturnedApproval;
