import formidable from 'formidable'
import fs from 'fs'

import Course from '../models/course.model'
import errorHandler from '../helpers/dbErrorHandler'
import defaultImage from './../../client/assets/images/default.png'

const create = (req, res) => {
    let form = new formidable.IncomingForm()

    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let course = new Course(fields)
        course.instructor = req.profile
        if (files.image) {
            course.image.data = fs.readFileSync(files.image.filepath)
            course.image.contentType = files.image.mimetype
        }
        try {
            let result = await course.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const listByInstructor = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.profile._id })
            .populate('instructor', '_id name')
        res.json(courses)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const courseByID = async (req, res, next, id) => {
    try {
        let course = await Course.findById(id)
            .populate('instructor', '_id name')
        if (!course)
            return res.status('400').json({
                error: "Course not found"
            })
        req.course = course
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve course"
        })
    }
}

const read = (req, res) => {
    req.course.image = undefined
    return res.json(req.course)
}

const photo = (req, res, next) => {
    if (req.course.image.data) {
        res.set('Content-type', req.course.image.contentType)
        res.send(req.course.image.data)
    }
    next()
}

const defaultPhoto = (_req, res) => {
    res.sendFile(process.cwd() + defaultImage)
}

export default {
    create, listByInstructor, courseByID, read,
    photo, defaultPhoto
}