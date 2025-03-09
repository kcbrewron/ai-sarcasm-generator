import { Hono } from 'hono';
import { getSarcasticComments, addOneSarcasticComment, likeSarcasticComment } from '../dao/sarcasmDAO';
import { generateComment, generateCategory } from '../services/ai';
import { describeRoute } from 'hono-openapi';
import { HTTPException } from 'hono/http-exception'


const sarcasm = new Hono();
/**
 * Get all 
 */
sarcasm.get("/", describeRoute({
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
                            example: '1234-fad23-adsf32-adfda23-adfs',
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
                            example: 1,
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
sarcasm.patch("/:id",describeRoute({
    summary: "Like Sarcastic comment",
    description: "Increment the likes on a sarcastic comment",
    parameters: {
        in: 'path',
        name: 'id',
        schema: {
            type: 'string',
        }, 
        required: true,
        description: 'This is the unique id of the sarcastic comment',
    }
}),async(c)=>{
    const id = await c.req.id;
    const results = await likeSarcasticComment(id,c.env);
    return results;
})

/**
 * Create one
 */
sarcasm.post("/generate",async(c)=>{
    const body = await c.req.json();
    const { prompt } = body
    console.log(`Sarcastic comment requested ${JSON.stringify(prompt)}`);

    try { 
        const comment = await generateComment(prompt,c.env);
        console.log(`Comment ${JSON.stringify(comment)}`);
        const category = await generateCategory(prompt,c.env);
        const sarcasm = {
            id: crypto.randomUUID(),
            prompt: prompt,
            category: category.response.split(','),
            sarcastic_comment: comment.response,
            likes: 0
        }
        const results = await addOneSarcasticComment(sarcasm,c.env)
        return c.json({comment,category});
    }catch(error){
        console.log(`Error message received ${JSON.stringify(error.message)}`);
        throw HTTPException({message: `error processing request for sarcasm.`});
    }

})

sarcasm.notFound(async (c)=>{
	return c.json({ message: `The path you requested, ${c.req.path} could not be located. Try again.`}, 404 );
})


sarcasm.onError(async (c)=>{
	return c.json({ message: `There was a server error processing your request. Try again later`}, 500 );
})

export default sarcasm;