"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Stack, Typography as MUITypography } from "@mui/material";
import { Button, Divider, Input, Typography } from "antd";
import { AuthService } from "@/app/services/auth-service";
import StudentProgress from "@/app/components/student-progress";
import TutorialListing from "@/app/components/tutorial-listing";
import ResourceCards, { BackendCard } from "@/app/components/resources";
import { Styles } from "@/app/services/styles";
import { LessonService } from "@/app/services/lesson-service";
import Course from "@/app/dtos/course";
import { CoursesService } from "@/app/services/courses-service";

export function stringToColor(string: string) {
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

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
const ProgressData = [
  {
    progress: 100,
    course: "NodeJS",
    lesson: 4,
    section: "Create Page Login and Signup",
    duration: "4min",
    link: "",
  },
  {
    progress: 84,
    course: "ReactJS",
    lesson: 2,
    section: "Create Page Login and Signup",
    duration: "4min",
    link: "",
  },
  {
    progress: 0,
    course: "React Native",
    lesson: 1,
    section: "Create Page Login and Signup",
    duration: "4min",
    link: "",
  },
];
const FrontEndResourceData = [
  {
    image: "/images/resources/IONIC.jpg",
    title: "Ionic UI Components",
    description:
      "Ionic apps are made of high-level building blocks called Components, which allow you to quickly construct the UI for your app. Ionic comes stock with a number of components, including cards, lists, and tabs.",
    links: [
      {
        label: "Layout",
        link: "https://ionicframework.com/docs/core-concepts/cross-platform#layout",
      },
      {
        label: "Typography",
        link: "https://ionicframework.com/docs/api/text",
      },
      {
        label: "Button",
        link: "https://ionicframework.com/docs/api/button",
      },
      {
        label: "Inputs",
        link: "https://ionicframework.com/docs/api/input",
      },
      {
        label: "Theming Basics",
        link: "https://ionicframework.com/docs/theming/basics",
      },
    ],
  },
  {
    image: "/images/resources/MUI.jpg",
    title: "MUI for ReactJS",
    description:
      "MUI offers a comprehensive suite of UI tools to help you ship new features faster. Start with Material UI, our fully-loaded component library, or bring your own design system to our production-ready components.",
    links: [
      {
        label: "Layout",
        link: "https://mui.com/material-ui/react-stack/",
      },
      {
        label: "Typography",
        link: "https://mui.com/material-ui/react-typography/",
      },
      {
        label: "Button",
        link: "https://mui.com/material-ui/react-button/",
      },
      {
        label: "Inputs",
        link: "https://mui.com/material-ui/react-text-field/",
      },
      {
        label: "Theming",
        link: "https://mui.com/material-ui/customization/theming/",
      },
    ],
  },
  {
    image: "/images/resources/ANTD.jpg",
    title: "Ant Design",
    description:
      "Help designers/developers building beautiful products more flexible and working with happiness",
    links: [
      {
        label: "Design Values",
        link: "https://ant.design/docs/spec/values",
      },
      {
        label: "ColorPicker",
        link: "https://ant.design/components/color-picker",
      },
      {
        label: "QRCode",
        link: "https://ant.design/components/qrcode",
      },
      {
        label: "Tour",
        link: "https://ant.design/components/tour",
      },
      {
        label: "ConfigProvider",
        link: "https://ant.design/components/config-provider",
      },
    ],
  },
];
const BackendResourceData = [
  {
    icon: "/images/resources/REDUX.png",
    title: "Redux Toolkit",
    color: "#593D88",
    description:
      "The official, opinionated, batteries-included toolset for efficient Redux development",
    link: "https://redux-toolkit.js.org/tutorials/quick-start",
  },
  {
    icon: "/images/resources/FIREBASE.png",
    title: "Firebase",
    color: "#039BE5",
    description:
      "Firebase is an app development platform that helps you build and grow apps and games users love. Backed by Google and trusted by millions of businesses around the world.",
    link: "https://firebase.google.com/docs/build?authuser=0&hl=en",
  },
];
// End dummy data ====
export default () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courses, setCourses] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    setLoading(true);
    AuthService.currentUser().then((result) => {
      console.log(result);
      setUser(result);
      setLoading(false);
    });
  }, []);

  // Logic to generate progress
  const RunProgressFunc = async () => {
    /**
     * Access course name
     * Access course chapter
     * Access chapter lesson
     * Calculate Progress
     */
    let progress = {
      course: "",
      chapterTitle: "",
      lessonTitle: "",
      progress: 0,
      link: "", // course/angular/-NYIAo4sdBRnBCBYJtYk/-NYIAo9n-Ndd9iScBA1k
    };
    let courseProgress = await LessonService.getAllUserProgress().then(
      (res) => {
        return res.data;
      }
    );
    console.log({ courses, courseProgress });
    // Check progress for each course

    // run through the courses
    courses.forEach((course) => {
      console.log("Course: >", course.key);
      progress = {
        course: "",
        chapterTitle: "",
        lessonTitle: "",
        progress: 0,
        link: "",
      };

      progress.course = course.title;
      var studentProgress = 0;
      var chapterTotal = 0;
      
      // Check if course has been started
      if (courseProgress[course.key]) {
        // iterate progress chapters keys
        if (courseProgress[course.key].progress != null) {
          Object.keys(courseProgress[course.key].progress).map((chapter) => {
            chapterTotal = Object.keys(course.chapters[chapter].lessons).length;
            console.log(">> Set Chapter Total: ", chapterTotal);
            // console.log("Chapter: >>", chapter);
            progress.chapterTitle = course.chapters[chapter].title;
            console.log(">> Set Title: ", progress.chapterTitle);

            // iterate progress lessons keys
            Object.keys(courseProgress[course.key].progress[chapter]).map(
              (lesson) => {
                progress.lessonTitle =
                  course.chapters[chapter].lessons[lesson].title;
                if (
                  courseProgress[course.key].progress[chapter][lesson].isDone
                ) {
                  studentProgress = studentProgress + 1;
                  progress.link = `course/${course.key}/${chapter}/${lesson}`;
                }
                // console.log("Lesson: >>>", lesson);
              }
            );
            console.log(
              studentProgress,
              Object.keys(course.chapters[chapter].lessons).length
            );
            // (part/whole) * 100
            const p = ((studentProgress / chapterTotal) * 100).toFixed(0);
            progress.progress = p * 1;
            
            if (progress.progress) {
              progressList.push(progress);
            }

            setProgressList([...progressList])
            // setTimeout(() => {
            //   console.log("updated list");
            //   setProgressList(progressList);
            // }, 3000);
            progress = {
              course: progress.course,
              chapterTitle: "",
              lessonTitle: "",
              progress: 0,
              link: "",
            };
            studentProgress = 0;
          });
        }
      } else {
        console.log(`${course.title} not started`);

        // course not started
      }
      console.log(">> All Progress: ", progressList);
    });
  };

  useEffect(() => {
    CoursesService.courses().then((c) => {
      c.forEach((element) => {
        courses.push(element);
      });
      setCourses(courses);
      RunProgressFunc();
    });
  }, []);
  //   useEffect(() => {
  //     AuthService.isLoggedIn()
  //       .then(result => {
  //         if (result) {
  //           setIsLoggedIn(true)
  //           AuthService.currentUser().then(profile => {
  //             // if (profile.bootcamp) {
  //             //   router.push("/webinars")
  //             // }
  //           })
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);

  //         router.push("/")
  //       })
  //       .finally(() => {
  //         setLoading(false)
  //       })
  //   }, [])

  return loading ? (
    <div></div>
  ) : user ? (
    <Stack>
      {/* <PageLayout fullscreen={true} active='home'>
            </PageLayout> */}
      {/* <HomeContent /> */}

      <Stack py={5} spacing={2} alignItems={"center"}>
        <Avatar
          //   sx={{ width: 56, height: 56 }}
          {...stringAvatar(
            `${user?.firstname || "C"} ${user?.lastname || "T"}`
          )}
        />
        <Typography.Title style={{ fontSize: 28, margin: 0 }}>
          {user?.firstname} {user?.lastname}
        </Typography.Title>
        {/* <Typography>
          {user.role && user.role.toUpperCase() || `${user?.name}@mail.com`}
        </Typography> */}
      </Stack>
      <Stack p={1}>
        <div>
          <div style={{ flex: 1 }}>
            {/* Courses */}
            <div
              style={{
                marginTop: 0,
                borderRadius: 20,
                // marginBottom: 20,
              }}
            >
              <Divider orientation="left">Your Progress</Divider>

              <Stack
                spacing={1}
                gap={1}
                sx={{ overflowX: "auto" }}
                direction={{ xs: "column", sm: "row", md: "row" }}
              >
                {progressList.length == 0 ? (
                  <Stack
                    flex={1}
                    padding={5}
                    textAlign={"center"}
                    alignItems={"center"}
                    justifyItems={"center"}
                  >
                    <MUITypography variant="h6">Progress Tracker</MUITypography>
                    <MUITypography variant="body2">
                      Upon starting your course you will be able to see your
                      progress here. View any course and start learning.
                    </MUITypography>
                    <Button>Refresh</Button>
                  </Stack>
                ) : null}
                {progressList.map((item, i) => {
                  console.log("Progress Item >>> ", item);

                  return (
                    <StudentProgress
                      link={item.link}
                      locked={false}
                      key={i}
                      lesson={item.chapterTitle || "N/A"}
                      course={item.course || "N/A"}
                      title={item.lessonTitle || "N/A"}
                      progress={item.progress || "N/A"}
                    />
                  );
                })}
              </Stack>
              <Divider />
              <Stack p={2}>
                <Typography.Title>Browse Tutorials</Typography.Title>
              </Stack>
            </div>

            <TutorialListing limit={6} />

            {/* Resources */}
            <Stack py={10} spacing={3}>
              <Stack alignItems={"center"}>
                <Typography.Title>Resources</Typography.Title>
              </Stack>
              <Stack
                width={"100%"}
                sx={{ overflowX: "auto" }}
                direction={{ sm: "column", md: "column", lg: "row" }}
                spacing={1}
                gap={1}
              >
                {/*  */}
                {FrontEndResourceData.map((item, i) => {
                  return (
                    <ResourceCards
                      key={i}
                      title={item.title}
                      description={item.description}
                      links={item.links}
                      image={item.image}
                    />
                  );
                })}
              </Stack>
              <Stack
                direction={{ sm: "column", md: "column", lg: "row" }}
                spacing={1}
                gap={1}
              >
                {BackendResourceData.map((item, i) => {
                  return (
                    <BackendCard
                      key={i}
                      link={item.link}
                      color={item.color}
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                    />
                  );
                })}
              </Stack>
            </Stack>
          </div>
        </div>
      </Stack>
    </Stack>
  ) : (
    <div></div>
  );
};
