---
allowed-tools: Bash
argument-hint: [port] [mode]
description: Start the Orion frontend service
---

## Context

- Current directory: !`pwd`
- Node version: !`node --version 2>/dev/null || echo "Node not installed"`
- Running Next.js processes: !`ps aux | grep -E "next|npm run" | grep -v grep | head -5 || echo "No Next.js processes running"`

## Your task

Start the Orion frontend service with the following requirements:

1. Parse arguments:
   - First argument ($1): Port number (default: 5000)
   - Second argument ($2): Mode - "dev" or "prod" (default: dev)

2. Check if the port is already in use:
   - If occupied, show what's running there and suggest stopping it first
   - Use lsof or ss to check port availability

3. Start the appropriate service:
   - For "dev" mode: Run `npm run dev` (or modify package.json script to use custom port)
   - For "prod" mode: Run `npm run build` first, then `npm run start`
   - Use PORT environment variable if the npm scripts support it

4. Provide clear feedback:
   - Show the command being executed
   - Display the URL where the service will be available (http://localhost:PORT)
   - Mention that the service is starting in the background
   - Suggest using `/stop-frontend` to stop the service later

5. Handle errors gracefully:
   - If npm/node is not installed, provide installation instructions
   - If package.json is missing or invalid, show appropriate error
   - If dependencies are not installed, suggest running `npm install` first

Arguments provided: $ARGUMENTS

Execute this task and provide clear, concise output to the user.