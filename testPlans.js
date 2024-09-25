import axios from 'axios';

// Function to fetch test plans from a GitHub repository
export async function getTestPlans() {
  // Replace with your actual GitHub repository details
  const repoUrl = 'https://github.com/AshleyPojol/testorch-cli.git';  
  const githubToken = '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';  // Add your GitHub token if the repo is private

  try {
    const response = await axios.get(repoUrl, {
      headers: {
        Authorization: `token ${githubToken}`  // Use GitHub token for authentication if needed
      }
    });

    // Filter for .xml files (assuming your test plans are .xml files)
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
    return [];  // Return empty array in case of error
  }
}
