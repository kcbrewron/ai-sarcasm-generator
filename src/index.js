import packageJSON from '../package.json'
import { Hono } from "hono";
import { apiReference } from '@scalar/hono-api-reference';
import openAPISpecs from 'hono-openapi'
import sarcasm from './routes/sarcasm';


// Start a Hono app
const app = new Hono();

app.route("/", sarcasm);


app.get(
	'/openapi',
	openAPISpecs(app, {
		documentation: {
			info: {
				title: 'Sarcasm Generator and rating API',
				version: `${packageJSON.version}`,
				description: 'Sarcasm API',
			},
			servers: [
				{ url: 'http://localhost:8787', description: 'Local Server' },
			],
		},
	})
)


app.get(
	'/docs',
	apiReference({
		theme: 'saturn',
		spec: { url: '/openapi' },
	})
)

// Export the Hono app
export default app;
