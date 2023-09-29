import firebase from "firebase";
import Assessment from "../dtos/assessments";
import AssessmentSubmission from "../dtos/assessment-submission";
import { AuthService } from "./auth-service";
import AssessmentType from "../dtos/assessments";
const date = new Date()
export const AssessmentService = {
  getAll: () => {
    return firebase
      .database()
      .ref(`assessments`)
      .orderByChild('group')
      .equalTo(date.getFullYear())
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          const document = snapshot.val();
          const keys = Object.keys(document);

          return keys.map((key) => {
            const data: AssessmentType = { ...document[key], key: key }
            return data;
          });
        }
      });
  },
  add: (assessment: Assessment) => {
    return new Promise((resolve, reject) => {
      return firebase
        .database()
        .ref(`assessments/${assessment.chapter}--${assessment.group}`)
        .set(assessment).then(res => {
          resolve(res)
        })
    })

  },
  delete: (assessment: Assessment) => {
    return new Promise((resolve, reject) => {
      return firebase.database().ref(`assessments/${assessment.chapter}--${assessment.group}`).remove().then(res => {
        resolve(res)
      })
    })
  },
  Submissions: {
    submit: (submission: AssessmentSubmission) => {
      return new Promise((res, rej) => {
        AuthService.isLoggedIn().then((user: any) => {
          firebase
            .database()
            .ref(
              `assessment-submissions/${submission.assessmentKey}--${submission.group}/${submission.uid}`
            )
            .set(submission)
            .then((data) => {
              res(data);
            })
            .catch((err) => {
              rej(err);
            });
        });
      });
    },
    getSubmissions: (key: string) => {
      return firebase
        .database()
        .ref(`assessment-submissions/${key}`)
        .orderByChild('group')
        .equalTo(date.getFullYear())
        .get()
        .then((snapshot) => {
          if (snapshot.val()) {
            const document = snapshot.val();
            console.log(key, document);

            const keys = Object.keys(document);

            return keys.map((key) => {
              const data: AssessmentType = { ...document[key], key: key }
              return data;
            });
          } else {
            return []
          }
        });

    },
    getStudentSubmission: (key: string, uid: string) => {
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref(`assessment-submissions/${key}/${uid}`)
          .get()
          .then((snapshot) => {
            if (snapshot.val()) {
              resolve(snapshot.val())

            } else {
              resolve({})
            }
          });
      })
    }
  }
  // assessments/submissions/angular/chapterkey/Thembisa/uid


  /**
   * course: string 'angular'
   * chapter: string  '-NYIAo4...'
   * location: string 'Thembisa'
   */

};
interface Submission {
  location: string;
  course: string;
}

interface Submissions {
  course: string;
  location: string;
  chapter: string;
}
