#!/bin/bash

# Xcode Cloud post-clone script
# Install dependencies for Capacitor plugins

cd "$CI_PRIMARY_REPOSITORY_PATH"

# Install Node.js dependencies
npm ci

# Sync Capacitor
npx cap sync ios
