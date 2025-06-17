import envoiEmail from "../config/envoiEmail.js";
import modelUtilisateur from "../models/utilisateurs.models.js";
import verifieEmail from "../utiles/verifieEmail.js";
import generereaccesToken from "../utiles/genereaccestoken.js";
import generateRefreshToken from "../utiles/generaterefreshToken.js";
import bcryptjs from "bcryptjs";
import generateOtp from "../utiles/generateOtp.js";
import forgotmotdepassTemplate from "../utiles/forgotmotdepassTemplate.js";
import jwt from 'jsonwebtoken';

export async function newUserControleur(req, res) {
  try {
    const { nom, email, mot_de_passe, role } = req.body;

    if (!nom || !email || !mot_de_passe || !role) {
      return res.status(400).json({
        message: "Fournir nom, email, mot de passe et rôle",
        success: false
      });
    }

    console.log("🛠 Reçu dans le body :", req.body);

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Format d'email invalide",
        success: false
      });
    }

    // Vérification du rôle
    const rolesValides = ['admin', 'Responsable'];
    if (!rolesValides.includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide",
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });

    if (utilisateur) {
      return res.status(409).json({
        message: "Email déjà utilisé",
        success: false
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashMotDePasse = await bcryptjs.hash(mot_de_passe, salt);

    const nouvelUtilisateur = new modelUtilisateur({
      nom,
      email,
      mot_de_passe: hashMotDePasse,
      role,
      emailVerified: false
    });

    const utilisateurSauvegarde = await nouvelUtilisateur.save();

    const verifieEmailUrl = `${process.env.FRONTEND_URL}/verifie-email?code=${utilisateurSauvegarde._id}`;

    await envoiEmail({
      sendTo: email,
      subject: "Vérification de l'email - Onix",
      html: verifieEmail({
        nom,
        url: verifieEmailUrl
      })
    });

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      success: true,
      data: {
        id: utilisateurSauvegarde._id,
        nom: utilisateurSauvegarde.nom,
        email: utilisateurSauvegarde.email,
        role: utilisateurSauvegarde.role
      }
    });
  } catch (error) {
    console.error("Erreur dans newUserControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de l'utilisateur",
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
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findById(code);

    if (!utilisateur) {
      return res.status(404).json({
        message: "Code de vérification invalide",
        success: false
      });
    }

    if (utilisateur.emailVerified) {
      return res.status(200).json({
        message: "Email déjà vérifié",
        success: true
      });
    }

    await modelUtilisateur.findByIdAndUpdate(code, {
      emailVerified: true,
      verifiedAt: new Date()
    });

    return res.json({
      message: "Vérification de l'email terminée",
      success: true
    });
  } catch (error) {
    console.error("Erreur dans verifieEmailControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la vérification de l'email",
      success: false
    });
  }
}

export async function loginControleur(req, res) {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(401).json({
        message: "Identifiants invalides",
        success: false
      });
    }

    if (!utilisateur.emailVerified) {
      return res.status(403).json({
        message: "Veuillez vérifier votre email avant de vous connecter",
        success: false
      });
    }

    const motDePasseValide = await bcryptjs.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Identifiants invalides",
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
      success: true,
      data: {
        utilisateur: {
          id: utilisateur._id,
          nom: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role
        }
      }
    });
  } catch (error) {
    console.error("Erreur dans loginControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la connexion",
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

    await modelUtilisateur.findByIdAndUpdate(utilisateurId, {
      refreshToken: ""
    });

    return res.json({
      message: "Déconnexion réussie",
      success: true
    });
  } catch (error) {
    console.error("Erreur dans logoutControleur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la déconnexion",
      success: false
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const utilisateurId = req.utilisateurId;
    const { nom, email, mot_de_passe, role } = req.body;

    if (!nom && !email && !mot_de_passe && !role) {
      return res.status(400).json({
        message: "Aucune donnée à mettre à jour",
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
    if (role) {
      const rolesValides = ['admin', 'Responsable'];
      if (!rolesValides.includes(role)) {
        return res.status(400).json({
          message: "Rôle invalide",
          success: false
        });
      }
      updates.role = role;
    }

    const utilisateurMisAJour = await modelUtilisateur.findByIdAndUpdate(
      utilisateurId,
      updates,
      { new: true, select: '-mot_de_passe -refreshToken' }
    );

    if (!utilisateurMisAJour) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        success: false
      });
    }

    return res.json({
      message: "Informations mises à jour",
      success: true,
      data: utilisateurMisAJour
    });
  } catch (error) {
    console.error("Erreur dans updateUserDetails:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour",
      success: false
    });
  }
}

