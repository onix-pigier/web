const forgotmotdepassTemplate = ({ nom, opt }) => {
  return `
    <div>
    <p>Cher(e) ${nom},</p>
    <p>Vôtre requête pour la renitialisation de votre mot de passe . SVp Utiliser votre OTP code pour renitialiser le Mot de passe</p>
    <div style="background: yellow; font-size: 20px"> 
        ${opt}
    </div>
    <p> cet opt est valide pour seulemnt 1h .entrer cet opt sur Onix web pour valider la renitialisation .</p>
    <br/>
    <br/>
    <p>Merci></p>
        <p>Onix></p>
    </div>
  `;
};
export default forgotmotdepassTemplate;
