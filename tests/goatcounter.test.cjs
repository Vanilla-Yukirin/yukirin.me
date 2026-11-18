const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../components/GoatCounter.tsx'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2020 } }).outputText;
const tick = () => new Promise(resolve => setImmediate(resolve));

function page(origin = 'https://yukirin.me', mode = 'production') {
  let path = '/', cleanup;
  const scripts = [], timers = new Map(), visits = [];
  const window = { setTimeout(fn) { timers.set(timers.size + 1, fn); return timers.size; },
    clearTimeout(id) { timers.delete(id); }, addEventListener() {}, removeEventListener() {} };
  const exports = {};
  vm.runInNewContext(compiled, { exports, window, location: { origin }, process: { env: { NODE_ENV: mode } },
    document: { readyState: 'complete', title: 'Test page',
      createElement: () => ({ dataset: {}, removed: false, remove() { this.removed = true; } }),
      head: { appendChild: s => scripts.push(s) } },
    require(name) {
      if (name === 'react') return { useEffect: fn => { cleanup = fn(); } };
      if (name === 'next/navigation') return { usePathname: () => path };
      throw Error('Unexpected dependency');
    } });
  return { scripts, timers, visits,
    render(next = '/') { cleanup?.(); path = next; exports.default(); },
    loaded() {
      // The official client resolves its endpoint when count() is called, including SPA navigation.
      window.goatcounter.count = visit => {
        const tag = scripts.find(script => !script.removed && script.dataset.goatcounter);
        const endpoint = tag?.dataset.goatcounter || window.goatcounter.endpoint;
        assert.equal(endpoint, 'https://cnt.yukirin.me/count', 'count() needs a live endpoint');
        visits.push(visit.path);
      };
      scripts[0].onload();
    },
  };
}

test('development and non-production origins never load analytics', async () => {
  for (const [origin, mode] of [['http://localhost:3000', 'production'],
    ['https://preview.example', 'production'], ['https://yukirin.me', 'development']]) {
    const p = page(origin, mode); p.render(); await tick(); assert.equal(p.scripts.length, 0);
  }
});

test('one client tracks initial load and App Router navigation, cancelling stale routes', async () => {
  const p = page();
  p.render('/'); p.render('/cv-pink'); // Navigation while count.js is loading.
  assert.equal(p.scripts.length, 1);
  assert.equal(p.scripts[0].dataset.goatcounter, 'https://cnt.yukirin.me/count');
  p.loaded(); await tick();
  assert.deepEqual(p.visits, ['/cv-pink']);
  p.render('/cv-blue'); await tick();
  assert.deepEqual(p.visits, ['/cv-pink', '/cv-blue']);
  assert.equal(p.scripts.length, 1);
});

test('effect replay does not duplicate the first visit', async () => {
  const p = page(); p.render('/'); p.render('/'); p.loaded(); await tick();
  assert.deepEqual(p.visits, ['/']);
});

test('timeout stays silent and does not retry on route changes', async () => {
  const p = page(); p.render('/'); [...p.timers.values()][0](); await tick();
  p.render('/cv-pink'); await tick();
  assert.deepEqual(p.visits, []); assert.equal(p.scripts.length, 1);
});
