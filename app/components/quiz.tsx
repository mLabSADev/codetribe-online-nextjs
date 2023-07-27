import Quiz from "react-quiz-component";
import { Box } from "@mui/material";
import { LessonService } from "../services/lesson-service";
import { useEffect, useState } from "react";

const QuizView = ({
  quiz,
  courseId,
  chapterId,
  quizId,
}: {
  quiz: any;
  courseId: string;
  chapterId: string;
  quizId: string;
}) => {
  const [quizResults, setQuizResults] = useState()

  const onComplete = (data: any) => {
    LessonService.saveQuiz(courseId, chapterId, quizId, data).then(() => {
      console.log(`Lesson Saved`);
    });
  };

  useEffect(() => {
    LessonService.getQuizResults(courseId, chapterId, quizId).then(data => {
      console.log(data);
      
      setQuizResults(data)
    })
  }, [])

  return quizResults ? (
    <Box>
      You have already completed the quiz
    </Box>
  ) : (
    <Box px={4}>
      <Quiz
        shuffle={true}
        continueTillCorrect={false}
        quiz={{
          quizTitle: "",
          quizSynopsis:
            "Test your knowledge and see how well you've learned from this lesson. Hit the start quiz button when you're ready",
          questions: quiz?.questions || [],
        }}
        onComplete={onComplete}
      />
    </Box>
  );
};

export default QuizView;
