import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, Text } from "@chakra-ui/react";
import moment from "moment";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import InfiniteScroll from "react-infinite-scroll-component";

export const ConsolidatedReportsAudit = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [buttonChanger, setButtonChanger] = useState(true);
  const [consolidatedData, setConsolidatedData] = useState([]);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchConsolidatedApi = async (dateFrom, dateTo, search) => {
    const res = await request.get(`Reports/ConsolidateAuditReport?DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        Search: search,
      },
    });
    return res.data;
  };

  const fetchConsolidated = () => {
    fetchConsolidatedApi(dateFrom, dateTo, search).then((res) => {
      setConsolidatedData(res);
      setSheetData(res);
      setDisplayedData(res.slice(0, itemsPerPage));
      setHasMore(res.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData.length >= consolidatedData.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(consolidatedData.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchConsolidated();

    return () => {
      setConsolidatedData([]);
      setDisplayedData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex>
        <PageScroll minHeight="720px" maxHeight="740px">
          <InfiniteScroll dataLength={displayedData.length} next={fetchMoreData} hasMore={hasMore} loader={<h4>Loading...</h4>} height={740} scrollThreshold={0.9}>
            <Table size="sm" variant="striped">
              <Thead bgColor="primary" h="40px" position="sticky" top={0} zIndex="1">
                <Tr>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    ID
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Transaction Date
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Item Code
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Item Description
                  </Th>
                  {buttonChanger ? (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        UOM
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Category
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Quantity
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Unit Cost
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Line Amount
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Source
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Transaction Type
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Status
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Reason
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Reference
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Diesel PO#
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Encoded By
                      </Th>
                    </>
                  ) : (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Company Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Company Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Business Unit Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Business Unit Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Department Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Department Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Unit Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Unit Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Sub Unit Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Sub Unit Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Location Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Location Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Account Title Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Account Title
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        EmpID
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Fullname
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Asset Tag
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        CIP #
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Helpdesk #
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Remarks
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Rush
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>

              <Tbody>
                {displayedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{item?.id}</Td>
                    <Td fontSize="xs">{item?.transactionDate ? moment(item?.transactionDate).format("YYYY-MM-DD") : "-"}</Td>
                    <Td fontSize="xs">{item?.itemCode}</Td>
                    <Td fontSize="xs">{item?.itemDescription}</Td>
                    {buttonChanger ? (
                      <>
                        <Td fontSize="xs">{item?.uom}</Td>
                        <Td fontSize="xs">{item?.category}</Td>
                        <Td fontSize="xs">
                          {item?.quantity.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {item?.unitCost.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {item?.lineAmount.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">{item?.source}</Td>
                        <Td fontSize="xs">{item?.transactionType ? item?.transactionType : "-"}</Td>
                        <Td fontSize="xs">{item?.status ? item?.status : "-"}</Td>
                        <Td fontSize="xs">{item?.reason ? item?.reason : "-"}</Td>
                        <Td fontSize="xs">{item?.reference ? item?.reference : "-"}</Td>
                        <Td fontSize="xs">{item?.dieselPoNumber ? item?.dieselPoNumber : "-"}</Td>
                        <Td fontSize="xs">{item?.encodedBy}</Td>
                      </>
                    ) : (
                      <>
                        <Td fontSize="xs">{item?.companyCode}</Td>
                        <Td fontSize="xs">{item?.companyName}</Td>
                        <Td fontSize="xs">{item?.businessUnitCode ? item?.businessUnitCode : "-"}</Td>
                        <Td fontSize="xs">{item?.businessUnitName ? item?.businessUnitName : "-"}</Td>
                        <Td fontSize="xs">{item?.departmentCode}</Td>
                        <Td fontSize="xs">{item?.departmentName}</Td>
                        <Td fontSize="xs">{item?.departmentUnitCode ? item?.departmentUnitCode : "-"}</Td>
                        <Td fontSize="xs">{item?.departmentUnitName ? item?.departmentUnitName : "-"}</Td>
                        <Td fontSize="xs">{item?.subUnitCode ? item?.subUnitCode : "-"}</Td>
                        <Td fontSize="xs">{item?.subUnitName ? item?.subUnitName : "-"}</Td>
                        <Td fontSize="xs">{item?.locationCode}</Td>
                        <Td fontSize="xs">{item?.locationName}</Td>
                        <Td fontSize="xs">{item?.accountTitleCode ? item?.accountTitleCode : "-"}</Td>
                        <Td fontSize="xs">{item?.accountTitle ? item?.accountTitle : "-"}</Td>
                        <Td fontSize="xs">{item?.empId ? item?.empId : "-"}</Td>
                        <Td fontSize="xs">{item?.fullname ? item?.fullname : "-"}</Td>
                        <Td fontSize="xs">{item?.assetTag ? item?.assetTag : "-"}</Td>
                        <Td fontSize="xs">{item?.cipNo ? item?.cipNo : "-"}</Td>
                        <Td fontSize="xs">{item?.helpdesk ? item?.helpdesk : "-"}</Td>
                        <Td fontSize="xs">{item?.remarks ? item?.remarks : "-"}</Td>
                        <Td fontSize="xs">{item?.rush ? item?.rush : "-"}</Td>
                      </>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </InfiniteScroll>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {consolidatedData?.length}
        </Text>

        <Button size="md" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
