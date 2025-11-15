const pool = require('../db');
const buildWhereAndParams = require('../utils/buildWhereAndParams');

// Map DB slot names to frontend piece type names
const SLOT_MAP_TO_FRONTEND = {
  Plume: 'Feather',
  Flower: 'Flower',
  Sands: 'Sands',
  Goblet: 'Goblet',
  Circlet: 'Circlet',
};

exports.list = async (req, res, next) => {
  try {
    // Accept frontend piece_type values like 'Feather' but DB stores 'Plume'
    let pieceFilter = req.query.piece_type;
    if (pieceFilter === 'Feather') pieceFilter = 'Plume';

    const filters = { piece_type: pieceFilter };
    const mapping = { piece_type: 'p.slot' };
    const { where, params } = buildWhereAndParams(filters, mapping);

    const sql = `
      SELECT
        p.id,
        s.id AS set_id,
        s.set_name,
        s.rarity,
        s.two_piece_bonus,
        s.four_piece_bonus,
        p.slot AS slot,
        p.name AS piece_name,
        p.image_url,
        p.description,
        p.created_at
      FROM artifact_pieces p
      JOIN artifact_sets s ON p.set_id = s.id
      ${where}
      ORDER BY s.set_name, p.slot
    `;

    const [rows] = await pool.query(sql, params);

    // Normalize rows to match previous frontend `Artifact` shape
    const normalized = rows.map((r) => ({
      id: r.id,
      set_id: r.set_id,
      set_name: r.set_name,
      rarity: r.rarity,
      two_piece_bonus: r.two_piece_bonus,
      four_piece_bonus: r.four_piece_bonus,
      piece_type: SLOT_MAP_TO_FRONTEND[r.slot] || r.slot,
      piece_name: r.piece_name,
      image_url: r.image_url,
      description: r.description,
      created_at: r.created_at,
    }));

    res.json(normalized);
  } catch (err) {
    next(err);
  }
};
