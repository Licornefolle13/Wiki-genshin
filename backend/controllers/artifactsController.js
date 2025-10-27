const pool = require('../db');
const buildWhereAndParams = require('../utils/buildWhereAndParams');
exports.list = async (req, res, next) => {
  try {
    const filters = { piece_type: req.query.piece_type };
    const mapping = { piece_type: 'piece_type' };
    const { where, params } = buildWhereAndParams(filters, mapping);
    const sql = `SELECT id, set_name, piece_type, rarity, description, image_url FROM artifacts${where} ORDER BY set_name`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
