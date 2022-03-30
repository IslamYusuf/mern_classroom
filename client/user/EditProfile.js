import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
    Button, Card, CardActions, CardContent,
    Icon, TextField, Typography, makeStyles, FormControlLabel, Switch
} from "@material-ui/core"

import { read, update } from './api-user'
import auth from '../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600, margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(12),
        paddingBottom: theme.spacing(2)
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectedTitle
    },
    error: { verticalAlign: 'middle' },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    }
}))

export default function EditProfile() {
    const classes = useStyles()
    const { userId } = useParams()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: '', password: '', email: '',
        error: '', educator: false, redirectToProfile: false
    })

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        const jwt = auth.isAuthenticated()

        if (!user.name && !user.email) {
            read({ userId: userId }, { t: jwt.token }, signal)
                .then((data) => {
                    if (data && data.error) {
                        navigate('/signin', { state: { from: { pathname } } })
                    } else {
                        setUser({ ...user, ...data })
                    }
                })
        }

        if (user.redirectToProfile) {
            navigate(`/user/${user.userId}`, { state: { from: { pathname } }, replace: true })
        }

        return function cleanup() {
            abortController.abort()
        }
    }, [userId, user.redirectToProfile])

    const handleChange = name => event => {
        setUser({ ...user, [name]: event.target.value })
    }

    const handleCheck = (event, checked) => {
        setUser({ ...user, 'educator': checked })
    }

    const clickSubmit = () => {
        const jwt = auth.isAuthenticated()
        const updatedUser = {
            name: user.name || undefined,
            email: user.email || undefined,
            password: user.password || undefined,
            educator: user.educator || undefined
        }
        update({ userId: userId }, { t: jwt.token }, updatedUser)
            .then((data) => {
                if (data && data.error) {
                    setUser({ ...user, error: data.error })
                } else {
                    auth.updateUser(data, () => {
                        setUser({ ...user, userId: data._id, redirectToProfile: true })
                    })
                }
            })
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Edit Profile
                    </Typography>
                    <TextField id="name" label="Name"
                        className={classes.textField}
                        value={user.name} onChange={handleChange('name')}
                        margin="normal" />
                    <br />
                    <TextField id="email" type="email" label="Email"
                        className={classes.textField}
                        value={user.email} onChange={handleChange('email')}
                        margin="normal" />
                    <br />
                    <TextField id="password" type="password" label="Password"
                        className={classes.textField} value={user.password}
                        onChange={handleChange('password')} margin="normal" />
                    <br />
                    <Typography variant="subtitle1" className={classes.subheading}>
                        I am an Educator
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch classes={{
                                checked: classes.checked,
                                bar: classes.bar,
                            }}
                                checked={user.educator}
                                onChange={handleCheck}
                            />}
                        label={user.educator ? 'Yes' : 'No'}
                    />
                    <br />
                    {
                        user.error && (
                            <Typography component="p" color="error">
                                <Icon color="error" className={classes.error}>error</Icon>
                                {user.error}</Typography>
                        )
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit}
                        className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        </div>
    )
}