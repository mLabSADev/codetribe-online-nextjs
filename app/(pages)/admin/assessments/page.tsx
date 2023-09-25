"use client";
import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import {
  Button,
  Modal,
  List,
  Card,
  Cascader,
  Tabs,
  Collapse,
  Statistic,
  Input,
  Select,
  Form,
  Popconfirm,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw } from "draft-js";
import { Assessment } from "@/app/services/assessments-service";
import { AuthService } from "@/app/services/auth-service";
import { CoursesService } from "@/app/services/courses-service";
import { Styles } from "@/app/services/styles";
import { StudentsService } from "@/app/services/students-service";
// const { Column, ColumnGroup } = Table;
import { DownOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Badge, Dropdown, Space, Table } from "antd";
import AssessmentType from "@/app/dtos/assessments";
import AssessmentSubmissionType from "@/app/dtos/assessment-submission";
import { Check, FirstPage, LastPage } from "@mui/icons-material";
import Course from "@/app/dtos/course";
import { useForm } from "antd/es/form/Form";
const { TextArea } = Input;
const { Meta } = Card;
const { Option } = Select;
interface Filters {
  text: string;
  value: string;
}
const Assessments = () => {
  const expandedRowRender = (record: AssessmentType) => {
    const columns: TableColumnsType<AssessmentSubmissionType> = [
      { title: "Full Name", dataIndex: "fullName", key: "fullName" },
      { title: "Location", dataIndex: "location", key: "location" },
      { title: "Submitted", dataIndex: "submitted", key: "submitted" },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: () => {
          return (
            <Stack spacing={1} direction={"row"}>
              <Button type="primary">Github</Button>
              <Button>Live</Button>
            </Stack>
          );
        },
      },
    ];

    const submissions = [
      {
        uid: "user123",
        fullName: "John Doe",
        location: "Soweto",
        assessmentKey: "assessment1",
        githubUrl: "https://github.com/user123/assessment1",
        liveUrl: "https://example.com/user123/assessment1",
        submitted: "2023-09-28",
      },
      {
        uid: "user456",
        fullName: "Jane Smith",
        location: "Johannesburg",
        assessmentKey: "assessment2",
        githubUrl: "https://github.com/user456/assessment2",
        liveUrl: "https://example.com/user456/assessment2",
        submitted: "2023-09-29",
      },
      {
        uid: "user789",
        fullName: "David Johnson",
        location: "Pretoria",
        assessmentKey: "assessment3",
        githubUrl: "https://github.com/user789/assessment3",
        liveUrl: "https://example.com/user789/assessment3",
        submitted: "2023-09-30",
      },
      {
        uid: "user101",
        fullName: "Sarah Lee",
        location: "Durban",
        assessmentKey: "assessment4",
        githubUrl: "https://github.com/user101/assessment4",
        liveUrl: "https://example.com/user101/assessment4",
        submitted: "2023-10-01",
      },
      {
        uid: "user202",
        fullName: "Michael Brown",
        location: "Cape Town",
        assessmentKey: "assessment5",
        githubUrl: "https://github.com/user202/assessment5",
        liveUrl: "https://example.com/user202/assessment5",
        submitted: "2023-10-02",
      },
    ];

    return (
      <Stack py={3} flex={1} spacing={2} direction={"row"}>
        <Stack px={1} width={400} spacing={2}>
          <Typography variant="subtitle2">Assessment Details</Typography>
          <Divider flexItem />
          <Typography variant="body1">{record.description}</Typography>
          <Stack>
            {record.objectives.map((element, i) => (
              <Stack
                key={i}
                direction={"row"}
                spacing={1}
                alignItems={"center"}
              >
                <Check sx={{ fontSize: 13 }} />
                <Typography>{element}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Divider flexItem orientation="vertical" />
        <Stack flex={1} spacing={2}>
          <Typography variant="subtitle2">Submissions</Typography>
          <Divider flexItem />
          <Table
            columns={columns}
            dataSource={submissions}
            pagination={false}
          />
        </Stack>
      </Stack>
    );
  };
  const [courseOptions, setCourseOptions] = useState<Filters[]>();
  const [courseLessons, setCourseLessons] = useState<Filters[]>();
  const [allCourses, setAllCourses] = useState<Course[]>();
  const [hideForm, setHideForm] = useState(false);
  const [form] = Form.useForm();
  const columns: TableColumnsType<AssessmentType> = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Course", dataIndex: "course", key: "course" },
    { title: "Lesson", dataIndex: "lesson", key: "lesson" },
    { title: "Created", dataIndex: "created", key: "created" },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      render: (record) => {
        return (
          <Stack spacing={1} direction={"row"}>
            <Button
              onClick={() => {
                setHideForm(false);
                console.log(record);
              }}
            >
              Edit
            </Button>
            <Button>Delete</Button>
          </Stack>
        );
      },
    },
  ];

  const data: AssessmentType[] = [
    {
      key: "1",
      title: "Understanding React Components",
      course: "ReactJS",
      lesson: "React Fundamentals",
      description: "Assess your knowledge of React components.",
      objectives: [
        "Define what a React component is.",
        "Differentiate between functional and class components.",
        "Explain the concept of state and props in React components.",
        "Create a simple React component.",
      ],
      created: "2023-09-15",
      dueDate: "2023-09-30",
    },
    {
      key: "2",
      title: "Node.js Fundamentals",
      course: "Node.js",
      lesson: "Introduction to Node.js",
      description: "Test your understanding of Node.js basics.",
      objectives: [
        "Explain the event loop in Node.js.",
        "Create a simple Node.js server.",
        "Discuss the benefits of using npm.",
      ],
      created: "2023-09-20",
      dueDate: "2023-10-05",
    },
    {
      key: "3",
      title: "Angular Component Development",
      course: "Angular",
      lesson: "Getting Started with Angular",
      description: "Evaluate your knowledge of Angular components.",
      objectives: [
        "Define Angular and its key features.",
        "Explain the role of components in Angular.",
        "Create a new Angular component.",
        "Discuss data binding in Angular.",
      ],
      created: "2023-09-22",
      dueDate: "2023-10-10",
    },
    {
      key: "4",
      title: "Ionic App Building",
      course: "Ionic",
      lesson: "Introduction to Ionic Framework",
      description: "Assess your skills in Ionic app development.",
      objectives: [
        "Describe Ionic's key features.",
        "Differentiate between Ionic Framework and Ionic Capacitor.",
        "Create a basic Ionic app with tabs.",
        "Discuss native device access in Ionic.",
      ],
      created: "2023-09-17",
      dueDate: "2023-10-02",
    },
    {
      key: "5",
      title: "React Native Development",
      course: "React Native",
      lesson: "Introduction to React Native",
      description: "Test your knowledge of React Native fundamentals.",
      objectives: [
        "Explain the key concepts of React Native.",
        "Set up a basic React Native project.",
        "Create a simple mobile app using React Native.",
        "Discuss the advantages of React Native for mobile development.",
      ],
      created: "2023-09-25",
      dueDate: "2023-10-15",
    },
  ];
  const onCourseChange = (value: string) => {
    console.log(value, allCourses);
    var lessons: Filters[] = [];
    const course = allCourses?.filter((course) => course.key === value);
    // Set lessons by course chosen
    if (course?.length === 1) {
      Object.keys(course[0].chapters).map((key: string) => {
        const slug = course[0].chapters[key].title
          .toLowerCase()
          .replaceAll(" ", "-");
        const title: string = course[0].chapters[key].title;
        lessons.push({ text: title, value: slug });
      });
      // Sort
      lessons.sort((a, b) => {
        const textA = a.text.toLowerCase();
        const textB = b.text.toLowerCase();
        if (textA < textB) {
          return -1;
        }
        if (textA > textB) {
          return 1;
        }
        return 0;
      });
      setCourseLessons(lessons);
    }
  };
  const toggleHideForm = () => {
    setHideForm(!hideForm);
  };
  const editAssessment = (values) => {
    console.log(values);
  };
  useEffect(() => {
    CoursesService.courses().then((courses) => {
      var filters: Filters[] = [];
      var course: Course[] = [];
      courses.forEach((c) => {
        filters.push({ text: c.title, value: c.key });
        course.push(c);
      });
      setCourseOptions(filters);
      setAllCourses(courses);
    });
  }, []);
  return (
    <>
      <Container maxWidth="xl">
        <Stack direction={"row"} flex={1} py={10} spacing={5}>
          <Stack flex={1}>
            <Stack pb={5}>
              <Typography variant="h5">Assessments</Typography>
            </Stack>
            <Stack>
              <Table
                columns={columns}
                expandable={{
                  expandedRowRender,
                }}
                dataSource={data}
              />
            </Stack>
          </Stack>
          <Divider flexItem orientation="vertical" />
          {hideForm && (
            <Stack>
              <IconButton onClick={() => toggleHideForm()}>
                <FirstPage />
              </IconButton>
            </Stack>
          )}
          {!hideForm && (
            <Stack width={400} sx={{ overflowY: "auto" }} maxHeight={"100%"}>
              <Stack pb={5} direction={"row"} alignItems={"center"}>
                <Typography flex={1} variant="h6">
                  New Assessment
                </Typography>
                <IconButton onClick={() => toggleHideForm()}>
                  <LastPage />
                </IconButton>
              </Stack>
              <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                  console.log(values);
                }}
              >
                <Form.Item name="title" label="Title">
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  name="course"
                  label="Course"
                  rules={[{ required: true }]}
                >
                  <Select onChange={onCourseChange} allowClear>
                    {courseOptions?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.text}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="lesson"
                  label="Lesson"
                  rules={[{ required: true }]}
                >
                  <Select onChange={onCourseChange} allowClear>
                    {courseLessons?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.text}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <Input.TextArea></Input.TextArea>
                </Form.Item>
                <Form.List name="objectives">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          label={index === 0 ? "Objectives" : ""}
                          required={true}
                          key={field.key}
                        >
                          <Stack
                            position={"relative"}
                            direction={"row"}
                            alignItems={"center"}
                          >
                            <Form.Item
                              style={{ width: "100%", margin: 0 }}
                              {...field}
                              validateTrigger={["onChange", "onBlur"]}
                            >
                              <Input
                              // style={{ width: "60%" }}
                              />
                            </Form.Item>
                            {fields.length > 1 ? (
                              <Box
                                position={"absolute"}
                                right={0}
                                top={0}
                                bottom={0}
                                alignItems={"center"}
                              >
                                <Button
                                  onClick={() => remove(field.name)}
                                  type="text"
                                  icon={<MinusCircleOutlined />}
                                ></Button>
                              </Box>
                            ) : null}
                          </Stack>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{ width: "100%" }}
                          icon={<PlusOutlined />}
                        >
                          Add Objective
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Form.Item
                  name="dueDate"
                  label="Due Date"
                  rules={[
                    {
                      type: "object" as const,
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
};
export default Assessments;
