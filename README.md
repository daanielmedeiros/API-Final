# API de Acesso ao Bucket Supabase

Esta API permite acessar arquivos JSON armazenados no bucket "draft" do Supabase.

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
```

## Executando a API

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Endpoints

### Listar todos os arquivos JSON
```
GET /files
```

### Obter arquivo JSON específico
```
GET /files/:storeCode
```
Exemplo: `/files/12522` retornará o conteúdo do arquivo `12522.json`

## Respostas

- Sucesso: Retorna os dados em formato JSON
- Erro: Retorna um objeto com a mensagem de erro 