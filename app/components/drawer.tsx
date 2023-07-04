import {
  ArrowLeftOutlined,
  EditOutlined,
  PoweroffOutlined,
  UnorderedListOutlined,
  VideoCameraAddOutlined,
  UserOutlined,
  VideoCameraOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import EditProfile from "../modals/edit-profile";
import { AuthService } from "../services/auth-service";
import { ProfileService } from "../services/profile-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Styles } from "../services/styles";
import { Stack, Avatar, Typography } from "@mui/material";

interface IMenuButton {
  children?: any;
  to?: string;
  active?: boolean;
  icon: any;
  onClick?: () => void;
}
export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      width: 56,
      height: 56,
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
const MenuButton = ({
  children,
  to,
  active = false,
  icon,
  onClick,
}: IMenuButton) => {
  return (
    <Link href={to ? to : ""}>
      <Button
        type="ghost"
        icon={icon}
        onClick={onClick}
        size="large"
        style={{
          ...Styles.Button.Outline,
          width: "100%",
          textAlign: "start",
        }}
      >
        {children}
      </Button>
    </Link>
  );
};

const Drawer = ({ active }: { active: string }) => {
  const image = "/images/icon.png";
  const [profile, setProfile] = useState<any>();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [onCancel, setOnCancel] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const router = useRouter();
  const links = [
    { link: "/home", title: "Browse", icon: <UnorderedListOutlined /> },
    { link: "/admin/students", title: "Students", icon: <UserOutlined /> },
    // { link: "/webinars", title: "Webinars", icon: <VideoCameraAddOutlined /> },
    { link: "/admin/courses", title: "Courses", icon: <VideoCameraOutlined /> },
    {
      link: "/admin/assessments",
      title: "Assessments",
      icon: <BookOutlined />,
    },
  ];
  useEffect(() => {
    ProfileService.observerProfile((profile: any) => {
      setProfile(profile);
    });
  }, []);

  const onLogout = () => {
    setConfirmLogout(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    setConfirmLogout(false);

    router.push("/");
  };

  const onCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const onOpenEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleEditProfile = (values: any) => {
    setSavingPassword(true);
    ProfileService.updateProfile(profile?.uid, values)
      .then(() => {
        console.log(`Saved successfully`);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSavingPassword(false);
        setShowEditProfile(false);
      });
    // console.log(values);
  };

  return (
    <Stack spacing={2} flex={1} position={"relative"}>
      <Modal
        title="Update Profile"
        open={showEditProfile}
        onOk={handleEditProfile}
        onCancel={onCloseEditProfile}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Form
          layout="vertical"
          initialValues={profile}
          onFinish={handleEditProfile}
        >
          {/* {errorMessage && <Alert message={errorMessage} type="error" style={{ marginBottom: 20 }} />} */}
          {/* {success && <Alert message={'A password reset link has been sent to your email'} type="success" style={{ marginBottom: 20 }} />} */}

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
              disabled
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
              placeholder="First Name"
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
              placeholder="Last Name"
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
            label="Cell Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Your phone is required",
              },
            ]}
          >
            <Input
              placeholder="Cell Phone"
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
            loading={savingPassword}
            disabled={savingPassword}
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
            Update
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Logout"
        open={confirmLogout}
        onOk={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
      <Stack alignItems={"center"} justifyContent={"center"} py={5}>
        <Avatar
          {...stringAvatar(
            `${profile?.firstname || "C"} ${profile?.lastname || "T"}`
          )}
        />
        <Typography variant="h6">
          {profile?.firstname} {profile?.lastname}
        </Typography>

        <Typography variant="body2">
          {profile?.role == "facilitator" ? "Facilitator" : profile?.location}
        </Typography>
        <EditOutlined onClick={onOpenEditProfile} />
      </Stack>

      {/* Navigation links */}
      <Stack flex={1} height={"100%"} spacing={1}>
        {links.map((link, i) => {
          if (profile?.isAdmin) {
            return (
              <MenuButton
                key={i}
                to={link.link}
                icon={link.icon}
                active={active === link.title.toLowerCase()}
              >
                {link.title}
              </MenuButton>
            );
          } else if (!profile?.bootcamp) {
            return (
              <MenuButton
                key={i}
                to={link.link}
                icon={link.icon}
                active={active === link.title.toLowerCase()}
              >
                {link.title}
              </MenuButton>
            );
          }
        })}
      </Stack>

      <Stack>
        <MenuButton onClick={onLogout} icon={<PoweroffOutlined />}>
          Sign out
        </MenuButton>
      </Stack>
    </Stack>
  );
};

export default Drawer;
