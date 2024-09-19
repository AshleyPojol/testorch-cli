import inquirer from 'inquirer';
import { promptUser } from './promptUser.js';
import { createOrganization, createBucket, createTokenForOrg, writeDataToNewOrg, writeDataToInfluxDB } from './influxdb.js';
import { createGrafanaDashboard, updateGrafanaOrgVariable } from './grafana.js';  // Import Grafana function

async function runTestorch() {
  const userInput = await promptUser();

  let orgID;
  let bucketID;
  let token;

  if (userInput.apiURL) {
    // Use existing setup
    orgID = userInput.organizationName;
    bucketID = userInput.bucketName;

    token = await inquirer.prompt([
      {
        type: 'input',
        name: 'token',
        message: 'Enter your existing token or leave blank to generate a new one:',
        default: ''
      }
    ]);

    if (!token.token) {
      console.log('Generating a new token...');
      token = await createTokenForOrg(orgID, bucketID, 'Generated Token');
    } else {
      token = token.token;
    }

    console.log(`Using existing setup: Org: ${orgID}, Bucket: ${bucketID}, Token: ${token}`);
  } else {
    // Create new organization and bucket
    const org = await createOrganization(userInput.organizationName);
    orgID = org.id;

    const bucket = await createBucket(orgID, userInput.bucketName);
    bucketID = bucket.id;

    token = await createTokenForOrg(orgID, bucketID, userInput.tokenDescription);
    console.log(`Auto Generated Token: ${token}`);
  }

  // Write data to InfluxDB
  await writeDataToInfluxDB(userInput.testPlan, orgID, bucketID, token);

  // Ask user about creating Grafana dashboard
  const { createDashboard } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'createDashboard',
      message: 'Would you like to create a Grafana dashboard for this data?',
      default: true
    }
  ]);

  if (createDashboard) {
    let { uid, url } = await createGrafanaDashboard(userInput.organizationName, userInput.bucketName, userInput.testPlan);

    if (!uid) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Dashboard already exists. Do you want to overwrite it?',
          default: false
        }
      ]);

      if (overwrite) {
        const result = await createGrafanaDashboard(userInput.organizationName, userInput.bucketName, userInput.testPlan, uid, true);
        uid = result.uid;
        url = result.url;
        console.log(`Dashboard overwritten: ${url}`);
      } else {
        console.log('Dashboard creation skipped.');
      }
    } else {
      console.log(`Dashboard created at ${url}`);
      // Update Grafana with organization name
      await updateGrafanaOrgVariable(uid, userInput.organizationName);
    }
  }
}

runTestorch();
