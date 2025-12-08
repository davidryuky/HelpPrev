import { VercelRequest, VercelResponse } from '@vercel/node';
import pg from 'pg';

const { Pool } = pg;

// Configuração da conexão usando as variáveis específicas da Vercel
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let client;
  
  try {
    client = await pool.connect();

    // 1. Garantir que a tabela leads existe (Redundância de segurança)
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

    // 2. Método POST (Público - Salvar Lead)
    if (req.method === 'POST') {
      const { name, whatsapp, type } = req.body;
      
      if (!name || !whatsapp || !type) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      await client.query(
        'INSERT INTO leads (name, whatsapp, type) VALUES ($1, $2, $3)',
        [name, whatsapp, type]
      );
      
      return res.status(201).json({ message: 'Contato salvo com sucesso!' });
    } 

    // VERIFICAÇÃO DE SEGURANÇA PARA MÉTODOS ADMINISTRATIVOS
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    // 3. Método GET (Privado - Listar Leads)
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM leads ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    } 
    
    // 4. Método PUT (Privado - Atualizar Lead)
    else if (req.method === 'PUT') {
      const { id, status, notes } = req.body;
      
      if (status) {
        await client.query('UPDATE leads SET status = $1 WHERE id = $2', [status, id]);
      }
      if (notes !== undefined) {
        await client.query('UPDATE leads SET notes = $1 WHERE id = $2', [notes, id]);
      }

      return res.status(200).json({ message: 'Atualizado com sucesso' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor', 
      details: error.message 
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}