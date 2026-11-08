import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import { get_me } from './features/auth.js'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from './redux/userSlice.js'
import MyAgents from './pages/MyAgents'
import CreateAgent from './pages/CreateAgent'
import Integration from './pages/Integration'
import Billings from './pages/Billings'

const App = () => {
  const dispatch = useDispatch()
  const {userData} = useSelector(state => state.user)
  useEffect(() => {
    const fetch_user = async () => {
      try {
        const user_data = await get_me()
        dispatch(setUserData(user_data))
      } catch (error) {
        console.log(error)
      }
    }
    fetch_user()
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={!userData ? <Navigate to={'/login'}/> : <Home />} />
          <Route path='/agents' element={!userData ? <Navigate to={'/login'}/> : <MyAgents />} />
          <Route path='/agents/new' element={!userData ? <Navigate to={'/login'}/> : <CreateAgent />} />
          <Route path='/integration' element={!userData ? <Navigate to={'/login'}/> : <Integration />} />
          <Route path='/billings' element={!userData ? <Navigate to={'/login'}/> : <Billings />} />
          <Route path='/login' element={userData ? <Navigate to={'/'}/> : <Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App