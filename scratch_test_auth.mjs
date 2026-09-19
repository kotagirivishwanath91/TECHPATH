// Mock browser environment
globalThis.window = {
  location: { hash: '#/signin', search: '', pathname: '/', origin: 'http://localhost:3000' },
  addEventListener: () => {},
  scrollTo: () => {}
};
globalThis.document = {
  getElementById: (id) => ({
    id,
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {},
    addEventListener: () => {},
    innerHTML: '',
    value: '',
    appendChild: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  body: {
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {}
  },
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {},
    addEventListener: () => {},
    setAttribute: () => {},
    appendChild: () => {},
    innerHTML: ''
  })
};
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
globalThis.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
globalThis.navigator = { onLine: true };

async function run() {
  try {
    console.log('Importing AuthPages.js...');
    const mod = await import('../js/pages/AuthPages.js');
    console.log('AuthPages imported successfully!', Object.keys(mod));
    const AuthPages = mod.AuthPages;
    const dummyViewport = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
    
    console.log('Testing renderLogin...');
    AuthPages.renderLogin(dummyViewport);
    console.log('renderLogin succeeded! HTML length:', dummyViewport.innerHTML.length);
    
    console.log('Testing renderSignup...');
    AuthPages.renderSignup(dummyViewport);
    console.log('renderSignup succeeded! HTML length:', dummyViewport.innerHTML.length);
  } catch (err) {
    console.error('ERROR during AuthPages test:', err);
  }
}

run();
