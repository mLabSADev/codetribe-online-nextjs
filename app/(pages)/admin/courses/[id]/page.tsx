"use client";

import Chapter from "@/app/dtos/chapter";
import Course from "@/app/dtos/course";
import Lesson from "@/app/dtos/lesson";
import Quiz from "@/app/dtos/quiz";
import CreateEditLesson from "@/app/modals/create-edit-lesson";
import CreateEditQuiz from "@/app/modals/create-edit-quiz";
import { CoursesService } from "@/app/services/courses-service";
import { Styles } from "@/app/services/styles";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

const Lessons = ({ course, chapter }: { course: Course; chapter: Chapter }) => {
  const [showCreateEditLesson, setShowCreateEditLesson] = useState<{
    show: boolean;
    selectedLesson?: Lesson | null | undefined;
  }>({
    show: false,
    selectedLesson: null,
  });
  const [showCreateEditQuiz, setShowCreateEditQuiz] = useState<{
    show: boolean;
    selectedQuiz?: Quiz | null | undefined;
  }>({
    show: false,
    selectedQuiz: null,
  });
  const [lessonToRemove, setLessonToRemove] = useState<Lesson>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    setLessons(chapter.lessons);
  }, [chapter]);

  const onEdit = (lesson: Lesson) => {
    setShowCreateEditLesson({
      show: true,
      selectedLesson: lesson,
    });
  };

  const onClose = () => {
    setShowCreateEditLesson({
      show: false,
    });
  };

  const handleLessonRemove = () => {
    setRemoving(true);

    CoursesService.removeLesson(course.key, chapter, lessonToRemove!)
      .then(() => {
        const lessonsToKeep = [];

        for (let i = 0; i < lessons.length; i++) {
          if (lessons[i].key !== lessonToRemove?.key) {
            lessonsToKeep.push(lessons[i]);
          }
        }

        setLessons(lessonsToKeep);
        setLessonToRemove(undefined);
      })
      .finally(() => {
        setRemoving(false);
      });
  };

  const onMoveUp = (lesson: Lesson) => {
    CoursesService.moveLessonUp(course.key, chapter, lesson).then(() => {
      window.location.reload();
    });
  };

  const onMoveDown = (lesson: Lesson) => {
    CoursesService.moveLessonDown(course.key, chapter, lesson).then(() => {
      window.location.reload();
    });
  };

  const columns: any[] = [
    {
      title: "Order",
      dataIndex: "lesson",
      key: "lesson",
      render: (_: any, record: Lesson) => {
        return (
          <Space size="middle">
            <Button
              style={Styles.Button.Outline}
              onClick={() => onMoveUp(record)}
            >
              <ArrowUpOutlined />
            </Button>
            <Button
              style={Styles.Button.Outline}
              onClick={() => onMoveDown(record)}
            >
              <ArrowDownOutlined />
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a: Lesson, b: Lesson) => (a.title < b.title ? -1 : 1),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (input: string, record: Lesson) =>
        record.title && record.title.toLowerCase() == input.toLowerCase(),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Actions",
      render: (_: any, record: Lesson) => {
        return (
          <Space size="middle">
            <Button
              style={Styles.Button.Outline}
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
            <Button
              style={Styles.Button.Outline}
              onClick={() => setLessonToRemove(record)}
            >
              Remove
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Table pagination={false} dataSource={lessons} columns={columns}></Table>
      {showCreateEditLesson.show && (
        <CreateEditLesson
          lesson={showCreateEditLesson.selectedLesson}
          onCancel={onClose}
        />
      )}
      {showCreateEditQuiz.show && <CreateEditQuiz onCancel={onClose} />}
      <Modal
        title="Remove Lesson"
        cancelButtonProps={{
          disabled: removing,
        }}
        okButtonProps={{
          disabled: removing,
        }}
        open={!!lessonToRemove}
        onOk={handleLessonRemove}
        onCancel={() => setLessonToRemove(undefined)}
        footer={[
          <Button
            size="large"
            style={Styles.Button.Outline}
            onClick={() => {
              setLessonToRemove(undefined);
            }}
          >
            No
          </Button>,
          <Button
            onClick={handleLessonRemove}
            size="large"
            style={Styles.Button.Outline}
          >
            Yes
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to remove the lesson {lessonToRemove?.title}
        </p>
      </Modal>
    </div>
  );
};

export default ({ params }: { params: { id: string } }) => {
  const [course, setCourse] = useState<Course>();
  const [columns, setColumns] = useState<any[]>();

  const { id } = params;

  const [showCreateLesson, setShowCreateLesson] = useState<
    Chapter | undefined
  >();
  const [showCreateQuiz, setShowCreateQuiz] = useState<Chapter | undefined>();

  const onAddLesson = (chapter: Chapter) => {
    setShowCreateLesson(chapter);
  };

  const onAddQuiz = (chapter: Chapter) => {
    setShowCreateQuiz(chapter);
  };

  const onRemoveChapter = (chapter: Chapter) => {};

  const onClose = () => {
    setShowCreateLesson(undefined);
    setShowCreateQuiz(undefined);
  };

  useEffect(() => {
    CoursesService.course(id).then((course) => {
      setCourse(course);

      console.log(course);
    });

    setColumns([
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        sorter: (a: Chapter, b: Chapter) => (a.title < b.title ? -1 : 1),
        filterMode: "tree",
        filterSearch: true,
        onFilter: (input: string, record: Lesson) =>
          record.title && record.title.toLowerCase() == input.toLowerCase(),
      },
      {
        title: "Lessons",
        render: (_: void, record: Chapter) => {
          return (
            <a>
              {record.lessons.length} Lesson
              {record.lessons.length == 1 ? "" : "s"}
            </a>
          );
        },
      },
      {
        title: "Actions",
        render: (_: any, record: Chapter) => {
          return (
            <Space size="middle">
              <Button
                style={Styles.Button.Outline}
                onClick={() => onAddLesson(record)}
              >
                Add Lesson
              </Button>
              <Button
                style={Styles.Button.Outline}
                onClick={() => onAddQuiz(record)}
              >
                Add Quiz
              </Button>
              {/* <Button onClick={() => onRemoveChapter(record)}>Remove</Button> */}
            </Space>
          );
        },
      },
    ]);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20, marginTop: 60 }}>
        Course - {course && course.title}
      </h2>
      {course && columns ? (
        <Table
          dataSource={course.chapters}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <Lessons course={course} chapter={record} />
            ),
            rowExpandable: () => true,
          }}
        />
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spin />
        </div>
      )}

      {showCreateLesson && (
        <CreateEditLesson
          course={course}
          chapter={showCreateLesson}
          onCancel={onClose}
        />
      )}

      {showCreateQuiz && (
        <CreateEditQuiz
          course={course}
          chapter={showCreateQuiz}
          onCancel={onClose}
        />
      )}

      {/* <Modal
          title="Remove Chapter"
          open={!!chapterToRemove}
          onOk={handleChapterRemove}
          onCancel={() => setLessonToRemove(undefined)}
        >
          <p>Are you sure you want to remove the lesson {lessonToRemove?.title}</p>
        </Modal> */}
    </div>
  );
};
