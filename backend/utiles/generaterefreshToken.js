import modelUtlisateur from "../models/utilisateurs.models.js";
import jwt from "jsonwebtoken";

const generateRefreshToken = async (utilisateurId) => {
  console.log("🧪 Clé JWT =", SECRET_KEY_REFRESH_TOKEN);
  const token = await jwt.sign(
    { id: utilisateurId },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "2d" },
  );
  const updateRefreshTokenUtilisateur = await modelUtlisateur.updateOne(
    { _id: utilisateurId },
    {
      refreshToken: token,
    },
  );

  return token;
};

export default generateRefreshToken;
