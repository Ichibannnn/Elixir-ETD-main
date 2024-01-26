import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  MdDeleteOutline,
  MdOutlineCheckBox,
  MdOutlineMoreHoriz,
  MdOutlinePendingActions,
} from "react-icons/md";
import { GoArrowSmallRight } from "react-icons/go";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import request from "../../../../services/ApiClient";
import { AiOutlineEdit, AiOutlineMore } from "react-icons/ai";
import { EditQuantityModal } from "./ActionModal";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../../components/Toast";

export const ReturnRequest = ({
  isOpen,
  onClose,
  materialListId,
  borrowedId,
  borrowedHandler,
  consumedHandler,
  setIsLoading,
  fetchMaterialsList,
}) => {
  const [returnRequest, setReturnRequest] = useState([]);
  const [editData, setEditData] = useState([]);
  const [availableConsume, setAvailableConsume] = useState("");

  const toast = useToast();

  const {
    isOpen: isEditQuantity,
    onOpen: openEditQuantity,
    onClose: closeEditQuantity,
  } = useDisclosure();

  //RETURN REQUEST
  const id = materialListId;
  const fetchReturnRequestApi = async (id) => {
    const res = await request.get(`Borrowed/GetConsumedItem?`, {
      params: {
        id: id,
      },
    });
    return res.data;
  };

  const fetchReturnRequest = () => {
    fetchReturnRequestApi(id).then((res) => {
      setReturnRequest(res);
      // console.log(res);
    });
  };

  useEffect(() => {
    if (id) {
      fetchReturnRequest();
    }
    return () => {
      setReturnRequest([]);
    };
  }, [id]);

  const editQuantityHandler = (data) => {
    // console.log(data.returnedQuantity);
    if (data) {
      setEditData(data);
      setAvailableConsume(data.returnedQuantity);
      openEditQuantity();
    } else {
      setEditData("");
    }
  };

  const resetConsumedQty = (data) => {
    console.log(data.id);
    Swal.fire({
      title: "Confirmation!",
      text: `Reset consumed quantity for Consumed Id No. ${data.id}?`,
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
          const response = request
            .put(`Borrowed/CancelItemCodeInBorrowedIssue`, [
              {
                id: data.id,
              },
            ])
            .then((response) => {
              ToastComponent(
                "Success",
                `Reset consumed quantity was saved`,
                "success",
                toast
              );
              sessionStorage.removeItem("Borrowed ID");
              sessionStorage.removeItem("Navigation");
              fetchReturnRequest();
              fetchMaterialsList();
              setIsLoading(false);
              // onClose();
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="none">
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              List of Consumed Materials
            </Text>
          </Flex>
          {/* <Text fontSize="lg" fontWeight="extrabold">
            List of Consumed Materials
          </Text>{" "} */}
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />
        <ModalBody mb={5} fontSize="xs">
          <Flex flexDirection="column" w="full" mt={4}>
            <PageScroll minHeight="430px" maxHeight="450px">
              <Table size="sm" variant="striped">
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th h="40px" color="white" fontSize="10px">
                      Consumed ID
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      Item Information
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      Charging of Accounts
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {returnRequest?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs" color="gray.700" fontWeight="semibold">
                        {item.id}
                      </Td>
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="left">
                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Item:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.itemCode} - {item.itemDescription}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                UOM:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.uom}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Consumed Quantity:
                              </Text>
                              <Text color="blue.400" fontWeight="bold">
                                {item.consumedQuantity.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </Text>
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="left">
                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Company:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.companyCode} - {item.companyName}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Department:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.departmentCode} - {item.departmentName}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Location:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.locationCode} - {item.locationName}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Account Title:
                              </Text>
                              <Text color="gray.700" fontWeight="bold">
                                {item.accountCode} - {item.accountTitles}
                              </Text>
                            </HStack>

                            <HStack fontSize="xs" spacing="5px">
                              <Text fontWeight="semibold" color="gray.500">
                                Employee:
                              </Text>
                              {item.empId && item.fullName ? (
                                <Text color="gray.700" fontWeight="bold">
                                  {item.empId} -{item.fullName}
                                </Text>
                              ) : (
                                <Text>-</Text>
                              )}
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex pl={2}>
                          <Box>
                            <Menu>
                              <MenuButton
                                alignItems="center"
                                justifyContent="center"
                                bg="none"
                              >
                                <MdOutlineMoreHoriz fontSize="20px" />
                              </MenuButton>
                              <MenuList>
                                {item.borrowedQuantity ===
                                item.itemConsumedQuantity ? (
                                  <MenuItem
                                    isDisabled
                                    icon={<AiOutlineEdit fontSize="17px" />}
                                  >
                                    <Text
                                      fontSize="15px"
                                      _hover={{ color: "red" }}
                                    >
                                      Edit
                                    </Text>
                                  </MenuItem>
                                ) : (
                                  <MenuItem
                                    onClick={() => editQuantityHandler(item)}
                                    icon={<AiOutlineEdit fontSize="17px" />}
                                  >
                                    <Text
                                      fontSize="15px"
                                      _hover={{ color: "red" }}
                                    >
                                      Edit
                                    </Text>
                                  </MenuItem>
                                )}
                                <MenuItem
                                  onClick={() => resetConsumedQty(item)}
                                  icon={<MdDeleteOutline fontSize="17px" />}
                                >
                                  <Text
                                    fontSize="15px"
                                    _hover={{ color: "red" }}
                                  >
                                    Delete
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
            {isEditQuantity && (
              <EditQuantityModal
                isOpen={isEditQuantity}
                onClose={closeEditQuantity}
                returnRequest={returnRequest}
                editData={editData}
                setEditData={setEditData}
                borrowedId={borrowedId}
                materialListId={materialListId}
                availableConsume={availableConsume}
                fetchReturnRequest={fetchReturnRequest}
                fetchMaterialsList={fetchMaterialsList}
              />
            )}
          </Flex>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
