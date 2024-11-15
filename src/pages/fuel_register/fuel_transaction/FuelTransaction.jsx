import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
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
  VStack,
} from "@chakra-ui/react";

import moment from "moment";
import request from "../../../services/ApiClient";

import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import { FiSearch } from "react-icons/fi";
import PageScroll from "../../../utils/PageScroll";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";
import { ViewModal } from "./ActionButtonModal";

const FuelTransaction = () => {
  const [fuelTransactions, setFuelTransactions] = useState([]);
  const [getFuelData, setGetFuelData] = useState("");
  const [status, setStatus] = useState("For Transaction");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [selectedIds, setSelectedIds] = useState([]);

  const toast = useToast();

  const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure();

  const fetchFuelTransactionApi = async (pageNumber, pageSize, status, search) => {
    const res = await request.get(`FuelRegister/page?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}&Status=${status}`);
    return res.data;
  };

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

  const fetchFuelTransaction = () => {
    setIsLoading(true);
    fetchFuelTransactionApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setFuelTransactions(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchFuelTransaction();

    return () => {
      setFuelTransactions([]);
    };
  }, [currentPage, pageSize, status, search]);

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    console.log(inputValue);
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  const handleSelectAllId = (event) => {
    if (event.target.checked) {
      const allIds = fuelTransactions?.fuel?.map((item) => item.id) || [];
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectTicket = (item) => {
    setSelectedIds((prevSelected) => (prevSelected.includes(item) ? prevSelected.filter((id) => id !== item) : [...prevSelected, item]));
  };

  useEffect(() => {
    if (fuelTransactions?.fuel) {
      const allIds = fuelTransactions?.fuel.map((item) => item.id);
      if (selectedIds.length > allIds.length) {
        setSelectedIds(allIds);
      }
    }
  }, [fuelTransactions, selectedIds]);

  const onSubmitHandler = () => {
    const payload = selectedIds?.map((item) => ({
      id: item,
    }));

    Swal.fire({
      title: "Confirmation!",
      text: "Transact this fuel request?",
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
        setIsLoading(true);
        try {
          const res = request
            .put(`FuelRegister/transact`, payload)
            .then((res) => {
              ToastComponent("Success", "Fuel transacted successfully", "success", toast);
              setIsLoading(false);
              setSelectedIds([]);
              fetchFuelTransaction();
            })
            .catch((err) => {
              ToastComponent("Error", "Transaction failed", "error", toast);
              setIsLoading(false);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  const viewHandler = (data) => {
    setGetFuelData(data);
    openView();
  };

  return (
    <>
      <Flex w="full" flexDirection="column" bg="form" mt={5} pl={2} pr={2}>
        <Flex justifyContent="space-between" w="full">
          <HStack w="full" justifyContent="space-between" gap={2} mt={5} pl={5} pr={5}>
            <HStack alignItems="center" justifyContent="center">
              <Text fontSize="xs">Status:</Text>
              <Select fontSize="xs" onChange={(e) => setStatus(e.target.value)}>
                <option value={"For Transaction"}>For Transaction</option>
                <option value={"Transacted"}>Transacted</option>
              </Select>

              <HStack justifyContent="end">
                <Button size="sm" colorScheme="blue" borderRadius="none" isDisabled={!selectedIds.length} onClick={onSubmitHandler}>
                  Transact Fuel
                </Button>
              </HStack>
            </HStack>

            <HStack>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none" children={<FiSearch color="gray.300" fontSize="18px" />} />
                <Input
                  borderRadius="lg"
                  fontSize="13px"
                  type="text"
                  border="1px"
                  focusBorderColor="btnColor"
                  placeholder="Search"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  onChange={(e) => searchHandler(e.target.value)}
                />
              </InputGroup>
            </HStack>
          </HStack>
        </Flex>

        <Flex minHeight="690px" w="full" flexDirection="column" gap={1} pr={5} pl={5}>
          <Text pb={2} textAlign="center" fontSize="md" color="white" bgColor="primary" w="full" mb={-1.5}>
            List of Fuel for Transaction
          </Text>
          <PageScroll minHeight="590px" maxHeight="670px">
            {isLoading ? (
              <Stack width="full">
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
              </Stack>
            ) : (
              <Table size="md" width="full" className="inputUpperCase">
                <Thead bg="primary" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th color="white" fontSize="10px">
                      <Checkbox
                        fontSize="10px"
                        onChange={handleSelectAllId}
                        isChecked={selectedIds.length === (fuelTransactions?.fuel?.length || 0) && selectedIds.length > 0}
                        isDisabled={status === "Transacted"}
                        title={status === "Transacted" ? "Fuel already transacted" : ""}
                        color="white"
                      >
                        <Text fontSize="xs">LINE</Text>
                      </Checkbox>
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      ID
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      SOURCE
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      ITEM CODE
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      ITEM DESCRIPTION
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      UOM
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      LITERS
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      ASSET
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      UNIT COST
                    </Th>
                    <Th h="40px" color="white" fontSize="10px" textAlign="center">
                      DRIVER
                    </Th>
                    <Th h="40px" color="white" fontSize="10px" textAlign="center">
                      REMARKS
                    </Th>
                    <Th h="40px" color="white" fontSize="10px" textAlign="center">
                      ODOMETER
                    </Th>
                    <Th h="40px" color="white" fontSize="10px" textAlign="center">
                      REQUESTED DATE
                    </Th>
                    <Th h="40px" color="white" fontSize="10px" textAlign="center">
                      ACTION
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fuelTransactions?.fuel?.map((item, i) => (
                    <Tr key={i}>
                      <Td>
                        <Checkbox
                          onChange={() => handleSelectTicket(item.id)}
                          isChecked={selectedIds.includes(item.id)}
                          color="black"
                          isDisabled={status === "Transacted"}
                          title={status === "Transacted" ? "Fuel already transacted" : ""}
                        >
                          <Text fontSize="xs">{i + 1}</Text>
                        </Checkbox>
                      </Td>
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
                      <Td fontSize="xs">{item.driver}</Td>
                      <Td fontSize="xs">{item.remarks}</Td>
                      <Td fontSize="xs">
                        {item.odometer
                          ? item.odometer.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })
                          : "-"}
                      </Td>
                      <Td fontSize="xs">{moment(item.created_At).format("MM/DD/yyyy")}</Td>
                      <Td fontSize="xs">
                        <Button size="xs" borderRadius="none" colorScheme="blue" onClick={() => viewHandler(item)}>
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </PageScroll>

          <Flex justifyContent="space-between">
            <Stack />
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
        </Flex>
      </Flex>

      {isView && <ViewModal isOpen={isView} onClose={closeView} data={getFuelData} />}
    </>
  );
};

export default FuelTransaction;
