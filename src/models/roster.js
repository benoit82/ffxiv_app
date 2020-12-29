class Roster {
  constructor (rosterDocRef = null) {
    if (rosterDocRef) {
      const data = rosterDocRef.data()
      this._id = rosterDocRef.id
      this.name = data.name
      this.refRaidLeader = data.refRaidLeader
      this.rosterMembers = data.rosterMembers
      this.label = data.name
      this.value = this._id
      this.tmp = data.tmp || false
      this.fflog = data.fflog
    }
  }
}

export default Roster
