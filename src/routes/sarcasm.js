import { Hono } from 'hono';
import { getSarcasticComments, addOneSarcasticComment, likeSarcasticComment } from '../dao/sarcasmDAO';

const sarcasm = new Hono();
/**
 * Get all 
 */
sarcasm.get("/", async (c)=>{
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
    const results = await likeSarcasticComment(id);
    return results;
})

/**
 * Create one
 */
sarcasm.post("/",async(c)=>{

})

export default sarcasm;