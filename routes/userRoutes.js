const express = require('express')
const router = express.Router()
const { User } = require('../db/sequelizeSetup')
let users = require('../db/mock-users')



const {findAllUser , findUserByPk, createUser, updateUser, deleteUser } = require('../controllers/userControllers')
const { login, protect, restrict, correctUser } = require('../controllers/authControllers')


router
    .route('')
    .get(findAllUser)
    .post(createUser)

router
    .route('/login')
    .post(login)

router
    .route('/:id')
    .get(findUserByPk)
    .put(protect,updateUser)
    .delete(protect,restrict("superadmin"), deleteUser)

// restrict('admin')

module.exports = router