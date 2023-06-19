"use client";
import { Button, Col, Row, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { LessonService } from "@/app/services/lesson-service";
import Student from "@/app/dtos/student";
import { StudentsService } from "@/app/services/students-service";
import CreateEditStudent from "@/app/modals/create-edit-student";

const lessonNames = {
  react: "ReactJS",
  ionic: "Ionic",
  "react-native": "React Native",
  nodejs: "nodejs",
  angular: "angular",
};

// const ProgressCard = ({progress, data}: { progress: any, data: any}) => {
//     const position = progress.lesson
//     const lessons = data.allMarkdownRemark.edges.map(edge => {
//         return edge.node
//     }).filter(lesson => lesson.fields.tutorial === progress.tutorial)
//     let durationCount = 0
//     let totalCount = 0
//     let currentLesson
//     let currentChapter

//     for (let lesson of lessons) {
//         const [min, sec] = lesson.frontmatter.duration.split(':')

//         totalCount += (parseInt(min) * 60) + parseInt(sec)

//         if (lesson.frontmatter.chapter < position.chapter) {
//             // setTotalDurationUntilCurrentLesson(totalDurationUntilCurrentLesson + (parseInt(min) * 60) + parseInt(sec))
//             durationCount += (parseInt(min) * 60) + parseInt(sec)
//         } else if (lesson.frontmatter.chapter == position.chapter && lesson.frontmatter.lesson < position.lesson) {
//             // setTotalDurationUntilCurrentLesson(totalDurationUntilCurrentLesson + (parseInt(min) * 60) + parseInt(sec))
//             durationCount += (parseInt(min) * 60) + parseInt(sec)
//         }

//         if (lesson.frontmatter.chapter == position.chapter) {
//             currentChapter = lesson.frontmatter.title
//         }
//         if (lesson.frontmatter.chapter == position.chapter && lesson.frontmatter.lesson == position.lesson) {
//             currentLesson = lesson.frontmatter.title
//         }
//     }

//     const progressPercentage = Math.round(durationCount / totalCount * 100)

//     return (
//         <div style={{
//             padding: 20,
//             background: 'white',
//             margin: 10,
//             borderRadius: 10,
//             borderColor: '#dfdfdf',
//             borderWidth: 1,
//             borderStyle: 'solid'
//         }}>
//             {lessonNames[progress.tutorial]}
//             <div style={{background: '#cfcfcf', flex: 1, height: 5}}>
//                 <div style={{background: '#97CA42', width: `${progressPercentage}%`, height: 5}} />
//             </div>
//             <div style={{marginBottom: 10}}>{isNaN(progressPercentage) ? '-' : progressPercentage}%</div>

//             Currently working on:
//             <div style={{fontWeight: 'bold', fontSize: 12, marginTop: 10}}>{currentChapter}</div><div style={{fontSize: 12}}>{currentLesson}</div>

//             <div style={{marginTop: 10, fontSize: '0.8em'}}><Link to='/student-quiz'>View quiz result</Link></div>
//         </div>
//     )
// }

const StudentInfo = ({ student }: { student: Student }) => {
  const [progress, setProgress] = useState<any>(null);
  const tutorials = ["react", "react-native", "ionic"];

  useEffect(() => {
    const promises = tutorials.map((tutorial) => {
      return LessonService.currentLessonPositionForStudent(
        student.key,
        tutorial
      ).then((lesson) => {
        return {
          tutorial,
          lesson,
        };
      });
    });

    Promise.all(promises).then((result) => {
      console.log(result);
      setProgress(result);
    });
  });

  return (
    <div>
      <h3>{student.firstname}'s Progress</h3>
      {/* <div style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <Row>
                    {progress ? progress.map(lesson => {
                        return (
                            <Col xs={24} sm={24} md={12} lg={8}><ProgressCard student={student} progress={lesson} data={data} /></Col>
                        )
                    }) : <Spin />}
                </Row>
            </div> */}
    </div>
  );
};

export default () => {
  const [students, setStudents] = useState<Student[]>();
  const [columns, setColumns] = useState<any[]>();
  const [showCreateEditStudent, setShowCreateEditStudent] = useState<{
    show: boolean;
    selectedStudent?: Student | null | undefined;
  }>({
    show: false,
    selectedStudent: null,
  });

  useEffect(() => {
    StudentsService.students().then(({ students, groups }) => {
      setColumns([
        {
          title: "First Name",
          dataIndex: "firstname",
          key: "firstname",
          sorter: (a: Student, b: Student) =>
            a.firstname < b.firstname ? -1 : 1,
          filterMode: "tree",
          filterSearch: true,
          onFilter: (input: string, record: Student) =>
            record.firstname &&
            record.firstname.toLowerCase() == input.toLowerCase(),
        },
        {
          title: "Last Name",
          dataIndex: "lastname",
          key: "lastname",
        },
        {
          title: "Email Address",
          dataIndex: "email",
          key: "email",
        },
        // {
        //   title: "Phone",
        //   dataIndex: "phone",
        //   key: "phone",
        // },
        {
          title: "Year",
          dataIndex: "year",
          key: "year",
          filters: [{text: '2022', value: '2022'}, {text: '2023', value: '2023'}],
          onFilter: (value: string, record: Student) =>
            record.year && record.year == value,
        },
        {
          title: "Location",
          dataIndex: "location",
          key: "location",
          filterMode: "tree",
          filterSearch: true,
          filters: groups.map((filter: any) => ({text: filter, value: filter})),
          onFilter: (value: string, record: Student) =>
            record.location && record.location.startsWith(value),
        },
      ]);

      setStudents(students);
    });
  }, []);

  const onClose = () => {
    setShowCreateEditStudent({
      show: false,
    });
  };

  const onAddStudent = () => {
    setShowCreateEditStudent({
      show: true,
    });
  };

  return (
    <div>
      {showCreateEditStudent.show && (
        <CreateEditStudent
          student={showCreateEditStudent.selectedStudent}
          onCancel={onClose}
        />
      )}
      <Space style={{ marginBottom: 20, marginTop: 60 }} size={"middle"}>
        <h2 style={{ marginTop: 10 }}>Students</h2>
        <Button onClick={onAddStudent}>Add Student</Button>
        <Button>Add Bulk Students</Button>
      </Space>
      {students && columns ? (
        <Table
          dataSource={students}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{<StudentInfo student={record} />}</p>
            ),
            rowExpandable: () => true,
          }}
        />
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spin />
        </div>
      )}
    </div>
  );
};
