import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import auth from './auth-helper'

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            navigate('/signin', { state: { from: { pathname } }, replace: true })
        }
    }, [])

    return auth.isAuthenticated()
        ? children
        : (<div>Loading...</div>)
}

export default PrivateRoute