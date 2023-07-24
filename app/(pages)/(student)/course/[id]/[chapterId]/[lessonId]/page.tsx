"use client";

import { useEffect, useState } from "react";
import React from "react";
// import PageLayout from "./layout"
// import SEO from "../components/seo"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
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
// import Quiz from "../components/quiz"
// import Disqus from "gatsby-plugin-disqus/components/Disqus"
import {
  IconButton,
  Stack,
  Typography,
  Box,
  Fab,
  Slide,
  Snackbar,
  Chip,
} from "@mui/material";
import Course from "@/app/dtos/course";
import CheckIcon from "@mui/icons-material/Check";
import Lesson from "@/app/dtos/lesson";
import { LessonService } from "@/app/services/lesson-service";
import { CoursesService } from "@/app/services/courses-service";
import Link from "next/link";
import Quiz from "@/app/components/quiz";
import { useRouter } from "next/navigation";
import { Position } from "@/app/(pages)/(student)/overview/[id]/page";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw } from "draft-js";
import { AuthService } from "@/app/services/auth-service";
import { Assessment } from "@/app/services/assessments-service";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentSubmission from "@/app/dtos/assessment-submission";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Colors, Styles } from "@/app/services/styles";
import YouTube from "react-youtube";
import LessonProgress from "@/app/dtos/lesson-progress";
import QuizView from "@/app/components/quiz";
const AssessmentLoadingSkelleton = () => {
  return (
    <Stack spacing={1}>
      <Skeleton active />
      <Skeleton active />
    </Stack>
  );
};
const checkSubmitted = () => {
  let security = false;
  if (!security) {
    security = true;
    return new Promise((resolve, reject) => {
      const { origin, hostname, pathname, ancestorOrigins, href } =
        window.location;
      let splitter = href.split("/");
      AuthService.isLoggedIn().then((res: any) => {
        AuthService.currentUser().then((profile) => {
          const item = {
            uid: res.uid,
            chapter: splitter[5],
            course: splitter[4],
            location: profile.location || profile.groups[0],
          };
          Assessment.getOneSubmission(item).then((res) => {
            resolve(res);
          });
        });
      });
    });
  }
};
export const DurationHelper = {
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
  timeFormatToText: (time: string) => {
    const [min, sec] = time.split(":");

    let total = 0;
    total += parseInt(min) * 60 + parseInt(sec);

    return DurationHelper.secondsToText(total);
  },
};

