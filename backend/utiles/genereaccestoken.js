import jwt from 'jsonwebtoken'

const  generereaccesToken = async(utilisateurId)=>{
    console.log("🧪 Clé JWT =", process.env.SECRET_KEY_ACCESS_TOKEN);
    const token = await jwt.sign({ id : utilisateurId },
        process.env.SECRET_KEY_ACCESS_TOKEN,
       { expiresIn : '2h'}
    )
        
    return  token
}

export default generereaccesToken ; 