import { useState, useEffect } from "react";
import {db} from '../firebase/config'
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";

// PODE OU NÃO RECEBER A VARIAVEL SEARCH, PARA CASO SEJA FEITA UMA PESQUISA
export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    async function loadData() {
      if(cancelled) return;

      setLoading(true)

      const collectionRef = collection(db, docCollection)

      // SE HOUVER PESQUISA PROCURE PELA PESQUISA NAS TAGS
      // SE NÃO MOSTRE TUDO
      try {
        let q;
        if (search) {
          // por pesquisa nas tags
          q = query(
            collectionRef,
            where('tagsArray', 'array-contains', search),
            orderBy('createdAt', 'desc')
          )
          // por id de usuario, cada usuario com seus posts
        } else if(uid) {
          q = query(
            collectionRef,
            where('uid', '==', uid),
            orderBy('createdAt', 'desc')
          )
          // todos os posts
        } else {          
          q = query(collectionRef, orderBy('createdAt', 'desc'))
        }

        // mapeando os dados para que caso tenha mudanças, 
        // sejam pegues os mais recentes
        onSnapshot(q, (querySnapshot) => {

          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          )
        })
        
        setLoading(false)

      } catch (error) {
        console.log(error);
        setError(error.message)
        setLoading(false)
      }
    }

    loadData();
  }, [docCollection, search, uid, cancelled])

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return {documents, loading, error};
}