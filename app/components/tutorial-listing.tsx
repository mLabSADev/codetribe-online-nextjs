import React, { useEffect, useState } from "react";
import { Card, Col, Row, Space, Button } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import Course from "../dtos/course";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CoursesService } from "../services/courses-service";
const { Meta } = Card;

const CourseCard = ({ course }: { course: Course }) => {
  const [loadFinished, setLoadFinished] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/overview/${course.key}`);
  };

  const share = () => {};
  if (course.title) {
    return (
      <Card
        hoverable
        style={{ width: 400, borderRadius: 20, overflow: "hidden" }}
        cover={
          <img
            onLoad={() => {
              setLoadFinished(true);
              console.log("load finished");
            }}
            alt={course.title}
            src={course.imageUrl}
            // width={600}
          />
        }
        actions={[
          <Button
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
  console.log(courses);

  return (
    <div>
      <Space wrap align="center">
        {courses.length > 0 &&
          courses.map((post, index) => (
            <Col
              key={index}
              sm={24}
              md={12}
              lg={12}
              xl={8}
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 10,
              }}
            >
              <CourseCard course={post} />
            </Col>
          ))}
      </Space>
    </div>
  );
};

export default TutorialListing;
