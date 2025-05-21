require('dotenv').config();
const express = require('express');
const cors = require('cors');  // <== importe cors
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS - liberando só seu domínio frontend (altere conforme seu domínio)
app.use(cors({
  origin: 'https://aplicativo-ginseng.vercel.app',
}));

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota para listar todos os arquivos JSON do bucket
app.get('/files', async (req, res) => {
  try {
    const { data, error } = await supabase
      .storage
      .from('draft')
      .list();

    if (error) throw error;

    const jsonFiles = data.filter(file => file.name.endsWith('.json'));
    res.json(jsonFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter um arquivo JSON específico pelo código da loja
app.get('/files/:storeCode', async (req, res) => {
  try {
    const { storeCode } = req.params;
    const fileName = `${storeCode}.json`;

    const { data, error } = await supabase
      .storage
      .from('draft')
      .download(fileName);

    if (error) throw error;

    const jsonContent = await data.text();
    res.json(JSON.parse(jsonContent));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
