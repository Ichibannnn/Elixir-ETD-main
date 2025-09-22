import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, HStack, Text } from "@chakra-ui/react";
import moment from "moment";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import InfiniteScroll from "react-infinite-scroll-component";

export const FuelRegister = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [fuelRegisterData, setFuelRegisterData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const [displayedData, setDisplayedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 50;

  const fetchFuelRegisterApi = async (dateFrom, dateTo, search) => {
    const dayaDate = new Date();
    const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
    const res = await request.get(`Reports/FuelRegisterReports?DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        search: search,
      },
    });
    return res.data;
  };

  const fetchFuelRegister = () => {
    fetchFuelRegisterApi(dateFrom, dateTo, search).then((res) => {
      setFuelRegisterData(res);
      setSheetData(
        res?.inventory?.map((item, i) => {
          return {
            Source: item.source,
            "Issuance Date": item.issuanceDate,
            "Item Code": item.item_Code,
            "Item Description": item.item_Description,
            Liters: item.liters.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            Assets: item.asset ? item.asset : "-",
            "Unit Cost": item.unit_Cost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            "Line Amount": item.lineAmount,
            Month: item.month,
            Requestor: item.requestorName,
            Remarks: item.remarks ? item.remarks : "-",
            "Account Title Code": item.account_Title_Code ? item.account_Title_Code : "-",
            "Account Title": item.account_Title_Name ? item.account_Title_Name : "-",
            "Employee ID": item.empId ? item.empId : "-",
            Fullname: item.fullname ? item.fullname : "-",
            "Company Code": item.company_Code ? item.company_Code : "-",
            Company: item.company_Name ? item.company_Name : "-",
            "Business Unit Code": item.businessUnitCode ? item.businessUnitCode : "-",
            "Business Unit": item.businessUnitName ? item.businessUnitName : "-",
            "Department Code": item.department_Code ? item.department_Code : "-",
            Department: item.department_Name ? item.department_Name : "-",
            "Unit Code": item.departmentUnitCode ? item.departmentUnitCode : "-",
            Unit: item.departmentUnitName ? item.departmentUnitName : "-",
            "Sub Unit Code": item.subUnitCode ? item.subUnitCode : "-",
            "Sub Unit": item.subUnitName ? item.subUnitName : "-",
            "Location Code": item.location_Code ? item.location_Code : "-",
            Location: item.location_Name ? item.location_Name : "-",
            "CIP #": item.cipNo !== "" ? item.cipNo : "-",
            "Diesel PO#": item.dieselPONumber,
            Odometer: item.odometer ? item.odometer : "N/A",
            "Diesel Pump": item.fuelPump !== "" ? item.fuelPump : "-",
          };
        })
      );

      setDisplayedData(res.inventory?.slice(0, itemsPerPage));
      setHasMore(res?.inventory?.length > itemsPerPage);
    });
  };

  const fetchMoreData = () => {
    if (displayedData?.length >= fuelRegisterData?.inventory?.length) {
      setHasMore(false);
      return;
    }
    setDisplayedData(displayedData.concat(fetchFuelRegister?.slice(fuelRegisterData.inventory?.length, displayedData.length + itemsPerPage)));
  };

  useEffect(() => {
    fetchFuelRegister();

    return () => {
      setFuelRegisterData([]);
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
                    SOURCE
                  </Th>
                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    ITEM INFORMATION
                  </Th>

                  <Th color="white" fontSize="10px" fontWeight="semibold">
                    ISSUANCE DATE
                  </Th>

                  {buttonChanger ? (
                    <>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        LITERS
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        ASSET
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        UNIT COST
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        LINE AMOUNT
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        MONTH
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        REQUESTOR
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        REMARKS
                      </Th>
                    </>
                  ) : (
                    <>
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
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        COMPANY CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        COMPANY
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        BUSINESS UNIT CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        BUSINESS UNIT
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        DEPARTMENT CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        DEPARTMENT
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        UNIT CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        UNIT
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        SUB UNIT CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        SUB UNIT
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        LOCATION CODE
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        LOCATION
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        CIP #
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        DIESEL PO#
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        ODOMETER
                      </Th>
                      <Th color="white" fontSize="10px" fontWeight="semibold">
                        DIESEL PUMP
                      </Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td>
                      <HStack fontSize="sm" spacing="5px">
                        <Text color="gray.700" fontWeight="bold">
                          {item?.source}
                        </Text>
                      </HStack>
                    </Td>

                    {/* Item Information */}
                    <Td>
                      <Flex flexDirection="column" gap="10px">
                        <Flex flexDirection="column" justifyContent="left">
                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item?.item_Code} - </Text>
                          </HStack>

                          <HStack fontSize="sm" spacing="5px">
                            <Text color="gray.700" fontWeight="bold">
                              {item?.item_Description}
                            </Text>
                          </HStack>

                          <HStack fontSize="xs" spacing="5px">
                            <Text color="gray.700">{item?.uom}</Text>
                          </HStack>
                        </Flex>
                      </Flex>
                    </Td>

                    <Td fontSize="xs">{item?.issuanceDate ? item?.issuanceDate : "-"}</Td>

                    {buttonChanger ? (
                      <>
                        <Td fontSize="xs">
                          {item?.liters.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </Td>
                        <Td fontSize="xs">{item?.asset ? item?.asset : "-"}</Td>
                        <Td fontSize="xs">{parseFloat(item?.unit_Cost).toFixed(2)}</Td>
                        <Td fontSize="xs">{parseFloat(item?.lineAmount).toFixed(2)}</Td>
                        <Td fontSize="xs">{item?.month ? item?.month : "-"}</Td>
                        <Td fontSize="xs">{item?.requestorName ? item?.requestorName : "-"}</Td>
                        <Td fontSize="xs">{item?.remarks ? item?.remarks : "-"}</Td>
                      </>
                    ) : (
                      <>
                        <Td fontSize="xs">{item?.account_Title_Code ? item?.account_Title_Code : "-"}</Td>
                        <Td fontSize="xs">{item?.account_Title_Name ? item?.account_Title_Name : "-"}</Td>
                        <Td fontSize="xs">{item?.empId ? item?.empId : "-"}</Td>
                        <Td fontSize="xs">{item?.fullname ? item?.fullname : "-"}</Td>
                        <Td fontSize="xs">{item?.company_Code}</Td>
                        <Td fontSize="xs">{item?.company_Name}</Td>
                        <Td fontSize="xs">{item?.businessUnitCode}</Td>
                        <Td fontSize="xs">{item?.businessUnitName}</Td>
                        <Td fontSize="xs">{item?.department_Code}</Td>
                        <Td fontSize="xs">{item?.department_Name}</Td>
                        <Td fontSize="xs">{item?.departmentUnitCode}</Td>
                        <Td fontSize="xs">{item?.departmentUnitName}</Td>
                        <Td fontSize="xs">{item?.subUnitCode}</Td>
                        <Td fontSize="xs">{item?.subUnitName}</Td>
                        <Td fontSize="xs">{item?.location_Code}</Td>
                        <Td fontSize="xs">{item?.location_Name}</Td>
                        <Td fontSize="xs">{item?.cipNo !== "" ? item?.cipNo : "-"}</Td>
                        <Td fontSize="xs">{item?.dieselPONumber ? item?.dieselPONumber : "-"}</Td>
                        <Td fontSize="xs">
                          {item?.odometer
                            ? item?.odometer.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })
                            : "-"}
                        </Td>
                        <Td fontSize="xs">{item?.fuelPump ? item?.fuelPump : "-"}</Td>
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
          Total Records: {fuelRegisterData?.inventory?.length}
        </Text>

        <Button size="md" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
