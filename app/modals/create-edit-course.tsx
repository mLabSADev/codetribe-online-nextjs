import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Row, Col, Alert, Upload, Modal } from 'antd'
import { AuthService } from '../services/auth-service';
import { PlusOutlined } from '@ant-design/icons';
import { CoursesService } from '../services/courses-service';
import Course from '../dtos/course';

const CreateEditCourse = ({ course, onCancel }: {
    course: Course | null | undefined,
    onCancel: () => void
}) => {
    const [saving, setSaving] = useState(false)
    const [currentCourse, setCourse] = useState(course)
    const [errorMessage, setErrorMessage] = useState<string | null>()
    const [success, setSuccess] = useState<boolean>()
    const [currentFile, setCurrentFile] = useState<any>()

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState<any[]>([])

    const save = (course: any) => {

        if (fileList.length > 0) {
            setSaving(true)
            setErrorMessage(null)

            return CoursesService.saveCourse({
                ...course,
                key: currentCourse ? currentCourse.key : undefined,
                imageUrl: currentCourse ? currentCourse.imageUrl : undefined,
            }, currentFile).then(() => {
                setSuccess(true)
                onCancel()
            }).catch(err => {
                setErrorMessage(err.message)
            }).finally(() => {
                setSaving(false)
            })
        }
        
    }

    useEffect(() => {
        if (course) {
            setFileList([{
                url: course.imageUrl
            }])
        }
    }, [course])

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
      };

    const onFinish = () => {

    }

    const onUploadChange = (newFileList: any) => {
        setCurrentFile(newFileList.file)
        setFileList(newFileList.fileList);
    }

    const getBase64 = (file: any) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );

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
                        <h2 style={{ textAlign: 'center' }}>Save Course</h2>
                        {/* <p style={{ textAlign: 'center' }}>Input your email address below. You will receive an email with further instructions</p> */}
                        <Form layout="vertical" initialValues={currentCourse ? currentCourse : undefined} onFinish={save}>
                            {errorMessage && <Alert message={errorMessage} type="error" style={{ marginBottom: 20 }} />}
                            {/* {success && <Alert message={'A password reset link has been sent to your email'} type="success" style={{ marginBottom: 20 }} />} */}
                            
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={onUploadChange}
                                multiple={false}
                                beforeUpload={file => {
                                    setFileList([file])
                                    return false
                                }}
                                style={{
                                    width: '100%',
                                    height: 150
                                }}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                                
                            </Upload> 
                            <Modal zIndex={10000000} open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                            
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
                            <Form.Item style={{}} label="Author" name='author' rules={[
                                {
                                    required: true,
                                    message: 'Author is required'
                                }
                            ]}>
                                <Input placeholder="Author" style={{
                                    height: 50,
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item>
                            <Form.Item style={{}} label="Description" name='excerpt' rules={[
                                {
                                    required: true,
                                    message: 'Description is required'
                                }
                            ]}>
                                <Input.TextArea rows={4} placeholder="Description" style={{
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item>
                            <Form.Item style={{}} label="Course Outline (Separated by line break)" name='outline' rules={[
                                {
                                    required: true,
                                    message: 'Outline is required'
                                }
                            ]}>
                                <Input.TextArea rows={4} placeholder="Outline" style={{
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

export default CreateEditCourse
