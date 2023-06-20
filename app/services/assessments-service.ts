import firebase from "firebase"
import Assessment from "../dtos/assessments"
import AssessmentSubmission from "../dtos/assessment-submission"
import { AuthService } from "./auth-service"

export const Assessment = {
    getAll: () => {
        return firebase
            .database()
            .ref(`assessments`)
            .once("value")
            .then(snapshot => {
                const value = snapshot.val()
                const keys = Object.keys(value)

                return keys.map(key => {
                    return {
                        ...value[key],
                        key,
                    }
                })
            })
    },
    /**
     * @param {*} id doc id
     */
    getOne: (id: string) => {
        return firebase
            .database()
            .ref(`assessments/${id}`)
            .once("value")
            .then(snapshot => {
                const value = snapshot.val()

                value.chapters = Object.keys(value.chapters)
                    .map(key => {
                        return {
                            key,
                            ...value.chapters[key],
                            lessons: Object.keys(value.chapters[key].lessons)
                                .map(lessonKey => {
                                    return {
                                        key: lessonKey,
                                        ...value.chapters[key].lessons[lessonKey],
                                    }
                                })
                                .sort((a, b) => {
                                    if (a.lesson < b.lesson) {
                                        return -1
                                    } else {
                                        return 1
                                    }
                                }),
                        }
                    })
                    .sort((a, b) => {
                        if (a.chapter < b.chapter) {
                            return -1
                        } else {
                            return 1
                        }
                    })

                return value
            })
    },
    /**
     * @param {*} data form data
     */
    add: (data: Assessment) => {
        return firebase.database().ref(`assessments/${data.course}`).push({
            title: data.title,
            content: data.content,
            created: new Date().toISOString(),
        })
    },
    /**
     * @param {*} id  doc id
     */
    delete: (course: string, id: string) => {
        return firebase.database().ref(`assessments/${course}/${id}`).remove()
    },
    /**
     * @param {*} id doc id
     * @param {*} data form data
     */
    update: (course: string, assessmentId: string, data: Assessment) => {
        return firebase
            .database()
            .ref(`assessments/${course}/${assessmentId}`)
            .set({
                title: data.title,
                content: data.content,
                lesson: data.lesson,
                updated: new Date().toISOString(),
            })
    },
    // assessments/submissions/angular/chapterkey/Thembisa/uid
    submit: (values: AssessmentSubmission) => {
        return new Promise((res, rej) => {
            AuthService.isLoggedIn().then((user: any) => {
                firebase
                    .database()
                    .ref(`assessments/submissions/${values.course}/${values.chapter}/${values.location}/${user.uid}`)
                    .set({ ...values, submitted: new Date().toISOString() }).then(data => {
                        res(data)
                    })
            })
        })
    },
    /**
    *  FOR STUDENT UI
    * course: string 'angular'
    * chapter: string  '-NYIAo4...'
    * location: string 'Thembisa'
    */
    getOneSubmission: (data: Submissions) => {
        return new Promise((res, rej) => {
            AuthService.isLoggedIn().then((user: any) => {
                firebase
                    .database()
                    .ref(`assessments/submissions/${data.course}/${data.chapter}/${data.location}/${user.uid}`)
                    .get().then(data => {
                        res(data.val())
                    })
            })
        })
    },
    /** 
     * course: string 'angular'
     * chapter: string  '-NYIAo4...'
     * location: string 'Thembisa'
     */
    getAllSubmissionsByCourse: (course: string) => {
        return new Promise((res, rej) => {
            firebase
                .database()
                .ref(`assessments/submissions/${data.course}`)
                .get().then(data => {
                    res(data)
                })
        })
    },
    getAllSubmissionsByChapter: (data) => {
        return new Promise((res, rej) => {
            firebase
                .database()
                .ref(`assessments/submissions/${data.course}/${data.chapter}`)
                .get().then(data => {
                    res(data.val())
                })
        })
    },
    getAllSubmissionsByLocation: (course: string) => {
        return new Promise((res, rej) => {
            firebase
                .database()
                .ref(`assessments/submissions/${data.course}/${data.chapter}/${data.location}}`)
                .get().then(data => {
                    res(data)
                })
        })
    }
}
interface Submission {
    location: string,
    course: string
}

interface Submissions {
    course: string
    location: string,
    chapter: string
}