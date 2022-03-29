import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    Button, TextField, Dialog, DialogActions, DialogContent,
    DialogTitle, makeStyles
} from '@material-ui/core'
import Add from '@material-ui/icons/AddBox'

import { newLesson } from './api-course'
import auth from './../auth/auth-helper'

const useStyles = makeStyles(() => ({
    form: { minWidth: 500 }
}))

export default function NewLesson(props) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [lesson, setLesson] = useState({
        title: '', content: '', resource_url: ''
    })

    const handleChange = name => event => {
        setLesson({ ...lesson, [name]: event.target.value })
    }
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const clickSubmit = () => {
        const jwt = auth.isAuthenticated()
        const updatedLesson = {
            title: lesson.title || undefined,
            content: lesson.content || undefined,
            resource_url: lesson.resource_url || undefined
        }

        newLesson({ courseId: props.courseId }, { t: jwt.token }, updatedLesson)
            .then((data) => {
                if (data && data.error) {
                    setLesson({ ...lesson, error: data.error })
                } else {
                    props.addLesson(data)
                    setLesson({
                        ...lesson, title: '',
                        content: '', resource_url: ''
                    })
                    setOpen(false)
                }
            })
    }

    return (
        <div>
            <Button aria-label="Add Lesson" color="primary"
                variant="contained" onClick={handleClickOpen}>
                <Add /> &nbsp; New Lesson
            </Button>
            <Dialog open={open} onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <div className={classes.form}>
                    <DialogTitle id="form-dialog-title">Add New Lesson</DialogTitle>
                    <DialogContent>
                        <TextField margin="dense" label="Title" fullWidth
                            type="text" value={lesson.title}
                            onChange={handleChange('title')}
                        /><br />
                        <TextField margin="dense" multiline
                            label="Content" type="text" fullWidth
                            rows="5" value={lesson.content}
                            onChange={handleChange('content')}
                        /><br />
                        <TextField margin="dense" value={lesson.resource_url}
                            label="Resource link" type="text" fullWidth
                            onChange={handleChange('resource_url')}
                        /><br />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}
                            color="primary" variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={clickSubmit}
                            color="secondary" variant="contained">
                            Add
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    )
}

NewLesson.propTypes = {
    courseId: PropTypes.string.isRequired,
    addLesson: PropTypes.func.isRequired
}