import { promptUser } from './promptUser.js';
import { createOrganization, createBucket, createTokenForOrg, writeDataToNewOrg } from './influxdb.js';


async function runTestorch() {
  // Step 1: Prompt the user for test plan, organization, bucket, token, and dashboard info
  const userInput = await promptUser();
  console.log("User Input: ", userInput);

  // Step 2: Create the organization based on user input
  const org = await createOrganization(userInput.organizationName);
  if (!org || !org.id) {
    console.error('Failed to create organization.');
    return;
  }
  const orgID = org.id;
  console.log(`Organization created with ID: ${orgID}`);

  // Step 3: Create a bucket based on user input
  const bucket = await createBucket(orgID, userInput.bucketName);
  if (!bucket || !bucket.id) {
    console.error('Failed to create bucket.');
    return;
  }
  const bucketID = bucket.id;
  console.log(`Bucket created with ID: ${bucketID}`);

  // Step 4: Generate a token for the new organization and bucket
  const token = await createTokenForOrg(orgID, bucketID, userInput.tokenDescription);
  if (!token) {
    console.error('Failed to create token.');
    return;
  }
  console.log(`Auto Generated Token: ${token} \nBe sure to save it.`);

  // Step 5: Write data to InfluxDB using the generated token
  await writeDataToNewOrg(userInput.testPlan, userInput.organizationName, userInput.bucketName, token);
}

runTestorch();
