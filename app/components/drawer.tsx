import {
    ArrowLeftOutlined,
    EditOutlined,
    PoweroffOutlined,
    UnorderedListOutlined,
    VideoCameraAddOutlined,
    UserOutlined,
    VideoCameraOutlined,
    BookOutlined,
  } from "@ant-design/icons"
  import { Alert, Button, Form, Input } from "antd"
  import Modal from "antd/lib/modal/Modal"
  import React, { useEffect, useState } from "react"
  import EditProfile from "../modals/edit-profile"
  import { AuthService } from "../services/auth-service"
  import { ProfileService } from "../services/profile-service"
import Link from "next/link"
import { useRouter } from "next/navigation"
  
  interface IMenuButton {
    children?: any
    to?: string
    active?: boolean
    icon: any
    onClick?: () => void
  }

  const MenuButton = ({ children, to, active = false, icon, onClick }: IMenuButton) => {
    return (
      <Link href={to ? to : ''}>
        <button
          onClick={onClick}
          style={{
            background: "rgba(61, 61, 61, 0.05)",
            borderStyle: "none",
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 28,
            color: active ? "rgb(143, 230, 76)" : "rgb(61, 61, 61)",
            cursor: "pointer",
            width: "100%",
            marginRight: 20,
            fontWeight: "bold",
            textAlign: "left",
            marginBottom: 10,
            display: "flex",
          }}
        >
          {icon && <div style={{ marginRight: 10 }}>{icon}</div>}
          {children}
        </button>
      </Link>
    )
  }
  
  const Drawer = ({ active }: {
    active: string
  }) => {
    const image = "/images/icon.png"
    const [profile, setProfile] = useState<any>()
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [savingPassword, setSavingPassword] = useState(false)
  
    const [onCancel, setOnCancel] = useState(false)
    const [confirmLogout, setConfirmLogout] = useState(false)
    const router = useRouter()
  
    useEffect(() => {
      ProfileService.observerProfile((profile: any) => {
        setProfile(profile)
      })
    }, [])
  
    const onLogout = () => {
      setConfirmLogout(true)
    }
  
    const handleLogout = () => {
      AuthService.logout()
      setConfirmLogout(false)
  
      router.push("/")
    }
  
    const onCloseEditProfile = () => {
      setShowEditProfile(false)
    }
  
    const onOpenEditProfile = () => {
      setShowEditProfile(true)
    }
  
    const handleEditProfile = (values: any) => {
      setSavingPassword(true)
      ProfileService.updateProfile(profile?.uid, values)
        .then(() => {
          console.log(`Saved successfully`)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setSavingPassword(false)
          setShowEditProfile(false)
        })
      // console.log(values);
    }
  
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          width: "300px",
        }}
      >
        <div
          style={{
            background: "rgb(130, 200, 3)",
            width: 70,
            height: 70,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "white",
            fontSize: "1.3em",
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          {profile?.firstname.substring(0, 1)}
          {profile?.lastname.substring(0, 1)}
        </div>
  
        <div style={{ fontWeight: "bold" }}>
          {profile?.firstname} {profile?.lastname}
        </div>
        <div style={{ marginBottom: 10 }}>
          {profile?.role == "facilitator" ? "Facilitator" : profile?.location}
        </div>
  
        <EditOutlined onClick={onOpenEditProfile} />
  
        <div style={{ padding: 20, width: "100%", marginTop: 20 }}>
          {!profile?.bootcamp && (
            <MenuButton
              to={"/home"}
              icon={<UnorderedListOutlined />}
              active={active === "browse"}
            >
              Browse
            </MenuButton>
          )}
          <MenuButton
            to={"/webinars"}
            icon={<VideoCameraAddOutlined />}
            active={active === "webinars"}
          >
            Webinars
          </MenuButton>
          {profile?.isAdmin && (
            <MenuButton
              to={"/students"}
              icon={<UserOutlined />}
              active={active === "students"}
            >
              Students
            </MenuButton>
          )}
          {profile?.isAdmin && (
            <MenuButton
              to={"/courses"}
              icon={<VideoCameraOutlined />}
              active={active === "courses"}
            >
              Courses
            </MenuButton>
          )}
          {profile?.isAdmin && (
            <MenuButton
              to={"/assessments"}
              icon={<BookOutlined />}
              active={active === "assessments"}
            >
              Assessments
            </MenuButton>
          )}
        </div>
  
        <div style={{ flex: 1 }} />
  
        <div style={{ padding: 20, width: "100%" }}>
          <MenuButton onClick={onLogout} icon={<PoweroffOutlined />}>
            Sign out
          </MenuButton>
        </div>
  
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
      </div>
    )
  }
  
  export default Drawer
  