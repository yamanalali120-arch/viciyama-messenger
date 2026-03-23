const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());

const VICI_PASSWORD = 'Hasi2';
const ADMIN_PASSWORD = 'YamanBoss123';
const PORT = process.env.PORT || 3000;

let messages = [];
let viciOnline = false;
let viciLastSeen = new Date().toISOString();

app.post('/api/vici/login', (req, res) => {
  if (req.body.password === VICI_PASSWORD) {
    res.json({ success: true, token: 'vici-' + uuidv4() });
  } else {
    res.status(401).json({ success: false });
  }
});

app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-' + uuidv4() });
  } else {
    res.status(401).json({ success: false });
  }
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>Vici & Yaman</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐰</text></svg>">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a12;color:#fff;height:100vh;height:100dvh;overflow:hidden}
.screen{display:none;height:100vh;height:100dvh}.screen.active{display:flex}
.login-container{display:flex;align-items:center;justify-content:center;width:100%;background:linear-gradient(135deg,#0a0a1a,#1a0a2e,#2a1040,#0a0a1a);position:relative;overflow:hidden}
.floating-bg{position:absolute;width:100%;height:100%;overflow:hidden;pointer-events:none}
.floating-bg span{position:absolute;font-size:24px;animation:floatUp 8s infinite;opacity:.12}
.floating-bg span:nth-child(1){left:10%;animation-delay:0s;font-size:20px}
.floating-bg span:nth-child(2){left:25%;animation-delay:1.5s;font-size:28px}
.floating-bg span:nth-child(3){left:45%;animation-delay:3s;font-size:18px}
.floating-bg span:nth-child(4){left:65%;animation-delay:.5s;font-size:24px}
.floating-bg span:nth-child(5){left:80%;animation-delay:2s;font-size:22px}
.floating-bg span:nth-child(6){left:90%;animation-delay:4s;font-size:20px}
@keyframes floatUp{0%{transform:translateY(100vh) rotate(0);opacity:0}10%{opacity:.12}90%{opacity:.12}100%{transform:translateY(-100px) rotate(360deg);opacity:0}}
.login-box{text-align:center;padding:40px 30px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:28px;backdrop-filter:blur(30px);width:100%;max-width:400px;margin:20px;position:relative;z-index:2;animation:slideUp .6s ease}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.login-bunny{font-size:70px;margin-bottom:15px;animation:bounce 2s infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.login-box h1{font-size:2.2rem;font-weight:800;background:linear-gradient(135deg,#c471ed,#f64f59,#c471ed);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite;margin-bottom:5px}
@keyframes shimmer{to{background-position:200% center}}
.login-box .sub{color:#888;margin-bottom:30px;font-size:1rem}
.login-form{display:flex;flex-direction:column;gap:14px}
.login-form input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px 20px;font-size:1rem;color:#fff;outline:none;transition:all .3s;text-align:center}
.login-form input:focus{border-color:#c471ed;box-shadow:0 0 25px rgba(196,113,237,.2)}
.login-form input::placeholder{color:#666}
.login-form button{background:linear-gradient(135deg,#c471ed,#f64f59);border:none;border-radius:16px;padding:16px;font-size:1.05rem;font-weight:700;color:#fff;cursor:pointer;transition:all .3s}
.login-form button:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(196,113,237,.4)}
.error-msg{color:#ff6b81;font-size:.85rem;padding:10px;background:rgba(255,107,129,.1);border-radius:12px;border:1px solid rgba(255,107,129,.2);display:none}
.hint-section{margin-top:25px}
.hint-toggle{color:#777;font-size:.85rem;cursor:pointer;padding:8px;border-radius:10px;transition:all .3s;display:inline-block}
.hint-toggle:hover{color:#c471ed;background:rgba(196,113,237,.08)}
.hint-content{margin-top:12px;padding:14px;background:rgba(196,113,237,.08);border:1px solid rgba(196,113,237,.15);border-radius:14px;display:none}
.hint-content p{color:#bbb;font-size:.85rem}
.chat-box{display:flex;flex-direction:column;height:100vh;height:100dvh;width:100%;max-width:600px;margin:0 auto;background:#0a0a12}
.chat-header{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:rgba(15,15,25,.98);border-bottom:1px solid rgba(255,255,255,.06);z-index:10;flex-shrink:0}
.h-left{display:flex;align-items:center;gap:12px}
.avatar{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;position:relative;flex-shrink:0}
.av-yaman{background:linear-gradient(135deg,#667eea,#764ba2)}
.status-dot{position:absolute;bottom:0;right:0;width:11px;height:11px;border-radius:50%;background:#4caf50;border:2px solid #0f0f19}
.h-info h3{font-size:1rem;font-weight:700}
.h-info .status{font-size:.72rem;color:#4caf50;font-weight:500}
.h-bunny{font-size:1.4rem;animation:bounce 3s infinite}
.msgs-wrap{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;scroll-behavior:smooth;min-height:0}
.msgs-wrap::-webkit-scrollbar{width:3px}
.msgs-wrap::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}
#messages{display:flex;flex-direction:column;gap:5px}
.welcome-msg{align-self:flex-start;max-width:82%;padding:12px 16px;background:rgba(255,255,255,.07);border-radius:18px 18px 18px 5px;font-size:.92rem;line-height:1.5;color:#e0e0e0;animation:fadeIn .5s ease;margin-bottom:8px}
.welcome-msg .wtime{font-size:.62rem;color:rgba(255,255,255,.25);margin-top:4px}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.msg{max-width:80%;padding:9px 15px;border-radius:18px;font-size:.92rem;line-height:1.45;animation:fadeIn .3s ease;word-wrap:break-word}
.msg.sent{align-self:flex-end;background:linear-gradient(135deg,#c471ed,#a855f7);color:#fff;border-bottom-right-radius:5px;margin-left:auto}
.msg.recv{align-self:flex-start;background:rgba(255,255,255,.07);color:#e0e0e0;border-bottom-left-radius:5px}
.msg .t{font-size:.6rem;color:rgba(255,255,255,.35);margin-top:3px}
.msg.sent .t{text-align:right}
.date-sep{text-align:center;padding:12px 0}
.date-sep span{background:rgba(255,255,255,.06);color:#777;font-size:.7rem;padding:4px 12px;border-radius:8px}
.typing{display:none;align-items:center;gap:8px;padding:6px 0}
.typing.show{display:flex}
.typing .tav{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700}
.typing .tbub{background:rgba(255,255,255,.07);border-radius:16px;padding:8px 14px}
.tdots{display:flex;gap:3px}
.tdots span{width:6px;height:6px;border-radius:50%;background:#999;animation:tdot 1.4s infinite}
.tdots span:nth-child(2){animation-delay:.2s}
.tdots span:nth-child(3){animation-delay:.4s}
@keyframes tdot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
.input-area{padding:8px 12px 14px;background:rgba(15,15,25,.98);border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}
.input-row{display:flex;align-items:flex-end;gap:8px;background:rgba(255,255,255,.05);border-radius:22px;padding:4px 4px 4px 16px;border:1px solid rgba(255,255,255,.08);transition:border-color .3s}
.input-row:focus-within{border-color:rgba(196,113,237,.4)}
.input-row textarea{flex:1;background:none;border:none;color:#fff;font-size:.92rem;padding:7px 0;resize:none;max-height:100px;outline:none;font-family:inherit;line-height:1.4}
.input-row textarea::placeholder{color:#555}
.send-btn{width:38px;height:38px;border-radius:50%;border:none;background:linear-gradient(135deg,#c471ed,#f64f59);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s;flex-shrink:0;opacity:.4}
.send-btn:not(:disabled){opacity:1}
.send-btn:not(:disabled):hover{transform:scale(1.08)}
.send-btn svg{width:18px;height:18px}
@media(max-width:500px){.login-box h1{font-size:1.8rem}.login-bunny{font-size:55px}.login-box{padding:28px 20px;margin:12px}.msg{max-width:87%}}
</style>
</head>
<body>
<div id="login-screen" class="screen active">
<div class="login-container">
<div class="floating-bg"><span>💕</span><span>🐰</span><span>💜</span><span>✨</span><span>💕</span><span>🐰</span></div>
<div class="login-box">
<div class="login-bunny">🐰</div>
<h1>Vici & Yaman</h1>
<p class="sub">Euer privater Chat 💜</p>
<div class="login-form">
<input type="password" id="pw" placeholder="🔒 Bitte Passwort eingeben um den Chat beizutreten" autocomplete="off">
<button id="login-btn">Chat betreten 🐰</button>
<div class="error-msg" id="error">Falsches Passwort! 🙈</div>
</div>
<div class="hint-section">
<div class="hint-toggle" id="hint-btn">🐰 Brauchst du einen Tipp?</div>
<div class="hint-content" id="hint"><p>💡 <strong>Tipp:</strong> Türkisch für Anfänger... das Ahh-Wort 😏</p></div>
</div>
</div>
</div>
</div>
<div id="chat-screen" class="screen">
<div class="chat-box">
<div class="chat-header">
<div class="h-left">
<div class="avatar av-yaman">Y<div class="status-dot" id="ystatus"></div></div>
<div class="h-info"><h3>Yaman 👑</h3><span class="status" id="statustxt">Online</span></div>
</div>
<div class="h-bunny">🐰</div>
</div>
<div class="msgs-wrap" id="msgs-wrap">
<div id="messages"></div>
<div class="typing" id="typing">
<div class="tav">Y</div>
<div class="tbub"><div class="tdots"><span></span><span></span><span></span></div></div>
</div>
</div>
<div class="input-area">
<div class="input-row">
<textarea id="msginput" placeholder="Schreib Yaman eine Nachricht... 💜" rows="1"></textarea>
<button class="send-btn" id="sendbtn" disabled><svg viewBox="0 0 24 24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/></svg></button>
</div>
</div>
</div>
</div>
<script src="/socket.io/socket.io.js"></script>
<script>
(function(){
var socket=io();
var $=function(id){return document.getElementById(id)};
var token=localStorage.getItem('vici_token');
var lastDate=null;
var typTimer=null;
$('hint-btn').onclick=function(){var h=$('hint');h.style.display=h.style.display==='none'||!h.style.display?'block':'none'};
if(token){showChat();socket.emit('vici:join',{token:token})}
$('login-btn').onclick=login;
$('pw').onkeydown=function(e){if(e.key==='Enter')login()};
$('pw').oninput=function(){$('error').style.display='none'};
function login(){
var pw=$('pw').value;if(!pw)return $('pw').focus();
fetch('/api/vici/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}).then(function(r){return r.json()}).then(function(d){
if(d.success){token=d.token;localStorage.setItem('vici_token',token);showChat();socket.emit('vici:join',{token:token})}
else{$('error').style.display='block';$('pw').value='';$('pw').focus()}
}).catch(function(){$('error').textContent='Verbindungsfehler!';$('error').style.display='block'});
}
function showChat(){$('login-screen').classList.remove('active');$('chat-screen').classList.add('active');setTimeout(function(){$('msginput').focus()},300)}
$('sendbtn').onclick=send;
$('msginput').onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
$('msginput').oninput=function(){var ta=$('msginput');ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,100)+'px';$('sendbtn').disabled=!ta.value.trim();socket.emit('vici:typing')};
function send(){var c=$('msginput').value.trim();if(!c)return;socket.emit('vici:message',{content:c});$('msginput').value='';$('msginput').style.height='auto';$('sendbtn').disabled=true}
function addMsg(m,anim){
addDate(m.created_at);
var d=document.createElement('div');
var sent=m.sender==='vici';
d.className='msg '+(sent?'sent':'recv');
if(!anim)d.style.animation='none';
var t=new Date(m.created_at).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
d.innerHTML='<div>'+esc(m.content)+'</div><div class="t">'+t+'</div>';
$('messages').appendChild(d);scr()
}
function addWelcome(){var d=document.createElement('div');d.className='welcome-msg';d.id='welcome';d.innerHTML='Yo Vici was geht ab \\u{1F60E} schreib mir ne Nachricht, ich antworte dir gleich! \\u{1F49C}<div class="wtime">Yaman</div>';$('messages').appendChild(d)}
function addDate(dt){var date=new Date(dt);var key=date.toDateString();if(lastDate===key)return;lastDate=key;var today=new Date();var y=new Date(today);y.setDate(y.getDate()-1);var label=date.toDateString()===today.toDateString()?'Heute':date.toDateString()===y.toDateString()?'Gestern':date.toLocaleDateString('de-DE');var d=document.createElement('div');d.className='date-sep';d.innerHTML='<span>'+label+'</span>';$('messages').appendChild(d)}
function scr(){setTimeout(function(){$('msgs-wrap').scrollTop=$('msgs-wrap').scrollHeight},50)}
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML.replace(/\\n/g,'<br>')}
socket.on('vici:history',function(d){$('messages').innerHTML='';lastDate=null;if(d.messages.length===0)addWelcome();d.messages.forEach(function(m){addMsg(m,false)});scr()});
socket.on('vici:message-sent',function(m){var w=document.getElementById('welcome');if(w)w.remove();addMsg(m,true)});
socket.on('vici:new-message',function(m){addMsg(m,true);$('typing').classList.remove('show');if(document.hidden)document.title='\\u{1F49C} Neue Nachricht von Yaman!'});
socket.on('vici:yaman-typing',function(){$('typing').classList.add('show');scr();clearTimeout(typTimer);typTimer=setTimeout(function(){$('typing').classList.remove('show')},3000)});
socket.on('connect',function(){if(token)socket.emit('vici:join',{token:token});$('statustxt').textContent='Online';$('statustxt').style.color='#4caf50'});
socket.on('disconnect',function(){$('statustxt').textContent='Offline...';$('statustxt').style.color='#ff6b81'});
document.addEventListener('visibilitychange',function(){if(!document.hidden)document.title='\\u{1F430} Vici & Yaman'});
})();
</script>
</body>
</html>`);
});

app.get('/admin', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>Yaman Admin</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👑</text></svg>">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a12;color:#fff;height:100vh;height:100dvh;overflow:hidden}
.screen{display:none;height:100vh;height:100dvh}.screen.active{display:flex}
.login-container{display:flex;align-items:center;justify-content:center;width:100%;background:linear-gradient(135deg,#0a0a0a,#1a1a2e,#16213e)}
.login-box{text-align:center;padding:40px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:24px;backdrop-filter:blur(20px);width:100%;max-width:400px;margin:20px}
.login-box .icon{font-size:60px;margin-bottom:15px}
.login-box h1{font-size:1.8rem;margin-bottom:8px;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.login-box p{color:#888;margin-bottom:30px}
.login-form{display:flex;flex-direction:column;gap:14px}
.login-form input{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:15px;font-size:1rem;color:#fff;outline:none;transition:all .3s;text-align:center}
.login-form input:focus{border-color:#764ba2;box-shadow:0 0 20px rgba(118,75,162,.2)}
.login-form input::placeholder{color:#555}
.login-form button{background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:14px;padding:15px;font-size:1.05rem;font-weight:600;color:#fff;cursor:pointer;transition:all .3s}
.login-form button:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(118,75,162,.4)}
.error-msg{color:#ff4757;font-size:.85rem;padding:10px;background:rgba(255,71,87,.1);border-radius:10px;display:none}
.admin-chat{display:flex;flex-direction:column;height:100vh;height:100dvh;width:100%;max-width:600px;margin:0 auto;background:#0a0a12}
.chat-header{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:rgba(15,15,25,.98);border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}
.h-left{display:flex;align-items:center;gap:12px}
.h-right{display:flex;align-items:center;gap:10px}
.avatar{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;position:relative;flex-shrink:0}
.av-vici{background:linear-gradient(135deg,#f093fb,#f5576c)}
.status-dot{position:absolute;bottom:0;right:0;width:11px;height:11px;border-radius:50%;background:#666;border:2px solid #0f0f19;transition:background .3s}
.status-dot.on{background:#4caf50}
.h-info h3{font-size:1rem;font-weight:700}
.h-info .status{font-size:.72rem;color:#888;font-weight:500;transition:color .3s}
.h-info .status.on{color:#4caf50}
.unread-badge{background:#f64f59;color:#fff;border-radius:12px;padding:2px 9px;font-size:.75rem;font-weight:700;display:none}
.logout-btn{background:rgba(255,255,255,.06);border:none;border-radius:10px;padding:7px 11px;font-size:1.1rem;cursor:pointer;transition:all .2s}
.logout-btn:hover{background:rgba(255,71,87,.15)}
.msgs-wrap{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;scroll-behavior:smooth;min-height:0}
.msgs-wrap::-webkit-scrollbar{width:3px}
.msgs-wrap::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}
#messages{display:flex;flex-direction:column;gap:5px}
.msg{max-width:78%;padding:9px 15px;border-radius:18px;font-size:.92rem;line-height:1.45;animation:fadeIn .3s ease;word-wrap:break-word}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.msg.from-v{align-self:flex-start;background:rgba(255,255,255,.07);color:#e0e0e0;border-bottom-left-radius:5px}
.msg.from-y{align-self:flex-end;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-bottom-right-radius:5px;margin-left:auto}
.msg .t{font-size:.6rem;color:rgba(255,255,255,.35);margin-top:3px}
.msg.from-y .t{text-align:right}
.date-sep{text-align:center;padding:12px 0}
.date-sep span{background:rgba(255,255,255,.06);color:#777;font-size:.7rem;padding:4px 12px;border-radius:8px}
.empty-chat{text-align:center;padding:60px 20px;color:#555}
.empty-chat .eicon{font-size:50px;margin-bottom:12px;opacity:.4}
.empty-chat p{font-size:.9rem}
.typing{display:none;align-items:center;gap:8px;padding:6px 0}
.typing.show{display:flex}
.typing .tav{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#f093fb,#f5576c);display:flex;align-items:center;justify-content:center;font-size:.8rem}
.typing .tbub{background:rgba(255,255,255,.07);border-radius:16px;padding:8px 14px}
.tdots{display:flex;gap:3px}
.tdots span{width:6px;height:6px;border-radius:50%;background:#999;animation:tdot 1.4s infinite}
.tdots span:nth-child(2){animation-delay:.2s}
.tdots span:nth-child(3){animation-delay:.4s}
@keyframes tdot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
.input-area{padding:8px 12px 14px;background:rgba(15,15,25,.98);border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}
.input-row{display:flex;align-items:flex-end;gap:8px;background:rgba(255,255,255,.05);border-radius:22px;padding:4px 4px 4px 16px;border:1px solid rgba(255,255,255,.08);transition:border-color .3s}
.input-row:focus-within{border-color:rgba(118,75,162,.4)}
.input-row textarea{flex:1;background:none;border:none;color:#fff;font-size:.92rem;padding:7px 0;resize:none;max-height:100px;outline:none;font-family:inherit;line-height:1.4}
.input-row textarea::placeholder{color:#555}
.send-btn{width:38px;height:38px;border-radius:50%;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s;flex-shrink:0;opacity:.4}
.send-btn:not(:disabled){opacity:1}
.send-btn:not(:disabled):hover{transform:scale(1.08)}
.send-btn svg{width:18px;height:18px}
</style>
</head>
<body>
<div id="login-screen" class="screen active">
<div class="login-container">
<div class="login-box">
<div class="icon">👑</div>
<h1>Yaman Admin</h1>
<p>Dein Messenger Dashboard</p>
<div class="login-form">
<input type="password" id="pw" placeholder="Admin Passwort..." autocomplete="off">
<button id="login-btn">Anmelden</button>
<div class="error-msg" id="error">Falsches Passwort!</div>
</div>
</div>
</div>
</div>
<div id="dash-screen" class="screen">
<div class="admin-chat">
<div class="chat-header">
<div class="h-left">
<div class="avatar av-vici">🐰<div class="status-dot" id="vdot"></div></div>
<div class="h-info"><h3>Vici 🐰</h3><span class="status" id="vstatus">Offline</span></div>
</div>
<div class="h-right">
<div class="unread-badge" id="ubadge"><span id="ucount">0</span></div>
<button class="logout-btn" id="logout-btn">🚪</button>
</div>
</div>
<div class="msgs-wrap" id="msgs-wrap">
<div id="messages"></div>
<div class="typing" id="typing">
<div class="tav">🐰</div>
<div class="tbub"><div class="tdots"><span></span><span></span><span></span></div></div>
</div>
</div>
<div class="input-area">
<div class="input-row">
<textarea id="msginput" placeholder="Antwort an Vici... 🐰" rows="1"></textarea>
<button class="send-btn" id="sendbtn" disabled><svg viewBox="0 0 24 24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/></svg></button>
</div>
</div>
</div>
</div>
<script src="/socket.io/socket.io.js"></script>
<script>
(function(){
var socket=io();
var $=function(id){return document.getElementById(id)};
var token=localStorage.getItem('yaman_token');
var lastDate=null;
var typTimer=null;
if(token){showDash();socket.emit('admin:join',{token:token})}
$('login-btn').onclick=login;
$('pw').onkeydown=function(e){if(e.key==='Enter')login()};
$('pw').oninput=function(){$('error').style.display='none'};
function login(){
var pw=$('pw').value;if(!pw)return;
fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}).then(function(r){return r.json()}).then(function(d){
if(d.success){token=d.token;localStorage.setItem('yaman_token',token);showDash();socket.emit('admin:join',{token:token})}
else{$('error').style.display='block';$('pw').value=''}
}).catch(function(){$('error').textContent='Verbindungsfehler!';$('error').style.display='block'});
}
function showDash(){$('login-screen').classList.remove('active');$('dash-screen').classList.add('active');setTimeout(function(){$('msginput').focus()},300)}
$('logout-btn').onclick=function(){localStorage.removeItem('yaman_token');location.reload()};
$('sendbtn').onclick=send;
$('msginput').onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
$('msginput').oninput=function(){var ta=$('msginput');ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,100)+'px';$('sendbtn').disabled=!ta.value.trim();socket.emit('admin:typing')};
function send(){var c=$('msginput').value.trim();if(!c)return;socket.emit('admin:message',{content:c});$('msginput').value='';$('msginput').style.height='auto';$('sendbtn').disabled=true}
function addMsg(m,anim){
addDate(m.created_at);var d=document.createElement('div');var isY=m.sender==='yaman';
d.className='msg '+(isY?'from-y':'from-v');if(!anim)d.style.animation='none';
var t=new Date(m.created_at).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
d.innerHTML='<div>'+esc(m.content)+'</div><div class="t">'+t+'</div>';
$('messages').appendChild(d);scr()
}
function addDate(dt){var date=new Date(dt);var key=date.toDateString();if(lastDate===key)return;lastDate=key;var today=new Date();var y=new Date(today);y.setDate(y.getDate()-1);var label=date.toDateString()===today.toDateString()?'Heute':date.toDateString()===y.toDateString()?'Gestern':date.toLocaleDateString('de-DE');var d=document.createElement('div');d.className='date-sep';d.innerHTML='<span>'+label+'</span>';$('messages').appendChild(d)}
function scr(){setTimeout(function(){$('msgs-wrap').scrollTop=$('msgs-wrap').scrollHeight},50)}
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML.replace(/\\n/g,'<br>')}
socket.on('admin:init',function(d){
$('messages').innerHTML='';lastDate=null;
if(d.messages.length===0){$('messages').innerHTML='<div class="empty-chat"><div class="eicon">🐰</div><p>Warte auf Nachrichten von Vici...</p></div>'}
else{d.messages.forEach(function(m){addMsg(m,false)})}
$('vdot').classList.toggle('on',d.viciOnline);$('vstatus').textContent=d.viciOnline?'Online':'Offline';$('vstatus').classList.toggle('on',d.viciOnline);scr()
});
socket.on('admin:new-message',function(m){var empty=$('messages').querySelector('.empty-chat');if(empty)empty.remove();addMsg(m,true);$('typing').classList.remove('show');socket.emit('admin:mark-read');if(document.hidden)document.title='\\u{1F430} Vici hat geschrieben!'});
socket.on('admin:message-sent',function(m){var empty=$('messages').querySelector('.empty-chat');if(empty)empty.remove();addMsg(m,true)});
socket.on('admin:vici-typing',function(){$('typing').classList.add('show');scr();clearTimeout(typTimer);typTimer=setTimeout(function(){$('typing').classList.remove('show')},3000)});
socket.on('admin:vici-status',function(d){$('vdot').classList.toggle('on',d.online);$('vstatus').textContent=d.online?'Online':'Offline';$('vstatus').classList.toggle('on',d.online)});
socket.on('admin:unread-update',function(d){if(d.count>0){$('ubadge').style.display='inline-block';$('ucount').textContent=d.count;document.title='('+d.count+') Yaman Admin'}else{$('ubadge').style.display='none';document.title='Yaman Admin'}});
socket.on('connect',function(){if(token)socket.emit('admin:join',{token:token})});
document.addEventListener('visibilitychange',function(){if(!document.hidden){document.title='Yaman Admin';socket.emit('admin:mark-read')}});
})();
</script>
</body>
</html>`);
});

let viciSocket = null;
const adminSockets = new Set();

io.on('connection', (socket) => {
  socket.on('vici:join', (data) => {
    if (data.token && data.token.startsWith('vici-')) {
      socket.userType = 'vici';
      viciSocket = socket;
      viciOnline = true;
      socket.emit('vici:history', { messages });
      adminSockets.forEach(a => a.emit('admin:vici-status', { online: true }));
    }
  });

  socket.on('vici:message', (data) => {
    if (socket.userType !== 'vici' || !data.content) return;
    var msg = { content: data.content.trim(), sender: 'vici', created_at: new Date().toISOString(), is_read: 0 };
    messages.push(msg);
    socket.emit('vici:message-sent', msg);
    var unread = messages.filter(function(m) { return m.sender === 'vici' && !m.is_read }).length;
    adminSockets.forEach(a => { a.emit('admin:new-message', msg); a.emit('admin:unread-update', { count: unread }) });
  });

  socket.on('vici:typing', () => { adminSockets.forEach(a => a.emit('admin:vici-typing')) });

  socket.on('admin:join', (data) => {
    if (data.token && data.token.startsWith('admin-')) {
      socket.userType = 'admin';
      adminSockets.add(socket);
      messages.forEach(m => { if (m.sender === 'vici') m.is_read = 1 });
      socket.emit('admin:init', { messages, viciOnline, unreadCount: 0 });
    }
  });

  socket.on('admin:message', (data) => {
    if (socket.userType !== 'admin' || !data.content) return;
    var msg = { content: data.content.trim(), sender: 'yaman', created_at: new Date().toISOString(), is_read: 0 };
    messages.push(msg);
    adminSockets.forEach(a => a.emit('admin:message-sent', msg));
    if (viciSocket && viciSocket.connected) viciSocket.emit('vici:new-message', msg);
  });

  socket.on('admin:typing', () => { if (viciSocket && viciSocket.connected) viciSocket.emit('vici:yaman-typing') });

  socket.on('admin:mark-read', () => {
    messages.forEach(m => { if (m.sender === 'vici') m.is_read = 1 });
    adminSockets.forEach(a => a.emit('admin:unread-update', { count: 0 }));
  });

  socket.on('disconnect', () => {
    if (socket.userType === 'admin') { adminSockets.delete(socket) }
    else if (socket.userType === 'vici') {
      viciSocket = null; viciOnline = false;
      adminSockets.forEach(a => a.emit('admin:vici-status', { online: false }));
    }
  });
});

server.listen(PORT, () => {
  console.log('Messenger laeuft auf Port ' + PORT);
});
