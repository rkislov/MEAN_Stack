const express = require('express')
const router = express.Router()
const controller = require('../controllers/analytic')
const passport = require('passport')


router.get('/overview', passport.authenticate('jwt', {session: false} ),controller.overview)
router.get('/analytics', passport.authenticate('jwt', {session: false} ),controller.analytic)


module.exports = router