import React, { useEffect, useState } from "react";
import {
  Box,
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
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import PageScroll from "../../../../utils/PageScroll";
import request from "../../../../services/ApiClient";
import moment from "moment/moment";
import { GrView } from "react-icons/gr";
import { AiOutlineMore } from "react-icons/ai";
import { MdPrint } from "react-icons/md";
import { PrintModal, ViewModal } from "./ActionButtonModal";

const fetchFuelApproveApi = async (pageNumber, pageSize, search) => {
  const res = await request.get(`FuelRegister/page?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}&Status=Transacted`);
  return res.data;
};

const ApproverApprovedTab = () => {
  const [fuelData, setFuelData] = useState([]);
  const [getData, setGetData] = useState(null);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");

  const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure();
  const { isOpen: isPrint, onClose: closePrint, onOpen: openPrint } = useDisclosure();

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

  const fetchFuelApprove = () => {
    fetchFuelApproveApi(currentPage, pageSize, search).then((res) => {
      setFuelData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchFuelApprove();
  }, [pageSize, currentPage, search]);

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

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  const viewHandler = (data) => {
    setGetData(data);
    openView();
  };

  const printHandler = (data) => {
    setGetData(data);
    openPrint();
  };

  return (
    <Flex justifyContent="center" flexDirection="column" mb="150px" w="full" p={5}>
      <Flex justifyContent="space-between" align="end">
        <InputGroup w="15%">
          <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
          <Input onChange={(e) => searchHandler(e.target.value)} type="text" fontSize="xs" placeholder="Search" focusBorderColor="accent" />
        </InputGroup>
      </Flex>

      <Flex flexDirection="column" mt={2}>
        <Box w="full" bgColor="primary" h="22px">
          <Text fontWeight="normal" fontSize="13px" color="white" textAlign="center" justifyContent="center">
            List of Transacted Fuels
          </Text>
        </Box>
        <PageScroll minHeight="400px" maxHeight="701px">
          <Table variant="striped">
            <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th h="20px" color="white" fontSize="10px">
                  ID
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  SOURCE
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  ITEM CODE
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  ITEM DESCRIPTION
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  UOM
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  LITERS
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  ASSET
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  UNIT COST
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  REQUESTOR
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  REMARKS
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  ODOMETER
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  REQUESTED DATE
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  ACTION
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {fuelData?.fuel?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.id}</Td>
                  <Td fontSize="xs">{item.source}</Td>
                  <Td fontSize="xs">{item.item_Code}</Td>
                  <Td fontSize="xs">{item.item_Description}</Td>
                  <Td fontSize="xs">{item.uom}</Td>
                  <Td fontSize="xs">
                    {item.liters.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">{item.asset}</Td>

                  <Td fontSize="xs">
                    {item.unit_Cost.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">{item.requestorName}</Td>
                  <Td fontSize="xs">{item.remarks}</Td>
                  <Td fontSize="xs">
                    {item.odometer
                      ? item.odometer.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : "N/A"}
                  </Td>
                  <Td fontSize="xs">{moment(item.created_At).format("MM/DD/yyyy")}</Td>

                  <Td fontSize="xs" mr={3}>
                    <Flex justifyContent="center">
                      <Box>
                        <Menu>
                          <MenuButton alignItems="center" justifyContent="center" bg="none">
                            <AiOutlineMore fontSize="20px" />
                          </MenuButton>

                          <MenuList>
                            <MenuItem icon={<GrView fontSize="17px" />} onClick={() => viewHandler(item)}>
                              <Text fontSize="15px">View</Text>
                            </MenuItem>

                            <MenuItem icon={<MdPrint fontSize="17px" color="green" />} onClick={() => printHandler(item)}>
                              <Text fontSize="15px" color="green" _hover={{ color: "green" }}>
                                Print
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

      <Flex mt={1} justifyContent="end">
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

      {isView && <ViewModal isOpen={isView} onClose={closeView} data={getData} />}
      {isPrint && <PrintModal isOpen={isPrint} onClose={closePrint} data={getData} />}
    </Flex>
  );
};

export default ApproverApprovedTab;
