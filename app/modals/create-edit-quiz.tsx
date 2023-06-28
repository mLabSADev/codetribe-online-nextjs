import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col, Alert, RowProps, Collapse } from 'antd'
import { AuthService } from '../services/auth-service';
import Quiz from '../dtos/quiz';
import Course from '../dtos/course';
import Chapter from '../dtos/chapter';
import { CoursesService } from '../services/courses-service';
import Lesson from '../dtos/lesson';

interface ICreateEditQuiz {
    quiz?: Quiz
    chapter?: Chapter
    course?: Course
    onCancel: () => void
}

const CreateEditQuiz = ({ quiz, onCancel, course, chapter }: ICreateEditQuiz) => {
    const [resettingPassword, setResettingPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [success, setSuccess] = useState()
    const [currentQuiz, setQuiz] = useState<Quiz>({
        title: '',
        questions: []
    })

    const [currentAnswer, setCurrentAnswer] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState('')

    useEffect(() => {
        if (quiz) {
            setQuiz(quiz)
        }
    }, [quiz])

    const onAddQuestion = () => {
        currentQuiz?.questions.push({
            answers: [],
            answerSelectionType: 'single',
            correctAnswer: 1,
            question: currentQuestion,
            questionType: 'text'
        })

        setQuiz({
            ...currentQuiz!
        })

        setCurrentQuestion('')
    }

    const onSave = () => {
        // setSaving(true)
            // setErrorMessage(null)

            const lessonToSave: any = {
                body: '',
                duration: '3:00',
                videoUrl: '',
                quiz: currentQuiz,
                title: 'Quiz'
            }

            return CoursesService.saveLesson(course!.key, chapter!, lessonToSave).then(() => {
                // setSaving(false)

                onCancel()
            }).catch(err => {
                setErrorMessage(err.message)
            })
    }

    const onAddAnswer = (index: number) => {
        currentQuiz?.questions[index].answers.push(currentAnswer)

        setQuiz({
            ...currentQuiz!
        })

        setCurrentAnswer('')
    }

    const markAsCorrect = (questionIndex: number, answerIndex: number) => {
        currentQuiz!.questions[questionIndex].correctAnswer = answerIndex + 1

        setQuiz({
            ...currentQuiz
        })
    }

    return (
        <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        }}>
            <Row style={{ width: '100%' }}>
                <Col xs={0} sm={0} md={4} lg={6} />
                <Col xs={24} sm={24} md={16} lg={9} style={{ padding: 20 }}>
                    <div style={{ padding: 20, width: '100%', borderRadius: 15, background: 'white' }}>
                        <h2 style={{ textAlign: 'center' }}>Quiz</h2>
                        {currentQuiz && (
                            <Collapse>
                                {currentQuiz.questions.map((question, index) => {
                                    return (
                                        <Collapse.Panel header={question.question} key={`${index}`}>
                                            Answers
                                            {question.answers.map((answer, answerIndex) => {
                                                return (
                                                    <div style={{
                                                        padding: 10,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                        // borderBottom: 'solid #efefef 1px'
                                                    }}>
                                                        <div style={{flexGrow: 1, color: question.correctAnswer == answerIndex + 1 ? 'green' : 'black', fontWeight: question.correctAnswer == answerIndex + 1 ? 'bold' : 'normal'}}>{answer}</div>
                                                        {question.correctAnswer != answerIndex + 1 && <Button style={{height: '100%'}} onClick={() => markAsCorrect(index, answerIndex)}>Mark as correct</Button>}
                                                    </div>
                                                )
                                            })}

                                <div style={{
                                    display: 'flex'
                                }}>
                                    <Input value={currentAnswer} onChange={event => setCurrentAnswer(event.target.value)} type='text' placeholder='Question' style={{flex: 1}} />
                                    <Button style={{height: '100%'}}  onClick={() => onAddAnswer(index)}>Add Answer</Button>
                                </div>
                                                </Collapse.Panel>
                                            )
                                })}
                            </Collapse>
                        )}

                        <div style={{
                            display: 'flex'
                        }}>
                            <Input value={currentQuestion} onChange={event => setCurrentQuestion(event.target.value)} type='text' placeholder='Question' style={{flex: 1}} />
                            <Button style={{height: '100%'}} onClick={onAddQuestion}>Add Question</Button>
                        </div>

                        <div style={{
                        display: 'flex'
                    }}>
                        <Button onClick={onSave}>Save Quiz</Button>
                        <Button onClick={onCancel}>Cancel</Button>
                    </div>
                    </div>

                    
                    
                </Col>
            </Row>
        </div>
    )
}

export default CreateEditQuiz
