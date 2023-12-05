const express = require('express')
const router = express.Router()
const userService = require('../services/user')
const CustomError = require('../helper/response')
const jwt = require('jsonwebtoken')
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'putricantik'


/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the database.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with user data
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       500:
 *         description: Internal Server Error
 */
router.get('/list', async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new CustomError('Authorization token is missing', 401);
    }

    const decodedToken = jwt.verify(token, jwtSecretKey);

    // console.log(decodedToken.jurusan);

    const users = await userService.listUsers();

    res.json({
      code: res.statusCode,
      message: 'Success',
      data: users,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        code: res.statusCode,
        message: error.message,
        data: null,
      });
    } else {
      res.status(500).json({
        code: res.statusCode,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }
});

// ... rest of the code


// router.get('/list', async (req, res) => {
//   try {
//     const token = req.headers.token

//     if (!token) {
//       throw new CustomError('Authorization token is missing', 401)
//     }

//     const decodedToken = jwt.verify(token, jwtSecretKey)

//     // console.log(decodedToken.jurusan)

//     const users = await userService.listUsers()

//     res.json({
//       code: res.statusCode,
//       message: 'Success',
//       data: users,
//     })
    
//   } catch (error) {
//     if (error instanceof CustomError) {
//       res.status(error.statusCode).json({
//         code: res.statusCode,
//         message: error.message,
//         data: null,
//       })
//     } else {
//       res.status(500).json({
//         code: res.statusCode,
//         message: 'Internal Server Error',
//         data: null,
//       })
//     }
//   }
// })



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
      res.status(error.statusCode).json({ message: error.message })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
})



router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await userService.authenticateUser({
      username: username,
      password: password,
    })

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      jurusan: user.jurusan,
    }

    const token = jwt.sign(tokenPayload, jwtSecretKey, {
      expiresIn: '1h', //expired time
    })

    res.json({ token: token })
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message })
    } else {
      // res.status(500).send('Internal Server Error')
      res.status(500).json({ message: error.message })
    }
  }
})



module.exports = router
