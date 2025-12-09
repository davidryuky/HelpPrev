import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

// Configuração da conexão MySQL (Mesma do leads.ts)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Garantir tabela de visitas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // POST: Registrar nova visita
    if (req.method === 'POST') {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';

      await pool.execute(
        'INSERT INTO site_visits (ip, user_agent) VALUES (?, ?)',
        [ip, userAgent]
      );
      
      return res.status(201).json({ message: 'Visita registrada' });
    }

    // GET: Contar visitas
    if (req.method === 'GET') {
      const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM site_visits');
      const count = rows[0]?.count || 0;
      return res.status(200).json({ count });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error: any) {
    console.error('Erro visitas:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}