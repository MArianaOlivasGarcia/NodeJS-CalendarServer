

const { response } = require('express')

const jwt = require('jsonwebtoken')


const validarToken = ( req, res = response, next ) => {

    const token = req.header('accessToken')

    if ( !token ) {
        return res.status(401).json({
            status: false,
            message: 'No hay accessToken en la petición'
        })
    }


    try {

        const { id, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )

        req.id = id
        req.name = name

    } catch ( err ) {
        console.log(err)
        return res.status(401).json({
            status: false,
            message: 'Token no válido'
        })
    }

    next()

}



module.exports = {
    validarToken
}