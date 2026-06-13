import * as fs from "fs";
import * as path from "path";
import { pem2jwk } from "pem-jwk";

function generateJwks() {
  const publicPemPath = path.resolve(process.cwd(), "public.pem");
  
  if (!fs.existsSync(publicPemPath)) {
    console.error(`Error: public.pem not found at ${publicPemPath}. Please generate it first.`);
    process.exit(1);
  }

  try {
    const pemString = fs.readFileSync(publicPemPath, "utf8");
    const jwk = pem2jwk(pemString);
    
    // Add required OAuth / Epic parameters
    const epicJwk = {
      kty: "RSA",
      kid: process.env.EPIC_KEY_ID || "epic-key-1",
      use: "sig",
      alg: "RS384",
      n: jwk.n,
      e: jwk.e
    };

    const jwks = {
      keys: [epicJwk]
    };

    const outputJson = JSON.stringify(jwks, null, 2);
    console.log("Generated JWKS:");
    console.log(outputJson);

    // Save to jwks.json
    const outputPath = path.resolve(process.cwd(), "jwks.json");
    fs.writeFileSync(outputPath, outputJson, "utf8");
    console.log(`Saved JWKS to ${outputPath}`);
  } catch (error) {
    console.error("Failed to generate JWKS:", error);
    process.exit(1);
  }
}

generateJwks();
