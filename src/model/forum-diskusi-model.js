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

async function insertDataAnswer(data) {
    const query = await db.query(
        `
        INSERT INTO forum_answer (id, username, question_id, body)
        VALUES (?,?,?,?)
        `,
        [
            data.id,
            data.username,
            data.question_id,
            data.body
        ]
    );

    return query;
}

async function selectQuestion(id) {
    const [query] = await db.query(
        `SELECT * FROM forum_question WHERE id = ?`,
        [id]
    );

    return query;
}

export {
    insertDataQuestion,
    insertDataAnswer,
    selectQuestion
}