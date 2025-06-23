import { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Select as AutoComplete } from "chakra-react-select";

import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddConfirmation } from "./ActionModal";
import request from "../../../services/ApiClient";

export const FuelInformation = ({
  fuelInfo,
  setFuelInfo,
  barcode,
  fetchActiveFuelRequests,
  fetchBarcode,
  register,
  setValue,
  errors,
  control,
  watch,
  reset,
  requestorInformation,
  showOneChargingData,
  setShowChargingData,
}) => {
  // ONE CHARGING CODE
  const [oneChargingCode, setOneChargingCode] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();

  const [assets, setAssets] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  const { isOpen: isMaterial, onClose: closeMaterial, onOpen: openMaterial } = useDisclosure();

  //  FETCH ONE CHARGING CODE
  const fetchOneChargingApi = async () => {
    const res = await request.get(`OneCharging/GetOneCharging`);
    return res.data;
  };

  const fetchOneCharging = () => {
    fetchOneChargingApi().then((res) => {
      setOneChargingCode(res);
    });
  };

  useEffect(() => {
    fetchOneCharging();

    return () => {
      setOneChargingCode([]);
    };
  }, []);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);

  const fetchAssetsApi = async () => {
    const res = await request.get(`asset/page?&Archived=true`);
    return res.data;
  };

  //Assets Fetching
  const fetchAssets = () => {
    fetchAssetsApi().then((res) => {
      setAssets(res.asset);
    });
  };

  useEffect(() => {
    fetchAssets();

    return () => {
      setAssets([]);
    };
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://rdfsedar.com/api/data/employee/filter/active", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_SEDAR_TOKEN,
        },
      });
      setEmployees(res.data.data);
      setFilteredEmployees(res.data.data.slice(0, 50));
      setPickerItems(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // FETCH ACcount API
  const fetchAccountApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setAccount(res.data.result.account_titles);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAccountApi();
  }, []);

  const triggerPointHandler = (event) => {
    const selectAccountTitle = account?.find((item) => {
      return item.id === parseInt(event);
    });

    if (!selectedAccount?.name?.match(/Advances to Employees/gi)) {
      setIdNumber("");
      setValue("formData.empId", "");
      setValue("formData.fullName", "");
    }
    setSelectedAccount(selectAccountTitle?.name);
  };

  useEffect(() => {
    setInfo(
      pickerItems
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name.toLowerCase().includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

  const openMaterialModal = () => {
    openMaterial();
  };

  console.log("Requestor Information: ", requestorInformation);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <Box bgColor="primary" w="full" pl={2} h="20px" alignItems="center">
        <Flex flexDirection="row" justifyContent="space-around" gap={2}>
          <Text color="white" textAlign="center" fontSize="sm">
            Create Fuel Request
          </Text>
        </Flex>
      </Box>

      <VStack w="full" spacing={6}>
        <Box bgColor="secondary" w="full" pl={2} h="30px" alignItems="center">
          <Flex flexDirection="row" justifyContent="space-around" gap={2}>
            <Text color="white" textAlign="center" fontSize="sm">
              Requestor Information
            </Text>
            <Text color="white" textAlign="center" fontSize="sm">
              Charging of Accounts
            </Text>
          </Flex>
        </Box>

        <Flex w="full" justifyContent="space-between">
          <VStack alignItems="start" w="40%" mx={5}>
            {/* Requestor Id */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Requestor ID:
              </Text>

              {filteredEmployees?.length > 0 ? (
                <Controller
                  control={control}
                  name="formData.requestorId"
                  render={({ field }) => (
                    <AutoComplete
                      className="react-select-layout"
                      ref={field.ref}
                      value={field.value}
                      placeholder="Enter Requestor ID"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("formData.requestorFullName", e.value.full_name);
                      }}
                      options={employees?.map((item) => {
                        return {
                          label: `${item.general_info?.full_id_number} - ${item.general_info?.full_name}`,
                          value: {
                            full_id_number: item.general_info?.full_id_number,
                            full_name: item.general_info?.full_name,
                          },
                        };
                      })}
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        control: (provided) => ({
                          ...provided,
                          fontSize: "15px",
                          textAlign: "left",
                        }),
                      }}
                    />
                  )}
                />
              ) : (
                <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
              )}
            </HStack>

            {/* Requestor Name */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Requestor Name:
              </Text>
              <Input
                fontSize="sm"
                {...register("formData.requestorFullName")}
                disabled={true}
                readOnly={true}
                _disabled={{ color: "black" }}
                bgColor={true && "gray.200"}
                autoFocus
                autoComplete="off"
                border="1px"
                borderColor="gray.200"
                borderRadius="none"
              />
            </HStack>

            {/* Asset */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Asset:
              </Text>

              {assets?.length ? (
                <Controller
                  control={control}
                  name="formData.asset"
                  render={({ field }) => (
                    <AutoComplete
                      className="react-select-layout"
                      ref={field.ref}
                      value={field.value}
                      placeholder="Select Assets"
                      onChange={(e) => {
                        // console.log("E: ", e);

                        field.onChange(e);
                      }}
                      options={assets?.map((item) => {
                        return {
                          label: `${item.assetCode} - ${item.assetName}`,
                          value: item,
                        };
                      })}
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        control: (provided) => ({
                          ...provided,
                          fontSize: "15px",
                          textAlign: "left",
                        }),
                      }}
                    />
                  )}
                />
              ) : (
                <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
              )}
              <Text color="red" fontSize="xs">
                {errors.formData?.asset?.message}
              </Text>
            </HStack>

            {/* Odometer */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Odometer:
              </Text>

              <Controller
                name="formData.odometer"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    ref={field.ref}
                    customInput={Input}
                    fontSize="14px"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                    min="1"
                    placeholder="Enter Odometer"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    thousandSeparator=","
                    autoComplete="off"
                  />
                )}
              />
            </HStack>

            {/* Remarks */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Remarks:
              </Text>

              <Input
                {...register("formData.remarks")}
                fontSize="14px"
                size="md"
                placeholder="Enter Remarks (Optional)"
                border="1px"
                borderColor="gray.400"
                borderRadius="none"
                autoComplete="off"
              />
            </HStack>

            {/* CIP # */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                CIP #:
              </Text>

              <Input
                {...register("formData.cipNo")}
                fontSize="14px"
                size="md"
                placeholder="Enter CIP# (Optional)"
                border="1px"
                borderColor="gray.400"
                borderRadius="none"
                autoComplete="off"
              />
            </HStack>
          </VStack>

          <VStack alignItems="start" w="40%" mx={5}>
            {/* One Charging Code */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Charging Code:{" "}
              </Text>

              {oneChargingCode?.oneChargingList?.length > 0 ? (
                <Controller
                  control={control}
                  name="formData.oneChargingCode"
                  render={({ field }) => (
                    <AutoComplete
                      className="react-select-layout"
                      ref={field.ref}
                      value={field.value}
                      placeholder="Select Charging Code"
                      onChange={(e) => {
                        console.log("Event: ", e);
                        field.onChange(e);
                        setShowChargingData(e?.value);
                      }}
                      options={oneChargingCode?.oneChargingList?.map((item) => {
                        return {
                          label: `${item.code} - ${item.name}`,
                          value: item,
                        };
                      })}
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        control: (provided) => ({
                          ...provided,
                          fontSize: "15px",
                          textAlign: "left",
                        }),
                      }}
                    />
                  )}
                />
              ) : (
                <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
              )}
            </HStack>

            {/* Company */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Company:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.company_code} - ${showOneChargingData?.company_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Business Unit */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Business Unit:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.business_unit_code} - ${showOneChargingData?.business_unit_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Department */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Department:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.department_code} - ${showOneChargingData?.department_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Unit */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Unit:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.department_unit_code} - ${showOneChargingData?.department_unit_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Sub Unit */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Sub Unit:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.sub_unit_code} - ${showOneChargingData?.sub_unit_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Location */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                Location:{" "}
              </Text>
              <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                {showOneChargingData ? `${showOneChargingData?.location_code} - ${showOneChargingData?.location_name}` : "Select Charging Code"}
              </Text>
            </HStack>

            {/* Account Title */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Account Title:{" "}
              </Text>

              {account?.length ? (
                <Controller
                  control={control}
                  name="formData.accountId"
                  render={({ field }) => (
                    <AutoComplete
                      ref={field.ref}
                      value={field.value}
                      placeholder="Select Account"
                      onChange={(e) => {
                        field.onChange(e);
                        triggerPointHandler(e?.value.id);
                      }}
                      options={account?.map((item) => {
                        return {
                          label: `${item.code} - ${item.name}`,
                          value: item,
                        };
                      })}
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        control: (provided) => ({
                          ...provided,
                          fontSize: "15px",
                          textAlign: "left",
                        }),
                      }}
                    />
                  )}
                />
              ) : (
                <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
              )}

              <Text color="red" fontSize="xs">
                {errors.formData?.accountId?.message}
              </Text>
            </HStack>

            {/* Employee ID */}
            {!!selectedAccount.match(/Advances to Employees/gi) && (
              <HStack w="full">
                <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                  Employee ID:{" "}
                </Text>

                {pickerItems?.length ? (
                  <Controller
                    control={control}
                    name="formData.empId"
                    render={({ field }) => (
                      <AutoComplete
                        ref={field.ref}
                        value={field.value}
                        placeholder="Enter Employee ID"
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("formData.fullName", e.value.full_name);
                        }}
                        options={pickerItems?.map((item) => {
                          return {
                            label: `${item.general_info?.full_id_number} - ${item.general_info?.full_name}`,
                            value: {
                              full_id_number: item.general_info?.full_id_number,
                              full_name: item.general_info?.full_name,
                            },
                          };
                        })}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            width: "100%",
                          }),
                          control: (provided) => ({
                            ...provided,
                            fontSize: "15px",
                            textAlign: "left",
                          }),
                        }}
                      />
                    )}
                  />
                ) : (
                  <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
                )}

                <Text color="red" fontSize="xs">
                  {errors.formData?.empId?.message}
                </Text>
              </HStack>
            )}

            {/* Fullname*/}
            {!!selectedAccount.match(/Advances to Employees/gi) && (
              <HStack w="full">
                <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                  Fullname:
                </Text>

                <Input
                  fontSize="sm"
                  {...register("formData.fullName")}
                  disabled={disableFullName}
                  readOnly={disableFullName}
                  _disabled={{ color: "black" }}
                  bgColor={disableFullName && "gray.300"}
                  autoFocus
                  autoComplete="off"
                />
                <Text color="red" fontSize="xs">
                  {errors.formData?.fullName?.message}
                </Text>

                <Text color="red" fontSize="xs">
                  {errors.formData?.fullName?.message}
                </Text>
              </HStack>
            )}
          </VStack>
        </Flex>

        <Flex w="full" justifyContent="end" mt={4} p={2}>
          <Button
            onClick={() => openMaterialModal()}
            isDisabled={
              !watch("formData.issuanceDate") ||
              !watch("formData.odometer") ||
              !watch("formData.asset") ||
              !watch("formData.requestorId") ||
              !watch("formData.requestorFullName") ||
              !watch("formData.oneChargingCode") ||
              !watch("formData.accountId") ||
              (!!selectedAccount.match(/Advances to Employees/gi) && !watch("formData.empId"))
            }
            size="sm"
            colorScheme="blue"
            borderRadius="none"
            leftIcon={<RiAddFill fontSize="17px" />}
          >
            New
          </Button>
        </Flex>
      </VStack>

      {isMaterial && (
        <FuelInformationModal
          isOpen={isMaterial}
          onCloseMaterialModal={closeMaterial}
          fuelInfo={fuelInfo}
          setFuelInfo={setFuelInfo}
          barcode={barcode}
          fetchActiveFuelRequests={fetchActiveFuelRequests}
          fetchBarcode={fetchBarcode}
          // FORM DATA 1
          requestorRegister={register}
          requestorWatch={watch}
          requestorInformation={requestorInformation}
          reset={reset}
        />
      )}
    </Flex>
  );
};

