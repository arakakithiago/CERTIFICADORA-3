const pool = require('../config/db');
const comTransacao = require('../config/transacao');
const { PONTOS, adicionarPontos, verificarEmblemas } = require('../services/gamificacaoService');

const CATEGORIAS = ['tecnologia', 'ia', 'design', 'outros'];

// Campos comuns às consultas de oficina, incluindo vagas restantes.
// `colunasExtras` permite acrescentar colunas (começando com vírgula).
function selectOficina(colunasExtras = '') {
  return `
    SELECT o.id, o.titulo, o.descricao, o.categoria, o.data, o.local, o.vagas,
           o.instrutora_id, ui.nome AS instrutora_nome,
           COUNT(i.id)::int AS total_inscritas,
           (o.vagas - COUNT(i.id))::int AS vagas_restantes
           ${colunasExtras}
    FROM oficinas o
    LEFT JOIN usuario ui ON ui.id = o.instrutora_id
    LEFT JOIN inscricoes i ON i.oficina_id = o.id
  `;
}

function validarOficina({ titulo, data, vagas, categoria }) {
  if (!titulo || !data || !vagas) {
    return 'Título, data e vagas são obrigatórios.';
  }
  if (Number.isNaN(new Date(data).getTime())) {
    return 'Data inválida.';
  }
  if (!Number.isInteger(Number(vagas)) || Number(vagas) <= 0) {
    return 'O número de vagas deve ser um inteiro maior que zero.';
  }
  if (categoria && !CATEGORIAS.includes(categoria)) {
    return `Categoria inválida. Use: ${CATEGORIAS.join(', ')}.`;
  }
  return null;
}

