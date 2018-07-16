const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')


module.exports.login = async (req,res) => {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        //Проверка пароля
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // Генерация токена, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // ошибка, пароли не совпали
            res.status(401).json({
                message: "Неверно указан пароль, попробуйте еще раз"
            })
        }
    } else {
        //Пользователя несуществует
        res.status(404).json({
            message: "Такого пользователя не существует"
        })
    }
}


module.exports.register = async (req,res) => {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        //пользователь существует
        res.status(409).json({
            message: "Пользователь с таким email уже существует. Попробуйте другой."
        })
    } else {
        //создание пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            //Обработать ошибку
        }

    }
}