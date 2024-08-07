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
  useDisclosure,
  Td,
  Button,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Badge,
  Select,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { TiArrowBack } from "react-icons/ti";

import React, { useState } from "react";
import { useEffect } from "react";

import request from "../../services/ApiClient";
import moment from "moment";
import PageScroll from "../../utils/PageScroll";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";

import CancelledReturnModal from "./warehouse_receiving/CancelledReturnModal";

const CancelledPO = () => {
  const [pO, setPO] = useState([]);
  const [editData, setEditData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageTotal, setPageTotal] = useState(undefined);

  const { isOpen: isReturnModalOpen, onOpen: openReturnModal, onClose: closeReturnModal } = useDisclosure();

  // FETCH API CANCELLED PO:
  const fetchCancelledPOApi = async (pageNumber, pageSize, search) => {
    const response = await request.get(`Warehouse/GetAllCancelledPoWithPaginationOrig?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
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
  const getCancelledPOHandler = () => {
    fetchCancelledPOApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setPO(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getCancelledPOHandler();

    return () => {
      setPO([]);
    };
  }, [currentPage, pageSize, search]);

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    console.log(inputValue);
  };

  const returnModalHandler = (data) => {
    setEditData(data);
    openReturnModal();
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <Flex color="fontColor" h="100vh" w="full" borderRadius="md" flexDirection="column" bg="background">
      <Flex w="full" bg="form" h="100%" p={4} borderRadius="md" flexDirection="column">
        <Flex w="full" borderRadius="lg" h="5%" position="sticky" justifyContent="space-between" alignItems="center" p={3}>
          <HStack>
            <Text fontSize="2xl" color="black" fontWeight="semibold">
              Cancelled Purchase Orders
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
            List of Cancelled PO
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
              <Table width="full" border="none" bg="gray.200" variant="striped">
                <Thead bg="primary" position="sticky" top={0}>
                  <Tr h="40px">
                    <Th color="white" fontSize="10px">
                      PO Number
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px">
                      Description
                    </Th>
                    <Th color="white" fontSize="10px">
                      Supplier
                    </Th>
                    <Th color="white" fontSize="10px">
                      Qty Remaining
                    </Th>
                    <Th color="white" fontSize="10px">
                      Date Cancelled
                    </Th>
                    <Th color="white" fontSize="10px">
                      Return
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pO?.cancel?.map((canc) => (
                    <Tr key={canc.id}>
                      <Td fontSize="xs">{canc.pO_Number}</Td>
                      <Td fontSize="xs">{canc.itemCode}</Td>
                      <Td fontSize="xs">{canc.itemDescription}</Td>
                      <Td fontSize="xs">{canc.supplier}</Td>
                      <Td fontSize="xs">
                        {canc.actualRemaining.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{moment(canc.dateCancelled).format("MM/DD/YYYY")}</Td>
                      <Td>
                        <Flex>
                          <Box>
                            <Button bg="none" onClick={() => returnModalHandler(canc.id)}>
                              <TiArrowBack />
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
                <Text color="secondary">Number of Records: {pO.cancel?.length}</Text>
              </Badge>
            </HStack>

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
                    <PaginationNext bg="primary" color="white" p={1} _hover={{ bg: "btnColor", color: "white" }}>
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
            {isReturnModalOpen && <CancelledReturnModal editData={editData} isOpen={isReturnModalOpen} onClose={closeReturnModal} getCancelledPOHandler={getCancelledPOHandler} />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CancelledPO;

const ViewModal = ({ isOpen, onClose, viewData }) => {
  return (
    <Flex>
      <Modal size="6xl" isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent bg="#D9DFE7" h="90vh">
          <ModalHeader>
            <Flex justifyContent="center">
              <Text fontSize="sm" fontWeight="semibold">
                PO Summary
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            {!viewData ? (
              <Stack w="full">
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
              </Stack>
            ) : (
              <Table variant="striped" size="sm">
                <Thead bg="primary">
                  <Tr>
                    <Th color="white" fontSize="9px">
                      PO No.
                    </Th>
                    <Th color="white" fontSize="9px">
                      Approved Date
                    </Th>
                    <Th color="white" fontSize="9px">
                      PR No.
                    </Th>
                    <Th color="white" fontSize="9px">
                      PR Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr key={viewData.id}>
                    <Td fontSize="11px">{viewData.poNumber}</Td>
                    <Td fontSize="11px">{viewData.poDate}</Td>
                    <Td fontSize="11px">{viewData.prNumber}</Td>
                    <Td fontSize="11px">{viewData.prDate}</Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} color="gray.600" fontSize="11px">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
