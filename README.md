# Scalapay Assessment - Aaron Lozenkovski

This test automation project uses **Puppeteer**, driven by the **Jest** framework. **Axios** is used to fetch the API data for verification.

## How to Run

All required jest configuration is included with the project; simply use **npm** to install the required modules:

```bash
npm install
```

The authentication for logon and API testing is managed in the **config.json** file. Add your credentials to the file provided in the project.

```JSON
{
    "un": "yourusername",
    "pw": "yourpassword",
    "token": "yourtoken"
}
```

## Usage

To start the test suite, run the following command from the project folder 
```bash
npm run test
```

Jest will execute the test suite and display the results once completed.