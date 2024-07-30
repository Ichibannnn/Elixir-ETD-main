import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import PageNotFound from "../../src/assets/PageNotFound.json";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Flex w="full" h="auto" alignItems="center" justifyContent="center" bg="form" flexDirection="column" gap={0}>
      <Lottie mb={5} style={{ width: "full", height: "700px", padding: 0 }} animationData={PageNotFound} />
      <Button
        mb={5}
        w="15%"
        size="sm"
        fontSize="13px"
        colorScheme="blue.300"
        variant="outline"
        _hover={{ bg: "primary", color: "white" }}
        onClick={() => {
          navigate("/login");
        }}
      >
        Back to login
      </Button>
    </Flex>
  );
};

export default ErrorPage;
