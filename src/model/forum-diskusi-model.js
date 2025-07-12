import db from "../application/db.js"

async function insertDataQuestion(data) {
    const query = await db.query(
        `INSERT INTO forum_question (id, username, body) VALUES (?,?,?)`,
        [
            data.id,
            data.username,
            data.body
        ]
    );

    return query;
}

export {
    insertDataQuestion
}