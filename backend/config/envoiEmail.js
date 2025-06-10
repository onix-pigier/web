import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

    if(!process.env.RESEND_API){
            console.log("fournir resend à l'interieur du fichier .env")
    }

const resend = new Resend(process.env.RESEND_API);

    const envoiEmail = async ({sendTo, subject, html}) =>{
        try {
            const { data, error } = await resend.emails.send({
            from: 'onix <onboarding@resend.dev>',
             to: sendTo,
            subject:subject,
            html: html,
  });

    if(error){
        return console.error({error})
    }
    return data
        } catch (error) {
            console.log(error)
        }
    }

    export default envoiEmail;
