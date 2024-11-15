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
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import { FcAbout } from "react-icons/fc";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Select as AutoComplete } from "chakra-react-select";
import { NumericFormat } from "react-number-format";
import { IoSaveOutline } from "react-icons/io5";
import { decodeUser } from "../../../../services/decode-user";

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

export const CancelRequestModal = ({ isOpen, onClose, data, fetchFuelRequest, isLoading, setIsLoading }) => {
  const toast = useToast();

  const cancelSubmitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`FuelRegister/cancel/${data?.id}`)
        .then((res) => {
          ToastComponent("Success", "Item has been cancelled", "success", toast);
          fetchFuelRequest();
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

const fetchBarcodeApi = async () => {
  const res = await request.get(`FuelRegister/material-available-item`);
  return res.data;
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    warehouseId: yup.object().required().typeError("Barcode is required"),
    asset: yup.object().required().typeError("Asset is required"),
    remarks: yup.object().required().typeError("Remarks is required"),
  }),
});

export const AddModal = ({ isOpen, onClose, data, fetchFuelRequest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [barcode, setBarcode] = useState([]);
  const [fuelInfo, setFuelInfo] = useState({
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

  const currentUser = decodeUser();
  const userId = currentUser?.id;
  const toast = useToast();

  const { control, setValue, register, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        warehouseId: null,
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

  const onSubmitHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Save this fuel request?",
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
        if (!data) {
          const createPayload = {
            userId: userId,
            item_Code: fuelInfo?.item_Code,
            warehouse_ReceivingId: fuelInfo?.warehouseId,
            liters: fuelInfo?.liters,
            odometer: fuelInfo?.odometer,
            remarks: fuelInfo?.remarks,
            asset: fuelInfo?.asset,
          };

          try {
            setIsLoading(true);
            const res = request
              .post("FuelRegister/create", createPayload)
              .then((res) => {
                ToastComponent("Success!", "Request fuel successfully", "success", toast);
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
            ToastComponent("Error!", "Check error.", "error", toast);
          }
        } else {
          const editPayload = {
            id: data?.id,
            userId: userId,
            item_Code: fuelInfo?.item_Code,
            warehouse_ReceivingId: fuelInfo?.warehouseId,
            liters: fuelInfo?.liters,
            odometer: fuelInfo?.odometer,
            remarks: fuelInfo?.remarks,
            asset: fuelInfo?.asset,
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
        }
      } else {
        ToastComponent("Error!", "Sync error.", "error", toast);
      }
    });
  };

  useEffect(() => {
    if (data && barcode) {
      const barcodeWarehouseId = barcode?.find((item) => item?.warehouseId === data?.warehouse_ReceivingId);

      setValue("formData.warehouseId", {
        label: data?.warehouse_ReceivingId,
        value: barcodeWarehouseId,
      });

      setValue("formData.asset", data?.asset);
      setValue("formData.remarks", data?.remarks);

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
    }
  }, [data, barcode]);

  console.log("data", data);
  console.log("FuelInfo", fuelInfo);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={4}>
          <VStack justifyContent="center" spacing={-2}>
            <Text>Fuel Register</Text>
            <Text fontSize="xs">Create Request</Text>
          </VStack>
        </ModalHeader>

        <ModalCloseButton onClick={onClose} />

        <ModalBody mb={5}>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" w="full" mx={5}>
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

              <HStack w="full">
                <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                  Barcode Number
                </Text>
                {barcode?.length > 0 ? (
                  <Controller
                    control={control}
                    name="formData.warehouseId"
                    render={({ field }) => (
                      <AutoComplete
                        ref={field.ref}
                        value={field.value}
                        placeholder="Select Item Code"
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

              <HStack w="full">
                <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                  Unit Cost
                </Text>
                <Text fontSize="sm" textAlign="left" bgColor="gray.200" w="full" border="1px" borderColor="gray.200" py={1.5} px={4}>
                  {fuelInfo.unit_Cost ? fuelInfo.unit_Cost : "Select barcode number first"}
                </Text>
              </HStack>

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

              <HStack w="full">
                <Text minW="25%" w="auto" bgColor="primary" color="white" pl={2} pr={7} py={2.5} fontSize="xs">
                  Remarks:{" "}
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
            </VStack>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Stack w="100%">
            <Button
              size="sm"
              leftIcon={<IoSaveOutline fontSize="19px" />}
              borderRadius="none"
              colorScheme="teal"
              onClick={onSubmitHandler}
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
                fuelInfo.liters > fuelInfo.soh
              }
              px={4}
            >
              Save Request
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
