import firebase from "firebase";
import Assessment from "../dtos/assessments";
import AssessmentSubmission from "../dtos/assessment-submission";
import { AuthService } from "./auth-service";

export const Assessment = {
  getAll: () => {
    return firebase
      .database()
      .ref(`assessments`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          const value = snapshot.val();
          const keys = Object.keys(value);

          return keys.map((key) => {
            return {
              ...value[key],
              key,
            };
          });
        }
      });
  },
  /**
   * @param {*} id doc id
   */
  getOne: (data: any) => {
    return new Promise((res, rej) => {
      firebase
        .database()
        .ref(`assessments/${data.course}/${data.chapter}`)
        .once("value")
        .then((snapshot) => {
          res(snapshot.val());
        });
    });
  },
  /**
   * @param {*} data form data
   */
  add: (data: Assessment) => {
    return firebase
      .database()
      .ref(`assessments/${data.course}/${data.lesson}`)
      .set({
        title: data.title,
        content: data.content,
        lesson: data.lesson,
        created: new Date().toISOString(),
      });
  },
  /**
   * @param {*} id  doc id
   */
  delete: (course: string, id: string) => {
    return firebase.database().ref(`assessments/${course}/${id}`).remove();
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
      });
  },
  // assessments/submissions/angular/chapterkey/Thembisa/uid
  submit: (values: AssessmentSubmission) => {
    return new Promise((res, rej) => {
      AuthService.isLoggedIn().then((user: any) => {
        firebase
          .database()
          .ref(
            `assessments/submissions/${values.course}/${values.chapter}/${user.uid}`
          )
          .set(values)
          .then((data) => {
            res(data);
          })
          .catch((err) => {
            rej(err);
          });
      });
    });
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
          .ref(
            `assessments/submissions/${data.course}/${data.chapter}/${user.uid}`
          )
          .get()
          .then((data) => {
            res(data.val());
          });
      });
    });
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
        .ref(`assessments/submissions/${course}`)
        .get()
        .then((data) => {
          res(data.val());
        });
    });
  },
  getAllSubmissionsByChapter: (data: any) => {
    return new Promise((res, rej) => {
      firebase
        .database()
        .ref(`assessments/submissions/${data.course}/${data.chapter}`)
        .get()
        .then((data) => {
          res(data.val());
        });
    });
  },
  // /assessments/submissions
  getAllSubmissionsByLocation: (data: any) => {
    return new Promise((res, rej) => {
      firebase
        .database()
        .ref(`assessments/submissions/${data.course}/${data.chapter}`)
        .orderByChild("location")
        .equalTo(data.location?.label || data.location)
        .get()
        .then((data) => {
          res(data.val());
        })
        .catch((err) => {
          rej(err);
        });
    });
  },
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
