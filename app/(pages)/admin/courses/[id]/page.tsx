'use client'

import Chapter from '@/app/dtos/chapter';
import Course from '@/app/dtos/course';
import Lesson from '@/app/dtos/lesson';
import CreateEditLesson from '@/app/modals/create-edit-lesson';
import { CoursesService } from '@/app/services/courses-service';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Space, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react'

const Lessons = ({ course, chapter }: {
    course: Course
    chapter: Chapter
}) => {
    const [showCreateEditLesson, setShowCreateEditLesson] = useState<{
        show: boolean
        selectedLesson?: Lesson | null | undefined
    }>({
        show: false,
        selectedLesson: null
    })
    const [lessonToRemove, setLessonToRemove] = useState<Lesson>()

    const onEdit = (lesson: Lesson) => {
        setShowCreateEditLesson({
            show: true,
            selectedLesson: lesson
        })
    }

    const onClose = () => {
        setShowCreateEditLesson({
            show: false
        })
    }

    const handleLessonRemove = () => {
        // remove lesson
        CoursesService.removeLesson(course.key, chapter, lessonToRemove!).then(() => {
            console.log('Removed');
            
        })
    }

    const onMoveUp = (lesson: Lesson) => {
        CoursesService.moveLessonUp(course.key, chapter, lesson).then(() => {
            window.location.reload()
        })
        
    }

    const onMoveDown = (lesson: Lesson) => {
        CoursesService.moveLessonDown(course.key, chapter, lesson).then(() => {
            window.location.reload()
        })
        
    }

    const columns: any[] = [
        {
            title: 'Order',
            dataIndex: 'lesson',
            key: 'lesson',
            render: (_: any, record: Lesson) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => onMoveUp(record)}><ArrowUpOutlined /></Button>
                        <Button onClick={() => onMoveDown(record)}><ArrowDownOutlined /></Button>
                    </Space>
                )
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a: Lesson, b: Lesson) => a.title < b.title ? -1 : 1,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (input: string, record: Lesson) => record.title && record.title.toLowerCase() == input.toLowerCase()
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration'
        },
        {
            title: 'Actions',
            render: (_: any, record: Lesson) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => onEdit(record)}>Edit</Button>
                        <Button onClick={() => setLessonToRemove(record)}>Remove</Button>
                    </Space>
                    
                    
                )
            },
        }
    ]
    
    return (
        <div>
            <Table dataSource={chapter.lessons} columns={columns}>

            </Table>
            {showCreateEditLesson.show && <CreateEditLesson lesson={showCreateEditLesson.selectedLesson} onCancel={onClose} />}
            <Modal
          title="Remove Lesson"
          open={!!lessonToRemove}
          onOk={handleLessonRemove}
          onCancel={() => setLessonToRemove(undefined)}
        >
          <p>Are you sure you want to remove the lesson {lessonToRemove?.title}</p>
        </Modal>
        </div>
    )
}

export default ({ params }: {
    params: { id: string }
}) => {
    const [course, setCourse] = useState<Course>()
    const [columns, setColumns] = useState<any[]>()
    
    const { id } = params

    const [showCreateLesson, setShowCreateLesson] = useState<Chapter | undefined>()

    const onAddLesson = (chapter: Chapter) => {
        setShowCreateLesson(chapter)
    }

    const onAddQuiz = (chapter: Chapter) => {

    }

    const onRemoveChapter = (chapter: Chapter) => {

    }

    const onClose = () => {
        setShowCreateLesson(undefined)
    }

    

    useEffect(() => {
        CoursesService.course(id).then(course => {
            setCourse(course)

            console.log(course)
        })

        setColumns([
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
                sorter: (a: Chapter, b: Chapter) => a.title < b.title ? -1 : 1,
                filterMode: 'tree',
                filterSearch: true,
                onFilter: (input: string, record: Lesson) => record.title && record.title.toLowerCase() == input.toLowerCase()
            },
            {
                title: 'Lessons',
                render: (_: void, record: Chapter) => {
                    return <a>{record.lessons.length} Lesson{record.lessons.length == 1 ? '' : 's'}</a>
                },
            },
            {
                title: 'Actions',
                render: (_: any, record: Chapter) => {
                    return (
                        <Space size="middle">
                            <Button onClick={() => onAddLesson(record)}>Add Lesson</Button>
                            <Button onClick={() => onAddQuiz(record)}>Add Quiz</Button>
                            {/* <Button onClick={() => onRemoveChapter(record)}>Remove</Button> */}
                        </Space>
                        
                        
                    )
                },
            }])
    }, [])

    return (
        <div>
            <h2 style={{marginBottom: 20, marginTop: 60}}>Course - {course && course.title}</h2>
                {course && columns ? <Table dataSource={course.chapters} columns={columns} expandable={{
                    expandedRowRender: record => <Lessons course={course} chapter={record} />,
                    rowExpandable: () => true
                }} /> : <div style={{display: 'flex', justifyContent: 'center'}}><Spin /></div>}

        {showCreateLesson && <CreateEditLesson course={course} chapter={showCreateLesson} onCancel={onClose} />}

        {/* <Modal
          title="Remove Chapter"
          open={!!chapterToRemove}
          onOk={handleChapterRemove}
          onCancel={() => setLessonToRemove(undefined)}
        >
          <p>Are you sure you want to remove the lesson {lessonToRemove?.title}</p>
        </Modal> */}
        
        </div>
    )
}