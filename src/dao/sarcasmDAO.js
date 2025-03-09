import sarcasm from "../routes/sarcasm";

/** 
 * @param {Object} sarcasm 
 * @param {Object} env 
 * @returns 
 */
export async function addOneSarcasticComment(sarcasm, env) {
    if (!env.DB) throw new Error("Database Definition not defined");
    console.log(`sarcasm insert input =>${JSON.stringify(sarcasm)}`)
    try {
        const query = `INSERT INTO SARCASM (id, prompt,category,sarcastic_comment,likes) values (?,?,?,?,?) `;
        if (!sarcasm.id) sarcasm.id = crypto.randomUUID();
        let categories;
        sarcasm.categories.forEach((category) => {
            categories.push(category.trim());
        })
        console.log(`trimmed out Comments ${JSON.stringify(categories)}`);
        const results = await env.DB.prepare(query).bind(sarcasm.id,
            sarcasm.prompt.trim(),
            JSON.stringify(categories),
            sarcasm.sarcastic_comment,
            sarcasm.likes).run();
        console.log(`results of input data => ${JSON.stringify(results.success)}`);
        if (results.success) {
            return sarcasm;
        } else {
            throw new Error(`Error inserting`);
        }

    } catch (error) {
        console.error(`Error inserting data ${error}`)
        throw new Error({ error, message: "Unable to query table" });
    }
}

/**
 * 
 * @param {Object} sarcasm 
 * @param {Object} env 
 * @returns 
 */export async function likeSarcasticComment(id, env) {
    if (!env.DB) throw new Error("Database Definition not defined");
    try {
        const query = `UPDATE sarcasm SET likes = likes + 1 WHERE id = ?`;
        const { results } = await env.DB.prepare(query).bind(id).run();
        return results;
    } catch (error) {
        console.error(`Error incrementing likes: ${error}`);
        throw new Error(`Unable to increment likes`);
    }
}


/**
 * 
 * @param {Object} env 
 * @returns 
 */
export async function getSarcasticComments(env) {
    if (!env.DB) throw new Error("Database Definition not defined");
    try {
        const query = `select id, prompt, category,sarcastic_comment,likes from sarcasm`;
        const { results } = await env.DB.prepare(query).run();
        let data = results.map(comment => {

            return {
                id: comment.id,
                prompt: comment.prompt,
                sarcaticComment: comment.sarcastic_comment,
                likes: comment.likes,
                categories: JSON.parse(comment.category)
            }
        });
        return data;
    } catch (error) {
        console.error(`Error retrieving all comments ${error}`)
        throw new Error(`Unable to update table`);
    }
}

export async function checkIfExists(prompt, env) {
    if (!env.DB) throw new Error("Database Definition not defined");
    try {
        const query = `select id, prompt,category,sarcastic_comment,likes from sarcasm where prompt=?`;
        const results = env.DB.prepare(query).bind(prompt.trim()).all();
        if (!results.success) throw new Error('Error querying database');

        console.log(`Results from updating likes ${results.results[0]}`)
        return results;
    } catch (error) {
        console.error(`Error updating likes due to ${error}`)
        throw new Error(`Unable to update table`);
    }
}