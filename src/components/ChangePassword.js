import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import request from "../services/ApiClient";
import CryptoJS from "crypto-js";
import { useRef, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import { ToastComponent } from "./Toast";

const schema = yup.object().shape({
  formData: yup.object().shape({
    oldPassword: yup.string().required("Old Password is required"),
    newPassword: yup.string().required("New Password is required"),
    confirmPassword: yup.string().required("Confirm Password is required"),
  }),
});

export const ChangePassword = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const toast = useToast();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  const username = userDetails?.userName;

  console.log("UserName: ", username);

  const { register } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    },
  });

  const handleChangePassword = async () => {
    try {
      const changePasswordData = {
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      };
      const response = await request.post("Login/changepassword", changePasswordData).then((res) => {
        console.log("Response: ", res);
        console.log("Response");

        ToastComponent("Success!", res?.data?.message, "success", toast);
        onClose();
      });
    } catch (err) {
      console.log("Error: ", err);
      ToastComponent("Error", err.response.data, "error", toast);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClose={onClose} />
          <ModalHeader>Change Password</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Old Password</FormLabel>
              <Input {...register("formData.oldPassword")} type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  {...register("formData.newPassword")}
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordsMatch(e.target.value === confirmPassword);
                  }}
                />
                {passwordsMatch && newPassword && (
                  <InputRightElement>
                    <CheckIcon color="green.500" />
                  </InputRightElement>
                )}
              </InputGroup>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordsMatch(e.target.value === newPassword);
                  }}
                />
                {passwordsMatch && newPassword && (
                  <InputRightElement>
                    <CheckIcon color="green.500" />
                  </InputRightElement>
                )}
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" isDisabled={!passwordsMatch || (!newPassword && !confirmPassword)} onClick={handleChangePassword}>
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
