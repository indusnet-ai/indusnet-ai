import assert from "assert";

async function runTest() {
  console.log("--------------------------------------------------");
  console.log("INTEGRATION TEST: JWKS ENDPOINT VERIFICATION");
  console.log("--------------------------------------------------");
  
  const targetUrl = "http://localhost:3000/.well-known/jwks.json";
  console.log(`Fetching ${targetUrl}...`);

  try {
    const res = await fetch(targetUrl);
    assert.strictEqual(res.status, 200, `Expected HTTP 200, got ${res.status}`);
    console.log("✓ Route returned HTTP 200");

    const contentType = res.headers.get("content-type") || "";
    assert.ok(contentType.includes("application/json"), `Expected JSON content type, got ${contentType}`);
    console.log("✓ Response Content-Type is application/json");

    const data = await res.json();
    assert.ok(data && typeof data === "object", "Expected response to be a JSON object");
    assert.ok(Array.isArray(data.keys), "Expected 'keys' property to be an array");
    assert.strictEqual(data.keys.length, 1, `Expected exactly 1 key, got ${data.keys.length}`);
    console.log("✓ Response contains keys array with 1 key");

    const key = data.keys[0];
    assert.strictEqual(key.kty, "RSA", `Expected kty to be RSA, got ${key.kty}`);
    console.log("✓ Key kty is RSA");

    assert.strictEqual(key.use, "sig", `Expected use to be sig, got ${key.use}`);
    console.log("✓ Key use is sig");

    assert.strictEqual(key.alg, "RS384", `Expected alg to be RS384, got ${key.alg}`);
    console.log("✓ Key alg is RS384");

    const expectedKid = process.env.EPIC_KEY_ID || "epic-key-1";
    assert.strictEqual(key.kid, expectedKid, `Expected kid to be ${expectedKid}, got ${key.kid}`);
    console.log(`✓ Key kid is ${key.kid}`);

    assert.ok(typeof key.n === "string" && key.n.length > 50, "Expected modulus 'n' to be a valid long base64url string");
    console.log("✓ Key modulus 'n' exists and is valid");

    assert.strictEqual(key.e, "AQAB", `Expected exponent 'e' to be AQAB, got ${key.e}`);
    console.log("✓ Key exponent 'e' is AQAB");

    console.log("\n--------------------------------------------------");
    console.log("ALL JWKS ENDPOINT TESTS PASSED SUCCESSFULLY!");
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("\n--------------------------------------------------");
    console.error("JWKS ENDPOINT TESTS FAILED:");
    console.error(error);
    console.error("--------------------------------------------------");
    process.exit(1);
  }
}

runTest();
