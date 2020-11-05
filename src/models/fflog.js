class FFlog {
  constructor(fflogDocRef = null) {
    if (fflogDocRef) {
      const data = fflogDocRef.data();

      this._id = fflogDocRef.id;
      this.date = data.date.toDate().toLocaleDateString();
      this.url = data.url;
    }
  }
}

export default FFlog;
