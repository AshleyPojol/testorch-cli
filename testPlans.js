import axios from 'axios';

export async function getTestPlans() {
  const repoUrl = '';  
  const githubToken = ''; 

  try {
    const response = await axios.get(repoUrl, {
      headers: {
        Authorization: `token ${githubToken}`  
      }
    });

   
    const plans = response.data
      .filter(file => file.name.endsWith('.xml'))  
      .map(file => file.name.replace('.xml', '')); 

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
