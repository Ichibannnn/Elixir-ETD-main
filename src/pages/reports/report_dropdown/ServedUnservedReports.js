import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, HStack, Text } from "@chakra-ui/react";
import moment from "moment";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import InfiniteScroll from "react-infinite-scroll-component";

export const ServedUnservedReports = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [servedUnservedData, setServedUnservedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchServedUnservedReportApi = async (dateFrom, dateTo, search) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(`Reports/MoveOrderReport?DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchServedUnservedReport = () => {
    fetchServedUnservedReportApi(dateFrom, dateTo, search).then((res) => {
      setServedUnservedData(res);
      setSheetData(res);

      setDisplayedData(res.slice(0, itemsPerPage));
      setHasMore(res?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= servedUnservedData?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(servedUnservedData?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchServedUnservedReport();

    return () => {
      setServedUnservedData([]);
      setDisplayedData([]);
    };
  }, [dateFrom, dateTo, search]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex>
        <PageScroll minHeight="720px" maxHeight="740px">
          <InfiniteScroll dataLength={displayedData?.length} next={fetchMoreData} hasMore={hasMore} loader={<h4>Loading...</h4>} height={740} scrollThreshold={0.9}>
            <Table size="sm" variant="striped">
              <Thead bgColor="primary" h="40px" position="sticky" top={0} zIndex="1">
                <Tr>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    MIR ID
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    CUSTOMER
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    ITEM INFORMATION
                  </Th>
                  {buttonChanger ? (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        ORDERED QTY
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        SERVED
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        UNSERVED
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        REASON
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        PERCENTAGE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        APPROVED DATE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        PICK-UP DATE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        STATUS
                      </Th>
                    </>
                  ) : (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        ASSET TAG
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        CIP #
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        HELPDESK NO.
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        ITEM REMARKS
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        COMPANY CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        COMPANY NAME
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        DEPARTMENT CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        DEPARTMENT NAME
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        LOCATION CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        LOCATION NAME
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        ACCOUNT TITLE CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        ACCOUNT TITLE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        EMP ID
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        FULLNAME
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{item?.mirId}</Td>

                    {/* Customer Information */}
                    <Td>
                      <Flex flexDirection="column" gap="10px">
                        <Flex flexDirection="column" justifyContent="left">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item?.customerCode} - </Text>
                          </HStack>

                          <HStack fontSize="sm" spacing="5px">
                            <Text color="gray.700" fontWeight="bold">
                              {item?.customerName}
                            </Text>
                          </HStack>
                        </Flex>
                      </Flex>
                    </Td>

                    {/* Item Information */}
                    <Td>
                      <Flex flexDirection="column" gap="10px">
                        <Flex flexDirection="column" justifyContent="left">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item?.itemCode} - </Text>
                          </HStack>

                          <HStack fontSize="sm" spacing="5px">
                            <Text color="gray.700" fontWeight="bold">
                              {item?.itemDescription}
                            </Text>
                          </HStack>

                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item?.uom}</Text>
                          </HStack>
                        </Flex>
                      </Flex>
                    </Td>

                    {buttonChanger ? (
                      <>
                        <Td fontSize="xs">
                          {item?.orderedQuantity.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {item?.servedOrder.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {item?.unservedOrder.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">{item?.remarks ? item?.remarks : "-"}</Td>
                        <Td fontSize="xs">{`${(item?.servedPercentage * 100).toFixed(0)}`}%</Td>
                        <Td fontSize="xs">{item?.approvedDate ? moment(item?.approvedDate).format("MM/DD/YYYY") : "-"}</Td>
                        <Td fontSize="xs">{item?.deliveryDate ? moment(item?.deliveryDate).format("MM/DD/YYYY") : "-"}</Td>
                        <Td fontSize="xs">{item?.status}</Td>
                      </>
                    ) : (
                      <>
                        <Td fontSize="xs">{item?.assetTag ? item?.assetTag : "-"}</Td>
                        <Td fontSize="xs">{item?.cip_No ? item?.cip_No : "-"}</Td>
                        <Td fontSize="xs">{item?.helpdeskNo ? item?.helpdeskNo : "-"}</Td>
                        <Td fontSize="xs">{item?.itemRemarks ? item?.itemRemarks : "-"}</Td>
                        <Td fontSize="xs">{item?.companyCode}</Td>
                        <Td fontSize="xs">{item?.companyName}</Td>
                        <Td fontSize="xs">{item?.departmentCode}</Td>
                        <Td fontSize="xs">{item?.departmentName}</Td>
                        <Td fontSize="xs">{item?.locationCode}</Td>
                        <Td fontSize="xs">{item?.locationName}</Td>
                        <Td fontSize="xs">{item?.accountCode ? item?.accountCode : "-"}</Td>
                        <Td fontSize="xs">{item?.accountTitles ? item?.accountTitles : "-"}</Td>
                        <Td fontSize="xs">{item?.empId ? item?.empId : "-"}</Td>
                        <Td fontSize="xs">{item?.fullname ? item?.fullname : "-"}</Td>
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
          Total Records: {servedUnservedData?.length}
        </Text>

        <Button size="md" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
