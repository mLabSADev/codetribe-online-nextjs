import firebase from "firebase"
import { AuthService } from "./auth-service"

export const LessonService = {
    currentLessonPosition: (lessonId: string) => {
        return AuthService.isLoggedIn().then((user: any) => {
            if (user) {
                return firebase.database().ref(`lessons/${lessonId}/${user.uid}`).once('value').then(snapshot => {
                    let position = snapshot.val()

                    if (!position) {
                        position = {
                            chapter: 0,
                            lesson: 0
                        }
                    }

                    return position
                })
            }

            return null
        })
    },
    currentLessonPositionForStudent: (studentUid: string, lessonId: string) => {
        return firebase.database().ref(`lessons/${lessonId}/${studentUid}`).once('value').then(snapshot => {
            const position = snapshot.val()

            return position
        })
    },
    setCurrentPosition: (lessonId: string, chapter: number, lesson: number) => {
        return AuthService.isLoggedIn().then((user: any) => {
            if (user) {
                return firebase.database().ref(`lessons/${lessonId}/${user.uid}`).update({
                    chapter,
                    lesson
                })
            }

            return null
        })
    },
    saveQuiz: (lessonId: string, chapter: number, results: any) => {
        return AuthService.isLoggedIn().then((user: any) => {
            if (user) {
                return firebase.database().ref(`quizes/${user.uid}/${lessonId}/${chapter}`).set(results)
            }
        })
    },
    getQuizResults: (lessonId: string, chapter: number) => {
        return AuthService.isLoggedIn().then((user: any) => {
            if (user) {
                return firebase.database().ref(`quizes/${user.uid}/${lessonId}/${chapter}`).once('value').then(snapshot => {
                    return snapshot.val()
                })
            }
        })
    }
}