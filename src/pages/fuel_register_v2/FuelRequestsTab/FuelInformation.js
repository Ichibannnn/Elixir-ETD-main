import React, { useEffect, useState } from "react";
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
  Select,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";

import { decodeUser } from "../../../services/decode-user";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Select as AutoComplete } from "chakra-react-select";

import moment from "moment";
import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddConfirmation } from "./ActionModal";
import { debounce } from "lodash";
import request from "../../../services/ApiClient";

const currentUser = decodeUser();

export const FuelInformation = ({
  fuelData,
  fuelInfo,
  setFuelInfo,
  barcode,
  indexBarcodeId,
  setIndexBarcodeId,
  fetchActiveFuelRequests,
  fetchBarcode,
  register,
  setValue,
  errors,
  control,
  watch,
  requestorInformation,
}) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();

  const [assets, setAssets] = useState([]);
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  const ITEMS_PER_PAGE = 50;

  const { isOpen: isMaterial, onClose: closeMaterial, onOpen: openMaterial } = useDisclosure();

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
      const res = await axios.get("http://rdfsedar.com/api/data/employees", {
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

  // Debounced search handler
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    const filtered = employees.filter((employee) => employee.general_info?.full_id_number.toLowerCase().includes(value.toLowerCase())).slice(0, 50); // Show only the first 50 matches
    setFilteredEmployees(filtered);
  }, 300);

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.departments);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
        },
      });
      setLocation(res.data.result.locations);
    } catch (error) {}
  };

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
    fetchLocationApi().then(() => fetchDepartmentApi().then(() => fetchCompanyApi()));
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

  const assetHandler = (data) => {
    if (data) {
      setFuelInfo({
        warehouseId: fuelInfo.warehouseId,
        item_Code: fuelInfo.item_Code,
        item_Description: fuelInfo.item_Description,
        soh: fuelInfo.soh,
        unit_Cost: fuelInfo.unit_Cost,
        liters: fuelInfo.liters,
        odometer: fuelInfo.odometer,
        remarks: fuelInfo.remarks,
        asset: data,
      });
    } else {
      setFuelInfo({
        warehouseId: fuelInfo.warehouseId,
        item_Code: fuelInfo.item_Code,
        item_Description: fuelInfo.item_Description,
        soh: fuelInfo.soh,
        unit_Cost: fuelInfo.unit_Cost,
        liters: fuelInfo.liters,
        odometer: fuelInfo.odometer,
        remarks: fuelInfo.remarks,
        asset: "",
      });
    }
  };

  const remarksHandler = (data) => {
    if (data) {
      setFuelInfo({
        warehouseId: fuelInfo.warehouseId,
        item_Code: fuelInfo.item_Code,
        item_Description: fuelInfo.item_Description,
        soh: fuelInfo.soh,
        unit_Cost: fuelInfo.unit_Cost,
        liters: fuelInfo.liters,
        odometer: fuelInfo.odometer,
        remarks: data,
        asset: fuelInfo.asset,
      });
    } else {
      setFuelInfo({
        warehouseId: fuelInfo.warehouseId,
        item_Code: fuelInfo.item_Code,
        item_Description: fuelInfo.item_Description,
        soh: fuelInfo.soh,
        unit_Cost: fuelInfo.unit_Cost,
        liters: fuelInfo.liters,
        odometer: fuelInfo.odometer,
        remarks: "",
        asset: fuelInfo.asset,
      });
    }
  };

  // console.log("FuelInfo: ", fuelInfo);
  // console.log("RequstorId: ", watch("formData.requestorId"));
  // console.log("RequstorName: ", watch("formData.requestorFullName"));

  // console.log("Company: ", watch("formData.companyId"));
  // console.log("Department: ", watch("formData.departmentId"));
  // console.log("Location: ", watch("formData.locationId"));
  // console.log("Account: ", watch("formData.accountId"));

  // console.log("FuelArrayData: ", fuelData);

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
                      onInputChange={(inputValue) => handleSearch(inputValue)} // Call search handler
                      options={employees?.map((item) => {
                        return {
                          label: item.general_info?.full_id_number,
                          value: {
                            full_id_number: item.general_info?.full_id_number,
                            full_name: item.general_info?.full_name,
                          },
                        };
                      })}
                      // options={filteredEmployees.map((item) => ({
                      //   label: item.general_info?.full_id_number,
                      //   value: {
                      //     full_id_number: item.general_info?.full_id_number,
                      //     full_name: item.general_info?.full_name,
                      //   },
                      // }))}
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

              {/* <Input
                {...register("formData.asset")}
                fontSize="15px"
                size="md"
                placeholder="Enter Asset"
                border="1px"
                borderColor="gray.400"
                borderRadius="none"
                autoComplete="off"
                onChange={(e) => assetHandler(e.target.value)}
              /> */}

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
                    fontSize="sm"
                    onValueChange={(e) => {
                      console.log("E: ", e);
                      field.onChange(e?.value);

                      setFuelInfo({
                        warehouseId: fuelInfo.warehouseId,
                        item_Code: fuelInfo.item_Code,
                        item_Description: fuelInfo.item_Description,
                        soh: fuelInfo.soh,
                        unit_Cost: fuelInfo.unit_Cost,
                        liters: fuelInfo.liters,
                        odometer: Number(e?.value),
                        remarks: fuelInfo.remarks,
                        asset: fuelInfo.asset,
                      });
                    }}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                    min="1"
                    placeholder="Enter Odometer (Optional)"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    thousandSeparator=","
                    autoComplete="off"
                  />
                )}
              />

              {/* <NumericFormat
                customInput={Input}
                fontSize="sm"
                onValueChange={(e) =>
                  setFuelInfo({
                    warehouseId: fuelInfo.warehouseId,
                    item_Code: fuelInfo.item_Code,
                    item_Description: fuelInfo.item_Description,
                    soh: fuelInfo.soh,
                    unit_Cost: fuelInfo.unit_Cost,
                    liters: fuelInfo.liters,
                    odometer: Number(e?.value),
                    remarks: fuelInfo.remarks,
                    asset: fuelInfo.asset,
                  })
                }
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                min="1"
                placeholder="Enter Odometer (Optional)"
                border="1px"
                borderColor="gray.400"
                borderRadius="none"
                thousandSeparator=","
              /> */}
            </HStack>

            {/* Remarks */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Remarks:
              </Text>

              <Input
                {...register("formData.remarks")}
                fontSize="15px"
                size="md"
                placeholder="Enter Remarks"
                border="1px"
                borderColor="gray.400"
                borderRadius="none"
                autoComplete="off"
                onChange={(e) => remarksHandler(e.target.value)}
              />
            </HStack>
          </VStack>

          <VStack alignItems="start" w="40%" mx={5}>
            {/* Company */}
            <HStack w="100%">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Company:
              </Text>

              {company?.length ? (
                <Controller
                  control={control}
                  name="formData.companyId"
                  render={({ field }) => (
                    <AutoComplete
                      ref={field.ref}
                      value={field.value}
                      placeholder="Select Company"
                      onChange={(e) => {
                        // console.log("E: ", e);

                        field.onChange(e);
                        setValue("formData.departmentId", "");
                        setValue("formData.locationId", "");
                        if (e?.value?.id) {
                          fetchDepartmentApi(e.value.id);
                        }
                      }}
                      options={company?.map((item) => {
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
                {errors.formData?.companyId?.message}
              </Text>
            </HStack>

            {/* Department */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Department:
              </Text>

              {department?.length ? (
                <Controller
                  control={control}
                  name="formData.departmentId"
                  render={({ field }) => (
                    <AutoComplete
                      ref={field.ref}
                      value={field.value}
                      placeholder="Select Department"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("formData.locationId", "");
                        fetchLocationApi(e?.value?.id);
                      }}
                      options={department?.map((item) => {
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
                {errors.formData?.departmentId?.message}
              </Text>
            </HStack>

            {/* Location */}
            <HStack w="full">
              <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} py={2.5} fontSize="xs">
                Location:{" "}
              </Text>

              {location?.length ? (
                <Controller
                  control={control}
                  name="formData.locationId"
                  render={({ field }) => (
                    <AutoComplete
                      ref={field.ref}
                      value={field.value}
                      placeholder="Select Location"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      options={location?.map((item) => {
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
                {errors.formData?.locationId?.message}
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
                            label: item.general_info?.full_id_number,
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
            onClick={() => openMaterial()}
            isDisabled={
              // !fuelInfo.asset ||
              !watch("formData.asset") ||
              !fuelInfo.remarks ||
              !watch("formData.requestorId") ||
              !watch("formData.requestorFullName") ||
              !watch("formData.companyId") ||
              !watch("formData.departmentId") ||
              !watch("formData.locationId") ||
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
          onClose={closeMaterial}
          onCloseMaterialModal={closeMaterial}
          fuelInfo={fuelInfo}
          setFuelInfo={setFuelInfo}
          requestorInformation={requestorInformation}
          barcode={barcode}
          fetchActiveFuelRequests={fetchActiveFuelRequests}
          fetchBarcode={fetchBarcode}
        />
      )}
    </Flex>
  );
};

export const FuelInformationModal = ({ isOpen, onClose, onCloseMaterialModal, fuelInfo, setFuelInfo, requestorInformation, barcode, fetchActiveFuelRequests, fetchBarcode }) => {
  const [readOnly, setReadOnly] = useState(true);
  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();

  const schema = yup.object().shape({
    formData: yup.object().shape({
      warehouseId: yup.object().required().typeError("Barcode is required"),
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control,
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

  const barcodeHandler = (data) => {
    console.log("Data: ", data);

    if (data) {
      setFuelInfo({
        warehouseId: data?.value?.warehouseId,
        item_Code: "DIESEL",
        item_Description: "DIESEL",
        soh: data?.value?.remaining_Stocks,
        unit_Cost: data?.value?.unit_Cost,
        liters: fuelInfo.liters,
        odometer: fuelInfo.odometer,
        remarks: fuelInfo.remarks,
        asset: fuelInfo.asset,
      });
    } else {
      setFuelInfo({
        warehouseId: "",
        item_Code: "DIESEL",
        item_Description: "DIESEL",
        soh: "",
        unit_Cost: "",
        liters: "",
        odometer: "",
        remarks: "",
        asset: "",
      });
    }
  };

  useEffect(() => {
    if (barcode) {
      setValue("formData.warehouseId", {
        label: `${barcode[0]?.warehouseId}`,
        value: `${barcode[0]}`,
      });

      setFuelInfo({
        warehouseId: barcode[0]?.warehouseId,
        item_Code: "DIESEL",
        item_Description: "DIESEL",
        soh: barcode?.remainingStocks,
        unit_Cost: barcode?.unit_Cost,
        liters: fuelInfo.liters,
        odometer: fuelInfo.odometer,
        remarks: fuelInfo.remarks,
        asset: fuelInfo.asset,
      });
    }
  }, [barcode, setValue]);

  console.log("Barcode: ", barcode);

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

                {/* Barcode No */}
                <HStack w="full" style={{ display: "none" }}>
                  <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Barcode:
                  </Text>

                  {barcode?.length > 0 ? (
                    <Controller
                      control={control}
                      name="formData.warehouseId"
                      render={({ field }) => (
                        <AutoComplete
                          ref={field.ref}
                          // defaultValues={barcode[0]?.warehouseId}
                          value={field.value}
                          placeholder="Select Barcode"
                          onChange={(e) => {
                            console.log("E: ", e);

                            field.onChange(e);
                            barcodeHandler(e);
                          }}
                          options={barcode?.map((item) => {
                            return {
                              label: `${item.warehouseId}`,
                              value: item,
                            };
                          })}
                          isDisabled={true}
                          chakraStyles={{
                            container: (provided) => ({
                              ...provided,
                              width: "100%",
                            }),
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: "#D1D7DE",
                              fontSize: "15px",
                              textAlign: "left",
                            }),
                            dropdownIndicator: (provided, state) => ({
                              ...provided,
                              display: state.isDisabled ? "none" : "flex",
                            }),
                          }}
                        />
                      )}
                    />
                  ) : (
                    <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="md" />
                  )}
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
                        odometer: fuelInfo.odometer,
                        remarks: fuelInfo.remarks,
                        asset: fuelInfo.asset,
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

                {/* Unit Cost */}
                {/* <HStack w="full">
                  <Text minW="30%" w="auto" bgColor="primary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">
                    Unit Cost:
                  </Text>
                  <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                    {fuelInfo.unit_Cost
                      ? fuelInfo.unit_Cost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })
                      : "Select barcode number first"}
                  </Text>
                </HStack> */}
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
                  // !fuelInfo.warehouseId ||
                  !fuelInfo.soh ||
                  // !fuelInfo.unit_Cost ||
                  !fuelInfo.liters ||
                  fuelInfo.liters > fuelInfo.soh
                }
                colorScheme="blue"
                px={4}
              >
                Add
              </Button>
              <Button color="black" variant="outline" onClick={onClose}>
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
        />
      )}
    </>
  );
};
