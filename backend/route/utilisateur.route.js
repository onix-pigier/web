import { Router } from 'express'
import { forgotPasswordControleur, logoutControleur, longinControleur, newUserControleur, resetpassword, updateUserDetails, verifieEmailControleur, verifyForgotPasswordOtp } from '../controleurs/utilisateur.controleur.js'
import auth from '../middleware/auth.js'

const utilisateurRouter = Router()

utilisateurRouter.post('/register',newUserControleur)
utilisateurRouter.post('/verify-email', verifieEmailControleur)
utilisateurRouter.post('/login',longinControleur)
utilisateurRouter.get('/logout',auth,logoutControleur)
utilisateurRouter.put('/update-user',auth,updateUserDetails)
utilisateurRouter.put('forgot-password',forgotPasswordControleur)
utilisateurRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
utilisateurRouter.put('reset-password',resetpassword)

export default utilisateurRouter;