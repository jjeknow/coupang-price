#!/bin/bash

# Xcode Cloud post-clone script
# Install dependencies for Capacitor plugins

set -e

cd "$CI_PRIMARY_REPOSITORY_PATH"

# Install Node.js using Homebrew
brew install node

# Install Node.js dependencies
npm ci

# Sync Capacitor
npx cap sync ios