// RF02 - Cadastrar oficina (Coordenação)
async function cadastrarOficina(req, res) {
  const erroValidacao = validarOficina(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  const { titulo, descricao, categoria, data, local, vagas, instrutora_id } = req.body;

  try {
    const resultado = await pool.query(
      `INSERT INTO oficinas (titulo, descricao, categoria, data, local, vagas, instrutora_id)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'UTFPR-CP'), $6, $7) RETURNING *`,
      [
        titulo.trim(),
        descricao || null,
        categoria || 'tecnologia',
        data,
        local || null,
        Number(vagas),
        instrutora_id || null,
      ]
    );
    res.status(201).json({ mensagem: 'Oficina cadastrada com sucesso!', oficina: resultado.rows[0] });
  } catch (erro) {
    if (erro.code === '23503') {
      return res.status(400).json({ erro: 'Instrutora informada não existe.' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar oficina.' });
  }
}

// Lista oficinas. Filtros opcionais:
//   ?futuras=true  -> só as que ainda vão acontecer
//   ?menina_id=ID  -> inclui se essa menina está inscrita e se teve presença
async function listarOficinas(req, res) {
  const { futuras, menina_id } = req.query;
  const params = [];
  let colunasMenina = '';
  let where = '';

  if (menina_id) {
    params.push(menina_id);
    colunasMenina = `,
      EXISTS (SELECT 1 FROM inscricoes x WHERE x.oficina_id = o.id AND x.menina_id = $1) AS inscrita,
      EXISTS (SELECT 1 FROM inscricoes x WHERE x.oficina_id = o.id AND x.menina_id = $1 AND x.presenca) AS presenca`;
  }
  if (futuras === 'true') {
    where = 'WHERE o.data >= NOW()';
  }

  try {
    const resultado = await pool.query(
      `${selectOficina(colunasMenina)}
       ${where}
       GROUP BY o.id, ui.nome
       ORDER BY o.data ASC`,
      params
    );
    res.json({ oficinas: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar oficinas.' });
  }
}

async function obterOficina(req, res) {
  try {
    const resultado = await pool.query(
      `${selectOficina()} WHERE o.id = $1 GROUP BY o.id, ui.nome`,
      [req.params.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Oficina não encontrada.' });
    }
    res.json({ oficina: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar oficina.' });
  }
}

async function editarOficina(req, res) {
  const erroValidacao = validarOficina(req.body);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  const { titulo, descricao, categoria, data, local, vagas, instrutora_id } = req.body;

  try {
    const inscritas = await pool.query(
      `SELECT COUNT(*)::int AS total FROM inscricoes WHERE oficina_id = $1`,
      [req.params.id]
    );
    if (Number(vagas) < inscritas.rows[0].total) {
      return res.status(400).json({
        erro: `Já existem ${inscritas.rows[0].total} inscritas; as vagas não podem ser menores que isso.`,
      });
    }

    const resultado = await pool.query(
      `UPDATE oficinas
       SET titulo = $1, descricao = $2, categoria = $3, data = $4,
           local = COALESCE($5, 'UTFPR-CP'), vagas = $6, instrutora_id = $7
       WHERE id = $8 RETURNING *`,
      [
        titulo.trim(),
        descricao || null,
        categoria || 'tecnologia',
        data,
        local || null,
        Number(vagas),
        instrutora_id || null,
        req.params.id,
      ]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Oficina não encontrada.' });
    }
    res.json({ mensagem: 'Oficina atualizada!', oficina: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao editar oficina.' });
  }
}

async function excluirOficina(req, res) {
  try {
    const resultado = await pool.query(`DELETE FROM oficinas WHERE id = $1 RETURNING id`, [
      req.params.id,
    ]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Oficina não encontrada.' });
    }
    res.json({ mensagem: 'Oficina excluída.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir oficina.' });
  }
}

// RF03 - Menina se inscrever na atividade
async function inscreverMenina(req, res) {
  const { oficina_id, menina_id } = req.body;

  if (!oficina_id || !menina_id) {
    return res.status(400).json({ erro: 'Informe a oficina e a menina.' });
  }

  try {
    const resultado = await comTransacao(async (client) => {
      // Trava a oficina para que duas inscrições simultâneas não estourem as vagas.
      const oficina = await client.query(
        `SELECT id, vagas, data FROM oficinas WHERE id = $1 FOR UPDATE`,
        [oficina_id]
      );
      if (oficina.rows.length === 0) {
        return { status: 404, erro: 'Oficina não encontrada.' };
      }
      if (new Date(oficina.rows[0].data) < new Date()) {
        return { status: 400, erro: 'Esta oficina já aconteceu.' };
      }

      const menina = await client.query(`SELECT 1 FROM menina WHERE usuario_id = $1`, [menina_id]);
      if (menina.rows.length === 0) {
        return { status: 404, erro: 'Menina não encontrada.' };
      }

      const inscritas = await client.query(
        `SELECT COUNT(*)::int AS total FROM inscricoes WHERE oficina_id = $1`,
        [oficina_id]
      );
      if (inscritas.rows[0].total >= oficina.rows[0].vagas) {
        return { status: 409, erro: 'Não há mais vagas nesta oficina.' };
      }

      await client.query(`INSERT INTO inscricoes (oficina_id, menina_id) VALUES ($1, $2)`, [
        oficina_id,
        menina_id,
      ]);
      return { status: 201 };
    });

    if (resultado.erro) {
      return res.status(resultado.status).json({ erro: resultado.erro });
    }
    res.status(201).json({ mensagem: 'Inscrição realizada com sucesso!' });
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Você já está inscrita nesta oficina.' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro na inscrição.' });
  }
}

async function cancelarInscricao(req, res) {
  const { oficina_id, menina_id } = req.body;

  if (!oficina_id || !menina_id) {
    return res.status(400).json({ erro: 'Informe a oficina e a menina.' });
  }

  try {
    const resultado = await pool.query(
      `DELETE FROM inscricoes
       WHERE oficina_id = $1 AND menina_id = $2 AND presenca = FALSE
       RETURNING id`,
      [oficina_id, menina_id]
    );
    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ erro: 'Inscrição não encontrada ou presença já registrada.' });
    }
    res.json({ mensagem: 'Inscrição cancelada.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cancelar inscrição.' });
  }
}

// Lista as inscritas de uma oficina (usado na tela de presença).
async function listarInscricoes(req, res) {
  try {
    const oficina = await pool.query(`SELECT id FROM oficinas WHERE id = $1`, [req.params.id]);
    if (oficina.rows.length === 0) {
      return res.status(404).json({ erro: 'Oficina não encontrada.' });
    }

    const resultado = await pool.query(
      `SELECT u.id AS menina_id, u.nome, u.email, i.presenca, i.inscrito_em,
              i.registrado_por, ur.nome AS registrado_por_nome, i.registrado_em
       FROM inscricoes i
       JOIN usuario u ON u.id = i.menina_id
       LEFT JOIN usuario ur ON ur.id = i.registrado_por
       WHERE i.oficina_id = $1
       ORDER BY u.nome`,
      [req.params.id]
    );
    res.json({ inscricoes: resultado.rows });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar inscrições.' });
  }
}

// RF04 - Registrar (ou desfazer) presença. Marcar dá pontos e pode liberar
// emblemas; desmarcar retira os pontos.
//
// Qualquer mentora ativa ou a coordenação pode registrar presença em qualquer
// oficina (não precisa ser a responsável). `registrado_por` identifica quem
// fez a alteração e fica gravado para auditoria.
async function registrarPresenca(req, res) {
  const { oficina_id, menina_id, registrado_por } = req.body;
  const presenca = req.body.presenca === undefined ? true : Boolean(req.body.presenca);

  if (!oficina_id || !menina_id) {
    return res.status(400).json({ erro: 'Informe a oficina e a menina.' });
  }
  if (!registrado_por) {
    return res.status(400).json({ erro: 'Informe quem está registrando a presença.' });
  }

  try {
    const registrador = await pool.query(
      `SELECT 1 FROM usuario
       WHERE id = $1 AND ativo AND tipo IN ('mentora', 'coordenacao')`,
      [registrado_por]
    );
    if (registrador.rows.length === 0) {
      return res
        .status(403)
        .json({ erro: 'Apenas mentoras ativas e a coordenação podem registrar presença.' });
    }

    const resultado = await comTransacao(async (client) => {
      const atual = await client.query(
        `SELECT presenca FROM inscricoes WHERE oficina_id = $1 AND menina_id = $2 FOR UPDATE`,
        [oficina_id, menina_id]
      );
      if (atual.rows.length === 0) return null;

      // Nada muda se o estado já é o pedido (evita pontuar duas vezes).
      if (atual.rows[0].presenca === presenca) {
        return { alterado: false, novasConquistas: [] };
      }

      await client.query(
        `UPDATE inscricoes
         SET presenca = $1, registrado_por = $2, registrado_em = NOW()
         WHERE oficina_id = $3 AND menina_id = $4`,
        [presenca, registrado_por, oficina_id, menina_id]
      );
      const pontosAtuais = await adicionarPontos(
        menina_id,
        presenca ? PONTOS.PRESENCA : -PONTOS.PRESENCA,
        client
      );
      const novasConquistas = presenca ? await verificarEmblemas(menina_id, client) : [];

      return { alterado: true, pontosAtuais, novasConquistas };
    });

    if (!resultado) {
      return res.status(404).json({ erro: 'Esta menina não está inscrita nesta oficina.' });
    }

    res.status(200).json({
      mensagem: presenca ? 'Presença confirmada!' : 'Presença removida.',
      ...resultado,
    });
  } catch (erro) {
    if (erro.code === '22P02') {
      // id que não é número
      return res.status(400).json({ erro: 'Identificador inválido.' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao registrar presença.' });
  }
}

module.exports = {
  CATEGORIAS,
  cadastrarOficina,
  listarOficinas,
  obterOficina,
  editarOficina,
  excluirOficina,
  inscreverMenina,
  cancelarInscricao,
  listarInscricoes,
  registrarPresenca,
};
