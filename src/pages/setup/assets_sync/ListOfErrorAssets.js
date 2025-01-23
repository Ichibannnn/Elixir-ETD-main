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
import moment from "moment";
import React from "react";
import { RiFileList3Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";
import request from "../../../services/ApiClient";
import PageScrollImport from "../../../components/PageScrollImport";
import PageScroll from "../../../utils/PageScroll";

export const ListOfErrorAssets = ({ isOpen, onOpen, onClose, errorData, setErrorData, setIsLoading }) => {
  const toast = useToast();

  const duplicateList = errorData?.duplicateList?.map((list) => {
    return {
      uomNo: list?.uomNo,
      uomCode: list?.uomCode,
      uomDescription: list?.uomDescription,
    };
  });

  const availableUpdate = errorData?.availableUpdate?.map((list) => {
    return {
      uomNo: list?.uomNo,
      uomCode: list?.uomCode,
      uomDescription: list?.uomDescription,
    };
  });

  const uomDescriptionEmpty = errorData?.uomDescriptionEmpty?.map((list) => {
    return {
      uomNo: list?.uomNo,
      uomCode: list?.uomCode,
      uomDescription: list?.uomDescription,
    };
  });

  const uomCodeEmpty = errorData?.uomCodeEmpty?.map((list) => {
    return {
      uomNo: list?.uomNo,
      uomCode: list?.uomCode,
      uomDescription: list?.uomDescription,
    };
  });

  const filteredUom = errorData?.availableImport?.map((list) => {
    return {
      uomNo: list?.uomNo,
      uomCode: list?.uomCode,
      uomDescription: list?.uomDescription,
      dateAdded: moment(new Date()).format("yyyy-MM-DD"),
      addedBy: list?.addedBy,
      modifyDate: moment(new Date()).format("yyyy-MM-DD"),
      modifyBy: list?.modifyBy,
      syncDate: moment(new Date()).format("yyyy-MM-DD"),
      statusSync: list?.statusSync,
    };
  });

  const resultArray = filteredUom?.map((list) => {
    return {
      uomNo: list?.uomNo,
      uomCode: list?.uomCode,
      uomDescription: list?.uomDescription,
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
      text: "Are you sure you want to sync this list of UOM?",
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
              `Uom/SyncUom`,
              resultArray.map((item) => {
                return {
                  uomNo: item?.uomNo,
                  uomCode: item?.uomCode,
                  uomDescription: item?.uomDescription,
                  itemCategoryName: item?.itemCategoryName,
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
              ToastComponent("Success", "UOM Synced!", "success", toast);
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
              UOM were not synced due to the following reasons:
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <PageScroll>
          <ModalBody>
            <Accordion allowToggle>
              {/* FILTERED MATERIALS */}
              {filteredUom?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Available for syncing <Badge color="green">{filteredUom?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll minHeight="500px" maxHeight="501px">
                      {filteredUom ? (
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
                                UOM Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM Description
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {filteredUom?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomNo}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomDescription}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no available lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
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
                                UOM Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM Description
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
                                  {d?.uomNo}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomDescription}
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
                                UOM Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM Description
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
                                  {d?.uomNo}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomDescription}
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
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* EMPTY UOM CODE */}
              {uomCodeEmpty?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Empty Item Description <Badge color="red">{uomCodeEmpty?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {uomCodeEmpty ? (
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
                                UOM Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM Description
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {uomCodeEmpty?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomNo}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomDescription}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no record for empty UOM description.</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollImport>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* EMPTY UOM DESCRIPTION */}
              {uomDescriptionEmpty?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="left" color="black" fontSize="13px" fontWeight="semibold">
                        Check empty UOM description <Badge color="red">{uomDescriptionEmpty?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollImport maxHeight="470px">
                      {uomDescriptionEmpty ? (
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
                                UOM Code
                              </Th>
                              <Th color="white" fontSize="9px">
                                UOM Description
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {uomDescriptionEmpty?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600" fontSize="11px">
                                  {i + 1}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomNo}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomCode}
                                </Td>
                                <Td color="gray.600" fontSize="11px">
                                  {d?.uomDescription}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no records for UOM description not exist</Text>
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
