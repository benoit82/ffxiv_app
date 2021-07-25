const checkStorage = async (databaseObject, userSetter) => {
  if (localStorage.getItem('uid')) {
    const uid = localStorage.getItem('uid')
    const userFromDB = await databaseObject.getUser(uid)
    userSetter(userFromDB) // instance of User
    return true
  } else {
    return false
  }
}

export default checkStorage
