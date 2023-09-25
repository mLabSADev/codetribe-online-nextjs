import React from "react";
import Project from "../dtos/project-dto";
import { Button as ANTButton, Popconfirm } from "antd";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import { GitHub, MoreVert, OpenInBrowser } from "@mui/icons-material";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import Image from "next/image";

const ProjectCard = ({
  openDetails,
  project,
  handleDelete,
  handleEdit,
}: {
  openDetails: Function;
  project: Project;
  handleDelete: Function;
  handleEdit: Function;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "100%", md: 100, lg: 300 },
        alignSelf: "flex-start",
      }}
      variant="outlined"
    >
      {/* <Stack
        sx={{ width: "100%", height: 50, bgcolor: "green" }}
        position={"relative"}
      >
         <Box position={"absolute"} bottom={10} right={10}>
            <Avatar sx={{ width: 50, height: 50 }} src={project.projectIcon}></Avatar>
          </Box> 
      </Stack> */}
      <CardContent>
        <Stack spacing={2}>
          <Chip
            sx={{ alignSelf: "self-start" }}
            size="small"
            label={project.framework.toUpperCase()}
          />
          <Typography color={"black"} variant="h5">
            {project.title}
          </Typography>
          <Typography variant="body2">{project.description}</Typography>
        </Stack>
      </CardContent>

      <CardActions>
        <Chip
          component={"a"}
          href={project.livesiteUrl}
          target="_blank"
          icon={<OpenInBrowser />}
          label="Open Project"
        ></Chip>
        <IconButton href={project.githubUrl} target="_blank">
          <GitHub />
        </IconButton>
        <Stack
          flex={1}
          direction={"row"}
          justifyContent={"flex-end"}
          justifyItems={"center"}
        >
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            variant="selectedMenu"
            sx={{ padding: 5 }}
          >
            <Stack spacing={1} p={1}>
              <ANTButton onClick={() => handleEdit()}>
                <EditFilled />
                Edit
              </ANTButton>
              <Popconfirm
                title="Are you sure you want to delete this project?"
                onConfirm={() => handleDelete()}
                style={{ zIndex: 30000000 }}
              >
                <ANTButton danger type="text">
                  <DeleteFilled />
                  Delete
                </ANTButton>
              </Popconfirm>
            </Stack>
          </Menu>
        </Stack>
      </CardActions>
    </Card>
  );
};
export default ProjectCard;
