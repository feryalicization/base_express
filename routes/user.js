const express = require('express')
const router = express.Router()
const userService = require('../services/user')
const CustomError = require('../helper/response')

router.get('/list', async (req, res) => {
  try {
    const users = await userService.listUsers()
    res.json(users)
  } catch (error) {
    console.error('Error listing users:', error.message)
    res.status(500).send('Internal Server Error')
  }
})

router.post('/create', async (req, res) => {
  try {
    const { username, password, email } = req.body

    const newUser = await userService.createUser({
      username: username,
      password: password,
      email: email,
    })

    res.json(newUser)
  } catch (error) {
    if (error instanceof CustomError) {
      // Handle custom errors with specific status codes and messages
      res.status(error.statusCode).json({ message: error.message })
    } else {
      // Handle other unexpected errors
      console.error('Error creating user:', error.message)
      res.status(500).send('Internal Server Error')
    }
  }
})

module.exports = router
