import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Row, Col, Alert, Upload, Modal } from 'antd'
import { AuthService } from '../services/auth-service';
import { PlusOutlined } from '@ant-design/icons';
import { CoursesService } from '../services/courses-service';
import Lesson from '../dtos/lesson';
import Chapter from '../dtos/chapter';
import Course from '../dtos/course';

const CreateEditLesson = ({ lesson, onCancel, chapter, course }: {
    lesson?: Lesson | null | undefined
    chapter?: Chapter | null | undefined
    course?: Course
    onCancel: () => void
}) => {
    const [saving, setSaving] = useState(false)
    const [currentLesson, setLesson] = useState(lesson)
    const [errorMessage, setErrorMessage] = useState<string | null>()
    const [success, setSuccess] = useState()

    const [fileList, setFileList] = useState([])

    const save = (lessonToSave: Lesson) => {

        // if (fileList.length > 0) {
        //     setSaving(true)
        //     setErrorMessage(null)

            // return CoursesService.saveCourse({
            //     ...lesson,
            //     key: currentCourse ? currentCourse.key : undefined
            // }).then(() => {
            //     setSuccess(true)
            //     onCancel()
            // }).catch(err => {
            //     setErrorMessage(err.message)
            // }).finally(() => {
            //     setSaving(false)
            // })
        // }
        
        if (lesson) {

        } else {
            console.log(chapter);
            console.log(lessonToSave);
            
            setSaving(true)
            setErrorMessage(null)

            return CoursesService.saveLesson(course!.key, chapter!, lessonToSave).then(() => {
                setSaving(false)
            }).catch(err => {
                setErrorMessage(err.message)
            })
        }
    }

    return (
        <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        }}>
            <Row style={{ width: '100%' }}>
                <Col xs={0} sm={0} md={4} lg={6} />
                <Col xs={24} sm={24} md={16} lg={9} style={{ padding: 20 }}>
                    <div style={{ padding: 20, width: '100%', borderRadius: 15, background: 'white' }}>
                        <h2 style={{ textAlign: 'center' }}>Save Lesson</h2>
                        {/* <p style={{ textAlign: 'center' }}>Input your email address below. You will receive an email with further instructions</p> */}
                        <Form layout="vertical" initialValues={currentLesson ? currentLesson : undefined} onFinish={save}>
                            {errorMessage && <Alert message={errorMessage} type="error" style={{ marginBottom: 20 }} />}
                            {/* {success && <Alert message={'A password reset link has been sent to your email'} type="success" style={{ marginBottom: 20 }} />} */}
                            
                            <Form.Item style={{}} label="Title" name='title' rules={[
                                {
                                    required: true,
                                    message: 'The title is required'
                                }
                            ]}>
                                <Input placeholder="Title" style={{
                                    height: 50,
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item>
                            <Form.Item style={{}} label="Video URL" name='videoUrl' rules={[
                                {
                                    required: true,
                                    message: 'Video URL required'
                                }
                            ]}>
                                <Input placeholder="Video URL" style={{
                                    height: 50,
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item>
                            <Button size='large' loading={saving} disabled={saving} htmlType='submit' style={{
                                background: 'rgb(143, 230, 76)',
                                borderStyle: 'none',
                                borderRadius: 28,
                                color: 'white',
                                cursor: 'pointer',
                                width: '100%'
                            }}>Save</Button>
                            <button type='button' disabled={saving} onClick={onCancel} style={{
                                background: 'rgba(61, 61, 61, 0.05)',
                                borderStyle: 'none',
                                padding: 10,
                                borderRadius: 28,
                                color: 'rgb(61, 61, 61)',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: 10
                            }}>Cancel</button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export const showProfile = () => {

}

export default CreateEditLesson
