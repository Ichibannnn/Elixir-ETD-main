import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  HStack,
  ModalOverlay,
  useDisclosure,
  Input,
  Select,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
// import { EditModal } from "./ActionModalBorrowed";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import { decodeUser } from "../../../../services/decode-user";
import { GrView } from "react-icons/gr";

const currentUser = decodeUser();

export const ViewModal = ({
  isOpen,
  onClose,
  statusBody,
  fetchBorrowed,
  setIsLoading,
}) => {
  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [coaId, setCoaId] = useState("");
  const [editData, setEditData] = useState({
    id: "",
    itemCode: "",
    itemDescription: "",
    returnQuantity: "",
    consume: "",
    borrowedQuantity: "",
  });

  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();

  const { isOpen: isCoa, onOpen: openCoa, onClose: closeCoa } = useDisclosure();

  const id = statusBody.id;
  const fetchBorrowedDetailsApi = async (id) => {
    const res = await request.get(
      `Borrowed/ViewBorrowedReturnDetails?id=${id}`
    );
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(id).then((res) => {
      setBorrowedDetailsData(res);
    });
  };

  useEffect(() => {
    fetchBorrowedDetails();
  }, [id]);

  const editHandler = ({
    id,
    itemCode,
    itemDescription,
    returnQuantity,
    consume,
    borrowedQuantity,
  }) => {
    if (
      id &&
      itemCode &&
      itemDescription &&
      returnQuantity >= 0 &&
      consume >= 0 &&
      borrowedQuantity
      //   id &&
      //   itemCode &&
      //   itemDescription &&
      //   returnQuantity > 0 &&
      //   consumes > 0 &&
      //   quantity
    ) {
      setEditData({
        id: id,
        itemCode: itemCode,
        itemDescription: itemDescription,
        returnQuantity: returnQuantity,
        consumes: consume,
        borrowedQuantity: borrowedQuantity,
      });
      openEdit();
    } else {
      setEditData({
        id: "",
        itemCode: "",
        itemDescription: "",
        returnQuantity: "",
        consumes: "",
        borrowedQuantity: "",
      });
    }
  };

  const coaIdHandler = (data) => {
    if (data) {
      setCoaId(data);
      console.log(coaId);
      openCoa();
    } else {
      setCoaId("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              Pending Return Details
            </Text>
          </Flex>
        </ModalHeader>
        {/* <ModalCloseButton color="white" onClick={onClose} /> */}
        <ModalBody mb={5}>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={1} mt={4}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Borrowed Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.preparedDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.customerCode}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customer}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.details}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={-1} mt={4}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.borrowedPKey}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.empId
                    ? borrowedDetailsData[0]?.empId
                    : "-"}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee Name:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.fullName
                    ? borrowedDetailsData[0]?.fullName
                    : "-"}
                </Text>
              </HStack>
            </VStack>
          </Flex>

          <VStack justifyContent="center" mt={4}>
            <PageScroll minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Id
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Consume
                    </Th>
                    <Th color="white" fontSize="xs">
                      Return Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      View
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.borrowedQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.consume.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.returnQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td>
                        {borrowdetails.consume === 0 ? (
                          <Button isDisabled size="xs" bg="none">
                            <GrView
                              fontSize="18px"
                              onClick={() => coaIdHandler(borrowdetails.id)}
                            />
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            bg="none"
                            onClick={() => coaIdHandler(borrowdetails.id)}
                          >
                            <GrView fontSize="18px" />
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Requested By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {borrowedDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            {/* <Button colorScheme="blue" onClick={submitBody}>
              Submit
            </Button> */}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          fetchBorrowedDetails={fetchBorrowedDetails}
        />
      )}

      {isCoa && <ViewCOA isOpen={isCoa} onClose={closeCoa} coaId={coaId} />}
    </Modal>
  );
};

