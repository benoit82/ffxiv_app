class User {
  constructor({
    uid,
    pseudo,
    email,
    isAdmin,
    isCrafter,
    isGatherer,
    refRosterRaidLeader,
    createdAt,
    characters,
  }) {
    this.uid = uid;
    this.pseudo = pseudo;
    this.email = email;
    this.isAdmin = isAdmin;
    this.isCrafter = isCrafter;
    this.isGatherer = isGatherer;
    this.refRosterRaidLeader = refRosterRaidLeader || null;
    this.createdAt =
      createdAt !== undefined ? createdAt.toDate().toLocaleDateString() : null;
    this.characters = characters || [];
    this.isLoggedIn = true;
  }
}

export default User;
