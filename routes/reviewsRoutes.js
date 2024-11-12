const express = require('express')
const router = express.Router()
const { Review } = require('../db/sequelizeSetup')




const {findAllReview , findReviewByPk, createReview, updateReview, deleteReview } = require('../controllers/reviewControllers')
const { protect, restrictToOwnAuthor } = require('../controllers/authControllers')



router
    .route('')
    .get(findAllReview)
    .post(protect, createReview)

// router
//     .route('/:coworkingId')
//     .post(protect, createReview)
//  이렇게 하는거는 front에서 되게 쉽게 param으로 id얻을 수 있기 때문에, back-end에서는 그냥 req.body에 직접적으로 CoworkingId : 4 이렇게 적어도 된다. 
// backend 수준에서 자동화 하는건 작동은 하는데 좀 불필요함(inutil).

router
    .route('/:id')
    .get(findReviewByPk)
    .put(protect,restrictToOwnAuthor(Review), updateReview)
    .delete(protect,restrictToOwnAuthor(Review), deleteReview)

// restrict('admin')

module.exports = router