"use client";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MenuOutlined,
} from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/AntdIcon";
import {
  Layout,
  Menu,
  Modal,
  Drawer as ADrawer,
  Form,
  Input,
  Alert,
  ConfigProvider,
} from "antd";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, IconButton } from "@mui/material";
import { AuthService } from "@/app/services/auth-service";
import Drawer from "@/app/components/drawer";
import EditProfile from "@/app/modals/edit-profile";

interface IPageLayout {
  children: any;
  active: string;
}

const PageLayout = ({ children, active }: IPageLayout) => {
  const [collapsed, setCollapsed] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [savingChangePassword, setSavingChangePassword] = useState(false);
  const [error, setError] = useState<any | null>();

  useEffect(() => {
    AuthService.currentUser().then((profile) => {
      console.log(profile);
      if (!profile.changedPassword) {
        setError(null);
        console.log("Change password");
        setChangePassword(true);
      }
    });
  }, []);

  const onCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  const handleChangePassword = (values: any) => {
    setSavingChangePassword(true);
    AuthService.changePassword(values.currentPassword, values.password)
      .then(() => {
        setChangePassword(false);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setSavingChangePassword(false);
      });
  };

  const ignoreClick = () => {
    setSavingChangePassword(true);
    AuthService.keepPassword()
      .then(() => {
        setChangePassword(false);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setSavingChangePassword(false);
      });
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
      hasSider
    >
      {/* <Layout.Sider collapsedWidth='0' collapsible trigger={null} collapsed={collapsed} open={true}>
                  <div style={{
                      background: 'white',
                      minHeight: '100vh',
                      position: 'fixed',
                      width: 0
                      // minWidth: '100vh'
                  }}>
                      <div style={{
                          position: 'relative',
                          width: '0px' // TODO drawer
                      }}>
                          <Drawer active={active} />
                      </div>
                      
                  </div>
              </Layout.Sider> */}

      <ADrawer
        width={300}
        closable={false}
        open={!collapsed}
        placement="left"
        onClose={() => setCollapsed(true)}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <Drawer active={active} />
        </div>
      </ADrawer>

      <Layout>
        <Layout.Header
          style={{
            background: "white",
            padding: 0,
            position: "relative",
            height: 0, // was  40
          }}
        >
          {/* <div style={{ */}
          {/*     display: 'flex', */}
          {/*     alignItems: 'center', */}
          {/*     flexDirection: 'row', */}
          {/*     height: '100%', */}
          {/*     marginRight: 20 */}
          {/* }}> */}
          {/*     <div style={{flex: 1}} /> */}
          {/*     <span style={{marginRight: 10}}>Course Progress</span> */}
          {/*     <CourseProgress image={'/images/react.png'} progress={50} course='reactjs' /> */}
          {/*     <CourseProgress image={'/images/react-native.png'} progress={78} course='react-native' /> */}
          {/*     <CourseProgress image={'/images/ionic.png'} progress={20} course='ionic' /> */}
          {/* </div> */}
        </Layout.Header>
        <Layout.Content
          style={{
            minHeight: "100vh",
            background:
              'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0.7) 100%), url("https://plus.unsplash.com/premium_photo-1673890230816-7184bee134db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80")',
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            // backgroundRepeat: "no-repeat",
          }}
        >
          <div style={{ paddingRight: 20, paddingLeft: 20 }}>{children}</div>
        </Layout.Content>
      </Layout>
      {showEditProfile && <EditProfile onCancel={onCloseEditProfile} />}

      <IconButton
        //   size="90"
        sx={{
          position: "fixed",
          top: 10,
          left: 10,
          background: "green",
          zIndex: 15,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          color: "white",
          backgroundColor: "rgb(130, 200, 3)",
        }}
        onClick={toggleMenu}
      >
        <MenuIcon />
      </IconButton>
      {/* <button
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            background: "green",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            color: "white",
            backgroundColor: "rgb(130, 200, 3)",
          }}
          onClick={toggleMenu}
        >
          <MenuOutlined color="white" />
        </button> */}

      {/* <Modal
          title="Change Password"
          open={changePassword}
          onCancel={() => setChangePassword(false)}
          okButtonProps={{ style: { display: "none" } }}
        >
          {error && (
            <Alert message={error} type="error" style={{ marginBottom: 10 }} />
          )}
          <Form
            layout="vertical"
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            onFinish={handleChangePassword}
          >
            <Form.Item
              style={{}}
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Current Password required",
                },
              ]}
            >
              <Input.Password
                placeholder="Current Password"
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
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
            <Form.Item
              style={{}}
              label="New Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "New Password required",
                },
              ]}
            >
              <Input.Password
                placeholder="New Password"
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
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
              loading={savingChangePassword}
              disabled={savingChangePassword}
              onClick={ignoreClick}
              style={{
                background: "rgb(143, 230, 76)",
                borderStyle: "none",
                borderRadius: 28,
                color: "white",
                cursor: "pointer",
                width: "100%",
                marginTop: 20,
              }}
            >
              Keep current password
            </Button>
  
            <Button
              size="large"
              loading={savingChangePassword}
              disabled={savingChangePassword}
              htmlType="submit"
              style={{
                background: "rgb(143, 230, 76)",
                borderStyle: "none",
                borderRadius: 28,
                color: "white",
                cursor: "pointer",
                width: "100%",
                marginTop: 20,
              }}
            >
              Change Password
            </Button>
          </Form>
        </Modal> */}
    </Layout>
  );
};

export default PageLayout;
