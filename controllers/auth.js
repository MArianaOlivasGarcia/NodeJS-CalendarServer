const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')
const User = require('../models/User')

const create =  async (req, res) => {
    
    try {

        const { email, password } = req.body

        let user = await User.findOne({email})

        if ( user ) {
            return res.status(400).json({
                status: false,
                message: 'Ya existe un usuario con ese email'
            })
        }

        user = new User( req.body )

        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync( password, salt );

        await user.save()

        res.status(200).json({
            status: true,
            user
        })

    } catch ( err ) {
        console.log(err)
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }


}


const login = async (req, res) => {

    

    try {

        const { email, password } = req.body

        const user = await User.findOne({email})
    
        if ( !user ) {
            return res.status(400).json({
                status: false,
                message: 'No existe un usuario con ese email'
            })
        }
    
        const validPassword = bcrypt.compareSync( password, user.password )
    
        if ( !validPassword ) {
            return res.status(400).json({
                status: false,
                message: 'El password es incorrecto'
            })
        }

        const token = await generarJWT( user.id, user.name )

        res.json({
            status: true,
            user,
            token
        })

    } catch ( err ) {
        console.log(err)
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }


}



const renew =  async (req, res) => {


    const { id, name } = req

    const token = await generarJWT( id, name )

    const user = await User.findById(id)


    res.json({
        status: true,
        token,
        user
    })
}


module.exports = {
    create,
    login,
    renew
}