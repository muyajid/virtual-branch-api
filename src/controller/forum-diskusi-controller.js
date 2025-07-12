import { insertDataQuestion } from "../model/forum-diskusi-model";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";

dotenv.config();

async function postQuestion(req, res) {
  try {
    const body = req.body;
    if (!body) {
        res.status(401).json({
            message: `Data tidak valid, 'body' diperlukan`
        });
        return;
    }

    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    const payload = await JWT.verify(token, process.env.JWT_SECRET);

    const username = payload.username;
    const generateId = `f` + uuid().replace(/-/g, "");
    const data = {
      id: generateId,
      username: username,
      body: body,
    };

    await insertDataQuestion(data);

    res.json({
      message: `New post`,
      post_id: generateId,
      username: username,
      body: body,
      created_at: Date.now()
    });

  } catch (err) {
    console.error(`Terjadi eror => ${err.message}`);
    res.status(500).json({
        message: `Gagal post`,
        eror: err.message
    });
  }
}
