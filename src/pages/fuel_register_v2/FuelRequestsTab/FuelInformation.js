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

const currentUser = decodeUser();

const schema = yup.object().shape({
  formData: yup.object().shape({
    requestorId: yup.object().required("Account Name is required"),
    requestorFullname: yup.string(),

    companyId: yup.object().required().typeError("Company Name is required"),
    departmentId: yup.object().required().typeError("Department Category is required"),
    locationId: yup.object().required().typeError("Location Name is required"),
    accountId: yup.object().required("Account Name is required"),
    empId: yup.object().nullable(),
    fullName: yup.string(),
  }),
});

export const FuelInformation = () => {
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [disableFullName, setDisableFullName] = useState(true);

  // SEDAR
  const [pickerItems, setPickerItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://rdfsedar.com/api/data/employees", {
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
      const res = await axios.get("http://10.10.2.76:8088/api/dropdown/company?api_for=vladimir&status=1&paginate=0", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
        },
      });
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8088/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
        },
      });
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.departments);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8088/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
        },
      });
      setLocation(res.data.result.locations);
    } catch (error) {}
  };

  // FETCH ACcount API
  const fetchAccountApi = async (id = "") => {
    try {
      const res = await axios.get("http://10.10.2.76:8088/api/dropdown/account-title?status=1&paginate=0" + id, {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
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

  return <div>FuelInformation</div>;
};
