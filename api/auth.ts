import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import { Buffer } from 'buffer';

// Configuração de conexão MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '3306'), // Porta padrão MySQL
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões remotas seguras
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Setup do Banco de Dados
    // Sintaxe MySQL para criar tabela se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `);
    
    // Cria a tabela leads também para garantir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pendente',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. FORÇA A CRIAÇÃO OU ATUALIZAÇÃO DO USUÁRIO ADMIN
    const targetUser = 'MAY';
    const targetPass = 'MAY@@umi';

    // Verifica se existe (Sintaxe MySQL usa ? para placeholders)
    const [rows]: any = await pool.execute('SELECT * FROM users WHERE username = ?', [targetUser]);

    if (Array.isArray(rows) && rows.length === 0) {
      // Cria
      await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [targetUser, targetPass]);
      console.log('Admin user created');
    } else {
      // Atualiza senha
      await pool.execute('UPDATE users SET password = ? WHERE username = ?', [targetPass, targetUser]);
      console.log('Admin password updated');
    }

    // 3. Validação do Login
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e Password são obrigatórios' });
    }

    const [loginRows]: any = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (Array.isArray(loginRows) && loginRows.length > 0) {
      // Login Sucesso
      const user = loginRows[0];
      const token = Buffer.from(`${user.username}:${user.password}`).toString('base64');
      return res.status(200).json({ 
        token: token,
        user: { username: user.username },
        message: "Login realizado com sucesso"
      });
    } else {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

  } catch (error: any) {
    console.error('Erro CRÍTICO no servidor:', error);
    return res.status(500).json({ 
      error: 'Erro de conexão com Banco de Dados', 
      details: error.message
    });
  }
}