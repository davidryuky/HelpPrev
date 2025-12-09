import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Tabela Chave-Valor para configurações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // GET: Buscar configurações
    if (req.method === 'GET') {
      const [rows]: any = await pool.query('SELECT setting_value FROM site_settings WHERE setting_key = ?', ['head_scripts']);
      
      let value = '';
      if (Array.isArray(rows) && rows.length > 0) {
        // Garante que seja string, caso o banco retorne null
        value = rows[0].setting_value || '';
      }
      
      return res.status(200).json({ head_scripts: value });
    }

    // POST: Salvar configurações (Requer Auth)
    if (req.method === 'POST') {
      // Verificação simples de token (mesma do Admin)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { head_scripts } = req.body;

      // Upsert (Insert ou Update)
      await pool.execute(
        `INSERT INTO site_settings (setting_key, setting_value) VALUES ('head_scripts', ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [head_scripts || '', head_scripts || '']
      );

      return res.status(200).json({ message: 'Configurações salvas com sucesso' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Erro settings:', error);
    // Retorna JSON válido de erro
    return res.status(500).json({ error: 'Erro interno', details: error.message });
  }
}