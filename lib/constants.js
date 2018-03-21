/*!
 * constants.js - constants for bns
 * Copyright (c) 2018, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bns
 *
 * Parts of this software are based on miekg/dns and golang/go:
 *   https://github.com/miekg/dns/blob/master/msg.go
 *   https://github.com/miekg/dns/blob/master/types.go
 *   https://github.com/golang/go/blob/master/src/net/dnsmsg.go
 *
 * Resources:
 *   https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml
 */

'use strict';

const assert = require('assert');

/**
 * Message Opcodes
 * @enum {Number}
 * @default
 */

const opcodes = {
  QUERY: 0,
  IQUERY: 1,
  STATUS: 2,
  // 3 is unassigned
  NOTIFY: 4,
  UPDATE: 5
  // 6-15 are unassigned
};

/**
 * Message Opcodes By Value
 * @enum {String}
 * @default
 */

const opcodesByVal = {
  [opcodes.QUERY]: 'QUERY',
  [opcodes.IQUERY]: 'IQUERY',
  [opcodes.STATUS]: 'STATUS',
  [opcodes.NOTIFY]: 'NOTIFY',
  [opcodes.UPDATE]: 'UPDATE'
};

/**
 * Message Flags
 * @enum {Number}
 * @default
 */

const flags = {
  QR: 1 << 15, // query/response (response=1)
  AA: 1 << 10, // authoritative
  TC: 1 << 9,  // truncated
  RD: 1 << 8,  // recursion desired
  RA: 1 << 7,  // recursion available
  Z: 1 << 6,  // Z
  AD: 1 << 5,  // authenticated data
  CD: 1 << 4  // checking disabled
};

/**
 * Message Flags By Value
 * @enum {String}
 * @default
 */

const flagsByVal = {
  [flags.QR]: 'QR',
  [flags.AA]: 'AA',
  [flags.TC]: 'TC',
  [flags.RD]: 'RD',
  [flags.RA]: 'RA',
  [flags.Z]: 'Z',
  [flags.AD]: 'AD',
  [flags.CD]: 'CD'
};

/**
 * Response Codes (rcodes)
 * @see https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml
 * @enum {Number}
 * @default
 */

const codes = {
  NOERROR: 0, // No Error
  SUCCESS: 0, // No Error
  FORMERR: 1, // Format Error
  SERVFAIL: 2, // Server Failure
  NXDOMAIN: 3, // Non-Existent Domain
  NOTIMP: 4, // Not Implemented
  REFUSED: 5, // Query Refused
  YXDOMAIN: 6, // Name Exists when it should not
  YXRRSET: 7, // RR Set Exists when it should not
  NXRRSET: 8, // RR Set that should exist does not
  NOTAUTH: 9, // Server Not Authoritative for zone
  NOTZONE: 10, // Name not contained in zone

  // 11-15 are unassigned

  // EDNS
  BADSIG: 16, // TSIG Signature Failure
  BADVERS: 16, // Bad OPT Version
  BADKEY: 17, // Key not recognized
  BADTIME: 18, // Signature out of time window
  BADMODE: 19, // Bad TKEY Mode
  BADNAME: 20, // Duplicate key name
  BADALG: 21, // Algorithm not supported
  BADTRUNC: 22, // Bad Truncation
  BADCOOKIE: 23, // Bad/missing Server Cookie

  // 24-3840 are unassigned

  // 3841-4095 reserved for private use

  // 4096-65534 unassigned

  RESERVED: 65535
};

/**
 * Response Codes By Value
 * @enum {String}
 * @default
 */

