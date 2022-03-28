import React, { useEffect, useState } from 'react'
import { Button, TextField, Typography } from '@material-ui/core'
import { CloudUploadRounded } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom'

import { create } from './api-course'
import auth from './../auth/auth-helper'

const NewCourse = () => {
    const navigate = useNavigate()
    const [course, setCourse] = useState({
        name: '', description: '',
        image: '', category: '',
        redirect: false, error: ''
    })

    const handleChange = field => e => {
        const value = field === 'image'
            ? e.target.files[0]
            : e.target.value
        setCourse({ ...course, [field]: value })
    }

    const jwt = auth.isAuthenticated()

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
            <Typography variant='h6' color='primary'>
                New Course
            </Typography>
            <input id="icon-button-file" accept="image/*" onChange={handleChange('image')}
                type="file" style={{ display: 'none' }} />
            <label htmlFor="icon-button-file" >
                <Button variant="contained" color="secondary" component="span">
                    Upload Photo <CloudUploadRounded />
                </Button>
            </label >
            <span>{course.image ? course.image.name : ''}</span>
            <br />
            <TextField id="name" label="Name"
                value={course.name} onChange={handleChange('name')}
            /> <br />
            <TextField id="multiline-flexible" label="Description"
                multiline rows="2" value={course.description}
                onChange={handleChange('description')}
            /> <br />
            <TextField id="category" label="Category"
                value={course.category} onChange={handleChange('category')}
            />
            <br /><br />
            <Button variant='contained' color='primary' onClick={clickSubmit}>Submit</Button>
        </div>
    )
}

export default NewCourse