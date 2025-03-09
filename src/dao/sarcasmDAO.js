
/**
 * 
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

        const results = await query.bind(sarcasm.id, sarcasm.prompt, JSON.stringify(sarcasm.category), sarcasm.sarcastic_comment, sarcasm.likes).run();
        console.log(`results of input data => ${JSON.stringify(results)}`);
        if (!results.success) throw new Error('Error querying database');
        return resolve(results);
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
 */
export async function likeSarcasticComment(id, env) {
    if (!env.DB) throw new Error("Database Definition not defined");
    if (!id) throw new Error("To Add Likes, an id must be supplied")
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select id, likes from sarcasm where id=?`;
            const results = query.bind(sarcasm.id).all();
            if (!results.success) throw new Error('Error querying database');

            console.log(`Results from updating likes ${results.results[0]}`)
            return resolve(results);
        } catch (error) {
            console.error(`Error updating likes`)
            throw new Error(`Unable to update table`);
        }
    })
}


/**
 * 
 * @param {Object} env 
 * @returns 
 */
export async function getSarcasticComments(env) {
    if (!env.DB) throw new Error("Database Definition not defined");
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select id, prompt,category,sarcastic_comment,likes from sarcasm`;
            const results = query.all();
            if (!results.success) throw new Error('Error querying database');

            console.log(`Results from updating likes ${results.results[0]}`)
            return resolve(results);
        } catch (error) {
            console.error(`Error updating likes`)
            throw new Error(`Unable to update table`);
        }
    })
}