import packageJSON from '../package.json'
import { Hono } from "hono";
import { apiReference } from '@scalar/hono-api-reference';
import { openAPISpecs } from 'hono-openapi'
import sarcasm from './routes/sarcasm';
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'

// Start a Hono app
const app = new Hono();
//app.use(logger());
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

app.notFound(async (c) => {
	return c.json({ message: `The path you requested, ${c.req.path} could not be located. Try again.` }, 404);
})



app.onError((err, c) => {
	if (err instanceof HTTPException) {
	  // Get the custom response
	  return err.getResponse()
	}
})
// Export the Hono app
export default app;
