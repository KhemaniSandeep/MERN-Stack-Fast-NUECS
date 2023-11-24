
//For all Users data. After giving API 
//(api is just a route name starting with '/' ) from Routes folder.
//Here we are connecting this file (controllers users.js) to its Schema structure located in Schema folder.
//Here we are defining all logic related to usesr like what, how , where can use this users data.

//Remember there are many ways to write this code.🚀🥳
//you can change or even make this code smaller to your liking. (inifinite possibilites😃)


require('dotenv').config()
const express=require('express')
const mongoose = require('mongoose')
const nodemailer=require('nodemailer')
const { hash, compare } = require('bcrypt')
const usersSchema = require('../Schema/users')

//Find all users --  router.get('/getusers', allusers);

const allusers = async (req, res) => {
    try {
        await mongoose.connect(process.env.mongo_url)
        const users = await usersSchema.find()
        res.json({ message: "All users list.", list: users })
    }
    catch (err) {
        res.json({ message: err.message })
    }
}

//Find user by ID --  router.get('/oneuser/:id', userbyid);

const userbyid = async (req, res) => {
    try {
        await mongoose.connect(process.env.mongo_url)
        const userID = req.params.id
        const user = await usersSchema.findById(userID)
        res.json(user)

    } catch (err) {
        res.json({ message: err.message })
    }
}

//Login  --  router.post('/postlogin', login);

const login = async (req, res) => {
    const { username, email, password } = req.body
    const matchusername = await usersSchema.findOne({ username })
    const matchemail = await usersSchema.findOne({ email })
    const matchpassword = await usersSchema.findOne({ password })
    const decryptPass = await compare(password, matchpassword)


    if (matchusername && matchemail && decryptPass) {

        try {
            await mongoose.connect(process.env.mongo_url)
            res.json({ message: "Successfully logged in.", LoginData: req.body })
        } catch (err) {
            res.json({ message: err.message, LoggedInUser: req.body })
        }
    }
    else {
        res.json({ message: "Username or Email is incorrect, plz check!" })
    }
}

//SignUp  --  router.post('/postsignup', signup);

const signup = async (req, res) => {
    const { username, email, password } = req.body


    if (username == null || email == null || password == null) {
        res.json({ message: "Plz enter required info first", Signed })
    }
    else {
        try {
            const findUserName = await usersSchema.findOne({ username })
            const findemail = await usersSchema.findOne({ email })
            if (!findUserName && !findemail) {
                try {
                    await mongoose.connect(process.env.mongo_url)
                    const hashedPass = await hash(password, 10)
                    const signup = usersSchema.create({ username, email, password: hashedPass })
                    // res.json({ message: "This user has signed up successfully.", SignedUpUser: signup })

                        try {
                            const transport = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: process.env.user,
                                    pass: process.env.pass
                                }
                            })

                            const textmail = {
                                from: process.env.user,
                                to: email,
                                subject: "Dear user you have successfully signed up.",
                                html: "<h1>Habibi Habibi come to me. <br> You successfully signed up.</h1>"
                            }
                            await transport.sendMail(textmail)
                            res.json({ mesage: 'Sent email.'})
                        } catch (err) {
                            console.error(err)
                            res.json({ message: err.message })
                        }
                        // res.json({ message: "This user has signed up successfully.", SignedUpUser: signup })

                } catch (err) {
                    console.error(err)
                    res.json({ message: err.message })
                }

            }
            else {
                res.json({ message: "This user's data already exits, create new one and try again." })
            }
        }
        catch (err) {
            console.error(err)
            res.json({ message: err.message })
        }
    }
}


//Update User  --  router.patch('/patchuser/:id', updateuser)

const updateuser = async (req, res) => {
    try {
        const updateUser = req.params.email
        const { username, email, password } = req.body
        const hashedPass = await hash(password, 10)
        const update = await usersSchema.updateOne(updateUser, { password: hashedPass })

        await mongoose.connect(process.env.mongo_url)
        res.json({ message: "Following user has updated.", UpdatedUser: update })
    } catch (err) {
        res.json({ message: err.message })
    }
}

//Delete User  --  router.delete('/deleteuser/:username', deleteuser)

const deleteuser = async (req, res) => {
    const userid = req.params
    const find = await usersSchema.findById({ userid })
    if (find) {
        try {
            await mongoose.connect(process.env.mongo_url)
            const deleteUser = await usersSchema.deleteOne({ username: userid })

            res.json({ message: "Selected user has been deleted.", DeletedUser: deleteUser })
        } catch (err) {
            res.json({ message: err.message })
        }
    }
    else {
        res.json({ message: "There is no such user" })
    }
}

module.exports = { allusers, userbyid, login, signup, updateuser, deleteuser }