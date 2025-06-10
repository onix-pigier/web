import { Router } from 'express'
import { longinControleur, newUserControleur, verifieEmailControleur } from '../controleurs/utilisateur.controleur.js'

const utilisateurRouter = Router()

utilisateurRouter.post('/register',newUserControleur)
utilisateurRouter.post('/verify-email', verifieEmailControleur)
utilisateurRouter.post('/login',longinControleur)

export default utilisateurRouter;