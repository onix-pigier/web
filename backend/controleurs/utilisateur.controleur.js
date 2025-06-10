import envoiEmail from "../config/envoiEmail.js";
import modelUtilisateur from "../models/utilisateurs.models.js";
import verifieEmail from "../utiles/verifieEmail.js";
import generereaccesToken from "../utiles/genereaccestoken.js";
import generateRefreshToken from "../utiles/generaterefreshToken.js";
import bcryptjs from "bcryptjs";
import generateOtp from "../utiles/generateOtp.js";
import forgotmotdepassTemplate from "../utiles/forgotmotdepassTemplate.js";
import jwt from 'jsonwebtoken'

export async function newUserControleur(req, res) {
  try {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({
        message: "Fournir nom, email et mot de passe",
        error: true,
        success: false
      });
    }

    console.log("🛠 Reçu dans le body :", req.body);

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Format d'email invalide",
        error: true,
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });

    if (utilisateur) {
      return res.status(409).json({
        message: "Email déjà utilisé",
        error: true,
        success: false
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashMotDePasse = await bcryptjs.hash(mot_de_passe, salt);

    const nouvelUtilisateur = new modelUtilisateur({
      nom,
      email,
      mot_de_passe: hashMotDePasse,
      emailVerified: false
    });

    const utilisateurSauvegarde = await nouvelUtilisateur.save();

    const verifieEmailUrl = `${process.env.FRONTEND_URL}/verifie-email?code=${utilisateurSauvegarde._id}`;

    await envoiEmail({
      to: email,
      subject: "Vérification de l'email - Onix",
      html: verifieEmail({
        nom,
        url: verifieEmailUrl
      })
    });

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      error: false,
      success: true,
      data: {
        id: utilisateurSauvegarde._id,
        nom: utilisateurSauvegarde.nom,
        email: utilisateurSauvegarde.email
      }
    });

  } catch (error) {
    console.error("Erreur dans newUserControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de l'utilisateur",
      error: true,
      success: false
    });
  }
}

export async function verifieEmailControleur(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Code de vérification requis",
        error: true,
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findById(code);

    if (!utilisateur) {
      return res.status(404).json({
        message: "Code de vérification invalide",
        error: true,
        success: false
      });
    }

    if (utilisateur.emailVerified) {
      return res.status(200).json({
        message: "Email déjà vérifié",
        success: true,
        error: false
      });
    }

    await modelUtilisateur.findByIdAndUpdate(code, { 
      emailVerified: true,
      verifiedAt: new Date() 
    });

    return res.json({
      message: "Vérification de l'email terminée",
      success: true,
      error: false
    });

  } catch (error) {
    console.error("Erreur dans verifieEmailControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la vérification de l'email",
      error: true,
      success: false
    });
  }
}

export async function longinControleur(req, res) {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({
        message: "Email et mot de passe requis",
        error: true,
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(401).json({
        message: "Identifiants invalides",
        error: true,
        success: false
      });
    }

    if (!utilisateur.emailVerified) {
      return res.status(403).json({
        message: "Veuillez vérifier votre email avant de vous connecter",
        error: true,
        success: false
      });
    }

    const motDePasseValide = await bcryptjs.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Identifiants invalides",
        error: true,
        success: false
      });
    }

    const accessToken = await generereaccesToken(utilisateur._id);
    const refreshToken = await generateRefreshToken(utilisateur._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.json({
      message: "Connexion réussie",
      error: false,
      success: true,
      data: {
        utilisateur: {
          id: utilisateur._id,
          nom: utilisateur.nom,
          email: utilisateur.email
        }
      }
    });

  } catch (error) {
    console.error("Erreur dans loginControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la connexion",
      error: true,
      success: false
    });
  }
}

