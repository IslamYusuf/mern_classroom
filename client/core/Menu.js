import React from 'react'
import {
    AppBar, Button, IconButton,
    Toolbar, Typography
} from '@material-ui/core'
import { Home, LocalLibrary } from '@material-ui/icons'
import { useLocation, useNavigate, Link } from "react-router-dom";

import auth from './../auth/auth-helper'

const Menu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (location, path) => {
        if (location.pathname == path)
            return { color: '#ff4081' }
        else
            return { color: '#ffffff' }
    }

    const isPartActive = (location, path) => {
        if (location.pathname.includes(path))
            return {
                color: '#fffde7', marginRight: 10,
                backgroundColor: '#f57c00'
            }
        else return {
            color: '#616161', backgroundColor: '#fffde7',
            border: '1px solid #f57c00', marginRight: 10
        }
    }

    return (
        <AppBar position="fixed" style={{ zIndex: 12343455 }}>
            <Toolbar>
                <Typography variant="h6" color="inherit">
                    MERN Classroom
                </Typography>
                <div>
                    <Link to="/">
                        <IconButton aria-label="Home" style={isActive(location, "/")}>
                            <Home />
                        </IconButton>
                    </Link>
                </div>
                <div style={{ 'position': 'absolute', 'right': '10px' }}>
                    <span style={{ 'float': 'right' }}>
                        {!auth.isAuthenticated() && (
                            <span>
                                <Link to="/signup">
                                    <Button style={isActive(location, "/signup")}> Sign Up </Button>
                                </Link>
                                <Link to="/signin">
                                    <Button style={isActive(location, "/signin")}> Sign In </Button>
                                </Link>
                            </span>
                        )}
                        {auth.isAuthenticated() && (
                            <span>
                                {auth.isAuthenticated().user.educator &&
                                    (<Link to="/teach/courses">
                                        <Button style={isPartActive(location, "/teach/")}>
                                            <LocalLibrary /> Teach </Button>
                                    </Link>)
                                }
                                <Link to={`/user/${auth.isAuthenticated().user._id}`}>
                                    <Button style={
                                        isActive(location, `/user/${auth.isAuthenticated().user._id}`)
                                    }>
                                        My Profile
                                    </Button>
                                </Link>
                                <Button color="inherit"
                                    onClick={() => { auth.clearJWT(() => navigate('/')) }}>
                                    Sign out
                                </Button>
                            </span>
                        )}
                    </span>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Menu