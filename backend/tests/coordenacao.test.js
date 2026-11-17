const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  iniciar,
  encerrar,
  chamar,
  criarMentora,
  criarMenina,
  criarOficina,
  concluirOficina,
  marcarPresenca,
} = require('./helpers');

describe('Indicadores e visão da coordenação', () => {
  before(iniciar);
  after(encerrar);

  it('indicadores zerados num banco vazio', async () => {
    const r = await chamar('GET', '/dashboard');
    assert.equal(r.status, 200);
    assert.equal(r.corpo.indicadores.totalMeninas, 0);
    assert.equal(r.corpo.indicadores.taxaPresenca, null, 'sem oficinas passadas não há taxa');
    assert.deepEqual(r.corpo.porCategoria, []);
  });

  it('calcula totais, taxa de presença e números por categoria', async () => {
    await criarMentora();
    const a = await criarMenina();
    const b = await criarMenina();

    // Oficina passada: 2 inscritas, 1 presente -> taxa 50%.
    const passada = await criarOficina({ diasAPartirDeHoje: -1, categoria: 'ia' });
    await concluirOficina(passada, a);
    await concluirOficina(passada, b);
    await marcarPresenca(passada, b, { presenca: false });

    // Oficina futura com uma inscrição (não entra na taxa de presença).
    const futura = await criarOficina({ categoria: 'design' });
    await chamar('POST', '/oficinas/inscricao', { oficina_id: futura.id, menina_id: a.id });

    const { corpo } = await chamar('GET', '/dashboard');
    const i = corpo.indicadores;
    assert.equal(i.totalMeninas, 2);
    assert.equal(i.meninasSemMentora, 0);
    assert.equal(i.mentorasAtivas, 1);
    assert.equal(i.totalOficinas, 2);
    assert.equal(i.oficinasFuturas, 1);
    assert.equal(i.totalInscricoes, 3);
    assert.equal(i.totalPresencas, 1);
    assert.equal(i.taxaPresenca, 50);

    const ia = corpo.porCategoria.find((c) => c.categoria === 'ia');
    assert.deepEqual(
      { oficinas: ia.oficinas, inscricoes: ia.inscricoes, presencas: ia.presencas },
      { oficinas: 1, inscricoes: 2, presencas: 1 }
    );
  });

  it('lista as meninas com mentora e progresso', async () => {
    const r = await chamar('GET', '/meninas');
    assert.equal(r.status, 200);
    assert.equal(r.corpo.meninas.length, 2);
    for (const m of r.corpo.meninas) {
      assert.ok(m.mentora_nome, 'toda menina tem mentora');
      assert.equal(typeof m.pontos, 'number');
    }
    const comPresenca = r.corpo.meninas.find((m) => m.atividades_concluidas === 1);
    assert.equal(comPresenca.total_inscricoes, 2);
    assert.equal(comPresenca.total_conquistas, 2); // Primeiros Passos + Future AI
  });

  it('rotas de menina inexistente respondem 404', async () => {
    for (const rota of ['/meninas/999999/trilha', '/meninas/999999/recomendacoes']) {
      const r = await chamar('GET', rota);
      assert.equal(r.status, 404, rota);
    }
    const r = await chamar('GET', '/mentoras/999999/mentorandas');
    assert.equal(r.status, 404);
  });
});
