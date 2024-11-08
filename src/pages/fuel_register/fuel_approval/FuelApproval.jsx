import React, { useState } from "react";
import { Button, Flex, HStack, VStack } from "@chakra-ui/react";
import ApproverPendingTab from "./fuel_approval_pending_approver/ApproverPendingTab";
import ApproverApprovedTab from "./fuel_approval_approved_approver/ApproverApprovedTab";
import ApproverRejectedTab from "./fuel_approvaL_rejected_approver/ApproverRejectedTab";

const FuelApproval = ({ notification, fetchNotification }) => {
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
            For Approval
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
            <ApproverPendingTab navigation={navigation} fetchNotification={fetchNotification} />
          </>
        ) : navigation === 2 ? (
          <>
            <ApproverApprovedTab navigation={navigation} />
          </>
        ) : navigation === 3 ? (
          <>
            <ApproverRejectedTab navigation={navigation} />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default FuelApproval;
