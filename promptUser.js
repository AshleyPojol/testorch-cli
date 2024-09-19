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
