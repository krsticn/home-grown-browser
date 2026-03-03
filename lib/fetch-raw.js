import { createConnection } from 'net';
import { connect as createTLSConnection } from 'node:tls';

function getDecodedArrBuff(arrayBuffer) {
  const uInt8Array = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(uInt8Array);
}

function getRequest({ host, path }) {
  let reqStr = '';

  reqStr += `GET ${path} HTTP/1.1\r\n`;
  reqStr += `Host: ${host}\r\n`;
  reqStr += `Connection: close\r\n`;
  reqStr += `User-Agent: custom-browser\r\n`;
  reqStr += '\r\n'

  return reqStr;
}

function getIsHttps(schema) {
  return schema === 'https';
}

function getSocket({ host, port, schema }) {
  if (getIsHttps(schema)) {
    return createTLSConnection({
      port: port,
      host: host,
      servername: host,
      rejectUnauthorized: false,
    });
  }

  return createConnection({
    port: port,
    host: host,
  })
}

export function fetchRaw({ host, path, port, schema }) {
  if (!host) throw new Error('host is required')
  if (!path) throw new Error('path is required')
  if (!schema) throw new Error('schema is required')

  return new Promise((resolve, reject) => {
    let streamedResponse = '';
    const socket = getSocket({ host, port, schema })
    
    socket.on('connect', () => socket.write(getRequest({ host, path })));

    socket.on('data', (arrayBuffer) => { streamedResponse += getDecodedArrBuff(arrayBuffer) });

    socket.on('error', (error) => reject(error));
    socket.on('close', () => resolve(streamedResponse));
  })
}