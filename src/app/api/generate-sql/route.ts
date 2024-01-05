import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';
 
const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfig)
 
export async function POST(req: Request) {
  const { schema, prompt } = await req.json();

  const message = `
    O seu trabalho e criar queries em SQL a partir de um schema SQL abaixo.

    Schema SQL: 
    ***
    ${schema}
    ***

    A partir do schema acima, escreva uma query SQL a partir da solicitacao abaixo.
    Me retorne SOMENTE o codigo SQL, nada alem disso.

    Solicitacao: ${prompt}
  `.trim()
 
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
        { role: 'user', content: message }
    ],
  });
 
  const stream = OpenAIStream(response);
 
  return new StreamingTextResponse(stream);
}