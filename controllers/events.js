const { response } = require("express")
const Event = require('../models/Event')

const getEvents = async ( req, res = response ) => {
    const events = await Event.find()
                                .populate('user', 'name')

    res.json({
        status: true,
        events
    })
}


const createEvent = async ( req, res = response ) => {


    try {


        const event = new Event( req.body )
        event.user = req.id
        
        await event.save()

        

        res.status(201).json({
            status: true,
            event
        })

    } catch( e ) {
        console.log(e)
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }


}


const updateEvent = async ( req, res = response ) => {

    try {
        const eventId = req.params.id
        const id = req.id

        const event = await Event.findById( eventId )
        
        
        if ( !event ) {
            return res.status(404).json({
                status: false,
                message: 'No existe un evento con ese id.'
            })
        }


        if ( event.user.toString() !== id ) {
            return res.status(404).json({
                status: false,
                message: 'No puedes editar un evento que no es tuyo.'
            })
        }

        const newEvent = {
            ...req.body,
            user: id
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true })

        res.status(201).json({
            status: true,
            event: eventUpdated
        })

    } catch( e ) {
        console.log(e)
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }


}


const deleteEvent = async ( req, res = response ) => {


    try {
        const eventId = req.params.id
        const id = req.id

        const event = await Event.findById( eventId )
        
        
        if ( !event ) {
            return res.status(404).json({
                status: false,
                message: 'No existe un evento con ese id.'
            })
        }


        if ( event.user.toString() !== id ) {
            return res.status(404).json({
                status: false,
                message: 'No puedes eliminar un evento que no es tuyo.'
            })
        }


        await Event.findByIdAndDelete( eventId )

        res.status(201).json({
            status: true,
            message: 'Evento eliminado con éxito.'
        })

    } catch( e ) {
        console.log(e)
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }


}





module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}

