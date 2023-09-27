import {
  ArrowLeftOutlined,
  EditOutlined,
  PoweroffOutlined,
  UnorderedListOutlined,
  CodeOutlined,
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
import {
  Stack,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
  Badge,
  styled,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { usePathname } from "next/navigation";
interface IMenuButton {
  children: any;
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
  const router = useRouter();

  return (
    <a href={to ? to : ""}>
      {active ? (
        <Button
          type={"default"}
          icon={icon}
          onClick={onClick}
          size="large"
          style={{
            ...Styles.Button.Filled,
            width: "100%",
            textAlign: "start",
          }}
        >
          {children}
        </Button>
      ) : (
        <Button
          type={"dashed"}
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
      )}
    </a>
  );
};

const Drawer = ({
  active,
  toggleDrawer,
}: {
  active: string;
  toggleDrawer: any;
}) => {
  const image = "/images/icon.png";
  const [profile, setProfile] = useState<any>();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [activeNav, setActiveNav] = useState("browse");
  const [onCancel, setOnCancel] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  // Navigation Links

  useEffect(() => {
    const nextSplit = pathname.split("/");
    if (nextSplit.length == 2) {
      setActiveNav(nextSplit[1]);
    } else if (nextSplit.length == 3) {
      setActiveNav(nextSplit[2]);
    } else if (nextSplit.length >= 5) {
      setActiveNav(nextSplit[2]);
    }
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
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  return (
    <Stack height={"100%"} position={"relative"} spacing={2} flex={1}>
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
      {/* User Profile */}
      <Stack alignItems={"center"} justifyContent={"center"} py={5}>
        <IconButton onClick={onOpenEditProfile}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <SmallAvatar>
                <Edit sx={{ width: 15 }}></Edit>
              </SmallAvatar>
            }
          >
            <Avatar
              {...stringAvatar(
                `${profile?.firstname || "C"} ${profile?.lastname || "T"}`
              )}
            />
          </Badge>
        </IconButton>

        <Typography variant="h6">
          {profile?.firstname} {profile?.lastname}
        </Typography>

        <Typography variant="body2">
          {profile?.role == "facilitator" ? "Facilitator" : profile?.location}
        </Typography>
      </Stack>

      {/* Navigation links */}

      <Stack flex={1} spacing={1}>
        {/* default links */}
        <MenuButton
          active={activeNav == "home"}
          to={"/home"}
          icon={<UnorderedListOutlined />}
          onClick={toggleDrawer}
        >
          Browse
        </MenuButton>
        <MenuButton
          active={activeNav == "assessment"}
          to={"/assessment"}
          icon={<BookOutlined />}
          onClick={toggleDrawer}
        >
          Assessments
        </MenuButton>

        {/* Links for facilitator */}
        {profile?.role == "facilitator" && (
          <Stack flex={1} spacing={1}>
            <Divider>Admin</Divider>
            <MenuButton
              active={activeNav == "students"}
              to={"/admin/students"}
              icon={<UserOutlined />}
              onClick={toggleDrawer}
            >
              Students
            </MenuButton>
            <MenuButton
              active={activeNav == "courses"}
              to={"/admin/courses"}
              icon={<VideoCameraOutlined />}
              onClick={toggleDrawer}
            >
              Courses
            </MenuButton>
            <MenuButton
              active={activeNav == "assessments"}
              to={"/admin/assessments"}
              icon={<BookOutlined />}
              onClick={toggleDrawer}
            >
              Assessments
            </MenuButton>
          </Stack>
        )}
        {/* link for bootcamper */}
        {!profile?.bootcamp && <></>}
      </Stack>
      <Box height={"100%"} flex={1}></Box>
      {/* Signout */}
      <Stack>
        <Button
          type="link"
          onClick={onLogout}
          icon={<PoweroffOutlined />}
          size="large"
          style={{
            ...Styles.Button.Outline,
            width: "100%",
            textAlign: "start",
            color: "red",
          }}
        >
          Sign out
        </Button>
      </Stack>
    </Stack>
  );
};

export default Drawer;
