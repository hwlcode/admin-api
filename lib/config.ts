const mongodb = {
  DBURL: 'mongodb://127.0.0.1',
  PORT: '27017',
  SERVERPORT: '27027',
  USERNAME: '',
  PASSWORD: '',
  DATABASE: 'chadao'
};

const wechat = {
  APPID: 'wx5cd1cb352be7d983',
  SECRET: 'a00b8c0497396974c53699a506e42d15'
};

const qiniu = {
  ACCESS_KEY: 'knHk6MSfcyIYaH-VDUvLLvNNi8lmK5LCLvfeKa7h',
  SECRET_KEY: 'VH9zMDzg9wBZp4UBfZZRSLSPdRt6YBH4A2VrkPtA',
  SDNURL: 'http://pl02v1azy.bkt.clouddn.com/',
  BUCKKET: 'webcdn'
};

const config = {
  mongodb: mongodb,
  wechat: wechat,
  qiniu: qiniu
};

export default config;