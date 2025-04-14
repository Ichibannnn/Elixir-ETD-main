import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, HStack, Text } from "@chakra-ui/react";
import moment from "moment";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import InfiniteScroll from "react-infinite-scroll-component";

export const BorrowedMatsHistory = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [borrowedData, setBorrowedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchBorrowedHistoryApi = async (dateFrom, dateTo, search) => {
    const dayaDate = moment(dateTo).add(1, "day").format("yyyy-MM-DD");

    const res = await request.get(`Reports/BorrowedTransactionReports?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dayaDate}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchBorrowedHistory = () => {
    fetchBorrowedHistoryApi(dateFrom, dateTo, search).then((res) => {
      setBorrowedData(res);
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
            "Aging Days": item.agingDays.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Borrowed Qty": item.borrowedQuantity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Borrowed Date": moment(item.borrowedDate).format("MM-DD-YYYY"),
            "Employee Id": item.empId,
            "Employee Name": item.fullName,
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
    if (displayedData?.length >= borrowedData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(borrowedData?.inventory?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchBorrowedHistory();

    return () => {
      setBorrowedData([]);
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
                        Details
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Aging Days
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Borrowed Qty
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Borrowed Date
                      </Th>
                    </>
                  ) : (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Employee Information
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
                {displayedData?.map((item, i) => (
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
                                {item?.details}
                              </Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700" fontWeight="semibold">
                                {item?.agingDays.toLocaleString(undefined, {
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
                      </>
                    ) : (
                      <>
                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <Flex flexDirection="column" justifyContent="left">
                              <HStack fontSize="sm" spacing="5px">
                                <Text color="gray.700" fontWeight="bold">
                                  {item?.fullName}
                                </Text>
                              </HStack>

                              <HStack fontSize="xs" spacing="5px">
                                <Text color="gray.700">{item?.empId}</Text>
                              </HStack>
                            </Flex>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700">{item?.status}</Text>
                            </HStack>
                          </Flex>
                        </Td>

                        <Td>
                          <Flex flexDirection="column" gap="10px">
                            <HStack fontSize="xs" spacing="5px">
                              <Text color="gray.700">{item?.transactedBy}</Text>
                            </HStack>
                          </Flex>
                        </Td>
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
          Total Records: {borrowedData?.inventory?.length}
        </Text>

        <Button size="xs" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
