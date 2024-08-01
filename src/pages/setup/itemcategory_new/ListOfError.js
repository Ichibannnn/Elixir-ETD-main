import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiFileList3Fill } from "react-icons/ri";

import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import PageScrollImport from "../../../components/PageScrollImport";
import { ToastComponent } from "../../../components/Toast";

export const ListOfErrorItemCategory = ({ isOpen, onOpen, onClose, errorData, setErrorData, setIsLoading }) => {
  const toast = useToast();

  console.log(errorData);

  const duplicateList = errorData?.duplicateList?.map((list) => {
    return {
      itemCategory_No: list?.itemCategory_No,
      itemCategoryName: list?.itemCategoryName,
    };
  });

  const availableImport = errorData?.availableImport?.map((list) => {
    return {
      itemCategory_No: list?.itemCategory_No,
      itemCategoryName: list?.itemCategoryName,
    };
  });

  const availableUpdate = errorData?.availableUpdate?.map((list) => {
    return {
      itemCategory_No: list?.itemCategory_No,
      itemCategoryName: list?.itemCategoryName,
    };
  });

  const itemCategoryEmpty = errorData?.itemCategoryEmpty?.map((list) => {
    return {
      itemCategory_No: list?.itemCategory_No,
      itemCategoryName: list?.itemCategoryName,
    };
  });

  const filteredItemCategory = errorData?.availableImport?.map((list) => {
    return {
      itemCategory_No: list?.itemCategory_No,
      itemCategoryName: list?.itemCategoryName,
    };
  });

  const resultArray = filteredItemCategory?.map((list) => {
    return {
      itemCategory_No: list?.itemCategory_No,
      itemCategoryName: list?.itemCategoryName,
    };
  });

  const validationAvailableToSync = () => {
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
        try {
          const res = request
            .post(
              `Supplier/AddNewSupplier`,
              resultArray.map((item) => {
                return {
                  itemCategory_No: item?.itemCategory_No,
                  itemCategoryName: item?.itemCategoryName,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Item Category Synced!", "success", toast);
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
      <ModalContent color="white" bg="linear-gradient(rgba(0, 0, 0, 0.850),rgba(0, 0, 0, 3))">
        <ModalHeader>
          <Flex justifyContent="left">
            <Text fontSize="11px" color="white">
              Item Category were not synced due to the following reasons:
            </Text>
          </Flex>
        </ModalHeader>

        <ModalCloseButton onClick={onClose} />

        <PageScroll>
          <ModalBody>
            <Accordion allowToggle>
              {/* FILTERED ORDERS */}
              {filteredItemCategory?.length > 0 ? (
                <AccordionItem bgColor="blue.200">
                  <Flex>
                    <AccordionButton fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Available for syncing <Badge color="green">{filteredItemCategory?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll minHeight="500px" maxHeight="501px">
                      {filteredItemCategory ? (
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
                                Item Category Name
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {filteredItemCategory?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategory_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
                    {/* {filteredItemCategory ? (
                      <Flex justifyContent="end">
                        <Button
                          onClick={() => validationAvailableToSync()}
                          size="sm"
                          _hover={{ bgColor: "accent", color: "white" }}
                          colorScheme="blue"
                          isLoading={isLoading}
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
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Available Updates <Badge color="green">{availableUpdate?.length}</Badge>
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
                                Item Category Name
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
                                  {d?.itemCategory_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no update lists on this file</Text>
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
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Duplicated Lists <Badge color="red">{duplicateList?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll maxHeight="470px">
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
                                Item Category Name
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
                                  {d?.itemCategory_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* EMPTY ITEM CATEGORY */}
              {itemCategoryEmpty?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Duplicated Lists <Badge color="red">{itemCategoryEmpty?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll maxHeight="470px">
                      {itemCategoryEmpty ? (
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
                                Item Category Name
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemCategoryEmpty?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategory_No}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.itemCategoryName}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no record for Item Category.</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
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
