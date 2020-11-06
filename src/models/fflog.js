export default class FFlog {
  constructor(fflogDocRef = null) {
    if (fflogDocRef) {
      const data = fflogDocRef.data();

      this._id = fflogDocRef.id;
      this.title = data.title;
      this.dateRaid = data.dateRaid;
      this.fflogurl = data.fflogurl;
      this.pseudo = data.pseudo;
    }
  }

  showDate() {
    return this.dateRaid.toDate().toLocaleDateString();
  }
}
