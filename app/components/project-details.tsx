import { Facebook, GitHub, LinkedIn, WhatsApp } from "@mui/icons-material";
import { Avatar, Backdrop, Chip, IconButton, Stack, Typography } from "@mui/material";
import { Image } from "antd";
import React from "react";

const ProjectDetails = ({
  openState,
  toggleDetails,
}: {
  openState: boolean;
  toggleDetails: Function;
}) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openState}
      onClick={() => toggleDetails()}
    >
      <Stack
        direction={{ sm: "column", md: "row" }}
        sx={{ color: "black", overflowX: "hidden", overflowY: "auto" }}
        maxWidth={"90%"}
        minWidth={"90%"}
        bgcolor={"white"}
        borderRadius={3}
      >
        <Stack p={2}>
          <Stack direction={{ xs: "row", sm: "column", md: "column" }}>
            <IconButton>
              <Facebook />
            </IconButton>
            <IconButton>
              <WhatsApp />
            </IconButton>
            <IconButton>
              <LinkedIn />
            </IconButton>
            <IconButton>
              <GitHub />
            </IconButton>
          </Stack>
        </Stack>
        <Stack width={"100%"} flex={1}>
          <Stack p={4} direction={"row"} alignItems={"center"} spacing={2}>
            <Avatar
              src="https://plus.unsplash.com/premium_photo-1691591182467-b5ffdf32c1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt=""
            ></Avatar>
            <Typography variant="h3">Project Name</Typography>
          </Stack>
          <Stack
            width={"100%"}
            flex={1}
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
          >
            <Stack>
              <Stack width={400} height={400}>
                <Image
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src="https://cdn.dribbble.com/userupload/9451533/file/original-9364347c1a5802dec0c4e117727faf08.png?resize=1024x768"
                  alt="bg"
                />
              </Stack>
            </Stack>
            <Stack p={2} spacing={2}>
              <Typography variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur id felis pellentesque, tincidunt tellus sed, pretium
                nunc. Donec a feugiat lectus. Pellentesque consectetur purus
                eleifend ornare iaculis. Praesent non viverra enim. Fusce
                tincidunt, turpis sit amet pellentesque tempor, lectus lectus
                cursus ex, sed sollicitudin ex nisl quis odio. Sed facilisis
                dolor dui, nec malesuada sem vestibulum sed. Vivamus bibendum
                nibh sit amet ligula sollicitudin finibus. Morbi ipsum ante,
                dignissim vel lobortis vel, elementum aliquam elit. Quisque est
                tortor, euismod nec enim eu, semper tempor neque. Nam sem elit,
                porta eget fermentum id, ultricies id justo. Curabitur non
                mauris massa. Pellentesque volutpat varius est, ultrices pretium
                lacus iaculis ut.
              </Typography>
              <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
                <Chip sx={{ alignSelf: "start" }} label="Mobile Development" />
                <Chip sx={{ alignSelf: "start" }} label="NodeJs" />
                <Chip sx={{ alignSelf: "start" }} label="Firebase" />
                <Chip sx={{ alignSelf: "start" }} label="Android" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Backdrop>
  );
};
export default ProjectDetails;