export const FuelInformationModal = ({
  isOpen,
  onCloseMaterialModal,
  fuelInfo,
  setFuelInfo,
  barcode,
  fetchActiveFuelRequests,
  fetchBarcode,
  requestorRegister,
  requestorWatch,
  requestorInformation,
  reset,
}) => {
  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();

  const schema = yup.object().shape({
    formData: yup.object().shape({
      warehouseId: yup.object().required().typeError("Barcode is required"),
    }),
  });

  const {
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        warehouseId: null,
      },
    },
  });

  const openAddConfirmation = () => {
    openAdd();
  };

  // Fuel Information - To show remaining stocks
  useEffect(() => {
    if (barcode) {
      setFuelInfo({
        warehouseId: barcode[0]?.warehouseId,
        item_Code: "DIESEL",
        item_Description: "DIESEL",
        soh: barcode?.remainingStocks,
        unit_Cost: barcode?.unit_Cost,
        liters: fuelInfo.liters,
      });
    }
  }, [barcode]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text> Fuel Information</Text>
              <Text fontSize="xs">Fuel Register</Text>
            </VStack>
          </ModalHeader>

          <ModalBody mb={5}>
            <Flex w="95%" justifyContent="space-between">
              <VStack alignItems="start" w="full" mx={5}>
                {/* Item Code */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Item Code:{" "}
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {fuelInfo.item_Code ? fuelInfo.item_Code : "Item Code required"}
                  </Text>
                </HStack>

                {/* Diesel PO# */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                    Diesel PO#:
                  </Text>

                  <Input
                    {...requestorRegister("formData.dieselPONumber")}
                    fontSize="14px"
                    size="md"
                    placeholder="Enter Diesel PO#"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    autoComplete="off"
                  />
                </HStack>

                {/* Liters */}
                <HStack w="full">
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Liters:
                  </Text>

                  <NumericFormat
                    customInput={Input}
                    fontSize="sm"
                    onValueChange={(e) =>
                      setFuelInfo({
                        warehouseId: fuelInfo.warehouseId,
                        item_Code: fuelInfo.item_Code,
                        item_Description: fuelInfo.item_Description,
                        soh: fuelInfo.soh,
                        unit_Cost: fuelInfo.unit_Cost,
                        liters: Number(e?.value),
                      })
                    }
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                    min="1"
                    placeholder="Enter Quantity"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    thousandSeparator=","
                  />
                </HStack>
              </VStack>

              <VStack alignItems="start" w="full" mx={5}>
                {/* Item Description */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Item Description:
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {fuelInfo.item_Description ? fuelInfo.item_Description : "Item Description required"}
                  </Text>
                </HStack>

                {/* Fuel Pump */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                    Fuel Pump:
                  </Text>

                  <Input
                    {...requestorRegister("formData.fuelPump")}
                    type="number"
                    fontSize="14px"
                    size="md"
                    placeholder="Enter Fuel Pump"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    autoComplete="off"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                  />
                </HStack>

                {/* Stocks */}
                <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Stocks:
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {fuelInfo.soh
                      ? fuelInfo.soh.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })
                      : "No available stock"}
                  </Text>
                </HStack>
              </VStack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup size="xs">
              <Button
                onClick={openAddConfirmation}
                isDisabled={
                  !fuelInfo.item_Code ||
                  !fuelInfo.item_Description ||
                  !fuelInfo.soh ||
                  !fuelInfo.liters ||
                  fuelInfo.liters > fuelInfo.soh ||
                  !requestorWatch("formData.dieselPONumber") ||
                  !requestorWatch("formData.fuelPump")
                }
                colorScheme="blue"
                px={4}
              >
                Add
              </Button>
              <Button color="black" variant="outline" onClick={onCloseMaterialModal}>
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isAdd && (
        <AddConfirmation
          isOpen={isAdd}
          onClose={closeAdd}
          onCloseMaterialModal={onCloseMaterialModal}
          fuelInfo={fuelInfo}
          setFuelInfo={setFuelInfo}
          requestorInformation={requestorInformation}
          fuelInformation={watch("formData")}
          fetchActiveFuelRequests={fetchActiveFuelRequests}
          fetchBarcode={fetchBarcode}
          reset={reset}
        />
      )}
    </>
  );
};