const codesByVal = {
  [codes.NOERROR]: 'NOERROR',
  [codes.FORMERR]: 'FORMERR',
  [codes.SERVFAIL]: 'SERVFAIL',
  [codes.NXDOMAIN]: 'NXDOMAIN',
  [codes.NOTIMP]: 'NOTIMP',
  [codes.REFUSED]: 'REFUSED',
  [codes.YXDOMAIN]: 'YXDOMAIN',
  [codes.YXRRSET]: 'YXRRSET',
  [codes.NXRRSET]: 'NXRRSET',
  [codes.NOTAUTH]: 'NOTAUTH',
  [codes.NOTZONE]: 'NOTZONE',
  // edns
  [codes.BADVERS]: 'BADVERS',
  [codes.BADKEY]: 'BADKEY',
  [codes.BADTIME]: 'BADTIME',
  [codes.BADMODE]: 'BADMODE',
  [codes.BADNAME]: 'BADNAME',
  [codes.BADALG]: 'BADALG',
  [codes.BADTRUNC]: 'BADTRUNC',
  [codes.BADCOOKIE]: 'BADCOOKIE',
  [codes.RESERVED]: 'RESERVED'
};

/**
 * Record Types (rrtypes)
 * @enum {Number}
 * @default
 */

const types = {
  UNKNOWN: 0,
  A: 1,
  NS: 2,
  MD: 3, // obsolete
  MF: 4, // obsolete
  CNAME: 5,
  SOA: 6,
  MB: 7, // experimental
  MG: 8, // experimental
  MR: 9, // experimental
  NULL: 10, // obsolete
  WKS: 11, // deprecated
  PTR: 12,
  HINFO: 13, // not-in-use
  MINFO: 14, // experimental
  MX: 15,
  TXT: 16,
  RP: 17,
  AFSDB: 18,
  X25: 19, // not-in-use
  ISDN: 20, // not-in-use
  RT: 21, // not-in-use
  NSAP: 22, // not-in-use
  NSAPPTR: 23, // not-in-use
  SIG: 24, // obsolete
  KEY: 25, // obsolete
  PX: 26, // not-in-use
  GPOS: 27, // deprecated
  AAAA: 28,
  LOC: 29,
  NXT: 30, // obsolete
  EID: 31, // not-in-use
  NIMLOC: 32, // not-in-use (used to be NB)
  SRV: 33, // used to be NBSTAT
  ATMA: 34, // not-in-use
  NAPTR: 35,
  KX: 36,
  CERT: 37,
  A6: 38, // historic
  DNAME: 39,
  SINK: 40, // unimpl (joke?)
  OPT: 41, // impl (pseudo-record, edns)
  APL: 42, // not-in-use
  DS: 43,
  SSHFP: 44,
  IPSECKEY: 45,
  RRSIG: 46,
  NSEC: 47,
  DNSKEY: 48,
  DHCID: 49,
  NSEC3: 50,
  NSEC3PARAM: 51,
  TLSA: 52,
  SMIMEA: 53,

  // 54 is unassigned

  HIP: 55,
  NINFO: 56, // proposed
  RKEY: 57, // proposed
  TALINK: 58, // proposed
  CDS: 59,
  CDNSKEY: 60,
  OPENPGPKEY: 61,
  CSYNC: 62,

  // 63-98 are unassigned

  SPF: 99, // obsolete
  UINFO: 100, // obsolete
  UID: 101, // obsolete
  GID: 102, // obsolete
  UNSPEC: 103, // obsolete
  NID: 104,
  L32: 105,
  L64: 106,
  LP: 107,
  EUI48: 108,
  EUI64: 109,

  // 110-248 are unassigned

  TKEY: 249,
  TSIG: 250,
  IXFR: 251, // unimpl (pseudo-record)
  AXFR: 252, // unimpl (pseudo-record)
  MAILB: 253, // experimental, unimpl (qtype)
  MAILA: 254, // obsolete, unimpl (qtype)

  ANY: 255, // impl (qtype)
  URI: 256,
  CAA: 257,
  AVC: 258, // proposed
  DOA: 259, // proposed
  // OX: 260, // proposed successor to DOA?

  // 260-32767 are unassigned

  TA: 32768,
  DLV: 32769,

  // 32770-65279 are unassigned
  // 65280-65534 reserved for private use

  RESERVED: 65535 // unimpl
};

