import React from 'react'
import { Link } from 'react-router-dom'
import {
    makeStyles, ImageList, ImageListItem, ImageListItemBar
} from '@material-ui/core'
import { Done } from '@material-ui/icons'
import InProgressIcon from '@material-ui/icons/DonutLarge'

const useStyles = makeStyles(theme => ({
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: { minHeight: 400 },
    container: { minWidth: '100%', paddingBottom: '14px' },
    gridList: {
        width: '100%', minHeight: 100,
        padding: '12px 0 10px'
    },
    tile: { textAlign: 'center' },
    image: { height: '100%' },
    tileBar: { backgroundColor: 'rgba(0, 0, 0, 0.85)', textAlign: 'left' },
    tileTitle: {
        fontSize: '1.1em', marginBottom: '5px',
        color: '#fffde7', display: 'block'
    },
    action: { margin: '0 10px' },
    progress: { color: '#b4f8b4' }
}))

export default function Enrollments(props) {
    const classes = useStyles()
    return (
        <div>
            <ImageList rowHeight={120} className={classes.gridList} cols={4}>
                {props.enrollments.map((enrollment, i) => (
                    <ImageListItem key={i} className={classes.tile}>
                        <Link to={`/learn/${enrollment._id}`}>
                            <img className={classes.image}
                                src={`/api/courses/photo/${enrollment.course._id}`}
                                alt={enrollment.course.name} />
                        </Link>
                        <ImageListItemBar className={classes.tileBar}
                            title={
                                <Link to={`/learn/${enrollment._id}`}
                                    className={classes.tileTitle}>
                                    {enrollment.course.name}
                                </Link>}
                            actionIcon={<div className={classes.action}>
                                {enrollment.completed
                                    ? (<Done color="secondary" />)
                                    : (<InProgressIcon className={classes.progress} />)
                                }
                            </div>}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    )
}