import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";
import { generateKeyPairSync } from "crypto";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  // Generate a pair of RSA keys
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  // Convert the public key to a base64 string
  const pubKey = publicKey.export({ type: "pkcs1", format: "pem" });

  onionRouter.get("/status/", (req, res) => {
    res.send("live");
  });

  onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
    res.send({ result: null });
  });

  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    res.send({ result: null });
  });

  onionRouter.get("/getLastMessageDestination", (req, res) => {
    res.send({ result: null });
  });

  onionRouter.post("/getPrivateKey", (req, res) => {
    res.json({nodeId, pubKey});
  });

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
