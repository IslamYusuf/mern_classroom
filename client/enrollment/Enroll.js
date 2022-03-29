import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { useNavigate } from 'react-router-dom'

import { create } from './api-enrollment'
import auth from './../auth/auth-helper'

const useStyles = makeStyles(() => ({
    form: { minWidth: 500 }
}))

export default function Enroll(props) {
    const classes = useStyles()
    const navigate = useNavigate()
    const [values, setValues] = useState({
        enrollmentId: '', error: '',
        redirect: false
    })

    const clickEnroll = () => {
        const jwt = auth.isAuthenticated()

        create({ courseId: props.courseId }, { t: jwt.token })
            .then((data) => {
                if (data && data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({ ...values, enrollmentId: data._id, redirect: true })
                }
            })
    }

    useEffect(() => {
        if (values.redirect) navigate(`/learn/${values.enrollmentId}`)
    }, [values.redirect])

    return (
        <Button
            variant="contained" color="secondary"
            onClick={clickEnroll}> Enroll </Button>
    )
}

Enroll.propTypes = {
    courseId: PropTypes.string.isRequired
}