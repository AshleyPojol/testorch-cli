import { exec } from 'child_process';
import k8s from '@kubernetes/client-node';  

// Deploy JMeter Master
export function deployJmeterMaster(testPlan, orgName) {
  return new Promise((resolve, reject) => {
    const jmeterMasterYaml = ``;  // Indicate the Relative Path of jmeter-master-deployment.yaml
    exec(`kubectl apply -f ${jmeterMasterYaml} --namespace=perf-platform`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying JMeter Master: ${stderr}`);
        reject(stderr);
      } else {
        console.log(`JMeter Master deployed: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Deploy JMeter Slaves
export function deployJmeterSlaves(testPlan, orgName) {
  return new Promise((resolve, reject) => {
    const jmeterSlaveYaml = ``;  // Indicate the Relative Path of jmeter-slave-deployment.yaml
    exec(`kubectl apply -f ${jmeterSlaveYaml} --namespace=perf-platform`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying JMeter Slaves: ${stderr}`);
        reject(stderr);
      } else {
        console.log(`JMeter Slaves deployed: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Ensure the namespace exists using Kubernetes API client
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function ensureNamespaceExists(namespace) {
  try {
    // Check if the namespace exists
    await k8sApi.readNamespace(namespace);
    console.log(`Namespace ${namespace} already exists, skipping creation.`);
  } catch (err) {
    if (err.response && err.response.statusCode === 404) {
      // Create the namespace if it doesn't exist
      console.log(`Creating namespace ${namespace}...`);
      await k8sApi.createNamespace({ metadata: { name: namespace } });
      console.log(`Namespace ${namespace} created.`);
    } else {
      console.error(`Error checking/creating namespace: ${err}`);
      throw err;
    }
  }
}