/**
 * Record Types by value
 * @enum {String}
 * @default
 */

const typesByVal = {
  [types.UNKNOWN]: 'UNKNOWN',
  [types.A]: 'A',
  [types.NS]: 'NS',
  [types.MD]: 'MD',
  [types.MF]: 'MF',
  [types.CNAME]: 'CNAME',
  [types.SOA]: 'SOA',
  [types.MB]: 'MB',
  [types.MG]: 'MG',
  [types.MR]: 'MR',
  [types.NULL]: 'NULL',
  [types.WKS]: 'WKS',
  [types.PTR]: 'PTR',
  [types.HINFO]: 'HINFO',
  [types.MINFO]: 'MINFO',
  [types.MX]: 'MX',
  [types.TXT]: 'TXT',
  [types.RP]: 'RP',
  [types.AFSDB]: 'AFSDB',
  [types.X25]: 'X25',
  [types.ISDN]: 'ISDN',
  [types.RT]: 'RT',
  [types.NSAP]: 'NSAP',
  [types.NSAPPTR]: 'NSAPPTR',
  [types.SIG]: 'SIG',
  [types.KEY]: 'KEY',
  [types.PX]: 'PX',
  [types.GPOS]: 'GPOS',
  [types.AAAA]: 'AAAA',
  [types.LOC]: 'LOC',
  [types.NXT]: 'NXT',
  [types.EID]: 'EID',
  [types.NIMLOC]: 'NIMLOC',
  [types.SRV]: 'SRV',
  [types.ATMA]: 'ATMA',
  [types.NAPTR]: 'NAPTR',
  [types.KX]: 'KX',
  [types.CERT]: 'CERT',
  [types.A6]: 'A6',
  [types.DNAME]: 'DNAME',
  [types.SINK]: 'SINK',
  [types.OPT]: 'OPT',
  [types.APL]: 'APL',
  [types.DS]: 'DS',
  [types.SSHFP]: 'SSHFP',
  [types.IPSECKEY]: 'IPSECKEY',
  [types.RRSIG]: 'RRSIG',
  [types.NSEC]: 'NSEC',
  [types.DNSKEY]: 'DNSKEY',
  [types.DHCID]: 'DHCID',
  [types.NSEC3]: 'NSEC3',
  [types.NSEC3PARAM]: 'NSEC3PARAM',
  [types.TLSA]: 'TLSA',
  [types.SMIMEA]: 'SMIMEA',
  [types.HIP]: 'HIP',
  [types.NINFO]: 'NINFO',
  [types.RKEY]: 'RKEY',
  [types.TALINK]: 'TALINK',
  [types.CDS]: 'CDS',
  [types.CDNSKEY]: 'CDNSKEY',
  [types.OPENPGPKEY]: 'OPENPGPKEY',
  [types.CSYNC]: 'CSYNC',
  [types.SPF]: 'SPF',
  [types.UINFO]: 'UINFO',
  [types.UID]: 'UID',
  [types.GID]: 'GID',
  [types.UNSPEC]: 'UNSPEC',
  [types.NID]: 'NID',
  [types.L32]: 'L32',
  [types.L64]: 'L64',
  [types.LP]: 'LP',
  [types.EUI48]: 'EUI48',
  [types.EUI64]: 'EUI64',
  [types.TKEY]: 'TKEY',
  [types.TSIG]: 'TSIG',
  [types.IXFR]: 'IXFR',
  [types.AXFR]: 'AXFR',
  [types.MAILB]: 'MAILB',
  [types.MAILA]: 'MAILA',
  [types.URI]: 'URI',
  [types.CAA]: 'CAA',
  [types.AVC]: 'AVC',
  [types.DOA]: 'DOA',
  // [types.OX]: 'OX',
  [types.ANY]: 'ANY',
  [types.TA]: 'TA',
  [types.DLV]: 'DLV',
  [types.RESERVED]: 'RESERVED'
};

