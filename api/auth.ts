import { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';
import { Buffer } from 'buffer';

const { Pool } = pg;

// Configuração de conexão
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false, // Necessário para maioria dos bancos externos (Render, Neon, Hostinger, Supabase)
  },
  connectionTimeoutMillis: 5000, // Timeout de 5s para não ficar pendurado
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir CORS básico se necessário (opcional, vercel.json lida com rewrites geralmente)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    // Tenta conectar
    client = await pool.connect();
    
    // 1. Setup do Banco de Dados (Garante que as tabelas existam)
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );
      `);
      
      // Cria a tabela leads aqui também para garantir, caso api/leads.ts não tenha sido chamado
      await client.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          type TEXT NOT NULL,
          status TEXT DEFAULT 'pendente',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (dbSetupError: any) {
      console.error('Erro ao criar tabelas:', dbSetupError);
      // Não retorna erro aqui, tenta prosseguir, talvez a tabela já exista
    }

    // 2. FORÇA A CRIAÇÃO OU ATUALIZAÇÃO DO USUÁRIO ADMIN
    // Usuário: MAY / Senha: MAY@@umi
    const targetUser = 'MAY';
    const targetPass = 'MAY@@umi';

    // Verifica se existe
    const userCheck = await client.query('SELECT * FROM users WHERE username = $1', [targetUser]);

    if (userCheck.rowCount === 0) {
      // Cria
      await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [targetUser, targetPass]);
      console.log('Admin user created');
    } else {
      // Atualiza senha (garante que a senha seja a correta mesmo se foi criada errada antes)
      await client.query('UPDATE users SET password = $1 WHERE username = $2', [targetPass, targetUser]);
      console.log('Admin password updated');
    }

    // 3. Validação do Login
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e Password são obrigatórios' });
    }

    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rowCount && result.rowCount > 0) {
      // Login Sucesso
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      return res.status(200).json({ 
        token: token,
        user: { username: result.rows[0].username },
        message: "Login realizado com sucesso"
      });
    } else {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

  } catch (error: any) {
    console.error('Erro CRÍTICO no servidor:', error);
    
    // Retorna detalhes do erro para ajudar no debug (Remova isso em produção final se desejar esconder dados sensíveis)
    return res.status(500).json({ 
      error: 'Erro de conexão com Banco de Dados', 
      details: error.message,
      hint: 'Verifique se as variáveis de ambiente DB_HOST, DB_USER, etc. estão corretas na Vercel.'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}