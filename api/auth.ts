import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import { Buffer } from 'buffer';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await pool.connect();

  try {
    // 1. Cria tabela de usuários se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    // 2. Verifica se o usuário padrão existe, se não, cria
    // Usuário solicitado: MAY / Senha: MAY@@umi
    const checkUser = await client.query('SELECT * FROM users WHERE username = $1', ['MAY']);
    if (checkUser.rowCount === 0) {
      await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['MAY', 'MAY@@umi']);
      console.log('Usuário padrão criado com sucesso.');
    }

    // 3. Processa o Login
    const { username, password } = req.body;

    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rowCount && result.rowCount > 0) {
      // Login Sucesso
      // Em produção real usaríamos JWT, aqui retornamos um token simples para a sessão
      return res.status(200).json({ 
        token: Buffer.from(`${username}:${password}`).toString('base64'),
        user: { username: result.rows[0].username }
      });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

  } catch (error: any) {
    console.error('Erro de autenticação:', error);
    return res.status(500).json({ error: 'Erro no servidor de autenticação' });
  } finally {
    client.release();
  }
}