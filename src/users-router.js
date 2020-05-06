const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
//POST to create user
  .post('/', jsonBodyParser, (req, res, next) => {
    const { pw, email, full_name } = req.body
    for (const field of ['full_name', 'user_name', 'password']) {
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
    }

    const passwordError = UsersService.validatePassword(pw)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithEmail(
      req.app.get('db'),
      email
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(pw)
          .then(hashedPassword => {
            const newUser = {
              email,
              pw: hashedPassword,
              full_name,
              date_created: 'now()',
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter