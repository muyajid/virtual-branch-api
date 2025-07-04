import db from "../application/db.js";

async function insert(data) {
  const query = await db.query(
    `
        INSERT INTO rekening (
            id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
            alamat_ktp, alamat_domisili, no_ktp, status_pernikahan,
            pekerjaan, npwp, no_hp, email, penghasilan, tujuan, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `,
    [
      data.id,
      data.nama_lengkap,
      data.tempat_lahir,
      data.tanggal_lahir,
      data.jenis_kelamin,
      data.alamat_ktp,
      data.alamat_domisili,
      data.no_ktp,
      data.status_pernikahan,
      data.pekerjaan ?? null,
      data.npwp ?? null,
      data.no_hp,
      data.email,
      data.penghasilan ?? null,
      data.tujuan,
      data.status,
    ]
  );

  return query;
}

async function insertToken(data) {
  const query = await db.query(
    `
        INSERT INTO verification_email (id, token, expired) VALUES (?,?,?)`,
    [data.id, data.token, data.expired]
  );

  return query;
}

async function selectToken(token) {
  const query = await db.query(
    `
        SELECT * FROM verification_email WHERE token = ?`,
    [token]
  );
  return query;
}

async function updateToken(id, verifed) {
  const query = await db.query(
    `
        UPDATE verification_email
        SET verified = ?
        WHERE id = ?`,
    [verifed, id]
  );

  return query;
}

async function insertImage(data) {
  const query = await db.query(
    `
    INSERT INTO verification_fase (img_url, img_path)
    VALUE (?,?)`,
    [data.img_url, data.img_path]
  );

  return query;
};

export { insert, insertToken, selectToken, updateToken, insertImage };
