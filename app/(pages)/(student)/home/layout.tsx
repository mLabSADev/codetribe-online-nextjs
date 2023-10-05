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
import { Button, IconButton, Container, AppBar, Toolbar } from "@mui/material";
import { AuthService } from "@/app/services/auth-service";
import Drawer from "@/app/components/drawer";
import EditProfile from "@/app/modals/edit-profile";
import { Stack } from "@mui/material";
interface IPageLayout {
  children: any;
  active: string;
}

const PageLayout = (props: any) => {
  const [collapsed, setCollapsed] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [savingChangePassword, setSavingChangePassword] = useState(false);
  const [error, setError] = useState<any | null>();

  useEffect(() => {
    AuthService.currentUser().then((profile) => {
      if (!profile.changedPassword) {
        setError(null);
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

  // const handleChangePassword = (values: any) => {
  //   setSavingChangePassword(true);
  //   AuthService.changePassword(values.currentPassword, values.password)
  //     .then(() => {
  //       setChangePassword(false);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //     })
  //     .finally(() => {
  //       setSavingChangePassword(false);
  //     });
  // };

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
        height: "100%",
      }}
      hasSider
    >
      {/* <IconButton
        size="large"
        sx={{
          position: "fixed",
          top: 10,
          left: 10,
          background: "green",
          zIndex: 15,
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: 4,
       
        }}
        onClick={toggleMenu}
      >
        <MenuIcon />
      </IconButton> */}
      <ADrawer
        width={300}
        height={"100%"}
        closable={false}
        open={!collapsed}
        placement="left"
        onClose={() => setCollapsed(true)}
      >
        <Stack height={"100%"} flex={1}>
          <Drawer
            active={props.active}
            toggleDrawer={() => {
              toggleMenu();
            }}
          />
        </Stack>
      </ADrawer>

      <Layout>
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
          <AppBar
            sx={{ zIndex: 5 }}
            color="transparent"
            elevation={0}
            position="sticky"
          >
            <Toolbar>
              <IconButton
                sx={{ color: "white", backgroundColor: "rgb(130, 200, 3)" }}
                size="large"
                onClick={toggleMenu}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Container>{props.children}</Container>
        </Layout.Content>
      </Layout>
      {showEditProfile && <EditProfile onCancel={onCloseEditProfile} />}
    </Layout>
  );
};

export default PageLayout;
