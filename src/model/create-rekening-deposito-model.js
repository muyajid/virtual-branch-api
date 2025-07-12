import db from "../application/db.js";

async function insertData(data) {
    const query = await db.query(
        `
        INSERT INTO deposito (id, nama_lengkap, alamat_lengkap,
        nomor_telepon, alamat_email, pekerjaan, sumber_dana, tujuan,
        nama_ibu, jangka_waktu, setoran_awal, penarikan_bunga)
        VALUE (?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
            data.id,
            data.nama_lengkap,
            data.alamat_lengkap,
            data.nomor_telepon,
            data.alamat_email,
            data.pekerjaan,
            data.sumber_dana,
            data.tujuan,
            data.nama_ibu,
            data.jangka_waktu,
            data.setoran_awal,
            data.penarikan_bunga
        ]
    );

    return query;
}

async function selectData() {
    const [query] = await db.query(`SELECT * FROM deposito`);
    return query;
}

async function selectId(id) {
    const [query] = await db.query(`SELECT * FROM deposito WHERE id = ?`, [id]);
    return query;
}
export { insertData, selectData, selectId}