import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    // 1. Récupération du token
    const token = req.cookies?.accessToken || 
                 req.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: "Authentification requise - Token manquant",
        error: true,
        success: false
      });
    }

    // 2. Vérification du token
    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    if (!decode) {
        message.status(401).json({
            message : "accès autorisé",
            error : true,
            success : false
        })
    }
    // 4. Injection des données dans la requête
    req.utilisateurId = decode.id;

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Erreur d'authentification",
      error: true,
      success: false
    });
  }
};

export default auth;