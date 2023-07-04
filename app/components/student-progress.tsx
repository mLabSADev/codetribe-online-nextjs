import { Stack, Typography, Button } from "@mui/material";
import { Col, Progress } from "antd";
import React from "react";

interface IStudentProgress {
  progress: number;
  title: string;
  course: string;
  lesson: number;
  link: string;
  locked: boolean;
}

/**
 *
 * @param {number} progress in percentage 0 - 100
 * @param {number} lesson lesson number
 * @param {string} title course module
 * @param {string} course course name
 * @param {string} link link to course
 * @returns
 */

function StudentProgress({
  progress,
  title,
  course,
  lesson,
  link,
  locked = false,
}: IStudentProgress) {
  return (
    <Stack
      border={1}
      p={2}
      minWidth={{ xs: "100%", sm: 400 }}
      direction={{ xs: "column", sm: "row", md: "row" }}
      alignItems={"center"}
      spacing={3}
      sx={{
        borderRadius: 5,
        borderColor: "#E4E4E4",
        backdropFilter: "blur(14px)",
        background: "rgba(255,255,255,0)",
      }}
    >
      <Stack
        width={{ xs: "100%", sm: "auto", md: "auto" }}
        alignItems={"center"}
      >
        {/* Needs refresh to apply TODO: will try to use mui Box */}
        {window.screen.width < 500 ? (
          <Progress
            strokeColor={{ "0%": "#87d068", "100%": "#87d068" }}
            percent={progress}
            // width={"100%"}
          />
        ) : (
          <Progress
            type="dashboard"
            strokeColor={{ "0%": "#87d068", "100%": "#87d068" }}
            percent={progress}
          />
        )}
      </Stack>
      <Stack spacing={2}>
        <Stack>
          <Typography variant="subtitle2" color={"gray"}>
            {progress == 100 ? `Well Done` : `${course} - Lesson ${lesson}`}
          </Typography>
          <Typography variant="subtitle1" fontWeight={"bold"}>
            {progress == 100 ? `${course} Course Completed` : title}
          </Typography>
        </Stack>
        {progress == 100 ? null : (
          <Button
            component={"a"}
            href={link}
            disabled={locked} // TODO: temporary disabler
            size="small"
            disableElevation
            sx={{
              alignSelf: "flex-start",
            }}
            variant="contained"
          >
            <Typography fontSize={14} variant="button">
              {/* TODO: customize condition */}
              {locked ? "Locked" : "Continue Learning"}
            </Typography>
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

export default StudentProgress;
