"use client";
import { Stack, Typography, Slide, IconButton, Button, Container, Avatar, Chip, Card, CardContent, Backdrop, AppBar, Toolbar, Drawer, Box } from "@mui/material";
import { Form, Image, Input, Modal, Button as ANTButton, Select, Upload, Divider, Tooltip, Spin, message, Space } from "antd";
import { Remove, Facebook, LinkedIn, WhatsApp, GitHub, LinkRounded, OpenInBrowser, ArrowBack, Close, Add, RemoveCircle } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AuthService } from "@/app/services/auth-service";
import { useRouter } from "next/navigation";
import type { RcFile, UploadProps } from 'antd/es/upload';
import { PlusOutlined, QuestionCircleFilled, FileImageOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProfileService } from "@/app/services/profile-service";
import { Formik } from "formik";
import FormItem from "antd/es/form/FormItem";
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import { FileService } from "@/app/services/file-service";
import firebase from "firebase";
import { object } from "yup";
import { CoursesService } from "@/app/services/courses-service";
import Course from "@/app/dtos/course";

const storageRef = firebase.storage().ref()
const socialOptions = ['linkedin', 'facebook', 'github', 'whatsapp']

const { Option } = Select;
const { Dragger } = Upload;
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
const GetSocialsIcon = ({ social }: { social: string }) => {

  switch (social) {
    case 'linkedin':
      return <LinkedIn />
      break;
    case 'facebook':
      return <Facebook />
      break;
    case 'github':
      return <GitHub />
      break;
    case 'whatsapp':
      return <WhatsApp />
      break;
  }
}
const ProjectCard = ({ openDetails }: { openDetails: Function }) => {
  return (
    <Stack sx={{ width: { xs: '100%', sm: '100%', md: 100, lg: 300 } }} borderRadius={3} overflow={'hidden'}>
      <Stack sx={{ width: "100%", height: 200 }} position={'relative'}>
        <img width={'100%'} height={"100%"} style={{ objectFit: 'cover' }} src="https://plus.unsplash.com/premium_photo-1692196626076-08b7c0d2ca09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80" alt="bg" />
        <Box position={"absolute"} bottom={10} right={10}>
          <Avatar sx={{ width: 50, height: 50 }}>KM</Avatar>
        </Box>
      </Stack>
      <Stack p={2} spacing={2}>
        <Button variant="text" sx={{ textAlign: 'start', textDecoration: 'none' }} onClick={() => { openDetails() }}>
          <Typography color={'black'} variant="h5">Internets schwiftiest</Typography>
        </Button>
        <Typography variant="body1">Dont look at me! That guy over there roped me into this. My man! You ask alotta questions Morty, not very charismatic of you.</Typography>
        <Stack direction={{ sx: 'column', sm: 'column', md: 'row' }}>
          <Chip component={'a'} href="#" target="_blank" icon={<OpenInBrowser />} label="Open Project"></Chip>
        </Stack>
      </Stack>
      <Stack alignItems={'center'} direction={'row'} justifyContent={'center'} spacing={1}>
        <IconButton><GitHub /></IconButton>
      </Stack>
    </Stack>
  )
}
const ProjectDetails = ({ openState, toggleDetails }: { openState: boolean, toggleDetails: Function }) => {

  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openState}
      onClick={() => toggleDetails()}>
      <Stack direction={{ sm: 'column', md: 'row' }} sx={{ color: 'black', overflowX: 'hidden', overflowY: 'auto' }} maxWidth={'90%'} minWidth={'90%'} bgcolor={'white'} borderRadius={3} >

        <Stack p={2}>
          <Stack direction={{ xs: 'row', sm: 'column', md: 'column' }}>
            <IconButton><Facebook /></IconButton>
            <IconButton><WhatsApp /></IconButton>
            <IconButton><LinkedIn /></IconButton>
            <IconButton><GitHub /></IconButton>
          </Stack>
        </Stack>
        <Stack width={'100%'} flex={1} >
          <Stack p={4} direction={'row'} alignItems={'center'} spacing={2}>
            <Avatar src="https://plus.unsplash.com/premium_photo-1691591182467-b5ffdf32c1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt=""></Avatar>
            <Typography variant="h3">Project Name</Typography>
          </Stack>
          <Stack width={'100%'} flex={1} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Stack  >
              <Stack width={400} height={400}>
                <Image style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://cdn.dribbble.com/userupload/9451533/file/original-9364347c1a5802dec0c4e117727faf08.png?resize=1024x768" alt="bg" />
              </Stack>
            </Stack>
            <Stack p={2} spacing={2}>
              <Typography variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id felis pellentesque, tincidunt tellus sed, pretium nunc. Donec a feugiat lectus. Pellentesque consectetur purus eleifend ornare iaculis. Praesent non viverra enim. Fusce tincidunt, turpis sit amet pellentesque tempor, lectus lectus cursus ex, sed sollicitudin ex nisl quis odio. Sed facilisis dolor dui, nec malesuada sem vestibulum sed. Vivamus bibendum nibh sit amet ligula sollicitudin finibus. Morbi ipsum ante, dignissim vel lobortis vel, elementum aliquam elit. Quisque est tortor, euismod nec enim eu, semper tempor neque. Nam sem elit, porta eget fermentum id, ultricies id justo. Curabitur non mauris massa. Pellentesque volutpat varius est, ultrices pretium lacus iaculis ut.
              </Typography>
              <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
                <Chip sx={{ alignSelf: 'start' }} label="Mobile Development" />
                <Chip sx={{ alignSelf: 'start' }} label="NodeJs" />
                <Chip sx={{ alignSelf: 'start' }} label="Firebase" />
                <Chip sx={{ alignSelf: 'start' }} label="Android" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Backdrop>
  )
}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const Profile = () => {
  const [openDetails, setOpenDetails] = React.useState(false);
  const [profile, setProfile] = React.useState<any>({})
  const [editProfile, setEditProfile] = React.useState(false)
  const [projectModal, setProjectModal] = React.useState(false)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [courses, setCourses] = useState<[string]>(['']);
  const [projectScreenshot, setProjectScreenshot] = useState('');
  const [projectIcon, setProjectIcon] = useState('');
  const router = useRouter()

  const [form] = Form.useForm();
  const [projectsForm] = Form.useForm();
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = imageUrl
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    console.log(info);
    const uploadTask = storageRef.child(`profilepictures/${info.file.name}`).put(info.file.thumbUrl);
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setImageUrl(downloadURL)
          console.log('File available at', downloadURL);
        });
      }
    );
  };
  const projectProps: UploadProps = {
    name: 'projectScreenshot',
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const projectIconProps: UploadProps = {
    name: 'projectIcon',
    multiple: false,
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    },
    defaultFileList: [

    ],
  };
  const handleClose = () => {
    setOpenDetails(false);
  };
  const handleOpen = () => {
    setOpenDetails(true);
  };

  useEffect(() => {
    CoursesService.courses().then((res) => {
      setCourses([''])
      let c: any = []
      res.forEach((course: Course) => {
        c.push(course.key)
      })
      setCourses(c)
      console.log(courses, c);

    })
    AuthService.isLoggedIn().then((res) => {
      console.log(res);
      form.setFieldValue('email', res.email)
    })
    ProfileService.profile().then(profile => {
      console.log(profile);
      setImageUrl(profile.profilePicture)
      Object.keys(profile).map(item => {
        form.setFieldValue(item, profile[item])
      })
      setProfile(profile)
    }).catch(err => { })
  }, [])
  return (
    <>
      <>
        {!profile.firstname && (
          <Stack flex={1} height={'100vh'} justifyItems={'center'} alignItems={'center'}>
            <Spin tip="Loading..." />
          </Stack>
        )}
        {profile.firstname && (<Stack sx={{
          background:
            'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0.7) 100%), url("https://plus.unsplash.com/premium_photo-1673890230816-7184bee134db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}>
          <Drawer open={editProfile} anchor="right" >
            <Toolbar >
              <IconButton onClick={() => { setEditProfile(false) }}><Close /></IconButton>
              <Typography variant="h6">Edit Profile</Typography>
            </Toolbar>
            <Stack p={5} width={{ xs: '100%', sm: 500 }}>
              <Modal zIndex={200000} open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={imageUrl} />
              </Modal>
              <Divider orientation="left" >Personal Details</Divider>
              <Form form={form} name="validateOnly" layout="vertical" onFinish={(values) => {
                var cleanProfile: any = {}
                Object.keys(values).map(item => {
                  if (values[item]) {
                    cleanProfile[item] = values[item]
                  }
                })
                ProfileService.updateProfile(profile.uid, { ...cleanProfile, ...profile, profilePicture: imageUrl, }).then(res => {
                  setEditProfile(false)
                }).catch(err => {
                  console.log(err);

                })

              }} autoComplete="off">

                <FormItem name={'firstname'} label="First Name" rules={[{ required: true, message: 'First Name is required.' }]}>
                  <Input />
                </FormItem>
                <FormItem name={'lastname'} label="Last Name" rules={[{ required: true, message: 'Last Name is required.' }]}>
                  <Input />
                </FormItem>
                <Tooltip zIndex={2000} title="Soweto, Thembisa, etc"  >
                  <QuestionCircleFilled />
                </Tooltip>
                <FormItem name="location" label="Location" rules={[{ required: true, message: 'Location is required.', }]} >
                  <Input />
                </FormItem>

                <FormItem name={'email'} label="Email" rules={[{ required: true, message: 'Email is required.', type: 'email' }]}>
                  <Input />
                </FormItem>
                <FormItem name={'cellphone'} label="Cell Phone" rules={[{ required: true, message: 'Cell Phone is required.' }]}>
                  <Input />
                </FormItem>
                <FormItem name={'bio'} label="Bio" rules={[{ required: true, message: 'Bio is required.' }]}>
                  <Input.TextArea />
                </FormItem>
                <Divider orientation="left" >Online Profiles</Divider>
                {socialOptions.map((item) => {
                  return (
                    <FormItem key={item} name={item} label={item}>
                      <Input prefix="URL" />
                    </FormItem>
                  )
                })}

                <ANTButton type="primary" htmlType="submit" >Submit</ANTButton>
              </Form>
            </Stack>
          </Drawer>
          <Modal zIndex={2000} open={projectModal} footer={false} onCancel={() => { setProjectModal(false) }}>

            <Stack spacing={2}>
              <Typography>New Project</Typography>

              <Form form={projectsForm} layout="vertical" onFinish={(values) => {
                console.log(values);
              }}>

                <FormItem name={'projectIcon'} rules={[{ required: true, type: 'object' }]}>
                  <Upload {...projectIconProps}>
                    <ANTButton icon={<UploadOutlined />}>Upload Application Icon</ANTButton>
                  </Upload>
                </FormItem>
                <FormItem name={'projectScreenshot'} rules={[{ required: true, type: 'object' }]}>
                  <Dragger {...projectProps}>
                    <FileImageOutlined />
                    <Typography variant="subtitle1">Click or drag file to this area to upload your project screenshot</Typography>
                  </Dragger>
                </FormItem>
                <FormItem name="course" label="Course" rules={[{ required: true }]}>
                  {courses.length > 0 && (<Select

                    // onChange={onGenderChange}
                    allowClear
                  >{courses.map((course) => {
                    return (
                      <Option value={course}>{course}</Option>
                    )
                  })}
                  </Select>
                  )}
                </FormItem>
                <FormItem label="Title" name={'title'} rules={[{ required: true }]}>
                  <Input />
                </FormItem>
                <FormItem label="Description" name={'description'} rules={[{ required: true, min: 250 }]}>
                  <Input.TextArea />
                </FormItem>
                <Form.List name="tags">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                          <Form.Item
                            {...restField}
                            label='Tag'
                            name={[name, 'tag']}
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Tag" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <ANTButton type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Tag
                        </ANTButton>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <FormItem label="Live URL" name={'livesiteUrl'} rules={[{ required: true, type: 'url' }]}>
                  <Input />
                </FormItem>
                <FormItem label="Github Project Link" name={'githubUrl'} rules={[{ required: true, type: 'url' }]}>
                  <Input />
                </FormItem>
                <ANTButton type="primary" htmlType="submit">Submit</ANTButton>
              </Form>
            </Stack>
          </Modal>
          <Container >
            <AppBar color="inherit" variant="outlined">
              <Toolbar variant="dense">
                <IconButton onClick={() => { router.back() }} size="small"><ArrowBack></ArrowBack></IconButton>
              </Toolbar>
            </AppBar>
            <ProjectDetails key={'project-details'} openState={openDetails} toggleDetails={() => { setOpenDetails(!openDetails) }} />
            <Stack py={15} spacing={5} alignItems={"center"}>

              <IconButton onClick={() => {
                setEditProfile(true);
                form.setFieldValue('firstname', profile?.firstname);
                form.setFieldValue('lastname', profile?.lastname);
              }}>
                <Avatar sx={{ width: 199, height: 199 }} sizes="50" src="https://images.unsplash.com/photo-1691335799851-ea2799a51ff0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=693&q=80" alt="pp" />
              </IconButton>

              <Typography variant="h2">{profile?.firstname || 'Loading'} {profile?.lastname || "..."}</Typography>
              <Typography variant="body1" textAlign={'center'}>
                {profile.bio ? profile.bio : 'Edit your profile to add a bio.'}
              </Typography>
              <Stack spacing={1} gap={1} direction={{ sx: 'column', sm: 'column', md: 'row' }}>
                <Chip label={profile.email}></Chip>
                <Chip label={profile.location}></Chip>
              </Stack>
              <Stack direction={{ sx: 'column', sm: 'row', md: 'row' }}>
                <IconButton ><Facebook></Facebook></IconButton>
                <IconButton ><LinkedIn></LinkedIn></IconButton>
                <IconButton ><WhatsApp></WhatsApp></IconButton>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} flexWrap={'wrap'} spacing={1}>
                <Card variant="outlined" >
                  <Stack alignItems={'center'} borderRadius={2} sx={{ borderColor: 'CaptionText', borderWidth: 1 }} p={2}>
                    <Typography variant="h4">8</Typography>
                    <Typography variant="body2">Angular Projects</Typography>
                  </Stack>
                </Card>
                <Card variant="outlined" >
                  <Stack alignItems={'center'} borderRadius={2} sx={{ borderColor: 'CaptionText', borderWidth: 1 }} p={2}>
                    <Typography variant="h4">8</Typography>
                    <Typography variant="body2">Angular Projects</Typography>
                  </Stack>
                </Card>
                <Card variant="outlined" >
                  <Stack alignItems={'center'} borderRadius={2} sx={{ borderColor: 'CaptionText', borderWidth: 1 }} p={2}>
                    <Typography variant="h4">5</Typography>
                    <Typography variant="body2">ReactJs Projects</Typography>
                  </Stack>
                </Card>
                <Card variant="outlined" >
                  <Stack alignItems={'center'} borderRadius={2} sx={{ borderColor: 'CaptionText', borderWidth: 1 }} p={2}>
                    <Typography variant="h4">232</Typography>
                    <Typography variant="body2">Hub Theads</Typography>
                  </Stack>
                </Card>
                <Card variant="outlined" >
                  <Stack alignItems={'center'} borderRadius={2} sx={{ borderColor: 'CaptionText', borderWidth: 1 }} p={2}>
                    <Typography variant="h4">34k</Typography>
                    <Typography variant="body2">Hub responses</Typography>
                  </Stack>
                </Card>
              </Stack>
              <Stack py={5} spacing={1}>
                <Typography textAlign={'center'} variant="h4">My Projects</Typography>
                <Stack flex={1}>
                  <Button onClick={() => {
                    setProjectModal(true)
                  }} variant="outlined" size="small"  >Add Project</Button>
                </Stack>
              </Stack>
              <Stack gap={5} direction={'row'} flexWrap={'wrap'} width={'100%'} justifyContent={'center'}>
                {[1, 2, 3, 4, 5].map(ites => {
                  return (<ProjectCard openDetails={() => { setOpenDetails(!openDetails) }} />)
                })}

              </Stack>
            </Stack>
          </Container>
        </Stack >
        )}

      </>
    </>


  );
};

export default Profile;
