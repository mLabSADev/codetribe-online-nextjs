'use client'

import React, { useEffect, useState } from "react"
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckOutlined,
  LeftOutlined,
} from "@ant-design/icons"
import { Button, Col, Collapse, Row, Timeline } from "antd"
import Lesson from "@/app/dtos/lesson"
import { useRouter } from "next/navigation"
import { CoursesService } from "@/app/services/courses-service"
import Course from "@/app/dtos/course"
import { LessonService } from "@/app/services/lesson-service"
import Link from "next/link"

export const DurationHelper = {
  secondsToText: (seconds: number) => {
    let hours = Math.floor(seconds / (60 * 60))
    seconds = seconds - hours * 60 * 60

    let min = Math.floor(seconds / 60)
    seconds = seconds - min * 60

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${min} min`
    } else {
      return `${min} min`
    }
  },
  timeFormatToText: (time: string) => {
    const [min, sec] = time.split(":")

    let total = 0
    total += parseInt(min) * 60 + parseInt(sec)

    return DurationHelper.secondsToText(total)
  },
}

export interface Position {
    chapter: number
    lesson: number
}

const CourseOverview = ({ params }: { params: { id: string }}) => {
//   let currentChapter = post.frontmatter.chapter
//   let currentLesson = post.frontmatter.lesson
  // const canGoBack = currentChapter > 0
  let totalDuration
  // let totalDurationUntilCurrentLesson = 0;
  // let canGoForward
  // let title
  // let mainSlug
  const [position, setPosition] = useState<Position>()
  const [
    totalDurationUntilCurrentLesson,
    setTotalDurationUntilCurrentLesson,
  ] = useState(0)
  const [total, setTotal] = useState(0)
  const [nextIsLoading, setNextIsLoading] = useState(false)
  const [hasToMove, setHasToMove] = useState(false)
  const [lessonToMoveTo, setLessonToMoveTo] = useState<Lesson>()
  const [currentPosition, setCurrentPosition] = useState<{
    currentChapter: number
    currentLesson: number
  }>()
  const router = useRouter()

  const isLegalPage = (lesson: Lesson) => {
    if (position) {
      let hasToMove = false
      if (
        lesson.chapter == position.chapter &&
        lesson.lesson > position.lesson
      ) {
        hasToMove = true
      } else if (lesson.chapter > position.chapter) {
        hasToMove = true
      }

      return !hasToMove
    }

    return false
  }

  const startCourse = () => {
    // if (hasToMove || (currentChapter == 0 && currentLesson == 0)) {
    //   router.push(`/home/overview/${lessonToMoveTo?.lesson}`)
    // }

    router.push(`/course/${course?.key}/${course?.chapters[0].key}/${course?.chapters[0].lessons[1].key}`)
  }

  useEffect(() => {
    const courseId = params['id']
    console.log('Getting course');
    CoursesService.course(courseId).then(course => {
      console.log(`Course: `);
      console.log(course);
      setCourse(course)
      
    }).catch(err => {
      console.log(`Could not get course: ${err.message}`);
    })

    LessonService.currentLessonPosition(
      params.id
    ).then(position => {
      setPosition(position)
    })
  }, [])

  const [course, setCourse] = useState<Course>()

  useEffect(() => {
    
  }, [])

  // const lessons = data.allMarkdownRemark.edges
  //   .map(edge => {
  //     return edge.node
  //   })
  //   .filter(lesson => lesson.fields.tutorial === post.fields.tutorial)

  totalDuration = DurationHelper.secondsToText(total)

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
    <div>
      {course && <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div
            style={{
              background: "#efefef",
              borderRadius: 20,
              width: "100%",
              padding: 20,
              marginBottom: 20,
              paddingLeft: 50,
              paddingRight: 50,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                style={{
                  borderStyle: "none",
                  background: "#dfdfdf",
                  width: 35,
                  height: 35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 20,
                  borderRadius: "50%",
                }}
                onClick={() => router.back()}
              >
                <LeftOutlined />
              </Button>
            </div>

            <img src={course.imageUrl} alt={course.title} style={{
              width: "100%",
              height: "50vh",
              marginBottom: 0,
              marginTop: 20,
              objectFit: 'cover'
            }} />

            <div style={{}}>
              <h1>{course.title}</h1>
            </div>

            <Button
              style={{
                borderRadius: 20,
                background: "#66e22c",
                color: "white",
                textTransform: "uppercase",
                borderStyle: "none",
              }}
              onClick={startCourse}
            >
              {"View Course"}
            </Button>

            <div
              style={{
                overflow: "hidden",
                marginTop: 20,
              }}
              dangerouslySetInnerHTML={{ __html: course.excerpt }}
            ></div>

            <div style={{ marginTop: 20 }}>
              <Row>
                {(course.outline.split('\n') || []).filter(outline => outline.trim().length > 0).map(overview => {
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
                })}
              </Row>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              marginBottom: 20,
              borderRadius: 20,
            }}
          >
            <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
              <h2 style={{ fontWeight: "bold" }}>Course Content</h2>
              {/* <Link to={mainSlug}><h2 style={{color: '#97CA42', marginBottom: 0}}>{title}</h2><span style={{color: '#afafaf'}}>{totalDuration}</span></Link> */}
              {/* <div style={{display: 'flex', alignItems: 'center'}}>
                                            Progress
                                            <div style={{background: '#cfcfcf', flex: 1, height: 5, marginLeft: 30, borderRadius: 3, overflow: 'hidden'}}>
                                                <div style={{background: '#97CA42', width: `${progress}%`, height: 5}} />
                                            </div>
                                            <div style={{paddingLeft: 10}}>{isNaN(progress) ? '-' : progress}%</div>
                                        </div> */}
            </div>

            <Collapse
              style={{
                borderStyle: "none",
                borderRadius: 30,
                background: "transparent",
              }}
              bordered={false}
            >
              {course.chapters.map(chapter => {
                // const chapter = chapters[key]

                console.log(chapter);
                let chapterTotalDuration = 0
                for (let chapterLesson of chapter.lessons) {
                  if (!chapterLesson) continue

                  const [min, sec] = chapterLesson.duration.split(
                    ":"
                  )

                  chapterTotalDuration += parseInt(min) * 60 + parseInt(sec)
                }

                return (
                  <Collapse.Panel
                    showArrow={false}
                    // expandIconPosition="none"
                    header={
                      <div
                        style={{
                          borderStyle: "none",
                          background: "#efefef",
                          padding: 20,
                          borderRadius: 20,
                          fontSize: "1.5em",
                          fontWeight: "bold",
                        }}
                      >{`${chapter.title} (${DurationHelper.secondsToText(
                        chapterTotalDuration
                      )})`}</div>
                    }
                    key={`chapter-`+chapter.chapter}
                    style={{
                      background: "transparent",
                      borderColor: "#f0f2f5",
                    }}
                  >
                    <div
                      style={{
                        background: "#efefef",
                        marginBottom: 10,
                        padding: 20,
                        borderRadius: 30,
                      }}
                    >
                      <Timeline style={{ marginLeft: 20, marginTop: 10 }}>
                        {chapter.lessons.map((lesson, key) => {
                          return (
                            <Timeline.Item
                              style={{ background: "transparent" }}
                              key={key}
                              dot={
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    background: isLegalPage(lesson)
                                      ? "#97CA42"
                                      : "#dfdfdf",
                                    padding: 2,
                                    borderRadius: 5,
                                  }}
                                >
                                  {
                                    <CheckOutlined
                                      style={{
                                        color: isLegalPage(lesson)
                                          ? "white"
                                          : "#dfdfdf",
                                        background: "transparent",
                                      }}
                                    />
                                  }
                                </div>
                              }
                            >
                              {/* <Link style={{color: lesson.current ? '#97CA42' : '#606060', fontWeight: lesson.current ? 'bold' : 'normal'}}>{lesson.frontmatter.title} ({DurationHelper.timeFormatToText(lesson.frontmatter.duration)})</Link> */}
                              <Link
                              href={''}
                                style={{
                                  color: "#606060"
                                }}
                              >
                                {lesson.title} (
                                {DurationHelper.timeFormatToText(
                                  lesson.duration
                                )}
                                )
                              </Link>
                            </Timeline.Item>
                          )
                        })}
                      </Timeline>
                    </div>
                  </Collapse.Panel>
                )
              })}
            </Collapse>
          </div>
        </Col>
      </Row>}
    </div>
  )
}

export default CourseOverview