#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e
current_time=$(date -u +"Update %Y-%m-%dT%H:%M:%S.%3NZ")

# Define variables
BRANCH="master" # Change this to your target branch
PUBLIC_DIR="public"

rm -rf $PUBLIC_DIR
git worktree add $PUBLIC_DIR $BRANCH

hugo

cd $PUBLIC_DIR
git add .
git commit -m "$current_time"
git push origin $BRANCH
cd ..

# Remove the worktree
#git worktreerremover$PUBLIC_DIR
