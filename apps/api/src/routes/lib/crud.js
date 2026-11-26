const { run, get, all, generateId } = require('../../database');

// Devolve só os campos permitidos que vieram no body
function pick(body = {}, fields) {
    const out = {};
    for (const field of fields) {
        if (body[field] !== undefined) out[field] = body[field];
    }
    return out;
}

async function insertRow(table, data) {
    const row = { id: generateId(), ...data };
    const columns = Object.keys(row);
    await run(
        `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
        columns.map(c => row[c])
    );
    return row.id;
}

// Atualiza só os campos enviados; devolve false se o id não existe
async function updateRow(table, id, data) {
    const columns = Object.keys(data);
    if (columns.length === 0) {
        return !!(await get(`SELECT id FROM ${table} WHERE id = ?`, [id]));
    }
    const result = await run(
        `UPDATE ${table} SET ${columns.map(c => `${c} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`,
        [...columns.map(c => data[c]), id]
    );
    return result.changes > 0;
}

function missingFields(body = {}, required) {
    return required.filter(f => body[f] === undefined || body[f] === null || body[f] === '');
}

module.exports = { pick, insertRow, updateRow, missingFields, get, all, run };
