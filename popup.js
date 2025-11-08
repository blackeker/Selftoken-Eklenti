// popup.js
import { userCode } from './alan.js';

const runBtn = document.getElementById('runBtn');
const loginBtn = document.getElementById('loginBtn');
const tokenInput = document.getElementById('tokenInput');
const resultEl = document.getElementById('result');



// Utility: güvenli stringify (circular referanslara karşı)
function safeStringify(v) {
  try {
    return JSON.stringify(v, null, 2);
  } catch (e) {
    try { return String(v); } catch (_) { return '[unserializable]'; }
  }
}


// Aktif sekmede hemen çalıştır
runBtn.addEventListener('click', async () => {
  try {
    if (!userCode.trim()) return alert('The embedded script is empty.');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return alert('No active tab found.');

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: false },
      world: "MAIN",
      func: (codeToRun) => {
        // This code runs in the MAIN world of the page.
        return (async () => {
          const logs = [];
          const origConsole = console.log;
          console.log = (...args) => {
            try {
              const s = args.map(a => {
                try { return typeof a === 'string' ? a : JSON.stringify(a); }
                catch(e){ return String(a); }
              }).join(' ');
              logs.push(s);
            } catch (e) {
              logs.push('console serialization error');
            }
            try { origConsole.apply(console, args); } catch(e) {}
          };

          let returnValue;
          try {
            const fn = new Function(codeToRun);
            const maybe = fn();
            if (maybe instanceof Promise) {
              returnValue = await maybe;
            } else {
              returnValue = maybe;
            }
          } catch (err) {
            logs.push('ERROR: ' + (err && err.message ? err.message : String(err)));
            returnValue = undefined;
          }

          try { console.log = origConsole; } catch(e) {}
          return { value: returnValue, logs };
        })();
      },
      args: [userCode]
    });

    const res = results && results[0] && results[0].result ? results[0].result : null;
    if (res) {
      resultEl.textContent = 'Return Value: ' + safeStringify(res.value) + '\n\nLogs:\n' + (res.logs && res.logs.length ? res.logs.join('\n') : '(none)');
    } else {
      resultEl.textContent = 'Could not get a serializable result.';
    }
  } catch (err) {
    resultEl.textContent = 'Execution error: ' + err.message;
    console.error(err);
  }
});

loginBtn.addEventListener('click', async () => {
  try {
    const token = tokenInput.value;
    if (!token.trim()) {
      return alert('Please enter a token.');
    }


    // Save the token to local storage for the content script to access
    await chrome.storage.local.set({ loginToken: token });

    resultEl.textContent = 'Searching for Discord tab...';

    const tabs = await chrome.tabs.query({ url: "*://discord.com/*" });

    let targetTab;
    if (tabs.length > 0) {
      resultEl.textContent = 'Found existing Discord tab. Navigating to login page...';
      targetTab = await chrome.tabs.update(tabs[0].id, { 
        url: 'https://discord.com/login', 
        active: true 
      });
    } else {
      resultEl.textContent = 'Opening new tab for discord.com/login...';
      targetTab = await chrome.tabs.create({ 
        url: 'https://discord.com/login', 
        active: true 
      });
    }

    const listener = async (tabId, changeInfo, tab) => {
      if (tabId === targetTab.id && changeInfo.status === 'complete') {
        resultEl.textContent = 'Page loaded. Injecting login script...';
        try {
          await chrome.scripting.executeScript({
            target: { tabId: targetTab.id },
            files: ['giren.js']
          });
          resultEl.textContent = 'Login script injected successfully.';
        } catch (err) {
          resultEl.textContent = `Error during script injection: ${err.message}`;
          console.error(err);
        }

        // Clean up the listener
        chrome.tabs.onUpdated.removeListener(listener);
      }
    };

    chrome.tabs.onUpdated.addListener(listener);

  } catch (err) {
    resultEl.textContent = `Execution error: ${err.message}`;
    console.error(err);
  }
});
