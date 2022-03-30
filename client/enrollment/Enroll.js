import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { useNavigate, useLocation } from 'react-router-dom'

import { create } from './api-enrollment'
import auth from './../auth/auth-helper'

export default function Enroll(props) {
    const navigate = useNavigate()
    const { pathname } = useLocation()
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
                    navigate(`/signin`, { state: { from: { pathname } } })
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