const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  iniciar,
  encerrar,
  chamar,
  criarMentora,
  criarMenina,
  criarOficina,
  marcarPresenca,
  idCoordenacao,
  pool,
} = require('./helpers');

describe('Oficinas e inscrições', () => {
  before(iniciar);
  after(encerrar);

  it('valida os dados da oficina', async () => {
    const data = new Date(Date.now() + 86400000).toISOString();
    const casos = [
      { titulo: '', data, vagas: 5 },
      { titulo: 'X', data: 'ontem', vagas: 5 },
      { titulo: 'X', data, vagas: 0 },
      { titulo: 'X', data, vagas: 2.5 },
      { titulo: 'X', data, vagas: 5, categoria: 'banana' },
    ];
    for (const corpo of casos) {
      const r = await chamar('POST', '/oficinas', corpo);
      assert.equal(r.status, 400, `deveria recusar ${JSON.stringify(corpo)}`);
    }
  });

  it('lista oficinas com vagas restantes e status da menina', async () => {
    const menina = await criarMenina();
    const oficina = await criarOficina({ vagas: 3 });
    await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: menina.id });

    const r = await chamar('GET', `/oficinas?menina_id=${menina.id}`);
    const item = r.corpo.oficinas.find((o) => o.id === oficina.id);
    assert.equal(item.total_inscritas, 1);
    assert.equal(item.vagas_restantes, 2);
    assert.equal(item.inscrita, true);
    assert.equal(item.presenca, false);
  });

  it('filtra apenas oficinas futuras', async () => {
    const passada = await criarOficina({ diasAPartirDeHoje: -3 });
    const r = await chamar('GET', '/oficinas?futuras=true');
    assert.ok(!r.corpo.oficinas.some((o) => o.id === passada.id));
  });

  it('não deixa inscrever duas vezes nem passar do limite de vagas', async () => {
    const oficina = await criarOficina({ vagas: 1 });
    const a = await criarMenina();
    const b = await criarMenina();

    let r = await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: a.id });
    assert.equal(r.status, 201);
    r = await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: a.id });
    assert.equal(r.status, 409);
    r = await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: b.id });
    assert.equal(r.status, 409);
    assert.match(r.corpo.erro, /vagas/);
  });

  it('inscrições simultâneas não estouram as vagas', async () => {
    const oficina = await criarOficina({ vagas: 2 });
    const meninas = await Promise.all([1, 2, 3, 4, 5].map(() => criarMenina()));

    const respostas = await Promise.all(
      meninas.map((m) =>
        chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: m.id })
      )
    );
    assert.equal(respostas.filter((r) => r.status === 201).length, 2);

    const inscritas = await chamar('GET', `/oficinas/${oficina.id}/inscricoes`);
    assert.equal(inscritas.corpo.inscricoes.length, 2);
  });

  it('não deixa inscrever em oficina passada ou inexistente', async () => {
    const menina = await criarMenina();
    const passada = await criarOficina({ diasAPartirDeHoje: -1 });

    let r = await chamar('POST', '/oficinas/inscricao', { oficina_id: passada.id, menina_id: menina.id });
    assert.equal(r.status, 400);
    r = await chamar('POST', '/oficinas/inscricao', { oficina_id: 999999, menina_id: menina.id });
    assert.equal(r.status, 404);
    const futura = await criarOficina();
    r = await chamar('POST', '/oficinas/inscricao', { oficina_id: futura.id, menina_id: 999999 });
    assert.equal(r.status, 404);
  });

  it('cancela inscrição sem presença, mas não com presença', async () => {
    const menina = await criarMenina();
    const oficina = await criarOficina();
    await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: menina.id });

    let r = await chamar('DELETE', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: menina.id });
    assert.equal(r.status, 200);

    await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: menina.id });
    await marcarPresenca(oficina, menina);
    r = await chamar('DELETE', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: menina.id });
    assert.equal(r.status, 404);
  });

  it('edita, impede reduzir vagas abaixo das inscritas e exclui', async () => {
    const oficina = await criarOficina({ vagas: 5 });
    const a = await criarMenina();
    const b = await criarMenina();
    for (const m of [a, b]) {
      await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: m.id });
    }

    const base = { titulo: 'Novo título', data: oficina.data, categoria: 'ia' };
    let r = await chamar('PUT', `/oficinas/${oficina.id}`, { ...base, vagas: 1 });
    assert.equal(r.status, 400);

    r = await chamar('PUT', `/oficinas/${oficina.id}`, { ...base, vagas: 2 });
    assert.equal(r.status, 200);
    assert.equal(r.corpo.oficina.titulo, 'Novo título');
    assert.equal(r.corpo.oficina.categoria, 'ia');

    r = await chamar('DELETE', `/oficinas/${oficina.id}`);
    assert.equal(r.status, 200);
    r = await chamar('GET', `/oficinas/${oficina.id}`);
    assert.equal(r.status, 404);
  });

  it('qualquer mentora ativa registra presença, mesmo sem ser a responsável', async () => {
    const responsavel = await criarMentora();
    const outra = await criarMentora({ nome: 'Outra Mentora' });
    const oficina = await criarOficina({ diasAPartirDeHoje: -1, instrutora_id: responsavel.id });
    const menina = await criarMenina();
    // Oficina passada: inscrição direto no banco (a API não inscreve no passado).
    await pool.query('INSERT INTO inscricoes (oficina_id, menina_id) VALUES ($1, $2)', [
      oficina.id,
      menina.id,
    ]);

    const r = await marcarPresenca(oficina, menina, { registradoPor: outra.id });
    assert.equal(r.status, 200);
    assert.equal(r.corpo.alterado, true);

    // Auditoria: a lista de inscritas mostra quem registrou.
    const lista = await chamar('GET', `/oficinas/${oficina.id}/inscricoes`);
    const inscrita = lista.corpo.inscricoes[0];
    assert.equal(inscrita.presenca, true);
    assert.equal(inscrita.registrado_por, outra.id);
    assert.equal(inscrita.registrado_por_nome, 'Outra Mentora');
    assert.ok(inscrita.registrado_em);

    // Desmarcar também fica registrado, com o autor da última alteração.
    await marcarPresenca(oficina, menina, { presenca: false, registradoPor: idCoordenacao() });
    const depois = await chamar('GET', `/oficinas/${oficina.id}/inscricoes`);
    assert.equal(depois.corpo.inscricoes[0].registrado_por, idCoordenacao());
  });

  it('presença exige registrador e recusa aluna ou mentora inativa', async () => {
    const oficina = await criarOficina();
    const menina = await criarMenina();
    await chamar('POST', '/oficinas/inscricao', { oficina_id: oficina.id, menina_id: menina.id });

    // Sem registrado_por
    let r = await chamar('PATCH', '/oficinas/presenca', {
      oficina_id: oficina.id,
      menina_id: menina.id,
    });
    assert.equal(r.status, 400);

    // A própria aluna não pode marcar presença
    r = await marcarPresenca(oficina, menina, { registradoPor: menina.id });
    assert.equal(r.status, 403);

    // Mentora inativa também não
    const inativa = await criarMentora();
    await chamar('PATCH', `/mentoras/${inativa.id}/status`);
    r = await marcarPresenca(oficina, menina, { registradoPor: inativa.id });
    assert.equal(r.status, 403);

    // Inexistente e inválido
    r = await marcarPresenca(oficina, menina, { registradoPor: 999999 });
    assert.equal(r.status, 403);
    r = await marcarPresenca(oficina, menina, { registradoPor: 'abc' });
    assert.equal(r.status, 400);

    // Nada disso alterou a presença
    const lista = await chamar('GET', `/oficinas/${oficina.id}/inscricoes`);
    assert.equal(lista.corpo.inscricoes[0].presenca, false);
  });
});
