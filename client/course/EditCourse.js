import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    Card, CardHeader, CardMedia, Typography, IconButton,
    Button, makeStyles, List, ListItem, ListItemAvatar,
    TextField, Avatar, ListItemSecondaryAction,
    ListItemText, Divider
} from '@material-ui/core'
import { Delete, ArrowUpward } from '@material-ui/icons'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'

import { read, update } from './api-course.js'
import auth from './../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800, margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
    }),
    flex: { display: 'flex', marginBottom: 20 },
    card: { padding: '24px 40px 40px' },
    subheading: {
        margin: '10px',
        color: theme.palette.openTitle
    },
    details: { margin: '16px', },
    upArrow: {
        border: '2px solid #f57c00',
        marginLeft: 3, marginTop: 10,
        padding: 4
    },
    sub: {
        display: 'block', fontSize: '0.9em',
        margin: '3px 0px 5px 0px',
    },
    media: {
        height: 250, display: 'inline-block',
        width: '50%', marginLeft: '16px'
    },
    icon: { verticalAlign: 'sub' },
    textfield: { width: 350 },
    action: { margin: '8px 24px', display: 'inline-block' },
    input: { display: 'none' },
    filename: { marginLeft: '10px' },
    list: { backgroundColor: '#f3f3f3' }
}))

export default function EditCourse() {
    const classes = useStyles()
    const navigate = useNavigate()
    const { courseId } = useParams()
    const [course, setCourse] = useState({
        name: '', description: '',
        image: '', category: '',
        instructor: {}, lessons: []
    })
    const [values, setValues] = useState({ error: '' })
    const jwt = auth.isAuthenticated()

    const imageUrl = course._id
        ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
        : '/api/courses/defaultphoto'

    const handleChange = name => event => {
        const value = name === 'image'
            ? event.target.files[0]
            : event.target.value
        setCourse({ ...course, [name]: value })
    }

    const handleLessonChange = (name, index) => event => {
        const lessons = course.lessons
        lessons[index][name] = event.target.value
        setCourse({ ...course, lessons: lessons })
    }

    const deleteLesson = index => e => {
        const lessons = course.lessons
        lessons.splice(index, 1)
        setCourse({ ...course, lessons: lessons })
    }

    const moveUp = index => e => {
        const lessons = course.lessons
        const moveUp = lessons[index]
        lessons[index] = lessons[index - 1]
        lessons[index - 1] = moveUp
        setCourse({ ...course, lessons: lessons })
    }

    const clickSubmit = () => {
        let courseData = new FormData()
        course.name && courseData.append('name', course.name)
        course.description && courseData.append('description', course.description)
        course.image && courseData.append('image', course.image)
        course.category && courseData.append('category', course.category)
        courseData.append('lessons', JSON.stringify(course.lessons))

        update({ courseId }, { t: jwt.token }, courseData)
            .then((data) => {
                if (data && data.error) {
                    console.log(data.error)
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({ ...values, error: '' })
                    navigate(`/teach/course/${course._id}`, { replace: true })
                }
            })
    }

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({ courseId }, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                data.image = ''
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
                <CardHeader title={
                    <TextField onChange={handleChange('name')}
                        type="text" margin="dense" label="Title"
                        value={course.name} fullWidth
                    />}
                    subheader={<div>
                        <Link to={`/user/${course.instructor._id}`}
                            className={classes.sub}>By {course.instructor.name}
                        </Link>
                        {<TextField margin="dense" value={course.category}
                            label="Category" type="text" fullWidth
                            onChange={handleChange('category')}
                        />}
                    </div>}
                    action={auth.isAuthenticated().user
                        && auth.isAuthenticated().user._id == course.instructor._id
                        && (<span className={classes.action}>
                            <Button variant="contained" onClick={clickSubmit}
                                color="secondary">Save</Button>
                        </span>)
                    }
                />
                <div className={classes.flex}>
                    <CardMedia className={classes.media}
                        image={imageUrl} title={course.name} />
                    <div className={classes.details}>
                        <TextField margin="dense" multiline rows="5"
                            label="Description" className={classes.textfield}
                            value={course.description} type="text"
                            onChange={handleChange('description')}
                        /><br /><br />
                        <input accept="image/*" className={classes.input}
                            onChange={handleChange('image')}
                            id="icon-button-file" type="file" />
                        <label htmlFor="icon-button-file">
                            <Button variant="outlined"
                                color="secondary" component="span">
                                Change Photo
                                <FileUpload />
                            </Button>
                        </label>
                        <span className={classes.filename}>{
                            course.image ? course.image.name : ''
                        }</span><br />
                    </div>
                </div>
                <Divider />
                <div>
                    <CardHeader title={<Typography variant="h6"
                        className={classes.subheading}>
                        Lessons - Edit and Rearrange
                    </Typography>}
                        subheader={<Typography variant="body1"
                            className={classes.subheading}>
                            {course.lessons && course.lessons.length} lessons
                        </Typography>}
                    />
                    <List>
                        {course.lessons && course.lessons.map((lesson, index) => {
                            return (<span key={index}>
                                <ListItem className={classes.list}>
                                    <ListItemAvatar>
                                        <>
                                            <Avatar>{index + 1}</Avatar>
                                            {index != 0 &&
                                                <IconButton aria-label="up" className={classes.upArrow}
                                                    color="primary" onClick={moveUp(index)} >
                                                    <ArrowUpward />
                                                </IconButton>
                                            }
                                        </>
                                    </ListItemAvatar>
                                    <ListItemText primary={<>
                                        <TextField
                                            margin="dense" label="Title" fullWidth
                                            type="text" onChange={handleLessonChange('title', index)}
                                            value={lesson.title} /><br />
                                        <TextField margin="dense" multiline rows="5"
                                            onChange={handleLessonChange('content', index)}
                                            label="Content" type="text"
                                            fullWidth value={lesson.content} /><br />
                                        <TextField margin="dense" label="Resource link"
                                            type="text" value={lesson.resource_url} fullWidth
                                            onChange={handleLessonChange('resource_url', index)} /><br /></>}
                                    />
                                    {!course.published
                                        && <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="up"
                                                color="primary" onClick={deleteLesson(index)}>
                                                <Delete />
                                            </IconButton>
                                        </ListItemSecondaryAction>}
                                </ListItem>
                                <Divider style={{ backgroundColor: 'rgb(106, 106, 106)' }} component="li" />
                            </span>)
                        }
                        )}
                    </List>
                </div>
            </Card>
        </div>)
}