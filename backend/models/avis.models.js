import mongoose from 'mongoose';

const avisSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  sexe: {
    type: String,
    enum: ['Homme', 'Femme'],
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  numero: {
    type: String,
    required: false
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  fonction: {
    type: String,
    enum: [
  'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi', 'Marcory',
  'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon', 'Bingerville', 'Anyama', 'Songon',
  'Bouaké', 'Yamoussoukro', 'Daloa', 'San Pedro', 'Korhogo', 'Man', 'Gagnoa',
  'Abengourou', 'Divo', 'Odienné', 'Bondoukou', 'Séguéla', 'Soubré', 'Ferkessédougou',
  'Aboisso', 'Guiglo', 'Toumodi', 'Agboville'],
    required: false
  },
  commune: {
    type: String,
    required: false
  },
  motif: {
    type: String,
    enum: ['Consultation', 'Information', 'Analyses', 'Retrait de résultats', 'Autre'],
    required: true
  },
  satisfaction: {
    type: String,
    enum: ['Satisfait', 'Mécontent'],
    required: true
  },
  commentaire: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Avis', avisSchema);
