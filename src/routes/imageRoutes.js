import express from "express";
import { deleteLocalFiles, filterImageFromURL } from "../../util/util.js";
import { downloadImageFromS3, uploadImageToS3 } from "../services/s3UploadingService.js";

export const router = express.Router();

router.get('/filteredimage', async (req, res) => {
    const imageUrl = req.query.image_url;

    //    1. validate the image_url query
    if (!imageUrl) {
        return res.status(400).send({ message: 'Image URL is required' });
    }

    try {
        //    2. call filterImageFromURL(image_url) to filter the image
        console.log(imageUrl)
        const filteredImage = await filterImageFromURL(imageUrl)
        console.log(filteredImage)
        const s3Uploaded = await uploadImageToS3(filteredImage);
        console.log("s3 bucket link -> "+s3Uploaded.Location)
        //    3. send the resulting file in the response
        res.sendFile(filteredImage, err => {
            if (err) {
              return res.status(500).send({ message: 'Error sending the file' });
            }
            // 4. Deletes any files on the server on finish of the response
            deleteLocalFiles([filteredImage]);
        });
 
    //    4. deletes any files on the server on finish of the response
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error processing the image' });
    }
});



router.get('/s3BucketImage', async (req, res) => {
    const location = req.query.location;

    //    1. validate the image_url query
    if (!location) {
        return res.status(400).send({ message: 'Image URL is required' });
    }

    try {
       const imageFromS3 = await downloadImageFromS3(location)
       res.setHeader('Content-Type', 'image/jpeg');
    
       // Envía el cuerpo del objeto como respuesta
       res.send(imageFromS3);
    //    4. deletes any files on the server on finish of the response
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error processing the image' });
    }
});



