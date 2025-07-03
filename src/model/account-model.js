import db from "../application/db.js";

async function insert(id, username, password) {
    const registerQuery = await db.query(
        "INSERT INTO account (id, username, password) VALUES(?,?,?)",
        [id, username, password]
    );

    return registerQuery;
};

async function select(username) {
    const [loginQuery] = await db.query(
        "SELECT * FROM account WHERE username = ?",
        [username]
    );

    return loginQuery[0];
};

export { insert, select }
