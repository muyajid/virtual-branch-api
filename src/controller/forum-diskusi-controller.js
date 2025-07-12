import {
  insertDataAnswer,
  insertDataQuestion,
  selectQuestion,
} from "../model/forum-diskusi-model.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";

dotenv.config();

async function postQuestion(req, res) {
  try {
    const { body } = req.body;
    if (!body) {
      res.status(401).json({
        message: `Data tidak valid, 'body' diperlukan`,
      });
      return;
    }

    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        message: `Authorization di perlukan`,
      });

      return;
    }
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
      created_at: Date.now(),
    });
  } catch (err) {
    console.error(`Terjadi eror => ${err.message}`);
    res.status(500).json({
      message: `Gagal post`,
      eror: err.message,
    });
  }
}

async function postAnswer(req, res) {
  try {
    const questionId = req.query.questionId;
    const { body } = req.body;
    console.log(questionId);

    if (!questionId || !body) {
      return res.status(400).json({
        message: `Header 'questionId' dan body 'body' diperlukan`,
      });
    }
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        message: `Authorization di perlukan`,
      });

      return;
    }
    const token = authorization.split(" ")[1];
    const payload = await JWT.verify(token, process.env.JWT_SECRET);

    const username = payload.username;
    const generateId = uuid().replace(/-/g, "");
    const data = {
      id: generateId,
      username: username,
      question_id: questionId,
      body: body,
    };

    await insertDataAnswer(data);
    const select = await selectQuestion(questionId);
    console.log(select);

    res.status(200).json({
      post_id: select[0].id,
      question: select[0].body,
      answer: {
        id: generateId,
        username: username,
        answer: body,
      },
    });
  } catch (err) {
    console.error(`Terjadi eror => ${err.message}`);
    res.status(500).json({
      message: `Gagal menjawab`,
      eror: err.message,
    });
  }
}

export { postQuestion, postAnswer };
