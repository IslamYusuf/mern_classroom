import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Home, Menu } from './core'
import { Profile, Signup, Users, EditProfile } from './user'
import { PrivateRoute, Signin } from './auth'
import { MyCourses, Course, NewCourse, EditCourse } from './course'
import { Enrollment } from './enrollment'

const MainRouter = () => {
    return (
        <div>
            <Menu />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="signup" element={<Signup />} />
                <Route path="signin" element={<Signin />} />
                <Route path="users" element={<Users />} />
                <Route path="/user/edit/:userId" element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                } />
                <Route path="/user/:userId" element={<Profile />} />
                <Route path="/course/:courseId" element={<Course />} />
                <Route path='/teach/courses' element={
                    <PrivateRoute>
                        <MyCourses />
                    </PrivateRoute>
                } />
                <Route path='/teach/course/new' element={
                    <PrivateRoute>
                        <NewCourse />
                    </PrivateRoute>
                } />
                <Route path="/teach/course/edit/:courseId" element={
                    <PrivateRoute>
                        <EditCourse />
                    </PrivateRoute>
                } />
                <Route path="/teach/course/:courseId" element={
                    <PrivateRoute>
                        <Course />
                    </PrivateRoute>
                } />
                <Route path="/learn/:enrollmentId" element={
                    <PrivateRoute>
                        <Enrollment />
                    </PrivateRoute>
                } />
                <Route path="*" element={
                    <main style={{ padding: "1rem" }}>
                        <p>There&apos;s nothing here!</p>
                    </main>
                } />
            </Routes>
        </div>
    )
}

export default MainRouter