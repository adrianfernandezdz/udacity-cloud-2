import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import dotenv from 'dotenv';

dotenv.config();


async function getSecret(secretName) {
  try {
    console.log("**************************")
    console.log(secretName.trim())
    const secret = await client.send(new GetSecretValueCommand({ SecretId: secretName.trim() }));
    return secret.SecretString;
  } catch (e) {
    console.error('Get secret error', e);
    throw e;
  }
}

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export const requiresAuth = () => {
  return async (req, res, next) => {
    try{
        if (!req.headers.authorization) {
          throw new Error("Missing Authorization header");
        }
        // into the auth, the secret name is passed, just to try the AWS secrets manager and "simulate" authentication.
        const authHeader = req.headers.authorization;
        const token = authHeader.split("Bearer")[1];
        console.log("token")
        console.log(typeof token);
        const secret = await getSecret(token);
        console.log("secreeeeeeeeeet")
        console.log(secret)
        if(secret) {
          return next()
        } else {
          throw Error();
        }
    } catch(err) {
        console.log('Auth error', err)
        return res.status(401).json({message: "Unauthorized"})
    }
  };
};

export default { requiresAuth };
