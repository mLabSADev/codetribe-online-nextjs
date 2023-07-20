import Quiz from 'react-quiz-component';

const QuizView = ({quiz}: { quiz: any}) => {
    const onComplete = () => {

    }
    
    return (
        <div>
            <Quiz shuffle={true} continueTillCorrect={false} quiz={{
                "quizTitle": "",
                "quizSynopsis": "Test your knowledge and see how well you've learned from this lesson. Hit the start quiz button when you're ready",
                questions: quiz.question
                }} onComplete={onComplete} />
        </div>
    )
}

export default QuizView