export const EditModal = ({
  isOpen,
  onClose,
  editData,
  fetchBorrowedDetails,
}) => {
  const [quantitySubmit, setQuantitySubmit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const quantityHandler = (data) => {
    if (data) {
      setQuantitySubmit(parseFloat(data));
    } else {
      setQuantitySubmit("");
    }
  };

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Borrowed/EditReturnedQuantity`, {
          id: editData.id,
          returnQuantity: quantitySubmit,
        })
        .then((res) => {
          ToastComponent("Success", "Order has been edited!", "success", toast);
          onClose();
          fetchBorrowedDetails();
        })
        .catch((err) => {
          // ToastComponent("Error", err.response.data, "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  const titles = ["Item Code", "Item Description", "Return Quantity"];
  const autofilled = [editData?.itemCode, editData?.itemDescription];

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="primary" color="white">
            <Flex justifyContent="left">
              <Text fontSize="15px">Return Quantity</Text>
            </Flex>
          </ModalHeader>

          <ModalBody>
            {/* <PageScrollReusable minHeight='50px' maxHeight='350px'> */}
            {/* <Text textAlign="center" mb={7} fontSize="sm">
              Are you sure you want to edit this order?
            </Text> */}
            <HStack justifyContent="center" textAlign="start">
              <VStack spacing={4}>
                {titles.map((title) => (
                  <Text w="full" pl={2} key={title} fontSize="xs">
                    {title}
                  </Text>
                ))}
              </VStack>
              <VStack spacing={3.5}>
                {autofilled.map((items) => (
                  <Text
                    w="70%"
                    pl={2}
                    bgColor="gray.200"
                    border="1px"
                    key={items}
                    color="fontColor"
                    fontSize="xs"
                  >
                    {items}
                  </Text>
                ))}
                <Input
                  borderRadius="sm"
                  color="fontColor"
                  fontSize="sm"
                  onChange={(e) => quantityHandler(e.target.value)}
                  value={quantitySubmit}
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  onPaste={(e) => e.preventDefault()}
                  w="72%"
                  pl={2}
                  h={7}
                  bgColor="#fff8dc"
                  border="1px"
                />
              </VStack>
            </HStack>
            {/* </PageScrollReusable> */}
          </ModalBody>

          <ModalFooter justifyItems="center">
            <ButtonGroup size="xs" mt={5}>
              <Button
                px={4}
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={
                  !quantitySubmit ||
                  isLoading ||
                  quantitySubmit > editData?.borrowedQuantity
                }
                // disabled={!quantitySubmit || isLoading || quantitySubmit > editData?.consumes}
                colorScheme="blue"
              >
                Save
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="gray"
              >
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const PendingCancelModal = ({
  isOpen,
  onClose,
  fetchBorrowed,
  statusBody,
  setIsLoading,
  isLoading,
  fetchNotificationWithParams,
}) => {
  const [reasonSubmit, setReasonSubmit] = useState("");
  const [reasons, setReasons] = useState([]);
  const toast = useToast();

  const fetchReasonApi = async () => {
    const res = await request.get(`Reason/GetAllActiveReasons`);
    return res.data;
  };

  const fetchReasons = () => {
    fetchReasonApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    fetchReasons();

    return () => {
      setReasons([]);
    };
  }, []);

  const id = statusBody?.id;

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Borrowed/CancelForReturned`, [
          {
            id: id,
            reason: reasonSubmit,
            rejectBy: currentUser?.fullName,
          },
        ])
        .then((res) => {
          ToastComponent(
            "Success",
            "Returned Materials has been rejected",
            "success",
            toast
          );
          fetchNotificationWithParams();
          fetchBorrowed();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent(
            "Error",
            "Returned materials was not rejected",
            "error",
            toast
          );
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text>Cancel Returned Confirmation</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack justifyContent="center">
            <Text>
              Are you sure you want to cancel this returned materials?
            </Text>
            {reasons?.length > 0 ? (
              <Select
                fontSize="md"
                onChange={(e) => setReasonSubmit(e.target.value)}
                w="70%"
                placeholder="Please select a reason"
                bg="#fff8dc"
              >
                {reasons?.map((reason, i) => (
                  <option key={i} value={reason.reasonName}>
                    {reason.reasonName}
                  </option>
                ))}
              </Select>
            ) : (
              "loading"
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup size="sm" mt={7}>
            <Button
              onClick={submitHandler}
              isDisabled={!reasonSubmit || isLoading}
              isLoading={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              isLoading={isLoading}
              color="black"
              variant="outline"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ViewCOA = ({ isOpen, onClose, coaId }) => {
  const [coaList, setCoaList] = useState([]);

  //RETURN REQUEST
  const id = coaId;
  const fetchCOAListApi = async (id) => {
    const res = await request.get(`Borrowed/ViewConsumeForReturn?`, {
      params: {
        id: id,
      },
    });
    return res.data;
  };

  const fetchCOAList = () => {
    fetchCOAListApi(id).then((res) => {
      setCoaList(res);
    });
  };

  useEffect(() => {
    if (id) {
      fetchCOAList();
    }
    return () => {
      setCoaList([]);
    };
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              List of Consumed Materialsss
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" onClick={onClose} />
        <ModalBody mb={5} fontSize="xs">
          <Flex flexDirection="column" w="full" mt={4}>
            <PageScroll minHeight="430px" maxHeight="450px">
              <Table size="sm" variant="striped">
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th h="40px" color="white" fontSize="10px">
                      Item Information
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      Service Report #
                    </Th>
                    <Th h="40px" color="white" fontSize="10px">
                      Charging of Accounts
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {coaList?.map((item, i) => (
                    <Tr key={i}>
                      {/* Item Information */}
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
                                {item.consume.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>

                      {/* Service Report # */}
                      <Td>
                        <Flex flexDirection="column" gap="10px">
                          <Flex flexDirection="column" justifyContent="center">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="bold">
                                {item.reportNumber}
                              </Text>
                            </HStack>
                          </Flex>
                        </Flex>
                      </Td>

                      {/* Charging of Accounts */}
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
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Flex>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
