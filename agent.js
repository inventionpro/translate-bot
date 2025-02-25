const { SocksProxyAgent } = require('socks-proxy-agent');

const url = 'https://proxylist.geonode.com/api/proxy-list?anonymityLevel=elite&protocols=socks5&filterUpTime=90&speed=fast&limit=100&page=1&sort_by=lastChecked&sort_type=desc';
let proxyList = [];
let lastCheck = 0;
const checkFreq = 20*60*1000;

async function getAgent(n = 0) {
  if (n>4) return;
  if (Date.now() > lastCheck+checkFreq) {
    let newlist;
    try {
      newlist = await fetch(url);
      newlist = await newlist.json();
      if (!newlist || !newlist.length) return await getAgent(n+1);
    } catch(err) {
      return await getAgent(n+1);
    }
    newlist = newlist.data.map(p => {return { ip: p.ip, port: p.port }});
    proxyList = newlist;
  }
  let idx = Math.floor(Math.random() * proxyList.length);
  console.log(proxyList)

  return new SocksProxyAgent(`socks5://${proxyList[idx].ip}:${proxyList[idx].port}`);
}

module.exports = { getAgent };
