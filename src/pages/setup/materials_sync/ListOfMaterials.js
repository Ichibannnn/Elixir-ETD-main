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
import { ListOfErrorsMaterials } from "./ListOfErrorsMaterials";
import { AiTwotoneEdit } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Pagination, PaginationContainer, PaginationNext, PaginationPage, PaginationPageGroup, PaginationPrevious } from "@ajna/pagination";
import { Select as AutoComplete } from "chakra-react-select";
import { FaTools } from "react-icons/fa";

export const ListOfMaterials = ({
  genusMaterials,
  fetchingData,
  fetchElixirMaterials,
  elixirMaterials,
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
  const [editData, setEditData] = useState([]);

  const toast = useToast();
  const currentUser = decodeUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isEdit, onClose: closeEdit, onOpen: openEdit } = useDisclosure();

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
  const resultArray = genusMaterials?.result?.map((item) => {
    return {
      material_No: item?.id,
      itemCode: item?.code,
      itemDescription: item?.name,
      itemCategoryName: item?.category?.name,
      uomCode: item?.uom?.code,
      bufferLevel: 0,
      dateAdded: moment(new Date()).format("yyyy-MM-DD"),
      addedBy: currentUser.fullName,
      modifyDate: moment(new Date()).format("yyyy-MM-DD"),
      modifyBy: currentUser.fullName,
      syncDate: moment(new Date()).format("yyyy-MM-DD"),
    };
  });

  // SYNC ORDER BUTTON
  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync this list of Materials?",
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
        try {
          setIsLoading(true);
          const res = request
            .put(
              `Material/SyncMaterial`,
              resultArray.map((item) => {
                return {
                  material_No: item?.material_No,
                  itemCode: item?.itemCode,
                  itemDescription: item?.itemDescription,
                  itemCategoryName: item?.itemCategoryName,
                  uomCode: item?.uomCode,
                  bufferLevel: item?.bufferLevel,
                  dateAdded: item?.dateAdded,
                  addedBy: item?.addedBy,
                  modifyDate: item?.modifyDate,
                  modifyBy: item?.modifyBy,
                  syncDate: item?.syncDate,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Materials Synced!", "success", toast);
              fetchElixirMaterials();
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

  const filteredLength = elixirMaterials?.materials?.filter((val) => {
    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
    return val?.itemCategoryName?.toLowerCase().match(newKeyword, "*");
  });

  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    setOrdersCount(0);
    if (elixirMaterials?.materials) {
      elixirMaterials?.materials?.map((cat) => {
        setOrdersCount((prevState) => prevState + 1);
      });
    }
  }, [elixirMaterials]);

  const editBufferHandler = (mats) => {
    setEditData(mats);
    openEdit();
  };

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
            {genusMaterials?.result?.length ? (
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
              LIST OF MATERIALS
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
                        Item Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Item Description
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Item Category
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        UOM
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Lot Section
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Buffer Level
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
                        Edit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elixirMaterials?.materials
                      ?.filter((val) => {
                        const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                        return val?.itemCategoryName?.toLowerCase().match(newKeyword, "*");
                      })
                      ?.map((mats, i) => (
                        <Tr key={i}>
                          <Td fontSize="12px">{i + 1}</Td>
                          <Td fontSize="12px">{mats.id}</Td>
                          <Td fontSize="12px">{mats.itemCode}</Td>
                          <Td fontSize="12px">{mats.itemDescription}</Td>
                          <Td fontSize="12px">{mats.itemCategoryName}</Td>
                          <Td fontSize="12px">{mats.uom}</Td>
                          <Td fontSize="12px">{mats.sectionName === null ? "-" : `${mats.sectionName}`}</Td>
                          <Td fontSize="12px">
                            {mats.bufferLevel.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigirts: 2,
                            })}
                          </Td>
                          <Td fontSize="12px">{moment(mats.dateAdded).format("yyyy/MM/DD")}</Td>
                          <Td fontSize="12px">{mats.addedBy}</Td>
                          <Td fontSize="12px">{mats.syncStatus}</Td>
                          <Td fontSize="xs">
                            <HStack spacing={3} justifyContent="center">
                              <Button onClick={() => editBufferHandler(mats)} bg="none" size="xs">
                                <AiTwotoneEdit fontSize="17px" />
                              </Button>
                            </HStack>
                          </Td>
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
                {`Sync Date: ${moment(elixirMaterials?.materials?.syncDate).format("MM/DD/yyyy")}`}
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
          <ListOfErrorsMaterials
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            errorData={errorData}
            setErrorData={setErrorData}
            setIsLoading={setIsLoading}
            fetchElixirMaterials={fetchElixirMaterials}
          />
        )}

        {isEdit && <EditModal isEdit={isEdit} closeEdit={closeEdit} editData={editData} fetchElixirMaterials={fetchElixirMaterials} />}
      </Flex>
    </Flex>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.number(),
    lotSectionId: yup.object(),
    bufferLevel: yup
      .number()
      .required("Buffer level is required")
      .typeError("Must be a number")
      .positive("Negative value is not valid")
      .integer()
      .min(0, "Buffer level must be equal or greater than 0"),
  }),
});

