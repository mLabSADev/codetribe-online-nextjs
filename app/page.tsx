"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Alert } from "antd";
import { Box, Stack, Typography, Fab } from "@mui/material";
import { AuthService } from "./services/auth-service";
import { useRouter } from "next/navigation";
import { Styles } from "./services/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
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
                <Input placeholder="Email Address" style={Styles.Input} />
              </Form.Item>
              <Button
                size="large"
                loading={resettingPassword}
                disabled={resettingPassword}
                htmlType="submit"
                style={Styles.Button.Text}
              >
                Reset Password
              </Button>
              <button
                type="button"
                disabled={resettingPassword}
                onClick={onCancel}
                style={Styles.Button.Outline}
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
  const [bgLink, setBGLink] = useState({
    link: "https://my.spline.design/abstractgradientbackground-ae8ec1cf1d3539574dc82e8925f79a95",
    color: "black",
  });
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
  const RunBGFunc = () => {
    const links = [
      {
        link: "https://my.spline.design/textdesignamazing-ec110a8793e2b183f03490dd3d3fafc5/",
        color: "white",
      },
      {
        link: "https://my.spline.design/abstractgradientbackground-ae8ec1cf1d3539574dc82e8925f79a95/",
        color: "black",
      },
      {
        link: "https://my.spline.design/dna-e81e566cdc6122a9727be890f316b28d/",
        color: "white",
      },
      {
        link: "https://my.spline.design/typegraveyard03-b53d5f44964d33717d2b7818154cf07b/",
        color: "white",
      },
      {
        link: "https://my.spline.design/cybersamurai-49ea362c364514cbac86265ea1f41839/",
        color: "white",
      },
    ];
    const index = Math.floor(Math.random() * links.length);
    setBGLink(links[index]);
    console.log(index);
  };
  useEffect(() => {
    // RunBGFunc();
  }, []);
  return (
    <Stack
      flex={1}
      position={"absolute"}
      left={0}
      right={0}
      bottom={0}
      top={0}
      p={3}
      overflow={{ xs: "auto", sm: "auto", md: "auto", lg: "hidden" }}
      sx={{
        background:
          "linear-gradient(227deg, #fffedb 0%, hsl(283, 100%, 88%) 100%)",
      }}
    >
      {/* <Box position={"absolute"} bottom={10} left={10} zIndex={5}>
        <Fab
          onClick={() => {
            RunBGFunc();
          }}
          color="inherit"
          size="small"
        >
          <RefreshIcon />
        </Fab>
      </Box> */}
      <Box position={"absolute"} top={0} left={0} right={0} bottom={0}>
        <iframe
          style={{ border: 0 }}
          src={bgLink.link}
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
              <Typography
                color={bgLink.color}
                variant={"h2"}
                fontFamily={"K2D"}
              >
                {title}
              </Typography>
            </Box>
            <Box display={{ xs: "none", sm: "none", md: "block", lg: "none" }}>
              <Typography
                color={bgLink.color}
                variant={"h3"}
                fontFamily={"K2D"}
              >
                {title}
              </Typography>
            </Box>
            <Box display={{ xs: "block", sm: "block", md: "none", lg: "none" }}>
              <Typography
                color={bgLink.color}
                variant={"h4"}
                fontFamily={"K2D"}
              >
                {title}
              </Typography>
            </Box>
            {/* .... */}
            <Typography
              color={bgLink.color}
              variant="h5"
              fontFamily={"Poppins"}
            >
              Welcome to Codetribe Coding Academy!
            </Typography>
            <Typography
              color={bgLink.color}
              variant="body2"
              fontFamily={"Poppins"}
            >
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
                  style={Styles.Input}
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
                    style={Styles.Input}
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
                    style={Styles.Input}
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
                      style={Styles.Input}
                    />
                  </Form.Item>
                  <Stack
                    sx={{ transform: "translate(0px, -20px)" }}
                    alignItems={"flex-end"}
                    justifyItems={"flex-end"}
                  >
                    <Button
                      style={Styles.Button.Text}
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
                    style={Styles.Input}
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
                    style={Styles.Input}
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
                  style={{ ...Styles.Button.Filled, width: "100%" }}
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
