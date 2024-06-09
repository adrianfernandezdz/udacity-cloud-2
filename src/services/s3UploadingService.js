import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import { GetObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();
// Configuración del cliente S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export async function uploadImageToS3(filePath) {
    try {
        // Leer el archivo desde el sistema de archivos
        const fileContent = fs.readFileSync(filePath);

        // Configurar los parámetros para la carga
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "images/" + filePath.split("tmp/")[1],
            Body: fileContent
        };

        // Subir el archivo a S3
        const data = await s3.upload(params).promise();
        return data;
    } catch (error) {
        throw new Error('Error uploading file: ' + error.message);
    }
}

export async function downloadImageFromS3(key) {
    console.log("keyyyyyyyyy")
    console.log(key)
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key
      };
  
      const command = new GetObjectCommand(params);
      const { Body } = await s3.getObject(params).promise();
  
      return Body;
  
    } catch (error) {
      throw new Error('Error downloading file from S3: ' + error.message);
    }
  }