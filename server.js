const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const accountSid = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; 
const authToken = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const client = twilio(accountSid, authToken);

app.use(cors()); 
app.use(bodyParser.json());

app.post('/api/enviar-whatsapp', async (req, res) => {
  try {
    console.log('Recebendo dados:', req.body); 
    const { nome, email, numero, cidade, descricao } = req.body;
    if (!nome || !email || !numero || !cidade || !descricao) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }

    const message = await client.messages.create({
      body: `Novo formulário recebido:\nNome: ${nome}\nEmail: ${email}\nNúmero: ${numero}\nCidade: ${cidade}\nDescrição: ${descricao}`,
      from: 'whatsapp:+14155238886', 
      to: 'whatsapp:+55111111111' 
    });

    console.log('Mensagem enviada:', message.sid);
    return res.status(200).send('Mensagem enviada com sucesso para o WhatsApp!');
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);

    if (error.code === 20003) {
      return res.status(401).send('Erro de autenticação com o Twilio. Verifique suas credenciais.');
    }
    return res.status(500).send('Erro interno do servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
