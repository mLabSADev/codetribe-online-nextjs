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
  Form,
  Input,
  Modal,
  Row,
  Timeline,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  CheckOutlined,
  LeftOutlined,
} from "@ant-design/icons";
// import Quiz from "../components/quiz"
// import Disqus from "gatsby-plugin-disqus/components/Disqus"
import { IconButton, Stack, Typography, Box, Fab, Slide } from "@mui/material";
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
import AssessmentSubmission from "@/app/dtos/assessment-submission";
import AssessmentIcon from "@mui/icons-material/Assessment";
const checkSubmitted = () => {
  let security = false;
  if (!security) {
    security = true;
    return new Promise((resolve, reject) => {
      const { origin, hostname, pathname, ancestorOrigins, href } =
        window.location;
      let splitter = href.split("/");
      AuthService.isLoggedIn().then((res) => {
        AuthService.currentUser().then((profile) => {
          const item = {
            uid: res.uid,
            chapter: splitter[5],
            course: splitter[4],
            location: profile.location || profile.groups[0],
          };
          Assessment.getSubmission(item).then((res) => {
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
  const canGoBack = true;
  let totalDuration;
  // let totalDurationUntilCurrentLesson = 0;
  let canGoForward;
  const [position, setPosition] = useState<Position>();
  const [submissions, setSubmissions] = useState([]);
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
  });
  const [slide, setSlide] = React.useState(false);
  const slideContainerRef = React.useRef(null);
  const [updateEditorState, setUpdateEditorState] = React.useState(
    EditorState.createEmpty()
  );
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
      CoursesService.course(courseId).then((course) => {
        const lessons: Lesson[] = [];

        setCourse(course);

        let hasToMove = false;
        let lessonToMoveTo;
        for (let chapter of course.chapters) {
          lessons.push(...chapter.lessons);
        }

        for (let lesson of lessons) {
          if (lesson.key === lessonId) {
            console.log(lesson);

            setLesson(lesson);
          }
          if (
            lesson.chapter == position.chapter &&
            lesson.lesson == position.lesson
          ) {
            lessonToMoveTo = lesson;
          }
        }
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
  };
  const goToNext = () => {
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

  const progress = Math.round((totalDurationUntilCurrentLesson / total) * 100);
  const onFinish = (values: any) => {
    console.log("Success ", values);
    const currentURL = window.location.href;
    let splitter = currentURL.split("/");
    const submission = {
      location: "",
      chapter: values.chapter,
      course: splitter[4],
      fullName: "",
      ...values,
    };
    console.log(submission);

    AuthService.currentUser().then((res) => {
      setUser(res);
      submission.fullName = `${res.firstname} ${res.lastname}`;
      if (res.location) {
        submission.location = res.location;
      } else {
        submission.location = res.groups[0];
      }
      Assessment.submit(submission).then((res) => {
        console.log("Submitted");
        setShowAssessmentSubmission(false);
      });
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const getSubmission = (data) => {
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
  const RunAssessmentFunc = (data) => {
    Assessment.getOne({ course: data.course, chapter: data.chapter }).then(
      (createdAssessment) => {
        if (createdAssessment) {
          // assessment available
          AuthService.currentUser().then((profile) => {
            // get current signed in user location
            var location = "";
            if (profile.location) {
              location = profile.location;
            } else {
              location = profile.groups[0];
            }
            Assessment.getOneSubmission({
              course: data.course,
              chapter: data.chapter,
              location: location,
            }).then((data) => {
              if (data) {
                if (submissions.length <= course!.chapters.length) {
                  submissions.push({
                    show: "submitted",
                    details: createdAssessment,
                  });
                  setSubmissions(submissions);
                  console.log(submissions);
                }
              } else {
                if (submissions.length <= course!.chapters.length) {
                  submissions.push({
                    show: "notsubmitted",
                    details: createdAssessment,
                  });
                  setSubmissions(submissions);
                  console.log(submissions, {
                    d: submissions.length,
                    b: course!.chapters.length,
                  });
                }
              }
            });
            // AuthService.isLoggedIn().then((res) => {
            //   console.log(data);

            //   // check if subbission was done for each chapter
            // });
          });
        } else {
          submissions.push({ show: "undefined", details: null });
          setSubmissions(submissions);
          const b = submissions;
          setTimeout(() => {
            setSubmissions([]);
            setSubmissions(b);
          }, 2000);
        }
      }
    );
  };
  useEffect(() => {}, []);

  return (
    currentLesson?.key && (
      <Stack position={"relative"} ref={slideContainerRef}>
        <Modal
          title="Assessment Details"
          open={assessmentDetails.show}
          onOk={() => {
            setAssessmentDetails({ show: false, details: null });
          }}
          onCancel={() => {
            setAssessmentDetails({ show: false, details: null });
          }}
        >
          <Editor
            name="content"
            editorState={updateEditorState}
            readOnly={false}
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
        <Box sx={{ width: 500 }}>
          <Slide
            direction="right"
            in={slide}
            container={slideContainerRef.current}
          >
            <Stack
              sx={{ width: 500 }}
              zIndex={5}
              bgcolor={"white"}
              position={"fixed"}
              left={0}
              top={0}
              bottom={0}
              p={3}
            >
              <Stack py={2}>
                <Typography variant="h5">Submit Assessments</Typography>
              </Stack>
              {course!.chapters.map((chapter, i) => {
                return (
                  <Stack>
                    <Typography
                      variant="h6"
                      color={"teal"}
                    >{`${chapter.title}`}</Typography>
                    {/* student submitted assessment */}
                    {submissions[i]?.show === "submitted" && (
                      <Stack
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
                    )}
                    {/* student did not submit assessment */}
                    {submissions[i]?.show === "notsubmitted" && (
                      <Stack spacing={2}>
                        <Stack direction={"row"} alignItems={"center"}>
                          <Typography flex={1} variant="subtitle1">
                            Submit Assessment
                          </Typography>
                          <Button
                            onClick={() => {
                              setUpdateEditorState(
                                EditorState.createWithContent(
                                  convertFromRaw({
                                    entityMap:
                                      submissions[i].details.content
                                        .entityMap || {},
                                    blocks:
                                      submissions[i].details.content.blocks,
                                  })
                                )
                              );
                              setAssessmentDetails({
                                show: true,
                                details: submissions[i].details.content,
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
                            onFinish({ ...values, chapter: chapter.title });
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
                            ]}
                          >
                            <Input placeholder="https://github.com/.../..." />
                          </Form.Item>
                          <Form.Item
                            label="Live URL"
                            name="live"
                            rules={[
                              {
                                required: false,
                              },
                            ]}
                          >
                            <Input placeholder="https://www.myhostedsite.com/.../..." />
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Submit
                            </Button>
                          </Form.Item>
                        </Form>
                      </Stack>
                    )}

                    {/* no assessment created */}
                    {submissions[i]?.show === "undefined" && (
                      <Stack p={2} spacing={2}>
                        <Typography color={"GrayText"} variant="subtitle1">
                          No Assessment
                        </Typography>
                      </Stack>
                    )}
                    <Divider />
                  </Stack>
                );
              })}
            </Stack>
          </Slide>
        </Box>
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
            <AssessmentIcon sx={{ mr: 1 }} />
            Assessment
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
        >
          <Stack flex={1}>
            <Stack
              flex={1}
              sx={{
                background: "#efefef",
                borderRadius: 5,
              }}
              p={2}
            >
              <Stack
                position={"sticky"}
                spacing={2}
                direction={"row"}
                alignItems={"center"}
              >
                <IconButton onClick={() => router.back()}>
                  <ArrowBackRoundedIcon />
                </IconButton>

                <Typography fontWeight={"bold"} variant="h6">
                  {currentLesson?.title}
                </Typography>
              </Stack>

              {currentLesson && !currentLesson.isQuiz && (
                <div>
                  <iframe
                    width="100%"
                    height="700"
                    allowFullScreen
                    src={currentLesson?.videoUrl}
                    frameBorder={0}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                  <Divider />
                  <div style={{ display: "flex", marginTop: 20 }}>
                    <Button
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
                      onClick={goToNext}
                      disabled={!canGoForward}
                      size="large"
                      type="default"
                      loading={nextIsLoading}
                    >
                      Next <ArrowRightOutlined />
                    </Button>
                  </div>
                </div>
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
                <span style={{ color: "#afafaf" }}>{totalDuration}</span>
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
                      width: `${progress}%`,
                      height: 5,
                    }}
                  />
                </div>
                <div style={{ paddingLeft: 10 }}>
                  {isNaN(progress) ? "-" : progress}%
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

                // Keketso
                const { pathname } = window.location;
                const c = pathname.split("/")[2];
                RunAssessmentFunc({ course: c, chapter: chapter.title });
                // check if chapter has an assessment

                return (
                  <Collapse.Panel
                    // expandIconPosition="end"
                    header={
                      <Stack>
                        <Typography
                          sx={{
                            color:
                              chapter.key === currentLesson.chapterKey
                                ? "#97CA42"
                                : "#606060",
                          }}
                          variant="subtitle1"
                        >{`${chapter.title} (${chapterTotalDurationText})`}</Typography>
                      </Stack>
                    }
                    key={chapter.key}
                    style={{
                      backgroundColor: "rgba(0,0,0,0)",
                      borderColor: "#f0f2f5",
                    }}
                  >
                    <Timeline style={{ marginLeft: 20, marginTop: 10 }}>
                      {chapter.lessons.map((lesson, key) => {
                        return (
                          <Timeline.Item
                            style={{ backgroundColor: "rgba(0,0,0,0)" }}
                            key={key}
                            dot={
                              <Stack>
                                {isLegalPage(lesson) ? (
                                  <CheckBoxIcon color="success" />
                                ) : (
                                  <CheckBoxOutlineBlankIcon color="success" />
                                )}
                              </Stack>
                            }
                          >
                            {/* <Link style={{color: lesson.current ? '#97CA42' : '#606060', fontWeight: lesson.current ? 'bold' : 'normal'}}>{lesson.frontmatter.title} ({DurationHelper.timeFormatToText(lesson.frontmatter.duration)})</Link> */}
                            <Link
                              href={
                                isLegalPage(lesson)
                                  ? `/course/${course?.key}/${chapter.key}/${lesson.key}`
                                  : "undefined"
                              }
                              style={{
                                color: "#606060",
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
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>

                    {/* Student assessment submission */}
                    {/* {checkSubmitted().then((res) => {
          return <Typography>Graeae</Typography>;
        })} */}

                    <Divider />
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
