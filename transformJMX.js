const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js'); // Use xml2js to parse/convert XML

// Function to transform JMX to XML (In this case, it just validates the XML format)
function transformJMXtoXML(inputFile, outputFile) {
    const parser = new xml2js.Parser();
    fs.readFile(inputFile, (err, data) => {
        if (err) {
            console.error("Error reading the JMX file:", err);
            return;
        }

        // Parsing JMX as XML
        parser.parseString(data, (err, result) => {
            if (err) {
                console.error("Error parsing JMX file:", err);
                return;
            }

            // Converting back to XML string and saving to output file
            const builder = new xml2js.Builder();
            const xmlOutput = builder.buildObject(result);

            fs.writeFile(outputFile, xmlOutput, (err) => {
                if (err) {
                    console.error("Error writing the XML file:", err);
                } else {
                    console.log(`Transformed and saved XML to ${outputFile}`);
                }
            });
        });
    });
}

// Example of using the function
const inputFilePath = path.join(__dirname, 'test.jmx');
const outputFilePath = path.join(__dirname, 'output.xml');

transformJMXtoXML(inputFilePath, outputFilePath);
