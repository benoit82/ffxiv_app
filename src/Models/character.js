class Character {
  constructor(characterDocRef = null) {
    if (characterDocRef) {
      const data = characterDocRef.data();

      this._id = characterDocRef.id;
      this.avatar = data.avatar;
      this.portrait = this.avatar.replace("c0_96x96.jpg", "l0_640x873.jpg");
      this.bis = data.bis || null;
      this.id = data.id; // lodestoneId (from xivApi)
      this.lang = data.lang; // lang ingame (from xivApi)
      this.mainJob = data.mainJob || null;
      this.secondJob = data.secondJob || null;
      this.thirdJob = data.thirdJob || null;
      this.name = data.name;
      this.server = data.server;
      this.userRef = data.userRef;
      this.rosterRaidLeader = data.rosterRaidLeader || null;
      // label + value for react-select
      this.label = data.mainJob
        ? `${data.name} - ${data.mainJob}`
        : `${data.name} - (???)`;
      this.value = this._id;
    }
  }
}

export default Character;
