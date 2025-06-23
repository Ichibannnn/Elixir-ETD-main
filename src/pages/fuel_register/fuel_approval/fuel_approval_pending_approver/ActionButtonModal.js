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
  FormLabel,
  Box,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Select as AutoComplete } from "chakra-react-select";
import { IoCheckmarkOutline } from "react-icons/io5";
import { MdCheck } from "react-icons/md";
import axios from "axios";
import { FaGasPump } from "react-icons/fa";

export const ViewModal = ({ isOpen, onClose, data }) => {
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
                  <Text fontSize="xs">{data?.driver}</Text>
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

export const RejectModal = ({ isOpen, onClose, data, fetchFuelApproval, isLoading, setIsLoading }) => {
  const [rejectRemarks, setRejectRemarks] = useState("");
  const toast = useToast();

  const remarksHandler = (data) => {
    if (data) {
      setRejectRemarks(data);
    } else {
      setRejectRemarks("");
    }
  };

  const onSubmitHandler = () => {
    const payload = [
      {
        id: data?.id,
        reject_Remarks: rejectRemarks,
      },
    ];

    Swal.fire({
      title: "Confirmation!",
      text: "Reject this fuel request?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = request
            .put("FuelRegister/reject", payload)
            .then((res) => {
              ToastComponent("Success!", "Rejected fuel request successfully", "success", toast);
              setIsLoading(false);
              fetchFuelApproval();
              setRejectRemarks("");
              onClose();
            })
            .catch((err) => {
              ToastComponent("Error!", err.response.data, "error", toast);
              setIsLoading(false);
            });
        } catch (err) {
          ToastComponent("Error!", "Sync error.", "error", toast);
        }
      } else {
        ToastComponent("Error!", "Check error.", "error", toast);
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={4}>
          <VStack justifyContent="center" spacing={-2}>
            <Text>Reject Form</Text>
          </VStack>
        </ModalHeader>

        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Flex justifyContent="space-between">
            <Stack w="full" spacing={0.5}>
              <FormLabel>Remarks:</FormLabel>
              <Input fontSize="15px" size="md" placeholder="Enter reject remarks" onChange={(e) => remarksHandler(e.target.value)} />
            </Stack>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Stack w="100%">
            <Button
              size="sm"
              leftIcon={<MdCheck fontSize="19px" />}
              borderRadius="none"
              colorScheme="teal"
              onClick={onSubmitHandler}
              isLoading={isLoading}
              isDisabled={!rejectRemarks}
              px={4}
            >
              Approve
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ApproveModal = ({ isOpen, onClose, data, fetchFuelApproval }) => {
  const schema = yup.object().shape({
    formData: yup.object().shape({
      companyId: yup.object().required().typeError("Company Name is required"),
      departmentId: yup.object().required().typeError("Department Category is required"),
      locationId: yup.object().required().typeError("Location Name is required"),
      accountId: yup.object().required("Account Name is required"),
      empId: yup.object().nullable(),
      fullName: yup.string(),
    }),
  });

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://rdfsedar.com/api/data/employee/filter/active", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_SEDAR_TOKEN,
        },
      });
      setPickerItems(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        companyId: "",
        departmentId: "",
        locationId: "",
        accountId: "",
        empId: "",
        fullName: "",
      },
    },
  });

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

  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();

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

  const onSubmitHandler = (submitData) => {
    console.log("SubmitData: ", submitData);

    const payload = [
      {
        id: data?.id,
        company_Code: submitData?.formData?.companyId.value?.code,
        company_Name: submitData?.formData?.companyId.value?.name,
        department_Code: submitData?.formData?.departmentId.value?.code,
        department_Name: submitData?.formData?.departmentId.value?.name,
        location_Code: submitData?.formData?.locationId.value?.code,
        location_Name: submitData?.formData?.locationId.value?.name,
        account_Title_Code: submitData?.formData?.accountId.value?.code,
        account_Title_Name: submitData?.formData?.accountId.value?.name,
        empId: submitData?.formData?.empId?.value?.full_id_number,
        fullname: submitData?.formData?.fullName,
      },
    ];

    console.log("payload", payload);

    Swal.fire({
      title: "Confirmation!",
      text: "Approve this fuel request?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = request
            .put(`FuelRegister/approve`, payload)
            .then(() => {
              ToastComponent("Success", "Approved fuel request successfully", "success", toast);
              setIsLoading(false);
              fetchFuelApproval();
              reset();
              onClose();
            })
            .catch((err) => {
              ToastComponent("Error", err.response.data, "warning", toast);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} closeOnOverlayClick={false} closeOnEsc={false} isCentered>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <ModalContent>
          <ModalHeader textAlign="center"></ModalHeader>
          <ModalBody>
            <VStack>
              <Stack w="100%" alignItems="center">
                <HStack gap={1}>
                  <FaGasPump />
                  <Text fontWeight="semibold">Approve Fuel Request</Text>
                </HStack>

                <ModalCloseButton onClick={onClose} />
              </Stack>

              <Stack spacing={1} p={4} border="2px" borderRadius="none" borderColor="gray.200" w="100%" h="full">
                <HStack gap={1}>
                  <Text fontSize="14px" fontWeight="semibold">
                    ID:
                  </Text>
                  <Text fontSize="14px">{data?.id}</Text>
                </HStack>

                <HStack gap={1}>
                  <Text fontSize="14px" fontWeight="semibold">
                    FUEL:
                  </Text>
                  <Text fontSize="14px">{data?.item_Description}</Text>
                </HStack>

                <HStack gap={1}>
                  <Text fontSize="14px" fontWeight="semibold">
                    UOM:
                  </Text>
                  <Text fontSize="14px">{data?.uom}</Text>
                </HStack>

                <HStack gap={1}>
                  <Text fontSize="14px" fontWeight="semibold">
                    LITERS:
                  </Text>
                  <Text fontSize="14px">
                    {data?.liters.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </HStack>

                <HStack gap={1}>
                  <Text fontSize="14px" fontWeight="semibold">
                    ASSET:
                  </Text>
                  <Text fontSize="14px">{data?.asset}</Text>
                </HStack>

                <HStack gap={1}>
                  <Text fontSize="14px" fontWeight="semibold">
                    ODOMETER:
                  </Text>
                  <Text fontSize="14px">
                    {data.odometer
                      ? data.odometer.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : "-"}
                  </Text>
                </HStack>

                <HStack gap={1}>
                  <Text fontSize="14px" fontWeight="semibold">
                    DRIVER:
                  </Text>
                  <Text fontSize="14px">{data?.driver}</Text>
                </HStack>
              </Stack>

              <Stack spacing={2} p={4} border="2px" borderRadius="none" borderColor="gray.200" w="100%">
                <Text fontWeight="semibold" color="blue.600">
                  Charge Of Accounts
                </Text>

                <Box>
                  <FormLabel fontSize="xs">Company</FormLabel>
                  {company?.length ? (
                    <Controller
                      control={control}
                      name="formData.companyId"
                      render={({ field }) => (
                        <AutoComplete
                          ref={field.ref}
                          value={field.value}
                          size="sm"
                          placeholder="Select Company"
                          onChange={(e) => {
                            console.log("E: ", e);

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
                        />
                      )}
                    />
                  ) : (
                    <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="sm" />
                  )}

                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Department</FormLabel>
                  {department?.length ? (
                    <Controller
                      control={control}
                      name="formData.departmentId"
                      render={({ field }) => (
                        <AutoComplete
                          size="sm"
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
                        />
                      )}
                    />
                  ) : (
                    <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="sm" />
                  )}

                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Location</FormLabel>

                  {location?.length ? (
                    <Controller
                      control={control}
                      name="formData.locationId"
                      render={({ field }) => (
                        <AutoComplete
                          size="sm"
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
                        />
                      )}
                    />
                  ) : (
                    <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="sm" />
                  )}

                  <Text color="red" fontSize="xs">
                    {errors.formData?.locationId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Account Title</FormLabel>
                  {account?.length ? (
                    <Controller
                      control={control}
                      name="formData.accountId"
                      render={({ field }) => (
                        <AutoComplete
                          size="sm"
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
                        />
                      )}
                    />
                  ) : (
                    <Spinner thickness="4px" emptyColor="gray.200" color="blue.500" size="sm" />
                  )}

                  <Text color="red" fontSize="xs">
                    {errors.formData?.accountId?.message}
                  </Text>
                </Box>
                {!!selectedAccount.match(/Advances to Employees/gi) && (
                  <>
                    <Box>
                      <FormLabel fontSize="xs">Employee ID</FormLabel>
                      {pickerItems?.length ? (
                        <Controller
                          control={control}
                          name="formData.empId"
                          render={({ field }) => (
                            <AutoComplete
                              size="sm"
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
                    <Box>
                      <FormLabel fontSize="xs">Full Name:</FormLabel>
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
              </Stack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Stack w="100%">
              <Button
                size="sm"
                leftIcon={<IoCheckmarkOutline fontSize="19px" />}
                colorScheme="teal"
                type="submit"
                isLoading={isLoading}
                isDisabled={!watch("formData.companyId") || !watch("formData.departmentId") || !watch("formData.locationId") || !watch("formData.accountId")}
              >
                Approve
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
