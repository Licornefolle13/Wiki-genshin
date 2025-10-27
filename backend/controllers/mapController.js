const pool = require('../db');
const buildWhereAndParams = require('../utils/buildWhereAndParams');
exports.list = async (req, res, next) => {
  try {
    const filters = { category: req.query.category, region: req.query.region };
    const mapping = { category: 'category', region: 'region' };
    const { where, params } = buildWhereAndParams(filters, mapping);
    const sql = `SELECT id, name, lat, lng, category, region, description FROM map_markers${where} ORDER BY region, name`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
