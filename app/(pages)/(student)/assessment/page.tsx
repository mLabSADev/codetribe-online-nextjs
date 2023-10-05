"use client";
import React, { useEffect, useState } from "react";
import { Styles } from "@/app/services/styles";
import { ArrowBack, Check, ExpandMore } from "@mui/icons-material";
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
import { AssessmentService } from "@/app/services/assessments-service";
import AssessmentType from "@/app/dtos/assessments";
import type { TableColumnsType } from "antd";
import AssessmentSubmissionType from "@/app/dtos/assessment-submission";
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
interface FormType {
  github: string;
  live: string;
}
const ExpandedDetails = ({
  assessment,
  expanded,
  uid,
  user,
}: {
  assessment: AssessmentType;
  expanded: boolean;
  uid: string;
  user: any;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (record: AssessmentType, values: FormType) => {
    console.log(record, values, user);
    const d = new Date();
    const submission: AssessmentSubmissionType = {
      assessmentKey: record.chapter,
      group: record.group,
      fullName: `${user.firstname} ${user.lastname}`,
      cohort: d.toDateString(),
      githubUrl: values.github,
      liveUrl: values.live,
      location: user.location,
      uid: uid,
      submitted: d.toDateString(),
    };
    AssessmentService.Submissions.submit(submission).then((res) => {
      console.log(res);
    });
  };
  useEffect(() => {
    const assessmentKey = `${assessment.chapter}--${assessment.group}`;
    AssessmentService.Submissions.getStudentSubmission(assessmentKey, uid).then(
      (res: any) => {
        if (res.uid) {
          form.setFieldValue("github", res.githubUrl);
          form.setFieldValue("live", res.liveUrl);
          setSubmitted(true);
        }
      }
    );
  }, [expanded]);
  return (
    <Stack direction={"row"} flex={1} spacing={1}>
      <Stack px={1} flex={1} spacing={2}>
        <Typography variant="subtitle2">Assessment Details</Typography>
        <Divider flexItem />
        <Typography variant="body1">{assessment.description}</Typography>
        <Stack>
          {assessment.objectives.map((element, i) => (
            <Stack key={i} direction={"row"} spacing={1} alignItems={"center"}>
              <Check sx={{ fontSize: 13 }} />
              <Typography>{element}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Divider orientation="vertical" flexItem />
      <Stack width={"30%"} p={1}>
        <Form
          form={form}
          name="basic"
          // wrapperCol={{ span: 16 }}
          initialValues={{
            remember: true,
          }}
          onFinish={(values) => {
            onFinish(assessment, values);
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
            {!submitted && (
              <Button
                disabled={submitted}
                size="large"
                style={Styles.Button.Filled}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            )}
            {submitted && (
              <Button style={Styles.Button.Outline} disabled={true}>
                Submitted
              </Button>
            )}
          </Form.Item>
        </Form>
      </Stack>
    </Stack>
  );
};
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
  const [assessments, setAssessments] = useState<AssessmentType[]>([]);
  const [showAssessmentSubmission, setShowAssessmentSubmission] =
    useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>();
  const [openNotification, setOpenNotification] = React.useState({
    success: false,
    error: false,
  });
  const [user, setUser] = useState<any>({});
  const [loggedin, setLoggedin] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const router = useRouter();
  const theme = useTheme();
  const nextPathname = usePathname();
  const columns: TableColumnsType<AssessmentType> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      render: (value, record) => {
        return (
          <Typography variant="subtitle2" fontWeight={"bold"}>
            {value}
          </Typography>
        );
      },
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      filters: courseFilters,
      onFilter: (value: any, record: any) =>
        record.course.toLocaleLowerCase().indexOf(value) === 0,
      render: (value, record) => {
        var rg = /(^\w{1}|\.\s*\w{1})/gi;
        return (
          <Typography variant="body2" sx={{ textDecoration: "" }}>
            {value.replace(rg, function (value: any) {
              return value.toUpperCase();
            })}
          </Typography>
        );
      },
    },
    {
      title: "Chapter",
      dataIndex: "chapter",
      key: "chapter",
      render: (value: string, record: any) => {
        // const filteredAssessments = assessments.filter(assessment => assessment.course === "React");
        const course: any = allCourses?.filter(
          (doc) => doc.key === record.course
        );
        const title = course[0].chapters[value].title;
        return <Typography variant="body2">{title}</Typography>;
      },
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      defaultSortOrder: "ascend",
      sorter: (a: any, b: any) => a.group - b.group,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (value, record) => {
        const a = value.split(",");
        const from: string = a[1];
        from.trim();
        const to: string = a[3];
        to.trim();
        const dateFrom: any = new Date(from);
        const dateTo: any = new Date(to);
        const shortMonthName = new Intl.DateTimeFormat("en-US", {
          month: "short",
        }).format;
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((dateFrom - dateTo) / oneDay));
        return (
          <Stack>
            <Typography variant="body2">
              {shortMonthName(dateFrom)}&nbsp;{dateFrom.getDay()}&nbsp;-&nbsp;
              {shortMonthName(dateTo)}&nbsp;{dateTo.getDay()}&nbsp;({diffDays}
              days)
            </Typography>
          </Stack>
        );
      },
    },
  ];

  const getAssessments = () => {
    AssessmentService.getAll().then((assessments: any) => {
      setAssessments(assessments);
    });
  };
  useEffect(() => {
    AuthService.isLoggedIn().then((res) => {
      setLoggedin(res);
    });
    AuthService.currentUser().then((profile) => {
      setUser(profile);
    });
    CoursesService.courses().then((courses) => {
      var filters: Filters[] = [];
      courses.forEach((c) => {
        filters.push({ text: c.title, value: c.key });
      });
      setCourseFilters(filters);
      setAllCourses(courses);
    });
    getAssessments();
  }, []);
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
                  expandedRowRender: (record, i) => (
                    <ExpandedDetails
                      user={user}
                      uid={loggedin.uid}
                      assessment={record}
                      expanded={expanded}
                      key={i}
                    />
                  ),
                  onExpand: (_, record) => {
                    setExpanded(_);
                  },
                }}
                dataSource={assessments}
              />
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
}

export default Assessments;
