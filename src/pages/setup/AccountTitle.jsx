import { Box, Flex, HStack, Input, InputGroup, InputLeftElement, Select, Skeleton, Stack, Table, Tbody, Td, Text, Th, useToast, Thead, Tr, Button } from "@chakra-ui/react";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import { useState } from "react";
import { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import { MdOutlineSync } from "react-icons/md";

const AccountTitle = () => {
  const [accountTitle, setAccountTitle] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const [pageTotal, setPageTotal] = useState(undefined);

  const toast = useToast();

  const fetchAccountTitleApi = async (pageNumber, pageSize, search) => {
    const response = await request.get(`OneCharging/GetAccountTitle?PageNumber=${pageNumber}&PageSize=${pageSize}&UsePagination=true&status=true&search${search}`);

    return response.data;
  };

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 25 },
  });

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const getAccountTitleHandler = () => {
    setIsLoading(true);
    fetchAccountTitleApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setAccountTitle(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getAccountTitleHandler();

    return () => {
      setAccountTitle([]);
    };
  }, [currentPage, pageSize, search]);

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  const onSyncHandler = async () => {
    setIsLoadingSync(true);
    try {
      const res = await request.post("accountTitle/sync").then((res) => {
        ToastComponent("Success", "Account title synced sucessfully!", "success", toast);
        getAccountTitleHandler();
        setIsLoadingSync(false);
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <Flex color="fontColor" h="full" w="full" flexDirection="column" p={2} bg="form">
      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex justifyContent="space-between" alignItems="center">
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

            <HStack flexDirection="row">
              <Button size="sm" leftIcon={<MdOutlineSync />} colorScheme="blue" fontSize="13px" isLoading={isLoadingSync} loadingText="Syncing...." onClick={onSyncHandler}>
                Sync
              </Button>
            </HStack>
          </Flex>

          <Flex w="full" flexDirection="column">
            <Text textAlign="center" bgColor="primary" color="white" fontSize="14px">
              Account Title List
            </Text>
            <PageScroll maxHeight="750px">
              {isLoading ? (
                <Stack width="full">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table size="sm" width="full" border="none" boxShadow="md" bg="gray.200" variant="striped" className="inputUpperCase">
                  <Thead bg="primary" position="sticky" top={0} zIndex={1}>
                    <Tr>
                      <Th h="40px" color="white" fontSize="10px">
                        Sync ID
                      </Th>

                      <Th h="40px" color="white" fontSize="10px">
                        Account Code
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Account Title
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {accountTitle.oneChargingList?.map((item, i) => (
                      <Tr key={i}>
                        <Td fontSize="xs">{item.syncId}</Td>
                        <Td fontSize="xs">{item.accountCode}</Td>
                        <Td fontSize="xs">{item.accountDescription}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>

            <Flex justifyContent="space-between" mt={2}>
              <Box />

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
                        <option value={Number(25)}>25</option>
                        <option value={Number(50)}>50</option>
                        <option value={Number(75)}>75</option>
                        <option value={Number(100)}>100</option>
                      </Select>
                    </HStack>
                  </PaginationContainer>
                </Pagination>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AccountTitle;
