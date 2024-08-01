import React, { useState, useEffect } from "react";
import { Button, Flex, HStack, Input, Select, Text, useDisclosure, VStack } from "@chakra-ui/react";

import request from "../../../services/ApiClient";
import moment from "moment";

import { ListMoveOrder } from "./ListMoveOrder";
import { TransactConfirmation } from "./ActionModalTransact";

//Move Order List
const fetchMoveOrderListApi = async (status) => {
  const res = await request.get(`Ordering/GetTotalListForMoveOrder?status=${status}`);
  return res.data;
};

//Move Order Lists by Order No
const fetchMoveOrderViewTableApi = async (orderNo) => {
  const res = await request.get(`Ordering/ListOfMoveOrdersForTransact?orderId=${orderNo}`);
  return res.data;
};

const TransactMoveOrderPage = ({ fetchNotification }) => {
  const [status, setStatus] = useState(false);

  const [moveOrderList, setMoveOrderList] = useState([]);
  const [moveOrderViewTable, setMoveOrderViewTable] = useState([]);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const [moveOrderInformation, setMoveOrderInformation] = useState({
    orderNo: "",
    deliveryStatus: "Pick-Up",
    customerName: "",
    customerCode: "",
  });
  const orderNo = moveOrderInformation.orderNo;
  const [deliveryDate, setDeliveryDate] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const { isOpen: isTransact, onClose: closeTransact, onOpen: openTransact } = useDisclosure();

  //Get Move Order List
  const fetchMoveOrderList = () => {
    fetchMoveOrderListApi(status).then((res) => {
      setMoveOrderList(res);
      setDisplayedData(res.slice(0, itemsPerPage));
      setHasMore(res.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData.length >= moveOrderList.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(moveOrderList.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchMoveOrderList();

    return () => {
      setMoveOrderList([]);
      setDisplayedData([]);
    };
  }, [status]);

  //Get Move Order Lists by Order No
  const fetchMoveOrderViewTable = () => {
    fetchMoveOrderViewTableApi(orderNo).then((res) => {
      setMoveOrderViewTable(res);
    });
  };

  useEffect(() => {
    if (orderNo) {
      fetchMoveOrderViewTable();
    }

    return () => {
      setMoveOrderViewTable([]);
    };
  }, [orderNo]);

  const newDate = new Date();
  const maxDate = moment(newDate).format("yyyy-MM-DD");
  const minDate = moment(newDate.setDate(newDate.getDate() - 7)).format("yyyy-MM-DD");

  return (
    <>
      <Flex w="full" flexDirection="column" bg="form">
        <Flex justifyContent="space-between" w="full">
          <HStack justifyContent="space-between" mt={5} pl={5}>
            <Text fontSize="xs">Status:</Text>
            <Select fontSize="xs" onChange={(e) => setStatus(Boolean(Number(e.target.value)))}>
              <option value={0}>For Transaction</option>
              <option value={1}>Transacted Orders</option>
            </Select>
          </HStack>
          {!status && (
            <HStack justifyContent="space-between" mt={2} pr={2}>
              <Text fontSize="xs">Pick-Up Date:</Text>
              <Input
                fontSize="xs"
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={minDate}
                max={maxDate}
                isDisabled={checkedItems <= 0}
                title={checkedItems <= 0 ? "Please select items to transact first" : ""}
                type="date"
                bgColor="#fff8dc"
              />
            </HStack>
          )}
        </Flex>

        <VStack p={2} w="full" spacing={0}>
          <ListMoveOrder
            moveOrderList={moveOrderList}
            displayedData={displayedData}
            fetchMoreData={fetchMoreData}
            hasMore={hasMore}
            moveOrderInformation={moveOrderInformation}
            setMoveOrderInformation={setMoveOrderInformation}
            moveOrderViewTable={moveOrderViewTable}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            status={status}
          />
        </VStack>

        {!status && (
          <HStack justifyContent="end" mr={10} mb={3}>
            <Button onClick={() => openTransact()} title={!deliveryDate ? "Please select a delivery date first" : ""} isDisabled={!deliveryDate} size="sm" colorScheme="blue">
              Transact
            </Button>
          </HStack>
        )}
      </Flex>

      {isTransact && (
        <TransactConfirmation
          isOpen={isTransact}
          onClose={closeTransact}
          deliveryDate={deliveryDate}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          fetchMoveOrderList={fetchMoveOrderList}
          setDeliveryDate={setDeliveryDate}
          fetchNotification={fetchNotification}
          moveOrderViewTable={moveOrderViewTable}
        />
      )}
    </>
  );
};

export default TransactMoveOrderPage;
