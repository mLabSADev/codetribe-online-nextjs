'use client'

import React from 'react'
import { Row, Col, Divider, Button } from 'antd'
import { HeartFilled, FacebookFilled, TwitterCircleFilled } from '@ant-design/icons'
import Link from 'next/link'

const Footer = () => {
    const alignmentStyle: any = {
        parent: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            paddingBottom: 20
        },
        child: {
            width: 150
        }
    }

    return (
        <div>
            <Row>
                <Col xs={16} sm={12} lg={8}>
                    <div style={alignmentStyle.parent}>
                        <div style={alignmentStyle.child}>
                            <h2 style={{color: 'white'}}>Menu</h2>
                            <Link className='footer-links' href='/' style={{color: 'white'}}>Home</Link>
                            <Link className='footer-links' href='/home' style={{color: 'white'}}>Lessons</Link>
                            {/* <Link className='footer-links' href='/blog' style={{color: 'white'}}>Blog</Link> */}
                            {/* <Link className='footer-links' href='/templates' style={{color: 'white'}}>Templates</Link> */}
                            <Link className='footer-links' href='/contact' style={{color: 'white'}}>Contact</Link>
                        </div>
                    </div>
                </Col>
                <Col xs={16} sm={12} lg={8}>
                    <div style={alignmentStyle.parent}>
                        <div style={alignmentStyle.child}>
                            <h2 style={{color: 'white'}}>Legal Stuff</h2>
                            <Link className='footer-links' href='/terms-of-use' style={{color: 'white'}}>Terms of Use</Link>
                            <Link className='footer-links' href='/privacy-policy' style={{color: 'white'}}>Privacy Policy</Link>
                        </div>
                    </div>
                </Col>
                <Col xs={16} sm={12} lg={8}>
                    <div style={alignmentStyle.parent}>
                        <div style={alignmentStyle.child}>
                            <h2 style={{color: 'white'}}>Follow Us</h2>
                            <Button style={{background: '#3369ad', border: 'none', marginRight: 10}} size='large' shape='circle' icon={<FacebookFilled style={{color: 'white'}} />}></Button>
                            <Button style={{background: '#00a4ed', border: 'none'}} size='large' shape='circle' icon={<TwitterCircleFilled style={{color: 'white'}} />}></Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Divider />
            <p id='copyright'>Made with <HeartFilled style={{color: 'red'}} /> by <span style={{color: '#97CA42'}}>mLab</span><br />&copy; CodeTribe 2020</p>
        </div>
    )
}

export default Footer