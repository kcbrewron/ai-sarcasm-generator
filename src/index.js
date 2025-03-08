import { Hono } from "hono";
import { apiReference } from '@scalar/hono-api-reference';
import sarcasm from './routes/sarcasm';
// Start a Hono app
const app = new Hono();

app.route("/", sarcasm);
// Setup OpenAPI registry
const openapi = apiReference(app, {
	docs_url: "/",
});



// Export the Hono app
export default app;
