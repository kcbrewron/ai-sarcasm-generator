

/**
 * generate sarcastic comment
 */
export async function generateComment(prompt,env){
    if(!env.AI) throw new Error(`Environment not provisionted correctly`);
    if(!prompt || prompt.trim().length===0) throw new Error(`Cannot generate comment without prompt`);
    console.log(`user prompt ${prompt}`)
    const messages = [
        { role: "system", content: "As a sarcastic and demoralized senior software engineer, write a short, witty comment related to information technology topics aligned with the user prompt." },
        {
          role: "user",
          content: `${prompt}`,
        },
      ];
    try {
        const sarcasticComment = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {messages});

        console.log(`The sarcastic comment output is ${JSON.stringify(sarcasticComment)}`);
        return sarcasticComment;
    }catch(error){
        console.log(`Error generating comment`);
        throw new Error(error);
    }
}


export async function generateCategory(prompt,env){
    if(!env.AI) throw new Error(`Environment not provisionted correctly`);
    if(!prompt || prompt.trim().length===0) throw new Error(`Cannot generate comment without prompt`);
    console.log(`user prompt ${prompt}`)

    const messages = [
        { role: "system", content: "As a helpful content creator for technology commentary, identify a set of two or three words that identify the theme of this user prompt. Do not respond with a preamble, only provide me a comma separated list of categories."},

        {
          role: "user",
          content: `${prompt}`,
        },
      ];
    try {
        const category = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {messages});

        console.log(`The sarcastic comment output is ${category}`);
        return category;
    }catch(error){
        console.log(`Error generating comment`);
        throw new Error(error);
    }
}
