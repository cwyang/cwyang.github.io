#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables
REPO="https://github.com/cwyang/cwyang.github.io"
BRANCH="master" # Change this to your target branch
PUBLIC_DIR="public"

# Build the Hugo site
hugo

# Navigate to the public directory
cd $PUBLIC_DIR

# Initialize a new Git repository in the public directory
git init

# Add remote repository
git remote add origin $REPO

# Add all changes to git
git add .

# Commit changes
git commit -m "Deploy site"

# Push changes to the specified branch
git push -f origin $BRANCH

# Return to the root of the project
cd ..
