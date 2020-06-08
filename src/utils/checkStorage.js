const checkStorage = async (databaseObject, userSetter) => {
  if (localStorage.getItem("uid")) {
    const uid = localStorage.getItem("uid");
    try {
      const userFromDB = await databaseObject.getUser(uid);
      userSetter(userFromDB); // instance of User
      return true;
    } catch (error) {
      throw error;
    }
  } else return false;
};

export default checkStorage;
