import React, { useState, useEffect } from "react";
import { ListofApprovedDate } from "./ListOfApprovedDate";

import { useToast, VStack } from "@chakra-ui/react";
import { usePagination } from "@ajna/pagination";
import request from "../../services/ApiClient";

import { ListOfOrders } from "./ListOfOrders";
import { ActualItemQuantity } from "./ActualItemQuantity";
import { SaveButton } from "./ActionModal";
import { PreparedItem } from "./PreparedItem";

const MoveOrder = ({ notification, fetchNotification }) => {
  const [batchNumber, setBatchNumber] = useState("");
  const [moveData, setMoveData] = useState([]);
  const [lengthIndicator, setLengthIndicator] = useState("");

  const [orderId, setOrderId] = useState("");
  const [orderListData, setOrderListData] = useState([]);

  const [highlighterId, setHighlighterId] = useState("");

  const [qtyOrdered, setQtyOrdered] = useState("");
  const [preparedQty, setPreparedQty] = useState("");

  const [warehouseId, setWarehouseId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [barcodeData, setBarcodeData] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [pageTotal, setPageTotal] = useState(undefined);

  const [preparedData, setPreparedData] = useState([]);

  let [buttonChanger, setButtonChanger] = useState(false);

  const fetchApprovedMoveOrdersApi = async (pageNumber, pageSize, status, search) => {
    const res = await request.get(`Ordering/GetAllListOfApprovedPreparedforMoveOrder?PageNumber=${pageNumber}&PageSize=${pageSize}&status=${status}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  //List of Orders
  const fetchOrderListApi = async (orderId) => {
    const res = await request.get(`Ordering/GetAllListOfOrdersForMoveOrder?id=${orderId}`);
    return res.data;
  };

  const fetchBarcodeDetailsApi = async (warehouseId, itemCode) => {
    const res = await request.get(`Ordering/GetAvailableStockFromWarehouse`, {
      params: {
        id: warehouseId,
        itemCode: itemCode,
      },
    });
    return res.data;
  };

  //Prepared Items
  const fetchPreparedItemsApi = async (orderId) => {
    const res = await request.get(`Ordering/ListOfPreparedItemsForMoveOrder?id=${orderId}`);
    return res.data;
  };

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  //Approved Move Orders
  const fetchApprovedMoveOrders = () => {
    fetchApprovedMoveOrdersApi(currentPage, pageSize, status, search).then((res) => {
      setMoveData(res);
      setLengthIndicator(res.length);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchApprovedMoveOrders();

    return () => {
      setMoveData([]);
    };
  }, [currentPage, pageSize, status, search]);

  //List of Orders
  const fetchOrderList = () => {
    fetchOrderListApi(orderId).then((res) => {
      setOrderListData(res);
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderList();
    }

    return () => {
      setOrderListData([]);
    };
  }, [orderId]);

  //Barcode Details
  const toast = useToast();
  const fetchBarcodeDetails = () => {
    fetchBarcodeDetailsApi(warehouseId, itemCode)
      .then((res) => {
        setBarcodeData(res);
      })
      .catch((err) => {
        console.log("Error", err.response.data, "error", toast);
      });
  };

  useEffect(() => {
    if (warehouseId && itemCode) {
      fetchBarcodeDetails();
    }

    return () => {
      setBarcodeData([]);
    };
  }, [warehouseId, itemCode]);

  //Prepared Items
  const fetchPreparedItems = () => {
    fetchPreparedItemsApi(orderId).then((res) => {
      setPreparedData(res);
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchPreparedItems();
    }

    return () => {
      setPreparedData([]);
    };
  }, [orderId]);

  //UseEffect for button change Add-Save
  useEffect(() => {
    if (orderListData.length > 0) {
      const variable = orderListData.every((item) => item.preparedQuantity === item.quantityOrder);
      setButtonChanger(variable);
    }
  }, [orderListData]);

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  return (
    <>
      <VStack color="fontColor" w="full" p={4} bg="form">
        <ListofApprovedDate
          moveData={moveData}
          status={status}
          setStatus={setStatus}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pagesCount={pagesCount}
          pages={pages}
          setOrderId={setOrderId}
          orderId={orderId}
          setItemCode={setItemCode}
          setWarehouseId={setWarehouseId}
          setHighlighterId={setHighlighterId}
          setBatchNumber={setBatchNumber}
          buttonChanger={buttonChanger}
          setButtonChanger={setButtonChanger}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          lengthIndicator={lengthIndicator}
          preparedLength={preparedData?.length}
          search={search}
          setSearch={setSearch}
          notification={notification}
          fetchNotification={fetchNotification}
        />
        {orderId ? (
          <ListOfOrders
            orderListData={orderListData}
            setItemCode={setItemCode}
            highlighterId={highlighterId}
            setHighlighterId={setHighlighterId}
            setQtyOrdered={setQtyOrdered}
            setPreparedQty={setPreparedQty}
            status={status}
          />
        ) : (
          ""
        )}
        {buttonChanger ? (
          <SaveButton
            orderId={orderId}
            batchNumber={batchNumber}
            orderListData={orderListData}
            fetchPreparedItems={fetchPreparedItems}
            fetchApprovedMoveOrders={fetchApprovedMoveOrders}
            fetchOrderList={fetchOrderList}
            setOrderId={setOrderId}
            setHighlighterId={setHighlighterId}
            setItemCode={setItemCode}
            setButtonChanger={setButtonChanger}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            moveData={moveData}
            fetchNotification={fetchNotification}
          />
        ) : (
          itemCode &&
          highlighterId && (
            <ActualItemQuantity
              setWarehouseId={setWarehouseId}
              warehouseId={warehouseId}
              barcodeData={barcodeData}
              orderId={orderId}
              highlighterId={highlighterId}
              itemCode={itemCode}
              fetchOrderList={fetchOrderList}
              fetchPreparedItems={fetchPreparedItems}
              qtyOrdered={qtyOrdered}
              preparedQty={preparedQty}
              setHighlighterId={setHighlighterId}
              setItemCode={setItemCode}
              fetchBarcodeDetails={fetchBarcodeDetails}
            />
          )
        )}
        {preparedData.length > 0 && (
          <PreparedItem preparedData={preparedData} fetchPreparedItems={fetchPreparedItems} fetchOrderList={fetchOrderList} fetchNotification={fetchNotification} />
        )}
      </VStack>
    </>
  );
};

export default MoveOrder;
