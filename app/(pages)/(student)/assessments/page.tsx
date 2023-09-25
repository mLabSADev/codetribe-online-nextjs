"use client";
import React, { useEffect, useState } from "react";
import { Styles } from "@/app/services/styles";
import { ArrowBack, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Container,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Button, Form, Input, Segmented, Table, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import { CoursesService } from "@/app/services/courses-service";
import Course from "@/app/dtos/course";
import { AuthService } from "@/app/services/auth-service";
import { Assessment } from "@/app/services/assessments-service";
interface DataType {
  key?: React.Key;
  title: string;
  course: string;
  content: string;
  lesson: string;
  created: string;
}
interface Filters {
  text: string;
  value: string;
}

function Assessments() {
  const [data, setData] = useState<DataType[]>([
    {
      key: 1,
      title: "Understanding React Components",
      lesson: "React Fundamentals",
      created: "2023-09-15",
      content:
        "In this assessment, you will demonstrate your understanding of React components. Please answer the following questions:\n\n1. Define what a React component is and explain its significance in React development.\n2. Differentiate between functional components and class components in React. Provide use cases for each.\n3. Explain the concept of state and props in React components. How are they used to pass and manage data?\n4. Write a simple React component (either functional or class) that displays 'Hello, React!' on the screen.",
      course: "ReactJS",
    },
    {
      key: 2,
      title: "Building Mobile Apps with Ionic",
      lesson: "Introduction to Ionic Framework",
      created: "2023-09-17",
      content:
        "This assessment evaluates your knowledge of the Ionic framework and mobile app development with Ionic:\n\n1. Describe the key features and advantages of using Ionic for mobile app development.\n2. Explain the difference between Ionic Framework and Ionic Capacitor.\n3. Provide an example of how to create a basic Ionic app with a tabbed interface.\n4. Discuss the importance of native device access in Ionic development. How does Ionic Capacitor facilitate this?",
      course: "IonicJS",
    },
    {
      key: 3,
      title: "Mastering Backend Development with Node.js",
      lesson: "Introduction to Node.js",
      created: "2023-09-20",
      content:
        "This assessment assesses your understanding of Node.js and server-side JavaScript:&\n;\n1. What is Node.js, and how does it differ from traditional JavaScript in a web browser?\n2. Explain the concept of the event loop in Node.js. How does it enable asynchronous programming?\n3. Create a simple Node.js server that listens on port 3000 and responds with 'Hello, Node.js!' when accessed.\n4. Discuss the benefits of using npm (Node Package Manager) in Node.js development.",
      course: "Node.js",
    },
    {
      key: 4,
      title: "Building Dynamic Web Apps with Angular",
      lesson: "Getting Started with Angular",
      created: "2023-09-22",
      content:
        "This assessment evaluates your knowledge of Angular and front-end web development:\n\n1. Define what Angular is and highlight its key features that make it suitable for building dynamic web applications.\n2. Explain the role of components in Angular. How do they facilitate the creation of reusable UI elements?\n3. Provide an example of how to create a new Angular component and include it in an Angular application.\n4. Discuss the importance of data binding in Angular. How does it enable two-way communication between components and templates?",
      course: "Angular",
    },
  ]);
  const [courseFilters, setCourseFilters] = useState<Filters[]>();
  const [showAssessmentSubmission, setShowAssessmentSubmission] =
    useState(false);
  const [openNotification, setOpenNotification] = React.useState({
    success: false,
    error: false,
  });
  const [user, setUser] = useState({});
  const router = useRouter();
  const theme = useTheme();
  const nextPathname = usePathname();
  const columns: ColumnsType<DataType> = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      filters: courseFilters,
      onFilter: (value: any, record) =>
        record.course.toLocaleLowerCase().indexOf(value) === 0,
    },
    { title: "Lesson", dataIndex: "lesson", key: "lesson" },
    { title: "Created", dataIndex: "created", key: "created" },
  ];
  const onFinish = (values: any) => {
    const splitter = nextPathname.split("/");
    const submission = {
      location: "",
      chapter: values.chapter,
      course: splitter[2],
      fullName: "",
      submitted: new Date().toISOString(),
      ...values,
    };

    AuthService.currentUser()
      .then((res) => {
        setUser(res);
        submission.fullName = `${res.firstname} ${res.lastname}`;
        if (res.location) {
          submission.location = res.location;
        } else {
          submission.location = res.groups[0];
        }
        // Send to firebase
        Assessment.submit(submission)
          .then((res) => {
            setShowAssessmentSubmission(false);
            setOpenNotification({ error: false, success: true });
          })
          .catch((err) => {
            setOpenNotification({ error: true, success: false });
          });
      })
      .then((err) => {});
  };
  useEffect(() => {
    CoursesService.courses().then((courses) => {
      var filters: Filters[] = [];
      courses.forEach((course) => {
        filters.push({ text: course.title, value: course.key });
      });
      setCourseFilters(filters);
    });
  });
  return (
    <Stack
      sx={{
        background:
          'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0.7) 100%), url("https://plus.unsplash.com/premium_photo-1673890230816-7184bee134db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Container>
        <AppBar color="transparent" elevation={0}>
          <Toolbar variant="dense">
            <Stack spacing={2} direction={"row"}>
              <IconButton
                onClick={() => {
                  router.back();
                }}
                size="small"
              >
                <ArrowBack></ArrowBack>
              </IconButton>
              <Stack>
                <Typography variant="h6">Assessments</Typography>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
      </Container>

      <Stack>
        <Container>
          <Stack pt={10} spacing={3}>
            <Stack p={5}>
              <Typography textAlign={"center"} variant="h4">
                Test your knowledge
              </Typography>
              <Typography textAlign={"center"} color={"GrayText"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Assumenda quaerat pariatur eaque aliquid dolore architecto
                necessitatibus, ea impedit voluptate aperiam voluptas quidem
                quia unde in. Fuga eligendi quisquam vel odio!
              </Typography>
            </Stack>
            <Stack alignItems={"center"} spacing={5}>
              <Table
                style={{ width: "100%" }}
                columns={columns}
                expandable={{
                  expandedRowRender: (record, i) => {
                    // console.log(record);
                    return (
                      <Stack key={i} direction={"row"} flex={1} spacing={1}>
                        <Stack flex={1} p={2}>
                          {/* <Typography >{record.content}</Typography> */}
                          <div
                            dangerouslySetInnerHTML={{ __html: record.content }}
                          />
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack width={"30%"} p={1}>
                          <Form
                            name="basic"
                            // wrapperCol={{ span: 16 }}
                            initialValues={{
                              remember: true,
                            }}
                            onFinish={(values) => {
                              // onFinish({ ...values, chapter: sub.title });
                            }}
                            //   onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout="vertical"
                          >
                            <Form.Item
                              label="Github URL"
                              name="github"
                              rules={[
                                {
                                  required: true,
                                  message: "Link to Github Projet is required!",
                                },
                                {
                                  type: "url",
                                  message: "This field must be a valid url.",
                                },
                              ]}
                            >
                              <Input
                                style={Styles.Input}
                                placeholder="https://github.com/.../..."
                              />
                            </Form.Item>
                            <Form.Item
                              label="Live URL"
                              name="live"
                              rules={[
                                {
                                  required: true,
                                  message: "Projet host URL is required",
                                },
                              ]}
                            >
                              <Input
                                style={Styles.Input}
                                placeholder="https://www.myhostedsite.com/.../..."
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button
                                size="large"
                                style={Styles.Button.Filled}
                                type="primary"
                                htmlType="submit"
                              >
                                Submit
                              </Button>
                            </Form.Item>
                          </Form>
                        </Stack>
                      </Stack>
                    );
                  },
                  //   rowExpandable: (record) => record.title !== "Not Expandable",
                }}
                dataSource={data}
              />
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
}

export default Assessments;
