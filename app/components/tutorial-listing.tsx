import React, { useEffect, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Card, Col, Row, Space, Button } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import Course from "../dtos/course";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { List } from "@mui/icons-material";
import { CoursesService } from "../services/courses-service";
import { Chip, Grid, Stack } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
const { Meta } = Card;

const CourseCard = ({ course }: { course: Course }) => {
  const [loadFinished, setLoadFinished] = useState(false);
  const [lessons, setLessons] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/overview/${course.key}`);
  };

  const share = () => {};
  useEffect(() => {
    setLessons(Object.entries(course.chapters).length);
  }, []);
  if (course.title) {
    return (
      <Card
        hoverable
        style={{
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
        }}
        cover={
          <LazyLoadImage
            alt={course.title}
            src={course.imageUrl}
            style={{ objectFit: "cover", background: "lightgray" }}
            height={200}
          />
        }
        actions={[
          <Button
            key={1}
            style={{ borderRadius: 20 }}
            type="primary"
            size="large"
            icon={<CodeOutlined />}
            onClick={handleClick}
          >
            View Course
          </Button>,
        ]}
      >
        <Meta title={course.title} description={course.excerpt} />
        <Stack py={2} spacing={1}>
          <Chip
            sx={{ alignSelf: "flex-start", alignItems: "center" }}
            icon={<List />}
            label={`${lessons} Sections`}
          ></Chip>
          <Chip
            sx={{ alignSelf: "flex-start" }}
            size="small"
            label={`by ${course.author}`}
          />
        </Stack>
      </Card>
    );
  }
};

interface ITutorialListing {
  type?: string;
  category?: string;
  limit?: number;
}

const TutorialListing = ({ type, category, limit }: ITutorialListing) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    CoursesService.courses().then((courses) => {
      setCourses(courses);
    });
  }, []);

  // if (type) {
  //   posts = posts.filter(post => post.fields.type === type)
  // }

  // if (category) {
  //   posts = posts.filter(post => post.frontmatter.category === category)
  // }

  // if (limit) {
  //   posts = posts.slice(0, limit)
  // }

  return (
    <Stack>
      <Grid container>
        {courses.length > 0 &&
          courses.map((post, index) => (
            <Grid item sm={12} md={6} lg={4}>
              <Stack width={"100%"} p={1}>
                <CourseCard course={post} />
              </Stack>
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
};

export default TutorialListing;
