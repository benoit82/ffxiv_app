import app from "firebase/app";
import config from "./firebase-config";
import "firebase/auth";
import "firebase/firestore";

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
  signInUser = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  /**
   * Deconnection
   */
  signOutUser = () => this.auth.signOut();

  /**
   * Reset password
   * @param {string} email
   */
  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  /**
   * Get a document by reference
   * @param {string} collection name of the collection (users...)
   * @param {string} docReference reference to the document seeked (userid...)
   * @returns {Promise<T>}
   */
  getDocument = async (collection, docReference) =>
    await this.db.collection(collection).doc(docReference).get();
}
export default Firebase;
