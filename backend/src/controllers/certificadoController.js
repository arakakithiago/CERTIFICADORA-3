const PDFDocument = require('pdfkit');
const pool = require('../config/db');

// Gera o certificado em PDF de uma oficina em que a menina teve presença
// confirmada. Os nomes vêm do banco, e não do que foi digitado.
async function gerarCertificado(req, res) {
  const { menina_id, oficina_id } = req.body;

  if (!menina_id || !oficina_id) {
    return res.status(400).json({ erro: 'Informe a menina e a oficina.' });
  }

  let dados;
  try {
    const resultado = await pool.query(
      `SELECT u.nome AS nome_menina, o.titulo AS nome_atividade, o.data
       FROM inscricoes i
       JOIN usuario u ON u.id = i.menina_id
       JOIN oficinas o ON o.id = i.oficina_id
       WHERE i.menina_id = $1 AND i.oficina_id = $2 AND i.presenca`,
      [menina_id, oficina_id]
    );
    if (resultado.rows.length === 0) {
      return res.status(403).json({
        erro: 'Certificado disponível apenas para atividades com presença confirmada.',
      });
    }
    dados = resultado.rows[0];
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao buscar dados do certificado.' });
  }

  try {
    const { nome_menina, nome_atividade } = dados;
    const dataAtividade = new Date(dados.data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo',
    });

    // Documento em formato paisagem.
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

    const nomeArquivo = nome_menina
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificado-${nomeArquivo}.pdf`);

    doc.pipe(res);

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke(); // Borda
    doc.moveDown(3);
    doc.fontSize(40).text('Certificado de Participação', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(20).text(`Certificamos que ${nome_menina}`, { align: 'center' });
    doc.moveDown();
    doc.text(`concluiu com sucesso a atividade:`, { align: 'center' });
    doc.fontSize(25).text(`"${nome_atividade}"`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`realizada em ${dataAtividade}.`, { align: 'center' });
    doc.moveDown(3);
    doc.fontSize(15).text('Projeto Meninas Digitais UTFPR-CP', { align: 'center' });

    doc.end();
  } catch (erro) {
    console.error(erro);
    if (!res.headersSent) {
      res.status(500).json({ erro: 'Erro ao gerar o certificado em PDF.' });
    }
  }
}

module.exports = { gerarCertificado };
