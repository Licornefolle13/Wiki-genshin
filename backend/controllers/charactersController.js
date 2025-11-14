const pool = require('../db');
const path = require('path');
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

    // Normalize image URLs so the frontend can load them from the static /genshin route.
    const normalized = rows.map((r) => {
      const image = r.image_url || r.image_path || '';
      let image_url = image;

      // If image is already an absolute URL or a static path served by the backend (/genshin/...), leave it
      if (typeof image === 'string' && image.length > 0) {
        if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/genshin/') || image.startsWith('/images/characters/') || image.startsWith('/')) {
          image_url = image;
        } else {
          // Extract filename and build the served path
          const filename = path.basename(image.replace(/\\\\/g, '/'));
          image_url = `/images/characters/${filename}`;
        }
      } else {
        image_url = null;
      }

      return {
        ...r,
        image_url,
      };
    });

    res.json(normalized);
  } catch (err) {
    next(err);
  }
};
