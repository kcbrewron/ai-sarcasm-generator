import packageJSON from '../package.json'
import { Hono } from "hono";
import { apiReference } from '@scalar/hono-api-reference';
import { openAPISpecs } from 'hono-openapi'
import sarcasm from './routes/sarcasm';
import { logger } from 'hono/logger'

// Start a Hono app
const app = new Hono();
app.use(logger());
app.route("/api/sarcasm", sarcasm);


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

app.notFound(async (c)=>{
	return c.json({ message: `The path you requested, ${c.req.path} could not be located. Try again.`}, 404 );
})


app.onError(async (c)=>{
	return c.json({ message: `There was a server error processing your request. Try again later`}, 500 );
})
// Export the Hono app
export default app;
