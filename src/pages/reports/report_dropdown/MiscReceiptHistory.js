import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, Text } from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import moment from "moment";
import PageScroll from "../../../utils/PageScroll";
import InfiniteScroll from "react-infinite-scroll-component";

export const MiscReceiptHistory = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [miscReceiptData, setMiscReceiptData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchMiscellaenouseReceiptApi = async (dateFrom, dateTo, search) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(`Reports/MiscellaneousReceiptReport?PageNumber=1&PageSize=1000000&DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchMiscellaenouseReceipt = () => {
    fetchMiscellaenouseReceiptApi(dateFrom, dateTo, search).then((res) => {
      setMiscReceiptData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Receipt Id": item.receiptId,
            "Supplier Code": item.supplierCode,
            "Supplier Name": item.supplierName,
            Details: item.details,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            Quantity: item.quantity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Unit Cost": item.unitCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            // 'Expiration Date': item.expirationDate,
            "Transacted By": item.trantedBy,
            "Transaction Date": new Date(moment(item.transactDate).format("MM/DD/YYYY")),
          };
        })
      );

      setDisplayedData(res?.inventory?.slice(0, itemsPerPage));
      setHasMore(res?.inventory?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= miscReceiptData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(miscReceiptData?.inventory?.slice(displayedData.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchMiscellaenouseReceipt();

    return () => {
      setMiscReceiptData([]);
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
                    Receipt ID
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Receipt Date
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Supplier Code
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    Supplier Name
                  </Th>
                  {buttonChanger ? (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Details
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Item Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Item Description
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        UOM
                      </Th>
                      {/* <Th color='white'>category</Th> */}
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Quantity
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Unit Cost
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Transacted By
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Transaction Date
                      </Th>
                    </>
                  ) : (
                    <>
                      {/* <Th color='white'>Expiration Date</Th> */}
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Company Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Company Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Department Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Department Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Location Code
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Location Name
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        Account Title
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{item.receiptId}</Td>
                    <Td fontSize="xs">{item.receivingDate}</Td>
                    <Td fontSize="xs">{item.supplierCode}</Td>
                    <Td fontSize="xs">{item.supplierName}</Td>
                    {buttonChanger ? (
                      <>
                        <Td fontSize="xs">{item.details}</Td>
                        <Td fontSize="xs">{item.itemCode}</Td>
                        <Td fontSize="xs">{item.itemDescription}</Td>
                        <Td fontSize="xs">{item.uom}</Td>
                        {/* <Td>{item.category}</Td> */}
                        <Td fontSize="xs">
                          {item.quantity.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">
                          {item.unitCost.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">{item.transactBy}</Td>
                        <Td fontSize="xs">{moment(item.transactDate).format("yyyy-MM-DD")}</Td>
                      </>
                    ) : (
                      <>
                        {/* <Td>{item.expirationDate}</Td> */}
                        <Td fontSize="xs">{item.companyCode}</Td>
                        <Td fontSize="xs">{item.companyName}</Td>
                        <Td fontSize="xs">{item.departmentCode}</Td>
                        <Td fontSize="xs">{item.departmentName}</Td>
                        <Td fontSize="xs">{item.locationCode}</Td>
                        <Td fontSize="xs">{item.locationName}</Td>
                        <Td fontSize="xs">{item.accountTitles}</Td>
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
          Total Records: {miscReceiptData?.inventory?.length}
        </Text>
        <Button size="xs" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
