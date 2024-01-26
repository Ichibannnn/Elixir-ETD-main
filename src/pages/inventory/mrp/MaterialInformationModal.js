import {
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { MdGridView } from "react-icons/md";

export const MaterialInformationModal = ({ isOpen, onClose, rawMatsInfo }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="primary">
            <Flex justifyContent="left" gap={1} p={0} alignItems="center">
              <MdGridView color="white" />
              <Text fontSize="xs" color="white">
                Material Information
              </Text>
            </Flex>
          </ModalHeader>
          {/* <ModalCloseButton onClick={onClose} /> */}

          <ModalBody>
            <Flex justifyContent="center" flexDirection="column" w="full" p={2}>
              <HStack>
                <VStack w="full" spacing={-1}>
                  <Text
                    w="full"
                    fontWeight="semibold"
                    color="black"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Item Code:{" "}
                  </Text>
                  <Input
                    borderRadius="none"
                    w="95%"
                    fontSize="xs"
                    readOnly
                    bgColor="gray.300"
                    value={rawMatsInfo.itemCode}
                  />
                </VStack>
                <VStack w="full" spacing={-1}>
                  <Text
                    w="full"
                    fontWeight="semibold"
                    color="black"
                    pl={2}
                    pr={10}
                    py={2.5}
                    fontSize="xs"
                  >
                    Item Description:{" "}
                  </Text>
                  <Input
                    w="98%"
                    borderRadius="none"
                    fontSize="xs"
                    readOnly
                    bgColor="gray.300"
                    value={rawMatsInfo.itemDescription}
                  />
                </VStack>
              </HStack>

              <HStack>
                <VStack w="full" spacing={-1}>
                  <Text
                    w="full"
                    fontWeight="semibold"
                    color="black"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Stock on Hand:{" "}
                  </Text>
                  <Input
                    w="95%"
                    borderRadius="none"
                    fontSize="xs"
                    readOnly
                    bgColor="gray.300"
                    value={rawMatsInfo.soh.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  />
                </VStack>
                <VStack w="full" spacing={-1}>
                  <Text
                    w="full"
                    fontWeight="semibold"
                    color="black"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Buffer Level:{" "}
                  </Text>
                  <Input
                    w="95%"
                    borderRadius="none"
                    fontSize="xs"
                    readOnly
                    bgColor="gray.300"
                    value={rawMatsInfo.bufferLevel.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  />
                </VStack>
              </HStack>

              <HStack>
                <VStack w="full" spacing={-1}>
                  <Text
                    w="full"
                    fontWeight="semibold"
                    color="black"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Average Issuance:{" "}
                  </Text>
                  <Input
                    w="95%"
                    readOnly
                    borderRadius="none"
                    bgColor="gray.300"
                    fontSize="xs"
                    value={rawMatsInfo.averageIssuance.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}
                  />
                </VStack>
                <VStack w="full" spacing={-1}>
                  <Text
                    w="full"
                    fontWeight="semibold"
                    color="black"
                    pl={2}
                    pr={7}
                    py={2.5}
                    fontSize="xs"
                  >
                    Days Level:{" "}
                  </Text>
                  <Input
                    w="95%"
                    readOnly
                    borderRadius="none"
                    bgColor="gray.300"
                    fontSize="xs"
                    value={rawMatsInfo.daysLevel.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  />
                </VStack>
              </HStack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button bg="none" size="xs" onClick={onClose} px={4}>
              <Text fontWeight="medium">Close</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
