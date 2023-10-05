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
  Switch,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CheckOutlined,
  ExpandAltOutlined,
} from "@ant-design/icons";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw } from "draft-js";
import { AssessmentService } from "@/app/services/assessments-service";
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
import type { TimeRangePickerProps, DatePickerProps } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
const { TextArea } = Input;
const { Meta } = Card;
const { Option } = Select;
interface Filters {
  text: string;
  value: string;
}
const Submisions = ({
  assessment,
  expanded,
}: {
  assessment: AssessmentType;
  expanded: boolean;
}) => {
  const [data, setData] = useState<AssessmentSubmissionType[]>([]);
  const columns: TableColumnsType<AssessmentSubmissionType> = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Cohort",
      dataIndex: "cohort",
      key: "cohort",
      render: (value, record) => {
        const group = new Date(value);
        return <Typography variant="body2">{group.getFullYear()}</Typography>;
      },
    },
    { title: "Submitted", dataIndex: "submitted", key: "submitted" },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      render: (value, record) => {
        return (
          <Stack spacing={1}>
            <Button type="primary" href={record.githubUrl} target="_blank">
              Github
            </Button>
            <Button href={record.liveUrl} target="_blank">
              Live
            </Button>
          </Stack>
        );
      },
    },
  ];
  useEffect(() => {
    const assessmentKey = `${assessment.chapter}--${assessment.group}`;
    AssessmentService.Submissions.getSubmissions(assessmentKey).then(
      (res: any) => {
        setData(res);
      }
    );
  }, [expanded]);
  return (
    <Stack py={3} flex={1} spacing={2} direction={"row"}>
      <Stack px={1} width={400} spacing={2}>
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
      <Divider flexItem orientation="vertical" />
      <Stack flex={1} spacing={2}>
        <Typography variant="subtitle2">Submissions</Typography>
        <Divider flexItem />
        <Table columns={columns} dataSource={data} />
      </Stack>
    </Stack>
  );
};
const Assessments = () => {
  const [courseOptions, setCourseOptions] = useState<Filters[]>();
  const [courseLessons, setCourseLessons] = useState<Filters[]>();
  const [allCourses, setAllCourses] = useState<Course[]>();
  const [hideForm, setHideForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
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
      filters: courseOptions,
      onFilter: (value: any, record) =>
        record.course.toLocaleLowerCase().indexOf(value) === 0,
      render: (value, record) => {
        var rg = /(^\w{1}|\.\s*\w{1})/gi;
        return (
          <Typography variant="body2" sx={{ textDecoration: "" }}>
            {value.replace(rg, function (value: string) {
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
      render: (value, record) => {
        // const filteredAssessments = assessments.filter(assessment => assessment.course === "React");
        const course: any = allCourses?.filter(
          (doc) => doc.key === record.course
        );
        return (
          <Typography variant="body2">
            {course[0].chapters[value]?.title || "Null"}
          </Typography>
        );
      },
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.group - b.group,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (value, record) => {
        const a = value.split(",");
        const from = a[1];
        from.trim();
        const to = a[3];
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
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => {
        return (
          <Stack spacing={1} direction={"row"}>
            <Button
              onClick={() => {
                setHideForm(false);
                editAssessment(record);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the Assessment"
              description="Are you sure to delete this assessment?"
              onConfirm={() => {
                deleteAssessment(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Stack>
        );
      },
    },
  ];

  // Assessments
  const onCourseChange = (value: string) => {
    var lessons: Filters[] = [];
    const course: any = allCourses?.filter((course) => course.key === value);
    // Set lessons by course chosen
    if (course?.length === 1) {
      Object.keys(course[0].chapters).map((key: string) => {
        const title: string = course[0].chapters[key].title;
        lessons.push({ text: title, value: key });
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
  const editAssessment = (assessment: any) => {
    const dateFormat = "ddd DD MMM YYYY";
    onCourseChange(assessment.course);
    Object.keys(assessment).map((key) => {
      if (key === "dueDate") {
        const split = assessment.dueDate.split(",");
        const fromdate = dayjs(split[1].trim(), dateFormat);
        const todate = dayjs(split[3].trim(), dateFormat);
        form.setFieldValue("dueDate", [todate, fromdate]);
      } else if (key === "cohort") {
        const cohort = dayjs(assessment.cohort, dateFormat);
        form.setFieldValue("cohort", cohort);
      } else {
        form.setFieldValue(key, assessment[key]);
      }
    });
  };
  const getAssessments = () => {
    AssessmentService.getAll().then((assessments: any) => {
      setAssessments(assessments);
    });
  };
  const createAssessment = (values: AssessmentType) => {
    const cohortdata = values.cohort.toString();
    const cohortDate = new Date(cohortdata);
    const assessment: AssessmentType = {
      ...values,
      cohort: values.cohort.toString(), // used when editing the form
      group: cohortDate.getFullYear(), // used for filtering
      dueDate: values.dueDate.toString(),
      bootcamp: values.bootcamp ? values.bootcamp : false,
    };
    AssessmentService.add(assessment).then((res) => {
      getAssessments();
      form.resetFields();
      messageApi.success(`${values.title} created successfully.`);
    });
  };
  const deleteAssessment = (assessment: AssessmentType) => {
    AssessmentService.delete(assessment).then((res) => {
      getAssessments();
      messageApi.success(`${assessment.title} deleted successfully.`);
    });
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
    getAssessments();
  }, []);
  return (
    <>
      <Container maxWidth="xl">
        {contextHolder}
        <Stack direction={"row"} flex={1} py={10} spacing={5}>
          <Stack flex={1}>
            <Stack pb={5}>
              <Typography variant="h5">Assessments</Typography>
            </Stack>
            <Stack>
              <Table
                columns={columns}
                expandable={{
                  expandedRowRender: (record: AssessmentType) => (
                    <Submisions expanded={expanded} assessment={record} />
                  ),
                  expandRowByClick: true,

                  onExpand: (_, record) => {
                    setExpanded(_);
                  },
                }}
                dataSource={assessments}
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
                  Manage Assessment
                </Typography>
                <IconButton onClick={() => toggleHideForm()}>
                  <LastPage />
                </IconButton>
              </Stack>
              <Form form={form} layout="vertical" onFinish={createAssessment}>
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
                  name="chapter"
                  label="Chapter"
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
                <Form.Item
                  rules={[{ required: true }]}
                  label="Cohort"
                  name="cohort"
                >
                  <DatePicker style={{ width: "100%" }} picker="year" />
                </Form.Item>
                <Form.Item
                  label="Bootcamp"
                  name={"bootcamp"}
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch defaultChecked={false} />
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
                                prefix={<CheckOutlined />}
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
                      required: true,
                    },
                  ]}
                >
                  <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    format="ddd DD MMM YYYY"
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
                  <Button
                    style={{ width: "100%" }}
                    type="text"
                    htmlType="reset"
                  >
                    Reset
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
