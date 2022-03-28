import React, {useState, useEffect} from 'react'
import { 
    Button, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, IconButton 
} from '@material-ui/core'
import {DeleteRounded} from '@material-ui/icons'
import {useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'

import auth from '../auth/auth-helper'
import {remove} from './api-user'

export default function DeleteUser(props) {
    const navigate = useNavigate()    
    const [open, setOpen] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const clickButton = () => {
        setOpen(true)
    }

    const handleRequestClose = (event, reason) => {
        //Disabling bakdropClick in the Dialog
        if (reason !== 'backdropClick') {
            setOpen(false)
        }
    }

    const deleteAccount = () => {
        const jwt = auth.isAuthenticated()
        remove({
            userId: props.userId
        }, {t: jwt.token}).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                auth.clearJWT(() => console.log('deleted'))
                setRedirect(true)
            }
        })
    }

    useEffect(()=>{
        if (redirect) {
            navigate('/', {replace:true})
        }
    }, [redirect])

    return (
        <span>
            <IconButton aria-label="Delete"
                onClick={clickButton} color="secondary">
                <DeleteRounded/>
            </IconButton>
            <Dialog open={open} onClose={handleRequestClose}>
                <DialogTitle>{"Delete Account"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm to delete your account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRequestClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={deleteAccount}
                        color="secondary" autoFocus="autoFocus">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    )
}

DeleteUser.propTypes = {
    userId: PropTypes.string.isRequired
}