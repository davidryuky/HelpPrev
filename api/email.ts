import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificação de Autenticação (Basic)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const { to, subject, body, leadName } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando (to, subject, body)' });
  }

  // Verificação de Variáveis de Ambiente
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Configurações de SMTP ausentes');
    return res.status(500).json({ 
      error: 'Servidor de email não configurado.',
      details: 'Configure SMTP_HOST, SMTP_USER, SMTP_PASS e SMTP_PORT nas variáveis de ambiente.'
    });
  }

  try {
    // Configuração do Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: parseInt(process.env.SMTP_PORT || '587') === 465, // true para 465, false para outras
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Envio do Email
    await transporter.sendMail({
      from: `"MeuPrev Plataforma" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      text: body, // Versão texto puro
      html: body.replace(/\n/g, '<br>') // Conversão simples para HTML
    });

    return res.status(200).json({ message: 'Email enviado com sucesso!' });

  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ 
      error: 'Falha ao enviar email', 
      details: error.message 
    });
  }
}