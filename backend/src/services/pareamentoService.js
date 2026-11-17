const pool = require('../config/db');

// Pareamento por carga: a menina é ligada à mentora ATIVA com menos
// mentorandas. Empates são resolvidos pela mentora cadastrada há mais tempo.

async function escolherMentora(db = pool) {
  const resultado = await db.query(
    `SELECT m.usuario_id AS id
     FROM mentora m
     JOIN usuario u ON u.id = m.usuario_id
     LEFT JOIN menina me ON me.mentora_id = m.usuario_id
     WHERE u.ativo = TRUE
     GROUP BY m.usuario_id, u.criado_em
     ORDER BY COUNT(me.usuario_id) ASC, u.criado_em ASC
     LIMIT 1`
  );
  return resultado.rows.length ? resultado.rows[0].id : null;
}

// Pareia uma menina específica. Retorna o id da mentora ou null se não houver
// nenhuma mentora ativa.
async function parearMenina(meninaId, db = pool) {
  const mentoraId = await escolherMentora(db);
  if (!mentoraId) return null;

  await db.query(`UPDATE menina SET mentora_id = $1 WHERE usuario_id = $2`, [
    mentoraId,
    meninaId,
  ]);
  return mentoraId;
}

// Pareia todas as meninas ativas que estão sem mentora, uma por vez, para que
// a carga seja distribuída de forma equilibrada. Retorna quantas foram pareadas.
async function parearPendentes(db = pool) {
  const pendentes = await db.query(
    `SELECT me.usuario_id AS id
     FROM menina me
     JOIN usuario u ON u.id = me.usuario_id
     WHERE me.mentora_id IS NULL AND u.ativo = TRUE
     ORDER BY u.criado_em ASC`
  );

  let pareadas = 0;
  for (const { id } of pendentes.rows) {
    const mentoraId = await parearMenina(id, db);
    if (!mentoraId) break; // Nenhuma mentora ativa disponível.
    pareadas += 1;
  }
  return pareadas;
}

// Quando uma mentora é desativada, suas mentorandas são liberadas e
// redistribuídas entre as mentoras que continuam ativas.
async function redistribuirMentorandas(mentoraId, db = pool) {
  await db.query(`UPDATE menina SET mentora_id = NULL WHERE mentora_id = $1`, [mentoraId]);
  return parearPendentes(db);
}

module.exports = { escolherMentora, parearMenina, parearPendentes, redistribuirMentorandas };
