import axios from 'axios';
import inquirer from 'inquirer'; // Keep inquirer here for test plan uploads


// Function to fetch test plans from the GitHub repository
export async function getTestPlans() {
  try {
    const response = await axios.get(repoUrl, {
      headers: {
        Authorization: `token ${githubToken}`  
      }
    });

    const plans = response.data
      .filter(file => file.name.endsWith('.xml'))  // Only include .xml files
      .map(file => file.name.replace('.xml', '')); // Remove .xml extension for cleaner display

    if (plans.length === 0) {
      console.log('No test plans found in the repository.');
      return [];
    }

    return plans;
  } catch (error) {
    console.error('Error fetching test plans:', error.message);
    return [];  
  }
}

// Function to prompt for file upload and validate it as XML or JMX
export async function promptForTestPlanUpload() {
  const { testPlanFile } = await inquirer.prompt({
    type: 'input',
    name: 'testPlanFile',
    message: 'Upload a new test plan (XML or JMX file):'
  });

  // Validate file extension
  if (testPlanFile.endsWith('.xml')) {
    console.log('XML test plan uploaded successfully.');
    return testPlanFile;
  } else if (testPlanFile.endsWith('.jmx')) {
    // Automatically change the extension from .jmx to .xml
    const xmlFile = testPlanFile.replace('.jmx', '.xml');
    console.log(`JMX file detected. The file extension will be changed to: ${xmlFile}`);
    return xmlFile;
  } else {
    console.log('Invalid file format. Only XML and JMX files are allowed.');
    return promptForTestPlanUpload();  // Retry if the file format is invalid
  }
}
