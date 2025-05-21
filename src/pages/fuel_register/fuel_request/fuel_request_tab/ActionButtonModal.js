import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  HStack,
  ModalOverlay,
  Spinner,
  Input,
  Stack,
  Box,
  FormLabel,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import { FcAbout } from "react-icons/fc";

import * as yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Select as AutoComplete } from "chakra-react-select";
import { NumericFormat } from "react-number-format";
import { IoAdd, IoSaveOutline } from "react-icons/io5";
import { decodeUser } from "../../../../services/decode-user";

export const ViewModal = ({ isOpen, onClose, data }) => {
  console.log("Data: ", data);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary">
          <Flex justifyContent="left">
            <Text fontSize="xs" color="white">
              View Fuel Request
            </Text>
          </Flex>
        </ModalHeader>

        <ModalBody mb={5}>
          <Flex direction="row" gap={1} alignItems="flex-start">
            <HStack w="50%">
              <VStack alignItems="start" spacing={1} mt={4}>
                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    ID:
                  </Text>
                  <Text fontSize="xs">{data?.id}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Requested Date:
                  </Text>
                  <Text fontSize="xs"> {moment(data?.created_At).format("MM/DD/yyyy")}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Driver:
                  </Text>
                  <Text fontSize="xs">{`${data?.requestorName}`}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Remarks:
                  </Text>
                  <Text fontSize="xs">{data?.remarks}</Text>
                </HStack>
              </VStack>
            </HStack>

            <HStack w="50%">
              <VStack alignItems="start" spacing={1} mt={4}>
                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Company:
                  </Text>
                  <Text fontSize="xs">{data?.company_Code ? `${data?.company_Code} - ${data?.company_Name}` : "-"}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Department
                  </Text>
                  <Text fontSize="xs">{data?.department_Code ? `${data?.department_Code} - ${data?.department_Name}` : "-"}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Location
                  </Text>
                  <Text fontSize="xs">{data?.location_Code ? `${data?.location_Code} - ${data?.location_Name}` : "-"}</Text>
                </HStack>

                <HStack>
                  <Text fontSize="xs" fontWeight="semibold">
                    Account Title
                  </Text>
                  <Text fontSize="xs">{data?.account_Title_Code ? `${data?.account_Title_Code} - ${data?.account_Title_Name}` : "-"}</Text>
                </HStack>

                {data?.empId && (
                  <>
                    <HStack>
                      <Text fontSize="xs" fontWeight="semibold">
                        Employee ID:
                      </Text>
                      <Text fontSize="xs">{data?.empId ? data?.empId : "-"}</Text>
                    </HStack>

                    <HStack>
                      <Text fontSize="xs" fontWeight="semibold">
                        FullName:
                      </Text>
                      <Text fontSize="xs">{data?.fullname ? data?.fullname : "-"}</Text>
                    </HStack>
                  </>
                )}
              </VStack>
            </HStack>
          </Flex>

          <VStack justifyContent="center" mt={4}>
            <PageScroll minHeight="320px" maxHeight="321px">
              <Table size="sm" variant="striped">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      SOURCE
                    </Th>
                    <Th color="white" fontSize="xs">
                      ITEM CODE
                    </Th>
                    <Th color="white" fontSize="xs">
                      ITEM DESCRIPTION
                    </Th>
                    <Th color="white" fontSize="xs">
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      LITERS
                    </Th>
                    <Th color="white" fontSize="xs">
                      ASSET
                    </Th>
                    <Th color="white" fontSize="xs">
                      UNIT COST
                    </Th>
                    <Th color="white" fontSize="xs">
                      ODOMETER
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontSize="xs">{data.source}</Td>
                    <Td fontSize="xs">{data.item_Code}</Td>
                    <Td fontSize="xs">{data.item_Description}</Td>
                    <Td fontSize="xs">{data.uom}</Td>
                    <Td fontSize="xs">
                      {data.liters.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">{data.asset}</Td>
                    <Td fontSize="xs">
                      {data.unit_Cost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td fontSize="xs">
                      {data.odometer
                        ? data.odometer.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "-"}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Requested By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {data?.driver}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CancelRequestModal = ({ isOpen, onClose, data, fetchFuelRequest, setFuelInfo, isLoading, setIsLoading }) => {
  const toast = useToast();

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`FuelRegister/cancel/${data?.id}`)
        .then((res) => {
          fetchFuelRequest();
          ToastComponent("Success", "Item has been cancelled", "success", toast);
          setFuelInfo({
            item_Code: "DIESEL",
            item_Description: "DIESEL",
            soh: "",
            unit_Cost: "",
            liters: "",
            odometer: "",
            remarks: "",
            asset: "",
          });
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
      <ModalContent pt={10} pb={5}>
        <ModalHeader>
          <Flex justifyContent="center">
            <FcAbout fontSize="50px" />
          </Flex>
        </ModalHeader>

        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Text textAlign="center" fontSize="sm">
            {`Are you sure you want to cancel request ID ${data.id}?`}
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button size="sm" onClick={cancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme="blue">
              Yes
            </Button>
            <Button size="sm" onClick={onClose} isLoading={isLoading}>
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const AddModal = ({ isOpen, onClose, fuelInfo, setFuelInfo, fetchFuelRequest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [barcode, setBarcode] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);

  const fetchBarcodeApi = async () => {
    const res = await request.get(`FuelRegister/material-available-item`);
    return res.data;
  };

  const schema = yup.object().shape({
    formData: yup.object().shape({
      requestorId: yup.object().required().label("Employee ID"),
      requestorFullName: yup.string().required().label("Fullname"),

      warehouseId: yup.object().required().typeError("Barcode is required"),
      companyId: yup.object().required().typeError("Company Name is required"),
      departmentId: yup.object().required().typeError("Department Category is required"),
      locationId: yup.object().required().typeError("Location Name is required"),
      accountId: yup.object().required("Account Name is required"),
      empId: yup.object().nullable(),
      fullName: yup.string(),
    }),
  });

  const currentUser = decodeUser();
  const userId = currentUser?.id;
  const toast = useToast();

  const {
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        requestorId: "",
        requestorFullName: "",
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

  const fetchBarcode = () => {
    fetchBarcodeApi().then((res) => {
      setBarcode(res);
    });
  };

  useEffect(() => {
    fetchBarcode();

    return () => {
      setBarcode([]);
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
      setPickerItems(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setInfo(
      employees
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name.toLowerCase().includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

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

  const barcodeHandler = (data) => {
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
    }
  };

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
    }
  };

  const onSubmitHandler = (submitData) => {
    console.log("submitData: ", submitData);

    const createPayload = {
      requestorId: submitData?.formData?.requestorId?.value?.full_id_number,
      requestorName: submitData?.formData?.requestorId?.value?.full_name,
      item_Code: fuelInfo?.item_Code,
      warehouse_ReceivingId: fuelInfo?.warehouseId,
      liters: fuelInfo?.liters,
      asset: fuelInfo?.asset,
      odometer: fuelInfo?.odometer,
      remarks: fuelInfo?.remarks,
      company_Code: submitData?.formData?.companyId?.value?.code,
      company_Name: submitData?.formData?.companyId?.value?.name,
      department_Code: submitData?.formData?.departmentId?.value?.code,
      department_Name: submitData?.formData?.departmentId?.value?.name,
      location_Code: submitData?.formData?.locationId?.value?.code,
      location_Name: submitData?.formData?.locationId?.value?.name,
      account_Title_Code: submitData?.formData?.accountId?.value?.code,
      account_Title_Name: submitData?.formData?.accountId?.value?.name,
      empId: watch("formData.empId") ? submitData?.formData?.empId?.value?.full_id_number : "",
      fullname: watch("formData.fullName") ? submitData?.formData?.fullName : "",
    };

    console.log("createPayload: ", createPayload);

    try {
      setIsLoading(true);
      const res = request
        .post("FuelRegister/create", createPayload)
        .then((res) => {
          fetchFuelRequest();
          ToastComponent("Success!", "Request fuel successfully", "success", toast);
          setFuelInfo({
            item_Code: "DIESEL",
            item_Description: "DIESEL",
            soh: "",
            unit_Cost: "",
            liters: "",
            odometer: "",
            remarks: "",
            asset: "",
          });
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error!", err.response.data, "error", toast);
          setIsLoading(false);
        });
    } catch (err) {
      ToastComponent("Error!", "Check error.", "error", toast);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text>Fuel Register</Text>
              <Text fontSize="xs">Create Request</Text>
            </VStack>
          </ModalHeader>

          <ModalCloseButton onClick={onClose} />

          <ModalBody mb={5}>
            <Stack direction="column" height="500px" justifyContent="space-around">
              {/* <VStack alignItems="start" w="50%" mx={5}></VStack> */}

              <VStack alignItems="start" w="100%">
                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Requestor ID
                    </Text>

                    <Box w="full">
                      {employees?.length > 0 ? (
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
                        {errors.formData?.requestorId?.message}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Company
                    </Text>

                    <Box w="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Requestor Name
                    </Text>

                    <Box w="full">
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
                      <Text color="red" fontSize="xs">
                        {errors.formData?.requestorFullName?.message}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Department
                    </Text>

                    <Box width="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Remarks
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

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Location
                    </Text>

                    <Box w="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Odometer:{" "}
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
                    />
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Account Title
                    </Text>

                    <Box width="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full" />

                  <HStack w="full">
                    <Box w="full">
                      {!!selectedAccount.match(/Advances to Employees/gi) && (
                        <>
                          <Box w="full" display="flex" flexDirection="row">
                            <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                              Employee ID
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
                              <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="sm" />
                            )}

                            <Text color="red" fontSize="xs">
                              {errors.formData?.empId?.message}
                            </Text>
                          </Box>
                        </>
                      )}
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full" />

                  <HStack w="full">
                    <Box w="full">
                      {!!selectedAccount.match(/Advances to Employees/gi) && (
                        <>
                          <Box w="full" display="flex" flexDirection="row">
                            <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                              Full Name
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
                          </Box>
                        </>
                      )}
                    </Box>
                  </HStack>
                </HStack>
              </VStack>

              <VStack alignItems="start" w="100%">
                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Item Code
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.item_Code ? fuelInfo.item_Code : "Item Code required"}
                    </Text>
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Item Description
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.item_Description ? fuelInfo.item_Description : "Item Description required"}
                    </Text>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Barcode
                    </Text>
                    {barcode?.length > 0 ? (
                      <Controller
                        control={control}
                        name="formData.warehouseId"
                        render={({ field }) => (
                          <AutoComplete
                            ref={field.ref}
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

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Stocks
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.soh ? fuelInfo.soh : "Select barcode number first"}
                    </Text>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Liters:{" "}
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
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Unit Cost
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.unit_Cost ? fuelInfo.unit_Cost : "Select barcode number first"}
                    </Text>
                  </HStack>
                </HStack>

                <HStack w="100%">
                  <Text minW="12.5%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Asset:{" "}
                  </Text>

                  <Input
                    {...register("formData.asset")}
                    fontSize="15px"
                    size="md"
                    placeholder="Enter Asset"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    autoComplete="off"
                    onChange={(e) => assetHandler(e.target.value)}
                  />
                </HStack>
              </VStack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Stack w="100%">
              <Button
                size="sm"
                leftIcon={<IoAdd fontSize="19px" />}
                borderRadius="none"
                colorScheme="blue"
                // onClick={onSubmitHandler}
                type="submit"
                isLoading={isLoading}
                isDisabled={
                  !fuelInfo.item_Code ||
                  !fuelInfo.item_Description ||
                  !fuelInfo.warehouseId ||
                  !fuelInfo.soh ||
                  !fuelInfo.unit_Cost ||
                  !fuelInfo.liters ||
                  !fuelInfo.remarks ||
                  !fuelInfo.asset ||
                  fuelInfo.liters > fuelInfo.soh ||
                  !watch("formData.requestorId") ||
                  !watch("formData.requestorFullName") ||
                  !watch("formData.companyId") ||
                  !watch("formData.departmentId") ||
                  !watch("formData.locationId") ||
                  !watch("formData.accountId")
                }
                px={4}
              >
                Add to Request
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export const EditModal = ({ isOpen, onClose, data, fuelInfo, setFuelInfo, fetchFuelRequest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [barcode, setBarcode] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);

  const fetchBarcodeApi = async () => {
    const res = await request.get(`FuelRegister/material-available-item`);
    return res.data;
  };

  const schema = yup.object().shape({
    formData: yup.object().shape({
      requestorId: yup.object().required().label("Employee ID"),
      requestorFullName: yup.string().required().label("Fullname"),

      warehouseId: yup.object().required().typeError("Barcode is required"),
      companyId: yup.object().required().typeError("Company Name is required"),
      departmentId: yup.object().required().typeError("Department Category is required"),
      locationId: yup.object().required().typeError("Location Name is required"),
      accountId: yup.object().required("Account Name is required"),
      empId: yup.object().nullable(),
      fullName: yup.string(),
    }),
  });

  const currentUser = decodeUser();
  const userId = currentUser?.id;
  const toast = useToast();

  const {
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        requestorId: "",
        requestorFullName: "",
        warehouseId: null,
        companyId: "",
        departmentId: "",
        locationId: "",
        accountId: "",
        empId: "",
        fullName: "",

        remarks: "",
        asset: "",
      },
    },
  });

  const fetchBarcode = () => {
    fetchBarcodeApi().then((res) => {
      setBarcode(res);
    });
  };

  useEffect(() => {
    fetchBarcode();

    return () => {
      setBarcode([]);
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
      setPickerItems(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setInfo(
      employees
        .filter((item) => {
          return item?.general_info?.full_id_number_full_name.toLowerCase().includes(idNumber);
        })
        .splice(0, 50)
    );

    return () => {};
  }, [idNumber]);

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

  const barcodeHandler = (data) => {
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
    }
  };

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
    }
  };

  const onSubmitHandler = (submitData) => {
    const editPayload = {
      id: data?.id,
      requestorId: submitData?.formData?.requestorId?.value?.full_id_number,
      requestorName: submitData?.formData?.requestorId?.value?.full_name,
      item_Code: fuelInfo?.item_Code,
      warehouse_ReceivingId: fuelInfo?.warehouseId,
      liters: fuelInfo?.liters,
      asset: fuelInfo?.asset,
      odometer: fuelInfo?.odometer,
      remarks: fuelInfo?.remarks,
      company_Code: submitData?.formData?.companyId?.value?.code,
      company_Name: submitData?.formData?.companyId?.value?.name,
      department_Code: submitData?.formData?.departmentId?.value?.code,
      department_Name: submitData?.formData?.departmentId?.value?.name,
      location_Code: submitData?.formData?.locationId?.value?.code,
      location_Name: submitData?.formData?.locationId?.value?.name,
      account_Title_Code: submitData?.formData?.accountId?.value?.code,
      account_Title_Name: submitData?.formData?.accountId?.value?.name,
      empId: watch("formData.empId") ? submitData?.formData?.empId?.value?.full_id_number : "",
      fullname: watch("formData.fullName") ? submitData?.formData?.fullName : "",
    };

    try {
      setIsLoading(true);
      const res = request
        .post("FuelRegister/create", editPayload)
        .then((res) => {
          ToastComponent("Success!", "Updated request successfully", "success", toast);
          setIsLoading(false);
          fetchFuelRequest();
          setFuelInfo({
            item_Code: "DIESEL",
            item_Description: "DIESEL",
            soh: "",
            unit_Cost: "",
            liters: "",
            odometer: "",
            remarks: "",
            asset: "",
          });
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error!", err.response.data, "error", toast);
          setIsLoading(false);
        });
    } catch (err) {
      ToastComponent("Error!", "Sync error.", "error", toast);
    }
  };

  useEffect(() => {
    if (data && barcode) {
      const barcodeWarehouseId = barcode?.find((item) => item?.warehouseId === data?.warehouse_ReceivingId);

      setValue("formData.warehouseId", {
        label: data?.warehouse_ReceivingId,
        value: barcodeWarehouseId,
      });

      setValue("formData.remarks", data?.remarks);
      setValue("formData.asset", data?.asset);

      setFuelInfo({
        warehouseId: data?.warehouse_ReceivingId,
        item_Code: data?.item_Code,
        item_Description: data?.item_Description,
        warehouseId: data?.warehouse_ReceivingId,
        soh: barcodeWarehouseId?.remaining_Stocks,
        unit_Cost: barcodeWarehouseId?.unit_Cost,
        liters: data?.liters,
        odometer: data?.odometer,
        remarks: data?.remarks,
        asset: data?.asset,
      });

      setValue("formData.empId", {
        label: data.empId,
        value: {
          full_id_number: data.empId,
          full_name: data.fullname,
        },
      });
      setValue("formData.fullName", data.fullname);
    }
  }, [data, barcode]);

  console.log("Data: ", data);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <ModalContent>
          <ModalHeader mb={4}>
            <VStack justifyContent="center" spacing={-2}>
              <Text>Fuel Register</Text>
              <Text fontSize="xs">Edit Request</Text>
            </VStack>
          </ModalHeader>

          <ModalCloseButton onClick={onClose} />

          <ModalBody mb={5}>
            <Stack direction="column" height="500px" justifyContent="space-around">
              {/* <VStack alignItems="start" w="50%" mx={5}></VStack> */}

              <VStack alignItems="start" w="100%">
                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Requestor ID
                    </Text>

                    <Box w="full">
                      {employees?.length > 0 ? (
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
                        {errors.formData?.requestorId?.message}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Company
                    </Text>

                    <Box w="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Requestor Name
                    </Text>

                    <Box w="full">
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
                      <Text color="red" fontSize="xs">
                        {errors.formData?.requestorFullName?.message}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Department
                    </Text>

                    <Box width="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Remarks
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

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Location
                    </Text>

                    <Box w="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Odometer:{" "}
                    </Text>

                    <NumericFormat
                      customInput={Input}
                      value={data ? data?.odometer : ""}
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
                    />
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Account Title
                    </Text>

                    <Box width="full">
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
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full" />

                  <HStack w="full">
                    <Box w="full">
                      {!!selectedAccount.match(/Advances to Employees/gi) && (
                        <>
                          <Box w="full" display="flex" flexDirection="row">
                            <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                              Employee ID
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
                              <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="sm" />
                            )}

                            <Text color="red" fontSize="xs">
                              {errors.formData?.empId?.message}
                            </Text>
                          </Box>
                        </>
                      )}
                    </Box>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full" />

                  <HStack w="full">
                    <Box w="full">
                      {!!selectedAccount.match(/Advances to Employees/gi) && (
                        <>
                          <Box w="full" display="flex" flexDirection="row">
                            <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                              Full Name
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
                          </Box>
                        </>
                      )}
                    </Box>
                  </HStack>
                </HStack>
              </VStack>

              <VStack alignItems="start" w="100%">
                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Item Code
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.item_Code ? fuelInfo.item_Code : "Item Code required"}
                    </Text>
                  </HStack>

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Item Description
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.item_Description ? fuelInfo.item_Description : "Item Description required"}
                    </Text>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Barcode
                    </Text>
                    {barcode?.length > 0 ? (
                      <Controller
                        control={control}
                        name="formData.warehouseId"
                        render={({ field }) => (
                          <AutoComplete
                            ref={field.ref}
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

                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Stocks
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.soh ? fuelInfo.soh : "Select barcode number first"}
                    </Text>
                  </HStack>
                </HStack>

                <HStack w="full">
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Liters:{" "}
                    </Text>

                    <NumericFormat
                      customInput={Input}
                      value={data ? data?.liters : ""}
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
                  <HStack w="full">
                    <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                      Unit Cost
                    </Text>
                    <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                      {fuelInfo.unit_Cost ? fuelInfo.unit_Cost : "Select barcode number first"}
                    </Text>
                  </HStack>
                </HStack>

                <HStack w="100%">
                  <Text minW="12.5%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                    Asset:{" "}
                  </Text>

                  <Input
                    {...register("formData.asset")}
                    fontSize="15px"
                    size="md"
                    placeholder="Enter Asset"
                    border="1px"
                    borderColor="gray.400"
                    borderRadius="none"
                    autoComplete="off"
                    onChange={(e) => assetHandler(e.target.value)}
                  />
                </HStack>
              </VStack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Stack w="100%">
              <Button
                size="sm"
                leftIcon={<IoSaveOutline fontSize="19px" />}
                borderRadius="none"
                colorScheme="teal"
                type="submit"
                isLoading={isLoading}
                isDisabled={
                  !fuelInfo.item_Code ||
                  !fuelInfo.item_Description ||
                  !fuelInfo.warehouseId ||
                  !fuelInfo.soh ||
                  !fuelInfo.unit_Cost ||
                  !fuelInfo.liters ||
                  !fuelInfo.remarks ||
                  !fuelInfo.asset ||
                  fuelInfo.liters > fuelInfo.soh ||
                  !watch("formData.requestorId") ||
                  !watch("formData.requestorFullName") ||
                  !watch("formData.companyId") ||
                  !watch("formData.departmentId") ||
                  !watch("formData.locationId") ||
                  !watch("formData.accountId")
                }
                px={4}
              >
                Add to Request
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
