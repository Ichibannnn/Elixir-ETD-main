import React, { useState } from "react";
import { Button, Flex, HStack, VStack } from "@chakra-ui/react";
import FuelRequestsTab from "./fuel_request_tab/FuelRequestsTab";
import FuelApprovedTab from "./fuel_approved_tab_requestor/FuelApprovedTab";
import FuelReqRejectedTab from "./fuel_rejected_tab_requestor/FuelReqRejectedTab";

const FuelRequest = ({ notification, fetchNotification }) => {
  const [navigation, setNavigation] = useState(1);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0} w="full">
          <Button
            w="10%"
            bgColor={navigation === 1 ? "primary" : ""}
            color={navigation === 1 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(1)}
            borderRadius="none"
          >
            Requests
            {/* {notification?.borrowedApproval?.forborrowedApprovalcount === 0 ? (
              ""
            ) : (
              <Badge ml={2} fontSize="10px" variant="solid" colorScheme="red" mb={1}>
                {notification?.borrowedApproval?.forborrowedApprovalcount}
              </Badge>
            )} */}
          </Button>

          <Button
            w="10%"
            bgColor={navigation === 2 ? "primary" : ""}
            color={navigation === 2 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(2)}
            borderRadius="none"
          >
            Approved
          </Button>

          <Button
            w="10%"
            bgColor={navigation === 3 ? "primary" : ""}
            color={navigation === 3 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(3)}
            borderRadius="none"
          >
            Rejected
          </Button>
        </HStack>
      </Flex>

      <VStack h="90vh" className="boxShadow" w="full" p={2} bg="form">
        {navigation === 1 ? (
          <>
            <FuelRequestsTab navigation={navigation} fetchNotification={fetchNotification} />
          </>
        ) : navigation === 2 ? (
          <>
            <FuelApprovedTab navigation={navigation} />
          </>
        ) : navigation === 3 ? (
          <>
            <FuelReqRejectedTab navigation={navigation} />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default FuelRequest;
