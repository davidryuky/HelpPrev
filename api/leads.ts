import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

// Configuração da conexão MySQL
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
  try {
    // 1. Garantir que a tabela leads existe (MySQL Syntax)
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

    // 2. Método POST (Público - Salvar Lead)
    if (req.method === 'POST') {
      const { name, whatsapp, type } = req.body;
      
      if (!name || !whatsapp || !type) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      await pool.execute(
        'INSERT INTO leads (name, whatsapp, type) VALUES (?, ?, ?)',
        [name, whatsapp, type]
      );
      
      return res.status(201).json({ message: 'Contato salvo com sucesso!' });
    } 

    // VERIFICAÇÃO DE SEGURANÇA
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    // 3. Método GET (Privado - Listar Leads)
    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
      return res.status(200).json(rows);
    } 
    
    // 4. Método PUT (Privado - Atualizar Lead)
    else if (req.method === 'PUT') {
      const { id, status, notes } = req.body;
      
      if (status) {
        await pool.execute('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
      }
      if (notes !== undefined) {
        await pool.execute('UPDATE leads SET notes = ? WHERE id = ?', [notes, id]);
      }

      return res.status(200).json({ message: 'Atualizado com sucesso' });
    }

    // 5. Método DELETE (Privado - Apagar Lead)
    else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' });
      }

      await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
      return res.status(200).json({ message: 'Lead removido com sucesso' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor', 
      details: error.message 
    });
  }
}