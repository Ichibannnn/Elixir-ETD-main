import { useEffect, useState } from "react";
import { Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import request from "../../../services/ApiClient";
import { FuelInformation } from "./FuelInformation";
import { ListOfFuels } from "./ListOfFuels";
import { ActionButton } from "./ActionButton";
import ApproverApprovedTab from "../../fuel_register/fuel_approval/fuel_approval_approved_approver/ApproverApprovedTab";
import moment from "moment";

const fetchBarcodeApi = async () => {
  const res = await request.get(`FuelRegister/material-available`);
  return res.data;
};

const FuelRequestV2 = ({ fuelData, setFuelData, fetchActiveFuelRequests, fuelNav, setFuelNav }) => {
  const [barcode, setBarcode] = useState([]);
  const [indexBarcodeId, setIndexBarcodeId] = useState("");
  const [selectorId, setSelectorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [fuelInfo, setFuelInfo] = useState({
    warehouseId: "",
    item_Code: "DIESEL",
    item_Description: "DIESEL",
    soh: "",
    unit_Cost: "",
    liters: "",
  });

  const schema = yup.object().shape({
    formData: yup.object().shape({
      requestorId: yup.object().required().label("Employee ID"),
      requestorFullName: yup.string().required().label("Fullname"),
      asset: yup.object().required().typeError("Asset is required"),
      odometer: yup.string(),
      remarks: yup.string().nullable(),

      issuanceDate: yup.date().required("Issuance Date is required"),
      cipNo: yup.string().nullable(),
      dieselPONumber: yup.string().required().label("Diesel PO #"),
      fuelPump: yup.string().required().label("Fuel Pump"),

      companyId: yup.object().required().typeError("Company Name is required"),
      departmentId: yup.object().required().typeError("Department Category is required"),
      locationId: yup.object().required().typeError("Location Name is required"),
      accountId: yup.object().required("Account Name is required"),
      empId: yup.object().nullable(),
      fullName: yup.string(),
    }),
  });

  const fetchBarcode = () => {
    fetchBarcodeApi().then((res) => {
      setBarcode(res?.[0]);
      setIndexBarcodeId(res?.[0]);
    });
  };

  useEffect(() => {
    fetchBarcode();

    return () => {
      setBarcode([]);
    };
  }, []);

  //Refetch on change navigation
  useEffect(() => {
    if (fuelNav) {
      fetchBarcode();
      fetchActiveFuelRequests();
    }
  }, [fuelNav]);

  //When navigating view issue
  // useEffect(() => {
  //   if (fuelNav === 2) {
  //     setFuelData([]);
  //   }
  // }, [fuelNav]);

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        requestorId: "",
        requestorFullName: "",
        asset: null,
        odometer: "",
        remarks: "",

        issuanceDate: null,
        cipNo: "",
        dieselPONumber: "",
        fuelPump: "",

        warehouseId: null,
        companyId: "",
        departmentId: "",
        locationId: "",
        accountId: "",
        empId: "",
        fullName: "",
      },
    },
  });

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            bgColor={fuelNav === 1 ? "primary" : ""}
            color={fuelNav === 1 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setFuelNav(1)}
          >
            Requests
          </Button>

          <Button
            bgColor={fuelNav === 2 ? "primary" : ""}
            color={fuelNav === 2 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setFuelNav(2)}
          >
            Transacted
          </Button>
        </HStack>

        {fuelNav === 1 && (
          <HStack spacing={0}>
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={1} py={1.5} fontSize="xs" fontWeight="semibold">
                Issuance Date:
              </Text>

              <Input
                {...register("formData.issuanceDate")}
                fontSize="14px"
                placeholder="Select Date and Time"
                bg="#ffffe0"
                size="sm"
                type="datetime-local"
                border="1px"
                borderColor="gray.400"
                borderRadius="none"
                autoComplete="off"
              />
            </HStack>
          </HStack>
        )}
      </Flex>

      <VStack w="full" p={5} spacing={10} height={fuelData?.length === 0 ? "90vh" : "auto"}>
        {fuelNav === 1 ? (
          <>
            <FuelInformation
              fuelData={fuelData}
              fuelInfo={fuelInfo}
              setFuelInfo={setFuelInfo}
              barcode={barcode}
              indexBarcodeId={indexBarcodeId}
              setIndexBarcodeId={setIndexBarcodeId}
              fetchActiveFuelRequests={fetchActiveFuelRequests}
              fetchBarcode={fetchBarcode}
              // formData
              register={register}
              setValue={setValue}
              errors={errors}
              control={control}
              watch={watch}
              requestorInformation={watch("formData")}
            />
            {fuelData?.length > 0 ? (
              <>
                <ListOfFuels
                  fuelData={fuelData}
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  fetchBarcode={fetchBarcode}
                  fetchActiveFuelRequests={fetchActiveFuelRequests}
                />

                <ActionButton
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setSelectorId={setSelectorId}
                  fuelData={fuelData}
                  fuelInfo={fuelInfo}
                  setFuelInfo={setFuelInfo}
                  fetchActiveFuelRequests={fetchActiveFuelRequests}
                  fetchBarcode={fetchBarcode}
                  // WatchFormData
                  requestorInformation={watch("formData")}
                  reset={reset}
                />
              </>
            ) : (
              ""
            )}
          </>
        ) : fuelNav === 2 ? (
          <>
            <ApproverApprovedTab />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default FuelRequestV2;
