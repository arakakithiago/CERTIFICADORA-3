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

// Presença, encontros, pontos, emblemas, trilha e certificados.
describe('Jornada da menina', () => {
  before(iniciar);
  after(encerrar);

  let mentora;
  let menina;

  before(async () => {
    mentora = await criarMentora();
    menina = await criarMenina(); // pareada com a única mentora
  });

  it('trilha inicial: só o cadastro concluído, mentora atribuída', async () => {
    const r = await chamar('GET', `/meninas/${menina.id}/trilha`);
    assert.equal(r.status, 200);
    assert.equal(r.corpo.mentora.id, mentora.id);
    assert.equal(r.corpo.percentual, 20);
    assert.equal(r.corpo.badges, 0);
    assert.equal(r.corpo.proximaAtividade, null);
    const status = Object.fromEntries(r.corpo.etapas.map((e) => [e.chave, e.status]));
    assert.deepEqual(status, {
      cadastro: 'concluido',
      primeira_oficina: 'em_breve',
      ia: 'em_breve',
      mentoria: 'em_andamento', // já tem mentora
      projeto: 'em_breve',
    });
  });

  it('inscrição em oficina futura aparece como próxima atividade', async () => {
    const futura = await criarOficina({ diasAPartirDeHoje: 5, categoria: 'design' });
    await chamar('POST', '/oficinas/inscricao', { oficina_id: futura.id, menina_id: menina.id });

    const r = await chamar('GET', `/meninas/${menina.id}/trilha`);
    assert.equal(r.corpo.proximaAtividade.id, futura.id);
    assert.equal(r.corpo.etapas.find((e) => e.chave === 'primeira_oficina').status, 'em_andamento');
  });

  it('presença dá 50 pontos e o emblema Primeiros Passos, uma única vez', async () => {
    const oficina = await criarOficina({ diasAPartirDeHoje: -2 });
    const r = await concluirOficina(oficina, menina);
    assert.equal(r.status, 200);
    assert.equal(r.corpo.pontosAtuais, 50);
    assert.deepEqual(r.corpo.novasConquistas, ['Primeiros Passos']);

    const repetida = await marcarPresenca(oficina, menina);
    assert.equal(repetida.corpo.alterado, false);

    // Desmarcar devolve os pontos; marcar de novo não duplica o emblema.
    const desmarcada = await marcarPresenca(oficina, menina, { presenca: false });
    assert.equal(desmarcada.corpo.pontosAtuais, 0);
    const remarcada = await marcarPresenca(oficina, menina);
    assert.equal(remarcada.corpo.pontosAtuais, 50);
    assert.deepEqual(remarcada.corpo.novasConquistas, []);
  });

  it('presença exige inscrição', async () => {
    const oficina = await criarOficina({ diasAPartirDeHoje: -1 });
    const r = await marcarPresenca(oficina, menina);
    assert.equal(r.status, 404);
  });

  it('oficina de IA libera Future AI; 3 de tecnologia liberam Tech Explorer', async () => {
    const ia = await criarOficina({ diasAPartirDeHoje: -1, categoria: 'ia' });
    let r = await concluirOficina(ia, menina);
    assert.deepEqual(r.corpo.novasConquistas, ['Future AI']);

    // Já tem 1 de tecnologia; faltam 2.
    for (let i = 0; i < 2; i++) {
      r = await concluirOficina(await criarOficina({ diasAPartirDeHoje: -1 }), menina);
    }
    assert.deepEqual(r.corpo.novasConquistas, ['Tech Explorer']);
  });

  it('encontro de mentoria exige vínculo e dados válidos', async () => {
    const outraMentora = await criarMentora();
    const base = { menina_id: menina.id, data: '2026-01-15', resumo: 'Conversamos' };

    let r = await chamar('POST', '/mentorias/encontros', { ...base, mentora_id: outraMentora.id });
    assert.equal(r.status, 403);
    r = await chamar('POST', '/mentorias/encontros', { ...base, mentora_id: mentora.id, resumo: '  ' });
    assert.equal(r.status, 400);
    r = await chamar('POST', '/mentorias/encontros', {
      ...base,
      mentora_id: mentora.id,
      avaliacao_progresso: 6,
    });
    assert.equal(r.status, 400);
  });

  it('encontro dá 30 pontos e o emblema Mentoria em Ação', async () => {
    const r = await chamar('POST', '/mentorias/encontros', {
      mentora_id: mentora.id,
      menina_id: menina.id,
      data: '2026-01-15',
      resumo: 'Primeiro encontro',
      avaliacao_progresso: 4,
    });
    assert.equal(r.status, 201);
    assert.equal(r.corpo.pontosAtuais, 50 * 4 + 30);
    assert.deepEqual(r.corpo.novasConquistas, ['Mentoria em Ação']);

    const lista = await chamar('GET', `/mentorias/encontros?menina_id=${menina.id}`);
    assert.equal(lista.corpo.encontros.length, 1);
    assert.equal(lista.corpo.encontros[0].mentora_nome, mentora.nome);

    const semFiltro = await chamar('GET', '/mentorias/encontros');
    assert.equal(semFiltro.status, 400);
  });

  it('5ª atividade libera Criadora e, com todos os outros, Menina Digital', async () => {
    const r = await concluirOficina(await criarOficina({ diasAPartirDeHoje: -1 }), menina);
    assert.deepEqual(r.corpo.novasConquistas, ['Criadora', 'Menina Digital']);

    const conquistas = await chamar('GET', `/meninas/${menina.id}/conquistas`);
    assert.equal(conquistas.corpo.conquistas.length, 6);
    assert.ok(conquistas.corpo.conquistas.every((c) => c.conquistado));
  });

  it('trilha completa: 100% e todas as etapas concluídas', async () => {
    const r = await chamar('GET', `/meninas/${menina.id}/trilha`);
    assert.equal(r.corpo.percentual, 100);
    assert.ok(r.corpo.etapas.every((e) => e.status === 'concluido'));
    assert.equal(r.corpo.atividadesConcluidas, 5);
    assert.equal(r.corpo.certificados, 5);
    assert.equal(r.corpo.badges, 6);
  });

  it('pontuação manual soma pontos e nunca fica negativa', async () => {
    let r = await chamar('POST', '/trilha/pontuar', { menina_id: menina.id, pontos: 20 });
    assert.equal(r.status, 200);
    assert.equal(r.corpo.pontosAtuais, 50 * 5 + 30 + 20);

    r = await chamar('POST', '/trilha/pontuar', { menina_id: menina.id, pontos: -10000 });
    assert.equal(r.corpo.pontosAtuais, 0);

    r = await chamar('POST', '/trilha/pontuar', { menina_id: 999999, pontos: 5 });
    assert.equal(r.status, 404);
    r = await chamar('POST', '/trilha/pontuar', { menina_id: menina.id, pontos: 'muitos' });
    assert.equal(r.status, 400);
  });

  it('recomenda oficinas futuras com vaga, priorizando categorias novas', async () => {
    const nova = await criarMenina();
    const tecnologia = await criarOficina({ diasAPartirDeHoje: 2, categoria: 'tecnologia' });
    const ia = await criarOficina({ diasAPartirDeHoje: 3, categoria: 'ia' });
    const lotada = await criarOficina({ diasAPartirDeHoje: 1, categoria: 'outros', vagas: 1 });
    await chamar('POST', '/oficinas/inscricao', { oficina_id: lotada.id, menina_id: menina.id });
    await concluirOficina(await criarOficina({ diasAPartirDeHoje: -1, categoria: 'tecnologia' }), nova);

    const r = await chamar('GET', `/meninas/${nova.id}/recomendacoes?limite=20`);
    const ids = r.corpo.recomendacoes.map((o) => o.id);
    assert.ok(!ids.includes(lotada.id), 'não recomenda oficina lotada');
    assert.ok(ids.indexOf(ia.id) < ids.indexOf(tecnologia.id), 'IA (categoria nova) vem antes');
  });

  it('certificado só sai para atividade com presença', async () => {
    const concluidas = await chamar('GET', `/meninas/${menina.id}/atividades-concluidas`);
    assert.equal(concluidas.corpo.atividades.length, 5);

    const pdf = await chamar('POST', '/certificados/gerar', {
      menina_id: menina.id,
      oficina_id: concluidas.corpo.atividades[0].id,
    });
    assert.equal(pdf.status, 200);
    assert.equal(pdf.corpo.tipo, 'application/pdf');
    assert.ok(pdf.corpo.bytes > 1000);

    const futura = await criarOficina();
    await chamar('POST', '/oficinas/inscricao', { oficina_id: futura.id, menina_id: menina.id });
    const negado = await chamar('POST', '/certificados/gerar', {
      menina_id: menina.id,
      oficina_id: futura.id,
    });
    assert.equal(negado.status, 403);
  });
});
