import inquirer from 'inquirer';
import { getTestPlans } from './testPlans.js';  // Assuming you have a function to fetch test plans

export async function promptUser() {
  // Ask if the user wants to use existing setup or create a new one
  const { useExistingSetup } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useExistingSetup',
      message: 'Do you want to use an existing organization, bucket, and API?',
      default: true,
    }
  ]);

  if (useExistingSetup) {
    // If using existing setup, ask for the existing details
    const existingSetup = await inquirer.prompt([
      {
        type: 'input',
        name: 'organizationName',
        message: 'Enter your existing organization name:'
      },
      {
        type: 'input',
        name: 'bucketName',
        message: 'Enter your existing bucket name:'
      },
      {
        type: 'input',
        name: 'apiURL',
        message: 'Enter your existing InfluxDB API URL:'
      }
    ]);

    const testPlanChoice = await promptForTestPlan();

    return {
      ...existingSetup,
      ...testPlanChoice,
    };
  } else {
    // If creating a new setup, prompt for new organization, bucket, and API
    const newSetup = await inquirer.prompt([
      {
        type: 'input',
        name: 'organizationName',
        message: 'Enter a new organization name:'
      },
      {
        type: 'input',
        name: 'bucketName',
        message: 'Enter a new bucket name:'
      },
      {
        type: 'input',
        name: 'tokenAccess',
        message: 'Enter token access level (e.g., All Access, Read/Write):'
      },
      {
        type: 'input',
        name: 'tokenDescription',
        message: 'Enter token description:'
      }
    ]);

    const testPlanChoice = await promptForTestPlan();

    return {
      ...newSetup,
      ...testPlanChoice,
    };
  }
}

const promptUser = require('./promptUser'); // Assuming promptUser handles CLI interactions

promptUser.askFilePath('Enter the path to the JMX file:', (inputFilePath) => {
    const outputFilePath = inputFilePath.replace('.jmx', '.xml');
    transformJMXtoXML(inputFilePath, outputFilePath);
});

const { createOrVerifyOrg } = require('./influxdb'); // Import the function

promptUser.askTeamName('Enter the team name:', (teamName) => {
    createOrVerifyOrg(teamName).then((org) => {
        console.log(`Organization setup complete for team: ${teamName}`);
        // You can now proceed with additional logic if needed, such as linking test plans to the org
    });
});

const { createOrVerifyBucket } = require('./influxdb'); // Import the function

promptUser.askTestPlan('Enter the test plan name:', (testPlanName) => {
    const bucketName = testPlanName; // You can directly use the test plan name as the bucket name
    createOrVerifyBucket(bucketName).then((bucket) => {
        console.log(`Bucket setup complete for test plan: ${testPlanName}`);
        // Continue with further actions if necessary
    });
});

promptUser.askTestPlan = function(question, callback) {
  // Code to ask user for the test plan name (similar to other prompt functions)
};


// Function to prompt for test plan selection
async function promptForTestPlan() {
  const testPlans = await getTestPlans();  // Fetch the test plans from GitHub dynamically

  return await inquirer.prompt([
    {
      type: 'list',
      name: 'testPlan',
      message: 'What Test Plan would you like to test?',
      choices: testPlans,
    }
  ]);
}

const teamName = process.argv[3]; // Assume the team name is passed in as an argument
createOrVerifyOrg(teamName).then((org) => {
    console.log(`Organization setup for team: ${teamName}`);
});
