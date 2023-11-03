## Usage

Install `nodemon`

```
npm i nodemon -g
```

Install server and frontend dependencies

```
npm i
cd frontend
npm i
```

To start the server and frontend at the same time (from the root of the project)

```
npm run dev
```

Running the production build on localhost. This will create a production build, then Node will serve the app on http://localhost:5173/

```
NODE_ENV=production npm run dev:server
```

## TODO

### API

- [ ] Input Validation (joi)
- [ ] Rate Limiting
- [ ] Security Headers (HSTS, CSP, etc.
- [ ] Cross-Origin Resource Sharing (CORS) Policy
- [ ] Error Handling
- [ ] Logging 
- [ ] Data Sanitization prevent XSS (Cross-Site Scripting)
- [ ] Dependency Security (npm audit...)
- [ ] Testing (unit tests, integration tests)