"use client";
import {
  Stack,
  Typography,
  Slide,
  IconButton,
  Button,
  Container,
  Avatar,
  Chip,
  Card,
  CardContent,
  Backdrop,
  AppBar,
  Toolbar,
  Drawer,
  Box,
  CardActionArea,
  CardActions,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  Form,
  Image,
  Input,
  Modal,
  Button as ANTButton,
  Select,
  Upload,
  Divider,
  Tooltip,
  Spin,
  message,
  Space,
  Radio,
  Empty,
} from "antd";
import {
  Remove,
  Facebook,
  LinkedIn,
  WhatsApp,
  GitHub,
  LinkRounded,
  OpenInBrowser,
  ArrowBack,
  Close,
  Add,
  RemoveCircle,
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AuthService } from "@/app/services/auth-service";
import { useRouter } from "next/navigation";
import type { RcFile, UploadProps } from "antd/es/upload";
import {
  PlusOutlined,
  QuestionCircleFilled,
  FileImageOutlined,
  UploadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { ProfileService } from "@/app/services/profile-service";
import { Formik } from "formik";
import FormItem from "antd/es/form/FormItem";
import type { UploadFile } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";
import { FileService } from "@/app/services/file-service";
import firebase from "firebase";
import { object } from "yup";
import { CoursesService } from "@/app/services/courses-service";
import Course from "@/app/dtos/course";
import { StudentsService } from "@/app/services/students-service";
import Project from "@/app/dtos/project-dto";

const storageRef = firebase.storage().ref();
const socialOptions = ["linkedin", "facebook", "github", "whatsapp"];

const { Option } = Select;
const { Dragger } = Upload;
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const GetSocialsIcon = ({ social }: { social: string }) => {
  switch (social) {
    case "linkedin":
      return <LinkedIn />;
      break;
    case "facebook":
      return <Facebook />;
      break;
    case "github":
      return <GitHub />;
      break;
    case "whatsapp":
      return <WhatsApp />;
      break;
  }
};

const ProjectCard = ({
  openDetails,
  project,
  handleDelete,
  handleEdit,
}: {
  openDetails: Function;
  project: Project;
  handleDelete: Function;
  handleEdit: Function;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "100%", md: 100, lg: 300 },
        alignSelf: "flex-start",
      }}
      variant="outlined"
    >
      <Stack sx={{ width: "100%", height: 50 }} position={"relative"}>
        <img
          width={"100%"}
          height={"100%"}
          style={{ objectFit: "cover" }}
          src={
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          }
          alt="bg"
        />
        {/* <Box position={"absolute"} bottom={10} right={10}>
          <Avatar sx={{ width: 50, height: 50 }} src={project.projectIcon}></Avatar>
        </Box> */}
      </Stack>
      <CardContent>
        <Chip size="small" label={project.framework} />
        <Typography color={"black"} variant="h5">
          {project.title}
        </Typography>
        <Typography variant="body2">{project.description}</Typography>
      </CardContent>

      <CardActions>
        <Chip
          component={"a"}
          href={project.livesiteUrl}
          target="_blank"
          icon={<OpenInBrowser />}
          label="Open Project"
        ></Chip>
        <IconButton href={project.githubUrl} target="_blank">
          <GitHub />
        </IconButton>
        <Stack
          flex={1}
          direction={"row"}
          justifyContent={"flex-end"}
          justifyItems={"center"}
        >
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleEdit()}>
              <Edit />
              Edit
            </MenuItem>
            <MenuItem color="red" onClick={() => handleDelete()}>
              <Delete />
              Delete
            </MenuItem>
          </Menu>
        </Stack>
      </CardActions>
    </Card>
  );
};

