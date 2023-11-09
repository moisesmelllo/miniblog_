// referencia para imagens
// http://lorempixel.com.br/500/400/?1

import styles from './CreatePost.module.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useAuthValue} from '../../context/AuthContext'
import { useInsertDocument } from '../../hooks/useInsertDocument'

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState('');

  const {insertDocument, response} = useInsertDocument('posts')
  const {user} = useAuthValue()

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

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    });

    // redirect to home page
    navigate('/')
  }

  return (
    <div className={styles.create_post}>
      <h2>Create Post</h2>
      <p>Escreva sobre o que quiser compartilhar</p>
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
          <button className='btn'>Cadastrar</button> :
          <button className='btn'>Aguarde... </button>
        }
        {response.error || formError && <p className='error'>{response.error || formError}</p>}
      </form>
    </div>
  )
}

export default CreatePost