import axios from 'axios';

const grafanaUrl = '';
const grafanaApiKey = '';  

export async function createGrafanaDashboard(orgName, bucketName, testPlan) {
    const dashboardUrl = `${grafanaUrl}/api/dashboards/db`;

    const dashboardConfig = {
        dashboard: {
            id: null,
            uid: null,
            title: `Performance Dashboard - ${orgName}`,
            timezone: 'browser',
            panels: [
                {
                    type: 'gauge',
                    title: 'Test Execution Gauge',
                    datasource: 'InfluxDB',
                    targets: [
                        {
                            query: `from(bucket: "${bucketName}") |> range(start: v.timeRangeStart, stop: v.timeRangeStop) |> filter(fn: (r) => r["_measurement"] == "testorch") |> filter(fn: (r) => r["_field"] == "testExecution") |> filter(fn: (r) => r["organization"] == "${orgName}") |> filter(fn: (r) => r["testPlan"] == "${testPlan}") |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false) |> yield(name: "mean")`
                        }
                    ],
                    fieldConfig: {
                        defaults: {
                            unit: 'percent',
                            min: 0,
                            max: 100,
                        }
                    },
                    gridPos: {
                        h: 8,
                        w: 12,
                        x: 0,
                        y: 0
                    }
                }
            ]
        },
        folderId: 0,
        overwrite: true  
    };

    try {
        const response = await axios.post(dashboardUrl, dashboardConfig, {
            headers: {
                Authorization: `Bearer ${grafanaApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const { uid, url } = response.data;  
        console.log(`Grafana dashboard created successfully: UID: ${uid}, URL: ${url}`);

        return { uid, url };  
    } catch (error) {
        console.error('Error creating Grafana dashboard:', error.response?.data || error.message);
    }
}


export async function updateGrafanaOrgVariable(dashboardId, organizationName) {
    try {
      const response = await axios.put(
        `${grafanaUrl}/api/dashboards/uid/${dashboardId}`,  
        {
          dashboard: {
            variables: {
              organization: organizationName,  
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${grafanaApiKey}`,
          },
        }
      );
      console.log('Grafana organization variable updated:', response.data);
    } catch (error) {
      console.error('Error updating Grafana organization variable:', error.response?.data || error.message);
    }
}
