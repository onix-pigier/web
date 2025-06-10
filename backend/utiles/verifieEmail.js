const verifieEmail = (nom, url) => {
  return `
    <p>Cher(e) ${nom},</p>
    <p>Merci de vous être enregistré sur Onix.</p>
    <a href="${url}" style="color: white; background: blue; margin-top: 10px; padding: 10px 20px; display: inline-block; text-decoration: none;">
      Vérifier mon email
    </a>
  `;
};

export default verifieEmail;