/**
 * Question and Record Classes (qclass/rclass)
 * @enum {Number}
 * @default
 */

const classes = {
  RESERVED0: 0,
  IN: 1, // INET

  // 2 is unassigned (used to be CSNET/CS)

  CH: 3, // CHAOS
  HS: 4, // HESIOD

  // 5-253 are unassigned

  NONE: 254,
  ANY: 255,

  // 256-65279 are unassigned
  // 65280-65534 are reserved for private use

  RESERVED65535: 65535
};

/**
 * Question and Record Classes By Value
 * @enum {String}
 * @default
 */

const classesByVal = {
  [classes.RESERVED0]: 'RESERVED0',
  [classes.IN]: 'IN',
  [classes.CH]: 'CH',
  [classes.HS]: 'HS',
  [classes.NONE]: 'NONE',
  [classes.ANY]: 'ANY',
  [classes.RESERVED65535]: 'RESERVED65535'
};

/**
 * EDNS0 Flags
 * @enum {Number}
 * @default
 */

const eflags = {
  DO: 1 << 15 // DNSSEC OK
  // 1-15 are reserved
};

/**
 * EDNS0 Flags by value
 * @enum {Number}
 * @default
 */

const eflagsByVal = {
  [eflags.DO]: 'DO'
};

/**
 * EDNS0 Option Codes
 * @enum {Number}
 * @default
 */

const options = {
  RESERVED: 0, // None
  LLQ: 1, // Long Lived Queries
  UL: 2, // Update Lease Draft
  NSID: 3, // Nameserver Identifier
  DAU: 5, // DNSSEC Algorithm Understood
  DHU: 6, // DS Hash Understood
  N3U: 7, // NSEC3 Hash Understood
  SUBNET: 8, // Client Subnet
  EXPIRE: 9, // Expire
  COOKIE: 10, // Cookie
  TCPKEEPALIVE: 11, // TCP Keep-Alive
  PADDING: 12, // Padding
  CHAIN: 13, // Chain
  KEYTAG: 14, // EDNS Key Tag

  // 15-26945 are unassigned

  // DEVICEID: 26946,

  // 26947-65000 are unassigned

  LOCAL: 65001, // Beginning of range reserved for local/experimental use
  LOCALSTART: 65001, // Beginning of range reserved for local/experimental use

  // 65001-65534 are reserved for experimental use

  LOCALEND: 65534 // End of range reserved for local/experimental use

  // 65535 is reserved
};

/**
 * EDNS0 Option Codes By Value
 * @enum {Number}
 * @default
 */

const optionsByVal = {
  [options.RESERVED]: 'RESERVED',
  [options.LLQ]: 'LLQ',
  [options.UL]: 'UL',
  [options.NSID]: 'NSID',
  [options.DAU]: 'DAU',
  [options.DHU]: 'DHU',
  [options.N3U]: 'N3U',
  [options.SUBNET]: 'SUBNET',
  [options.EXPIRE]: 'EXPIRE',
  [options.COOKIE]: 'COOKIE',
  [options.TCPKEEPALIVE]: 'TCPKEEPALIVE',
  [options.PADDING]: 'PADDING',
  [options.CHAIN]: 'CHAIN',
  [options.KEYTAG]: 'KEYTAG',
  // [options.DEVICEID]: 'DEVICEID',
  [options.LOCAL]: 'LOCAL'
};

/**
 * DNSKEY flag values.
 * @enum {Number}
 * @default
 */

const keyFlags = {
  SEP: 1,
  REVOKE: 1 << 7,
  ZONE: 1 << 8
};

/**
 * DNSSEC encryption algorithm codes.
 * @enum {Number}
 * @default
 */

