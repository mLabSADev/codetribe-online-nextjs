"use client";

import { useEffect, useState } from "react";
import React from "react";
// import PageLayout from "./layout"
// import SEO from "../components/seo"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Button,
  Col,
  Collapse,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Skeleton,
  Timeline,
  message,
  Drawer,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  IconButton,
  Stack,
  Typography,
  Box,
  Fab,
  Slide,
  Snackbar,
  Chip,
  AppBar,
  Toolbar,
  Grid,
  Tabs,
  Tab,
  TextField,
  LinearProgress,
  Container,
} from "@mui/material";
import Course from "@/app/dtos/course";
import CheckIcon from "@mui/icons-material/Check";
import Lesson from "@/app/dtos/lesson";
import { LessonService } from "@/app/services/lesson-service";
import { CoursesService } from "@/app/services/courses-service";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Position } from "@/app/(pages)/(student)/overview/[id]/page";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw } from "draft-js";
import { AuthService } from "@/app/services/auth-service";
import { AssessmentService } from "@/app/services/assessments-service";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Colors, Styles } from "@/app/services/styles";
import YouTube from "react-youtube";
import QuizView from "@/app/components/quiz";
import { ArrowBack, Check, CheckRounded } from "@mui/icons-material";
import Disqus from "disqus-react";
import { StudentsService } from "@/app/services/students-service";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
type NoteResponseType = {
  note: string;
  lesson: string;
  chapter: string;
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const DurationHelper = {
  secondsToText: (seconds: number) => {
    let hours = Math.floor(seconds / (60 * 60));
    seconds = seconds - hours * 60 * 60;

    let min = Math.floor(seconds / 60);
    seconds = seconds - min * 60;

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${min} min`;
    } else {
      return `${min} min`;
    }
  },
  timeFormatToText: function (time: string) {
    const [min, sec] = time.split(":");

    let total = 0;
    total += parseInt(min) * 60 + parseInt(sec);

    return this.secondsToText(total);
  },
};

const LessonId = ({
  params,
}: {
  params: { id: string; lessonId: string; chapterId: string };
}) => {
  const courseId = params.id;
  const { lessonId, chapterId } = params;
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  let totalDuration: string = "";
  // let totalDurationUntilCurrentLesson = 0;
  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);
  const [position, setPosition] = useState<Position>();
  const [totalDurationUntilCurrentLesson, setTotalDurationUntilCurrentLesson] =
    useState(0);
  const [total, setTotal] = useState(0);
  const [nextIsLoading, setNextIsLoading] = useState(false);
  const [course, setCourse] = useState<Course>();
  const [currentLesson, setLesson] = useState<Lesson>();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slide, setSlide] = React.useState(false);
  const slideContainerRef = React.useRef(null);
  const [quizModal, setQuizModal] = React.useState(false);
  const [videoId, setVideoId] = useState("");
  const [courseProgress, setCourseProgress] = React.useState(0);
  const [finishedLessons, setFinishedLessons] = React.useState<any[]>([]);
  const [isVideoFinished, setisVideoFinished] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [noteForm] = Form.useForm();
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 1) {
      StudentsService.getNote({
        uid: user?.uid,
        chapterId: chapterId,
        lessonId: lessonId,
      }).then((res: any) => {
        if (res) {
          noteForm.setFieldValue("note", res.note);
        }
      });
    }
  };
  const nextPathname = usePathname();
  const handleSlide = () => {
    setSlide((prev) => !prev);
  };

  totalDuration = DurationHelper.secondsToText(total);
  const chapters = {};

  const goToPrev = () => {
    setCurrentIndex((prevCurrentIndex) => prevCurrentIndex - 1);
  };
  const goToNext = () => {
    if (course) {
      const allLessons = course.chapters
        .map((chapter) => chapter.lessons)
        .flat();
      LessonService.getCurrentLesson(courseId).then((res) => {
        for (const lesson of allLessons) {
          if (lesson.key === res) {
            setLesson(lesson);
          }
        }
      });
    }
    setCurrentIndex((prevCurrentIndex) => prevCurrentIndex + 1);
    setisVideoFinished(false);
  };

  const isLessonDone = (lesson: Lesson) => {
    if (
      finishedLessons.findIndex(
        (lessonObj) => lessonObj.lesson.key === lesson.key
      ) > -1
    ) {
      return true;
    }
    return false;
  };

  const checkTime = (
    e: any,
    course: string,
    chapterId: string,
    lessonId: string
  ) => {
    const duration = e.target.getDuration();
    const currentTime = e.target.getCurrentTime();
    if (currentLesson) {
      const isLessonFinished = finishedLessons.some(
        (less) => less.lesson.key === currentLesson.key
      );

      if (currentTime / duration > 0.98 && !isLessonFinished) {
        setisVideoFinished(true);
        LessonService.addFinishedLesson(
          course,
          chapterId,
          lessonId,
          currentLesson
        )
          .then((res) => {})
          .catch((err) => {});
      } else if (isLessonFinished) {
        setisVideoFinished(true);
      }
    }
  };

  const progress = Math.round((totalDurationUntilCurrentLesson / total) * 100);

  const onFinishFailed = (errorInfo: any) => {};
  const createNote = ({ note }: { note: string }) => {
    StudentsService.createNote({
      uid: user?.uid,
      chapterId: chapterId,
      lessonId: lessonId,
      note: note,
    }).then((res) => {
      console.log(res);
    });
  };
  useEffect(() => {
    if (currentLesson) {
      const regex = /embed\/(.+)/;
      const id = currentLesson.videoUrl.match(regex);
      if (id !== null) {
        setVideoId(id[1]);
      }
    }
  }, [currentLesson]);

  useEffect(() => {
    if (currentLesson?.lesson !== undefined) {
      const lessonIndex = course?.chapters
        .map((chapter) => chapter.lessons)
        .flat()
        .indexOf(currentLesson);
      if (course) {
        LessonService.updateCurrentLesson(courseId, currentLesson.key).then(
          (res) => {}
        );
        LessonService.updateCurrentChapter(
          courseId,
          currentLesson.chapterKey
        ).then((res) => {});
      }
      if (lessonIndex) {
        setCurrentIndex(lessonIndex);
      }
    }
  }, [currentLesson]);

  useEffect(() => {
    if (currentLesson?.lesson !== undefined && course) {
      const allLessons = course.chapters
        .map((chapter) => chapter.lessons)
        .flat();
      if (course.chapters.length > 1) {
        setLesson(allLessons[currentIndex]);
      }
      if (!isVideoFinished) {
        setCanGoForward(false);
      } else {
        setCanGoForward(true);
      }
      setCanGoBack(currentIndex > 0);
      LessonService.getUserFinishedLessons(courseId, currentLesson.chapterKey)
        .then((lessons: any) => {
          let array = [];
          for (const chapterKey in lessons) {
            if (lessons.hasOwnProperty(chapterKey)) {
              const finishedChapter = lessons[chapterKey];
              for (const lessonKey in finishedChapter) {
                if (finishedChapter.hasOwnProperty(lessonKey)) {
                  const finishedLesson = finishedChapter[lessonKey];
                  array.push(finishedLesson);
                }
              }
            }
          }
          setFinishedLessons(array);
        })
        .catch((err) => {});
      setCourseProgress(
        Math.round((finishedLessons.length / allLessons.length) * 100)
      );
    }
  }, [currentLesson, currentIndex, courseProgress, finishedLessons]);

  useEffect(() => {
    AuthService.currentUser().then((res) => {
      setUser(res);
    });

    LessonService.currentLessonPosition(courseId).then((position) => {
      CoursesService.course(courseId).then((course: Course) => {
        const lessons: Lesson[] = [];
        setCourse(course);
        let hasToMove = false;
        let lessonToMoveTo;
        for (let chapter of course.chapters) {
          lessons.push(...chapter.lessons);
        }
        for (let lesson of lessons) {
          if (lesson.key === lessonId) {
            setLesson(lesson);
          }
          if (
            lesson.chapter == position.chapter &&
            lesson.lesson == position.lesson
          ) {
            lessonToMoveTo = lesson;
          }
        }
        course?.chapters.map((chapter, i) => {
          const np = nextPathname.split("/")[2];
        });
      });
      setPosition(position);
    });
  }, []);
  return (
    <>
      <Stack>
        <AppBar color="inherit" position="sticky" elevation={0}>
          <Toolbar>
            <IconButton onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Stack>
              <Typography>{currentLesson?.title}</Typography>
            </Stack>
          </Toolbar>
        </AppBar>
        {currentLesson?.key && (
          <Stack flex={1} position={"relative"} ref={slideContainerRef}>
            <Modal
              title="Quiz"
              open={quizModal}
              onOk={() => {}}
              onCancel={() => {}}
              footer={[
                <Button
                  style={Styles.Button.Outline}
                  key="back"
                  onClick={() => {
                    setQuizModal(false);
                  }}
                >
                  Okay
                </Button>,
              ]}
            >
              <Typography variant="body1">
                Quiz cannot be closed until the student completes it
              </Typography>
              <Typography variant="h6">Quiz</Typography>
              <Typography variant="body2">Quiz content here....</Typography>
            </Modal>

            <Stack
              flex={1}
              p={2}
              spacing={2}
              direction={{ xs: "column", sm: "column", md: "row", lg: "row" }}
              overflow={"hidden"}
            >
              <Stack
                flex={1}
                position={"relative"}
                sx={{
                  background: "#efefef",
                  // maxHeight: `${96}vh`,
                  maxHeight: `100%`,
                  overflowY: "auto",
                  borderRadius: 5,
                }}
              >
                {/* Quiz, Overview and Video */}
                <Stack flex={1} p={2}>
                  {currentLesson && currentLesson.quiz && (
                    <Stack spacing={4} pt={8}>
                      {/* :TODO these props need to be supplied */}
                      <QuizView
                        quiz={currentLesson.quiz}
                        quizId=""
                        chapterId=""
                        courseId=""
                        key={0}
                      />
                    </Stack>
                  )}
                  {currentLesson && !currentLesson.isQuiz && (
                    <Stack spacing={4}>
                      <Box
                        width={"100%"}
                        height={{ xs: 300, sm: 350, md: 500, lg: 700 }}
                        borderRadius={3}
                        overflow={"hidden"}
                      >
                        <YouTube
                          videoId={videoId}
                          onStateChange={(e: any) =>
                            checkTime(
                              e,
                              courseId,
                              currentLesson.chapterKey,
                              currentLesson.key
                            )
                          }
                          opts={{ height: "100%", width: "100%" }}
                          style={{
                            height: "100%",
                          }}
                        />
                      </Box>
                      <Stack direction={"row"} flex={1}>
                        <Button
                          style={Styles.Button.Outline}
                          onClick={goToPrev}
                          disabled={!canGoBack}
                          size="large"
                          type="default"
                          icon={<ArrowLeftOutlined />}
                        >
                          Previous
                        </Button>
                        <span style={{ flex: 1 }} />
                        <Button
                          style={Styles.Button.Outline}
                          onClick={goToNext}
                          disabled={!canGoForward}
                          size="large"
                          type="default"
                          loading={nextIsLoading}
                        >
                          Next <ArrowRightOutlined />
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                  <Box sx={{ width: "100%" }} mt={5}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="basic tabs example"
                      >
                        <Tab label="Overview" {...a11yProps(0)} />
                        <Tab label="Notes" {...a11yProps(1)} />
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                      <Stack spacing={1}>
                        <Typography variant="h6">
                          What you will learn
                        </Typography>
                        <Typography>{course?.excerpt}</Typography>
                        <Grid container>
                          {course?.outline?.map((overview, i) => {
                            return (
                              <Grid key={i} item xs={12} sm={12} md={12} lg={6}>
                                <Stack
                                  bgcolor={"#dfdfdf"}
                                  borderRadius={5}
                                  m={1}
                                  p={2}
                                  alignItems={"center"}
                                  direction={"row"}
                                >
                                  <IconButton>
                                    <CheckRounded></CheckRounded>
                                  </IconButton>
                                  <Typography>{overview}</Typography>
                                </Stack>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Stack>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                      <Form
                        form={noteForm}
                        onFinish={(values) => {
                          createNote(values);
                        }}
                      >
                        <Form.Item name={"note"} rules={[{ required: true }]}>
                          <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="Notes"
                            multiline
                            maxRows={4}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Save
                          </Button>
                        </Form.Item>
                      </Form>
                    </CustomTabPanel>
                  </Box>
                </Stack>
              </Stack>
              <Stack
                position={"sticky"}
                sx={{
                  background: "#efefef",
                  maxHeight: `${96}vh`,
                  overflowY: "auto",
                  borderRadius: 5,
                  minWidth: 400,
                  maxWidth: "100%",
                }}
              >
                <Stack p={2} spacing={2}>
                  <Stack>
                    <Typography variant="subtitle1" fontWeight={"bold"}>
                      Course Content
                    </Typography>
                    <Typography
                      variant="h5"
                      style={{ color: "#97CA42", marginBottom: 0 }}
                    >
                      {currentLesson?.title}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    flex={1}
                  >
                    <Typography variant="subtitle1">Progress</Typography>
                    <Stack
                      flex={1}
                      bgcolor={"#cfcfcf"}
                      borderRadius={5}
                      height={5}
                      overflow={"hidden"}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={courseProgress}
                      />
                    </Stack>
                    <Stack>
                      <Typography variant="subtitle1">
                        {isNaN(courseProgress) ? "Error" : `${courseProgress}%`}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Collapse
                  style={{ background: "transparent" }}
                  defaultActiveKey={[currentLesson.chapterKey]}
                  bordered={false}
                  expandIconPosition="end"
                >
                  {course?.chapters.map((chapter, i) => {
                    let submitted = false;
                    let chapterTotalDuration = 0;
                    for (let chapterLesson of chapter.lessons) {
                      if (!chapterLesson) continue;

                      const [min, sec] = chapterLesson.duration.split(":");

                      chapterTotalDuration +=
                        parseInt(min) * 60 + parseInt(sec);
                    }
                    const chapterTotalDurationText =
                      DurationHelper.secondsToText(chapterTotalDuration);

                    return (
                      <Collapse.Panel
                        // expandIconPosition="end"

                        header={
                          <Stack direction={"row"} flex={1}>
                            <Typography flex={1} variant="subtitle1">
                              {chapter.title}
                            </Typography>
                            <Typography variant="overline">
                              {chapterTotalDurationText}
                            </Typography>
                          </Stack>
                        }
                        key={chapter.key}
                        style={{
                          backgroundColor:
                            chapter.key === currentLesson.chapterKey
                              ? Colors.SmokeWhite
                              : "rgba(0,0,0,0)",
                          borderColor: "#f0f2f5",
                        }}
                      >
                        <Timeline style={{ marginLeft: 20, marginTop: 10 }}>
                          {chapter.lessons
                            // .filter((lesson: any) => lesson.videoUrl !== "")
                            .map((lesson: any, key) => {
                              return (
                                <Timeline.Item
                                  style={{ backgroundColor: "rgba(0,0,0,0)" }}
                                  key={key}
                                  dot={
                                    <Stack
                                      width={20}
                                      height={20}
                                      borderRadius={30}
                                      border={2}
                                      bgcolor={"white"}
                                      borderColor={
                                        isLessonDone(lesson)
                                          ? "#97CA42"
                                          : "#dfdfdf"
                                      }
                                      alignItems={"center"}
                                      justifyContent={"center"}
                                    >
                                      <Stack>
                                        {isLessonDone(lesson) && (
                                          <Check
                                            sx={{ width: 15, color: "#97CA42" }}
                                          />
                                        )}
                                      </Stack>
                                    </Stack>
                                  }
                                >
                                  {/* <Link style={{color: lesson.current ? '#97CA42' : '#606060', fontWeight: lesson.current ? 'bold' : 'normal'}}>{lesson.frontmatter.title} ({DurationHelper.timeFormatToText(lesson.frontmatter.duration)})</Link> */}
                                  <Stack
                                    flex={1}
                                    direction={"row"}
                                    alignItems={"center"}
                                  >
                                    <Stack flex={1}>
                                      <Link
                                        href={
                                          // isLegalPage(lesson)
                                          lesson
                                            ? `/course/${courseId}/${chapter.key}/${lesson.key}`
                                            : "undefined"
                                        }
                                        style={{
                                          color: "#606060",
                                          ...(!isLessonDone(lesson)
                                            ? { pointerEvents: "none" }
                                            : undefined),
                                          fontWeight:
                                            currentLesson.key === lesson.key
                                              ? "bold"
                                              : "normal",
                                        }}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </Stack>

                                    {lesson.isQuiz && (
                                      <Chip
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        label={"Quiz"}
                                      />
                                    )}
                                  </Stack>
                                </Timeline.Item>
                              );
                            })}
                        </Timeline>
                      </Collapse.Panel>
                    );
                  })}
                </Collapse>
              </Stack>
            </Stack>
          </Stack>
        )}
        <Stack>
          <Container>
            <Disqus.DiscussionEmbed
              shortname="codetribe-online"
              config={{
                url: `https://codetribe-online-nextjs-mlabsadev.vercel.app/${nextPathname}`,
                identifier: nextPathname,
                title: course?.title,
              }}
            />
          </Container>
        </Stack>
      </Stack>
    </>
  );
};
export default LessonId;
