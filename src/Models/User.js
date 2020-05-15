class User {
  constructor({
    uid,
    pseudo,
    email,
    isAdmin,
    isCrafter,
    isGatherer,
    isRaidLeader,
    createdAt,
  }) {
    this.uid = uid;
    this.pseudo = pseudo;
    this.email = email;
    this.isAdmin = isAdmin;
    this.isCrafter = isCrafter;
    this.isGatherer = isGatherer;
    this.isRaidLeader = isRaidLeader;
    this.createdAt = createdAt;
    this.isLoggedIn = true;
  }
}

export default User;
