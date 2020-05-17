const checkStorage = async (databaseObject, userSetter) => {
  if (localStorage.getItem("uid") !== null) {
    const uid = JSON.parse(localStorage.getItem("uid"));
    try {
      const userFromDB = await databaseObject.getUser(uid); // new User()
      userSetter(userFromDB); // instance of User
      return true;
    } catch (error) {
      throw error;
    }
  } else return false;
};

export default checkStorage;
