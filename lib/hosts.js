/*!
 * hosts.js - hosts file for bns
 * Copyright (c) 2018, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bns
 */

'use strict';

const assert = require('assert');
const Path = require('path');
const fs = require('bfile');
const IP = require('binet');
const encoding = require('./encoding');
const wire = require('./wire');
const util = require('./util');

const {
  Record,
  ARecord,
  AAAARecord,
  PTRRecord,
  types,
  classes
} = wire;

/**
 * Hosts
 */

class Hosts {
  constructor() {
    this.map = new Map();
    this.rev = new Map();
  }

  inject(obj) {
    assert(obj instanceof Hosts);

    this.clearHosts();

    for (const [key, value] of obj.map)
      this.map.set(key, value.clone());

    for (const [key, value] of obj.rev)
      this.rev.set(key, value);

    return this;
  }

  clone() {
    const copy = new this.constructor();
    return copy.inject(this);
  }

  clear() {
    this.clearHosts();
    return this;
  }

  getSystem() {
    if (process.platform === 'win32') {
      const root = process.env.SystemRoot || 'C:\\Windows';
      return Path.join(root, '\\System32\\Drivers\\etc\\hosts');
    }

    return '/etc/hosts';
  }

  getHosts() {
    const out = [];

    for (const [name, addr] of this.map) {
      if (addr.inet4)
        out.push([name, addr.inet4]);

      if (addr.inet6)
        out.push([name, addr.inet6]);
    }

    return out;
  }

  setHosts(hosts) {
    assert(Array.isArray(hosts));

    this.clearHosts();

    for (const item of hosts) {
      assert(Array.isArray(item) && item.length === 2);
      const [name, addr] = item;
      this.addHost(name, addr);
    }

    return this;
  }

  clearHosts() {
    this.map.clear();
    this.rev.clear();
    return this;
  }

  setDefault() {
    return this.setLocal();
  }

  setLocal() {
    this.clearHosts();
    this.addHost('localhost', '127.0.0.1');
    this.addHost('localhost', '::1');
    return this;
  }

  addHost(name, host, hostname = null) {
    assert(typeof name === 'string');
    assert(typeof host === 'string');
    assert(hostname === null || typeof hostname === 'string');

    name = name.toLowerCase();
    name = util.fqdn(name);

    if (!util.isName(name))
      throw new Error('Invalid name.');

    if (util.endsWith(name, '.localdomain.'))
      name = name.slice(0, -12);

    if (hostname) {
      hostname = hostname.toLowerCase();
      hostname = util.fqdn(hostname);

      if (!util.isName(hostname))
        throw new Error('Invalid hostname.');
    }

    let entry = this.map.get(name);

    if (!entry)
      entry = new HostEntry();

    const ip = IP.toBuffer(host);
    const addr = IP.toString(ip);
    const rev = encoding.reverse(addr);

    entry.name = name;

    if (IP.isIPv4(ip))
      entry.inet4 = addr;
    else
      entry.inet6 = addr;

    entry.hostname = hostname;

    this.map.set(name, entry);
    this.rev.set(rev, name);

    return this;
  }

  lookup(name) {
    const key = name.toLowerCase();
    const ptr = this.rev.get(key);

    if (ptr)
      return this.map.get(ptr);

    return this.map.get(key);
  }

  query(name, type) {
    assert(typeof name === 'string');
    assert((type & 0xffff) === type);

    const entry = this.lookup(name);

    if (!entry)
      return null;

    const answer = [];

    if (type === types.PTR) {
      const rr = new Record();
      const rd = new PTRRecord();
      rr.name = name;
      rr.class = classes.IN;
      rr.ttl = 300;
      rr.type = types.PTR;
      rr.data = rd;
      rd.ptr = entry.name;
      answer.push(rr);
      return answer;
    }

    if (type === types.A || type === types.ANY) {
      if (entry.inet4) {
        const rr = new Record();
        const rd = new ARecord();
        rr.name = name;
        rr.class = classes.IN;
        rr.ttl = 300;
        rr.type = types.A;
        rr.data = rd;
        rd.address = entry.inet4;
        answer.push(rr);
      }
    }

    if (type === types.AAAA || type === types.ANY) {
      if (entry.inet6) {
        const rr = new Record();
        const rd = new AAAARecord();
        rr.name = name;
        rr.class = classes.IN;
        rr.ttl = 300;
        rr.type = types.AAAA;
        rr.data = rd;
        rd.address = entry.inet6;
        answer.push(rr);
      }
    }

    return answer;
  }

  fromString(text) {
    assert(typeof text === 'string');

    this.clearHosts();

    if (text.charCodeAt(0) === 0xfeff)
      text = text.substring(1);

    text = text.replace(/\t/g, ' ');
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');
    text = text.replace(/\\\n/g, '');
    text = text.toLowerCase();

    for (const chunk of text.split('\n')) {
      const line = chunk.trim();

      if (line.length === 0)
        continue;

      if (line[0] === '#' || line[0] === ';')
        continue;

      const parts = line.split(/\s+/);

      const ip = parts[0];

      let hostname = null;

      if (parts.length > 2)
        hostname = parts.pop();

      for (let i = 1; i < parts.length; i++) {
        const name = parts[i];
        try {
          this.addHost(name, ip, hostname);
        } catch (e) {
          continue;
        }
      }
    }

    return this;
  }

  static fromString(text) {
    return new this().fromString(text);
  }

  fromFile(file) {
    assert(typeof file === 'string');
    const text = fs.readFileSync(file, 'utf8');
    return this.fromString(text);
  }

  static fromFile(file) {
    return new this().fromFile(file);
  }

  fromSystem() {
    const file = this.getSystem();
    try {
      return this.fromFile(file);
    } catch (e) {
      return this.setLocal();
    }
  }

  static fromSystem() {
    return new this().fromSystem();
  }

  async fromFileAsync(file) {
    assert(typeof file === 'string');
    const text = await fs.readFile(file, 'utf8');
    return this.fromString(text);
  }

  static fromFileAsync(file) {
    return new this().fromFileAsync(file);
  }

  async fromSystemAsync() {
    const file = this.getSystem();
    try {
      return await this.fromFileAsync(file);
    } catch (e) {
      return this.setLocal();
    }
  }

  static fromSystemAsync() {
    return new this().fromSystemAsync();
  }
}

/**
 * HostEntry
 */

class HostEntry {
  constructor() {
    this.name = null;
    this.inet4 = null;
    this.inet6 = null;
    this.hostname = null;
  }

  inject(obj) {
    assert(obj instanceof HostEntry);
    this.name = obj.name;
    this.inet4 = obj.inet4;
    this.inet6 = obj.inet6;
    this.hostname = obj.hostname;
    return this;
  }

  clone() {
    const copy = new this.constructor();
    return copy.inject(this);
  }
}

/*
 * Expose
 */

module.exports = Hosts;