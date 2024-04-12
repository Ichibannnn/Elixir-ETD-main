import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Toast,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import request from "../../../../services/ApiClient";
import { AiOutlineMore } from "react-icons/ai";
import { GrPowerReset, GrView } from "react-icons/gr";
import { BiDownload } from "react-icons/bi";
import { ReturnRequest } from "./ReturnRequest";
import { useLocation, useNavigate } from "react-router-dom";

export const ListOfMaterials = ({
  materialList,
  setMaterialList,
  highlighterId,
  setHighlighterId,
  setIsConsumeModalOpen,
  setMaterialListId,
  materialListId,
  setItemCode,
  borrowedId,
  setBorrowedId,
  fetchMaterialsList,
  fetchNotificationWithParams,
  isLoading,
  setIsLoading,
  setButtonChanger,
  setReturnQuantity,
  setItemDescription,
  setUom,
  fetchBorrowed,
  setConsumedQuantity,
}) => {
  const [borrowedHandler, setBorrowedHandler] = useState(""); // Borrowed qty Handler for validation of list of consumed modal
  const [consumedHandler, setConsumedHandler] = useState(""); // Consumed qty Handler for validation of list of consumed modal
  const toast = useToast();

  const {
    isOpen: isReturn,
    onClose: closeReturn,
    onOpen: openReturn,
  } = useDisclosure();

  const rowHandler = ({
    id,
    itemCode,
    itemDescription,
    uom,
    remainingQuantity,
  }) => {
    console.log(id);
    if (id) {
      setHighlighterId(id);
      setMaterialListId(id);
      setItemCode(itemCode);
      setItemDescription(itemDescription);
      setUom(uom);
      setItemCode(itemCode);
      setReturnQuantity(remainingQuantity);
      setBorrowedId(borrowedId);
      setIsConsumeModalOpen(true);
    } else {
      setHighlighterId("");
      setMaterialListId("");
      setItemCode("");
      setItemDescription("");
      setUom("");
      setReturnQuantity("");
      setBorrowedId("");
      setIsConsumeModalOpen(false);
    }
  };

  const materialListIdHandler = (data) => {
    if (data) {
      setMaterialListId(data.id);
      setBorrowedHandler(data.borrowedQuantity);
      setConsumedHandler(data.consumedQuantity);
      openReturn();
    } else {
      setMaterialListId("");
      setBorrowedHandler("");
      setConsumedHandler("");
    }
  };

  const submitConsumeHandler = (data) => {
    console.log(data);
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
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
            .put(`Borrowed/SaveReturnedQuantity`, [
              {
                borrowedPKey: borrowedId,
              },
            ])
            .then((response) => {
              ToastComponent(
                "Success",
                "Returned materials was saved",
                "success",
                toast
              );
              fetchMaterialsList();
              setItemCode("");
              setHighlighterId("");
              setMaterialListId("");
              setConsumedQuantity("");
              setButtonChanger(false);
              setMaterialList("");
              fetchBorrowed();
              setIsLoading(false);
              fetchNotificationWithParams();
              sessionStorage.removeItem("Navigation");
              sessionStorage.removeItem("Borrowed ID");
              navigateConsume("/borrowed/view-request");
              setBorrowedId("");
            })
            .catch((err) => {
              // ToastComponent("Error", err.response.data, "warning", toast);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  const cancelAllConsumed = (data) => {
    // console.log(data);
    Swal.fire({
      // title: "Confirmation!",
      text: "Are you sure you want to cancel this information?",
      icon: "warning",
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
          const response = request
            .put(`Borrowed/CancelAllConsumeItem`, { borrowedPKey: borrowedId })
            .then((response) => {
              ToastComponent(
                "Success",
                "Returned materials was saved",
                "success",
                toast
              );
              sessionStorage.removeItem("Navigation");
              sessionStorage.removeItem("Borrowed ID");
              fetchBorrowed();
              fetchMaterialsList();
              setBorrowedId("");
              setMaterialListId("");
              setItemCode("");
              setConsumedQuantity("");
              setIsLoading(false);
              setButtonChanger(false);
              fetchNotificationWithParams();
              // navigateConsume("/borrowed/view-request");
            })
            .catch((err) => {
              ToastComponent("Error", err.response.data, "warning", toast);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  const navigateConsume = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    sessionStorage.setItem("Borrowed ID", borrowedId);
    return () => {
      const isConsumed = materialList?.some((item) =>
        Boolean(item.consumedQuantity)
      );

      const isReturn = materialList?.every((item) => item.isReturned === null);
      const isNotReturn = materialList?.some(
        (item) => item.isReturned === false
      );

      if (isConsumed && sessionStorage.getItem("Borrowed ID") && isReturn) {
        Swal.fire({
          title: "[Warning!]<br>" + "[Borrowed Transaction]",
          html:
            "Your consumed list will be cancelled." +
            "<br>" +
            "Are you sure you want to leave the page without submitting?",
          icon: "warning",
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
            title: "my-swal-title",
          },
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              const response = request
                .put(`Borrowed/CancelAllConsumeItem`, {
                  borrowedPKey: borrowedId,
                })
                .then((response) => {
                  ToastComponent(
                    "Success",
                    "Returned materials was saved",
                    "success",
                    toast
                  );
                  fetchBorrowed();
                  fetchMaterialsList();
                  setBorrowedId("");
                  setMaterialListId("");
                  setItemCode("");
                  setConsumedQuantity("");
                  setIsLoading(false);
                  setButtonChanger(false);
                  fetchNotificationWithParams();
                  navigateConsume("/borrowed/view-request");
                })
                .catch((err) => {
                  ToastComponent("Error", err.response.data, "warning", toast);
                });
            } catch (err) {
              ToastComponent("Error", err.response.data, "warning", toast);
            }
          } else {
            navigateConsume("/borrowed/view-request");
            sessionStorage.setItem("Borrowed ID", borrowedId);
            sessionStorage.setItem("Navigation", 2);
          }
        });
      }
    };
  }, [materialList]);

  return (
    <Flex flexDirection="column" h="full" w="full" mt={2} className="boxShadow">
      <Flex h="40px" bg="primary" color="white" alignItems="center">
        <Text fontSize="sm" ml={4}>
          List of Materials
        </Text>
      </Flex>
      <Flex justifyContent="left" w="full" mb={1} p={2}>
        <Flex w="full" justifyContent="space-between">
          <VStack alignItems="start" spacing={1}>
            <HStack>
              <Text fontSize="sm" fontWeight="semibold">
                Borrowed Id:{" "}
              </Text>
              <Text fontSize="sm">{materialList[0]?.borrowedPKey}</Text>
            </HStack>

            <HStack>
              <Text fontSize="sm" fontWeight="semibold">
                Customer:{" "}
              </Text>
              <Text fontSize="sm">{materialList[0]?.customerCode}</Text>
            </HStack>

            <HStack>
              <Text fontSize="sm" fontWeight="semibold">
                Customer Name:{" "}
              </Text>
              <Text fontSize="sm">{materialList[0]?.customerName}</Text>
            </HStack>

            <HStack>
              <Text fontSize="sm" fontWeight="semibold">
                Borrowed Date:{" "}
              </Text>
              <Text fontSize="sm">
                {moment(materialList[0]?.borrowedDate).format("MM/DD/yyyy")}
              </Text>
            </HStack>
          </VStack>

          <VStack alignItems="start" spacing={1}>
            <HStack>
              <Text fontSize="sm" fontWeight="semibold">
                Employee ID:{" "}
              </Text>
              <Text fontSize="sm">
                {materialList[0]?.empId ? materialList[0]?.empId : "-"}
              </Text>
            </HStack>

            <HStack>
              <Text fontSize="sm" fontWeight="semibold">
                Employee Name
              </Text>
              <Text fontSize="sm">
                {materialList[0]?.fullName ? materialList[0]?.fullName : "-"}
              </Text>
            </HStack>
          </VStack>
        </Flex>
      </Flex>
      <Flex p={2}>
        <PageScroll minHeight="570px" maxHeight="570px">
          <Table variant="striped">
            <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th h="40px" color="white" fontSize="xs">
                  Id
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Item Code
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Item Description
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Uom
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Borrowed Qty
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Return Qty
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Consumed Qty
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Unit Cost
                </Th>
                <Th h="40px" color="white" fontSize="xs">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {materialList?.map((item, i) => (
                <Tr key={i} cursor="pointer">
                  <Td fontSize="xs">{item.id}</Td>
                  <Td fontSize="xs">{item.itemCode}</Td>
                  <Td fontSize="xs">{item.itemDescription}</Td>
                  <Td fontSize="xs">{item.uom}</Td>
                  <Td fontSize="xs">
                    {item.borrowedQuantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.remainingQuantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.consumedQuantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {item.unitCost.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs" mr={3}>
                    <Flex pl={2}>
                      <Box>
                        <Menu>
                          <MenuButton
                            alignItems="center"
                            justifyContent="center"
                            bg="none"
                          >
                            <AiOutlineMore fontSize="20px" />
                          </MenuButton>
                          <MenuList>
                            {item.consumedQuantity === 0 ? (
                              <MenuItem
                                isDisabled
                                icon={<GrView fontSize="17px" />}
                              >
                                <Text fontSize="15px">View</Text>
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<GrView fontSize="17px" />}
                                onClick={() => materialListIdHandler(item)}
                              >
                                <Text fontSize="15px">View</Text>
                              </MenuItem>
                            )}

                            {item.remainingQuantity === 0 ? (
                              <MenuItem
                                isDisabled
                                icon={<BiDownload fontSize="17px" />}
                                onClick={() => rowHandler(item)}
                              >
                                <Text fontSize="15px" _hover={{ color: "red" }}>
                                  Consume
                                </Text>
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<BiDownload fontSize="17px" />}
                                onClick={() => rowHandler(item)}
                              >
                                <Text fontSize="15px" _hover={{ color: "red" }}>
                                  Consume
                                </Text>
                              </MenuItem>
                            )}
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
      </Flex>
      <Flex justifyContent="end" mb={6} mr={2}>
        <ButtonGroup>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            size="sm"
            fontSize="xs"
            width="100px"
            onClick={() => submitConsumeHandler(borrowedId)}
          >
            Submit
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            fontSize="xs"
            width="100px"
            onClick={() => cancelAllConsumed(borrowedId)}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Flex>
      {isReturn && (
        <ReturnRequest
          isOpen={isReturn}
          onClose={closeReturn}
          materialListId={materialListId}
          borrowedId={borrowedId}
          borrowedHandler={borrowedHandler}
          consumedHandler={consumedHandler}
          setIsLoading={setIsLoading}
          fetchMaterialsList={fetchMaterialsList}
          fetchBorrowed={fetchBorrowed}
        />
      )}
    </Flex>
  );
};
