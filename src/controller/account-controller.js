import { insert, select } from "../model/account-model.js";
import { v4 as uuid } from "uuid";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

async function register(req, res) {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            throw new Error("Data tidak valid");
        }

        let generateId = uuid().replace(/-/g, "");
        const hashPassword = await argon2.hash(password);

        const query = await insert(generateId, username, hashPassword);
        console.log(`Hasil insert account => ${query}`);

        res.json({
            message: `Regsiter account berhasil`,
            data: {
                id: generateId,
                username: username
            }
        });

    } catch (err) {
        console.error(`Terjadi eror => ${err.message}`);
        res.status(500).json({
            message: `Register account gagal`,
            eror: err.message
        });
    }
};

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error("Data tidak valid");
        }

        const query = await select(username);

        if (query === undefined) {
            res.json({ message: `Akun tidak ditemukan` });
            return;
        }

        const verifyAccount = await argon2.verify(query.PASSWORD, password);
        if (!verifyAccount) {
            res.status(401).json({ message: `Login gagal password tidak sesuai` });
            return;
        }
        
        const payload = { id: query.id, username: query.username };
        const secretKey = process.env.JWT_SECRET;

        const JWTtoken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        console.log(`Token JWT => ${JWTtoken}`);
    
        
        res.json({
            message: `Login berhasil`,
            data: {
                id: query.id,
                username: query.username
            },
            token: JWTtoken
        });

    } catch (err) {
        console.error(`Terjadi eror => ${err.message}`);
        res.status(500).json({
            message: `Login gagal`,
            eror: err.message
        });
    }
};

export { register, login };
