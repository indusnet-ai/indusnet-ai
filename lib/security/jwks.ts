import crypto from "crypto";

const kid = process.env.EPIC_KEY_ID || "epic-key-1";
const e = "AQAB";

// n can be loaded from process.env.JWKS_N or extracted from process.env.EPIC_PRIVATE_KEY
let n = process.env.JWKS_N || "";

if (!n && process.env.EPIC_PRIVATE_KEY) {
  try {
    const privateKey = process.env.EPIC_PRIVATE_KEY.replace(/\\n/g, "\n");
    const publicKey = crypto.createPublicKey(privateKey);
    const jwk = publicKey.export({ format: "jwk" });
    if (jwk.n) {
      n = jwk.n;
    }
  } catch (error) {
    console.error("Failed to parse EPIC_PRIVATE_KEY for JWKS:", error);
  }
}

// Ensure there's a fallback so that build doesn't fail if variables aren't set
if (!n) {
  n = "placeholder-modulus-set-jwks_n-or-epic_private_key";
}

export const jwks = {
  keys: [
    {
      kty: "RSA" as const,
      kid,
      use: "sig" as const,
      alg: "RS384" as const,
      n,
      e,
    },
  ],
};
