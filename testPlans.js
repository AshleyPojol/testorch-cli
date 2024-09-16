import axios from 'axios';

// Function to fetch test plans from a GitHub repository
export async function getTestPlans() {
  // Replace with your actual GitHub repository details
  const repoUrl = 'https://api.github.com/repos/AshleyPojol/testorch-testplan/contents/';  
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
