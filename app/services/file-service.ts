import firebase from "firebase";

const storageRef = firebase.storage().ref()

export const FileService = {
  upload: (data: string) => {
    return new Promise((resolve, reject) => {
      const imageRef = storageRef.child(`profilepictures/${data}`);
      storageRef.putString(data).then(snap => {
        resolve({ message: 'uploaded ', image: snap });
      })
    })
  }
}