const algs = {
  // _: 0,
  RSAMD5: 1,
  DH: 2,
  DSA: 3,
  // _: 4,
  RSASHA1: 5,
  DSANSEC3SHA1: 6,
  RSASHA1NSEC3SHA1: 7,
  RSASHA256: 8,
  // _: 9,
  RSASHA512: 10,
  // _: 11,
  ECCGOST: 12,
  ECDSAP256SHA256: 13,
  ECDSAP384SHA384: 14,
  ED25519: 15,
  ED448: 16,
  INDIRECT: 252,
  PRIVATEDNS: 253, // Private (experimental keys)
  PRIVATEOID: 254
};

/**
 * DNSSEC algorithm codes by value.
 * @const {Object}
 */

const algsByVal = {
  [algs.RSAMD5]: 'RSAMD5',
  [algs.DH]: 'DH',
  [algs.DSA]: 'DSA',
  [algs.RSASHA1]: 'RSASHA1',
  [algs.DSANSEC3SHA1]: 'DSA-NSEC3-SHA1',
  [algs.RSASHA1NSEC3SHA1]: 'RSASHA1-NSEC3-SHA1',
  [algs.RSASHA256]: 'RSASHA256',
  [algs.RSASHA512]: 'RSASHA512',
  [algs.ECCGOST]: 'ECC-GOST',
  [algs.ECDSAP256SHA256]: 'ECDSAP256SHA256',
  [algs.ECDSAP384SHA384]: 'ECDSAP384SHA384',
  [algs.ED25519]: 'ED25519',
  [algs.ED448]: 'ED448',
  [algs.INDIRECT]: 'INDIRECT',
  [algs.PRIVATEDNS]: 'PRIVATEDNS',
  [algs.PRIVATEOID]: 'PRIVATEOID'
};

/**
 * DNSSEC hashing algorithm codes.
 * @enum {Number}
 * @default
 */

const hashes = {
  // _: 0,
  SHA1: 1, // RFC 4034
  SHA256: 2, // RFC 4509
  GOST94: 3, // RFC 5933
  SHA384: 4, // Experimental
  SHA512: 5 // Experimental
};

/**
 * DNSSEC hashing algorithm codes by value.
 * @const {Object}
 */

const hashesByVal = {
  [hashes.SHA1]: 'SHA1',
  [hashes.SHA256]: 'SHA256',
  [hashes.GOST94]: 'GOST94',
  [hashes.SHA384]: 'SHA384',
  [hashes.SHA512]: 'SHA512'
};

/**
 * Corresponding hashes for algorithms.
 * @const {Object}
 */

const algHashes = {
  [algs.RSAMD5]: null, // Deprecated in RFC 6725 (introduced in rfc2537)
  [algs.RSASHA1]: hashes.SHA1,
  [algs.RSASHA1NSEC3SHA1]: hashes.SHA1,
  [algs.RSASHA256]: hashes.SHA256,
  [algs.ECDSAP256SHA256]: hashes.SHA256,
  [algs.ECDSAP384SHA384]: hashes.SHA384,
  [algs.RSASHA512]: hashes.SHA512,
  [algs.ED25519]: hashes.SHA256
};

/**
 * For RFC1982 (Serial Arithmetic) calculations in 32 bits.
 * @const {Number}
 * @default
 */

const YEAR68 = (1 << 31) >>> 0;

/**
 * Max domain name length.
 * @const {Number}
 * @default
 */

const MAX_DOMAIN_LENGTH = 256;

/*
 * Helpers
 */

function toSymbol(value, map, prefix, size) {
  assert((value & size) === value);

  const symbol = map[value];

  if (typeof symbol === 'string')
    return symbol;

  return `${prefix}${value.toString(10)}`;
}

