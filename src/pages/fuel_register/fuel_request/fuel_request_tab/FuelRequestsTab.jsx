import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
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
  VStack,
} from "@chakra-ui/react";
import { FaGasPump, FaSearch, FaUser } from "react-icons/fa";
import { Pagination, usePagination, PaginationNext, PaginationPage, PaginationPrevious, PaginationContainer, PaginationPageGroup } from "@ajna/pagination";
import PageScroll from "../../../../utils/PageScroll";
import request from "../../../../services/ApiClient";
import moment from "moment/moment";
import { decodeUser } from "../../../../services/decode-user";
import { GiCancel, GiFuelTank } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { AiOutlineMore } from "react-icons/ai";
import { AddModal, CancelRequestModal, EditModal, ViewModal } from "./ActionButtonModal";
import { IoAdd, IoSave } from "react-icons/io5";
import { MdOutlineCancel, MdOutlineEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../../components/Toast";

import addRequest from "../../../../../src/assets/svg/addRequest.svg";
import { BiUser } from "react-icons/bi";

const currentUser = decodeUser();
const userId = currentUser?.id;

const fetchFuelRequestApi = async (pageNumber, pageSize, search) => {
  const res = await request.get(`FuelRegister/page?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}&Status=For%20Approval`);
  return res.data;
};

const FuelRequestsTab = () => {
  const [requestFuelData, setRequestFuelData] = useState([]);
  const [getData, setGetData] = useState(null);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [fuelInfo, setFuelInfo] = useState({
    warehouseId: "",
    item_Code: "DIESEL",
    item_Description: "DIESEL",
    soh: "",
    unit_Cost: "",
    liters: "",
    odometer: "",
    remarks: "",
    asset: "",
  });

  const toast = useToast();
  const { isOpen: isCreate, onClose: closeCreate, onOpen: openCreate } = useDisclosure();
  const { isOpen: isEdit, onClose: closeEdit, onOpen: openEdit } = useDisclosure();
  const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure();
  const { isOpen: isCancel, onClose: closeCancel, onOpen: openCancel } = useDisclosure();

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

  const fetchFuelRequest = () => {
    fetchFuelRequestApi(currentPage, pageSize, search).then((res) => {
      setRequestFuelData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchFuelRequest();
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

  const editHandler = (data) => {
    setGetData(data);
    openEdit();
  };

  const cancelHandler = (data) => {
    setGetData(data);
    openCancel();
  };

  const createHandler = () => {
    openCreate();
  };

  const onTransactAction = () => {
    const transactPayload = requestFuelData?.fuel?.map((item) => ({
      id: item?.id,
    }));

    console.log("transactPayload: ", transactPayload);

    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to transact this request?",
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
        try {
          setIsLoading(true);
          const res = request
            .put("FuelRegister/approve", transactPayload)
            .then((res) => {
              fetchFuelRequest();
              ToastComponent("Success!", "Transact fuel successfully", "success", toast);
              setIsLoading(false);
            })
            .catch((err) => {
              ToastComponent("Error!", err.response.data, "error", toast);
              setIsLoading(false);
            });
        } catch (err) {
          ToastComponent("Error!", "Check error.", "error", toast);
        }
      }
    });
  };

  const onCancelAction = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`FuelRegister/cancel/${requestFuelData?.fuel?.[0].id}`)
        .then((res) => {
          fetchFuelRequest();
          ToastComponent("Success", "Item has been cancelled", "success", toast);
          setFuelInfo({
            item_Code: "DIESEL",
            item_Description: "DIESEL",
            soh: "",
            unit_Cost: "",
            liters: "",
            odometer: "",
            remarks: "",
            asset: "",
          });
          setIsLoading(false);
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  console.log("Request Data: ", requestFuelData);

  return (
    <Flex w="100%" height="100%" flexDirection="column" p={5} border="2px" borderWidth="5px" borderColor="#1B1C1D">
      {requestFuelData?.fuel?.length ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center" direction="column">
          <VStack gap={-1}>
            <img src={addRequest} alt="No Records Found" className="add-request" />
            <Stack mb={2}>
              <Text marginLeft={2} fontStyle="italic" color="#A0AEC0" fontSize="15px">
                Create a new fuel request
              </Text>
            </Stack>
          </VStack>

          <VStack mt={4}>
            <Button
              type="submit"
              variant="solid"
              leftIcon={<IoAdd fontSize="19px" />}
              colorScheme="blue"
              fontSize="12px"
              size="lg"
              isLoading={isLoading}
              isDisabled={requestFuelData?.fuel?.length}
              onClick={() => createHandler()}
            >
              Create Request
            </Button>
          </VStack>
        </Flex>
      ) : (
        <Flex padding={6} w="full" flexDirection="column">
          <Stack w="full" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize="1.5rem" fontWeight="500" lineHeight="1.2" color="#0A8FD4">
              Fuel Summary
            </Text>

            <Image boxSize="70px" objectFit="fill" src="/images/elixirlogos.png" alt="etheriumlogo" />
          </Stack>

          <Stack w="full" flexDirection="column" mt={10} spacing={2}>
            {/* Requestor Details */}
            <Stack mb={2} flexDirection="row" gap={1} alignItems="center">
              <FaUser color="#0A8FD4" />
              <Text fontSize="1.2rem" fontWeight="500" lineHeight="1.1" color="#0A8FD4">
                Requestor Details:
              </Text>
            </Stack>

            <Stack width="full" flexDirection="row">
              <VStack width="50%">
                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      ID:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      ID-00001
                    </Text>
                  </Box>
                </Stack>

                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Requestor:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      RDFFLFI-10920, PANGILINAN, GIB IBANSON
                    </Text>
                  </Box>
                </Stack>

                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Remarks:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      FULL TANK - PAMPANGA TO MANILA
                    </Text>
                  </Box>
                </Stack>

                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Odometer:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      1001010011
                    </Text>
                  </Box>
                </Stack>
              </VStack>

              <VStack width="50%">
                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Company:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Fresh Options
                    </Text>
                  </Box>
                </Stack>

                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Department:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Fresh Options
                    </Text>
                  </Box>
                </Stack>

                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Location:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Fresh Options
                    </Text>
                  </Box>
                </Stack>

                <Stack direction="row" width="full">
                  <Box width="15%">
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Account Title:
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="500" lineHeight="1.57">
                      Fresh Options
                    </Text>
                  </Box>
                </Stack>
              </VStack>
            </Stack>

            {/* Fuel Details */}
            <Stack mt={16} flexDirection="row" gap={1} alignItems="center">
              <FaGasPump color="#0A8FD4" />
              <Text fontSize="1.2rem" fontWeight="500" lineHeight="1.1" color="#0A8FD4">
                Fuel Details:
              </Text>
            </Stack>

            <Stack width="full" flexDirection="row">
              <PageScroll minHeight="250px" maxHeight="251px">
                <Table variant="striped" size="lg">
                  <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
                    <Tr>
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
                      <Th h="20px" color="white" fontSize="10px">
                        REQUESTED DATE
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td fontSize="xs">ELIXIR ETD</Td>
                      <Td fontSize="xs">ITEM0001</Td>
                      <Td fontSize="xs">ITEM SAMPLE</Td>
                      <Td fontSize="xs">LITER</Td>
                      <Td fontSize="xs">1,000.00</Td>
                      <Td fontSize="xs">Z-AAABBBBCCC</Td>
                      <Td fontSize="xs">100.00</Td>
                      <Td fontSize="xs">01/01/2024</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </PageScroll>

              {/* <PageScroll minHeight="400px" maxHeight="701px">
          <Table variant="striped">
            <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
              <Tr>
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
                  REMARKS
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  ODOMETER
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  REQUESTED DATE
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {requestFuelData?.fuel?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">
                    {item.source}
                    </Td>
                  <Td fontSize="xs">
                    {item.item_Code}
                    </Td>
                  <Td fontSize="xs">
                    {item.item_Description}
                    </Td>
                  <Td fontSize="xs">
                    {item.uom}
                    </Td>
                  <Td fontSize="xs">
                    {item.liters.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    
                    {item.asset}
                    </Td>

                  <Td fontSize="xs">

                    {item.unit_Cost.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>

                  <Td fontSize="xs">
                    {item.remarks}
                    </Td>

                  <Td fontSize="xs">
                    {item.odometer
                      ? item.odometer.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : "-"}
                  </Td>

                  <Td fontSize="xs">
                    {moment(item.created_At).format("MM/DD/yyyy")}
                    </Td>


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

                            <MenuItem icon={<GiCancel fontSize="17px" color="red" />} onClick={() => cancelHandler(item)}>
                              <Text fontSize="15px" color="red" _hover={{ color: "red" }}>
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
        </PageScroll> */}
            </Stack>

            <Stack width="full" justifyContent="space-between" flexDirection="row" mt={8}>
              <Stack />

              <Stack flexDirection="row">
                <Button
                  type="submit"
                  leftIcon={<IoSave fontSize="19px" />}
                  colorScheme="facebook"
                  borderRadius="none"
                  fontSize="12px"
                  isLoading={isLoading}
                  onClick={() => onTransactAction()}
                >
                  Transact Request
                </Button>

                <Button
                  type="submit"
                  leftIcon={<MdOutlineCancel fontSize="19px" />}
                  colorScheme="red"
                  borderRadius="none"
                  fontSize="12px"
                  isLoading={isLoading}
                  onClick={() => onCancelAction()}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Flex>
      )}

      {/* <Flex justifyContent="space-between" align="end">
        <Box />

        <Box gap={1}>
          <Button
            type="submit"
            leftIcon={<IoAdd fontSize="19px" />}
            colorScheme="teal"
            borderRadius="none"
            fontSize="12px"
            size="sm"
            isLoading={isLoading}
            isDisabled={requestFuelData?.fuel?.length}
            onClick={() => createHandler()}
          >
            Create Request
          </Button>

          <Button
            type="submit"
            leftIcon={<IoSave fontSize="19px" />}
            colorScheme="facebook"
            borderRadius="none"
            fontSize="12px"
            size="sm"
            isLoading={isLoading}
            isDisabled={!requestFuelData?.fuel?.length}
            onClick={() => onTransactAction()}
          >
            Transact Request
          </Button>
        </Box>
      </Flex>

      <Flex flexDirection="column">
        <Box w="full" bgColor="primary" h="22px">
          <Text fontWeight="normal" fontSize="13px" color="white" textAlign="center" justifyContent="center">
            List of Fuel Requests
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
              {requestFuelData?.fuel?.map((item, i) => (
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
                    {" "}
                    {item.unit_Cost.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">{item.remarks}</Td>
                  <Td fontSize="xs">
                    {item.odometer
                      ? item.odometer.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : "-"}
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

                            <MenuItem icon={<GiCancel fontSize="17px" color="red" />} onClick={() => cancelHandler(item)}>
                              <Text fontSize="15px" color="red" _hover={{ color: "red" }}>
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
        </PageScroll>
      </Flex> */}

      {isView && <ViewModal isOpen={isView} onClose={closeView} data={getData} />}

      {isCancel && (
        <CancelRequestModal
          data={getData}
          isOpen={isCancel}
          onClose={closeCancel}
          fetchFuelRequest={fetchFuelRequest}
          setFuelInfo={setFuelInfo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      {isCreate && <AddModal isOpen={isCreate} onClose={closeCreate} fuelInfo={fuelInfo} setFuelInfo={setFuelInfo} fetchFuelRequest={fetchFuelRequest} />}
      {isEdit && <EditModal data={getData} isOpen={isEdit} onClose={closeEdit} fuelInfo={fuelInfo} setFuelInfo={setFuelInfo} fetchFuelRequest={fetchFuelRequest} />}
    </Flex>
  );
};

export default FuelRequestsTab;
