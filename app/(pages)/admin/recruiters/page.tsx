'use client'

import { LinkOutlined } from "@ant-design/icons"
import { Container, Typography } from "@mui/material"
import { Col, Row } from "antd"

interface IProfile {
    cover: string
    profilePicture: string
    name: string
    description: string
    githubLink: string
}

const Profile = ({
    profile
}: { profile: IProfile }) => {
    const onNav = () => {
        window.open(profile.githubLink, '_blank')
    }

    return (
        <div style={{ borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 2, borderStyle: 'solid', borderColor: '#F4F4F4' }}>
            <img src={profile.cover} style={{
                height: 150,
                width: '100%',
                objectFit: 'cover'
            }} />
            <div style={{
                marginTop: -50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    overflow: 'hidden',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <img src={profile.profilePicture} style={{
                    objectFit: 'cover',
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                }} />
                </div>
            </div>
            
            <div style={{
                padding: 20
            }}>
            <Typography fontSize={'1.3em'} mb={2} variant="body2" fontFamily={"Poppins"}>{profile.name}</Typography>
            <Typography mb={2} fontSize={'0.9em'} variant="body1" fontFamily={"PoppinsRegular"}>{profile.description}</Typography>
            
            <button style={{
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 15,
                height: 40,
                background: '#F4F4F4',
                border: 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            }} onClick={onNav}>
                <Typography ml={1} fontSize={'0.9em'} variant="body1" fontFamily={"PoppinsRegular"}>view site</Typography>
                <div style={{flex: 1}} />
                <LinkOutlined style={{marginRight: 10, color: '#82C803'}} />
            </button>
            </div>
        </div>
    )
}

const Recruiters = () => {
    const profiles: IProfile[] = [
        {
            name: 'Lucky Hlongwane',
            profilePicture: '/images/temp/profiles/1.JPG',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/1.jpg',
        },
        {
            name: 'Shitlhangu Sithole',
            profilePicture: '/images/temp/profiles/2.JPG',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/2.jpg',
        },
        {
            name: 'Serge Mthombeni',
            profilePicture: '/images/temp/profiles/3.JPG',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/3.jpg',
        },
        {
            name: 'Temosho',
            profilePicture: '/images/temp/profiles/4.JPG',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/4.jpg',
        },
        {
            name: 'Bongane Sithole',
            profilePicture: '/images/temp/profiles/5.JPG',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/5.jpg',
        },
        {
            name: 'Sophakama',
            profilePicture: '/images/temp/profiles/6.JPG',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/6.jpg',
        },
        {
            name: 'Lucky Cungwa',
            profilePicture: '/images/temp/profiles/7.JPG',
            description: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/7.jpg',
        }
    ]

    return (
        <Container style={{
            marginTop: 60
        }}>
            <Row>
                <Col span={24}>
                    <div style={{
                    padding: 30,
                    paddingLeft: 50,
                    borderRadius: 40,
                    backgroundColor: 'rgb(51,71,252)',
                    background: 'linear-gradient(90deg, rgba(51,71,252,1) 0%, rgba(87,167,255,1) 100%)',
                }}>
                    <Row>
                        <Col xs={{span: 24}} md={{span: 12}}>
                            <div style={{fontSize: '3em'}}>
                            <Typography
                color={'white'}
                variant={"h2"}
                fontFamily={"K2D"}
              >Meet our<br /> Code<span style={{color: '#61FF61'}}>Tribers</span></Typography></div>
                            <div style={{marginTop: 10}}>
                            <Typography 
                                variant="body2"
                                fontFamily={"Poppins"}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Typography>
                            </div>
                        </Col>
                        <Col span={12}></Col>
                    </Row>
                </div>
                </Col>
            </Row>
            
            <Typography mt={2} mb={2} fontSize={'1.5em'} variant="body2" fontFamily={"Poppins"}>Triber Profile</Typography>

            <Row gutter={16}>
                {profiles.map((profile, index) => {
                    return (
                        <Col className="gutter-row" key={`profile-${index}`} xs={{span: 24}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}}>
                            <Profile profile={profile}></Profile>
                        </Col>
                    )
                })}
            </Row>
        </Container>
    )
}

export default Recruiters