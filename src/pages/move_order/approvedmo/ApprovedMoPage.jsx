import { usePagination } from "@ajna/pagination";
import React, { useEffect, useState } from "react";
import request from "../../../services/ApiClient";
import { ApproveMoveOrder } from "./ApproveMoveOrder";
import useDebounce from "../../../hooks/useDebounce";

const fetchApprovedMOApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(`Ordering/ApprovedMoveOrderPaginationOrig?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}&status=${status}`);
  return res.data;
};

const fetchViewApi = async (orderId) => {
  const res = await request.get(`Ordering/ViewMoveOrderForApproval?id=${orderId}`);
  return res.data;
};

function ApprovedMoPage() {
  const [approvedData, setApprovedData] = useState([]);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [orderId, setOrderId] = useState("");
  const [printData, setPrintData] = useState([]);
  const [status, setStatus] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 700);

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 10 },
  });

  const fetchApprovedMO = () => {
    fetchApprovedMOApi(currentPage, pageSize, search, status).then((res) => {
      setApprovedData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchApprovedMO();

    return () => {
      setApprovedData([]);
    };
  }, [pageSize, currentPage, search, status]);

  const fetchView = () => {
    fetchViewApi(orderId).then((res) => {
      setPrintData(res);
    });
  };

  useEffect(() => {
    if (orderId) {
      fetchView();
    }

    return () => {
      setPrintData([]);
    };
  }, [orderId]);

  return (
    <ApproveMoveOrder
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      pagesCount={pagesCount}
      currentPage={currentPage}
      pageSize={pageSize}
      approvedData={approvedData}
      fetchApprovedMO={fetchApprovedMO}
      orderId={orderId}
      setOrderId={setOrderId}
      printData={printData}
      status={status}
      setStatus={setStatus}
    />
  );
}

export default ApprovedMoPage;
