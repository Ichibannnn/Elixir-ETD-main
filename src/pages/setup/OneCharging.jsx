import { Box, Flex, HStack, Input, InputGroup, InputLeftElement, Select, Skeleton, Stack, Table, Tbody, Td, Text, Th, useToast, Thead, Tr, Button } from "@chakra-ui/react";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import { useState } from "react";
import { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import request from "../../services/ApiClient";
import PageScroll from "../../utils/PageScroll";
import { ToastComponent } from "../../components/Toast";
import { MdOutlineSync } from "react-icons/md";

const OneCharging = () => {
  const [oneCharging, setOneCharging] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const [pageTotal, setPageTotal] = useState(undefined);

  const toast = useToast();

  const fetchOneChargingApi = async (pageNumber, pageSize, search) => {
    const response = await request.get(`OneCharging/GetOneCharging?PageNumber=${pageNumber}&PageSize=${pageSize}&UsePagination=true&status=true&search=${search}`);

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

  const getOneChargingHandler = () => {
    setIsLoading(true);
    fetchOneChargingApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setOneCharging(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getOneChargingHandler();

    return () => {
      setOneCharging([]);
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
      const res = await request.post("charging/sync").then((res) => {
        ToastComponent("Success", "One charging synced sucessfully!", "success", toast);
        getOneChargingHandler();
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
              One Charging List
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
                        Code
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Name
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Company
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Business Unit
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Department
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Unit
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Sub Unit
                      </Th>
                      <Th h="40px" color="white" fontSize="10px">
                        Location
                      </Th>
                      1
                    </Tr>
                  </Thead>
                  <Tbody>
                    {oneCharging.oneChargingList?.map((item, i) => (
                      <Tr key={i}>
                        <Td fontSize="xs">{item.sync_id}</Td>
                        <Td fontSize="xs">{item.code}</Td>
                        <Td fontSize="xs">{item.name}</Td>
                        <Td fontSize="xs">
                          {item.company_code} - {item.company_name}
                        </Td>
                        <Td fontSize="xs">
                          {item.business_unit_code} - {item.business_unit_code}
                        </Td>
                        <Td fontSize="xs">
                          {item.department_code} - {item.department_name}
                        </Td>
                        <Td fontSize="xs">
                          {item.department_unit_code} - {item.department_unit_name}
                        </Td>
                        <Td fontSize="xs">
                          {item.sub_unit_code} - {item.sub_unit_name}
                        </Td>
                        <Td fontSize="xs">
                          {item.location_code} - {item.location_name}
                        </Td>
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

export default OneCharging;
