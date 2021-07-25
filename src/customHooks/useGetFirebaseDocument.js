import { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from '../components/firebase'
import { toast } from '../utils/globalFunctions'

/**
 *
 * @param {string} path "collection/docId", "collection/docId/subCollection/subDocId"
 * @param {Class} C Class for instance
 * @return {instanceType<Class>} instance of class C
 */
const useGetFirebaseDocument = (path, C) => {
  const [cInstance, setCInstance] = useState(null)
  const firebase = useContext(FirebaseContext)

  useEffect(() => {
    const unsubscribe = firebase.db.doc(path).onSnapshot(
      snap => setCInstance(new C(snap)),
      error =>
        toast(
          'error',
          `erreur d'écoute de la base de donnée : ${error.message}`
        )
    )
    return () => unsubscribe()
  }, [firebase, path, C])

  return [cInstance, setCInstance]
}

export default useGetFirebaseDocument
