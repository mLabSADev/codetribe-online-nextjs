import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Row, Col, Alert, Upload, Modal, Select } from 'antd'
import { AuthService } from '../services/auth-service';
import { PlusOutlined } from '@ant-design/icons';
import { CoursesService } from '../services/courses-service';
import Student from '../dtos/student';

const CreateEditStudent = ({ student, onCancel }: {
    student: Student | null | undefined
    onCancel: () => void
}) => {
    const [saving, setSaving] = useState(false)
    const [currentStudent, setStudent] = useState(student)
    const [errorMessage, setErrorMessage] = useState<string | null>()
    const [success, setSuccess] = useState<boolean>()

    const [fileList, setFileList] = useState([])

    const save = (student: Student) => {

        setSaving(true)
        setErrorMessage(null)

        return AuthService.createUser(student).then(() => {
            setSuccess(true)
            onCancel()
        }).catch(err => {
            setErrorMessage(err.message)
        }).finally(() => {
            setSaving(false)
        })
    
        
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
            zIndex: 10
        }}>
            <Row style={{ width: '100%' }}>
                <Col xs={0} sm={0} md={4} lg={6} />
                <Col xs={24} sm={24} md={16} lg={9} style={{ padding: 20 }}>
                    <div style={{ padding: 20, width: '100%', borderRadius: 15, background: 'white' }}>
                        <h2 style={{ textAlign: 'center' }}>Add Student</h2>
                        {/* <p style={{ textAlign: 'center' }}>Input your email address below. You will receive an email with further instructions</p> */}
                        <Form layout="vertical" initialValues={currentStudent ? currentStudent : undefined} onFinish={save}>
                            {errorMessage && <Alert message={errorMessage} type="error" style={{ marginBottom: 20 }} />}
                            {/* {success && <Alert message={'A password reset link has been sent to your email'} type="success" style={{ marginBottom: 20 }} />} */}
                            
                            {/* <Form.Item style={{}} label="First Name" name='firstname' rules={[
                                {
                                    required: true,
                                    message: 'First Name required'
                                }
                            ]}>
                                <Input placeholder="First Name" style={{
                                    height: 50,
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item>
                            <Form.Item style={{}} label="Last Name" name='lastname' rules={[
                                {
                                    required: true,
                                    message: 'Last Name required'
                                }
                            ]}>
                                <Input placeholder="Last Name" style={{
                                    height: 50,
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item> */}
                            <Form.Item style={{}} label="Email" name='email' rules={[
                                {
                                    required: true,
                                    message: 'Email required'
                                }
                            ]}>
                                <Input placeholder="Email" style={{
                                    height: 50,
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item>
                            <Form.Item required={true} style={{zIndex: 1000000000}} label="Group" name='location'>
                                <Select
                                    bordered={false}
                                    placeholder='Select a group'
                                    style={{
                                        // height: 50,
                                        borderRadius: 10,
                                        borderColor: 'rgb(143, 230, 76)',
                                        borderStyle: 'solid',
                                        padding: 10,
                                        paddingLeft: 0,
                                        paddingBottom: 10,
                                        borderWidth: 2
                                    }}
                                    options={[
                                        { value: 'tih', label: 'The Innovation Hub' },
                                        { value: 'Soweto', label: 'Soweto' },
                                        { value: 'Tembisa', label: 'Tembisa' },
                                        { value: 'Limpopo', label: 'Limpopo' },
                                        { value: 'Kimberley', label: 'Kimberley' },
                                        { value: 'KZN', label: 'KZN' },
                                        { value: 'Online', label: 'Online' },
                                    ]}
                                />
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

export default CreateEditStudent
