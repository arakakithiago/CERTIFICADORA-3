const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { iniciar, encerrar, chamar, criarMentora, urlApi } = require('./helpers');

describe('Cadastro e login', () => {
  before(iniciar);
  after(encerrar);

  it('cadastra uma menina e permite login com o mesmo e-mail', async () => {
    const r = await chamar('POST', '/registro', {
      nome: 'Ana',
      email: 'Ana@Teste.com',
      senha: '123456',
    });
    assert.equal(r.status, 201);
    assert.equal(r.corpo.usuario.tipo, 'menina');
    assert.equal(r.corpo.usuario.email, 'ana@teste.com', 'e-mail é salvo em minúsculas');

    const login = await chamar('POST', '/login', { email: 'ANA@teste.com', senha: '123456' });
    assert.equal(login.status, 200);
    assert.equal(login.corpo.usuario.nome, 'Ana');
    assert.equal(login.corpo.usuario.senha_hash, undefined, 'nunca devolve o hash da senha');
  });

  it('o cadastro público sempre cria menina, mesmo pedindo outro tipo', async () => {
    const r = await chamar('POST', '/registro', {
      nome: 'Espertinha',
      email: 'espertinha@teste.com',
      senha: '123456',
      tipo: 'coordenacao',
    });
    assert.equal(r.status, 201);
    assert.equal(r.corpo.usuario.tipo, 'menina');
  });

  it('recusa campos vazios, senha curta e e-mail repetido', async () => {
    let r = await chamar('POST', '/registro', { nome: '', email: 'x@teste.com', senha: '123456' });
    assert.equal(r.status, 400);

    r = await chamar('POST', '/registro', { nome: 'X', email: 'x@teste.com', senha: '123' });
    assert.equal(r.status, 400);

    r = await chamar('POST', '/registro', { nome: 'Ana 2', email: 'ana@teste.com', senha: '123456' });
    assert.equal(r.status, 409);
  });

  it('recusa senha errada e e-mail inexistente com a mesma mensagem', async () => {
    const errada = await chamar('POST', '/login', { email: 'ana@teste.com', senha: 'errada' });
    const inexistente = await chamar('POST', '/login', { email: 'nada@teste.com', senha: '123456' });
    assert.equal(errada.status, 401);
    assert.equal(inexistente.status, 401);
    assert.equal(errada.corpo.erro, inexistente.corpo.erro);
  });

  it('bloqueia o login de conta inativa', async () => {
    const mentora = await criarMentora({ email: 'inativa@teste.com' });
    await chamar('PATCH', `/mentoras/${mentora.id}/status`);

    const r = await chamar('POST', '/login', { email: 'inativa@teste.com', senha: '123456' });
    assert.equal(r.status, 403);
  });

  it('valida a sessão: dados atualizados, conta inativa e conta inexistente', async () => {
    const mentora = await criarMentora({ email: 'sessao@teste.com' });

    let r = await chamar('GET', `/sessao/${mentora.id}`);
    assert.equal(r.status, 200);
    assert.equal(r.corpo.usuario.email, 'sessao@teste.com');
    assert.equal(r.corpo.usuario.ativo, undefined);

    // Nome editado pela coordenação aparece na sessão.
    await chamar('PUT', `/mentoras/${mentora.id}`, { nome: 'Nome Novo', email: 'sessao@teste.com' });
    r = await chamar('GET', `/sessao/${mentora.id}`);
    assert.equal(r.corpo.usuario.nome, 'Nome Novo');

    await chamar('PATCH', `/mentoras/${mentora.id}/status`);
    r = await chamar('GET', `/sessao/${mentora.id}`);
    assert.equal(r.status, 403);

    r = await chamar('GET', '/sessao/999999');
    assert.equal(r.status, 404);
    r = await chamar('GET', '/sessao/abc');
    assert.equal(r.status, 404);
  });

  it('coordenação redefine a senha da mentora', async () => {
    const mentora = await criarMentora({ email: 'senha@teste.com' });

    let r = await chamar('PATCH', `/mentoras/${mentora.id}/senha`, { senha: '123' });
    assert.equal(r.status, 400);
    r = await chamar('PATCH', '/mentoras/999999/senha', { senha: 'nova123' });
    assert.equal(r.status, 404);

    r = await chamar('PATCH', `/mentoras/${mentora.id}/senha`, { senha: 'nova123' });
    assert.equal(r.status, 200);

    const antiga = await chamar('POST', '/login', { email: 'senha@teste.com', senha: '123456' });
    assert.equal(antiga.status, 401);
    const nova = await chamar('POST', '/login', { email: 'senha@teste.com', senha: 'nova123' });
    assert.equal(nova.status, 200);
  });

  it('não redefine a senha de quem não é mentora', async () => {
    const r = await chamar('POST', '/registro', {
      nome: 'Aluna',
      email: 'aluna-senha@teste.com',
      senha: '123456',
    });
    const resposta = await chamar('PATCH', `/mentoras/${r.corpo.usuario.id}/senha`, {
      senha: 'hackeada',
    });
    assert.equal(resposta.status, 404);
  });

  it('responde JSON para rota inexistente e corpo malformado', async () => {
    const rota = await chamar('GET', '/nao-existe');
    assert.equal(rota.status, 404);
    assert.ok(rota.corpo.erro);

    const malformado = await fetch(`${urlApi()}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email": ',
    });
    assert.equal(malformado.status, 400);
    assert.match((await malformado.json()).erro, /JSON inválido/);
  });
});
