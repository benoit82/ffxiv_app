const checkStorage = async (databaseObject, userSetter) => {
  if (localStorage.getItem("user") !== null) {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      userSetter(user);
      const userFromDB = await databaseObject.getUser(user.uid); // new User()
      userSetter(userFromDB); // instance of User
      return true;
    } catch (error) {
      throw error;
    }
  } else return false;
};

export default checkStorage;