export async function logoutControleur(req, res) {
  try {
    const utilisateurId = req.utilisateurId;

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

  const updatedUser =  await modelUtilisateur.findByIdAndUpdate(utilisateurId, {
      refreshToken: ""
    });

    return res.json({
      message: "Déconnexion réussie",
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Erreur dans logoutControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la déconnexion",
      error: true,
      success: false
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const utilisateurId = req.utilisateurId;
    const { nom, email, mot_de_passe } = req.body;

    if (!nom && !email && !mot_de_passe) {
      return res.status(400).json({
        message: "Aucune donnée à mettre à jour",
        error: true,
        success: false
      });
    }

    const updates = {};
    if (nom) updates.nom = nom;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Format d'email invalide",
          error: true,
          success: false
        });
      }
      updates.email = email;
      updates.emailVerified = false; // Réinitialiser la vérification si email changé
    }

    if (mot_de_passe) {
      const salt = await bcryptjs.genSalt(10);
      updates.mot_de_passe = await bcryptjs.hash(mot_de_passe, salt);
    }

    const utilisateurMisAJour = await modelUtilisateur.findByIdAndUpdate(
      utilisateurId,
      updates,
      { new: true, select: '-mot_de_passe -refreshToken' }
    );

    if (!utilisateurMisAJour) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        error: true,
        success: false
      });
    }

    return res.json({
      message: "Informations mises à jour",
      error: false,
      success: true,
      data: utilisateurMisAJour
    });

  } catch (error) {
    console.error("Erreur dans updateUserDetails:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour",
      error: true,
      success: false
    });
  }
}
// forgot password
export async function forgotPasswordControleur(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email requis",
        error: true,
        success: false,
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({
        message: "Aucun compte trouvé avec cet email",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await modelUtilisateur.findByIdAndUpdate(utilisateur._id, {
      forgotPasswordOtp: otp,
      forgotPasswordOtpExpiry: expireTime
    });

    await envoiEmail({
      to: email,
      subject: "Réinitialisation de mot de passe - Onix",
      html: forgotmotdepassTemplate({
        nom: utilisateur.nom,
        otp: otp
      }) // Parenthèse fermante ajoutée ici
    });

    return res.json({
      message: "Un email de réinitialisation a été envoyé",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Erreur dans forgotPasswordControleur:", error);
    return res.status(500).json({
      message: "Erreur lors de l'envoi du email de réinitialisation",
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp (req,res){
  try {
    const { email , otp} = req.body;
    if(!email || !otp) {
      return res.status(400).json({
        message : " fechec de l'email , otp fourni",
        error: true,
        success : false
      })
    }

    const utilisateur = await modelUtilisateur.findOne({email})

   if (!utilisateur) {
    ReturnDocument.status(400).json({
      message:" Email invalide",
      reror : false,
      success : true
    })
   }

   const TempActuel = new Date()

   if (utilisateur.forgotPasswordOtpExpiry < TempActuel) {
    return res.status(400).json({
      message : "Otp expiré",
      error : true ,
      success: false
    })
   }

   if (otp === utilisateur.forgotPasswordOtp) {
    return res.status(400).json({
      message : "Otp invalide", 
      error : true,
      success: false
    })
   }

   // if otp not expired
   // otp ===user.forgotpassworgotp


   return res.json({
    message : " otp verifié",
    error : false,
    success : true 

   })
  } catch (error) {
    return res.status(500).json({
      message : error.message || error,
      error : true,
      success : false
    })
  }
}

export async function  resetpassword(req,res) {
  try {
    const {email ,newPassword, confirmPassword } = req.body;

    if(!email || !newPassword || !confirmPassword){
      return res.status(400).json({
        message : "fournir email , newoassqword , confirmPassworld"
      })
    }

    const utilisateur = await modelUtilisateur.findOne({email})

    if (!utilisateur) {
      return res.status(400).json({
        message : " eamil n'est pas correct ",
        error : true,
        success : false
      })
      
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message : "le nouveau mot de passe et la confirmatio ne sont pas même ",
        error : true,
        success : false
      })
    }
    const halt = await bcryptjs.genSalt(10)
    const hashMotDePasse = await bcryptjs.hash(newPassword,salt)

    const Update = await modelUtilisateur.findOneAndUpdate(utilisateur._id,{
      mot_de_passe : hashMotDePasse
    })

    return res.json({
      message : " mot de passe modifié",
      error : false,
      success : true
    })

  } catch (error) {
    return res.status(500).json({
      message : error.messaeg ||error,
      error : true,
      success : false
    })
  }
}

export async function refreshToken(req,res){
  try {
      const refreshToken = req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1]

      if (!refreshToken) {
        return res.status(401).json({
          message : "invalide Token",
          error: true, 
          success : false
        })
      }

      console.log("refreshToken",refreshToken);

      verifyToken = await  jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

      if (!verifyToken){
        return res.status(401).json({
          message : "Token expiré",
          error : true,
          success : false
        })
      }

      console.log("verifyToken", verifyToken);
      const utilisateurId = verifyToken?._id
      
      const newAccessToken = await generereaccesToken(utilisateurId)

        const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    };


      res.cookie("accessToken",newAccessToken,cookieOptions)
       return res.json({
      message : "Nouveau accès Token généré",
      error : false,
      success: true,
      data :{
        accessToken : newAccessToken
      }
    })

  } catch (error) {
   return res.status(500).json({
      message : error.message || error ,
      error : true,
      success: false 
    })
  }
}