import { Hono } from 'hono';
import { getSarcasticComments, addOneSarcasticComment, likeSarcasticComment } from '../dao/sarcasmDAO';
import { describeRoute } from 'hono-openapi';


const sarcasm = new Hono();
/**
 * Get all 
 */
sarcasm.get("/",describeRoute({
    description: 'Get all sarcast comments',
    summary: "Get Sarcastic Comments",
    tags: ["Sarcasm"],
    responses: {
        200: {
            description: "Successful Resposne",
            'application/json': {
                schema: {
                    type: "object",
                    properties: {
                        id: {
                            description: 'The unique identifier of the sarcastic comment',
                            example: crypto.randomUUID(),
                            type: 'string',
                        },
                        prompt: {
                            description: 'The prompt entered for sarcastic comment',
                            example: "When I test, I test in production",
                            type: 'string',
                        },
                        category: {
                            description: 'AI Generated category of the sarcastic comment',
                            example: "Testing",
                            type: 'string',
                        },
                        sarcastic_comment: {
                            description: 'The comment of the sarcastic comment',
                            example: "long string from ai",
                            type: 'string',
                        },
                        likes: {
                            description: 'The number of likes for the sarcastic comment',
                            example: crypto.randomUUID(),
                            type: 'number',
                        },
                        created_ts: {
                            description: 'The date when it was created sarcastic comment',
                            example: `${new Date().toISOString}`,
                            type: 'string',
                            format: 'datetime',
                        }

                    }
                }
            }
        }
    },
}), async (c)=>{
    const results = await getSarcasticComments(c.env)
    const processedResults = results;

    /**
     * Process results
     */
    return  processedResults;
})
/**
 * Add Like 
 */
sarcasm.patch("/:id",async(c)=>{
    const id = await c.req.id;
    const results = await likeSarcasticComment(id,c.env);
    return results;
})

/**
 * Create one
 */
sarcasm.post("/",async(c)=>{
    const body = await c.req.json();
    console.log(`Sarcastic comment created ${JSON.stringify(body)}`);

    const results = addOneSarcasticComment(body,c.env)
})

export default sarcasm;