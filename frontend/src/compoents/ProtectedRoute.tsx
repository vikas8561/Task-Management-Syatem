import React, { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Auth.context'

const ProtectedRoute = ({children}:{children:ReactNode}) => {
    const navigate = useNavigate()
    const { user, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading && !user.email) {
            navigate("/auth/login")
        }
    }, [user, isLoading, navigate])

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!user.email) {
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute