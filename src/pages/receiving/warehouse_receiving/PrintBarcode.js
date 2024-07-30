import React, { useRef } from "react";
import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, Image } from "@chakra-ui/react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";

const PrintBarcode = ({ printData, receivingDate, lotSection, sumQuantity, isOpen, onClose, actualDelivered, closeModal, receivingId, siNumber, unitPrice }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const qtyGood = Number(actualDelivered) - Number(sumQuantity);

  const displayData = {
    "PO Number": printData.poNumber,
    Date: moment().format("MM/DD/YYYY, h:mm:ss a"),
    "Receiving Date": moment(receivingDate).format("MM/DD/YYYY"),
    "Item Code": printData.itemCode,
    "Item Description": printData.itemDescription,
    UOM: printData.uom,
    "Unit Cost": unitPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    Supplier: printData.supplier,
    "Quantity Good": qtyGood.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    "Lot Section": lotSection,
    "SI Number": siNumber,
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text fontSize="15px">Print Preview</Text>
          </Flex>
        </ModalHeader>

        <ModalCloseButton
          onClick={() => {
            onClose();
            closeModal();
          }}
        />
        <ModalBody>
          {/* Printed on Paper */}
          <Box display="none">
            <VStack spacing={0} justifyContent="center" ref={componentRef}>
              <VStack spacing={0} justifyContent="start">
                <Image src="/images/RDF Logo.png" w="20%" ml={3} />
                <Text fontSize="9px" ml={2} textAlign="center">
                  Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
                </Text>
              </VStack>
              <Flex mt={3} w="90%" justifyContent="center">
                <Text fontSize="15px" fontWeight="semibold">
                  Materials
                </Text>
              </Flex>

              {Object.keys(displayData)?.map((key, i) => (
                <Flex w="full" justifyContent="center" key={i}>
                  <Flex ml="10%" w="full">
                    <Flex>
                      <Text fontWeight="semibold" fontSize="8px">
                        {key}:
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex w="full">
                    <Flex>
                      <Text fontWeight="semibold" fontSize="8px">
                        {displayData[key]}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))}

              <VStack spacing={0} w="90%" ml={4} justifyContent="center">
                <Barcode fontSize="16" width={3} height={25} value={receivingId} />
              </VStack>

              <Flex w="full"></Flex>
            </VStack>
          </Box>

          {/* Display on Preview */}
          <VStack spacing={0} justifyContent="center">
            <VStack spacing={0} justifyContent="start">
              <Image src="/images/RDF Logo.png" w="20%" ml={3} />
              <Text fontSize="9px" ml={2} textAlign="center">
                Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
              </Text>
            </VStack>
            <Flex mt={5} w="90%" justifyContent="center">
              <Text fontSize="15px" fontWeight="semibold">
                Materials
              </Text>
            </Flex>

            {Object.keys(displayData)?.map((key, i) => (
              <Flex w="full" justifyContent="center" key={i}>
                <Flex ml="10%" w="full">
                  <Flex>
                    <Text fontWeight="semibold" fontSize="13px">
                      {key}:
                    </Text>
                  </Flex>
                </Flex>
                <Flex w="full">
                  <Flex>
                    <Text fontWeight="normal" fontSize="13px">
                      {displayData[key]}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ))}

            <VStack spacing={0} w="90%" ml={4} justifyContent="center">
              <Barcode fontSize="16" width={3} height={25} value={receivingId} />
            </VStack>

            <Flex w="full"></Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handlePrint}>
            Print
          </Button>
          <Button
            onClick={() => {
              onClose();
              closeModal();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrintBarcode;
