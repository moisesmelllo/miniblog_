// referencia para imagens
// http://lorempixel.com.br/500/400/?1

import styles from './EditPost.module.css'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {useAuthValue} from '../../context/AuthContext'
import { useFetchDocument } from '../../hooks/useFetchDocument'
import { useUpdateDocument } from '../../hooks/useUpdateDocument'

const EditPost = () => {
  const {id} = useParams()
  const {document: post} = useFetchDocument('posts', id)


  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if(post) {
      setTitle(post.title)
      setBody(post.body)
      setImage(post.image)

      const textTags = post.tagsArray.join(', ')
      setTags(textTags)
    }
  }, [post])

  const {user} = useAuthValue()
  const {updateDocument, response} = useUpdateDocument('posts')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    // validate image URL
    try {
      new URL(image)
    } catch (error) {
      setFormError('A imagem precisa ser uma URL')
    }

    // create the array of tags
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());

    // check all the data
    if(!title || !image, !tags, !body) {
      setFormError('por favor, preencha todos os campos');
    }

    if(formError) return;

    const data = {
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    }

    updateDocument(id, data);


    navigate('/dashboard')
  }

  return (
    <div className={styles.create_post}>
      {post && (
        <>
          <h2>Edit Post: {post.title}</h2>
      <p>Altere os dados do post como desejar</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Titulo</span>
          <input 
            type="text" 
            name='title' 
            required  
            placeholder='pense em um bom titulo..'
            value={title}
            onChange={(e) => setTitle(e.target.value)}  
          />
        </label>
        <label>
          <span>URL da imagem:</span>
          <input 
            type="text" 
            name='image'
            required
            placeholder='Insira uma imagem que representa o seu post'
            value={image}
            onChange={(e) => setImage(e.target.value)}  
          />
        </label>
        <p className={styles.preview_title}>Preview da imagem atual:</p>
        <img className={styles.image_preview} src={post.image} alt={post.title} />
        <label>
          <span>Conteudo:</span>
          <textarea 
            name="body"
            required
            placeholder='Insira o conteudo do post'
            value={body}
            onChange={(e) => setBody(e.target.value)}  
          />
        </label>
        <label>
          <span>Tags:</span>
          <input 
            type="text" 
            name='tags'  
            required
            placeholder='Insira as tags separadas por virgula'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </label>
        {!response.loading ? 
          <button className='btn'>Editar</button> :
          <button className='btn'>Aguarde... </button>
        }
        {response.error || formError && <p className='error'>{response.error || formError}</p>}
      </form>
        </>
      )}
    </div>
  )
}

export default EditPost