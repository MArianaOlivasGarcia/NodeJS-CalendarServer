const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarToken } = require('../middlewares/validar-token');
const { isDate } = require('../helpers/isDate')
const router = Router();

/* Todas las peticiones de abajo deben pasan por el validarToken */
router.use( validarToken )

router.get('/', getEvents )

router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom( isDate ),
    check('end', 'Fecha de termino es obligatorio').custom( isDate ),
    validarCampos
] ,createEvent )

router.put('/:id', updateEvent )

router.delete('/:id', deleteEvent )


module.exports = router