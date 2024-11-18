
# Challenge 17 - README

## Introduction
This project is a TypeScript-based RESTful API designed for managing users, thoughts, and reactions. It allows users to create, retrieve, update, and delete thoughts, as well as manage user profiles and friend relationships. The API also supports adding reactions to thoughts.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Features
- Create, retrieve, update, and delete user profiles.
- Create, retrieve, update, and delete thoughts.
- Add and remove reactions to thoughts.
- Manage user friend lists.

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/shannonMG/Challenge_17.git
   cd social-thoughts-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Usage
After starting the server, the API will be available at `http://localhost:3000`.

## Troubleshooting
- Ensure MongoDB is running locally before starting the server.
- Check that all environment variables are correctly set in your `.env` file.
- For debugging, use:
  ```bash
  npm run debug
  ```

## Contributors
- [Shannon Mastrogiovanni](https://github.com/ShannonMG)

## License
This project is licensed under the MIT License.