export default ({
  params,
}: {
  params: { id: string; lessonId: string; chapterId: string };
}) => {
  const courseId = params.id;
  const { lessonId, chapterId } = params;
  const router = useRouter();
  const [showAssessmentSubmission, setShowAssessmentSubmission] =
    useState(false);
  const [user, setUser] = useState({});
  let totalDuration;
  // let totalDurationUntilCurrentLesson = 0;
  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);
  const [position, setPosition] = useState<Position>();
  const [submissions, setSubmissions] = useState<any>([]);
  const [totalDurationUntilCurrentLesson, setTotalDurationUntilCurrentLesson] =
    useState(0);
  const [total, setTotal] = useState(0);
  const [nextIsLoading, setNextIsLoading] = useState(false);
  const [course, setCourse] = useState<Course>();
  const [submitChapter, setSubmitChapter] = useState("");
  const [currentLesson, setLesson] = useState<Lesson>();
  const [assessmentDetails, setAssessmentDetails] = useState({
    show: false,
    details: null,
    header: null,
  });
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slide, setSlide] = React.useState(false);
  const slideContainerRef = React.useRef(null);
  const [updateEditorState, setUpdateEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const [openNotification, setOpenNotification] = React.useState({
    success: false,
    error: false,
  });
  const [quizModal, setQuizModal] = React.useState(false);
  const [videoId, setVideoId] = useState("");
  const [assessmentsLoading, setAssessmentsLoading] = React.useState(true);
  const [courseProgress, setCourseProgress] = React.useState(0);
  const [finishedLessons, setFinishedLessons] = React.useState<any[]>([]);
  const [isVideoFinished, setisVideoFinished] = React.useState(false);
  const { origin, hostname, pathname, ancestorOrigins, href } = window.location;
  const handleSlide = () => {
    setSlide((prev) => !prev);
  };
  let splitter = href.split("/");
  const isLegalPage = (lesson: Lesson) => {
    if (position) {
      let hasToMove = false;
      if (
        lesson.chapter == position.chapter &&
        lesson.lesson > position.lesson
      ) {
        hasToMove = true;
      } else if (lesson.chapter > position.chapter) {
        hasToMove = true;
      }
      return !hasToMove;
    }

    return false;
  };

  useEffect(() => {
    // const parts = mainSlug.split('/')
    // const finalParts = []
    // for (let part of parts) {
    //     if (part.trim().length !== 0) {
    //         finalParts.push(part)
    //     }
    // }

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
        course!.chapters.map((chapter, i) => {
          // Keketso
          const { pathname } = window.location;
          const c = pathname.split("/")[2];

          RunAssessmentFunc({ course: c, chapter: chapter.title });

          // check if chapter has an assessment
        });
      });
      setPosition(position);
    });
    //   if (
    //     currentChapter == position.chapter &&
    //     currentLesson > position.lesson
    //   ) {
    //     hasToMove = true
    //   } else if (currentChapter > position.chapter) {
    //     hasToMove = true
    //   }

    //   let durationCount = 0
    //   let totalCount = 0
    //   for (let lesson of lessons) {
    //     const [min, sec] = lesson.frontmatter.duration.split(":")

    //     totalCount += parseInt(min) * 60 + parseInt(sec)

    //     if (lesson.frontmatter.chapter < position.chapter) {
    //       // setTotalDurationUntilCurrentLesson(totalDurationUntilCurrentLesson + (parseInt(min) * 60) + parseInt(sec))
    //       durationCount += parseInt(min) * 60 + parseInt(sec)
    //     } else if (
    //       lesson.frontmatter.chapter == position.chapter &&
    //       lesson.frontmatter.lesson < position.lesson
    //     ) {
    //       // setTotalDurationUntilCurrentLesson(totalDurationUntilCurrentLesson + (parseInt(min) * 60) + parseInt(sec))
    //       durationCount += parseInt(min) * 60 + parseInt(sec)
    //     }
    //   }
    //   setTotalDurationUntilCurrentLesson(durationCount)
    //   setTotal(totalCount)

    //   if (hasToMove || (currentChapter == 0 && currentLesson == 0)) {
    //     navigate(lessonToMoveTo.fields.slug)
    //   }
    // })
    // }, [])

    //   const lessons = data.allMarkdownRemark.edges
    //     .map(edge => {
    //       return edge.node
    //     })
    //     .filter(lesson => lesson.fields.tutorial === post.fields.tutorial)

    // for (let lesson of lessons) {
    //     const [min, sec] = lesson.frontmatter.duration.split(':')

    //     total += (parseInt(min) * 60) + parseInt(sec)

    //     // if (lesson.frontmatter.chapter < currentChapter) {
    //     //     totalDurationUntilCurrentLesson += (parseInt(min) * 60) + parseInt(sec)
    //     // } else if (lesson.frontmatter.chapter == currentChapter && lesson.frontmatter.lesson < currentLesson) {
    //     //     totalDurationUntilCurrentLesson += (parseInt(min) * 60) + parseInt(sec)
    //     // }
    // }

    // let total = 0

    // for (let lesson of lessons) {
    //     const [min, sec] = lesson.frontmatter.duration.split(':')

    //     total += (parseInt(min) * 60) + parseInt(sec)

    //     if (lesson.frontmatter.chapter < currentChapter) {
    //         totalDurationUntilCurrentLesson += (parseInt(min) * 60) + parseInt(sec)
    //     } else if (lesson.frontmatter.chapter == currentChapter && lesson.frontmatter.lesson < currentLesson) {
    //         totalDurationUntilCurrentLesson += (parseInt(min) * 60) + parseInt(sec)
    //     }
    // }
  }, []);

  useEffect(() => {
    if (currentLesson?.lesson !== undefined) {
      const lessonIndex = course?.chapters
        .map((chapter) => chapter.lessons)
        .flat()
        .indexOf(currentLesson);
      if (course) {
        LessonService.updateCurrentLesson(courseId, currentLesson.key).then(
          (res) => {
            console.log(res);
          }
        );
        LessonService.updateCurrentChapter(
          courseId,
          currentLesson.chapterKey
        ).then((res) => {
          console.log(res);
        });
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
        .catch((err) => {
          console.log(err);
        });
      setCourseProgress(
        Math.round((finishedLessons.length / allLessons.length) * 100)
      );
    }
  }, [currentLesson, currentIndex, courseProgress, finishedLessons]);

  totalDuration = DurationHelper.secondsToText(total);
  const chapters = {};
  //   lessons.forEach(lesson => {
  //     if (lesson.frontmatter.lesson === 0 && lesson.frontmatter.chapter === 0) {
  //     //   title = lesson.frontmatter.title
  //     //   mainSlug = lesson.fields.slug
  //     } else {
  //       if (chapters[lesson.frontmatter.chapter] === undefined) {
  //         chapters[lesson.frontmatter.chapter] = {
  //           lessons: [],
  //           timeToRead: 0,
  //         }
  //       }

  //       if (lesson.frontmatter.lesson === 0) {
  //         chapters[lesson.frontmatter.chapter].title = lesson.frontmatter.title

  //         if (lesson.frontmatter.chapter === currentChapter) {
  //           chapters[lesson.frontmatter.chapter].current = true
  //         } else {
  //           chapters[lesson.frontmatter.chapter].current = false
  //         }
  //       } else {
  //         if (lesson.frontmatter.chapter < currentChapter) {
  //           lesson.completed = true
  //         } else if (
  //           lesson.frontmatter.chapter === currentChapter &&
  //           lesson.frontmatter.lesson < currentLesson
  //         ) {
  //           lesson.completed = true
  //         } else {
  //           lesson.completed = false
  //         }

  //         if (
  //           lesson.frontmatter.chapter === currentChapter &&
  //           lesson.frontmatter.lesson === currentLesson
  //         ) {
  //           lesson.current = true
  //         } else {
  //           lesson.current = false
  //         }

  //         chapters[lesson.frontmatter.chapter].lessons[
  //           lesson.frontmatter.lesson
  //         ] = lesson
  //         chapters[lesson.frontmatter.chapter].timeToRead += lesson.timeToRead
  //       }
  //     }
  //   })

  // const lastChapter = Object.keys(chapters).length
  // const lastLesson = chapters[lastChapter].lessons.length - 1
  // canGoForward =
  //   post.frontmatter.chapter < lastChapter ||
  //   post.frontmatter.lesson < lastLesson

  const goToPrev = () => {
    // let prevLesson
    // if (post.frontmatter.lesson === 1 && post.frontmatter.chapter === 1) {
    //   navigate(mainSlug)
    //   return
    // } else if (post.frontmatter.lesson === 0) {
    //   prevLesson = chapters[post.frontmatter.chapter - 1].lessons[1]
    // } else {
    //   prevLesson =
    //     chapters[post.frontmatter.chapter].lessons[post.frontmatter.lesson - 1]
    // }
    // navigate(prevLesson.fields.slug)
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
    // let nextLesson
    // if (post.frontmatter.chapter === 0) {
    //   nextLesson = chapters[1].lessons[1]
    // } else if (
    //   post.frontmatter.lesson ===
    //   chapters[post.frontmatter.chapter].lessons.length - 1
    // ) {
    //   nextLesson = chapters[post.frontmatter.chapter + 1].lessons[1]
    // } else {
    //   nextLesson =
    //     chapters[post.frontmatter.chapter].lessons[post.frontmatter.lesson + 1]
    // }
    // setNextIsLoading(true)
    // LessonService.currentLessonPosition(data.markdownRemark.fields.tutorial)
    //   .then(position => {
    //     let proceed = false
    //     if (nextLesson.frontmatter.chapter > position.chapter) {
    //       proceed = true
    //     }
    //     if (nextLesson.frontmatter.lesson > position.lesson) {
    //       proceed = true
    //     }
    //     if (proceed) {
    //       LessonService.setCurrentPosition(
    //         data.markdownRemark.fields.tutorial,
    //         nextLesson.frontmatter.chapter,
    //         nextLesson.frontmatter.lesson
    //       ).then(() => {
    //         navigate(nextLesson.fields.slug)
    //       })
    //     } else {
    //       navigate(nextLesson.fields.slug)
    //     }
    //   })
    //   .finally(() => {
    //     setNextIsLoading(false)
    //   })
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
  useEffect(() => {
    if (currentLesson) {
      const regex = /embed\/(.+)/;
      const id = currentLesson.videoUrl.match(regex);
      if (id !== null) {
        setVideoId(id[1]);
      }
    }
  }, [currentLesson]);
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
          .then((res) => {
            console.log(res, "res");
          })
          .catch((err) => {
            console.log(err, "error");
          });
      } else if (isLessonFinished) {
        setisVideoFinished(true);
      }
    }
  };

  const progress = Math.round((totalDurationUntilCurrentLesson / total) * 100);
  const onFinish = (values: any) => {
    const currentURL = window.location.href;
    let splitter = currentURL.split("/");
    const submission = {
      location: "",
      chapter: values.chapter,
      course: splitter[4],
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
            console.log(err);

            setOpenNotification({ error: true, success: false });
          });
      })
      .then((err) => {});
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const getSubmission = (data: any) => {
    const { origin, hostname, pathname, ancestorOrigins, href } =
      window.location;
    let splitter = href.split("/");
    const items = pathname.split("/");
    const submission = {
      location: data.location,
      chapter: data.location,
      course: splitter[4],
      fullName: "",
      ...data,
    };
    console.log(submission);

    // AuthService.isLoggedIn().then((res) => {
    //   AuthService.getUser(res.uid).then((user) => {
    //     // assessmens/submissions/${items[2]}/${splitter[5]}/${user.location || user.groups[0]}/${res.uid}
    //     const values: AssessmentSubmission = {
    //       course: "",
    //       chapter: "",
    //       fullName: "",
    //       github: "",
    //       location: "",
    //       submitted: "",
    //       uid: "",
    //     };

    //     console.log(
    //       `Get submissions from "assessmens/submissions/${items[2]}/${
    //         splitter[5]
    //       }/${user.location || user.groups[0]}/${res.uid}"`,
    //       {
    //         user,
    //       }
    //     );
    //   });
    // });
  };
  /**
   * Get's assessments & submissions per lesson
   * @param data  course: 'React', chapter: 'Lesson One'
   */
  const RunAssessmentFunc = async (data: any) => {
    const createdAssessment = await Assessment.getOne({
      course: data.course,
      chapter: data.chapter,
    }).then((createdAssessment) => createdAssessment);
    // "1: Created Assessment "
    if (createdAssessment) {
      // assessment available
      const profile = await AuthService.currentUser().then(
        (profile) => profile
      );
      //  "2: Profile "
      var location = "";
      if (profile.location) {
        location = profile.location;
      } else {
        location = profile.groups[0];
      }
      // "3: Location "
      const sub = await Assessment.getOneSubmission({
        course: data.course,
        chapter: data.chapter,
        location: location,
      }).then((data) => data);
      // "4: One Submission "
      if (sub) {
        submissions.push({
          show: "submitted",
          details: createdAssessment,
          title: data.chapter,
        });
        setSubmissions(submissions);
        setAssessmentsLoading(false);
      } else {
        submissions.unshift({
          show: "notsubmitted",
          details: createdAssessment,
          title: data.chapter,
        });
        setSubmissions(submissions);
        setAssessmentsLoading(false);
      }
    } else {
      setAssessmentsLoading(false);
    }
  };
  useEffect(() => {}, []);

  return (
    currentLesson?.key && (
      <Stack flex={1} position={"relative"} ref={slideContainerRef}>
        <Snackbar
          open={openNotification.success}
          autoHideDuration={3000}
          message="Successfully Submitted Assessment"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => {
                setOpenNotification({ error: false, success: false });
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Snackbar
          open={openNotification.error}
          autoHideDuration={3000}
          onClose={() => {
            setOpenNotification({ error: false, success: false });
          }}
          message="Failed to Submit Assessment"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => {
                setOpenNotification({ error: false, success: false });
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        {/* Assessment Details Modal */}
        <Modal
          title="Assessment Details"
          open={assessmentDetails.show}
          onOk={() => {
            setAssessmentDetails({
              show: false,
              details: null,
              header: null,
            });
          }}
          onCancel={() => {
            setAssessmentDetails({
              show: false,
              details: null,
              header: null,
            });
          }}
          bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          className="custom-modal-wrapper"
          footer={[
            <Button
              style={Styles.Button.Outline}
              key="back"
              onClick={() => {
                setAssessmentDetails({
                  show: false,
                  details: null,
                  header: null,
                });
              }}
            >
              Okay
            </Button>,
          ]}
        >
          <Editor
            editorState={updateEditorState}
            readOnly={true}
            toolbarHidden
            toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
            }}
            placeholder="Type here"
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
          />
        </Modal>
        <Drawer
          title="Submit Assessments"
          placement="left"
          onClose={() => {
            handleSlide();
          }}
          open={slide}
        >
          <Stack
            sx={{ width: 500, overflowY: "auto" }}
            maxHeight={"100%"}
            zIndex={5}
            bgcolor={"white"}
            position={"fixed"}
            left={0}
            top={0}
            bottom={0}
            spacing={2}
            p={3}
          >
            <Stack py={2}>
              <Typography>Submit Assessments</Typography>
            </Stack>
            <Stack spacing={2}>
              {assessmentsLoading && <AssessmentLoadingSkelleton />}

              {submissions.length === 0 && !assessmentsLoading ? (
                <Empty description={<Typography>No Assessments</Typography>} />
              ) : null}
              {submissions.map((sub: any, i: number) => {
                if (sub.show == "notsubmitted") {
                  //  student did not submit assessment
                  return (
                    <Stack key={i} spacing={2}>
                      <Stack direction={"row"} alignItems={"center"}>
                        <Stack flex={1}>
                          <Typography flex={1} variant="h6">
                            {sub.title}
                          </Typography>
                        </Stack>

                        <Button
                          style={Styles.Button.Outline}
                          onClick={() => {
                            setUpdateEditorState(
                              EditorState.createWithContent(
                                convertFromRaw({
                                  entityMap:
                                    sub.details.content.entityMap || {},
                                  blocks: sub.details.content.blocks,
                                })
                              )
                            );
                            setAssessmentDetails({
                              show: true,
                              details: sub.details.content,
                              header: sub.title,
                            });
                          }}
                        >
                          Details
                        </Button>
                      </Stack>

                      <Form
                        name="basic"
                        // wrapperCol={{ span: 16 }}
                        initialValues={{
                          remember: true,
                        }}
                        onFinish={(values) => {
                          onFinish({ ...values, chapter: sub.title });
                        }}
                        onFinishFailed={onFinishFailed}
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
                  );
                } else {
                  {
                    /* student submitted assessment */
                  }
                  return (
                    <Stack
                      borderRadius={3}
                      key={i}
                      bgcolor={"teal"}
                      sx={{ color: "white" }}
                      padding={2}
                      spacing={2}
                    >
                      <Stack direction={"row"} gap={2} alignItems={"center"}>
                        <CheckIcon />
                        <Stack>
                          <Typography color={"white"} variant="h6">
                            Well done
                          </Typography>
                          <Typography color={"white"} variant="subtitle1">
                            Submitted Assessment
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                }
              })}

              <Divider />
            </Stack>
          </Stack>
        </Drawer>
        {/* Quiz Modal */}
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

        <Box
          sx={{ "& > :not(style)": { m: 1 } }}
          position={"fixed"}
          zIndex={6}
          bottom={2}
          left={2}
        >
          <Fab
            onClick={() => {
              handleSlide();
            }}
            color="primary"
            variant="extended"
          >
            <AssessmentIcon sx={{ mr: 1, color: "white" }} />
            <Typography variant="button">Assessment</Typography>
          </Fab>
        </Box>

        {/* <SEO
title={post.frontmatter.title}
description={post.frontmatter.description}
/> */}
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
              maxHeight: `${96}vh`,
              overflowY: "auto",
              borderRadius: 5,
            }}
          >
            <Stack flex={1} p={2}>
              <Stack
                position={"fixed"}
                top={5}
                left={0}
                right={440}
                zIndex={10}
                spacing={2}
                px={4}
                py={3}
                direction={"row"}
                alignItems={"center"}
              >
                <Button
                  size="large"
                  style={{
                    ...Styles.Button.Outline,
                    alignSelf: "self-start",
                  }}
                  onClick={() => router.back()}
                >
                  <LeftOutlined />
                </Button>
                <Typography fontWeight={"bold"} variant="h6">
                  {currentLesson?.title}
                </Typography>
              </Stack>
              {currentLesson && !currentLesson.isQuiz && (
                <Stack spacing={4} pt={8}>
                  <QuizView quiz={currentLesson.isQuiz} />
                </Stack>
              )}
              {currentLesson && !currentLesson.isQuiz && (
                <Stack spacing={4} pt={8}>
                  <Box
                    width={"100%"}
                    height={700}
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

              <div style={{ marginTop: 0 }}>
                <Row>
                  {/* {course?.outline?.map(overview => {
        return (
          <Col xs={24} sm={24} md={12}>
            <div
              style={{
                background: "#dfdfdf",
                borderRadius: 20,
                padding: 20,
                marginBottom: 20,
                marginRight: 20,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CheckOutlined
                style={{
                  marginRight: 15,
                  color: "green",
                }}
              />
              {overview}
            </div>
          </Col>
        )
      })} */}
                </Row>
              </div>

              <Divider />

              <div style={{ padding: 40, paddingTop: 20 }}>
                {/* <Disqus /> */}
              </div>
            </Stack>
          </Stack>
          <Stack
            sx={{
              background: "#efefef",
              maxHeight: `${96}vh`,
              overflowY: "auto",
              borderRadius: 5,
              minWidth: 400,
              maxWidth: 400,
            }}
          >
            <Stack p={2}>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Course Content
              </Typography>
              <Link href={"mainSlug"}>
                <Typography
                  variant="h5"
                  style={{ color: "#97CA42", marginBottom: 0 }}
                >
                  {currentLesson?.title}
                </Typography>
                {/* <span style={{ color: "#afafaf" }}>{totalDuration}</span> */}
              </Link>
              <div style={{ display: "flex", alignItems: "center" }}>
                Progress
                <div
                  style={{
                    background: "#cfcfcf",
                    flex: 1,
                    height: 5,
                    marginLeft: 30,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#97CA42",
                      width: courseProgress > 0 ? `${courseProgress}%` : 0,
                      height: 5,
                    }}
                  />
                </div>
                <div style={{ paddingLeft: 10 }}>
                  {isNaN(courseProgress) ? "Error" : `${courseProgress}%`}
                </div>
              </div>
            </Stack>

            <Collapse
              style={{ background: "transparent" }}
              defaultActiveKey={[currentLesson.chapterKey]}
              bordered={false}
              expandIconPosition="end"
            >
              {course!.chapters.map((chapter, i) => {
                let submitted = false;
                let chapterTotalDuration = 0;
                for (let chapterLesson of chapter.lessons) {
                  if (!chapterLesson) continue;

                  const [min, sec] = chapterLesson.duration.split(":");

                  chapterTotalDuration += parseInt(min) * 60 + parseInt(sec);
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
                                <Stack flex={1}>
                                  {isLessonDone(lesson) ? (
                                    <CheckBoxIcon
                                      sx={{ color: Colors.Primary }}
                                    />
                                  ) : (
                                    <CheckBoxOutlineBlankIcon
                                      sx={{ color: Colors.Primary }}
                                    />
                                  )}
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
                                    {/* (
                  {DurationHelper.timeFormatToText(
                    lesson.frontmatter.duration
                  )}
                  ) */}
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
                      {/* <Stack
                        borderRadius={4}
                        p={2}
                        bgcolor={Colors.Primary}
                        color={"white"}
                        spacing={2}
                      >
                        <Typography color={"white"} variant="h5">
                          Quiz Test
                        </Typography>
                        <Typography>Pass test to open next section</Typography>
                        <Button
                          style={Styles.Button.Filled}
                          type="ghost"
                          icon={<RightOutlined />}
                          size={"large"}
                          onClick={() => {
                            setQuizModal(true);
                          }}
                        >
                          Begin Quiz
                        </Button>
                      </Stack> */}
                    </Timeline>
                    {/* Student assessment submission */}
                    {/* {checkSubmitted().then((res) => {
          return <Typography>Graeae</Typography>;
        })} */}
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </Stack>
        </Stack>
      </Stack>
    )
  );
};
