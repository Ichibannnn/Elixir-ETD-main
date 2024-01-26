import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import React from "react";
import { RiFileList3Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import PageScrollImport from "../../../components/PageScrollImport";

export const ListOfErrorsMaterials = ({
  isOpen,
  onOpen,
  onClose,
  errorData,
  setErrorData,
  isLoading,
  setIsLoading,
  fetchElixirMaterials,
}) => {
  const toast = useToast();

  const duplicateList = errorData?.duplicateList?.map((list) => {
    return {
      material_No: list?.material_No,
      itemCode: list?.itemCode,
      itemDescription: list?.itemDescription,
      itemCategoryName: list?.itemCategoryName,
      uomCode: list?.uomCode,
      bufferLevel: list?.bufferLevel,
    };
  });

  const availableUpdate = errorData?.availableUpdate?.map((list) => {
    return {
      material_No: list?.material_No,
      itemCode: list?.itemCode,
      itemDescription: list?.itemDescription,
      itemCategoryName: list?.itemCategoryName,
      uomCode: list?.uomCode,
      bufferLevel: list?.bufferLevel,
    };
  });

  const itemCategoryNotExist = errorData?.itemCategoryNotExist?.map((list) => {
    return {
      material_No: list?.material_No,
      itemCode: list?.itemCode,
      itemDescription: list?.itemDescription,
      itemCategoryName: list?.itemCategoryName,
      uomCode: list?.uomCode,
      bufferLevel: list?.bufferLevel,
    };
  });

  const itemDescriptionEmpty = errorData?.itemDescriptionEmpty?.map((list) => {
    return {
      material_No: list?.material_No,
      itemCode: list?.itemCode,
      itemDescription: list?.itemDescription,
      itemCategoryName: list?.itemCategoryName,
      uomCode: list?.uomCode,
      bufferLevel: list?.bufferLevel,
    };
  });

  const uomNotExist = errorData?.uomNotExist?.map((list) => {
    return {
      material_No: list?.material_No,
      itemCode: list?.itemCode,
      itemDescription: list?.itemDescription,
      itemCategoryName: list?.itemCategoryName,
      uomCode: list?.uomCode,
      bufferLevel: list?.bufferLevel,
    };
  });

  const filteredMaterials = errorData?.availableImport?.map((list) => {
    return {
      material_No: list?.material_No,
      itemCode: list?.itemCode,
      itemDescription: list?.itemDescription,
      itemCategoryName: list?.itemCategoryName,
      uomCode: list?.uomCode,
      bufferLevel: list?.bufferLevel,
      dateAdded: moment(new Date()).format("yyyy-MM-DD"),
      addedBy: list?.addedBy,
      modifyDate: moment(new Date()).format("yyyy-MM-DD"),
      modifyBy: list?.modifyBy,
      syncDate: moment(new Date()).format("yyyy-MM-DD"),
      statusSync: list?.statusSync,
    };
  });

  const resultArray = filteredMaterials?.map((list) => {
    return {
      material_No: list?.material_No,
      itemCode: list?.itemCode,
      itemDescription: list?.itemDescription,
      itemCategoryName: list?.itemCategoryName,
      uomCode: list?.uomCode,
      bufferLevel: list?.bufferLevel,
      dateAdded: list?.dateAdded,
      addedBy: list?.addedBy,
      modifyDate: list?.modifyDate,
      modifyBy: list?.modifyBy,
      syncDate: list?.syncDate,
      statusSync: list?.statusSync,
    };
  });

  const validationAvailableToSync = () => {
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
        setIsLoading(true);
        console.log("Result Array: ", resultArray);
        try {
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
                  statusSync: item?.statusSync,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Materials Synced!", "success", toast);
              fetchElixirMaterials();
              onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                onClose();
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent
        color="white"
        bg="linear-gradient(rgba(0, 0, 0, 0.850),rgba(0, 0, 0, 3))"
      >
        <ModalHeader>
          <Flex justifyContent="left">
            <Text fontSize="11px" color="white">
              Materials were not synced due to the following reasons:
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <PageScroll>
          <ModalBody>
            <Accordion allowToggle>
              {/* FILTERED MATERIALS */}
              {filteredMaterials?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        Available for syncing{" "}
                        <Badge color="green">{filteredMaterials?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll minHeight="500px" maxHeight="501px">
                      {filteredMaterials ? (
                        <Table variant="striped" size="sm" bg="form">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {filteredMaterials?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.material_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no available lists on this file
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
                    {/* {filteredMaterials ? (
                      <Flex justifyContent="end" mt={2}>
                        <Button
                          onClick={() => validationAvailableToSync()}
                          size="sm"
                          _hover={{ bgColor: "accent", color: "white" }}
                          colorScheme="blue"
                          isLoading={isLoading}
                          isDisabled={
                            duplicateList ||
                            availableUpdate ||
                            uomNotExist ||
                            itemCategoryNotExist ||
                            itemDescriptionEmpty
                          }
                          title={
                            duplicateList ||
                            availableUpdate ||
                            uomNotExist ||
                            itemCategoryNotExist ||
                            itemDescriptionEmpty
                              ? `Check the following errors`
                              : ""
                          }
                        >
                          Sync
                        </Button>
                      </Flex>
                    ) : (
                      ""
                    )} */}
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* AVAILABLE UPDATES */}
              {availableUpdate?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        Available Updates{" "}
                        <Badge color="green">{availableUpdate?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {availableUpdate ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {availableUpdate?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.material_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no update lists on this file
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* DUPLICATED LIST */}
              {duplicateList?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        Duplicated Lists{" "}
                        <Badge color="red">{duplicateList?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {duplicateList ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {duplicateList?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.material_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no duplicated lists on this file
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* ITEM DESCRIPTION EMPTY */}
              {itemDescriptionEmpty?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        Empty Item Description{" "}
                        <Badge color="red">
                          {itemDescriptionEmpty?.length}
                        </Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {itemDescriptionEmpty ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemDescriptionEmpty?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.material_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no records for empty item descriptions.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* ITEM CATEGORY NOT EXIST */}
              {itemCategoryNotExist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        Item Category does not exist{" "}
                        <Badge color="red">
                          {itemCategoryNotExist?.length}
                        </Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {itemCategoryNotExist ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemCategoryNotExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.material_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no records for item category not exist
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* UOM NOT EXIST */}
              {uomNotExist?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box
                        flex="1"
                        textAlign="left"
                        color="black"
                        fontSize="13px"
                        fontWeight="semibold"
                      >
                        UOM does not exist{" "}
                        <Badge color="red">{uomNotExist?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {uomNotExist ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white" fontSize="9px">
                                Line
                              </Th>
                              <Th color="white" fontSize="9px">
                                ID
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Description
                              </Th>
                              <Th color="white" fontSize="9px">
                                Item Category
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {uomNotExist?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.material_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemDescription}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">
                              There are no record for uom not exist.
                            </Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}
            </Accordion>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </PageScroll>
      </ModalContent>
    </Modal>
  );
};
