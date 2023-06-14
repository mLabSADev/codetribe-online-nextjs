import React, { useState } from 'react'
import { Form, Input, Button, Row, Col, Alert, RowProps } from 'antd'
import { AuthService } from '../services/auth-service';

interface IEditProfile {
    email?: string
    onCancel: () => void
}

const EditProfile = ({ email, onCancel }: IEditProfile) => {
    const [resettingPassword, setResettingPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [success, setSuccess] = useState()

    const editProfile = ({ email }: { email: string}) => {
        setResettingPassword(true)

        // return AuthService.editProfile(email).then(() => {
        //     setSuccess(true)
        // }).catch(err => {
        //     setErrorMessage(err.message)
        // }).finally(() => {
        //     setResettingPassword(false)
        // })
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
                        <h2 style={{ textAlign: 'center' }}>Update Profile</h2>
                        {/* <p style={{ textAlign: 'center' }}>Input your email address below. You will receive an email with further instructions</p> */}
                        <Form layout="vertical" initialValues={{ email: email ? email : '' }} onFinish={editProfile}>
                            {errorMessage && <Alert message={errorMessage} type="error" style={{ marginBottom: 20 }} />}
                            {success && <Alert message={'A password reset link has been sent to your email'} type="success" style={{ marginBottom: 20 }} />}
                            <Form.Item style={{}} label="Email" name='email' rules={[
                                {
                                    required: true,
                                    message: 'Your email address is required'
                                }
                            ]}>
                                <Input placeholder="Email Address" style={{
                                    height: 50,
                                    borderRadius: 10,
                                    borderColor: 'rgb(143, 230, 76)',
                                    borderStyle: 'solid',
                                    padding: 10,
                                    borderWidth: 2
                                }} />
                            </Form.Item>
                            <Button size='large' loading={resettingPassword} disabled={resettingPassword} htmlType='submit' style={{
                                background: 'rgb(143, 230, 76)',
                                borderStyle: 'none',
                                borderRadius: 28,
                                color: 'white',
                                cursor: 'pointer',
                                width: '100%'
                            }}>Save</Button>
                            <button type='button' disabled={resettingPassword} onClick={onCancel} style={{
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

export default EditProfile
