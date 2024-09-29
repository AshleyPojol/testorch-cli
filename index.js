import dotenv from 'dotenv';  // Add dotenv import for environment variables
dotenv.config();  // Load environment variables from .env

import inquirer from 'inquirer';
import { promptUser } from './promptUser.js';
import { createOrganization, createBucket, createTokenForOrg, writeDataToInfluxDB } from './influxdb.js';
import { createGrafanaDashboard, updateGrafanaOrgVariable } from './grafana.js';
import { deployJmeterMaster, deployJmeterSlaves, ensureNamespaceExists } from './kubernetes.js';

async function runTestorch() {
  const userInput = await promptUser();

  let orgID;
  let bucketID;
  let token;

  if (userInput.apiURL) {
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
    const org = await createOrganization(userInput.organizationName);
    orgID = org.id;

    const bucket = await createBucket(orgID, userInput.bucketName);
    bucketID = bucket.id;

    token = await createTokenForOrg(orgID, bucketID, userInput.tokenDescription);
    console.log(`Auto Generated Token: ${token}`);
  }

  await writeDataToInfluxDB(userInput.testPlan, orgID, bucketID, token);

  console.log('Deploying Kubernetes Namespaces and JMeter cluster...');

  const deployK8s = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'deployK8s',
      message: 'Would you like to deploy the JMeter Master and Slaves to Kubernetes?',
      default: true
    }
  ]);

  if (deployK8s.deployK8s) {
    // Ensure the namespaces exist
    await ensureNamespaceExists('perf-platform');
    await ensureNamespaceExists('monitoring');

    // Deploy JMeter Master and Slaves
    const jmeterMasterDeployment = await deployJmeterMaster(userInput.testPlan, userInput.organizationName);
    console.log(`JMeter Master deployed: ${jmeterMasterDeployment.status}`);

    const jmeterSlaveDeployment = await deployJmeterSlaves(userInput.testPlan, userInput.organizationName);
    console.log(`JMeter Slaves deployed: ${jmeterSlaveDeployment.status}`);
  }

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
      await updateGrafanaOrgVariable(uid, userInput.organizationName);
    }
  }

  console.log('Testorch execution completed successfully.');
}

runTestorch();