export async function forgotPasswordControleur(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email requis",
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({
        message: "Aucun compte trouvé avec cet email",
        success: false
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await modelUtilisateur.findByIdAndUpdate(utilisateur._id, {
      forgotPasswordOtp: otp,
      forgotPasswordOtpExpiry: expireTime
    });

    await envoiEmail({
      sendTo: email,
      subject: "Réinitialisation de mot de passe - Onix",
      html: forgotmotdepassTemplate({
        nom: utilisateur.nom,
        otp: otp
      })
    });

    return res.json({
      message: "Un email de réinitialisation a été envoyé",
      success: true
    });
  } catch (error) {
    console.error("Erreur dans forgotPasswordControleur:", error);
    return res.status(500).json({
      message: "Erreur lors de l'envoi du email de réinitialisation",
      success: false
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email et OTP requis",
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(400).json({
        message: "Email invalide",
        success: false
      });
    }

    const tempsActuel = new Date();

    if (utilisateur.forgotPasswordOtpExpiry < tempsActuel) {
      return res.status(400).json({
        message: "OTP expiré",
        success: false
      });
    }

    if (otp !== utilisateur.forgotPasswordOtp) {
      return res.status(400).json({
        message: "OTP invalide",
        success: false
      });
    }

    // OTP valide, on peut nettoyer l'OTP après vérification
    await modelUtilisateur.findByIdAndUpdate(utilisateur._id, {
      forgotPasswordOtp: null,
      forgotPasswordOtpExpiry: null
    });

    return res.json({
      message: "OTP vérifié",
      success: true
    });
  } catch (error) {
    console.error("Erreur dans verifyForgotPasswordOtp:", error);
    return res.status(500).json({
      message: error.message || "Erreur serveur",
      success: false
    });
  }
}

export async function resetpassword(req, res) {
  try {
    const { email, newpassword, confirmPassword } = req.body;

    if (!email || !newpassword || !confirmPassword) {
      return res.status(400).json({
        message: "Fournir email, nouveau mot de passe et confirmation",
        success: false
      });
    }

    const utilisateur = await modelUtilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(400).json({
        message: "Email incorrect",
        success: false
      });
    }

    if (newpassword !== confirmPassword) {
      return res.status(400).json({
        message: "Le nouveau mot de passe et la confirmation ne sont pas identiques",
        success: false
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashMotDePasse = await bcryptjs.hash(newpassword, salt);

    await modelUtilisateur.findOneAndUpdate(
      { email },
      {
        mot_de_passe: hashMotDePasse,
        forgotPasswordOtp: null,
        forgotPasswordOtpExpiry: null
      }
    );

    return res.json({
      message: "Mot de passe modifié avec succès",
      success: true
    });
  } catch (error) {
    console.error("Erreur dans resetpassword:", error);
    return res.status(500).json({
      message: error.message || "Erreur serveur",
      success: false
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "Token invalide",
        success: false
      });
    }

    console.log("refreshToken", refreshToken);

    const verifiedToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

    if (!verifiedToken) {
      return res.status(401).json({
        message: "Token expiré",
        success: false
      });
    }

    console.log("verifiedToken", verifiedToken);
    const utilisateurId = verifiedToken._id;

    const utilisateur = await modelUtilisateur.findById(utilisateurId);
    if (!utilisateur) {
      return res.status(401).json({
        message: "Utilisateur non trouvé",
        success: false
      });
    }

    const newAccessToken = await generereaccesToken(utilisateurId);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    };

    res.cookie("accessToken", newAccessToken, cookieOptions);
    return res.json({
      message: "Nouveau token d'accès généré",
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error("Erreur dans refreshToken:", error);
    return res.status(500).json({
      message: error.message || "Erreur serveur",
      success: false
    });
  }
}
