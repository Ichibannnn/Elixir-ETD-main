import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  toast,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FcAbout, FcInfo } from "react-icons/fc";
import { BsPatchQuestionFill } from "react-icons/bs";
import { FaExclamationTriangle, FaQuestion } from "react-icons/fa";

import * as yup from "yup";
import axios from "axios";
import request from "../../../services/ApiClient";
import Swal from "sweetalert2";
import { decodeUser } from "../../../services/decode-user";
import { ToastComponent } from "../../../components/Toast";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Select as AutoComplete } from "chakra-react-select";

export const AddConfirmation = ({ isOpen, onClose, onCloseMaterialModal, fuelInfo, setFuelInfo, requestorInformation, fuelInformation, fetchActiveFuelRequests, fetchBarcode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const submitHandler = () => {
    console.log("FuelInfo: ", fuelInfo);
    console.log("FuelFormData: ", fuelInformation);

    setIsLoading(true);
    try {
      const addSubmit = {
        item_Code: fuelInfo.item_Code,
        // warehouse_ReceivingId: fuelInfo.warehouseId,
        liters: fuelInfo.liters,
      };

      const res = request
        .post(`FuelRegister/create-fuel-details`, addSubmit)
        .then((res) => {
          ToastComponent("Success", "Fuel added", "success", toast);
          setIsLoading(false);
          setFuelInfo({
            warehouseId: "",
            item_Code: "DIESEL",
            item_Description: "DIESEL",
            soh: "",
            unit_Cost: "",
            liters: "",
            asset: fuelInfo.asset,
            odometer: fuelInfo.odometer,
            remarks: fuelInfo.remarks,
          });
          fetchBarcode();
          fetchActiveFuelRequests();
          onCloseMaterialModal();
          onClose();
        })
        .catch((err) => {
          console.log("Error: ", err);
          ToastComponent("Error", "Item was not added", "error", toast);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <FaQuestion fontSize="50px" color="#0A8FD4" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to add this information?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button size="sm" onClick={submitHandler} isLoading={isLoading} colorScheme="blue" height="28px" width="100px" borderRadius="none" fontSize="xs">
              Yes
            </Button>
            <Button size="sm" onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CancelConfirmation = ({ isOpen, onClose, selectorId, setSelectorId, fetchBarcode, fetchActiveFuelRequests }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`FuelRegister/cancel`, [selectorId])
        .then((res) => {
          ToastComponent("Success", "Item has been cancelled", "success", toast);
          fetchActiveFuelRequests();
          fetchBarcode();
          setIsLoading(false);
          setSelectorId("");
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDirection="center">
            <FaExclamationTriangle color="red" fontSize="90px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            {`Are you sure you want to cancel ID number ${selectorId}?`}
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="sm"
              onClick={cancelSubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="red"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
              Yes
            </Button>
            <Button size="sm" onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const AllCancelConfirmation = ({ isOpen, onClose, setHideButton, fuelData, fuelInfo, setFuelInfo, setSelectorId, fetchActiveFuelRequests, fetchBarcode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const allCancelSubmitHandler = () => {
    setIsLoading(true);

    const allId = fuelData.map((item) => item.id);

    try {
      const res = request
        .put(`FuelRegister/cancel`, allId)
        .then((res) => {
          ToastComponent("Success", "Items has been cancelled", "success", toast);
          fetchActiveFuelRequests();
          setFuelInfo({
            warehouseId: "",
            item_Code: "DIESEL",
            item_Description: "DIESEL",
            soh: "",
            unit_Cost: "",
            liters: "",
            asset: fuelInfo.asset,
            odometer: fuelInfo.odometer,
            remarks: fuelInfo.remarks,
          });
          fetchBarcode();
          setSelectorId("");
          setHideButton(false);
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Item was not cancelled", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent color="black" pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDirection="center">
            <FaExclamationTriangle color="red" fontSize="90px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to cancel all items in the list?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button onClick={allCancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="red" height="28px" width="100px" borderRadius="none" fontSize="xs">
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const SaveConfirmation = ({
  isOpen,
  onClose,
  isLoading,
  setIsLoading,
  fuelData,
  fuelInfo,
  setFuelInfo,
  setHideButton,
  setSelectorId,
  fetchActiveFuelRequests,
  fetchBarcode,
  requestorInformation,
  reset,
}) => {
  const toast = useToast();

  const saveSubmitHandler = () => {
    // setIsLoading(true);

    console.log("Requestor: ", requestorInformation);
    // console.log("FuelInfo: ", fuelInfo);

    const savePayload = {
      requestorId: requestorInformation?.requestorId?.value?.full_id_number,
      requestorName: requestorInformation?.requestorId?.value?.full_name,
      asset: requestorInformation?.asset,
      odometer: requestorInformation?.odometer ? Number(requestorInformation?.odometer) : "",
      remarks: requestorInformation?.remarks,
      company_Code: requestorInformation?.companyId?.value?.code,
      company_Name: requestorInformation?.companyId?.value?.name,
      department_Code: requestorInformation?.departmentId?.value?.code,
      department_Name: requestorInformation?.departmentId?.value?.name,
      location_Code: requestorInformation?.locationId?.value?.code,
      location_Name: requestorInformation?.locationId?.value?.name,
      account_Title_Code: requestorInformation?.accountId?.value?.code,
      account_Title_Name: requestorInformation?.accountId?.value?.name,
      account_Title_Name: requestorInformation?.accountId?.value?.name,
      empId: requestorInformation?.empId ? requestorInformation?.empId?.value?.full_id_number : "",
      fullname: requestorInformation?.fullName ? requestorInformation?.fullName : "",
    };

    console.log("Save: ", savePayload);
    try {
      const res = request
        .post(`FuelRegister/create-fuel`, savePayload)
        .then((res) => {
          ToastComponent("Success", "Information saved", "success", toast);
          fetchActiveFuelRequests();
          setFuelInfo({
            warehouseId: "",
            item_Code: "DIESEL",
            item_Description: "DIESEL",
            soh: "",
            unit_Cost: "",
            liters: "",
            asset: fuelInfo.asset,
            odometer: fuelInfo.odometer,
            remarks: fuelInfo.remarks,
          });

          fetchBarcode();
          reset();
          setSelectorId("");
          setHideButton(false);
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          console.log("error: ", err);
          ToastComponent("Error", "Information was not saved", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  const closeHandler = () => {
    setHideButton(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center" alignItems="center" flexDir="column">
            <FcInfo fontSize="90px" />
            <Text>Confirmation</Text>
          </Flex>
        </ModalHeader>

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            Are you sure you want to save this information?
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="sm"
              onClick={saveSubmitHandler}
              // isLoading={isLoading}
              // disabled={isLoading}
              colorScheme="blue"
              height="28px"
              width="100px"
              borderRadius="none"
              fontSize="xs"
            >
              Yes
            </Button>
            <Button size="sm" onClick={closeHandler} color="black" variant="outline" height="28px" width="100px" borderRadius="none" fontSize="xs">
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
