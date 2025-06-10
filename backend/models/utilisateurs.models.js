import mongoose from 'mongoose';

const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "fournir email"],
    unique: true,
    lowercase: true,
    trim:true
  },
  role: {
    type: String,
    enum: ['admin', 'directrice'],
    default: 'admin',
    required: true
  },
  mot_de_passe: {
    type: String,
    required:[true, "fournir un mot de passe"]
  },
  verify_email: {
    type: Boolean,
    default: false
  },
  refreshToken: {
  type: String,
  default: ""
},
  last_login_date: {
    type: Date
  },
  forgotPasswordOtp: {
    type: String
  },
  forgotPasswordOtpExpiry: {
    type: Date
  }
}, {
  timestamps: true 
});
 const modelUtlisateur = mongoose.model('Utilisateur', utilisateurSchema);


export default  modelUtlisateur;
