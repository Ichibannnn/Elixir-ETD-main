import React, { useState, useEffect } from "react";
import { Flex, VStack } from "@chakra-ui/react";

import request from "../../../../services/ApiClient";
import { usePagination } from "@ajna/pagination";

import { ListOfOrders } from "./ListOfOrders";
import { ListOfMir } from "./ListOfMir";
import useDebounce from "../../../../hooks/useDebounce";

const NewPrepSched = ({ notification, fetchNotification }) => {
  const [selectedMIRIds, setSelectedMIRIds] = useState([]);

  const [mirList, setMirList] = useState([]);
  const [rushOrders, setRushOrders] = useState([]);
  const [regularOrders, setRegularOrders] = useState([]);
  const [regularOrdersCount, setRegularOrdersCount] = useState(0);
  const [rushOrdersCount, setRushOrdersCount] = useState(0);

  const [checkedItems, setCheckedItems] = useState([]);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [disableScheduleButton, setDisableScheduleButton] = useState(true);

  const [status, setStatus] = useState(false);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 700);

  const fetchMirListApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(`Ordering/GetAllListOfMir?PageNumber=${pageNumber}&PageSize=${pageSize}&status=${status}`, {
      params: {
        search: search,
      },
    });

    return response.data;
  };

  //SHOW MIRLIST DATA----
  const fetchMirList = () => {
    fetchMirListApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setMirList(res);
      setPageTotal(res.totalCount);
    });
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

  useEffect(() => {
    fetchMirList();

    return () => {
      setMirList([]);
    };
  }, [currentPage, pageSize, status, search]);

  return (
    <Flex color="fontColor" w="full" flexDirection="column" p={2} bg="white">
      <VStack w="full">
        <ListOfMir
          status={status}
          setStatus={setStatus}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          mirList={mirList}
          setMirList={setMirList}
          regularOrdersCount={regularOrdersCount}
          rushOrdersCount={rushOrdersCount}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          setDisableScheduleButton={setDisableScheduleButton}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          rushOrders={rushOrders}
          regularOrders={regularOrders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          pagesCount={pagesCount}
          pages={pages}
          notification={notification}
          fetchNotification={fetchNotification}
        />

        <ListOfOrders
          setCurrentPage={setCurrentPage}
          setSearchValue={setSearchValue}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          fetchMirList={fetchMirList}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
          disableScheduleButton={disableScheduleButton}
          setDisableScheduleButton={setDisableScheduleButton}
          fetchNotification={fetchNotification}
        />
      </VStack>
    </Flex>
  );
};

export default NewPrepSched;
