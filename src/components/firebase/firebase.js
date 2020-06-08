import app from "firebase/app";
import config from "./firebase-config";
import "firebase/auth";
import "firebase/firestore";
import { User, Character, Roster } from "../../models";

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
  signUpUser = async (email, password) => {
    return await this.auth.createUserWithEmailAndPassword(email, password);
  };

  /**
   * Connection
   * @param {string} email
   * @param {string} password
   */
  signInUser = async (email, password) => {
    this.signOutUser();
    const userCredential = await this.auth.signInWithEmailAndPassword(
      email,
      password
    );
    // fetch userDetail to be return
    return this.getUser(userCredential.user.uid);
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

  updateUser = (user, values) => {
    this.db.doc(`users/${user.uid}`).update(values);
  };

  /**
   * ! doesn't propage the error 😢
   * @deprecated
   */
  updateAuthUserEmail = async (currentEmail, password, newEmail) => {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        currentEmail,
        password
      );
      userCredential.user.updateEmail(newEmail);
    } catch (error) {
      throw error;
    }
  };

  // Roster management
  addRoster = (roster) => {
    const refRaidLeader = this.db
      .collection("characters")
      .doc(roster.refRaidLeader);
    return this.db
      .collection("rosters")
      .add({ name: roster.name, refRaidLeader });
  };

  deleteRoster = async (_id) => {
    const deletedRoster = await this.db.collection("rosters").doc(_id).delete();
    // TODO : delete as well on users table (refRosterRaidLeader) + each characters ()
    return deletedRoster;
  };

  setRoster = async (roster) => {
    const { _id } = roster;
    delete roster._id;
    this.db.collection("rosters").doc(_id).set(roster);
  };

  getRoster = async (roster_id, rosterSetter, errorSetter) => {
    let roster = null;
    try {
      const response = await this.db.collection("rosters").doc(roster_id).get();
      roster = new Roster(response);
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
    const docs = await this.db.collection("characters").get();
    docs.forEach((chrRef) => {
      resTab = [...resTab, new Character(chrRef)];
    });
    // order by name, asc
    resTab.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
    if (chrsSetter) chrsSetter(resTab);
    return [resTab, docs];
  };

  getDocByRef = async (documentRef, docSetter) => {
    docSetter((await documentRef.get()).data());
  };

  getCharacterByAccount = async (uid, chr_id, characterSetter, errorSetter) => {
    let chr = null;
    try {
      const response = await this.db.collection("characters").doc(chr_id).get();
      chr = new Character(response);
      const userRef = await this.db.doc(chr.userRef).get();
      chr.id && (userRef.uid === uid || userRef.isAdmin)
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

  addCharacter = async (uid, character) => {
    character.userRef = this.db.collection("users").doc(uid);
    //update user for chr reference
    const refChr = await this.db.collection("characters").add(character);
    let user = (await this.db.collection("users").doc(uid).get()).data();
    let characters = [];
    if (user.characters && user.characters.length > 0) {
      characters = [...user.characters, refChr];
      this.db.collection("users").doc(uid).update({ characters });
    } else {
      characters = [refChr];
      user = { ...user, characters };
      this.db.collection("users").doc(uid).set(user);
    }
  };

  deleteCharacter = async (character) => {
    const deletedChr = await this.db
      .collection("characters")
      .doc(character._id);
    // delete chr ref on rosters and users
    let characters = (await character.userRef.get()).data().characters;
    characters = characters.filter((ref) => ref.path !== deletedChr.path);
    character.userRef.update({ characters });
    // TODO : for roster
    //finally deleting chr
    deletedChr.delete();
    return deletedChr;
  };

  updateCharacter = (_id, characterFields) => {
    this.db.collection("characters").doc(_id).update(characterFields);
  };

  /**
   * not used : do not return the unsubscribe function... 😢 => useEffect on user/AddCharacter.jsx
   * @deprecated
   */
  userListCharacters = async (uid, listSetter, handleError) => {
    let unsubscribe = await this.db
      .collection("characters")
      .where("uid", "==", uid)
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
