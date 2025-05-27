require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors());

// Configuração do SQL Server
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};

// Função para conectar ao SQL Server
async function connectToDatabase() {
  try {
    await sql.connect(sqlConfig);
    console.log('Conectado ao SQL Server com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao SQL Server:', err);
  }
}

// Conectar ao banco de dados ao iniciar
connectToDatabase();

// Rota para buscar todos os tokens
app.get('/tokens', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM tokens`;
    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar tokens:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar um token específico por ID
app.get('/tokens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query`
      SELECT * FROM tokens 
      WHERE id = ${id}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Token não encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Erro ao buscar token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todas as lojas únicas da tabela draft
app.get('/draft', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT DISTINCT loja_id 
      FROM draft 
      ORDER BY loja_id
    `;
    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar dados de uma loja específica
app.get('/draft/:loja_id', async (req, res) => {
  try {
    const { loja_id } = req.params;
    const result = await sql.query`
      SELECT 
        loja_id,
        code,
        description,
        launch,
        deactivation,
        thirdtolastcyclesales,
        secondtolastcyclesales,
        lastcyclesales,
        currentcyclesales,
        nextcycleprojection,
        secondtonextcycleprojection,
        stock_actual,
        stock_intransit,
        purchasesuggestion,
        smartpurchase_purchasesuggestioncycle,
        smartpurchase_nextcyclepurchasesuggestion,
        pendingorder,
        salescurve,
        promotions_description,
        promotions_discountpercent,
        pricesellin,
        businessunit,
        codcategory,
        criticalitem_dtprovidedregularization,
        criticalitem_blockedwallet,
        criticalitem_iscritical,
        codsubcategory,
        isproductdeactivated,
        brandgroupcode,
        dayswithoutsales,
        coveragedays,
        hascoverage,
        TRIAL949
      FROM draft 
      WHERE loja_id = ${loja_id}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar dados da loja:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
