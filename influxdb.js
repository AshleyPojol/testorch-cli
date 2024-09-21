import axios from 'axios';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

// InfluxDB connection details
const influxUrl = '';  // Base InfluxDB URL (Docker setup)
const adminToken = '';  // Admin token from InfluxDB UI

// Function to create an organization in InfluxDB
export async function createOrganization(orgName) {
  const orgUrl = `${influxUrl}/api/v2/orgs`;

  try {
    const response = await axios.post(
      orgUrl,
      { name: orgName },
      { headers: { Authorization: `Token ${adminToken}` } }  // Use adminToken here
    );
    console.log(`Organization '${orgName}' created with ID: ${response.data.id}`);
    return response.data;  // Return the whole organization object, including the ID
  } catch (error) {
    console.error('Error creating organization:', error.response?.data || error.message);
    return null;  // Return null if organization creation fails
  }
}

// Function to create a bucket
export async function createBucket(orgId, bucketName) {
  const bucketUrl = `${influxUrl}/api/v2/buckets`;

  try {
    const response = await axios.post(
      bucketUrl,
      { orgID: orgId, name: bucketName, retentionRules: [{ type: 'expire', everySeconds: 3600 * 24 }] },  // 1-day retention policy
      { headers: { Authorization: `Token ${adminToken}` } }
    );
    console.log(`Bucket '${bucketName}' created with ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error('Error creating bucket:', error.response?.data || error.message);
    return null;  // Return null if bucket creation fails
  }
}

// Function to create a token for the new organization
export async function createTokenForOrg(orgId, bucketId, tokenDescription) {
  const tokenUrl = `${influxUrl}/api/v2/authorizations`;

  const permissions = [
    {
      action: 'read',
      resource: { type: 'buckets', id: bucketId, orgID: orgId }
    },
    {
      action: 'write',
      resource: { type: 'buckets', id: bucketId, orgID: orgId }
    }
  ];

  try {
    const response = await axios.post(
      tokenUrl,
      {
        orgID: orgId,
        permissions: permissions,
        description: tokenDescription,  // Set the token description
      },
      { headers: { Authorization: `Token ${adminToken}` } }
    );
    console.log('Token created successfully:', response.data.token);  // Log the new token
    return response.data.token;
  } catch (error) {
    console.error('Error creating token for organization:', error.response?.data || error.message);
    return null;  // Return null if token creation fails
  }
}

// Function to write data to InfluxDB using the generated token
export async function writeDataToInfluxDB(testPlan, orgName, bucketName, token) {
  const client = new InfluxDB({ url: influxUrl, token: token });
  const writeApi = client.getWriteApi(orgName, bucketName, 'ns');  // Use ns precision for nanoseconds

  try {
    const point = new Point('testorch')
      .tag('organization', orgName)
      .tag('testPlan', testPlan)
      .intField('testExecution', Math.random() * 100);  // Example data

    writeApi.writePoint(point);
    await writeApi.close();
    console.log('Data written to InfluxDB');
  } catch (err) {
    console.error(`Error writing to InfluxDB: ${err.message}`);
  }
}

// Function to write data using the newly generated token for a new organization
export async function writeDataToNewOrg(testPlan, orgName, bucketName, token) {
  const client = new InfluxDB({ url: influxUrl, token: token });
  const writeApi = client.getWriteApi(orgName, bucketName, 'ns');  // Use ns precision for nanoseconds

  try {
    const point = new Point('testorch')
      .tag('organization', orgName)
      .tag('testPlan', testPlan)
      .intField('testExecution', Math.random() * 100);  // Example data

    writeApi.writePoint(point);
    await writeApi.close();
    console.log('Data written to InfluxDB for the new organization');
  } catch (err) {
    console.error(`Error writing to InfluxDB: ${err.message}`);
  }
}
