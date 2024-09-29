// testing for .ENV files.
import dotenv from 'dotenv';
dotenv.config();  

console.log("Influx API:", process.env.Influx_API);
console.log("Influx URL:", process.env.Influx_URL);
console.log("Github API:", process.env.Github_API);
console.log("GitHub URL:", process.env.GitHub_URL);
console.log("Github URL:", process.env.Github_API);
console.log("Grafana API:",process.env.Grafana_API);
