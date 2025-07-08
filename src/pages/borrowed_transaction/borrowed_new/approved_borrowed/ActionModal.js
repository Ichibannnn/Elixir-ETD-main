import { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
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
  Input,
  Box,
  FormLabel,
  Stack,
  Image,
  Icon,
  Badge,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { decodeUser } from "../../../../services/decode-user";
import { useReactToPrint } from "react-to-print";
import { Select as AutoComplete } from "chakra-react-select";
import { AiOutlineControl } from "react-icons/ai";

const currentUser = decodeUser();

export const ViewModal = ({ isOpen, onCloseView, statusBody }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    itemCode: "",
    itemDescription: "",
    returnQuantity: "",
    consumes: "",
    quantity: "",
  });

  const id = statusBody.id;
  const fetchBorrowedDetailsApi = async (id) => {
    const res = await request.get(`Borrowed/GetAllDetailsInBorrowedIssue?id=${id}`);
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(id).then((res) => {
      setBorrowedDetailsData(res);
    });
  };

  useEffect(() => {
    fetchBorrowedDetails();
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={5} fontSize="md"></ModalHeader>
        {/* <ModalCloseButton onClick={onClose} /> */}

        <ModalBody mb={10} ref={componentRef}>
          {/* Display Borrowed */}
          <Flex spacing={0} justifyContent="start" flexDirection="column">
            <Image src="/images/RDF Logo.png" w="13%" ml={3} />
            <Text fontSize="8px" ml={2}>
              Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
            </Text>
          </Flex>

          <Flex justifyContent="center" my={1}>
            <Text fontSize="xs" fontWeight="semibold">
              Borrowed Details
            </Text>
          </Flex>

          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Code:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customerCode}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customer}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.details}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Borrowed Date:
                </Text>
                <Text fontSize="xs"> {moment(borrowedDetailsData[0]?.preparedDate).format("MM/DD/yyyy")}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.borrowedPKey}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee Id:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.empId}</Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Employee Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.fullName}</Text>
              </HStack>
            </VStack>
          </Flex>

          <VStack justifyContent="center">
            <PageScroll minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Id
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      UOM
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="xs">
                      Prepared Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">{borrowdetails.uom}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.unitCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{moment(borrowdetails.preparedDate).format("MM/DD/yyyy")}</Td>
                    </Tr>
                  ))}
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
                  {borrowedDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button colorScheme="blue" onClick={handlePrint}>
              Print
            </Button>
            <Button colorScheme="gray" onClick={onCloseView}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ConsumeModal = ({
  isConsumeModalOpen,
  setIsConsumeModalOpen,
  isLoading,
  setIsLoading,
  setMaterialList,
  fetchMaterialsList,
  fetchReturnRequest,
  fetchBorrowed,
  fetchNotificationWithParams,
  materialListId,
  setMaterialListId,
  borrowedId,
  setBorrowedId,
  consumedQuantity,
  setConsumedQuantity,
  serviceReportNo,
  setServiceReportNo,
  itemCode,
  setItemCode,
  itemDescription,
  setItemDescription,
  uom,
  setUom,
  returnQuantity,
}) => {
  const schema = yup.object().shape({
    formData: yup.object().shape({
      borrowedItemPKey: yup.string(),
      consume: yup.number().required("Consume quantity is required").typeError("Must be a number"),
      serviceReportNo: yup.number().required("Service report number is required").typeError("Must be a number"),
      oneChargingCode: yup.object().required().typeError("Charging Code is required"),
      accountId: yup.object().required("Account Name is required"),
      empId: yup.object().nullable(),
      fullName: yup.string(),
    }),
  });

  const [oneChargingCode, setOneChargingCode] = useState([]);
  const [showOneChargingData, setShowChargingData] = useState(null);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);
  const toast = useToast();

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

  const fetchAccountApi = async () => {
    try {
      const res = await request.get("OneCharging/GetAccountTitle?UsePagination=true&status=true");

      console.log("Res: ", res);
      setAccount(res.data.oneChargingList);
    } catch (error) {}
  };

  // Fisto Account Title ~~~~~
  // const fetchAccountApi = async (id = "") => {
  //   try {
  //     const res = await axios.get("http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0" + id, {
  //       headers: {
  //         Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
  //       },
  //     });
  //     setAccount(res.data.result.account_titles);
  //   } catch (error) {}
  // };

  useEffect(() => {
    fetchAccountApi();
  }, []);

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
        oneChargingCode: "",
        accountId: "",
        consume: "",
        serviceReportNo: "",
        empId: "",
        fullName: "",
        addedBy: currentUser.userName,
      },
    },
  });

  const triggerPointHandler = (event) => {
    const selectAccountTitle = account?.find((item) => {
      return item.syncId === parseInt(event);
    });

    if (!selectedAccount?.accountDescription?.match(/Advances to Employees/gi)) {
      setIdNumber("");
      setValue("formData.empId", "");
      setValue("formData.fullName", "");
    }
    setSelectedAccount(selectAccountTitle?.accountDescription);
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

  // console.log("oneChargingCode", watch("formData.oneChargingCode"));

  const submitConsumeHandler = async (data) => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
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
        console.log(borrowedId);
        setIsLoading(true);
        try {
          const response = request
            .post(`Borrowed/EditReturnedQuantity`, {
              borrowedPKey: borrowedId,
              borrowedItemPKey: materialListId,
              itemCode: itemCode,
              itemDescription: itemDescription,
              uom: uom,
              consume: consumedQuantity,
              reportNumber: serviceReportNo,
              oneChargingCode: data.formData.oneChargingCode.value.code,
              accountCode: data.formData.accountId.value.accountCode,
              accountTitles: data.formData.accountId.value.accountDescription,
              empId: data.formData.empId?.value.full_id_number,
              fullName: data.formData.fullName,
              addedBy: currentUser.fullName,
            })
            .then((response) => {
              sessionStorage.removeItem("Borrowed ID");
              sessionStorage.removeItem("Navigation");
              ToastComponent("Success", "Returned materials was saved", "success", toast);
              setIsLoading(false);
              setConsumedQuantity("");
              setServiceReportNo("");
              fetchBorrowed();
              setIsConsumeModalOpen(false);
              fetchMaterialsList();
              fetchReturnRequest();
              setMaterialListId("");
              setBorrowedId("");
              setMaterialList([]);
              setItemCode("");
              setItemDescription("");
              setUom("");
              fetchNotificationWithParams();
            })
            .catch((err) => {
              // ToastComponent("Error", err.response.data, "warning", toast);
            });
        } catch (err) {
          ToastComponent("Error", err.response.data, "warning", toast);
        }
      }
    });
  };

  const setQuantityValidate = (data) => {
    if (data !== "0") {
      setConsumedQuantity(data);
    }
  };

  const serviceReportHandler = (data) => {
    setServiceReportNo(data);
  };

  const clearConsumedQty = () => {
    setIsConsumeModalOpen(false);
    setConsumedQuantity("");
    setServiceReportNo("");
  };

  return (
    <Modal isOpen={isConsumeModalOpen} onClose={() => setIsConsumeModalOpen(false)} isCentered size="5xl" closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(submitConsumeHandler)}>
        <ModalContent>
          <ModalHeader textAlign="center"></ModalHeader>
          <ModalBody>
            <HStack>
              <Stack spacing={2} p={4} border="2px" borderRadius="5%" borderColor="gray.200" w="50%" h="full">
                <HStack gap={1}>
                  <Text fontWeight="semibold">Input Consume Quantity</Text>
                  <Badge colorScheme="green" variant="solid" className="inputConsume">
                    <Text>{`Available consume: ${returnQuantity}`}</Text>
                  </Badge>
                </HStack>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold">
                    Consume Quantity:
                  </Text>
                  <Input
                    {...register("formData.consume")}
                    fontSize="xs"
                    onChange={(e) => setQuantityValidate(e.target.value)}
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    autoComplete="off"
                    min="1"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.consume?.message}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold">
                    Service Report #:
                  </Text>
                  <Input
                    {...register("formData.serviceReportNo")}
                    fontSize="xs"
                    onChange={(e) => serviceReportHandler(e.target.value)}
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    autoComplete="off"
                    min="1"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.serviceReportNo?.message}
                  </Text>
                </Box>
              </Stack>
              <Stack spacing={2} p={4} border="2px" borderRadius="5%" borderColor="gray.200" w="50%">
                <Text fontWeight="semibold">Charge Of Accounts</Text>

                <Box>
                  <FormLabel fontSize="xs">Charging Code:</FormLabel>
                  <Controller
                    control={control}
                    name="formData.oneChargingCode"
                    render={({ field }) => (
                      <AutoComplete
                        ref={field.ref}
                        value={field.value}
                        size="sm"
                        placeholder="Select Charging Code"
                        onChange={(e) => {
                          field.onChange(e);
                          setShowChargingData(e?.value);
                        }}
                        options={oneChargingCode?.oneChargingList?.map((item) => {
                          return {
                            label: `${item.code} - ${item.name}`,
                            value: item,
                          };
                        })}
                      />
                    )}
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.oneChargingCode?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Company:</FormLabel>
                  <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                    {showOneChargingData ? `${showOneChargingData?.company_code} - ${showOneChargingData?.company_name}` : "Select Charging Code"}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Business Unit:</FormLabel>
                  <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                    {showOneChargingData ? `${showOneChargingData?.business_unit_code} - ${showOneChargingData?.business_unit_name}` : "Select Charging Code"}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Department:</FormLabel>
                  <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                    {showOneChargingData ? `${showOneChargingData?.department_code} - ${showOneChargingData?.department_name}` : "Select Charging Code"}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Unit:</FormLabel>
                  <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                    {showOneChargingData ? `${showOneChargingData?.department_unit_code} - ${showOneChargingData?.department_unit_name}` : "Select Charging Code"}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Sub Unit:</FormLabel>
                  <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                    {showOneChargingData ? `${showOneChargingData?.sub_unit_code} - ${showOneChargingData?.sub_unit_name}` : "Select Charging Code"}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Location:</FormLabel>
                  <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                    {showOneChargingData ? `${showOneChargingData?.location_code} - ${showOneChargingData?.location_name}` : "Select a Charging Code"}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="xs">Account Title:</FormLabel>
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
                          triggerPointHandler(e?.value.syncId);
                        }}
                        options={account?.map((item) => {
                          return {
                            label: `${item.accountCode} - ${item.accountDescription}`,
                            value: item,
                          };
                        })}
                      />
                    )}
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.accountId?.message}
                  </Text>
                </Box>
                {!!selectedAccount.match(/Advances to Employees/gi) && (
                  <>
                    <Box>
                      <FormLabel fontSize="sm">Employee ID</FormLabel>
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
                      <Text color="red" fontSize="xs">
                        {errors.formData?.empId?.message}
                      </Text>
                    </Box>
                    <Box>
                      <FormLabel fontSize="sm">Full Name:</FormLabel>
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
            </HStack>
            <HStack></HStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button size="sm" onClick={clearConsumedQty} isLoading={isLoading} disabled={isLoading} variant="outline">
              Close
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              isDisabled={
                !watch("formData.oneChargingCode") ||
                !watch("formData.consume") ||
                !watch("formData.serviceReportNo") ||
                consumedQuantity > returnQuantity ||
                !watch("formData.accountId")
              }
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export const EditQuantityModal = (props) => {
  const { isOpen, onClose, returnRequest, editData, setEditData, fetchReturnRequest, fetchMaterialsList, borrowedId, materialListId, availableConsume, serviceReportNo } = props;

  const schema = yup.object().shape({
    formData: yup.object().shape({
      editId: yup.string(),
      consumedQty: yup.number().required().typeError("Consumed quantity is required"),
      oneChargingCode: yup.object().required().typeError("Charging Code is required"),
      accountTitleId: yup.object().required("Account Name is required"),
      empId: yup.object().nullable(),
      fullName: yup.string(),
    }),
  });

  const toast = useToast();
  const [oneChargingCode, setOneChargingCode] = useState([]);
  const [showOneChargingData, setShowChargingData] = useState(null);
  const [account, setAccount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://rdfsedar.com/api/data/employee/filter/active", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_SEDAR_TOKEN,
        },
      });

      const sedarEmployees = res.data.data.map((item) => {
        return {
          label: item.general_info.full_id_number,
          value: item.general_info.full_id_number,
        };
      });

      setPickerItems(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchAccountApi = async () => {
    try {
      const res = await request.get("OneCharging/GetAccountTitle?UsePagination=true&status=true");

      console.log("Res: ", res);
      setAccount(res.data.oneChargingList);
    } catch (error) {}
  };

  // Fisto Account Title ~~~~~~~~~
  // const fetchAccountApi = async () => {
  //   try {
  //     const res = await axios.get("http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0", {
  //       headers: {
  //         Authorization: "Bearer " + process.env.REACT_APP_OLD_FISTO_TOKEN,
  //       },
  //     });
  //     setAccount(res.data.result.account_titles);
  //   } catch (error) {}
  // };

  useEffect(() => {
    fetchAccountApi();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        consumedQty: "",
        companyId: "",
        departmentId: "",
        locationId: "",
        accountTitleId: "",
        empId: "",
        fullName: "",
      },
    },
  });

  const triggerPointHandler = (event) => {
    const selectAccountTitle = account?.find((item) => {
      return item.syncId === parseInt(event);
    });

    if (!selectedAccount?.accountDescription?.match(/Advances to Employees/gi)) {
      setIdNumber("");
      // setValue("formData.empId", "");
      // setValue("formData.fullName", "");
    }
    setSelectedAccount(selectAccountTitle?.accountDescription);
  };

  const [idNumber, setIdNumber] = useState();
  const [info, setInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);

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

  useEffect(() => {
    if (account.length && !watch("formData.accountTitleId")) {
      const returnEdit = returnRequest?.find((item) => item.id === editData.id);
      setValue("formData.accountTitleId", {
        label: `${returnEdit.accountCode} - ${returnEdit.accountTitles}`,
        value: account?.find((item) => item.accountCode === returnEdit.accountCode),
      });
      setSelectedAccount(returnEdit.accountTitles);
    }
  }, [editData.id, account]);

  // Employee id & Fullname && Consumed Quantity
  useEffect(() => {
    if (editData.id) {
      setValue("formData.id", editData.id);
      setValue("formData.consumedQty", editData.consumedQuantity);
      setValue("formData.fullName", editData.fullName);
      setValue("formData.empId", {
        label: editData.empId,
        value: {
          full_id_number: editData.empId,
          full_name: editData.fullName,
        },
      });

      setValue("formData.oneChargingCode", {
        label: `${editData?.oneChargingCode} - ${editData?.oneChargingName}`,
        value: editData,
      });
    }
  }, [editData]);

  const submitHandler = async (data) => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
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
        console.log("Data: ", data);

        setIsLoading(true);
        try {
          const response = request
            .put(`Borrowed/EditConsumeQuantity`, {
              id: editData.id,
              oneChargingCode: data.formData.oneChargingCode.value.oneChargingCode,
              accountCode: data.formData.accountTitleId.value.accountCode,
              accountTitles: data.formData.accountTitleId.value.accountDescription,
              empId: data.formData.empId?.value.full_id_number,
              fullName: data.formData.fullName,
              consume: data.formData.consumedQty,
              borrowedPkey: borrowedId,
              borrowedItemPkey: materialListId,
              reportNumber: editData.reportNumber,
            })
            .then((response) => {
              sessionStorage.removeItem("Borrowed ID");
              sessionStorage.removeItem("Navigation");
              ToastComponent("Success", "Edit consumed quantity was saved.", "success", toast);
              fetchReturnRequest();
              fetchMaterialsList();
              setIsLoading(false);
              onClose();
            })
            .catch((error) => {
              ToastComponent("Update Failed", error.response.data, "error", toast);
              setIsLoading(false);
            });
        } catch (error) {
          ToastComponent("Update Failed", error.response.data, "error", toast);
        }
      }
    });
  };

  // console.log("Watch Charging: ", watch("formData.oneChargingCode"));
  // console.log("fetchChargingCode: ", oneChargingCode);
  // console.log("EditData: ", editData);
  // console.log("OneCharging State: ", showOneChargingData);
  // console.log("GetTable: ", returnRequest);

  console.log("Error: ", errors);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="lg" isCentered>
        <ModalOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <ModalContent
            styles={{
              content: {
                borderRadius: "none",
              },
            }}
          >
            <ModalBody p={6}>
              <Flex flexDir="column">
                <Flex justifyContent="left" alignItems="center" mb={3} gap={1}>
                  <Icon as={AiOutlineControl} boxSize={6} />
                  <Text fontSize="sm" color="black" fontWeight="semibold">
                    Edit Consumed Quantity
                  </Text>
                </Flex>

                <Stack>
                  <Box mb={2}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      <HStack>
                        <Text>Consumed Quantity</Text>
                        <Badge colorScheme="green" variant="solid" className="inputConsume">
                          <Text>{`Available consume: ${availableConsume}`}</Text>
                        </Badge>
                      </HStack>
                    </FormLabel>

                    <Input
                      {...register("formData.consumedQty")}
                      // bgColor="#fff8dc"
                      type="number"
                      fontSize="sm"
                      placeholder="Please enter consumed quantity"
                      autoComplete="off"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      min="1"
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.consumedQty?.message}
                    </Text>
                  </Box>
                </Stack>

                <Flex justifyContent="left" p={2} mt={4}>
                  <HStack>
                    <Icon as={AiOutlineControl} boxSize={6} />
                    <Text fontSize="sm" color="black" fontWeight="semibold">
                      Charging of Accounts
                    </Text>
                  </HStack>
                </Flex>

                <Stack spacing={1}>
                  <Box p={1}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Charging Code
                    </FormLabel>
                    <Controller
                      control={control}
                      name="formData.oneChargingCode"
                      render={({ field }) => (
                        <AutoComplete
                          size="sm"
                          ref={field.ref}
                          value={field.value}
                          placeholder="Select Charging Code"
                          onChange={(e) => {
                            console.log("E: ", e);
                            field.onChange(e);

                            // setShowChargingData(e?.value);

                            // if (watch("formData.oneChargingCode")) {
                            //   setShowChargingData(editData);
                            // } else {
                            //   setShowChargingData(e?.value);
                            // }
                          }}
                          options={oneChargingCode?.oneChargingList?.map((item) => {
                            return {
                              label: `${item.code} - ${item.name}`,
                              value: item,
                            };
                          })}
                        />
                      )}
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.oneChargingCode?.message}
                    </Text>
                  </Box>

                  {/* <Box p={0.5}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Company:
                    </FormLabel>
                    <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                      {showOneChargingData ? `${showOneChargingData?.companyCode} - ${showOneChargingData?.companyName}` : "Select Charging Code"}
                    </Text>
                  </Box>

                  <Box p={0.5}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Business Unit:
                    </FormLabel>
                    <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                      {showOneChargingData ? `${showOneChargingData?.businessUnitCode} - ${showOneChargingData?.businessUnitName}` : "Select Charging Code"}
                    </Text>
                  </Box>

                  <Box p={0.5}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Department:
                    </FormLabel>
                    <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                      {showOneChargingData ? `${showOneChargingData?.departmentCode} - ${showOneChargingData?.departmentName}` : "Select Charging Code"}
                    </Text>
                  </Box>

                  <Box p={0.5}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Unit:
                    </FormLabel>
                    <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                      {showOneChargingData ? `${showOneChargingData?.departmentUnitCode} - ${showOneChargingData?.departmentUnitName}` : "Select Charging Code"}
                    </Text>
                  </Box>

                  <Box p={0.5}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Sub Unit:
                    </FormLabel>
                    <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                      {showOneChargingData ? `${showOneChargingData?.subUnitCode} - ${showOneChargingData?.subUnitName}` : "Select Charging Code"}
                    </Text>
                  </Box>

                  <Box p={0.5}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Location:
                    </FormLabel>
                    <Text fontSize="sm" bgColor="gray.300" w="full" border="1px" borderColor="gray.400" pl={4} py={2.5}>
                      {showOneChargingData ? `${showOneChargingData?.locationCode} - ${showOneChargingData?.locationName}` : "Select a Charging Code"}
                    </Text>
                  </Box> */}

                  <Box p={0.5}>
                    <FormLabel fontSize="xs" fontWeight="semibold">
                      Account Title
                    </FormLabel>
                    <Controller
                      control={control}
                      name="formData.accountTitleId"
                      render={({ field }) => (
                        <AutoComplete
                          size="sm"
                          ref={field.ref}
                          value={field.value}
                          placeholder="Select Account"
                          onChange={(e) => {
                            field.onChange(e);
                            triggerPointHandler(e?.value.syncId);
                          }}
                          options={account?.map((item) => {
                            return {
                              label: `${item.accountCode} - ${item.accountDescription}`,
                              value: item,
                            };
                          })}
                        />
                      )}
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.accountTitleId?.message}
                    </Text>
                  </Box>
                  {!!selectedAccount.match(/Advances to Employees/gi) && (
                    <>
                      <Box p={1}>
                        <FormLabel fontSize="xs">Employee ID</FormLabel>
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
                        <Text color="red" fontSize="xs">
                          {errors.formData?.empId?.message}
                        </Text>
                      </Box>
                      <Box p={1}>
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
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button mr={2} type="submit" variant="outline" isLoading={isLoading} onClick={onClose} size="sm" px={4}>
                Close
              </Button>
              <Button
                type="submit"
                // isDisabled={selectedAccount}
                isLoading={isLoading}
                colorScheme="blue"
                size="sm"
                px={4}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
