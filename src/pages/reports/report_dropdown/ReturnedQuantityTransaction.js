import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, HStack, Text } from "@chakra-ui/react";
import moment from "moment";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import InfiniteScroll from "react-infinite-scroll-component";

export const ReturnedQuantityTransaction = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [returnedData, setReturnedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchReturnedHistoryApi = async (dateFrom, dateTo, search) => {
    const dayaDate = moment(dateTo).add(1, "day").format("yyyy-MM-DD");

    const res = await request.get(`Reports/BorrowedReturnedReports?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dayaDate}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchReturnedHistory = () => {
    fetchReturnedHistoryApi(dateFrom, dateTo, search).then((res) => {
      setReturnedData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            ID: item.borrowedId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            "Borrowed Qty": item.borrowedQuantity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Borrowed Date": moment(item.borrowedDate).format("MM-DD-YYYY"),
            Consumed: item.consumed.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Returned Qty": item.returnedQuantity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Returned Date": item.isApproveReturnDate ? moment(item.isApproveReturnDate).format("MM-DD-YYYY") : "-",
            "Aging Days": `${item.agingDays} Day(s)`,
            "Unit Cost": item.unitCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Line Amount": item.lineAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Service Report No.": item.reportNumber ?? "-",
            "Employee Id": item.empIdByIssue,
            "Employee Name": item.fullNameByIssue,
            "Company Code": item.companyCode ? item.companyCode : "-",
            "Company Name": item.companyName ? item.companyName : "-",
            "Business Unit Code": item.businessUnitCode ? item.businessUnitCode : "-",
            "Business Unit Name": item.businessUnitName ? item.businessUnitName : "-",
            "Department Code": item.departmentCode ? item.departmentCode : "-",
            "Department Name": item.departmentName ? item.departmentName : "-",
            "Unit Code": item.departmentUnitCode ? item.departmentUnitCode : "-",
            "Unit Name": item.departmentUnitName ? item.departmentUnitName : "-",
            "Sub Unit Code": item.subUnitCode ? item.subUnitCode : "-",
            "Sub Unit Name": item.subUnitName ? item.subUnitName : "-",
            "Location Code": item.locationCode ? item.locationCode : "-",
            "Location Name": item.locationName ? item.locationName : "-",
            "Account Code": item.accountCode ? item.accountCode : "-",
            "Account Title": item.accountTitles ? item.accountTitles : "-",
            "COA Emp ID": item.empId ? item.empId : "-",
            "COA Fullname": item.fullName ? item.fullName : "-",
            Status: item.status,
            "Transaction By": item.transactedBy,
          };
        })
      );

      setDisplayedData(res?.inventory?.slice(0, itemsPerPage));
      setHasMore(res?.inventory?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= returnedData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(returnedData?.inventory?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchReturnedHistory();

    return () => {
      setReturnedData([]);
      setDisplayedData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex className="boxShadow">
        <PageScroll minHeight="720px" maxHeight="740px">
          <InfiniteScroll dataLength={displayedData.length} next={fetchMoreData} hasMore={hasMore} loader={<h4>Loading...</h4>} height={740} scrollThreshold={0.9}>
            <Table size="md" variant="striped">
              <Thead bgColor="primary" h="40px" position="sticky" top={0} zIndex="1">
                <Tr>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Borrowed ID
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Customer Information
                  </Th>
                  {buttonChanger ? (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Item Information
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        UOM
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Borrowed Qty
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Borrowed Date
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Consumed
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Returned Qty
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Returned Date
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Aging Days
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Unit Cost
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Amount
                      </Th>
                    </>
                  ) : (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Company
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Business Unit
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Deparment
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Unit
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Sub Unit
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Location
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Account Title
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Employee
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Status
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Requested By
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {returnedData?.inventory?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{item?.borrowedId}</Td>

                    {/* Customer Information */}
                    <Td>
                      <Flex flexDirection="column" gap="10px">
                        <Flex flexDirection="column" justifyContent="left">
                          <HStack fontSize="sm" spacing="5px">
                            <Text color="gray.700" fontWeight="bold">
                              {item?.customerName}
                            </Text>
                          </HStack>

                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item?.customerCode}</Text>
                          </HStack>
                        </Flex>
                      </Flex>
                    </Td>

                    {buttonChanger ? (
                      <>
                        {/* Item Information  */}
                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <Flex flexDirection="column" justifyContent="left">
                              <HStack fontSize="sm" spacing="5px">
                                <Text color="gray.700" fontWeight="bold">
                                  {item?.itemDescription}
                                </Text>
                              </HStack>

                              <HStack fontSize="xs" spacing="5px">
                                <Text color="gray.700">{item?.itemCode}</Text>
                              </HStack>
                            </Flex>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.uom}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.borrowedQuantity.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700">{item?.borrowedDate !== null ? moment(item?.borrowedDate).format("MM/DD/yyyy") : "Pending Borrowed"}</Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.consumed.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.returnedQuantity.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700">
                                {item?.isApproveReturnDate !== null
                                  ? moment(item?.isApproveReturnDate).format("MM/DD/yyyy")
                                  : item?.isApproveReturnDate === null && item?.isActive === true
                                  ? "Pending Return"
                                  : item?.isActive === false && item?.isApproveReturnDate === null
                                  ? "Rejected"
                                  : ""}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.agingDays} Day(s)
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.unitCost?.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.lineAmount.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>
                      </>
                    ) : (
                      <>
                        {item?.companyCode && item?.companyName ? (
                          <Td fontSize="xs">
                            {item?.companyCode} - {item?.companyName}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        {item?.businessUnitCode && item?.businessUnitName ? (
                          <Td fontSize="xs">
                            {item?.businessUnitCode} - {item?.businessUnitName}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        {item?.departmentCode && item?.departmentName ? (
                          <Td fontSize="xs">
                            {item?.departmentCode} - {item?.departmentName}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        {item?.departmentUnitCode && item?.departmentUnitName ? (
                          <Td fontSize="xs">
                            {item?.departmentUnitCode} - {item?.departmentUnitName}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        {item?.subUnitCode && item?.subUnitName ? (
                          <Td fontSize="xs">
                            {item?.subUnitCode} - {item?.subUnitName}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        {item?.locationCode && item?.locationName ? (
                          <Td fontSize="xs">
                            {item?.locationCode} - {item?.locationName}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        {item?.accountCode && item?.accountTitles ? (
                          <Td fontSize="xs">
                            {item?.accountCode} - {item?.accountTitles}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        {item?.empId && item?.fullName !== "" ? (
                          <Td fontSize="xs">
                            {item?.empId} - {item?.empId}
                          </Td>
                        ) : (
                          <Td fontSize="xs">-</Td>
                        )}

                        <Td fontSize="xs">{item?.status}</Td>

                        <Td fontSize="xs">{item?.transactedBy}</Td>
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
          Total Records: {returnedData?.inventory?.length}
        </Text>

        <Button size="xs" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
