'use client'

import { LinkOutlined } from "@ant-design/icons"
import { Container, Typography } from "@mui/material"
import { Col, Grid, Modal, Row } from "antd"
import { useState } from "react"

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
    const [showMore, setShowMore] = useState<IProfile>()

    const onNav = () => {
        window.open(profile.githubLink, '_blank')
    }

    const viewAbout = (profile: IProfile) => {
        setShowMore(profile)
    }

    const handleOk = () => {
        setShowMore(undefined)
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
            <Typography mb={2} fontSize={'0.9em'} variant="body1" fontFamily={"PoppinsRegular"} height={73} overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'pre-wrap'}>{profile.description}</Typography>
            <div onClick={() => viewAbout(profile)} style={{
                color: '#82C803',
                cursor: 'pointer'
            }}>Read more</div>
            
            <div style={{marginTop: 10}}>
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


            <Modal
                title={showMore?.name}
                open={!!showMore}
                onCancel={handleOk}
                cancelText={undefined}
                okButtonProps={{ style: { display: "none" } }}
            >
                <p>{showMore?.description}</p>
            </Modal>
        </div>
    )
}

const Recruiters = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

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
            description: 'I am currently a trainee as a Mobile and Web developer specializing in React JS and React Native at mLab Southern Africa, where I also previously interned starting in June 2023. My role involves various aspects of web and mobile development, including technical documentation, user experience design, and SEO optimization. I have a strong skill set encompassing technologies like Webpack, Figma, REST APIs, and more. Prior to this, I worked part-time as a Full-stack Developer at TLOU TECHNOLOGIES from September 2020 to September 2021, focusing on both front-end and back-end development, API design, and cross-platform optimization. I hold a national certificate in IT systems development from Tlou Foundation College, which I completed in 2021, with expertise in web development, programming, and software development, and a certificate in office administration from Letaba TVET College, which I obtained in 2014.',
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/2.jpg',
        },
        {
            name: 'Serge Mthombeni',
            profilePicture: '/images/temp/profiles/3.JPG',
            description: `I am a highly skilled computer programmer proficient in both front-end and back-end coding, specializing in designing user interactions on websites, developing servers, and databases for website functionality, as well as coding for various mobile platforms. Currently serving as a React Software Developer trainee at mLab Southern Africa's CodeTribe Academy, I have honed my expertise in technologies like React.js, React Native, Node.js, Firebase, and Express.js. My professional journey includes a Systems Support Learnership at ProServ South Africa, where I showcased my application support, operating system support, and network support skills. With a strong educational foundation from Hoerskool Frans du Toit, I continue to explore and excel in diverse programming languages such as Python, Java, C, PHP, and C#. I recently participated in the Geekulcha 42 Hours Annual Hackathon, a pivotal event that expanded my perspective on the vast possibilities within the tech industry. Actively engaged in the tech community, I share insights on front-end and back-end development, software engineering, and personal branding with my 37 followers. I am deeply passionate about technology and innovation, constantly seeking new challenges and opportunities to contribute meaningfully to the digital landscape.`,
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/3.jpg',
        },
        {
            name: 'Temosho',
            profilePicture: '/images/temp/profiles/4.JPG',
            description: `I'm Temosho Shaku, a passionate and skilled Software Developer with expertise in web and mobile development. My tech stack includes React.js, React Native, Angular, Java, SQL, and Node.js. I'm dedicated to creating cutting-edge applications for seamless user experiences, with a track record of turning innovative concepts into functional software solutions. I hold a National Diploma in Information Technology from Tshwane University of Technology, where I specialized in C++ and SQL. I've also completed training in Angular and earned certifications in Agile Project Management with Microsoft Project and Microsoft Certified: Azure Developer Associate. My hands-on experience includes working as a React Software Developer Trainee at mLab Southern Africa, where I contributed to projects like the Voice Journal App and the Country App, building expertise in React Native, Node.js, Firebase, Scrum, MySQL, and Java. I'm excited to bring my skills to innovative software development projects and push the boundaries of technology.`,
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/4.jpg',
        },
        {
            name: 'Bongane Sithole',
            profilePicture: '/images/temp/profiles/5.JPG',
            description: `I'm Bongani Sithole, a Mobile and Web Developer based in Ebony Park Tembisa, South Africa, with a strong skill set and qualifications ready to thrive in the tech world. My expertise lies in Full Stack Development, proficiently handling both front-end and back-end technologies to create dynamic web applications. I'm known for my Agile mindset, adapting swiftly to new tech trends and methodologies, and my knack for solving complex problems efficiently while meeting tight deadlines. My educational background includes a Diploma in Information Technology from Tshwane University of Technology, where I gained skills in web design, responsive web design, project management, and software system analysis, utilizing tech skills like C++, PL/SQL, Linux, and HTML and CSS. I hold an OPSWAT File Security Associate Certification, attesting to my proficiency in Python and SQL. Fluent in English and with limited proficiency in Afrikaans. Currently, I am gaining hands-on experience as a React Software Developer Trainee at MLab Southern Africa, working on-site in South Africa, where I utilize JavaScript, Firebase, Nodejs, React Native, and React.js to further enhance my development skills. Let's connect and explore potential collaborations.`,
            githubLink: 'https://github.com/Tshikamisava',
            cover: '/images/temp/bgs/5.jpg',
        },
        {
            name: 'Sophakama',
            profilePicture: '/images/temp/profiles/6.JPG',
            description: 'Greetings! I am an enthusiastic junior web and mobile developer trainee, dedicated to continual learning and growth within the ever-evolving technology landscape. Currently focused on refining skills in React.js, React Native, JavaScript, and Node.js, I actively contribute to hands-on development at MLab Southern Africa. With a solid background in quality inspection and assurance, gained over seven years at Frigoglass South Africa, I implemented Total Quality Management (TQM) principles to optimize processes and enhance organizational performance. Armed with proficiency in JavaScript, Nodejs, ReactJs, Reactnative, Firebase, problem-solving, and effective team communication, I am committed to delivering innovative solutions in software development. Currently pursuing a BSc in Computer Science and Applied Mathematics at UNISA, I aim to bring a distinctive South African perspective to the global tech stage, contributing to the digital future one line of code at a time.',
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
                    paddingLeft: (screens.xs) ? 30 : 50,
                    borderRadius: 40,
                    backgroundColor: 'rgb(51,71,252)',
                    background: 'linear-gradient(90deg, rgba(51,71,252,1) 0%, rgba(87,167,255,1) 100%)',
                }}>
                    <Row>
                        <Col xs={{span: 24}} md={{span: 12}}>
                            <div style={{fontSize: '3em'}}>
                            <Typography
                color={'white'}
                variant={screens.md || screens.lg ? "h2" : "h3"}
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