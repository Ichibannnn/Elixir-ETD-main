import React, { useState } from "react";
import { Button, ButtonGroup, Flex, useDisclosure } from "@chakra-ui/react";
import { AllCancelConfirmation, SaveConfirmation } from "./ActionModal";

export const ActionButton = ({ isLoading, setIsLoading, setSelectorId, fuelData, fuelInfo, setFuelInfo, fetchActiveFuelRequests, fetchBarcode, requestorInformation, reset }) => {
  const [hideButton, setHideButton] = useState(false);

  const { isOpen: isSave, onClose: closeSave, onOpen: openSave } = useDisclosure();
  const { isOpen: allIsCancel, onClose: allCloseCancel, onOpen: openAllCancel } = useDisclosure();

  const saveHandler = () => {
    setHideButton(true);
    openSave();
  };

  const cancelHandler = () => {
    openAllCancel();
  };

  return (
    <>
      <Flex w="full" justifyContent="end">
        <ButtonGroup size="xs">
          <Button onClick={saveHandler} colorScheme="blue" borderRadius="none" width="100px">
            Save
          </Button>

          <Button colorScheme="red" borderRadius="none" width="100px" px={3} onClick={cancelHandler}>
            Cancel All
          </Button>
        </ButtonGroup>
      </Flex>

      {isSave && (
        <SaveConfirmation
          isOpen={isSave}
          onClose={closeSave}
          setIsLoading={setIsLoading}
          fuelData={fuelData}
          fuelInfo={fuelInfo}
          setFuelInfo={setFuelInfo}
          setHideButton={setHideButton}
          setSelectorId={setSelectorId}
          fetchActiveFuelRequests={fetchActiveFuelRequests}
          fetchBarcode={fetchBarcode}
          requestorInformation={requestorInformation}
          reset={reset}
        />
      )}

      {allIsCancel && (
        <AllCancelConfirmation
          isOpen={allIsCancel}
          onClose={allCloseCancel}
          setHideButton={setHideButton}
          fuelData={fuelData}
          fuelInfo={fuelInfo}
          setFuelInfo={setFuelInfo}
          setSelectorId={setSelectorId}
          fetchActiveFuelRequests={fetchActiveFuelRequests}
          fetchBarcode={fetchBarcode}
        />
      )}
    </>
  );
};
