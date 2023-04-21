import { google } from 'googleapis'
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
      bodyParser: false
    }
};

export default async (req, res) => {
    const client_id = process.env.GOOGLE_CLIENT_ID
    const client_secret = process.env.GOOGLE_CLIENT_SECRET
    const redirect_uri = process.env.GOOGLE_REDIRECT_URI

    const oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uri
    )

    oauth2Client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN})

    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    })
      
    const form = new formidable.IncomingForm();

    const data = await new Promise((resolve, reject) => {
        form.parse(req, async function (err, fields, { file }) {
            const { data }= await drive.files.create({
                requestBody: {
                    name: `${file.originalFilename}`,
                    mimeType: file.mimetype,
                    parents: ['1DV-vhLiT3wrQchuFp-qNwIi3REqTEDF4']
                },
                media: {
                    mimeType: file.mimetype,
                    body: fs.createReadStream(file.filepath)
                }
            })
    
            const fileName = `${data.name}`
            const fileType = data.name.split('.').pop()
            const fileId = data.id;
            
            const url = `https://drive.google.com/uc?export=view&id=${fileId}`
    
            resolve({url, fileType, fileName})
        });
    })
    
    return res.status(200).json({...data})
}