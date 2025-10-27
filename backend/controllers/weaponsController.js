const pool = require('../db');
const buildWhereAndParams = require('../utils/buildWhereAndParams');

exports.list = async (req, res, next) => {
  try {
    const filters = {
      weapon_type: req.query.weapon_type,
      rarity: req.query.rarity ? Number(req.query.rarity) : undefined,
    };
    const mapping = { weapon_type: 'weapon_type', rarity: 'rarity' };
    const { where, params } = buildWhereAndParams(filters, mapping);
    const sql = `SELECT id, name, weapon_type, rarity, base_attack, secondary_stat, description, image_url FROM weapons${where} ORDER BY rarity DESC, name`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
