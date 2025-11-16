const pool = require('../db');
const buildWhereAndParams = require('../utils/buildWhereAndParams');

exports.list = async (req, res, next) => {
  try {
    const filters = {
      weapon_type: req.query.weapon_type,
      rarity: req.query.rarity ? Number(req.query.rarity) : undefined,
    };
    const mapping = { type: 'type', rarity: 'rarity' };
    const { where, params } = buildWhereAndParams(filters, mapping);
    const sql = `SELECT id, name, type, rarity, base_attack, secondary_stat, description, image_url FROM weapons${where} ORDER BY rarity DESC, name`;
    const [rows] = await pool.query(sql, params);

    // Ensure every weapon has an image_url. If missing, build a sensible fallback
    // using the pattern `/images/weapons/Weapon_<Sanitized_Name>.png`.
    const sanitizeForFilename = (name) => {
      if (!name) return '';
      // remove characters that are unsafe in filenames except letters, digits, spaces, apostrophes and hyphens
      const cleaned = name.replace(/[^\w\s'\-]/g, '');
      return cleaned.replace(/\s+/g, '_');
    };

    const normalized = rows.map((r) => {
      if (r.image_url && r.image_url !== '') return r;
      const file = `Weapon_${sanitizeForFilename(r.name)}.png`;
      return { ...r, image_url: `/images/weapons/${file}` };
    });

    res.json(normalized);
  } catch (err) {
    next(err);
  }
};
