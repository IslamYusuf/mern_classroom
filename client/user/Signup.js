import React,{useState} from 'react'
import { 
    Button, Card, CardActions, CardContent, 
    Icon, TextField, Typography, makeStyles, Dialog, 
    DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@material-ui/core"
import { Link } from "react-router-dom"

import {create} from './api-user'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

export default function Signup() {
    const classes = useStyles() 
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        open: false,
        error: ''
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined
        }
        create(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error})
            } else {
                setValues({ ...values, error: '', open: true})
            }
        })
    }

    const handleOnClose = (event,reason) =>{
        //Disabling bakdropClick in the Dialog
        if (reason !== 'backdropClick') {
            setValues({ ...values, open: false})
        }
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Sign Up
                    </Typography>
                    <TextField id="name" label="Name"
                        className={classes.textField}
                        value={values.name} onChange={handleChange('name')}
                        margin="normal"/>
                    <br/>
                    <TextField id="email" type="email" label="Email"
                        className={classes.textField}
                        value={values.email} onChange={handleChange('email')}
                        margin="normal"/>
                    <br/>
                    <TextField id="password" type="password" label="Password"
                        className={classes.textField} value={values.password}
                        onChange={handleChange('password')} margin="normal"/>
                    <br/>
                    {
                        values.error && (
                            <Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>Error: </Icon>
                            {values.error}</Typography>
                        )
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit}
                        className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
            <Dialog open={values.open} onClose={handleOnClose}>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New account successfully created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" autoFocus="autoFocus"
                            variant="contained">
                            Sign In
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </div>
    )
}