"use client";

import { Button, Col, Row, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { CoursesService } from "@/app/services/courses-service";
import Course from "@/app/dtos/course";
import Link from "next/link";
import CreateEditCourse from "@/app/modals/create-edit-course";
import { Styles } from "@/app/services/styles";
import {Typography} from "@mui/material";

export default () => {
  const [courses, setCourses] = useState<Course[] | null>();
  const [columns, setColumns] = useState<any>();
  const [showCreateEditCourse, setShowCreateEditCourse] = useState<{
    show: boolean;
    selectedCourse?: Course | null | undefined;
  }>({
    show: false,
    selectedCourse: null,
  });

  useEffect(() => {
    CoursesService.courses().then((courses) => {
      setCourses(courses);
    });

    setColumns([
      {
        title: "Image",
        key: "imageUrl",
        render: (_: any, record: Course) => {
          return (
            <img
              src={record.imageUrl}
              alt={record.title}
              style={{
                width: 150,
              }}
            />
          );
        },
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        sorter: (a: Course, b: Course) => (a.title < b.title ? -1 : 1),
        filterMode: "tree",
        filterSearch: true,
        onFilter: (input: string, record: Course) =>
          record.title && record.title.toLowerCase() == input.toLowerCase(),
      },
      {
        title: "Description",
        dataIndex: "excerpt",
        key: "excerpt",
      },
      {
        title: "Author",
        dataIndex: "author",
        key: "author",
      },
      {
        title: "Action",
        key: "action",
        render: (_: string, record: Course) => (
          <Space size="middle">
            <Link href={`/admin/courses/${record.key}`}>View</Link>
            <a
              onClick={() =>
                setShowCreateEditCourse({
                  show: true,
                  selectedCourse: record,
                })
              }
            >
              Edit
            </a>
            <a>Remove</a>
          </Space>
        ),
      },
    ]);
  }, []);

  const onClose = () => {
    setShowCreateEditCourse({
      show: false,
      selectedCourse: null,
    });

    setCourses(null);
    CoursesService.courses().then((courses) => {
      setCourses(courses);
    });
  };

  return (
    <div>
      <div>
        {showCreateEditCourse.show && (
          <CreateEditCourse
            course={showCreateEditCourse.selectedCourse}
            onCancel={onClose}
          />
        )}
        <Space
          size={"middle"}
          style={{
            alignItems: "center",
            marginTop: 60,
            marginBottom: 20,
          }}
        >
          <Typography variant="h5">Courses</Typography>
          <Button
            style={Styles.Button.Outline}
            onClick={() => {
              setShowCreateEditCourse({
                show: true,
              });
            }}
          >
            Add Course
          </Button>
        </Space>
        {courses && columns ? (
          <Table dataSource={courses} columns={columns} />
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin />
          </div>
        )}
      </div>
    </div>
  );
};
