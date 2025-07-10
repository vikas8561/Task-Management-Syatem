import React from 'react'
import {createBrowserRouter} from 'react-router-dom'
import App from './App' 
import Profile from './pages/Profile'
import Auth from './pages/auth/Auth'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/auth/Register'
import ProtectedRoute from './compoents/ProtectedRoute'

const ProtectedDashboard = () => React.createElement(ProtectedRoute, null, React.createElement(Dashboard))
const ProtectedProfile = () => React.createElement(ProtectedRoute, null, React.createElement(Profile))

export const router = createBrowserRouter([
            {
                path:'/',
                Component:App,
                children:[
                       {
                        path:'',
                        Component: ProtectedDashboard
                       } ,
                       {
                        path:'/profile',
                        Component: ProtectedProfile
                       } ,
                       {
                        path:'/auth',
                        Component:Auth,
                        children:[
                            {
                                path:'login',
                                Component:Login
                            },
                            {
                                path: 'register',
                                Component: Register
                            }
                        ]
                       }
                ]
            }
])