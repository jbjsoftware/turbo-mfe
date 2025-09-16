// src/lib/protoHttp.ts
const CT = 'application/x-protobuf';

function ensureOk(res: Response) {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

export async function getProto<T>(url: string, decode: (u8: Uint8Array) => T): Promise<T> {
  const res = await fetch(url, { headers: { Accept: CT } });
  ensureOk(res);
  const buf = new Uint8Array(await res.arrayBuffer());
  return decode(buf);
}

export async function sendProto<TReq, TRes>(
  url: string,
  body: Uint8Array,
  decode: (u8: Uint8Array) => TRes,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
): Promise<TRes> {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': CT, Accept: CT },
    body,
  });
  ensureOk(res);
  const buf = new Uint8Array(await res.arrayBuffer());
  return decode(buf);
}