const ProjectDetails = ({
  openState,
  toggleDetails,
}: {
  openState: boolean;
  toggleDetails: Function;
}) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openState}
      onClick={() => toggleDetails()}
    >
      <Stack
        direction={{ sm: "column", md: "row" }}
        sx={{ color: "black", overflowX: "hidden", overflowY: "auto" }}
        maxWidth={"90%"}
        minWidth={"90%"}
        bgcolor={"white"}
        borderRadius={3}
      >
        <Stack p={2}>
          <Stack direction={{ xs: "row", sm: "column", md: "column" }}>
            <IconButton>
              <Facebook />
            </IconButton>
            <IconButton>
              <WhatsApp />
            </IconButton>
            <IconButton>
              <LinkedIn />
            </IconButton>
            <IconButton>
              <GitHub />
            </IconButton>
          </Stack>
        </Stack>
        <Stack width={"100%"} flex={1}>
          <Stack p={4} direction={"row"} alignItems={"center"} spacing={2}>
            <Avatar
              src="https://plus.unsplash.com/premium_photo-1691591182467-b5ffdf32c1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt=""
            ></Avatar>
            <Typography variant="h3">Project Name</Typography>
          </Stack>
          <Stack
            width={"100%"}
            flex={1}
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
          >
            <Stack>
              <Stack width={400} height={400}>
                <Image
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src="https://cdn.dribbble.com/userupload/9451533/file/original-9364347c1a5802dec0c4e117727faf08.png?resize=1024x768"
                  alt="bg"
                />
              </Stack>
            </Stack>
            <Stack p={2} spacing={2}>
              <Typography variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur id felis pellentesque, tincidunt tellus sed, pretium
                nunc. Donec a feugiat lectus. Pellentesque consectetur purus
                eleifend ornare iaculis. Praesent non viverra enim. Fusce
                tincidunt, turpis sit amet pellentesque tempor, lectus lectus
                cursus ex, sed sollicitudin ex nisl quis odio. Sed facilisis
                dolor dui, nec malesuada sem vestibulum sed. Vivamus bibendum
                nibh sit amet ligula sollicitudin finibus. Morbi ipsum ante,
                dignissim vel lobortis vel, elementum aliquam elit. Quisque est
                tortor, euismod nec enim eu, semper tempor neque. Nam sem elit,
                porta eget fermentum id, ultricies id justo. Curabitur non
                mauris massa. Pellentesque volutpat varius est, ultrices pretium
                lacus iaculis ut.
              </Typography>
              <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
                <Chip sx={{ alignSelf: "start" }} label="Mobile Development" />
                <Chip sx={{ alignSelf: "start" }} label="NodeJs" />
                <Chip sx={{ alignSelf: "start" }} label="Firebase" />
                <Chip sx={{ alignSelf: "start" }} label="Android" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Backdrop>
  );
};

