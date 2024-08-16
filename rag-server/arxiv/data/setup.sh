#!/bin/bash

# Define variables
DATASET_URL="Cornell-University/arxiv"
ZIP_FILE="arxiv.zip"
DEST_DIR="src/data/"

# Check if Kaggle CLI is installed
if ! command -v kaggle &> /dev/null; then
    echo "Kaggle CLI could not be found. Please install it and configure your API token."
    exit 1
fi

# Download the dataset
echo "Downloading dataset from Kaggle..."
kaggle datasets download -d $DATASET_URL --quiet

# Check if the download was successful
if [ $? -ne 0 ]; then
    echo "Failed to download dataset. Please check the dataset URL and your Kaggle CLI configuration."
    exit 1
fi

# Unzip the downloaded file
echo "Unzipping the dataset..."
unzip -q $ZIP_FILE -d $DEST_DIR

# Check if the unzip was successful
if [ $? -ne 0 ]; then
    echo "Failed to unzip the file. Please check if 'unzip' is installed and the ZIP file is correct."
    exit 1
fi

# Clean up
echo "Cleaning up..."
rm $ZIP_FILE

echo "Setup complete. Dataset is available in the '$DEST_DIR' directory."
