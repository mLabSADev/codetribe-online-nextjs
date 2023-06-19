'use client'

import Chapter from '@/app/dtos/chapter';
import Course from '@/app/dtos/course';
import Lesson from '@/app/dtos/lesson';
import CreateEditLesson from '@/app/modals/create-edit-lesson';
import { CoursesService } from '@/app/services/courses-service';
import { Button, Col, Row, Space, Spin, Table } from 'antd';
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

    const columns: any[] = [
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
                        <a onClick={() => onEdit(record)}>Edit</a>
                        <a>Remove</a>
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
        </div>
    )
}

export default ({ params }: {
    params: { id: string }
}) => {
    const [course, setCourse] = useState<Course>()
    const [columns, setColumns] = useState<any[]>()
    const { id } = params

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
                sorter: (a: Lesson, b: Lesson) => a.title < b.title ? -1 : 1,
                filterMode: 'tree',
                filterSearch: true,
                onFilter: (input: string, record: Lesson) => record.title && record.title.toLowerCase() == input.toLowerCase()
            },
            {
                title: 'Lessons',
                render: (_: void, record: Chapter) => {
                    return <a>{record.lessons.length} Lesson{record.lessons.length == 1 ? '' : 's'}</a>
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
        </div>
    )
}