import express from 'express'
const app = express()
app.use(express.json({extended: true, limit: '1mb'}))


import { ChatGPTAPI } from 'chatgpt'
import dotenv from 'dotenv'
import * as lark from '@larksuiteoapi/node-sdk';


dotenv.config()

const chatgpt_api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
})

const feishu_client = new lark.Client({
  appId: process.env.FEISHU_APP_ID,
  appSecret: process.env.FEISHU_APP_SECRET,
  appType: lark.AppType.SelfBuild,
  domain: lark.Domain.Feishu,
});

let sessioninfo = {}

app.post('/chat', (req, res) => {
  console.log(req.body);

  //for feishu bot verification
  if ('challenge' in req.body) {
    const challenge = req.body.challenge;
    res.status(200).json({
      'challenge': challenge
    });
    return 
  }
  else {
    //Check message type
    //Currently only process text message, ignore other types
    const event_type = req.body.header.event_type
    console.log(event_type)
    if (event_type != 'im.message.receive_v1') {
      console.log('Not supported message')
      return
    }

    let message = (JSON.parse(req.body.event.message.content)).text
    let chat_id = req.body.event.message.chat_id
    let message_id = req.body.event.message.message_id
    console.log(message, chat_id, message_id)

    res.status(200).send()

    //Call ChatGPT and send back to Feishu
    processMessage(message, chat_id)
  }
  
})


app.listen(3000, () => {
  console.log('My ChatGPT Bot listening on port 3000!');
});

async function processMessage(message, chat_id) {
  console.log('now send message to ChatGPT')
  let chatgpt_res
  //Check if this is the first message
  if (!sessioninfo.hasOwnProperty(chat_id)) {
    console.log("First message")
    chatgpt_res = await chatgpt_api.sendMessage(message)
    console.log(chatgpt_res.text, chatgpt_res.conversationId, chatgpt_res.id)
    sessioninfo[chat_id] = {
      conversationId : chatgpt_res.conversationId,
      parentMessageId : chatgpt_res.id
    }
    console.log(sessioninfo)
  }
  else {
    console.log("Not First Message")
    chatgpt_res = await chatgpt_api.sendMessage(message, {
      conversationId : sessioninfo[chat_id].conversationId,
      parentMessageId : sessioninfo[chat_id].parentMessageId
    })
    console.log(chatgpt_res.text, chatgpt_res.conversationId, chatgpt_res.id)
    sessioninfo[chat_id].parentMessageId = chatgpt_res.id
    console.log(sessioninfo)
  }


  console.log('now send message to Feishu')
  let content = {
        text: chatgpt_res.text
  }
  const res = await feishu_client.im.message.create({
      params: {
          receive_id_type: 'chat_id',
      },
      data: {
          receive_id: chat_id,
          content: JSON.stringify(content),
          msg_type: 'text',
    },
  });
}
