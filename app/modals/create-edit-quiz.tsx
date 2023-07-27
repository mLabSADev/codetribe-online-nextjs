import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Alert, RowProps, Collapse } from "antd";
import { AuthService } from "../services/auth-service";
import Quiz from "../dtos/quiz";
import Course from "../dtos/course";
import Chapter from "../dtos/chapter";
import { CoursesService } from "../services/courses-service";
import Lesson from "../dtos/lesson";
import { Styles } from "../services/styles";
import { Stack, Typography } from "@mui/material";

interface ICreateEditQuiz {
  quiz?: Quiz;
  chapter?: Chapter;
  course?: Course;
  onCancel: () => void;
}

const CreateEditQuiz = ({
  quiz,
  onCancel,
  course,
  chapter,
}: ICreateEditQuiz) => {
  const [resettingPassword, setResettingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [success, setSuccess] = useState();
  const [currentQuiz, setQuiz] = useState<Quiz>({
    title: "",
    questions: [],
  });

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");

  useEffect(() => {
    if (quiz) {
      setQuiz(quiz);
    }
  }, [quiz]);

  const onAddQuestion = () => {
    currentQuiz?.questions.push({
      answers: [],
      answerSelectionType: "single",
      correctAnswer: 1,
      question: currentQuestion,
      questionType: "text",
    });

    setQuiz({
      ...currentQuiz!,
    });

    setCurrentQuestion("");
  };

  const onSave = () => {
    // setSaving(true)
    // setErrorMessage(null)

    const lessonToSave: any = {
      body: "",
      duration: "3:00",
      videoUrl: "",
      quiz: currentQuiz,
      title: "Quiz",
      isQuiz: true
    };

    console.log('Checking');
    console.log(lessonToSave);
    
    

    return CoursesService.saveLesson(course!.key, chapter!, lessonToSave)
      .then(() => {
        // setSaving(false)

        onCancel();
      })
      .catch((err) => {
        console.log(err);
        
        setErrorMessage(err.message);
      });
  };

  const onAddAnswer = (index: number) => {
    currentQuiz?.questions[index].answers.push(currentAnswer);

    setQuiz({
      ...currentQuiz!,
    });

    setCurrentAnswer("");
  };

  const markAsCorrect = (questionIndex: number, answerIndex: number) => {
    currentQuiz!.questions[questionIndex].correctAnswer = answerIndex + 1;

    setQuiz({
      ...currentQuiz,
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <Row style={{ width: "100%" }}>
        <Col xs={0} sm={0} md={4} lg={6} />
        <Col xs={24} sm={24} md={16} lg={9} style={{ padding: 20 }}>
          <Stack sx={{ borderRadius: 2 }} p={2} bgcolor={"white"} spacing={1}>
            <Typography variant="h6" style={{ textAlign: "center" }}>
              Quiz
            </Typography>
            {currentQuiz && (
              <Collapse>
                {currentQuiz.questions.map((question, index) => {
                  return (
                    <Collapse.Panel header={question.question} key={`${index}`}>
                      Answers
                      {question.answers.map((answer, answerIndex) => {
                        return (
                          <Stack
                            key={`answer-${answerIndex}`}
                            style={{
                              padding: 10,
                              display: "flex",
                              alignItems: "center",
                              // borderBottom: 'solid #efefef 1px'
                            }}
                          >
                            <Stack
                              style={{
                                flexGrow: 1,
                                color:
                                  question.correctAnswer == answerIndex + 1
                                    ? "green"
                                    : "black",
                                fontWeight:
                                  question.correctAnswer == answerIndex + 1
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {answer}
                            </Stack>
                            {question.correctAnswer != answerIndex + 1 && (
                              <Button
                                style={{ height: "100%" }}
                                onClick={() =>
                                  markAsCorrect(index, answerIndex)
                                }
                              >
                                Mark as correct
                              </Button>
                            )}
                          </Stack>
                        );
                      })}
                      <Stack direction={"row"} spacing={1}>
                        <Input
                          value={currentAnswer}
                          onChange={(event) =>
                            setCurrentAnswer(event.target.value)
                          }
                          type="text"
                          placeholder="Question"
                          style={{ flex: 1 }}
                        />
                        <Button
                          style={{ height: "100%" }}
                          onClick={() => onAddAnswer(index)}
                        >
                          Add Answer
                        </Button>
                      </Stack>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            )}

            <Stack direction={"row"} spacing={1}>
              <Input
                value={currentQuestion}
                onChange={(event) => setCurrentQuestion(event.target.value)}
                type="text"
                placeholder="Question"
                style={Styles.Input}
              />
              <Button style={Styles.Button.Outline} onClick={onAddQuestion}>
                Add Question
              </Button>
            </Stack>

            <Stack direction={"row"} spacing={1}>
              <Button style={Styles.Button.Filled} onClick={onSave}>
                Save Quiz
              </Button>
              <Button
                type="link"
                style={{ ...Styles.Button.Outline, color: "red" }}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Col>
      </Row>
    </div>
  );
};

export default CreateEditQuiz;
