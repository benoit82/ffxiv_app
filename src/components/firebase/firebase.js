import app from "firebase/app";
import config from "./firebase-config";
import "firebase/auth";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
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
    this.auth.signInWithEmailAndPassword(email, password);
  };

  /**
   * Deconnection
   */
  signOutUser = () => this.auth.signOut();
}

export default Firebase;
