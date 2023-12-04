
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()
const CustomError = require('../helper/response')



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
      
          // Hash the password before storing it
          const hashedPassword = await bcrypt.hash(password, 10)
      
          // Create a new user in the database without specifying jurusan
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
}

module.exports = new UserService()
