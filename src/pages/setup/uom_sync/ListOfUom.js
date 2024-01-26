import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Tbody,
  Td,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TiArrowSync } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";
import PageScroll from "../../../utils/PageScroll";
import { ToastComponent } from "../../../components/Toast";
import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import moment from "moment";
import { decodeUser } from "../../../services/decode-user";
import { ListOfErrorUom } from "./ListOfErrorUom";

export const ListOfUom = ({
  genusUom,
  fetchingData,
  fetchElixirUom,
  elixirUom,
  setElixirUom,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [errorData, setErrorData] = useState([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = decodeUser();

  // ARRAY FOR THE LIST DATA OF SUPPLIERS
  const resultArray = genusUom?.result?.map((item) => {
    return {
      uomNo: item?.id,
      uomCode: item?.code,
      uomDescription: item?.description,
      dateAdded: moment(new Date()).format("yyyy-MM-DD"),
      addedBy: currentUser.fullName,
      modifyDate: moment(new Date()).format("yyyy-MM-DD"),
      modifyBy: currentUser.fullName,
      syncDate: moment(new Date()).format("yyyy-MM-DD"),
    };
  });

  // console.log("Genus Response: ", genusUom);

  // SYNC ORDER BUTTON
  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync this list of UOM?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = request
            .put(
              `Uom/SyncUom`,
              resultArray.map((item) => {
                return {
                  uomNo: item?.uomNo,
                  uomCode: item?.uomCode,
                  uomDescription: item?.uomDescription,
                  dateAdded: item?.dateAdded,
                  addedBy: item?.addedBy,
                  modifyDate: item?.modifyDate,
                  modifyBy: item?.modifyBy,
                  syncDate: item?.syncDate,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "UOM Synced!", "success", toast);
              fetchElixirUom();
              // fetchNotification();
              // onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                // onClose();
                // console.log("Validations: ", err.response.data);
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  const filteredLength = elixirUom?.uom?.filter((val) => {
    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
    return val?.uomDescription?.toLowerCase().match(newKeyword, "*");
  });

  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    setOrdersCount(0);
    if (elixirUom?.uom) {
      elixirUom?.uom?.map((uom) => {
        setOrdersCount((prevState) => prevState + 1);
      });
    }
  }, [elixirUom]);

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
    >
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
          <HStack>
            {/* <Text>Search</Text> */}
            <InputGroup size="sm">
              <InputLeftElement
                pointerEvents="none"
                children={<FiSearch bg="black" fontSize="18px" />}
              />
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
            {/* <Text>
                
              </Text> */}
          </HStack>

          <HStack>
            <Button
              colorScheme="blue"
              size="sm"
              fontSize="13px"
              // borderRadius="none"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<TiArrowSync fontSize="19px" />}
              onClick={() => syncHandler()}
            >
              Sync
            </Button>
          </HStack>
        </Flex>

        <Flex p={4}>
          <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
            <Text color="white" fontSize="13px" textAlign="center">
              LIST OF UOM
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
                <Table
                  size="sm"
                  //   width="full"
                  // height="100%"
                  border="none"
                  boxShadow="md"
                  bg="gray.200"
                  variant="striped"
                >
                  <Thead bg="secondary" position="sticky" top={0}>
                    <Tr h="30px">
                      <Th color="#D6D6D6" fontSize="10px">
                        LINE
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        UOM CODE
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        UOM DESCRIPTION
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Date Added
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Added By
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Sync Status
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elixirUom?.uom
                      ?.filter((val) => {
                        const newKeyword = new RegExp(
                          `${keyword.toLowerCase()}`
                        );
                        return val?.uomDescription
                          ?.toLowerCase()
                          .match(newKeyword, "*");
                      })
                      ?.map((uom, i) => (
                        <Tr key={i}>
                          <Td fontSize="12px">{i + 1}</Td>
                          <Td fontSize="12px">{uom.id}</Td>
                          {/* <Td fontSize="12px" pl="100px"></Td> */}
                          <Td fontSize="12px">{uom.uomCode}</Td>
                          <Td fontSize="12px">{uom.uomDescription}</Td>
                          <Td fontSize="12px">
                            {moment(uom.dateAdded).format("yyyy/MM/DD")}
                          </Td>
                          <Td fontSize="12px">{uom.addedBy}</Td>
                          <Td fontSize="12px">{uom.syncStatus}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>
          </VStack>
        </Flex>

        <Flex justifyContent="space-between">
          <HStack>
            <Badge colorScheme="cyan">
              <Text color="secondary">
                {!keyword
                  ? `Number of records: ${ordersCount} `
                  : `Number of records from ${keyword}: ${filteredLength.length}`}
                {/* Number of Records: {elixirSuppliers?.supplier?.length} */}
              </Text>
            </Badge>
          </HStack>
          <HStack>
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
          </HStack>
          {/* <Text fontSize="12px">Sync Date: "11/11/23"</Text> */}
        </Flex>

        {isOpen && (
          <ListOfErrorUom
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            // resultArray={resultArray}
            errorData={errorData}
            setErrorData={setErrorData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchElixirUom={fetchElixirUom}
          />
        )}
      </Flex>
    </Flex>
  );
};
