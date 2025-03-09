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
    try {
        
    const results = await getSarcasticComments(c.env)
    console.log(`GET all => size=${results.length}`)
    /**
     * Process results
     */
    return  c.json({results});

    }catch(error){
        console.log(error);
        const errorResponse = new Resposne(JSON.stringify({message: `Error increasing the likes for the request.`}, {status: 500}))
        throw new HTTPException(500,{res: errorResponse});   
    }
})
/**
 * Add Like 
 */
sarcasm.patch("/:id", describeRoute({
    summary: "Like Sarcastic comment",
    description: "Increment the likes on a sarcastic comment",
    parameters: [
        {
            in: 'path',
            name: 'id',
            schema: {
                type: 'string',
            }, 
            required: true,
            description: 'This is the unique id of the sarcastic comment',
        }
    ]
}), async (c) => {
    try{
        const id = await c.req.param("id");;
        console.log(`Request on patch ${JSON.stringify(await c.req)}`)
        console.log(`ID received: ${id}`);
        const results = await likeSarcasticComment(id, c.env);
        return c.json({results});
    }catch(error){
        console.log(error);
        const errorResponse = new Resposne(JSON.stringify({message: `Error increasing the likes for the request.`}, {status: 500}))
        throw new HTTPException(500,{res: errorResponse});   
     }
    
});

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
        await addOneSarcasticComment(sarcasm,c.env);
        return c.json({sarcasm});
    }catch(error){
        console.log(`Error message received ${JSON.stringify(error)}`);
        const errorResponse = new Response(JSON.stringify({ message: `An error occured processing the request.` }),{status: 500})
        throw new HTTPException(500,{res: errorResponse});
    }
})

export default sarcasm;