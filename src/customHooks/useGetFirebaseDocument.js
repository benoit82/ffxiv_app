import { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../components/firebase";
import { toast } from "../utils/globalFunctions";

/**
 *
 * @param {string} path "collection/docId", "collection/docId/subCollection/subDocId"
 * @param {Class} c Class for instance
 * @return {instanceType<Class>} instance of class C
 */
const useGetFirebaseDocument = (path, c) => {
  const [roster, setRoster] = useState(null);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    let unsubscribe = firebase.db.doc(path).onSnapshot(
      (snap) => setRoster(new c(snap)),
      (error) =>
        toast(
          "error",
          `erreur d'écoute de la base de donnée : ${error.message}`
        )
    );
    return () => unsubscribe();
  }, [firebase, path, c]);

  return roster;
};

export default useGetFirebaseDocument;
