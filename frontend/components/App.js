import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem('token') !== '') {
      localStorage.removeItem('token')
    }
    navigate('/')
    setMessage('Goodbye!')
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setSpinnerOn(true)
    fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(setMessage(res.statusText))
        const data = res.json()
        return data
      })
      .then(data => {
        setMessage(data.message)
        localStorage.setItem('token', data.token)
        redirectToArticles()
        setSpinnerOn(false)
        console.log('Success: ', data)
      })
      .catch(err => {
        setSpinnerOn(false)
        redirectToLogin()
      })
    console.log(localStorage.getItem('token'))
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(true)
    setMessage('')
    fetch(articlesUrl, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {

        setSpinnerOn(false)
        return res.json()
      })
      .then(data => {
        setSpinnerOn(false)
        setArticles(data.articles)
        setMessage(data.message)
      })
      .catch(err => {
        console.log(err.message)
        setSpinnerOn(false)

      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    fetch((articlesUrl), {
      method: 'POST',
      body: JSON.stringify({
        topic: article.topic,
        title: article.title,
        text: article.text
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setSpinnerOn(false)
        setMessage(data.message)
        let newArt = articles.concat(data.article)
        setArticles(newArt)
        setCurrentArticleId(null)
      })
      .catch(err => {
        setSpinnerOn(false)
        setMessage(err.message)
      })

  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    console.log(article)
    setSpinnerOn(true)
    fetch(`${articlesUrl}/${article_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        topic: article.topic,
        text: article.text,
        title: article.title
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        console.log(data)
        let mappedArticle = articles.map(art => { 
          if (art.article_id === article_id) return article 
           return art
        })
        setArticles(mappedArticle)
        setCurrentArticleId(null)
        setSpinnerOn(false)
        setMessage(data.message)
      })
      .catch(err => {
        console.log(err)
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true)
    fetch(`${articlesUrl}/${article_id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setMessage(data.message)
        setSpinnerOn(false)
        let removedArt = articles.filter(article => { if (article.article_id !== article_id) return true })
        setArticles(removedArt)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm
            login={login}
          />}
          />
          <Route path="articles" element={
            <>
              <ArticleForm
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={currentArticleId}
              />
              <Articles
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId && articles.find(article => article.article_id === currentArticleId)}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
