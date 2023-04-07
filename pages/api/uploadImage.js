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
    const refresh_token = process.env.GOOGLE_REFRESH_TOKEN

    const oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uri
    )

    oauth2Client.setCredentials({refresh_token: refresh_token})

    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    })
      
    const form = new formidable.IncomingForm();

    const data = await new Promise((resolve, reject) => {
        form.parse(req, async function (err, fields, files) {
            const data = await drive.files.create({
                requestBody: {
                    name: `${files.file.originalFilename}`,
                    mimeType: files.file.mimetype,
                    parents: ['1DV-vhLiT3wrQchuFp-qNwIi3REqTEDF4']
                },
                media: {
                    mimeType: 'image/jpg',
                    body: fs.createReadStream(files.file.filepath)
                }
            })
    
            const fileName = `images/${data.data.name}`
            const fileType = data.data.name.split('.')[1]
            const fileId = data.data.id;

            const allows = await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })
            const url = `https://drive.google.com/uc?export=view&id=${fileId}`
    
            resolve({url, fileType, fileName})
        });
    })
    
    return res.status(200).json({...data})
}