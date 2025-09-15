## How to Fill FRONTEND_URL and VITE_BACKEND_URL

To set up your environment variables correctly, follow these steps:

1. Open your `.env` file.
2. For `FRONTEND_URL`, enter the full URL where your frontend will run (for example, in Codespaces or locally):

   ```env
   FRONTEND_URL=https://your-frontend-url.com
   ```

3. For `VITE_BACKEND_URL`, enter the full URL where your backend will run:

   ```env
   VITE_BACKEND_URL=https://your-backend-url.com
   ```

**Important rules:**

- Do NOT use quotes for URLs (write: VITE_BACKEND_URL=https://..., not VITE_BACKEND_URL="https://...").
- Do NOT add spaces before or after the `=` sign.
- Do NOT add a trailing slash `/` at the end of the URL (write: https://your-backend-url.com, not https://your-backend-url.com/).
- Only the `JWT_SECRET_KEY` should have quotes, and it must be written without spaces (e.g., JWT_SECRET_KEY="your_secret").

**Example:**

```env
FRONTEND_URL=https://curly-happiness-jjrx779pq5wwhpp7q-3000.app.github.dev
VITE_BACKEND_URL=https://curly-happiness-jjrx779pq5wwhpp7q-3001.app.github.dev
JWT_SECRET_KEY="your_secret_key"
```

## Google Places API Key Setup

## Setting Up Your .env File

To configure your environment variables, follow these steps:

1. Locate the `.env.example` file in the root of the project. This file contains example environment variables and their expected format.
2. Copy the `.env.example` file and rename the copy to `.env`:

   ```bash
   cp .env.example .env
   ```

3. Open the new `.env` file and fill in the values as needed for your environment. Each variable is explained in the comments within the file.
4. Save the file. Your application will now use these environment variables.

**Note:** Never commit your `.env` file to version control, as it may contain sensitive information.
To use the Google Places features in this project, you need your own Google API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Enable the "Places API" for your project.
4. Create an API key and restrict it as needed.
5. Copy your API key.
6. Create a `.env` file in the project root (you can copy `.env.example` as a template).
7. Paste your API key in the `.env` file like this:

   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

**Never share your real API key publicly.**

---

## ⚠️ Important: Make Ports Public in Codespaces

If you are running this project in GitHub Codespaces, make sure to set your exposed ports (such as backend and frontend) to **public**. Otherwise, you may encounter connection errors or be unable to access your app from the browser.

To do this:

1. Click the "Ports" tab at the bottom of your Codespace window.
2. Find the port your app is running on (e.g., 3000, 5000, 8080).
3. Click the lock icon and select "Public".

This ensures you (and anyone you share the link with) can access your running application.

---

### **Important note about the database and its data**

Each Github Codespace environment will have **its own database**, so if you are working with more people, each will have a different database and different records inside it. This data **will be lost**, so don't spend too much time creating records manually for testing. Instead, you can automate adding records to your database by editing the `commands.py` file inside the `/src/api` folder. Edit line 32 of the `insert_test_data` function to insert data according to your model (use the `insert_test_users` function above as an example). Then, all you need to do is run `pipenv run insert-test-data`.
