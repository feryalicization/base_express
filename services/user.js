
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()
const CustomError = require('../helper/response')
const jwt = require('jsonwebtoken')



class UserService {
  async createUser({ username, password, email }) {
    try {
        const existingUser = await prisma.user.findMany({
            where: {
              username: username,
            },
          })
      
          const existingUserEmail = await prisma.user.findMany({
            where: {
              email: email,
            },
          })
      
          if (existingUser.length > 0) {
            throw new CustomError('Username already exists', 400)
          }
      
          if (existingUserEmail.length > 0) {
            throw new CustomError('Email already exists', 400)
          }
      
          const hashedPassword = await bcrypt.hash(password, 10)
      
          const newUser = await prisma.user.create({
            data: {
              username: username,
              password: hashedPassword,
              email: email,
            },
          })
      
          return newUser
    } catch (error) {
      throw error
    }
  }

  
  async listUsers() {
    try {
      const users = await prisma.user.findMany()
      return users
    } catch (error) {
      throw error
    }
  }


  async authenticateUser({ username, password }) {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (!user) {
      throw new CustomError('Invalid username', 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new CustomError('Invalid password', 401)
    }

    return user
  }



  async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        throw new CustomError('User not found', 404)
      }

      return user
    } catch (error) {
      throw error
    }
  }





}

module.exports = new UserService()
