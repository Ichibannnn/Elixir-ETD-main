import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Tbody,
  Td,
  useToast,
  Select,
} from "@chakra-ui/react";
import { TiArrowSync } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";

import Swal from "sweetalert2";
import moment from "moment";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";

import PageScroll from "../../../utils/PageScroll";
import { Pagination, PaginationContainer, PaginationNext, PaginationPage, PaginationPageGroup, PaginationPrevious } from "@ajna/pagination";

import { ListOfErrors } from "./ListOfErrors";

export const ListOfSuppliers = ({
  fetchElixirSuppliers,
  elixirSuppliers,
  fistoSuppliers,
  fetchingData,
  currentPage,
  setCurrentPage,
  pagesCount,
  setPageSize,
  pages,
  search,
  setSearch,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [errorData, setErrorData] = useState([]);

  const toast = useToast();
  const currentUser = decodeUser();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    console.log("Input: ", inputValue);
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  const resultArray = fistoSuppliers?.result?.suppliers?.map((item) => {
    return {
      supplier_No: item?.id,
      supplierCode: item?.code,
      supplierName: item?.name,
      dateAdded: moment(new Date()).format("yyyy-MM-DD"),
      addedBy: currentUser.fullName,
      modifyDate: moment(new Date()).format("yyyy-MM-DD"),
      modifyBy: currentUser.fullName,
      syncDate: moment(new Date()).format("yyyy-MM-DD"),
    };
  });

  // console.log("Suppliers: ", resultArray);
  console.log("Fisto Supplier: ", fistoSuppliers);

  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these suppliers?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
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
        console.log("Result Array: ", resultArray);

        try {
          setIsLoading(true);
          const res = request
            .put(
              `Supplier/AddNewSupplier`,
              resultArray.map((item) => {
                return {
                  supplier_No: item?.supplier_No,
                  supplierCode: item?.supplierCode,
                  supplierName: item?.supplierName,
                  dateAdded: item?.dateAdded,
                  addedBy: item?.addedBy,
                  modifyDate: item?.modifyDate,
                  modifyBy: item?.modifyBy,
                  syncDate: item?.syncDate,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Suppliers Synced!", "success", toast);
              fetchElixirSuppliers();
              // fetchNotification();
              // onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                // onClose();
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  const filteredLength = elixirSuppliers?.supplier?.filter((val) => {
    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
    return val?.supplierName?.toLowerCase().match(newKeyword, "*");
  });

  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    setOrdersCount(0);
    if (elixirSuppliers?.supplier) {
      elixirSuppliers?.supplier?.map((supp) => {
        setOrdersCount((prevState) => prevState + 1);
      });
    }
  }, [elixirSuppliers]);

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <Flex color="fontColor" h="auto" w="full" flexDirection="column" p={2} bg="form">
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
          <HStack w="25%" mt={3}>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" children={<FiSearch bg="black" fontSize="18px" />} />

              <Input
                borderRadius="lg"
                fontSize="13px"
                type="text"
                border="1px"
                bg="#E9EBEC"
                placeholder="Search"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </InputGroup>
          </HStack>

          <HStack>
            <Button
              colorScheme="blue"
              size="sm"
              fontSize="13px"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<TiArrowSync fontSize="19px" />}
              onClick={() => syncHandler()}
            >
              Sync
            </Button>
          </HStack>
        </Flex>

        <Flex p={4}>
          <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
            <Text color="white" fontSize="13px" textAlign="center">
              LIST OF SUPPLIERS
            </Text>
          </VStack>
        </Flex>

        <Flex p={4}>
          <VStack w="100%" mt={-8}>
            <PageScroll minHeight="670px" maxHeight="740px">
              {fetchingData ? (
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
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table size="sm" border="none" boxShadow="md" bg="gray.200" variant="striped">
                  <Thead bg="secondary" position="sticky" top={0}>
                    <Tr h="30px">
                      <Th color="#D6D6D6" fontSize="10px">
                        ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Supplier No.
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Supplier Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Supplier Name
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Date Added
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Added By
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Sync Status
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {elixirSuppliers?.supplier
                      ?.filter((val) => {
                        const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                        return val?.supplierName?.toLowerCase().match(newKeyword, "*");
                      })
                      ?.map((supp, i) => (
                        <Tr key={i}>
                          <Td fontSize="12px">{i + 1}</Td>
                          <Td fontSize="12px">{supp.id}</Td>
                          <Td fontSize="12px">{supp.supplierCode}</Td>
                          <Td fontSize="12px">{supp.supplierName}</Td>
                          <Td fontSize="12px">{moment(supp.dateAdded).format("yyyy/MM/DD")}</Td>
                          <Td fontSize="12px">{supp.modifyBy}</Td>
                          <Td fontSize="12px">{supp.syncStatus}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>
          </VStack>
        </Flex>

        <Flex justifyContent="space-between">
          <HStack>
            <Badge colorScheme="cyan">
              <Text color="secondary">{!keyword ? `Number of records: ${ordersCount} ` : `Number of records from ${keyword}: ${filteredLength.length}`}</Text>
            </Badge>
          </HStack>
          <HStack>
            <Badge colorScheme="cyan">
              <Text color="primary" fontSize="12px">
                <Text color="primary" fontSize="12px">
                  {`Sync Date: ${moment(elixirSuppliers?.supplier?.syncDate).format("MM/DD/yyyy")}`}
                </Text>
              </Text>
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
                    <option value={Number(100)}>100</option>
                    <option value={Number(500)}>500</option>
                    <option value={Number(1000)}>1000</option>
                    <option value={Number(10000)}>10000</option>
                  </Select>
                </HStack>
              </PaginationContainer>
            </Pagination>
          </Stack>
        </Flex>

        {isOpen && (
          <ListOfErrors isOpen={isOpen} onOpen={onOpen} onClose={onClose} errorData={errorData} setErrorData={setErrorData} isLoading={isLoading} setIsLoading={setIsLoading} />
        )}
      </Flex>
    </Flex>
  );
};
