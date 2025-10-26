const s = document.createElement("script");
s.src = chrome.runtime.getURL("page.js");
document.documentElement.appendChild(s);
s.onload = () => s.remove(); // 注入完删除标签，避免被检测
