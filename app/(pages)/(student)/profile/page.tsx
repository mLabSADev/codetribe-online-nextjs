"use client";
import { Stack, Typography, Slide, IconButton, Button, Container, Avatar, Chip, Card, CardContent, Backdrop, AppBar, Toolbar, Drawer } from "@mui/material";
import { Form, Image, Input, Modal, Button as ANTButton } from "antd";
import { Remove, Facebook, LinkedIn, WhatsApp, GitHub, LinkRounded, OpenInBrowser, ArrowBack, Close, Add, RemoveCircle } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AuthService } from "@/app/services/auth-service";
import { useRouter } from "next/navigation";
import { ProfileService } from "@/app/services/profile-service";
import { Formik } from "formik";
import FormItem from "antd/es/form/FormItem";
const GetSocialsIcon = ({ social }: { social: string }) => {
  ['linkedin', 'facebook', 'github', 'whatsapp']
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
      <Stack sx={{ width: "100%", height: 200 }}>
        <img width={'100%'} height={"100%"} style={{ objectFit: 'cover' }} src="https://plus.unsplash.com/premium_photo-1692196626076-08b7c0d2ca09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80" alt="bg" />
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
        <IconButton><LinkedIn /></IconButton>
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
      <Stack direction={{ sm: 'column', md: 'row' }} sx={{ color: 'black', overflowX: 'hidden', overflowY: 'auto' }} maxWidth={'90%'} minWidth={'90%'} minHeight={'96%'} maxHeight={'96%'} bgcolor={'white'} borderRadius={3} >

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
const Profile = () => {
  const [courseStats, setCourseStats] = useState<{ angular: number, reactjs: number, nodejs: number, }>({ angular: 0, nodejs: 0, reactjs: 0 })
  const [openDetails, setOpenDetails] = React.useState(false);
  const [profile, setProfile] = React.useState<any>({})
  const [editProfile, setEditProfile] = React.useState(false)
  const router = useRouter()
  const [form] = Form.useForm();
  const handleClose = () => {
    setOpenDetails(false);
  };
  const handleOpen = () => {
    setOpenDetails(true);
  };
  const user = AuthService.currentUser().then(res => { return res }).catch(err => { return err })
  const socials = ['linkedin', 'facebook', 'github', 'whatsapp']
  useEffect(() => {
    ProfileService.profile().then(profile => {
      setProfile(profile)
      console.log(profile);

    }).catch(err => { })
  }, [])
  return (
    <>
      <>
        <Stack sx={{
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

              <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
                <FormItem name={'firstname'} label="First Name">
                  <Input />
                </FormItem>
                <FormItem name={'lastname'} label="Last Name">
                  <Input />
                </FormItem>
                <FormItem name={'bio'} label="Bio">
                  <Input.TextArea />
                </FormItem>
                <Form.List name="socials">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => {
                        return (
                          <Stack direction={'row'} gap={1} alignItems={'center'}>
                            <FormItem {...restField} name={[name, 'label']}>
                              <Input></Input>
                            </FormItem>
                            <FormItem {...restField} name={[name, 'url']}>
                              <Input />
                            </FormItem>
                            <IconButton onClick={() => {
                              remove(name)

                            }}>
                              <RemoveCircle></RemoveCircle>
                            </IconButton>
                          </Stack>
                        )
                      })}
                      <Stack>
                        <Form.Item>
                          <ANTButton onClick={() => add()} type="dashed">Add Field</ANTButton>
                        </Form.Item>
                      </Stack>
                    </>
                  )}
                </Form.List>
                <FormItem name={'firstname'} label="FirstName">
                  <Input />
                </FormItem>
                <FormItem name={'firstname'} label="FirstName">
                  <Input />
                </FormItem>
                <FormItem name={'firstname'} label="FirstName">
                  <Input />
                </FormItem>
                <ANTButton>Submit</ANTButton>
              </Form>
            </Stack>
          </Drawer>
          <Container >
            <AppBar color="inherit" variant="outlined">
              <Toolbar variant="dense">
                <IconButton onClick={() => { router.back() }} size="small"><ArrowBack></ArrowBack></IconButton>
              </Toolbar>
            </AppBar>
            <ProjectDetails key={'project-details'} openState={openDetails} toggleDetails={() => { setOpenDetails(!openDetails) }} />
            <Stack py={15} spacing={5} alignItems={"center"}>

              <IconButton onClick={() => { setEditProfile(true) }}>
                <Avatar sx={{ width: 199, height: 199 }} sizes="50" src="https://images.unsplash.com/photo-1691335799851-ea2799a51ff0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=693&q=80" alt="pp" />
              </IconButton>

              <Typography variant="h2">{profile?.firstname || 'Loading'} {profile?.lastname || "..."}</Typography>
              <Typography variant="body1" textAlign={'center'}>Nunc quis tortor ut diam scelerisque volutpat ac ut felis. Nullam tincidunt lacinia eleifend. Vestibulum nisi augue, commodo sed tellus sed, condimentum lobortis orci. Aenean eu enim et arcu finibus facilisis nec vel orci.</Typography>
              <Stack spacing={1} gap={1} direction={{ sx: 'column', sm: 'column', md: 'row' }}>
                <Chip label="janedoe@gmail.com"></Chip>
                <Chip label={'location'}></Chip>
              </Stack>
              <Stack direction={{ sx: 'column', sm: 'column', md: 'row' }}>
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
                  <Button variant="outlined" size="small"  >Add Project</Button>
                </Stack>
              </Stack>
              <Stack spacing={1} direction={'row'} flexWrap={'wrap'} width={'100%'} justifyContent={'center'}>
                <ProjectCard openDetails={() => { setOpenDetails(!openDetails) }} />
                <ProjectCard openDetails={() => { setOpenDetails(!openDetails) }} />
                <ProjectCard openDetails={() => { setOpenDetails(!openDetails) }} />
                <ProjectCard openDetails={() => { setOpenDetails(!openDetails) }} />
                <ProjectCard openDetails={() => { setOpenDetails(!openDetails) }} />
                <ProjectCard openDetails={() => { setOpenDetails(!openDetails) }} />
              </Stack>
            </Stack>
          </Container>
        </Stack >
      </>
    </>


  );
};

export default Profile;
