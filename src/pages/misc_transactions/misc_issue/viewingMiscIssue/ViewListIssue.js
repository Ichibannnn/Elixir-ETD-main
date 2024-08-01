import React, { useEffect, useState } from "react";
import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, Select, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import request from "../../../../services/ApiClient";

import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import PageScroll from "../../../../utils/PageScroll";
import { ViewModal } from "./ActionButton";

const fetchIssuesApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(`Miscellaneous/GetAllMiscellaneousIssuePaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}`);
  return res.data;
};

export const ViewListIssue = () => {
  const [issueData, setIssueData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");

  const [statusBody, setStatusBody] = useState({
    id: "",
    status: "",
  });

  const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure();

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

  const fetchIssues = () => {
    fetchIssuesApi(currentPage, pageSize, search, status).then((res) => {
      setIssueData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchIssues();
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

  const viewHandler = (id, status) => {
    if (id) {
      setStatusBody({
        id: id,
        status: status,
      });
      openView();
    } else {
      setStatusBody({
        id: "",
        status: "",
      });
    }
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <Flex justifyContent="space-between">
        <InputGroup w="15%">
          <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
          <Input onChange={(e) => searchHandler(e.target.value)} type="text" fontSize="xs" placeholder="Search" focusBorderColor="accent" />
        </InputGroup>
      </Flex>

      <Flex mt={5}>
        <PageScroll minHeight="250px" maxHeight="601px">
          <Text textAlign="center" bgColor="primary" color="white" fontSize="sm">
            List of Miscellaneous Issues
          </Text>

          <Table size="sm" variant="striped">
            <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th h="40px" color="white" fontSize="11px">
                  ID
                </Th>
                <Th h="40px" color="white" fontSize="11px">
                  Customer Code
                </Th>
                <Th h="40px" color="white" fontSize="11px">
                  Customer Name
                </Th>
                <Th h="40px" color="white" fontSize="11px">
                  Total Quantity
                </Th>
                <Th h="40px" color="white" fontSize="11px">
                  Prepared Date
                </Th>
                <Th h="40px" color="white" fontSize="11px">
                  Transaction Date
                </Th>
                <Th h="40px" color="white" fontSize="11px">
                  Transacted By
                </Th>

                <Th h="40px" color="white" fontSize="11px">
                  View
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {issueData?.issue?.map((issue, i) => (
                <Tr key={i}>
                  <Td fontSize="sm">{issue.issuePKey}</Td>
                  <Td fontSize="sm">{issue.customerCode}</Td>
                  <Td fontSize="sm">{issue.customer}</Td>
                  <Td fontSize="sm">
                    {issue.totalQuantity.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="sm">{issue.preparedDate}</Td>
                  <Td fontSize="sm">{issue.transactionDate}</Td>
                  <Td fontSize="sm">{issue.preparedBy}</Td>
                  <Td fontSize="sm">
                    <Button onClick={() => viewHandler(issue.issuePKey, issue.isActive)} size="xs" bg="none">
                      {/* View */}
                      <GrView fontSize="24px" />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex mt={5} justifyContent="end">
        <Stack>
          <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
            <PaginationContainer>
              <PaginationPrevious bg="secondary" color="white" p={1} _hover={{ bg: "accent", color: "white" }}>
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage _hover={{ bg: "accent", color: "white" }} p={3} bg="secondary" color="white" key={`pagination_page_${page}`} page={page} />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext bg="secondary" color="white" p={1} _hover={{ bg: "accent", color: "white" }}>
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="filled" fontSize="md">
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

      {isView && <ViewModal isOpen={isView} onClose={closeView} statusBody={statusBody} />}
    </Flex>
  );
};