function fromSymbol(symbol, name, map, prefix, size) {
  assert(typeof symbol === 'string');

  if (symbol.length > 64)
    throw new Error(`Unknown ${name}.`);

  const value = map[symbol];

  if (typeof value === 'number')
    return value;

  if (symbol.length <= prefix.length)
    throw new Error(`Unknown ${name}: ${symbol}.`);

  if (symbol.substring(0, prefix.length) !== prefix)
    throw new Error(`Unknown ${name}: ${symbol}.`);

  if (symbol.length > prefix.length + size)
    throw new Error(`Unknown ${name}.`);

  let word = 0;

  for (let i = prefix.length; i < symbol.length; i++) {
    const ch = symbol.charCodeAt(i) - 0x30;

    if (ch < 0 || ch > 9)
      throw new Error(`Unknown ${name}: ${symbol}.`);

    word *= 10;
    word += ch;
  }

  return word;
}

function opcodeToString(opcode) {
  return toSymbol(opcode, opcodesByVal, 'OPCODE', 0x0f);
}

function stringToOpcode(symbol) {
  return fromSymbol(symbol, 'opcode', opcodes, 'OPCODE', 2) & 0x0f;
}

function codeToString(code) {
  return toSymbol(code, codesByVal, 'RCODE', 0x0f);
}

function stringToCode(symbol) {
  return fromSymbol(symbol, 'code', codes, 'RCODE', 2) & 0x0f;
}

function typeToString(type) {
  return toSymbol(type, typesByVal, 'TYPE', 0xffff);
}

function stringToType(symbol) {
  return fromSymbol(symbol, 'type', types, 'TYPE', 5);
}

function classToString(class_) {
  return toSymbol(class_, classesByVal, 'CLASS', 0xffff);
}

function stringToClass(symbol) {
  return fromSymbol(symbol, 'class', classes, 'CLASS', 5);
}

function optionToString(option) {
  return toSymbol(option, optionsByVal, 'OPTION', 0xffff);
}

function stringToOption(symbol) {
  return fromSymbol(symbol, 'option', options, 'OPTION', 5);
}

function algToString(alg) {
  return toSymbol(alg, algsByVal, 'ALG', 0xff);
}

function stringToAlg(symbol) {
  return fromSymbol(symbol, 'algorithm', algs, 'ALG', 3) & 0xff;
}

function hashToString(hash) {
  return toSymbol(hash, hashesByVal, 'HASH', 0xff);
}

function stringToHash(symbol) {
  return fromSymbol(symbol, 'hash', hashes, 'HASH', 3) & 0xff;
}

/*
 * Expose
 */

exports.opcodes = opcodes;
exports.opcodesByVal = opcodesByVal;
exports.flags = flags;
exports.flagsByVal = flagsByVal;
exports.codes = codes;
exports.codesByVal = codesByVal;
exports.types = types;
exports.typesByVal = typesByVal;
exports.classes = classes;
exports.classesByVal = classesByVal;
exports.eflags = eflags;
exports.eflagsByVal = eflagsByVal;
exports.options = options;
exports.optionsByVal = optionsByVal;
exports.keyFlags = keyFlags;
exports.algs = algs;
exports.algsByVal = algsByVal;
exports.hashes = hashes;
exports.hashesByVal = hashesByVal;
exports.algHashes = algHashes;
exports.YEAR68 = YEAR68;
exports.MAX_DOMAIN_LENGTH = MAX_DOMAIN_LENGTH;

exports.opcodeToString = opcodeToString;
exports.stringToOpcode = stringToOpcode;
exports.codeToString = codeToString;
exports.stringToCode = stringToCode;
exports.typeToString = typeToString;
exports.stringToType = stringToType;
exports.classToString = classToString;
exports.stringToClass = stringToClass;
exports.optionToString = optionToString;
exports.stringToOption = stringToOption;
exports.algToString = algToString;
exports.stringToAlg = stringToAlg;
exports.hashToString = hashToString;
exports.stringToHash = stringToHash;