If you receive error of requests module not found:
pipenv install requests

## Google Places API Key Setup

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

# WebApp Template with React JS and Flask API

Build web applications using React.js for the front end and Python/Flask for your API backend.

- Documentation can be found here: https://4geeks.com/docs/start/react-flask-template
- Here is a video on [how to use this template](https://www.youtube.com/watch?v=qBz6Ddd2m38)
- Integrated with Pipenv for package management.
- Quick deployment to Render [in just a few steps here](https://4geeks.com/es/docs/start/despliega-con-render-com).
- Use of the .env file.
- SQLAlchemy integration for database abstraction.

### 1) Installation:

> If you use Github Codespaces (recommended) or Gitpod, this template will already come with Python, Node, and the Postgres database installed. If working locally, make sure to install Python 3.10, Node.

It is recommended to install the backend first. Make sure you have Python 3.10, Pipenv, and a database engine (Postgres recommended).

1. Install Python packages: `$ pipenv install`
2. Create a .env file based on .env.example: `$ cp .env.example .env`
3. Install your database engine and create your database. Depending on your database, you must create a DATABASE_URL variable with one of the possible values. Make sure to replace the values with your database information:

| Engine   | DATABASE_URL                                        |
| -------- | --------------------------------------------------- |
| SQLite   | sqlite:////test.db                                  |
| MySQL    | mysql://username:password@localhost:port/example    |
| Postgres | postgres://username:password@localhost:5432/example |

4. Run migrations: `$ pipenv run migrate` (skip if you haven't made changes in `./src/api/models.py`)
5. Apply migrations: `$ pipenv run upgrade`
6. Run the application: `$ pipenv run start`

> Note: Codespaces users can connect to psql by typing: `psql -h localhost -U gitpod example`

### Undo a migration

You can also undo a migration by running

```sh
$ pipenv run downgrade
```

### Populate the users table in the backend

To insert test users into the database, run the following command:

```sh
$ flask insert-test-users 5
```

And you will see the following message:

```
   Creating test users
   test_user1@test.com created.
   test_user2@test.com created.
   test_user3@test.com created.
   test_user4@test.com created.
   test_user5@test.com created.
   Users created successfully!
```

### **Important note about the database and its data**

Each Github Codespace environment will have **its own database**, so if you are working with more people, each will have a different database and different records inside it. This data **will be lost**, so don't spend too much time creating records manually for testing. Instead, you can automate adding records to your database by editing the `commands.py` file inside the `/src/api` folder. Edit line 32 of the `insert_test_data` function to insert data according to your model (use the `insert_test_users` function above as an example). Then, all you need to do is run `pipenv run insert-test-data`.

### Manual Front-End Installation:

- Make sure you are using Node version 20 and have already installed and run the backend correctly.

1. Install packages: `$ npm install`
2. Start coding! Launch the webpack development server `$ npm run start`

## Publish your website!

This template is 100% ready to deploy with Render.com and Heroku in minutes. Please read the [official documentation](https://4geeks.com/docs/start/deploy-to-render-com).

### Contributors

This template was built as part of the [Coding Bootcamp](https://4geeksacademy.com/us/coding-bootcamp) at 4Geeks Academy by [Alejandro Sanchez](https://twitter.com/alesanchezr) and many other contributors. Learn more about our [Full Stack Developer Course](https://4geeksacademy.com/us/coding-bootcamps/part-time-full-stack-developer) and [Data Science Bootcamp](https://4geeksacademy.com/us/coding-bootcamps/datascience-machine-learning).

You can find other templates and resources like this on the [school's github page](https://github.com/4geeksacademy/).
