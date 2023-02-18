# feishu-chatgpt-bot

A very quick and dirty implementation of a Feishu chatbot connecting to ChatGPT

## Deployment
Creat a .env file to init environment variables for Open AI Key, Feishu App ID and APP Secret. Example of this file could be:

```
OPENAI_API_KEY=XXXX
FEISHU_APP_ID=YYYY
FEISHU_APP_SECRET=ZZZZ
```

Install latest version of Node and NPM to install the required packages.

## API for Connecting to ChatGPT
Following unoffical api is leveraged to connect to ChatGPT:
https://github.com/transitive-bullshit/chatgpt-api

`Big thanks to the author! `