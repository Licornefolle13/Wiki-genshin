const pool = require('../db');
const buildWhereAndParams = require('../utils/buildWhereAndParams');

exports.list = async (req, res, next) => {
  try {
    const filters = {
      element: req.query.element,
      weapon_type: req.query.weapon_type,
      region: req.query.region,
      rarity: req.query.rarity ? Number(req.query.rarity) : undefined,
    };
    const mapping = { weapon_type: 'weapon_type', rarity: 'rarity' };
    const { where, params } = buildWhereAndParams(filters, mapping);
    const sql = `SELECT id, name, element, weapon_type, region, rarity, description, image_url FROM characters${where} ORDER BY rarity DESC, name`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
