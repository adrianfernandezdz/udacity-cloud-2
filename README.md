(Sorry for adding this format but I had all the info into a PDF and wasnt allowed to update it :( )

Proyect running on local:

2 endpoints have been created: 
1. GET /filteredimage -> To store image into the proyect directory (and adittionally upload the image to the s3 bucket),  then download and then delete.
2. (Aditional) -> GET /s3BucketImage -> Since I wanted to test a bit more with AWS services, I created this endpoint to donwload the file from the AWS s3 bucket. I know this wasn't into the criterias, but I wanted to try it.
Regarding the Authentication -> I've added a middleware to "simualte" authetication by token. In reality , it just goes against AWS secrets of the account, and if it exists, the user is authorized. If not, 403 unauthorized.
Repository link: https://github.com/adrianfernandezdz/udacity-cloud-2

Local screenshots:
--------> GET /filteredimage 
403:

 curl --location 'localhost:8082/filteredImage?image_url=https%3A%2F%2Fethic.es%2Fwp-content%2Fuploads%2F2023%2F03%2Fimagen-1280x768.jpg' \
--header 'Authorization: Bearer token'

OK:
curl --location 'localhost:8082/filteredImage?image_url=https%3A%2F%2Fethic.es%2Fwp-content%2Fuploads%2F2023%2F03%2Fimagen-1280x768.jpg' \
--header 'Authorization: Bearer image-app-jwt-private-key'

 
---------> GET /s3BucketImage  
Wrong secret, 403:

403:
curl --location 'localhost:8082/s3BucketImage?location=images%2Ffiltered.554.jpg' \
--header 'Authorization: Bearer token'
 
Existing secret:
 curl --location 'localhost:8082/s3BucketImage?location=images%2Ffiltered.554.jpg' \
--header 'Authorization: Bearer image-app-jwt-private-key'


Then, deployed ebs by comands: eb init and eb create
Deployed:
 


"udacity-ebs-proyect-cloud-dev"
EBS dev url-> udacity-ebs-proyect-cloud-dev.us-west-2.elasticbeanstalk.com
Set environment variables into the ebs:
 
REQUESTS:
GET /filteredimage 
cURL -> 
curl --location 'http://udacity-ebs-proyect-dev.us-west-2.elasticbeanstalk.com//filteredImage?image_url=https%3A%2F%2Fethic.es%2Fwp-content%2Fuploads%2F2023%2F03%2Fimagen-1280x768.jpg' \
--header 'Authorization: Bearer token'
403:
curl --location 'udacity-ebs-proyect-cloud-dev.us-west-2.elasticbeanstalk.com/filteredImage?image_url=https%3A%2F%2Fethic.es%2Fwp-content%2Fuploads%2F2023%2F03%2Fimagen-1280x768.jpg' \
--header 'Authorization: Bearer token
 
OK:
curl --location 'udacity-ebs-proyect-cloud-dev.us-west-2.elasticbeanstalk.com/filteredImage?image_url=https%3A%2F%2Fethic.es%2Fwp-content%2Fuploads%2F2023%2F03%2Fimagen-1280x768.jpg' \
--header 'Authorization: Bearer image-app-jwt-private-key'
 






GET /s3BucketImage 
403:
curl --location 'udacity-ebs-proyect-cloud-dev.us-west-2.elasticbeanstalk.com/s3BucketImage?location=images%2Ffiltered.554.jpg' \
--header 'Authorization: Bearer TOKEN'
 

OK:
curl --location 'udacity-ebs-proyect-cloud-dev.us-west-2.elasticbeanstalk.com/s3BucketImage?location=images%2Ffiltered.554.jpg' \
--header 'Authorization: Bearer image-app-jwt-private-key'
 


