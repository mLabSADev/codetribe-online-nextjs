import Quiz from 'react-quiz-component';
import { Box } from '@mui/material'
import { LessonService } from '../services/lesson-service';

const QuizView = ({quiz, courseId, chapterId, quizId}: { quiz: any, courseId: string, chapterId: string, quizId: string }) => {
    console.log(quiz);
    

    const onComplete = (data: any) => {
        LessonService.saveQuiz(courseId, chapterId, quizId, data).then(() => {
            console.log(`Lesson Saved`);
          })
    }

    return (
        <Box px={4}>
            <Quiz shuffle={true} continueTillCorrect={false} quiz={{
                "quizTitle": "",
                "quizSynopsis": "Test your knowledge and see how well you've learned from this lesson. Hit the start quiz button when you're ready",
                questions: quiz.questions
                }} onComplete={onComplete} />
        </Box>
    )
}

export default QuizView