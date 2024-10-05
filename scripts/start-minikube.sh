#!/bin/bash

minikube start --cpus=4 --memory=8192 --disk-size=30g

minikube addons enable ingress
minikube addons enable metrics-server
