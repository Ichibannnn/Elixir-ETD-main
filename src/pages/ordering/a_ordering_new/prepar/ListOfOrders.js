import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";

import { CancelModalConfirmation, EditModal, ScheduleModal } from "./ActionModal";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel, MdOutlineMoreHoriz } from "react-icons/md";

import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";

export const ListOfOrders = ({
  fetchMirList,
  selectedMIRIds,
  setSelectedMIRIds,
  setCustomerName,
  isAllChecked,
  setIsAllChecked,
  disableScheduleButton,
  setDisableScheduleButton,
  setCurrentPage,
  setSearchValue,
  fetchNotification,
}) => {
  const [orderList, setOrderList] = useState([]);

  const [editData, setEditData] = useState([]);
  const [cancelId, setCancelId] = useState("");

  const { isOpen: isEdit, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isCancel, onOpen: openCancel, onClose: closeCancel } = useDisclosure();

  const { isOpen: isSchedule, onOpen: openSchedule, onClose: closeSchedule } = useDisclosure();

  const fetchOrderList = async () => {
    try {
      const response = await request.get(`Ordering/GetAllListOfMirOrdersByMirIds?listofMirIds=${selectedMIRIds.join("&listofMirIds=")}`);
      setOrderList(response.data);

      // Check if any order has a negative value for "Reserve"
      const hasNegativeReserve = response.data.some((order) => order.reserve < 0);
      setDisableScheduleButton(hasNegativeReserve);
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };

  useEffect(() => {
    if (selectedMIRIds.length > 0) {
      fetchOrderList();
    } else {
      setOrderList([]); // Reset order list if customer name or selected MIR IDs are empty
    }
  }, [selectedMIRIds]);

  const editHandler = (data) => {
    if (data) {
      setEditData(data);
      openEdit();
      console.log("Edit Data: ", editData);
    } else {
      setEditData();
    }
  };

  const cancelHandler = ({ id }) => {
    if (id) {
      setCancelId(id);
      console.log(cancelId);
      openCancel();
    } else {
      setCancelId("");
    }
  };

  const scheduleHandler = () => {
    openSchedule();
  };

  return (
    <Flex direction="column" w="full">
      <Flex direction="column" p={4} className="boxShadow" w="full" bg="#F5F5F7">
        <Text
          textAlign="center"
          bgColor="primary"
          color="white"
          fontSize="14px"
          // fontWeight="semibold"
        >
          LIST OF ORDERS
        </Text>
        <PageScroll minHeight="390px" maxHeight="400px">
          <Table size="sm" variant="simple">
            <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th color="white" fontSize="11px">
                  Line
                </Th>
                <Th color="white" fontSize="11px">
                  MIR ID
                </Th>
                <Th color="white" fontSize="11px">
                  Item Code
                </Th>
                <Th color="white" fontSize="11px">
                  Item Description
                </Th>
                <Th color="white" fontSize="11px">
                  UOM
                </Th>
                <Th color="white" fontSize="11px">
                  Quantity Order
                </Th>
                <Th color="white" fontSize="11px">
                  Allocation
                </Th>
                <Th color="white" fontSize="11px">
                  Item Remarks
                </Th>
                <Th color="white" fontSize="11px">
                  Asset Tag
                </Th>
                <Th color="white" fontSize="11px">
                  Reserve
                </Th>
                <Th color="white" fontSize="11px">
                  Account Title
                </Th>
                {/* <Th color="white" fontSize="11px">
                  Employee Information
                </Th> */}
                <Th color="white" fontSize="11px" pr={4}>
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderList.map((order, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{i + 1}</Td>
                  <Td fontSize="xs">{order.mirId}</Td>
                  <Td fontSize="xs">{order.itemCode}</Td>
                  <Td fontSize="xs">{order.itemDescription}</Td>
                  <Td fontSize="xs">{order.uom}</Td>
                  <Td fontSize="xs">
                    {order.standardQuantity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {order.quantityOrder.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  {order?.itemRemarks ? <Td fontSize="xs">{order.itemRemarks}</Td> : <Td fontSize="xs">-</Td>}
                  {order?.assetTag ? <Td fontSize="xs">{order.assetTag}</Td> : <Td fontSize="xs">-</Td>}
                  <Td fontSize="xs">
                    {order.actualReserve.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">
                    {order.accountCode} - {order.accountTitles}{" "}
                  </Td>
                  {/* {order.empId && order.fullName ? (
                    <Td fontSize="xs">
                      {order.empId} - {order.fullName}{" "}
                    </Td>
                  ) : (
                    <Td fontSize="xs">-</Td>
                  )} */}

                  <Td fontSize="xs">
                    <Flex pl={2}>
                      <Box>
                        <Menu>
                          <MenuButton
                            alignItems="center"
                            justifyContent="center"
                            // variant="outline"
                          >
                            <MdOutlineMoreHoriz fontSize="20px" />
                          </MenuButton>
                          <MenuList>
                            <MenuItem onClick={() => editHandler(order)} icon={<AiOutlineEdit fontSize="17px" />}>
                              <Text fontSize="15px" _hover={{ color: "red" }}>
                                Edit
                              </Text>
                            </MenuItem>
                            <MenuItem onClick={() => cancelHandler(order)} icon={<MdOutlineCancel fontSize="17px" color="red" />}>
                              <Text fontSize="15px" color="red">
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
      </Flex>
      <Flex w="full" justifyContent="space-between" py={2} px={2}>
        <Text fontSize="xs"></Text>
        <Button onClick={scheduleHandler} isDisabled={!selectedMIRIds?.length > 0 || disableScheduleButton} size="sm" px={3} colorScheme="blue">
          Schedule
        </Button>
      </Flex>

      {isEdit && <EditModal isOpen={isEdit} onClose={closeEdit} editData={editData} fetchOrderList={fetchOrderList} orderList={orderList} />}

      {isCancel && (
        <CancelModalConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          cancelId={cancelId}
          fetchOrderList={fetchOrderList}
          fetchMirList={fetchMirList}
          setCustomerName={setCustomerName}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
          fetchNotification={fetchNotification}
        />
      )}

      {isSchedule && (
        <ScheduleModal
          isOpen={isSchedule}
          onClose={closeSchedule}
          setCustomerName={setCustomerName}
          fetchOrderList={fetchOrderList}
          fetchMirList={fetchMirList}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          setSearchValue={setSearchValue}
          setCurrentPage={setCurrentPage}
          setIsAllChecked={setIsAllChecked}
          fetchNotification={fetchNotification}
          orderList={orderList}
        />
      )}
    </Flex>
  );
};

// NEWEST CODE =--------------------------------------------------------------------------------------
// import React, { useEffect } from "react";
// import {
//   Badge,
//   Flex,
//   HStack,
//   Select,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
// } from "@chakra-ui/react";
// import moment from "moment";
// import PageScroll from "../../../../utils/PageScroll";

// export const ListOfOrders = ({ mirOrderList, customers, selectedMirIds }) => {
//   const filteredOrders = mirOrderList.filter(
//     (item) => selectedMirIds[item.mirId]
//   );

//   return (
//     <Flex w="95%" h="250px" flexDirection="column">
//       <Flex flexDirection="column">
//         <Text
//           textAlign="center"
//           bgColor="secondary"
//           color="white"
//           fontSize="13px"
//         >
//           List of Orders
//         </Text>
//         <PageScroll minHeight="260px" maxHeight="270px">
//           <Table size="sm" variant="simple">
//             <Thead bgColor="secondary">
//               <Tr h="30px">
//                 <Th color="white" fontSize="10px">
//                   Line
//                 </Th>
//                 {/* <Th color="white" fontSize="10px">
//                   MIR ID
//                 </Th> */}
//                 <Th color="white" fontSize="10px">
//                   Item Code
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Item Description
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   UOM
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Reserve
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Remarks
//                 </Th>
//               </Tr>
//             </Thead>
//             {customers ? (
//               <Tbody>
//                 {mirOrderList?.map((item, i) => (
//                   <Tr key={i}>
//                     <Td fontSize="11px">{i + 1}</Td>
//                     {/* <Td fontSize="11px">{item.mirId}</Td> */}
//                     <Td fontSize="11px">{item.itemCode}</Td>
//                     <Td fontSize="11px">{item.itemDescription}</Td>
//                     <Td fontSize="11px">{item.uom}</Td>
//                     <Td fontSize="11px">{item.quantityOrder}</Td>
//                     <Td fontSize="11px">{item.stockOnHand}</Td>
//                     {/* <Td fontSize="11px">{item.orderDate}</Td> */}
//                   </Tr>
//                 ))}
//               </Tbody>
//             ) : null}
//           </Table>
//         </PageScroll>
//       </Flex>
//     </Flex>
//   );
// };