export const EditModal = ({ isEdit, closeEdit, editData, fetchElixirMaterials }) => {
  const toast = useToast();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [lotSection, setLotSection] = useState([]);

  const fetchLotSection = async () => {
    try {
      const res = await request.get("Lot/GetAllActiveLotNames");
      setLotSection(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchLotSection();
    } catch (error) {}
  }, []);

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
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        lotSectionId: "",
        bufferLevel: "",
      },
    },
  });

  const submitHandler = async (data) => {
    console.log("data: ", data);

    const payload = {
      id: data.formData?.id,
      bufferLevel: data?.formData?.bufferLevel,
      lotSectionId: data?.formData?.lotSectionId?.value?.id,
    };

    console.log("payyllloaddddd: ", payload);

    try {
      const res = await request
        .put(`Material/UpdateAsyncBufferLvl`, payload)
        .then((res) => {
          ToastComponent("Success", "Updated material information", "success", toast);
          fetchElixirMaterials();
          closeEdit();
        })
        .catch((error) => {
          ToastComponent("Update Failed", error.response.data, "warning", toast);
          fetchElixirMaterials();
        });
    } catch (err) {}
  };

  useEffect(() => {
    if (editData) {
      setValue(
        "formData",
        {
          id: editData?.id,
          bufferLevel: editData?.bufferLevel,
        },
        { shouldValidate: true }
      );

      setValue("formData.lotSectionId", {
        label: editData?.sectionName,
        value: {
          id: editData?.lotSectionId,
        },
      });
    }
  }, [editData]);

  return (
    <>
      <Drawer isOpen={isEdit} placement="right" onClose={onCloseDrawer}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Edit Material</DrawerHeader>
            <DrawerBody>
              <Stack spacing="7px">
                <Stack direction="row" gap={0.5}>
                  <FaTools fontSize="26px" />
                  <Text fontSize="16px" fontWeight="semibold">
                    {`${editData.itemCode} - ${editData.itemDescription}`}{" "}
                  </Text>
                </Stack>

                <Box mt={2}>
                  {/* <FormLabel>Lot Section:</FormLabel>
                  {lotSection.length > 0 ? (
                    <Select fontSize="md" {...register("formData.lotSectionId")} placeholder="Select Lot Name">
                      {lotSection.map((lotSection) => (
                        <option key={lotSection.id} value={lotSection.id}>
                          {lotSection.sectionName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    "loading"
                  )} */}

                  <FormLabel fontSize="sm">Lot Section</FormLabel>
                  <Controller
                    control={control}
                    name="formData.lotSectionId"
                    render={({ field }) => (
                      <AutoComplete
                        ref={field.ref}
                        value={field.value}
                        size="md"
                        placeholder="Select Lot Section"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        options={lotSection?.map((item) => {
                          return {
                            label: ` ${item.sectionName}`,
                            value: item,
                          };
                        })}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <FormLabel>Buffer Level:</FormLabel>
                  <Input {...register("formData.bufferLevel")} placeholder="Please enter Buffer Level" autoComplete="off" />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.bufferLevel?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={closeEdit}>
                Cancel
              </Button>

              <Button type="submit" colorScheme="blue" isDisabled={!isValid || watch("formData.lotSectionId")?.label === null}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
