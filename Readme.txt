// https://github.com/AshleyPojol/testorch-cli/tree/TOR-496-Business-Rule-Implementation

// 9/25/24 Progressional Changes 

// code should automatically transform from JMS to XML via transformJMX.js after installing suitable JMX (XML Content) library (xml2js)
// code reads a .jmx file, parses it, and converts it to XML using the xml2js library. The converted XML is then saved to the output.xml file.

// updated CLI logic in promptUser.js
// Added a new CLI command to trigger the transformation of JMX files
// Integrate this with the CLI logic in promptUser.js to ask the user to provide the path to the JMX file they want to transform

// InfluxDB integration through influxdb.js 
// Once the transformation is done, you can upload or send relevant performance data (if available) to InfluxDB
// Ensure that the transformed .xml file contains the necessary data points

// 9/26/24 Progressional Changes

// added functionality to influxdb.js to handle the creation or verification of InfluxDB organizations
// In InfluxDB, each organization groups multiple users and buckets. Assign each team to one organization
// user will be prompted to enter the team name. The code then checks if the organization already exists in InfluxDB, it will create one if it doesn’t

// updated .env file and added InfluxDB Personal Access Token: uYDU1XjK0tNkwnHx4OXeSWLm_glVOqoB4xj6ywdxvQ7GLD7Th-z0izmZEGv6DWWLizcyIAFbvdvAJ14q3IhP5w==

// team creation prompt in promptUser.js added

// 9/26/24 Progressional Changes

// Add or modify the function to create or verify buckets in InfluxDB for each test plan configured in influxdb.js
// Add a new prompt to ask the user for a test plan name and trigger the bucket creation logic in promptUser.js