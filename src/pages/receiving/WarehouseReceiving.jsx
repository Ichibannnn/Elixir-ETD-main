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
  VStack,
  useDisclosure,
  Td,
  Button,
  useToast,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
import { FaEdit, FaSort } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { AiOutlineMore } from "react-icons/ai";
import { BsReceiptCutoff } from "react-icons/bs";

import React, { useState } from "react";
import { useEffect } from "react";

import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import moment from "moment";
import { decodeUser } from "../../services/decode-user";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";

import { WarehouseContext } from "../../components/context/WarehouseContext";
import { EditModal } from "./warehouse_receiving/EditModal";
import CancelModal from "./warehouse_receiving/CancelModal";
import useDebounce from "../../hooks/useDebounce";

const WarehouseReceiving = () => {
  const [pO, setPO] = useState([]);
  const [poId, setPoId] = useState(null);

  const [viewData, setViewData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [actualGood, setActualGood] = useState(0);
  const [unitPrice, setUnitPrice] = useState(null);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [receivingDate, setReceivingDate] = useState(null);
  const [lotCategory, setLotCategory] = useState("");
  const [disableQuantity, setDisableQuantity] = useState(0);
  const [receivingId, setReceivingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 700);

  const { isOpen: isViewModalOpen, onOpen: openViewModal, onClose: closeViewModal } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure();
  const { isOpen: isCancelModalOpen, onOpen: openCancelModal, onClose: closeCancelModal } = useDisclosure();

  // FETCH API ROLES:
  const fetchAvailablePOApi = async (pageNumber, pageSize, search) => {
    const response = await request.get(`Warehouse/GetAllAvailablePoWithPaginationOrig?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      params: {
        search: search,
      },
    });
    return response.data;
  };

  // const fetchAvailablePOApi = async (pageNumber, pageSize, search) => {
  //   const response = await request.get(`Warehouse/GetPoSummary?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
  //     params: {
  //       search: search,
  //     },
  //   });
  //   return response.data;
  // };

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
  const getAvailablePOHandler = () => {
    setIsLoading(true);
    fetchAvailablePOApi(currentPage, pageSize, search).then((res) => {
      setPO(res);
      setIsLoading(false);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getAvailablePOHandler();

    return () => {
      setPO([]);
    };
  }, [currentPage, pageSize, search]);

  const viewModalHandler = (poNumber, poDate, prNumber, prDate, supplier) => {
    setViewData({ poNumber, poDate, prNumber, prDate, supplier });
    openViewModal();
  };

  const editModalHandler = (data) => {
    setEditData(data);
    setUnitPrice(data.unitPrice);
    openEditModal();
  };

  const cancelModalHandler = (data) => {
    setPoId(data);
    openCancelModal();
  };

  //Sort by date start line
  const [poSort, setPoSort] = useState("asc");
  function descendingComparator(a, b) {
    if (b.poNumber < a.poNumber) {
      return -1;
    }
    if (b.poNumber > a.poNumber) {
      return 1;
    }
    return 0;
  }

  //Sort by date end line
  function getComparator(poSort) {
    return poSort === "desc" ? (a, b) => descendingComparator(a, b) : (a, b) => -descendingComparator(a, b);
  }

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <WarehouseContext.Provider value={{ receivingId }}>
      <Flex color="fontColor" h="100vh" w="full" borderRadius="md" flexDirection="column" bg="gray.300">
        <Flex w="full" bg="form" h="100%" p={4} borderRadius="md" flexDirection="column">
          <Flex w="full" borderRadius="lg" h="5%" position="sticky" justifyContent="space-between" alignItems="center" p={3}>
            <HStack>
              <Text fontSize="2xl" color="black" fontWeight="semibold">
                Purchase Order Summary List
              </Text>
            </HStack>
            <HStack w="15%" p={2} borderRadius="2xl">
              <InputGroup w="full">
                <InputLeftElement pointerEvents="none" children={<FiSearch color="blackAlpha" />} fontSize="sm" />
                <Input
                  color="blackAlpha"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  fontSize="sm"
                  placeholder="Search..."
                  focusBorderColor="btnColor"
                  bg="whiteAlpha"
                  borderColor="gray.300"
                  borderRadius="xl"
                />
              </InputGroup>
            </HStack>
          </Flex>

          <Flex w="full" flexDirection="column" className="boxShadow" borderRadius="xl" h="full" p={4} mt={4} bg="form" gap={2}>
            <Text fontSize="lg" color="black" fontWeight="semibold">
              List of Receiving Materials
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
                <Table width="full" border="none" boxShadow="md" bg="gray.200" variant="striped" className="uppercase">
                  <Thead bg="primary" position="sticky" top={0} zIndex={1}>
                    <Tr>
                      {/* <Th h="40px" color="white" fontSize="10px">
                        RR Number
                      </Th> */}
                      <Th h="40px" color="white" fontSize="10px">
                        <HStack>
                          <Text>PO Number</Text>
                          <Button
                            cursor="pointer"
                            onClick={() => {
                              setPoSort(poSort === "asc" ? "desc" : "asc");
                            }}
                            size="xs"
                            p={0}
                            m={0}
                            background="none"
                            _hover={{ background: "none" }}
                          >
                            <FaSort color="#fff" />
                          </Button>
                        </HStack>
                      </Th>

                      <Th h="40px" color="white" fontSize="10px">
                        RR Number
                      </Th>

                      <Th h="40px" color="white" fontSize="10px">
                        Item Code
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Description
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Supplier
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        UOM
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Qty Ordered
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Actual Delivered
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Actual Remaining
                      </Th>
                      <Th color="white" fontSize="10px">
                        Unit Cost
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pO?.posummary?.sort(getComparator(poSort)).map((pos) => (
                      <Tr key={pos.id}>
                        {/* <Td fontSize="xs">{pos.rrNumber}</Td> */}
                        <Td fontSize="xs">{pos.poNumber}</Td>
                        <Td fontSize="xs">{pos.rrNumber ? pos.rrNumber : "-"}</Td>
                        <Td fontSize="xs">{pos.itemCode}</Td>
                        <Td fontSize="xs">{pos.itemDescription}</Td>
                        <Td fontSize="xs">{pos.supplier}</Td>
                        <Td fontSize="xs">{pos.uom}</Td>
                        <Td fontSize="xs">
                          {pos.quantityOrdered.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {pos.quantityDelivered.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {pos.actualRemaining?.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {pos.unitPrice.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td ml={3}>
                          <Flex pl={2}>
                            <Box>
                              <Menu>
                                <MenuButton alignItems="center" justifyContent="center" bg="none">
                                  <AiOutlineMore fontSize="20px" />
                                </MenuButton>
                                <MenuList>
                                  <MenuItem icon={<GrView fontSize="17px" />} onClick={() => viewModalHandler(pos.poNumber, pos.poDate, pos.prNumber, pos.prDate, pos.supplier)}>
                                    <Text fontSize="15px">View</Text>
                                  </MenuItem>
                                  <MenuItem icon={<FaEdit color="green" fontSize="17px" />} onClick={() => editModalHandler(pos)}>
                                    <Text fontSize="15px" color="green">
                                      Receive
                                    </Text>
                                  </MenuItem>
                                  <MenuItem icon={<GiCancel fontSize="17px" color="red" />} onClick={() => cancelModalHandler(pos.id)}>
                                    <Text fontSize="15px" color="red">
                                      Cancel
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
              )}
            </PageScroll>

            <Flex justifyContent="space-between">
              <HStack>
                <Badge colorScheme="cyan">
                  <Text color="secondary">Number of Records: {pO.posummary?.length}</Text>
                </Badge>
              </HStack>
              <Stack mt={2}>
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

            <Flex justifyContent="end">
              {isViewModalOpen && <ViewModal isOpen={isViewModalOpen} onClose={closeViewModal} viewData={viewData} />}

              {isEditModalOpen && (
                <EditModal
                  setActualGood={setActualGood}
                  actualGood={actualGood}
                  isOpen={isEditModalOpen}
                  onClose={closeEditModal}
                  editData={editData}
                  getAvailablePOHandler={getAvailablePOHandler}
                  setReceivingDate={setReceivingDate}
                  receivingDate={receivingDate}
                  setLotCategory={setLotCategory}
                  lotCategory={lotCategory}
                  disableQuantity={disableQuantity}
                  setDisableQuantity={setDisableQuantity}
                  receivingId={receivingId}
                  setReceivingId={setReceivingId}
                  unitPrice={unitPrice}
                  setUnitPrice={setUnitPrice}
                  fromYmir={editData.siNumber !== null}
                />
              )}

              {isCancelModalOpen && <CancelModal isOpen={isCancelModalOpen} onClose={closeCancelModal} poId={poId} getAvailablePOHandler={getAvailablePOHandler} />}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </WarehouseContext.Provider>
  );
};

export default WarehouseReceiving;

const ViewModal = ({ isOpen, onClose, viewData }) => {
  const displayData = {
    "PO Number": viewData?.poNumber,
    "Approved Date": moment(viewData?.poDate).format("MM/DD/YYYY"),
    "PR Number": viewData?.prNumber,
    "PR Date": moment(viewData?.prDate).format("MM/DD/YYYY"),
    "Supplier Name": viewData?.supplier,
  };

  return (
    <Flex>
      <Modal size="xl" isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <HStack>
                <Icon as={BsReceiptCutoff} w={8} h={8} />
                <Text fontSize="md" fontWeight="semibold">
                  PO Summary
                </Text>
              </HStack>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <Box>
              <VStack spacing={2} justifyContent="center" mt={5}>
                {Object.keys(displayData)?.map((key, i) => (
                  <Flex w="full" justifyContent="center" key={i}>
                    <Flex ml="15%" w="full">
                      <Flex>
                        <Text fontWeight="semibold" fontSize="md">
                          {key}:
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex w="full">
                      <Flex>
                        <Text fontWeight="normal" fontSize="md">
                          {displayData[key]}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ))}
                <Flex w="full"></Flex>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} fontSize="11px">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
