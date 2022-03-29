import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
    Avatar, Divider, List, ListItem, ListItemAvatar,
    ListItemText, Paper, Icon, Button, Typography, makeStyles
} from '@material-ui/core'

import auth from '../auth/auth-helper'
import { listByInstructor } from './api-course'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600, margin: 'auto',
        padding: theme.spacing(3), marginTop: theme.spacing(12)
    }),
    title: {
        margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
        color: theme.palette.protectedTitle, fontSize: '1.2em'
    },
    addButton: { float: 'right' },
    leftIcon: { marginRight: "8px" },
    avatar: { borderRadius: 0, width: 65, height: 40 },
    listText: { marginLeft: 16 }
}))

const MyCourses = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [courses, setCourses] = useState([])
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        listByInstructor({ userId: jwt.user._id }, { t: jwt.token }, signal)
            .then((data) => {
                if (data.error) {
                    navigate('/signin', { state: { from: { pathname } }, replace: true })
                } else {
                    setCourses(data)
                }
            })

        return function cleanup() {
            abortController.abort()
        }
    }, [])

    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography type="title" className={classes.title}>
                    Your Courses
                    <span className={classes.addButton}>
                        <Link to="/teach/course/new">
                            <Button color="primary" variant="contained">
                                <Icon className={classes.leftIcon}>add_box</Icon>  New Course
                            </Button>
                        </Link>
                    </span>
                </Typography>
                <List dense>
                    {courses.map((course, i) => {
                        return <Link to={`/teach/course/${course._id}`} key={i}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar
                                        src={`/api/courses/photo/${course._id}?${new Date().getTime()}`}
                                        className={classes.avatar}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={course.name}
                                    secondary={course.description}
                                    className={classes.listText} />
                            </ListItem>
                            <Divider />
                        </Link>
                    })}
                </List>
            </Paper>
        </div>
    )
}

export default MyCourses