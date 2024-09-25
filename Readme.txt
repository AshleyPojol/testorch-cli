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

