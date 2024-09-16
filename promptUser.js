import inquirer from 'inquirer';
import { getTestPlans } from './testPlans.js';  // Assuming you have a function to fetch test plans

export async function promptUser() {
  // Fetch the test plans dynamically from the repository
  const testPlans = await getTestPlans(); 

  // User prompt using Inquirer
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'testPlan',
      message: 'What Test Plan would you like to test?',
      choices: testPlans  // List fetched test plans from the repo
    },
    {
      type: 'input',
      name: 'organizationName',
      message: 'What is your organization name?'
    },
    {
      type: 'input',
      name: 'bucketName',
      message: 'What is your bucket name?'
    },
    {
      type: 'list',
      name: 'tokenAccess',
      message: 'What is your token access level?',
      choices: ['Read/Write', 'All Access']
    },
    {
      type: 'input',
      name: 'tokenDescription',
      message: 'What is your token description?'
    },
    {
      type: 'input',
      name: 'dashboardName',
      message: 'What is your dashboard name?'
    }
  ]);

  console.log("User Input: ", answers);  // Log user input for debugging

  return answers;  // Return user input for further processing
}
