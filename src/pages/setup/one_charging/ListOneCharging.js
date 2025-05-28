import React, { useEffect, useState } from "react";
import { Badge, Flex, HStack, Input, InputGroup, InputLeftElement, Skeleton, Stack, Table, Text, Th, Thead, Tr, VStack, Tbody, Td } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

import PageScroll from "../../../utils/PageScroll";

export const ListOneCharging = ({ fetchingData, oneChargingData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  //   const filteredLength = oneChargingData?.filter((val) => {
  //     const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
  //     return val?.name?.toLowerCase().match(newKeyword, "*");
  //   });

  const [count, setCount] = useState(0);

  //   useEffect(() => {
  //     setCount(0);
  //     if (oneChargingData) {
  //       oneChargingData?.map(() => {
  //         setCount((prevState) => prevState + 1);
  //       });
  //     }
  //   }, [oneChargingData]);

  return (
    <Flex color="fontColor" h="auto" w="full" flexDirection="column" p={2} bg="form">
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
          <HStack>
            {/* <Text>Search</Text> */}
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" children={<FiSearch bg="black" fontSize="18px" />} />
              <Input
                w="230px"
                fontSize="13px"
                size="sm"
                type="text"
                placeholder="Search: ex. UOM Description"
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
                borderColor="gray.200"
                _hover={{ borderColor: "gray.400" }}
              />
            </InputGroup>
          </HStack>
        </Flex>

        <Flex p={4}>
          <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
            <Text color="white" fontSize="13px" textAlign="center">
              LIST OF CHARGING
            </Text>
          </VStack>
        </Flex>

        <Flex p={4}>
          <VStack w="100%" mt={-8}>
            <PageScroll minHeight="670px" maxHeight="740px">
              {fetchingData ? (
                <Stack width="full">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table size="sm" border="none" boxShadow="md" bg="gray.200" variant="striped">
                  <Thead bg="secondary" position="sticky" top={0}>
                    <Tr h="30px">
                      <Th color="#D6D6D6" fontSize="10px">
                        CODE
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        NAME
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        SYNC ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        COMPANY
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        BUSINESS UNIT
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        DEPARTMENT
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        UNIT
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        SUB UNIT
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        LOCATION
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        ACCOUNT TITLE
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {oneChargingData
                      //   ?.filter((val) => {
                      //     const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
                      //     return val?.name?.toLowerCase().match(newKeyword, "*");
                      //   })
                      ?.map((item, i) => (
                        <Tr key={i}>
                          <Td fontSize="12px">{item.code}</Td>
                          <Td fontSize="12px">{item.name}</Td>
                          <Td fontSize="12px">{item.sync_id}</Td>
                          <Td fontSize="12px">{`${item.company_code} - ${item.company_name}`}</Td>
                          <Td fontSize="12px">{`${item.business_unit_code} - ${item.business_unit_name}`}</Td>
                          <Td fontSize="12px">{`${item.department_code} - ${item.department_name}`}</Td>
                          <Td fontSize="12px">{`${item.unit_code} - ${item.unit_name}`}</Td>
                          <Td fontSize="12px">{`${item.sub_unit_code} - ${item.sub_unit_name}`}</Td>
                          <Td fontSize="12px">{`${item.location_code} - ${item.location_name}`}</Td>
                          <Td fontSize="12px">{`${item.account_title_code} - ${item.account_title_name}`}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>
          </VStack>
        </Flex>

        <Flex justifyContent="space-between">
          {/* <HStack>
            <Badge colorScheme="cyan">
              <Text color="secondary">{!keyword ? `Number of records: ${count} ` : `Number of records from ${keyword}: ${filteredLength.length}`}</Text>
            </Badge>
          </HStack> */}
          {/* <HStack>
            <Badge colorScheme="cyan">
              <Text color="primary" fontSize="12px">
                Sync Date:{" "}
              </Text>
              {elixirUom?.uom?.length === 0 ? (
                ""
              ) : (
                <Text color="primary" fontSize="12px">
                  {moment(elixirUom?.uom?.syncDate).format("MM/DD/yyyy")}
                </Text>
              )}
            </Badge>
          </HStack> */}
        </Flex>
      </Flex>
    </Flex>
  );
};
