#!/bin/bash

kubectl create namespace perf-platform
kubectl apply -f ../kubernetes/secrets/github-credentials-secret.yaml

kubectl apply -f ../kubernetes/deployments/jmeter-master-deployment.yaml
kubectl apply -f ../kubernetes/services/jmeter-master-service.yaml
