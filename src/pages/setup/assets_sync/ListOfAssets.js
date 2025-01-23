import {
  Badge,
  Box,
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
  DrawerFooter,
  FormLabel,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  Drawer,
  DrawerContent,
  Select,
  Spinner,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TiArrowSync } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";
import PageScroll from "../../../utils/PageScroll";
import { ToastComponent } from "../../../components/Toast";
import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import moment from "moment";
import { decodeUser } from "../../../services/decode-user";
import { AiOutlineMore, AiTwotoneEdit } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Pagination, PaginationContainer, PaginationNext, PaginationPage, PaginationPageGroup, PaginationPrevious } from "@ajna/pagination";
import { Select as AutoComplete } from "chakra-react-select";
import { FaTools } from "react-icons/fa";
import { ListOfErrorAssets } from "./ListOfErrorAssets";
import { MdOutlineSync } from "react-icons/md";
import { AddIcon } from "@chakra-ui/icons";

export const ListOfAssets = ({
  fetchElixirAssets,
  elixirAssets,
  genusAssets,
  fetchingData,
  currentPage,
  setCurrentPage,
  pagesCount,
  setPageSize,
  pages,
  search,
  setSearch,
  status,
  setStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [errorData, setErrorData] = useState([]);
  const [editData, setEditData] = useState([]);

  const toast = useToast();
  const currentUser = decodeUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  // ARRAY FOR THE LIST DATA OF SUPPLIERS
  const resultArray = genusAssets?.result?.map((item) => {
    return {
      assetNo: item?.id,
      asset_Code: item?.code,
      asset_Name: item?.name,
    };
  });

  console.log("GenusAsset: ", genusAssets);

  // SYNC ORDER BUTTON
  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync this list of Assets?",
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
      // console.log("Payload: ", resultArray);
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = request
            .post(
              `asset/sync-asset`,
              resultArray.map((item) => {
                return {
                  assetNo: item?.assetNo,
                  asset_Code: item?.asset_Code,
                  asset_Name: item?.asset_Name,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Asset Synced!", "success", toast);
              fetchElixirAssets();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  const filteredLength = elixirAssets?.asset?.filter((val) => {
    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
    return val?.assetName?.toLowerCase().match(newKeyword, "*");
  });

  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    setOrdersCount(0);
    if (elixirAssets?.asset) {
      elixirAssets?.asset?.map((cat) => {
        setOrdersCount((prevState) => prevState + 1);
      });
    }
  }, [elixirAssets]);

  const addActionHandler = (data) => {
    setEditData(data);
    openAdd();
  };

  const archiveActionHandler = (data) => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to archive this Asset?",
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
      console.log("Payload: ", resultArray);
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = request
            .patch(`asset/update-status/${data?.id}`)
            .then((res) => {
              ToastComponent("Success", "Asset Updated!", "success", toast);
              fetchElixirAssets();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            });
        } catch (error) {}
      }
    });
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  const statusHandler = (data) => {
    setStatus(data);
  };

  return (
    <Flex color="fontColor" h="auto" w="full" flexDirection="column" p={2} bg="form">
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center" w="100%" p={4} mt={3}>
          <HStack w="30%">
            <InputGroup size="md">
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

            <Text fontSize="12px">STATUS:</Text>

            <Select fontSize="12px" onChange={(e) => statusHandler(e.target.value)}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </Select>
          </HStack>

          <HStack gap={1}>
            <Button colorScheme="teal" size="sm" fontSize="13px" isLoading={isLoading} disabled={isLoading} leftIcon={<AddIcon fontSize="19px" />} onClick={() => openAdd()}>
              Add Asset
            </Button>

            {genusAssets?.result?.length ? (
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
            ) : (
              <Spinner size="md" emptyColor="gray.200" color="blue.500" />
            )}
          </HStack>
        </Flex>

        <Flex p={4}>
          <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
            <Text color="white" fontSize="13px" textAlign="center">
              LIST OF ASSETS
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
                  <Thead bg="secondary" position="sticky" top={0} zIndex={1}>
                    <Tr h="30px">
                      <Th color="#D6D6D6" fontSize="10px">
                        Line
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Asset Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Asset Name
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
                      <Th color="#D6D6D6" fontSize="10px">
                        Origin
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {elixirAssets?.asset
                      ?.filter((val) => {
                        const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                        return val?.assetName?.toLowerCase().match(newKeyword, "*");
                      })
                      ?.map((item, i) => (
                        <Tr key={i}>
                          <Td fontSize="12px">{i + 1}</Td>
                          <Td fontSize="12px">{item.id}</Td>
                          <Td fontSize="12px">{item.assetCode}</Td>
                          <Td fontSize="12px">{item.assetName}</Td>
                          <Td fontSize="12px">{moment(item.dateAdded).format("yyyy/MM/DD")}</Td>
                          <Td fontSize="12px">{item.addedBy}</Td>
                          <Td fontSize="12px">{item.statusSync ? item.statusSync : "-"}</Td>

                          <Td fontSize="12px">{item.assetNo === null ? "Manual" : "Syncing"}</Td>

                          {item.assetNo === null ? (
                            <Td fontSize="xs">
                              <Flex>
                                <Box>
                                  <Menu>
                                    <MenuButton>
                                      <AiOutlineMore fontSize="20px" />
                                    </MenuButton>
                                    <MenuList>
                                      <MenuItem icon={<AiTwotoneEdit fontSize="17px" />} onClick={() => addActionHandler(item)}>
                                        <Text fontSize="15px">Edit</Text>
                                      </MenuItem>

                                      <MenuItem icon={<AiTwotoneEdit fontSize="17px" />} onClick={() => archiveActionHandler(item)}>
                                        <Text fontSize="15px">Archive</Text>
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Box>
                              </Flex>

                              {/* <HStack spacing={3}>
                                <Button onClick={() => addActionHandler(item)} bg="none" size="xs">
                                  <AiTwotoneEdit fontSize="17px" />
                                </Button>
                              </HStack> */}
                            </Td>
                          ) : (
                            <Td fontSize="xs"></Td>
                          )}
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
                {`Sync Date: ${moment(elixirAssets?.asset?.syncDate).format("MM/DD/yyyy")}`}
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

        {isOpen && <ListOfErrorAssets isOpen={isOpen} onOpen={onOpen} onClose={onClose} errorData={errorData} setErrorData={setErrorData} fetchElixirAssets={fetchElixirAssets} />}

        {isAdd && (
          <AddModal
            isAdd={isAdd}
            closeAdd={closeAdd}
            editData={editData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setEditData={setEditData}
            fetchElixirAssets={fetchElixirAssets}
          />
        )}
      </Flex>
    </Flex>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.number(),
    asset_Code: yup.string().required("Code is required"),
    asset_Name: yup.string().required("Name is required"),
  }),
});

export const AddModal = ({ isAdd, closeAdd, editData, setEditData, fetchElixirAssets, isLoading, setIsLoading }) => {
  const toast = useToast();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        asset_Code: "",
        asset_Name: "",
      },
    },
  });

  const submitHandler = async (data) => {
    // console.log("data: ", data);

    if (editData.length === 0) {
      const addPayload = {
        asset_Code: data?.formData?.asset_Code,
        asset_Name: data?.formData?.asset_Name,
      };

      setIsLoading(true);
      try {
        const res = await request
          .post(`asset/manual`, addPayload)
          .then((res) => {
            ToastComponent("Success", "Updated material information", "success", toast);
            setIsLoading(false);
            setEditData([]);
            fetchElixirAssets();
            closeAdd();
          })
          .catch((error) => {
            ToastComponent("Update Failed", error.response.data, "warning", toast);
            fetchElixirAssets();
          });
      } catch (err) {}
    } else {
      const editPayload = {
        id: editData?.id,
        asset_Code: data?.formData?.asset_Code,
        asset_Name: data?.formData?.asset_Name,
      };

      setIsLoading(true);
      try {
        const res = await request
          .post(`asset/manual`, editPayload)
          .then((res) => {
            ToastComponent("Success", "Updated material information", "success", toast);
            setIsLoading(false);
            setEditData([]);
            fetchElixirAssets();
            closeAdd();
          })
          .catch((error) => {
            ToastComponent("Update Failed", error.response.data, "warning", toast);
            fetchElixirAssets();
          });
      } catch (err) {}
    }
  };

  console.log("EditData: ", editData);

  useEffect(() => {
    if (editData) {
      setValue(
        "formData",
        {
          id: editData?.id,
          asset_Code: editData?.assetCode,
          asset_Name: editData?.assetName,
        },
        { shouldValidate: true }
      );
    }
  }, [editData]);

  const closeActionHandler = () => {
    setEditData([]);
    closeAdd();
  };

  return (
    <>
      <Drawer isOpen={isAdd} placement="right" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Asset Form</DrawerHeader>
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Asset Code:</FormLabel>
                  <Input {...register("formData.asset_Code")} placeholder="Please enter Asset Code" autoComplete="off" />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.reasonName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Asset Name:</FormLabel>
                  <Input {...register("formData.asset_Name")} placeholder="Please enter Asset Name" autoComplete="off" />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.reasonName?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={closeActionHandler}>
                Cancel
              </Button>

              <Button type="submit" colorScheme="blue" isDisabled={!isValid} isLoading={isLoading}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
