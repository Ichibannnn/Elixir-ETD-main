import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
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
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import backgroundImage2 from "../assets/img/svg-login2.svg";
import misLogo from "../assets/img/misLogo.png";

import { useNavigate } from "react-router-dom";
import { ToastComponent } from "./Toast";
import { saltKey } from "../saltkey";

import React, { useState } from "react";
import request from "../services/ApiClient";
import CryptoJS from "crypto-js";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  formData: yup.object().shape({
    oldPassword: yup.string().required("Old Password is required"),
    newPassword: yup.string().required("New Password is required"),
    confirmPassword: yup.string().required("Confirm Password is required"),
  }),
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  var [Loader, setLoader] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  var navigate = useNavigate();
  const toast = useToast();

  const [modalUsername, setModalUsername] = useState("");

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

  const submitHandler = async (event) => {
    event.preventDefault();

    var login = { username, password };

    if ((username || password) === "") {
      return ToastComponent("Login Error", "Username and Password is required!", "error", toast);
    } else if ((username && password) === "") {
      return ToastComponent("Login Error", "Please fill up username or password!", "error", toast);
    } else {
      setLoader(true);
      var response = await request
        .post("Login/authenticate", login)
        .then((response) => {
          console.log("Response: ", response);

          if (response?.data?.userName === response?.data?.password) {
            setShowChangePasswordModal(true);
            setModalUsername(username);
          } else {
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(response?.data), saltKey).toString();
            console.log("ciphertext: ", ciphertext);
            sessionStorage.setItem("userToken", ciphertext);
            setLoader(false);
            navigate("/");
            window.location.reload(false);
            ToastComponent("Login Success", `Welcome to Elixir ETD! ${response?.data.fullName}`, "success", toast);
          }
        })
        .catch((err) => {
          ToastComponent("Login", err.response.data.message, "error", toast);
          setLoader(false);
        });
    }
  };

  const handleChangePassword = async () => {
    try {
      const changePasswordData = {
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      };
      const response = await request.post("Login/changepassword", changePasswordData);
      setUsername("");
      setPassword("");
      setShowChangePasswordModal(false);
      setLoader(false);
      ToastComponent("Success!", `Password Changed`, "success", toast);
      setInterval(window.location.reload(false), 1000);
    } catch (err) {
      ToastComponent("Error", err.response.data, "error", toast);
    }
  };

  const closeHandler = () => {
    setShowChangePasswordModal(false);
    setLoader(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Flex
      h="100vh"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundImage: `url(${backgroundImage2})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      flexDirection="column"
      position="relative"
    >
      <Box zIndex="1" w={["full", "sm"]} p={[8, 8]} mt={[20, "10vh"]} mx="auto" borderRadius={10} alignItems="center" justifyContent="center" className="form-color">
        <VStack spacing={8} align="flex-start" w="full">
          <VStack spacing={-1} align={["flex", "center"]} w="full">
            <Image boxSize="100px" objectFit="fill" src="/images/elixirlogos.png" alt="etheriumlogo" />
            <Heading fontSize="3xl" className="logo-text">
              Elixir ETD
            </Heading>
          </VStack>

          <Flex flexDirection="column" w="full">
            <form onSubmit={submitHandler}>
              <Text color="#fff" fontSize="13px">
                Username
              </Text>
              <Input
                placeholder="Enter username"
                rounded="none"
                variant="outline"
                borderColor="whiteAlpha.300"
                fontSize="xs"
                color="#fff"
                _hover={{ bg: "#1A202C" }}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <Text color="#fff" fontSize="13px">
                Password
              </Text>
              <Input
                placeholder="Enter password"
                rounded="none"
                variant="outline"
                type="password"
                color="#fff"
                borderColor="whiteAlpha.300"
                _hover={{ bg: "#1A202C" }}
                fontSize="xs"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <Button
                borderRadius="none"
                color="white"
                fontSize="13px"
                type="submit"
                className="login-button-gradient"
                w="full"
                mt={5}
                isLoading={Loader}
                isDisabled={!username || !password}
              >
                Login
              </Button>
            </form>
          </Flex>
        </VStack>
      </Box>

      <Box zIndex="1" borderRadius="10px 0 0 10px" mt={1} flexDirection="column" display="flex" justifyContent="center">
        <Box justifyContent="center" display="flex">
          <img src={misLogo} alt="logo" loading="lazy" style={{ width: "10%", height: "100%" }} />
        </Box>
        <Text fontSize="10px" color="white" textAlign="center">
          &#169; 2023 Powered by <br /> Management Information System
        </Text>
      </Box>

      <Modal isOpen={showChangePasswordModal} onClose={closeHandler} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClose={closeHandler} />
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
    </Flex>
  );
};

export default Login;
