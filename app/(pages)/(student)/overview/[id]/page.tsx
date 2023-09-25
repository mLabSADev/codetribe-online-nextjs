"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Collapse, Row, Timeline } from "antd";
import Lesson from "@/app/dtos/lesson";
import { useRouter } from "next/navigation";
import { CoursesService } from "@/app/services/courses-service";
import Course from "@/app/dtos/course";
import { LessonService } from "@/app/services/lesson-service";
import Link from "next/link";
import { Colors, Styles } from "@/app/services/styles";
import {
  Stack,
  Typography,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Container,
  AppBar,
  Button as MUIButton,
} from "@mui/material";
import Image from "next/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ArrowBackRounded, Check, CheckRounded } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
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
  timeFormatToText: (time: string) => {
    const [min, sec] = time.split(":");

    let total = 0;
    total += parseInt(min) * 60 + parseInt(sec);

    return DurationHelper.secondsToText(total);
  },
};

export interface Position {
  chapter: number;
  lesson: number;
}

const CourseOverview = ({ params }: { params: { id: string } }) => {
  const [position, setPosition] = useState<Position>();
  const [totalDurationUntilCurrentLesson, setTotalDurationUntilCurrentLesson] =
    useState(0);
  const [total, setTotal] = useState(0);
  const [nextIsLoading, setNextIsLoading] = useState(false);
  const [hasToMove, setHasToMove] = useState(false);
  const [lessonToMoveTo, setLessonToMoveTo] = useState<Lesson>();
  const [currentPosition, setCurrentPosition] = useState<{
    currentChapter: number;
    currentLesson: number;
  }>();
  const theme = useTheme();
  //   let currentChapter = post.frontmatter.chapter
  //   let currentLesson = post.frontmatter.lesson
  // const canGoBack = currentChapter > 0
  // let totalDurationUntilCurrentLesson = 0;
  // let canGoForward
  // let title
  // let mainSlug
  let totalDuration: string = "";

  const router = useRouter();

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

  const startCourse = () => {
    // if (hasToMove || (currentChapter == 0 && currentLesson == 0)) {
    //   router.push(`/home/overview/${lessonToMoveTo?.lesson}`)
    // }
    if (course && currentChapter) {
      router.push(`/course/${course?.key}/${currentChapter}/${currentLesson}`);
    } else {
      router.push(
        `/course/${course?.key}/${course?.chapters[0].key}/${course?.chapters[0].lessons[0].key}`
      );
    }
  };

  useEffect(() => {
    const courseId = params["id"];

    // console.log("Getting course", courseId.trim());
    CoursesService.course(courseId).then((course) => {
      // console.log(`Course: ${course}`);
      let c = { ...course, key: courseId };
      // console.log(c);
      setCourse(c);
    });

    LessonService.currentLessonPosition(params.id).then((position) => {
      setPosition(position);
    });
  }, []);

  const [course, setCourse] = useState<Course>();
  const [currentChapter, setCurrentChapter] = useState<any>();
  const [currentLesson, setCurrentLesson] = useState<any>();

  useEffect(() => {
    LessonService.getCurrentChapter(params["id"])
      .then((res) => {
        if (res) setCurrentChapter(res);
      })
      .catch((err) => {
        // console.log(err);
      });

    // console.log(params["id"]);
    LessonService.getCurrentLesson(params["id"]).then((res) => {
      // // console.log(res);

      if (res) setCurrentLesson(res);
    });
  }, []);

  // const lessons = data.allMarkdownRemark.edges
  //   .map(edge => {
  //     return edge.node
  //   })
  //   .filter(lesson => lesson.fields.tutorial === post.fields.tutorial)

  totalDuration = DurationHelper.secondsToText(total);

  // const chapters = {}
  // lessons.forEach(lesson => {
  //   if (lesson.frontmatter.lesson === 0 && lesson.frontmatter.chapter === 0) {
  //     title = lesson.frontmatter.title
  //     mainSlug = lesson.fields.slug
  //   } else {
  //     if (chapters[lesson.frontmatter.chapter] === undefined) {
  //       chapters[lesson.frontmatter.chapter] = {
  //         lessons: [],
  //         timeToRead: 0,
  //       }
  //     }

  //     if (lesson.frontmatter.lesson === 0) {
  //       chapters[lesson.frontmatter.chapter].title = lesson.frontmatter.title

  //       if (lesson.frontmatter.chapter === currentChapter) {
  //         chapters[lesson.frontmatter.chapter].current = true
  //       } else {
  //         chapters[lesson.frontmatter.chapter].current = false
  //       }
  //     } else {
  //       if (lesson.frontmatter.chapter < currentChapter) {
  //         lesson.completed = true
  //       } else if (
  //         lesson.frontmatter.chapter === currentChapter &&
  //         lesson.frontmatter.lesson < currentLesson
  //       ) {
  //         lesson.completed = true
  //       } else {
  //         lesson.completed = false
  //       }

  //       if (
  //         lesson.frontmatter.chapter === currentChapter &&
  //         lesson.frontmatter.lesson === currentLesson
  //       ) {
  //         lesson.current = true
  //       } else {
  //         lesson.current = false
  //       }

  //       chapters[lesson.frontmatter.chapter].lessons[
  //         lesson.frontmatter.lesson
  //       ] = lesson
  //       chapters[lesson.frontmatter.chapter].timeToRead += lesson.timeToRead
  //     }
  //   }
  // })

  return (
    <Stack p={0} spacing={2}>
      <AppBar color="inherit" position="sticky" elevation={0}>
        <Toolbar>
          <MUIButton
            size="large"
            // style={{ ...Styles.Button.Outline, alignSelf: "self-start" }}
            onClick={() => router.push("/home")}
          >
            <ArrowBackRounded />
          </MUIButton>
        </Toolbar>
      </AppBar>
      {course && (
        <Stack direction={{ sm: "column", md: "row" }}>
          <Container>
            <Stack spacing={2} pb={3}>
              <Box
                width={"100%"}
                height={460}
                borderRadius={3}
                overflow={"hidden"}
                bgcolor={"whitesmoke"}
              >
                <LazyLoadImage
                  src={course.imageUrl}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Stack
                direction={{ sm: "column", md: "column", lg: "row" }}
                alignItems={{
                  sm: "flex-start",
                  md: "flex-start",
                  lg: "center",
                }}
                spacing={3}
              >
                <Stack spacing={3} flex={1}>
                  <Typography variant="h3">{course.title}</Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={1}
                  p={2}
                >
                  <Avatar size={40}>KM</Avatar>
                  <Stack>
                    <Typography variant="subtitle1">
                      Jane Doe - Instructor
                    </Typography>
                    <Typography color={"GrayText"}>
                      Web Developer, Designer, and Teacher
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  spacing={3}
                  flex={1}
                  justifyItems={"flex-end"}
                  alignItems={"flex-end"}
                  justifyContent={"flex-end"}
                  alignContent={"flex-end"}
                >
                  <Button
                    size="large"
                    style={{ ...Styles.Button.Filled, alignSelf: "self-end" }}
                    onClick={startCourse}
                  >
                    {"View Course"}
                  </Button>
                </Stack>
              </Stack>

              <Stack spacing={2} py={2}>
                <Typography variant="h5">What you will learn</Typography>
                <Typography>{course.excerpt}</Typography>
              </Stack>
              <Stack pt={2}>
                <Grid container gap={0}>
                  {course.outline.map((overview: string, key: number) => {
                    return (
                      <Grid item key={key} xs={12} sm={12} md={12} lg={6}>
                        <Stack
                          direction={"row"}
                          p={2}
                          m={1}
                          bgcolor={"rgba(38, 38, 38, 0.05)"}
                          borderRadius={3}
                          alignItems={"center"}
                        >
                          <IconButton>
                            <CheckRounded />
                          </IconButton>
                          <Typography variant="body2"> {overview}</Typography>
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
            </Stack>
          </Container>

          <Stack
            minWidth={{ sm: 250, md: 300, lg: 500 }}
            py={3}
            px={{ md: 3, lg: 0 }}
          >
            <Stack
              spacing={2}
              style={{
                width: "100%",
                maxWidth: "100%",
                marginBottom: 20,
                borderRadius: 20,
              }}
            >
              <Typography variant="h5">Course Content</Typography>

              <Collapse
                style={{
                  borderStyle: "none",
                  borderRadius: 30,
                  background: "transparent",
                }}
                bordered={false}
              >
                {course.chapters.map((chapter) => {
                  // const chapter = chapters[key]

                  // console.log(chapter);
                  let chapterTotalDuration = 0;
                  for (let chapterLesson of chapter.lessons) {
                    if (!chapterLesson) continue;

                    const [min, sec] = chapterLesson.duration.split(":");

                    chapterTotalDuration += parseInt(min) * 60 + parseInt(sec);
                  }

                  return (
                    <Collapse.Panel
                      showArrow={false}
                      // expandIconPosition="none"
                      header={
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <Typography variant="h6">{chapter.title}</Typography>

                          <Typography variant="overline">
                            {DurationHelper.secondsToText(chapterTotalDuration)}
                          </Typography>
                        </Stack>
                      }
                      key={`chapter-` + chapter.chapter}
                      style={{
                        background: "transparent",
                        borderColor: "#f0f2f5",
                      }}
                    >
                      <Stack>
                        <Timeline style={{ marginLeft: 20, marginTop: 10 }}>
                          {chapter.lessons.map((lesson, key) => {
                            return (
                              <Timeline.Item
                                style={{ background: "transparent" }}
                                key={key}
                                dot={
                                  <Stack
                                    width={30}
                                    height={30}
                                    borderRadius={30}
                                    border={2}
                                    bgcolor={"white"}
                                    borderColor={
                                      isLegalPage(lesson)
                                        ? "#97CA42"
                                        : "#dfdfdf"
                                    }
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                  >
                                    {isLegalPage(lesson) && (
                                      <Check sx={{ color: "#97CA42" }} />
                                    )}
                                  </Stack>
                                }
                              >
                                {/* <Link style={{color: lesson.current ? '#97CA42' : '#606060', fontWeight: lesson.current ? 'bold' : 'normal'}}>{lesson.frontmatter.title} ({DurationHelper.timeFormatToText(lesson.frontmatter.duration)})</Link> */}
                                <Link
                                  href={""}
                                  style={{
                                    color: "#606060",
                                  }}
                                >
                                  <Stack flex={1} direction={"row"}>
                                    <Typography flex={1} variant="body1">
                                      {lesson.title}
                                    </Typography>
                                    <Typography variant="overline">
                                      {DurationHelper.timeFormatToText(
                                        lesson.duration
                                      )}
                                    </Typography>
                                  </Stack>
                                </Link>
                              </Timeline.Item>
                            );
                          })}
                        </Timeline>
                      </Stack>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default CourseOverview;
