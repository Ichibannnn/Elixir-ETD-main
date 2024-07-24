import React, { useEffect, useState } from "react";
import { Button, Flex, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Select, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useDisclosure } from "@chakra-ui/react";
import PageScroll from "../../../utils/PageScroll";
import { Pagination, PaginationNext, PaginationPrevious, PaginationContainer } from "@ajna/pagination";
import moment from "moment";
import { PrintModal, RejectModal, TrackModal } from "./ActionModal";
import { GrLocation } from "react-icons/gr";
import { AiOutlineMore, AiOutlinePrinter } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { FcOk } from "react-icons/fc";
import { RiCloseCircleFill } from "react-icons/ri";
import { FaClock } from "react-icons/fa";

export const ApproveMoveOrder = ({
  setCurrentPage,
  setPageSize,
  search,
  setSearch,
  pagesCount,
  currentPage,
  approvedData,
  fetchApprovedMO,
  setOrderId,
  orderId,
  printData,
  status,
  setStatus,
}) => {
  const TableHead = ["Line", "MIR ID", "Customer Code", "Customer Name", "Total Ordered Qty", "Prepared Date", "Transaction Status", "Print Status", "Action"];

  const [trackData, setTrackData] = useState([
    {
      barcodeNo: "",
      itemCode: "",
      itemDescription: "",
      quantity: "",
      isPrepared: "",
      isApproved: "",
      isPrint: "",
      isTransact: "",
    },
  ]);

  const { isOpen: isTrack, onClose: closeTrack, onOpen: openTrack } = useDisclosure();
  const { isOpen: isReject, onClose: closeReject, onOpen: openReject } = useDisclosure();
  const { isOpen: isPrint, onClose: closePrint, onOpen: openPrint } = useDisclosure();

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

  const rejectHandler = (orderNo) => {
    if (orderNo) {
      setOrderId(orderNo);
      openReject();
    } else {
      setOrderId("");
    }
  };

  const trackHandler = (data) => {
    if (data) {
      setOrderId(data.mirId);
      setTrackData([
        {
          barcodeNo: data.barcodeNo,
          itemCode: data.itemCode,
          itemDescription: data.itemDescription,
          quantity: data.quantity,
          isPrepared: data.isPrepared,
          isApproved: data.isApprove,
          isPrint: data.isPrint,
          isTransact: data.isTransact,
        },
      ]);
      openTrack();
    } else {
      setOrderId("");
      setTrackData([
        {
          barcodeNo: "",
          itemCode: "",
          itemDescription: "",
          quantity: "",
          isPrepared: "",
          isApproved: "",
          isPrint: "",
          isTransact: "",
        },
      ]);
    }
  };

  const printHandler = (id) => {
    if (id) {
      setOrderId(id);
      openPrint();
    } else {
      setOrderId("");
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <Flex w="full" flexDirection="column" p={5} bg="form">
      <Flex justifyContent="space-between">
        <Select onChange={handlePageSizeChange} w="7%" variant="filled" fontSize="11px" borderColor="gray.400">
          <option value={Number(10)}>10</option>
          <option value={Number(20)}>20</option>
          <option value={Number(30)}>30</option>
          <option value={Number(50)}>50</option>
        </Select>
        <HStack w="17%">
          <Text fontSize="13px">Search:</Text>
          <Input borderColor="gray.400" fontSize="11px" borderRadius="none" placeholder="MIR Id" onChange={(e) => searchHandler(e.target.value)} />
        </HStack>
      </Flex>

      <Flex mt={5} flexDirection="column">
        <Flex direction="row" justifyContent="left">
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={!status ? "blue" : "gray"}
            variant={!status ? "solid" : "outline"}
            onClick={() => handleStatusChange(false)}
          >
            Regular Orders
          </Button>
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={status ? "blue" : "gray"}
            variant={status ? "solid" : "outline"}
            onClick={() => handleStatusChange(true)}
          >
            Rush Orders
          </Button>
        </Flex>
        <PageScroll minHeight="400px" maxHeight="700px">
          <Text textAlign="center" bgColor="primary" color="white" fontSize="14px">
            List of Move Orders
          </Text>
          <Table size="sm" variant="striped">
            <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
              <Tr>
                {TableHead?.map((head, i) => (
                  <Th h="30px" p={3} key={i} color="white" fontSize="10px">
                    <Flex justifyContent="center">{head}</Flex>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {approvedData?.moveorder?.map((order, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">
                    <Flex justifyContent="center">{i + 1}</Flex>
                  </Td>
                  <Td fontSize="xs">
                    <Flex justifyContent="center">{order.mirId}</Flex>
                  </Td>
                  <Td fontSize="xs">
                    <Flex justifyContent="center">{order.customerCode}</Flex>
                  </Td>
                  <Td fontSize="xs">
                    <Flex justifyContent="center">{order.customerName}</Flex>
                  </Td>
                  <Td fontSize="xs">
                    <Flex justifyContent="center">
                      {" "}
                      {order.quantity.toLocaleString(undefined, {
                        maximuFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Flex>
                  </Td>
                  <Td fontSize="xs">
                    <Flex justifyContent="center">{moment(order.preparedDate).format("MM/DD/yyyy")}</Flex>
                  </Td>
                  {order.isTransact ? (
                    <Td fontSize="xs">
                      <Tooltip label="Transacted MO">
                        <Flex justifyContent="center">
                          <FcOk fontSize="20px" />
                        </Flex>
                      </Tooltip>
                    </Td>
                  ) : (
                    <Td fontSize="xs">
                      <Tooltip label="For Transaction MO">
                        <Flex justifyContent="center">
                          <FaClock color="orange" fontSize="18px" />
                        </Flex>
                      </Tooltip>
                    </Td>
                  )}

                  {order.isPrint === true ? (
                    <Td fontSize="xs">
                      <Tooltip label="Printed MOS">
                        <Flex justifyContent="center">
                          <FcOk fontSize="20px" />
                        </Flex>
                      </Tooltip>
                    </Td>
                  ) : (
                    <Td fontSize="xs">
                      <Tooltip label="For Printing MOS">
                        <Flex justifyContent="center">
                          <RiCloseCircleFill color="red" fontSize="22px" />
                        </Flex>
                      </Tooltip>
                    </Td>
                  )}
                  <Td>
                    <Flex justifyContent="center">
                      <Menu>
                        <MenuButton alignItems="center" justifyContent="center" bg="none">
                          <AiOutlineMore fontSize="20px" />
                        </MenuButton>
                        <MenuList>
                          <MenuItem icon={<GrLocation fontSize="17px" />} onClick={() => trackHandler(order)}>
                            <Text fontSize="15px">Track</Text>
                          </MenuItem>
                          <MenuItem icon={<AiOutlinePrinter fontSize="17px" />} onClick={() => printHandler(order.mirId, order.quantity)}>
                            <Text fontSize="15px">Print</Text>
                          </MenuItem>
                          <MenuItem
                            icon={<GiCancel color="red" fontSize="17px" />}
                            onClick={() => rejectHandler(order.mirId)}
                            isDisabled={order.isTransact}
                            title={order.isTransact ? "Order was already transacted" : "Order not yet transacted"}
                          >
                            <Text fontSize="15px" color="red" _hover={{ color: "red" }}>
                              Reject
                            </Text>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={7}>
        <Text fontSize="xs">{approvedData?.moveorder?.length > 0 ? `Showing ${approvedData?.moveorder?.length} entries` : "No entries available"}</Text>

        <Flex>
          <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
            <PaginationContainer>
              <PaginationPrevious border="1px" fontSize="xs" px={2} _hover={{ bg: "accent", color: "white" }}>
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="secondary" color="white" px={2} pt={1.5}>
                {currentPage}
              </Text>
              <PaginationNext border="1px" fontSize="xs" px={4} _hover={{ bg: "accent", color: "white" }}>
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex>
      </Flex>

      {isTrack && <TrackModal isOpen={isTrack} onClose={closeTrack} trackData={trackData} trackList={printData} />}
      {isPrint && <PrintModal isOpen={isPrint} onClose={closePrint} printData={printData} fetchApprovedMO={fetchApprovedMO} orderId={orderId} />}
      {isReject && <RejectModal isOpen={isReject} onClose={closeReject} id={orderId} fetchApprovedMO={fetchApprovedMO} />}
    </Flex>
  );
};
