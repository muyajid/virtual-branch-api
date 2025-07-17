import db from "../application/db.js";

async function insert(data) {
  const query = await db.query(
    `
        INSERT INTO rekening (
            id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
            alamat_ktp, alamat_domisili, no_ktp, status_pernikahan,
            pekerjaan, npwp, no_hp, email, penghasilan, tujuan, jenis, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
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
      data.jenis,
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
  const [query] = await db.query(
    `SELECT * FROM verification_email WHERE token = ?`,
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

async function insertImage(id, img_ktp_url, img_wajah_url) {
  const query = await db.query(
    "INSERT INTO verification_face (id,img_ktp, img_face) VALUES(?,?,?)",
    [id, img_ktp_url, img_wajah_url]
  );

  return query;
}

async function selectRekening() {
  const query = await db.query(
    `
    SELECT
    u.id AS id_rekening,
    u.nama_lengkap,
    u.tempat_lahir,
    u.tanggal_lahir,
    u.jenis_kelamin,
    u.alamat_ktp,
    u.alamat_domisili,
    u.pekerjaan,
    u.penghasilan AS penghasilan_perbulan,
    u.status_pernikahan,
    u.no_ktp,
    u.npwp,
    u.no_hp,
    u.email,
    u.tujuan,
    u.jenis AS jenis_rekening,
    i.verified AS email_status,
    a.img_ktp,
    a.img_face,
    u.status
    FROM rekening u
    LEFT JOIN verification_email i ON u.id = i.id
    JOIN verification_face a ON u.id = a.id
    `
  );

  return query;
}
export {
  insert,
  insertToken,
  selectToken,
  updateToken,
  insertImage,
  selectRekening,
};
