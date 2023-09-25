import firebase from "firebase";
import { AuthService } from "./auth-service";
import Student from "../dtos/student";
import Project from "../dtos/project-dto";

export const StudentsService = {
  students: (): Promise<{
    groups: any;
    students: Student[];
  }> => {
    return AuthService.currentUser().then((user) => {
      if (user) {
        return firebase
          .database()
          .ref(`users`)
          .once("value")
          .then((snapshot) => {
            const value = snapshot.val();
            const keys = Object.keys(value);

            return keys
              .map((key) => {
                return {
                  ...value[key],
                  key,
                  year: value[key].createdAt
                    ? new Date(value[key].createdAt).getFullYear()
                    : "2022",
                };
              })
              .filter((student) => {
                return (
                  user &&
                  user.role == "facilitator" &&
                  user.groups.indexOf(student.location) != -1
                );
              })
              .sort((a, b) => (a.firstname < b.firstname ? -1 : 1));
          })
          .then((students) => {
            return {
              groups: user.groups,
              students: students,
            };
          });
      } else {
        return {
          groups: [],
          students: [],
        };
      }
    });
  },
  createProject: (data: Project, profile: any) => {
    return new Promise((resolve, reject) => {
      return firebase
        .database()
        .ref(`codetribe-projects/${profile.uid}/${data.framework}`).push(data).then(snap => {
          resolve(true)
        }).catch(err => reject(err))
    })
  },
  getProjects: (uid: string) => {
    return new Promise((resolve, reject) => {
      return firebase
        .database()
        .ref(`codetribe-projects/${uid}`).on('value', (snap) => {
          resolve(snap.val())
        })
    })
  },
  deleteProject: (uid: string, course: string, key?: string) => {
    return new Promise((resolve, reject) => {
      return firebase
        .database()
        .ref(`codetribe-projects/${uid}/${course}/${key}`)
        .remove().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },
  updateProject: (data: Project, profile: any, key: string) => {
    return new Promise((resolve, reject) => {
      return firebase
        .database()
        .ref(`codetribe-projects/${profile.uid}/${data.framework}/${key}`).set(data).then(snap => {
          resolve(snap)
        }).catch(err => reject(err))
    })
  },
  createNote: ({ uid, note, lessonId, chapterId }: { uid: string, note: string, lessonId: string, chapterId: string }) => {
    return new Promise((resolve, reject) => {
      return firebase.database()
        .ref(`notes/${uid}/${chapterId}`)
        .set({ note: note, lesson: lessonId, chapter: chapterId })
        .then((data) => { resolve(data) })
        .catch(err => { reject(err) })
    })
  },
  getNote: ({ uid, lessonId, chapterId }: { uid: string, lessonId: string, chapterId: string }) => {
    return new Promise((resolve, reject) => {
      return firebase.database()
        .ref(`notes/${uid}/${chapterId}`)
        .on('value', (snap) => {
          if (snap) {
            const data: { note: string, lesson: string, chapter: string } = {
              chapter: snap.val().chapter,
              lesson: snap.val().lesson,
              note: snap.val().note
            }
            resolve(data)
          } else {
            reject(false)
          }

        })
    })
  },
};
