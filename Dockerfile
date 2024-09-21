# Custom JMeter Dockerfile
FROM justb4/jmeter:latest

# Install jq and curl for fetching GitHub JMX files
RUN apk update && apk add --no-cache curl jq

# Create a directory for test plans
RUN mkdir -p /test-plans

# Set the working directory
WORKDIR /test-plans
