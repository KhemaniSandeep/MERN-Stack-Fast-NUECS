
//Remember this users.js file just provides a path (route) for main (node.js) file
//remeber this folders connects (exports) to Controller users.js file

const express = require('express')
const router = express.Router()

const { allusers, userbyid, login, signup, updateuser, deleteuser } = require('../Controller/users');

//API or Paths

router.get('/getusers', allusers);
router.get('/oneuser/:id', userbyid);
router.post('/postlogin', login);
router.post('/postsignup', signup);
router.put('/putuser/:email', updateuser)
router.delete('/deleteuser/:username', deleteuser)

module.exports = router