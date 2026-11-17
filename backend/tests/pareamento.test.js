const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { iniciar, encerrar, chamar, criarMentora, criarMenina, mentoraDe } = require('./helpers');

describe('Mentoras e pareamento por carga', () => {
  before(iniciar);
  after(encerrar);

  let m1;
  let m2;

  it('menina cadastrada sem nenhuma mentora ativa fica sem mentora', async () => {
    const menina = await criarMenina();
    assert.equal(await mentoraDe(menina.id), null);
  });

  it('cadastrar a primeira mentora pareia as meninas pendentes', async () => {
    const r = await chamar('POST', '/mentoras', {
      nome: 'Mentora 1',
      email: 'm1@teste.com',
      senha: '123456',
    });
    assert.equal(r.status, 201);
    assert.equal(r.corpo.pareadas, 1);
    m1 = r.corpo.usuario;
  });

  it('nova menina vai para a mentora com menos mentorandas', async () => {
    m2 = await criarMentora(); // m1 tem 1 mentoranda, m2 tem 0
    const menina = await criarMenina();
    assert.equal(await mentoraDe(menina.id), m2.id);

    // Empate (1 x 1): vence a mentora cadastrada há mais tempo (m1).
    const outra = await criarMenina();
    assert.equal(await mentoraDe(outra.id), m1.id);
  });

  it('lista mentoras com o total de mentorandas', async () => {
    const r = await chamar('GET', '/mentoras');
    assert.equal(r.status, 200);
    const porId = Object.fromEntries(r.corpo.mentoras.map((m) => [m.id, m.total_mentorandas]));
    assert.equal(porId[m1.id], 2);
    assert.equal(porId[m2.id], 1);
  });

  it('desativar mentora redistribui as mentorandas para as ativas', async () => {
    const r = await chamar('PATCH', `/mentoras/${m1.id}/status`);
    assert.equal(r.status, 200);
    assert.equal(r.corpo.usuario.ativo, false);
    assert.equal(r.corpo.pareadas, 2);

    const lista = await chamar('GET', `/mentoras/${m2.id}/mentorandas`);
    assert.equal(lista.corpo.mentorandas.length, 3);
  });

  it('nova menina nunca vai para mentora inativa', async () => {
    const menina = await criarMenina();
    assert.equal(await mentoraDe(menina.id), m2.id);
  });

  it('edita nome e e-mail e recusa e-mail repetido', async () => {
    let r = await chamar('PUT', `/mentoras/${m2.id}`, { nome: 'Nova', email: 'nova@teste.com' });
    assert.equal(r.status, 200);
    assert.equal(r.corpo.usuario.nome, 'Nova');

    r = await chamar('PUT', `/mentoras/${m2.id}`, { nome: 'Nova', email: 'm1@teste.com' });
    assert.equal(r.status, 409);

    r = await chamar('PUT', '/mentoras/999999', { nome: 'X', email: 'x@teste.com' });
    assert.equal(r.status, 404);
  });

  it('pareamento manual informa quantas continuam sem mentora', async () => {
    await chamar('PATCH', `/mentoras/${m2.id}/status`); // nenhuma ativa agora
    const menina = await criarMenina();
    assert.equal(await mentoraDe(menina.id), null);

    const r = await chamar('POST', '/pareamento/executar');
    assert.equal(r.status, 200);
    assert.equal(r.corpo.pareadas, 0);
    assert.ok(r.corpo.semMentora >= 1);
  });
});
