const { SocksProxyAgent } = require('socks-proxy-agent');

const url = 'https://proxylist.geonode.com/api/proxy-list?anonymityLevel=elite&protocols=socks5&filterUpTime=90&filterLastChecked=10&speed=fast&limit=500&page=1&sort_by=upTime&sort_type=asc';
let proxyList = [];
let lastCheck = 0;
const checkFreq = 10*60*1000;

async function getAgent() {
  if (Date.now() > lastCheck+checkFreq) {
    let newlist = await fetch(url);
    newlist = await newlist.json();
    newlist = newlist.data.map(p => {return { ip: p.ip, port: p.port }});
    proxyList = newlist;
  }
  let idx = Math.floor(Math.random() * proxyList.length);

  return new SocksProxyAgent(`socks5://${proxyList[idx].ip}:${proxyList[idx].port}`);
}

module.exports = { getAgent };