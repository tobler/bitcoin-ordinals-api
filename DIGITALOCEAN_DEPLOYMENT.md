# Deploying to DigitalOcean App Platform

This guide walks you through deploying the Bitcoin Ordinals API to DigitalOcean App Platform.

## Fixing the "vite not found" Error

If you encounter a `vite: not found` error during deployment, follow these steps:

### Option 1: Configure the Correct Build Command

When creating your app in DigitalOcean App Platform:

1. Set the **Build Command** to:
   ```
   npm install vite -g && npm install && npm run build
   ```

2. Set the **Run Command** to:
   ```
   node dist/index.js
   ```

### Option 2: Use a Custom Dockerfile

For more control, you can use a Dockerfile:

1. Create a `Dockerfile` in your repository:
   ```Dockerfile
   FROM node:16

   WORKDIR /app

   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build

   ENV NODE_ENV=production
   
   EXPOSE 8080
   
   CMD ["node", "dist/index.js"]
   ```

2. In the DigitalOcean App Platform, choose "Deploy from Dockerfile" when creating your app.

## Environment Variables

Set these environment variables in the App Platform:

- `NODE_ENV`: `production`
- `PORT`: `8080` (DigitalOcean App Platform uses port 8080 by default)

For Bitcoin node configuration (if needed):
- `BITCOIN_NODE_HOST`
- `BITCOIN_NODE_PORT`
- `BITCOIN_NODE_USERNAME`
- `BITCOIN_NODE_PASSWORD`
- `BITCOIN_NODE_TIMEOUT`
- `BITCOIN_NODE_SSL`

## Deployment Steps

1. Sign in to DigitalOcean and go to App Platform
2. Click "Create App"
3. Connect to your GitHub repository
4. Configure the build and run commands as described above
5. Set up the environment variables
6. Choose your plan (Basic or Pro)
7. Click "Launch App"

## Troubleshooting

If you continue to have issues:

1. **Check the logs** in the DigitalOcean dashboard
2. Try deploying with a **different Node.js version** (14, 16, or 18)
3. Use the **Console** feature in App Platform to examine the file structure
4. Verify the build output path matches the path in your start command