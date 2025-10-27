"use strict";

/**
 * Build a SQL WHERE clause and parameter array from a filters object.
 * @param {Object} filters - key/value pairs from query params
 * @param {Object} mapping - optional mapping from filter key -> column name
 * @returns {{where: string, params: Array}}
 */
module.exports = function buildWhereAndParams(filters = {}, mapping = {}) {
    const clauses = [];
    const params = [];
    for (const [key, val] of Object.entries(filters)) {
        if (val == null || val === '') continue;
        const col = mapping[key] || key;
        clauses.push(`${col} = ?`);
        params.push(val);
    }
    return { where: clauses.length ? ' WHERE ' + clauses.join(' AND ') : '', params };
};
