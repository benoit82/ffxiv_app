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

  // Roster management
  addRoster = (roster) => {
    return this.db.collection("rosters").add(roster);
  };

  deleteRoster = async (_id) => {
    const deletedRoster = await this.db.collection("rosters").doc(_id).delete();
    return deletedRoster;
  };

  updateRoster = (roster) => {};

  getRoster = async (roster_id, rosterSetter, errorSetter) => {
    let roster = null;
    try {
      const response = await this.db.collection("rosters").doc(roster_id).get();
      roster = { ...response.data(), _id: roster_id };
      if (roster.name !== undefined) {
        rosterSetter(roster);
      } else {
        throw new Error("Roster non trouvé");
      }
    } catch (error) {
      errorSetter(error.message);
    }
  };

  // Character management
  getAllCharacters = async (chrsSetter) => {
    let resTab = [];
    const docs = await this.db.collectionGroup("characters").get();
    docs.forEach((snap) => {
      resTab = [...resTab, { _id: snap.id, ...snap.data() }];
    });
    if (chrsSetter) chrsSetter(resTab);
    return [resTab, docs];
  };

  getCharacterByAccount = async (uid, chr_id, characterSetter, errorSetter) => {
    let chr = null;
    try {
      const response = await this.db
        .collection("users")
        .doc(uid)
        .collection("characters")
        .doc(chr_id)
        .get();
      chr = { ...response.data(), _id: chr_id };
      chr.id
        ? characterSetter(chr)
        : errorSetter(
            new Error("personnage non trouvé ou non lié à votre compte")
          );
    } catch (error) {
      errorSetter(error.message);
    }
  };

  getCharacterByAdmin = async (chr_id, characterSetter) => {
    const chrsList = await this.getAllCharacters();
    if (chrsList[0].some((chr) => chr._id === chr_id)) {
      characterSetter(chrsList[0].find((chr) => chr._id === chr_id));
    } else {
      characterSetter({});
    }
  };

  addCharacter = (uid, character) => {
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

  /**
   * not used : do not return the unsubscribe function... 😢 => useEffect on user/AddCharacter.jsx
   */
  userListCharacters = async (uid, listSetter, handleError) => {
    let unsubscribe = await this.db
      .collection("users")
      .doc(uid)
      .collection("characters")
      .orderBy("name", "asc")
      .onSnapshot(
        (snapshot) => {
          const cList = snapshot.docs.map((character, index) => ({
            _id: snapshot.docs[index].id,
            ...character.data(),
          }));
          listSetter(cList);
        },
        (error) => {
          handleError(error.message);
        }
      );
    return unsubscribe;
  };
}
export default Firebase;
