"use client";

import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Alert } from "antd";
import { Box, Stack, Typography } from "@mui/material";
import { AuthService } from "./services/auth-service";
import { useRouter } from "next/navigation";

// import "swiper/css"
const ForgotPassword = ({ email, onCancel }: any) => {
  const [resettingPassword, setResettingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [success, setSuccess] = useState<boolean>();

  const forgotPassword = ({ email }: any) => {
    setResettingPassword(true);

    return AuthService.forgotPassword(email)
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setResettingPassword(false);
      });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <Row style={{ width: "100%" }}>
        <Col xs={0} sm={0} md={4} lg={6} />
        <Col xs={24} sm={24} md={16} lg={9} style={{ padding: 20 }}>
          <div
            style={{
              padding: 20,
              width: "100%",
              borderRadius: 15,
              background: "white",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Reset Password</h2>
            <p style={{ textAlign: "center" }}>
              Input your email address below. You will receive an email with
              further instructions
            </p>
            <Form
              layout="vertical"
              initialValues={{ email: email ? email : "" }}
              onFinish={forgotPassword}
            >
              {errorMessage && (
                <Alert
                  message={errorMessage}
                  type="error"
                  style={{ marginBottom: 20 }}
                />
              )}
              {success && (
                <Alert
                  message={"A password reset link has been sent to your email"}
                  type="success"
                  style={{ marginBottom: 20 }}
                />
              )}
              <Form.Item
                style={{}}
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Your email address is required",
                  },
                ]}
              >
                <Input
                  placeholder="Email Address"
                  style={{
                    height: 50,
                    borderRadius: 10,
                    borderColor: "rgb(143, 230, 76)",
                    borderStyle: "solid",
                    padding: 10,
                    borderWidth: 2,
                  }}
                />
              </Form.Item>
              <Button
                size="large"
                loading={resettingPassword}
                disabled={resettingPassword}
                htmlType="submit"
                style={{
                  background: "rgb(143, 230, 76)",
                  borderStyle: "none",
                  borderRadius: 28,
                  color: "white",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Reset Password
              </Button>
              <button
                type="button"
                disabled={resettingPassword}
                onClick={onCancel}
                style={{
                  background: "rgba(61, 61, 61, 0.05)",
                  borderStyle: "none",
                  padding: 10,
                  borderRadius: 28,
                  color: "rgb(61, 61, 61)",
                  cursor: "pointer",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                Nevermind
              </button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default () => {
  const [loggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setMessage] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [signInMethod, setSignInMethod] = useState<
    "new-user" | "existing-user"
  >();
  const router = useRouter();

  let title = "Learn how to build Android & IOS Apps";
  const onLogin = (values: any) => {
    setIsLoggingIn(true);
    setMessage(null);

    if (!signInMethod) {
      AuthService.checkUser(values.email)
        .then((user) => {
          console.log(user);
          if (user.registered === false) {
            setSignInMethod("new-user");
          } else {
            setSignInMethod("existing-user");
          }
        })
        .catch((err) => {
          setMessage(err.message);
        })
        .finally(() => {
          setIsLoggingIn(false);
        });
    } else {
      if (signInMethod === "existing-user") {
        AuthService.login(values.email, values.password)
          .then(() => {
            AuthService.currentUser().then((profile) => {
              onLoggedIn(profile);
            });
          })
          .catch((err) => {
            setMessage(err.message);
          })
          .finally(() => {
            setIsLoggingIn(false);
          });
      } else if (signInMethod === "new-user") {
        AuthService.confirmRegistration(values)
          .then(() => {
            AuthService.currentUser().then((profile) => {
              onLoggedIn(profile);
            });
          })
          .catch((err) => {
            setMessage(err.message);
          })
          .finally(() => {
            setIsLoggingIn(false);
          });
      }
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onLoggedIn = (profile: any) => {
    if (profile.bootcamp) {
      router.push("/webinars");
    } else {
      router.push("/home");
    }
  };

  const onForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const onCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <Stack
      flex={1}
      position={"absolute"}
      left={0}
      right={0}
      bottom={0}
      top={0}
      p={3}
      overflow={{ xs: "auto", sm: "auto", md: "hidden" }}
      sx={{
        background:
          "linear-gradient(227deg, #fffedb 0%, hsl(283, 100%, 88%) 100%)",
      }}
    >
      <Box position={"absolute"} top={0} left={0} right={0} bottom={0}>
        <iframe
          src="https://my.spline.design/abstractgradientbackground-ae8ec1cf1d3539574dc82e8925f79a95/"
          // frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
        flex={1}
        // height={"100%"}
        spacing={2}
        // overflow={"hidden"}
      >
        {/* Text & illustration */}
        <Stack
          flex={1}
          alignItems={"center"}
          direction={{ xs: "column-reverse", sm: "row", md: "row" }}
        >
          {/* Text */}
          <Stack zIndex={3} flex={1} spacing={2}>
            {/* ...Responsive title text... */}
            <Box display={{ xs: "none", sm: "none", md: "none", lg: "block" }}>
              <Typography variant={"h2"} fontFamily={"K2D"}>
                {title}
              </Typography>
            </Box>
            <Box display={{ xs: "none", sm: "none", md: "block", lg: "none" }}>
              <Typography variant={"h3"} fontFamily={"K2D"}>
                {title}
              </Typography>
            </Box>
            <Box display={{ xs: "block", sm: "block", md: "none", lg: "none" }}>
              <Typography variant={"h4"} fontFamily={"K2D"}>
                {title}
              </Typography>
            </Box>
            {/* .... */}
            <Typography variant="h5" fontFamily={"Poppins"}>
              Welcome to Codetribe Coding Academy!
            </Typography>
            <Typography variant="body2" fontFamily={"Poppins"}>
              We are excited that you have managed to join the team. Your
              hardwork and dedication has been recognized. We have an amazing
              team that is willing to train, guide and mentor you on your
              journey.
            </Typography>
          </Stack>
          {/* Illustration */}
          <Stack
            sx={{ width: "100%" }}
            alignItems={"center"}
            justifyItems={"center"}
            flex={1}
          >
            <Box
              width={{ sm: 300, md: 400, lg: "100%" }}
              sx={{ transform: "translate(0px, 0px)", zIndex: 0 }}
            >
              <img
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                src="/images/login-illustration.png"
              />
            </Box>
          </Stack>
        </Stack>
        {/* Form */}
        <Stack
          width={{ xs: "100%", sm: "100%", md: "100%", lg: 500 }}
          sx={{
            height: "100%",
            zIndex: 5,
          }}
        >
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            spacing={3}
            borderRadius={7}
            bgcolor={"white"}
            p={5}
          >
            {/* logo */}
            <img
              src="/images/mlab.png"
              style={{ height: 40, objectFit: "contain" }}
            />

            <Typography
              fontFamily={"Poppins"}
              variant="h4"
              textTransform={"uppercase"}
            >
              Sign In
            </Typography>
            <Form
              style={{ width: "90%" }}
              layout="vertical"
              initialValues={{ email: "", password: "" }}
              onFinish={onLogin}
            >
              {errorMessage && (
                <Alert
                  message={errorMessage}
                  type="error"
                  style={{ marginBottom: 20 }}
                />
              )}
              <Form.Item
                style={{}}
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Your email address is required",
                  },
                ]}
              >
                <Input
                  placeholder="Input your email address"
                  style={{
                    borderRadius: 10,
                    borderColor: "rgb(143, 230, 76)",
                    borderStyle: "solid",
                    padding: 10,
                    borderWidth: 2,
                  }}
                />
              </Form.Item>
              {signInMethod === "new-user" && (
                <Form.Item
                  label="First Name"
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "Your first name is required",
                    },
                  ]}
                >
                  <Input
                    placeholder="Input your first name"
                    style={{ height: 50 }}
                  />
                </Form.Item>
              )}
              {signInMethod === "new-user" && (
                <Form.Item
                  label="Last Name"
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: "Your last name is required",
                    },
                  ]}
                >
                  <Input
                    placeholder="Input your last name"
                    style={{ height: 50 }}
                  />
                </Form.Item>
              )}
              {signInMethod === "existing-user" && (
                <Stack>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Your password is required",
                      },
                    ]}
                  >
                    <Input
                      type="password"
                      placeholder="Input your password"
                      style={{
                        borderRadius: 10,
                        borderColor: "rgb(143, 230, 76)",
                        borderStyle: "solid",
                        padding: 10,
                        borderWidth: 2,
                      }}
                    />
                  </Form.Item>
                  <Stack
                    sx={{ transform: "translate(0px, -20px)" }}
                    alignItems={"flex-end"}
                    justifyItems={"flex-end"}
                  >
                    <Button
                      style={{ borderRadius: 30 }}
                      type="link"
                      onClick={onForgotPassword}
                      size="small"
                    >
                      Forgot Password
                    </Button>
                  </Stack>
                </Stack>
              )}

              {signInMethod === "new-user" && (
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Your password is required",
                    },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder="Input your password"
                    style={{ height: 50 }}
                  />
                </Form.Item>
              )}
              {signInMethod === "new-user" && (
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Enter your password again",
                    },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    style={{ height: 50 }}
                  />
                </Form.Item>
              )}
              {/* <Form.Item>
            <Button loading={loggingIn} disabled={loggingIn} htmlType='submit' type="primary" style={{height: 50, width: 100}}>Sign In</Button>
        </Form.Item> */}

              <Stack
                gap={1}
                sx={{ width: "100%" }}
                direction={{ xs: "column", sm: "column", md: "row", lg: "row" }}
              >
                <Button
                  style={{ width: "100%", borderRadius: 30 }}
                  type="primary"
                  size="large"
                  loading={loggingIn}
                  disabled={loggingIn}
                  htmlType="submit"
                >
                  Sign In
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Stack>
      </Stack>

      {showForgotPassword && (
        <ForgotPassword onCancel={onCloseForgotPassword} />
      )}
    </Stack>
  );
};