function stringToColor(string: string) {
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

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 199,
      height: 199,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
const Profile = () => {
  const [openDetails, setOpenDetails] = React.useState(false);
  const [profile, setProfile] = React.useState<any>({});
  const [editProfile, setEditProfile] = React.useState(false);
  const [projectModal, setProjectModal] = React.useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [courses, setCourses] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);
  const [projectStats, setProjectStats] = useState([]);
  const [updatingProject, setUpdatingProject] = useState(false);
  const [projectUpdateKey, setProjectUpdateKey] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const [form] = Form.useForm();
  const [projectsForm] = Form.useForm();
  const handleCancel = () => setPreviewOpen(false);

  const getProjects = (prof: any) => {
    setProjectStats([]);
    setProjects([]);
    StudentsService.getProjects(prof.uid).then((projects: any) => {
      console.log(projects);
      let counter = 0;
      let stats: any = [];
      if (projects) {
        let p: any = [];
        Object.keys(projects).map((key) => {
          Object.keys(projects[key]).map((list) => {
            console.log(list, projects[key][list]);
            const project = { ...projects[key][list], key: list };
            counter = counter + 1;
            p.push(project);
          });
          stats.push({ label: key, count: counter });
          setProjectStats(stats);
          counter = 0;
        });
        setProjects(p);
      }
    });
  };
  const getProfile = () => {};
  useEffect(() => {
    CoursesService.courses().then((res) => {
      let c: any = [];
      res.forEach((course: Course) => {
        c.push({ value: course.key, label: course.key });
      });
      setCourses(c);
      console.log(c);
    });
    AuthService.isLoggedIn().then((res: any) => {
      form.setFieldValue("email", res.email);
    });
    ProfileService.profile()
      .then((profile) => {
        setImageUrl(profile.profilePicture);
        Object.keys(profile).map((item) => {
          form.setFieldValue(item, profile[item]);
        });
        setProfile(profile);
        getProjects(profile);
      })
      .catch((err) => {});
  }, []);
  return (
    <>
      <>
        {!profile.firstname && (
          <Stack
            flex={1}
            height={"100vh"}
            justifyItems={"center"}
            alignItems={"center"}
          >
            <Spin tip="Loading..." />
          </Stack>
        )}
        {profile.firstname && (
          <Stack
            sx={{
              background:
                'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0.7) 100%), url("https://plus.unsplash.com/premium_photo-1673890230816-7184bee134db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <Drawer open={editProfile} anchor="right">
              <Toolbar>
                <IconButton
                  onClick={() => {
                    setEditProfile(false);
                  }}
                >
                  <Close />
                </IconButton>
                <Typography variant="h6">Edit Profile</Typography>
              </Toolbar>
              <Stack p={5} width={{ xs: "100%", sm: 500 }}>
                <Modal
                  zIndex={200000}
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img alt="example" style={{ width: "100%" }} src={imageUrl} />
                </Modal>
                <Divider orientation="left">Personal Details</Divider>
                <Form
                  form={form}
                  name="validateOnly"
                  layout="vertical"
                  onFinish={(values) => {
                    var cleanProfile: any = {};
                    Object.keys(values).map((item) => {
                      if (values[item]) {
                        cleanProfile[item] = values[item];
                      }
                    });
                    console.log({ values, cleanProfile });
                    ProfileService.updateProfile(profile.uid, {
                      ...profile,
                      ...cleanProfile,
                    })
                      .then((res) => {
                        setEditProfile(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  autoComplete="off"
                >
                  <FormItem
                    name={"firstname"}
                    label="First Name"
                    rules={[
                      { required: true, message: "First Name is required." },
                    ]}
                  >
                    <Input />
                  </FormItem>

                  <FormItem
                    name={"lastname"}
                    label="Last Name"
                    rules={[
                      { required: true, message: "Last Name is required." },
                    ]}
                  >
                    <Input />
                  </FormItem>

                  <Tooltip zIndex={2000} title="Soweto, Thembisa, etc">
                    <QuestionCircleFilled />
                  </Tooltip>

                  <FormItem
                    name="location"
                    label="Location"
                    rules={[
                      { required: true, message: "Location is required." },
                    ]}
                  >
                    <Input />
                  </FormItem>

                  <FormItem
                    name={"email"}
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Email is required.",
                        type: "email",
                      },
                    ]}
                  >
                    <Input />
                  </FormItem>

                  <FormItem
                    name={"cellphone"}
                    label="Cell Phone"
                    rules={[
                      { required: true, message: "Cell Phone is required." },
                    ]}
                  >
                    <Input />
                  </FormItem>

                  <FormItem
                    name={"bio"}
                    label="Bio"
                    rules={[{ required: true, message: "Bio is required." }]}
                  >
                    <Input.TextArea />
                  </FormItem>

                  <Divider orientation="left">Online Profiles</Divider>

                  {socialOptions.map((item) => {
                    return (
                      <FormItem key={item} name={item} label={item}>
                        <Input prefix="URL" />
                      </FormItem>
                    );
                  })}

                  <ANTButton type="primary" htmlType="submit">
                    Submit
                  </ANTButton>
                </Form>
              </Stack>
            </Drawer>
            <Modal
              zIndex={2000}
              open={projectModal}
              footer={false}
              onCancel={() => {
                setProjectModal(false);
                setUpdatingProject(false);
                projectsForm.resetFields();
              }}
            >
              <Stack spacing={2}>
                <Typography>
                  {updatingProject ? "Updating" : "New"} Project
                </Typography>

                <Form
                  form={projectsForm}
                  layout="vertical"
                  onFinish={(values) => {
                    if (updatingProject) {
                      StudentsService.updateProject(
                        values,
                        profile,
                        projectUpdateKey
                      ).then((res) => {
                        setProjectModal(false), projectsForm.resetFields();
                        message.info("Project Updated");
                        projectsForm.resetFields();
                        getProjects(profile);
                      });
                    } else {
                      StudentsService.createProject(values, profile)
                        .then((res) => {
                          // console.log('Project saved');
                          messageApi.open({
                            type: "success",
                            content: "Project Saved",
                            style: {
                              zIndex: 200,
                            },
                          });
                          getProjects(profile);
                          setProjectModal(false);
                          projectsForm.resetFields();
                          message;
                        })
                        .catch((err) => {
                          console.log("Something went wrong ", err);
                          messageApi.open({
                            type: "error",
                            content:
                              "Could not save project info, please try again. (Do not forget to add tag)",
                            style: {
                              zIndex: 200,
                            },
                          });
                        });
                    }
                  }}
                >
                  <FormItem
                    name="framework"
                    label="Framework"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      {courses.map((courseOption: any) => {
                        return (
                          <Radio.Button value={courseOption.value}>
                            {courseOption.value
                              .replaceAll("-", " ")
                              .toUpperCase()}
                          </Radio.Button>
                        );
                      })}
                    </Radio.Group>
                  </FormItem>

                  <FormItem
                    label="Title"
                    name={"title"}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </FormItem>

                  <FormItem
                    label="Description"
                    name={"description"}
                    rules={[{ required: true, max: 250 }]}
                  >
                    <Input.TextArea />
                  </FormItem>

                  <Form.List name="tags">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              label="Tag"
                              name={[name, "tag"]}
                              rules={[{ required: true }]}
                            >
                              <Input placeholder="Tag" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <ANTButton
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Tag
                          </ANTButton>
                          <Typography variant="caption">
                            Please add at least 1 tag
                          </Typography>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <FormItem
                    label="Live URL"
                    name={"livesiteUrl"}
                    rules={[{ required: true, type: "url" }]}
                  >
                    <Input />
                  </FormItem>
                  <FormItem
                    label="Github Project Link"
                    name={"githubUrl"}
                    rules={[{ required: true, type: "url" }]}
                  >
                    <Input />
                  </FormItem>
                  <ANTButton type="primary" htmlType="submit">
                    Submit
                  </ANTButton>
                </Form>
              </Stack>
            </Modal>

            <Container>
              <AppBar color="transparent" variant="outlined">
                <Toolbar variant="dense">
                  <IconButton
                    onClick={() => {
                      router.back();
                    }}
                    size="small"
                  >
                    <ArrowBack></ArrowBack>
                  </IconButton>
                </Toolbar>
              </AppBar>
              <ProjectDetails
                key={"project-details"}
                openState={openDetails}
                toggleDetails={() => {
                  setOpenDetails(!openDetails);
                }}
              />
              <Stack py={15} spacing={5} alignItems={"center"}>
                <IconButton
                  onClick={() => {
                    setEditProfile(true);
                    form.setFieldValue("firstname", profile?.firstname);
                    form.setFieldValue("lastname", profile?.lastname);
                  }}
                >
                  <Avatar
                    {...stringAvatar(
                      `${profile?.firstname || "C"} ${profile?.lastname || "T"}`
                    )}
                  />
                </IconButton>
                {contextHolder}
                <Typography variant="h2">
                  {profile?.firstname || "Loading"} {profile?.lastname || "..."}
                </Typography>
                <Typography variant="body1" textAlign={"center"}>
                  {profile.bio
                    ? profile.bio
                    : "Edit your profile to add a bio."}
                </Typography>
                <Stack
                  spacing={1}
                  gap={1}
                  direction={{ sx: "column", sm: "column", md: "row" }}
                >
                  <Chip label={profile.email}></Chip>
                  <Chip label={profile.location}></Chip>
                </Stack>
                <Stack direction={{ sx: "column", sm: "row", md: "row" }}>
                  {profile.facebook && (
                    <IconButton href={profile.facebook} target="_blank">
                      <Facebook></Facebook>
                    </IconButton>
                  )}
                  {profile.linkedin && (
                    <IconButton href={profile.linkedin} target="_blank">
                      <LinkedIn></LinkedIn>
                    </IconButton>
                  )}
                  {profile.whatsapp && (
                    <IconButton href={profile.whatsapp} target="_blank">
                      <WhatsApp></WhatsApp>
                    </IconButton>
                  )}
                  {profile.github && (
                    <IconButton href={profile.github} target="_blank">
                      <GitHub></GitHub>
                    </IconButton>
                  )}
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "column", md: "row" }}
                  flexWrap={"wrap"}
                  spacing={1}
                >
                  {projectStats.map((project: any) => {
                    return (
                      <Card variant="outlined">
                        <Stack
                          alignItems={"center"}
                          borderRadius={2}
                          sx={{ borderColor: "CaptionText", borderWidth: 1 }}
                          p={2}
                        >
                          <Typography variant="h4">{project.count}</Typography>
                          <Typography variant="body2">
                            {project.label}{" "}
                            {project.count > 1 ? "Projects" : "Project"}
                          </Typography>
                        </Stack>{" "}
                      </Card>
                    );
                  })}
                </Stack>
                {/* <Stack
                  direction={{ xs: "column", sm: "column", md: "row" }}
                  flexWrap={"wrap"}
                  spacing={1}
                >
                  <Card variant="outlined">
                    <Stack
                      alignItems={"center"}
                      borderRadius={2}
                      sx={{ borderColor: "CaptionText", borderWidth: 1 }}
                      p={2}
                    >
                      <Typography variant="h4">232</Typography>
                      <Typography variant="body2">Hub Theads</Typography>
                    </Stack>
                  </Card>
                  <Card variant="outlined">
                    <Stack
                      alignItems={"center"}
                      borderRadius={2}
                      sx={{ borderColor: "CaptionText", borderWidth: 1 }}
                      p={2}
                    >
                      <Typography variant="h4">34k</Typography>
                      <Typography variant="body2">Hub responses</Typography>
                    </Stack>
                  </Card>
                </Stack> */}
                <Stack py={5} spacing={1}>
                  <Typography textAlign={"center"} variant="h4">
                    My Projects
                  </Typography>
                  <Stack flex={1}>
                    <Button
                      onClick={() => {
                        setProjectModal(true);
                      }}
                      variant="outlined"
                      size="small"
                    >
                      Add Project
                    </Button>
                  </Stack>
                </Stack>
                <Stack
                  gap={5}
                  direction={"row"}
                  flexWrap={"wrap"}
                  width={"100%"}
                  justifyContent={"center"}
                >
                  {projects.length == 0 && <Empty description="No Projects" />}
                  {projects.map((project: Project, key: number) => {
                    return (
                      <ProjectCard
                        handleDelete={() => {
                          StudentsService.deleteProject(
                            profile.uid,
                            project.framework,
                            project.key
                          )
                            .then((res) => {
                              getProjects(profile);

                              message.error("Project Deleted");
                            })
                            .catch((err) => {
                              message.error(err.message);
                            });
                        }}
                        handleEdit={() => {
                          setUpdatingProject(true);
                          setProjectUpdateKey(project.key);
                          Object.keys(project).map((data: string) => {
                            projectsForm.setFields([project[data]]);
                            projectsForm.setFieldValue(data, project[data]);
                          });
                          setProjectModal(true);
                        }}
                        key={key}
                        project={project}
                        openDetails={() => {
                          setOpenDetails(!openDetails);
                        }}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </Container>
          </Stack>
        )}
      </>
    </>
  );
};

export default Profile;
