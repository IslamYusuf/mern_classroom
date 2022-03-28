import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    Card, CardHeader, CardMedia, Divider, IconButton, makeStyles,
    Typography
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'

import { read } from './api-course'
import auth from '../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800, margin: 'auto',
        padding: theme.spacing(3), marginTop: theme.spacing(12)
    }),
    flex: { display: 'flex', marginBottom: 20 },
    card: { padding: '24px 40px 40px' },
    subheading: {
        margin: '10px',
        color: theme.palette.openTitle
    },
    details: { margin: '16px', },
    sub: {
        display: 'block', margin: '3px 0px 5px 0px',
        fontSize: '0.9em'
    },
    media: {
        height: 190, marginLeft: '16px',
        display: 'inline-block', width: '100%',
    },
    icon: { verticalAlign: 'sub' },
    category: {
        color: '#5c5c5c', marginTop: 5, fontSize: '0.9em',
        padding: '3px 5px', backgroundColor: '#dbdbdb',
        borderRadius: '0.2em',
    },
    action: {
        margin: '10px 0px',
        display: 'flex', justifyContent: 'flex-end'
    },
    statSpan: {
        margin: '7px 10px 0 10px', display: 'inline-flex',
        alignItems: 'center', color: '#616161',
        '& svg': { marginRight: 10, color: '#b6ab9a' }
    },
    enroll: { float: 'right' }
}))

const Course = () => {
    const classes = useStyles()
    const { courseId } = useParams()
    const [course, setCourse] = useState({ instructor: {} })
    const [values, setValues] = useState({ error: '' })

    const imageUrl = course._id
        ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
        : '/api/courses/defaultphoto'

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({ courseId }, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCourse(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [courseId])

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardHeader title={course.name}
                    subheader={
                        <div>
                            <Link to={`/user/${course.instructor._id}`} className={classes.sub}>
                                By {course.instructor.name}
                            </Link>
                            <span className={classes.category}>{course.category}</span>
                        </div>
                    }
                    action={
                        <>
                            {auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.instructor._id &&
                                (<span className={classes.action}>
                                    <Link to={`/teach/course/edit/${course._id}`}>
                                        <IconButton aria-label="Edit" color="secondary">
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    {/* !course.published ? (<>
                                    <Button color="secondary" variant="outlined"
                                        onClick={clickPublish}>
                                        {course.lessons.length == 0 ? "Add atleast 1 lesson to publish" : "Publish"}
                                    </Button>
                                    <DeleteCourse course={course} onRemove={removeCourse} />
                                </>) : (
                                    <Button color="primary" variant="outlined">Published</Button>
                                ) */}
                                </span>)
                            }
                            {/* course.published && (<div>
                                <span className={classes.statSpan}>
                                    <PeopleIcon /> {stats.totalEnrolled} enrolled </span>
                                <span className={classes.statSpan}>
                                    <CompletedIcon /> {stats.totalCompleted} completed </span>
                            </div>
                            ) */}
                        </>
                    }
                />
                <div className={classes.flex}>
                    <CardMedia image={imageUrl} title={course.name}
                        className={classes.media} />
                    <div className={classes.details}>
                        <Typography variant="body1" className={classes.subheading}>
                            {course.description}<br />
                        </Typography>
                        {/* course.published &&
                            <div className={classes.enroll}>
                                <Enroll courseId={course._id} />
                            </div>
                        */}
                    </div>
                </div>
                <Divider />
            </Card>
        </div>
    )
}

export default Course