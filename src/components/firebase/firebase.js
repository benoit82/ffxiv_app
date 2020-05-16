import app from "firebase/app";
import config from "./firebase-config";
import "firebase/auth";
import "firebase/firestore";
import { User } from "../../models";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  /**
   * Inscription
   * @param {string} email
   * @param {string} password
   */
  signUpUser = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  /**
   * Connection
   * @param {string} email
   * @param {string} password
   */
  signInUser = async (email, password) => {
    const authUser = await this.auth.signInWithEmailAndPassword(
      email,
      password
    );
    // fetch userDetail to be return
    return this.getUser(authUser.user.uid);
  };

  /**
   * Deconnection
   */
  signOutUser = () => this.auth.signOut();

  /**
   * Reset password
   * @param {string} email
   */
  passwordReset = async (email) =>
    await this.auth.sendPasswordResetEmail(email);

  // User management
  /**
   * Add a new user to DB
   * @param {string} userId
   * @param {object} configNewUser
   * @returns {Promise<T>}
   */
  addUser = (uid, configNewUser) => {
    return this.db.collection("users").doc(uid).set(configNewUser);
  };

  getUser = async (uid) => {
    const user = (await this.db.doc(`users/${uid}`).get()).data();
    return new User(user);
  };

  // Character management
  addCharacter = (uid, character) => {
    // replace id by lodestoneId
    return this.db
      .collection("users")
      .doc(uid)
      .collection("characters")
      .add(character);
  };

  deleteCharacter = async (uid, character) => {
    const deletedChr = await this.db
      .collection("users")
      .doc(uid)
      .collection("characters")
      .doc(character._id)
      .delete();
    return deletedChr;
  };

  userListCharacter = (uid, listSetter) => {
    return this.db
      .collection("users")
      .doc(uid)
      .collection("characters")
      .orderBy("name", "asc")
      .onSnapshot((snapshot) => {
        const cList = snapshot.docs.map((character, index) => ({
          _id: snapshot.docs[index].id,
          ...character.data(),
        }));
        listSetter(cList);
      });
  };
}
export default Firebase;
