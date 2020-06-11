import app from "firebase/app";
import config from "./firebase-config";
import "firebase/auth";
import "firebase/firestore";
import { User, Character } from "../../models";

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
  signOutUser = () => {
    localStorage.removeItem("uid");
    this.auth.signOut();
  };

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
    const user = await this.db.doc(`users/${uid}`).get();
    return new User(user);
  };

  updateUser = (user, values) => {
    this.db.doc(`users/${user.uid}`).update(values);
  };

  // Roster management
  addRoster = async (roster) => {
    const refDocRoster = await this.db.collection("rosters").add(roster);

    // Adding the refDocRoster to character Raid Leader
    roster.refRaidLeader.update({ rosterRaidLeader: refDocRoster });

    return refDocRoster.id;
  };

  deleteRoster = async (_id, deleteChr = null) => {
    const refDeletedRoster = this.db.collection("rosters").doc(_id);
    const dataRoster = (await refDeletedRoster.get()).data();
    if (!deleteChr) {
      dataRoster.refRaidLeader.update({
        rosterRaidLeader: null,
      });
    }
    if (dataRoster.rosterMembers && dataRoster.rosterMembers.length > 0) {
      dataRoster.rosterMembers.forEach((refMember) => {
        refMember.update({ rosterMember: null });
      });
    }
    refDeletedRoster.delete();
  };

  updateRoster = async (roster) => {
    const { _id, rosterMembers } = roster;
    delete roster._id;
    const rosterDocRef = this.db.collection("rosters").doc(_id);
    // update old rostermember and remove the reference
    let oldMembersRef = (await rosterDocRef.get()).data().rosterMembers;
    if (oldMembersRef.length > 0) {
      oldMembersRef = oldMembersRef.filter((chrRef) => {
        return rosterMembers.some((memberRef) => !memberRef.isEqual(chrRef));
      });
      oldMembersRef.forEach((refMember) => {
        refMember.update({ rosterMember: null });
      });
    }
    // then we update the roster document
    rosterDocRef.update(roster);
    //for each member : add a reference
    if (rosterMembers.length > 0) {
      rosterMembers.forEach((refMember) => {
        refMember.update({ rosterMember: rosterDocRef });
      });
    }
  };

  // Character management
  getAllCharacters = async (chrsSetter, { filter } = null) => {
    let resTab = [];
    const docs = await this.db.collection("characters").get();
    docs.forEach((chrRef) => {
      resTab = [...resTab, new Character(chrRef)];
    });
    // order by name, asc
    resTab.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
    switch (filter) {
      case "rosterRaidLeader":
        resTab = resTab.filter((chr) => chr.rosterRaidLeader === null);
        break;
      default:
        break;
    }
    if (chrsSetter) chrsSetter(resTab);
    return [resTab, docs];
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
    // delete chr ref on users
    let characters = (await character.userRef.get()).data().characters;
    characters = characters.filter((ref) => !ref.isEqual(deletedChr));
    character.userRef.update({ characters });
    if (character.rosterRaidLeader)
      this.deleteRoster(character.rosterRaidLeader.id, deletedChr);
    // delete chrRef on roster
    if (character.rosterMember) {
      let rosterMembers = (await character.rosterMember.get()).data()
        .rosterMembers;
      rosterMembers = rosterMembers.filter(
        (chrRef) => !chrRef.isEqual(deletedChr)
      );
      character.rosterMember.update({ rosterMembers });
    }
    //finally deleting chr
    deletedChr.delete();
    return deletedChr;
  };

  updateCharacter = (_id, characterFields) => {
    this.db.collection("characters").doc(_id).update(characterFields);
  };

  getDocByRef = async (documentRef, docSetter) => {
    docSetter((await documentRef.get()).data());
  };
}
export default Firebase;
