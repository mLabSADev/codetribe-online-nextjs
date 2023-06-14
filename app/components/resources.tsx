import {
    Card,
    Chip,
    Stack,
    Typography,
    CardContent,
    Box,
    Button,
  } from "@mui/material"
  import OpenInNewIcon from "@mui/icons-material/OpenInNew"
  import { Image } from "antd"
  import React from "react"

  interface IBackendCard {
    icon: any
    title: string
    description: string
    link: string
    color: string
  }
  
  export const BackendCard = ({ icon, title, description, link, color }: IBackendCard) => {
    return (
      <Stack
        width={{ sm: "100%", md: "column", lg: "row" }}
        alignItems={"center"}
        p={3}
        spacing={2}
        sx={{ borderRadius: 5, background: color, color: "#fff" }}
      >
        <Box borderRadius={5} overflow={"hidden"}>
          <Image width={90} src={icon} />
        </Box>
        <Typography variant="h5" color={"white"}>
          {title}
        </Typography>
        <Typography variant="body2" textAlign={"center"}>
          {description}
        </Typography>
        <Button
          component={"a"}
          href={link}
          target="_blank"
          variant="outlined"
          sx={{ borderRadius: 5 }}
          color="inherit"
          endIcon={<OpenInNewIcon />}
        >
          Go to Docs
        </Button>
      </Stack>
    )
  }

  interface IResourceCards {
    title: string
    description: string
    links: any[]
    image: any
  }

  /**
   *
   * @param {*} title
   * @param {*} description
   * @param {*} links
   * @param {*} image
  
   */
  const ResourceCards = ({ title, description, links, image }: IResourceCards) => {
    return (
      <Card
        sx={{
          width: "100%",
          borderRadius: 5,
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0)",
        }}
        variant="outlined"
      >
        <CardContent>
          <Stack
            width={"100%"}
            direction={{
              xs: "column",
              sm: "row",
              md: "row",
              lg: "column",
              xl: "row",
            }}
            spacing={2}
            alignItems={"center"}
          >
            <Stack width={"100%"} spacing={2}>
              <Stack spacing={1} flex={1}>
                <Typography variant="h6" fontWeight={"bold"}>
                  {title}
                </Typography>
                <Typography variant="body2">{description}</Typography>
              </Stack>
              <Stack
                width={"100%"}
                direction={"row"}
                flexWrap={"wrap"}
                paddingY={0}
                // spacing={1}
                // gap={1}
                py={2}
              >
                {links.map((item: any) => {
                  return (
                    <Chip
                      clickable
                      component="a"
                      target="_blank"
                      href={item.link}
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        borderRadius: 20,
                        margin: 0.3,
                      }}
                      label={item.label}
                      deleteIcon={<OpenInNewIcon />}
                    />
                  )
                })}
              </Stack>
            </Stack>
            <Stack>
              <Image width={200} src={image} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    )
  }
  export default ResourceCards
  