import React, { useEffect, useState } from 'react'
import {
    Avatar, Divider, List, ListItem,
    ListItemAvatar, ListItemText
} from '@material-ui/core'
import { useNavigate, useLocation, Link } from 'react-router-dom'

import auth from '../auth/auth-helper'
import { listByInstructor } from './api-course'

const MyCourses = () => {
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
        <List>
            {
                courses.map((course, i) => {
                    return <Link to={`/teach/course/${course._id}`} key={i}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar src={`/api/courses/photo/${course._id}?${new Date().getTime()}`} />
                            </ListItemAvatar>
                            <ListItemText primary={course.name} secondary={course.description} />
                        </ListItem>
                        <Divider />
                    </Link>
                })
            }
        </List>
    )
}

export default MyCourses