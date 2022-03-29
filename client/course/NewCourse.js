import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Button, TextField, Typography, Card, CardActions,
    CardContent, Icon, makeStyles
} from '@material-ui/core'
import { CloudUploadRounded } from '@material-ui/icons'

import { create } from './api-course'
import auth from './../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600, margin: 'auto',
        textAlign: 'center', marginTop: theme.spacing(12),
        paddingBottom: theme.spacing(2)
    },
    error: { verticalAlign: 'middle' },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1), width: 300
    },
    submit: { margin: 'auto', marginBottom: theme.spacing(2) },
    input: { display: 'none' },
    filename: { marginLeft: '10px' }
}))

const NewCourse = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [course, setCourse] = useState({
        name: '', description: '',
        image: '', category: '',
        redirect: false, error: ''
    })
    const jwt = auth.isAuthenticated()

    const handleChange = field => e => {
        const value = field === 'image'
            ? e.target.files[0]
            : e.target.value
        setCourse({ ...course, [field]: value })
    }

    const clickSubmit = () => {
        let courseData = new FormData()
        course.name && courseData.append('name', course.name)
        course.description && courseData.append('description', course.description)
        course.image && courseData.append('image', course.image)
        course.category && courseData.append('category', course.category)

        create({ userId: jwt.user._id }, { t: jwt.token }, courseData)
            .then((data) => {
                if (data.error) {
                    setCourse({ ...course, error: data.error })
                } else {
                    setCourse({ ...course, error: '', redirect: true })
                }
            })
    }

    useEffect(() => {
        if (course.redirect) navigate('/teach/courses', { replace: true })
    }, [course.redirect])

    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant='h6' color='primary'
                        className={classes.title}>
                        New Course
                    </Typography>
                    <br />
                    <input id="icon-button-file" accept="image/*"
                        onChange={handleChange('image')}
                        className={classes.input}
                        type="file" style={{ display: 'none' }} />
                    <label htmlFor="icon-button-file" >
                        <Button variant="contained" color="secondary"
                            component="span">
                            Upload Photo <CloudUploadRounded />
                        </Button>
                    </label >
                    <span className={classes.filename}>
                        {course.image ? course.image.name : ''}
                    </span>
                    <br />
                    <TextField id="name" label="Name"
                        value={course.name} margin="normal"
                        className={classes.textField}
                        onChange={handleChange('name')}
                    /> <br />
                    <TextField id="multiline-flexible" label="Description"
                        multiline rows="2" value={course.description}
                        onChange={handleChange('description')}
                        className={classes.textField} margin="normal"
                    /> <br />
                    <TextField id="category" label="Category"
                        className={classes.textField}
                        value={course.category} margin="normal"
                        onChange={handleChange('category')}
                    />
                    {course.error && (
                        <Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>error</Icon>
                            {course.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='primary'
                        onClick={clickSubmit} className={classes.submit}
                    >Submit</Button>
                    <Link to='/teach/courses' className={classes.submit}>
                        <Button variant="contained">Cancel</Button>
                    </Link>
                </CardActions>
            </Card>
        </div>
    )
}

export default NewCourse