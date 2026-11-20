import * as THREE from 'three';

const $ = id => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07131a);
scene.fog = new THREE.FogExp2(0x6d8990, 0.0125);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, .1, 600);
const renderer = new THREE.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
$('game').appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xbde9ff, 0x17231f, 1.55); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xd8efff, 2.4); sun.position.set(-45, 50, 25); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); scene.add(sun);
const moon = new THREE.DirectionalLight(0x547fa0, .35); moon.position.set(30,25,-40); scene.add(moon);

const world = new THREE.Group(); scene.add(world);
const mat=(c,r=1,e=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,emissive:e?c:0,emissiveIntensity:e});
const water=new THREE.Mesh(new THREE.CircleGeometry(155,120),new THREE.MeshPhysicalMaterial({color:0x103c52,roughness:.15,metalness:.1,transparent:true,opacity:.9}));
water.rotation.x=-Math.PI/2; water.position.y=-.35; world.add(water);
const island=new THREE.Mesh(new THREE.CircleGeometry(105,120),mat(0x263f39)); island.rotation.x=-Math.PI/2; island.receiveShadow=true; world.add(island);

// Paths / clearings
const pathMat=mat(0x5d5646,1);
for(const [x,z,r] of [[0,0,10],[-22,-30,9],[30,24,8],[35,-28,7]]){
 const p=new THREE.Mesh(new THREE.CylinderGeometry(r,r,0.08,48),pathMat); p.position.set(x,.02,z); world.add(p);
}

function tree(x,z,s=1){
 const g=new THREE.Group();
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18*s,.30*s,2.5*s,9),mat(0x3a291f)); trunk.position.y=1.25*s;
 const c1=new THREE.Mesh(new THREE.ConeGeometry(1.45*s,3.6*s,9),mat(0x143a31)); c1.position.y=3.0*s;
 const c2=new THREE.Mesh(new THREE.ConeGeometry(1.0*s,2.5*s,9),mat(0x1d4b3d)); c2.position.y=4.1*s;
 [trunk,c1,c2].forEach(x=>x.castShadow=x.receiveShadow=true);g.add(trunk,c1,c2);g.position.set(x,0,z);world.add(g);
}
for(let i=0;i<95;i++){const a=Math.random()*Math.PI*2,r=14+Math.random()*78;tree(Math.cos(a)*r,Math.sin(a)*r,.7+Math.random()*.75)}
for(let i=0;i<45;i++){const a=Math.random()*Math.PI*2,r=8+Math.random()*82,q=new THREE.Mesh(new THREE.DodecahedronGeometry(.45+Math.random()*1.15,1),mat(0x4b5955));q.position.set(Math.cos(a)*r,.45,Math.sin(a)*r);q.scale.y=.45+Math.random();q.castShadow=true;world.add(q)}

function building(x,z,scale=1){
 const g=new THREE.Group();
 const base=new THREE.Mesh(new THREE.BoxGeometry(8,4.2,7),mat(0x35434a));base.position.y=2.1;
 const roof=new THREE.Mesh(new THREE.ConeGeometry(5.7,2.8,4),mat(0x1b292f));roof.position.y=5.6;roof.rotation.y=Math.PI/4;
 const door=new THREE.Mesh(new THREE.BoxGeometry(1.35,2.2,.25),mat(0x10171b));door.position.set(0,1.1,3.56);
 const light=new THREE.PointLight(0x9fe8ff,3,15);light.position.set(0,2.6,3.9);
 [base,roof,door].forEach(v=>v.castShadow=v.receiveShadow=true);g.add(base,roof,door,light);g.position.set(x,0,z);g.scale.setScalar(scale);world.add(g);return g;
}
const tower=building(-22,-30,1.15);
const hut=building(32,25,.7);

function character(color,skin=0xd3a786){
 const g=new THREE.Group();
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.98,6,14),mat(color,.65));body.position.y=1.15;
 const head=new THREE.Mesh(new THREE.SphereGeometry(.37,18,14),mat(skin,.8));head.position.y=2.03;
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.39,16,10,0,Math.PI*2,0,Math.PI*.55),mat(0x172027));hair.position.y=2.14;
 const scarf=new THREE.Mesh(new THREE.TorusGeometry(.4,.065,8,20),mat(0x9fe8ff,.4,.55));scarf.rotation.x=Math.PI/2;scarf.position.y=1.67;
 [body,head,hair,scarf].forEach(v=>v.castShadow=true);g.add(body,head,hair,scarf);return {g,body,head,hair,scarf};
}
const playerParts=character(0x286f93),player=playerParts.g; scene.add(player); player.position.set(0,0,13);
const npcParts=character(0x6b4d88),npc=npcParts.g; scene.add(npc);npc.position.set(0,0,0);

// Quest landmarks
const core = new THREE.Group(); core.position.set(-22,0,-30); scene.add(core);
const coreCrystal=new THREE.Mesh(new THREE.OctahedronGeometry(1.25),new THREE.MeshStandardMaterial({color:0x9feeff,emissive:0x43cfff,emissiveIntensity:2,roughness:.2,metalness:.1}));coreCrystal.position.y=3.2;core.add(coreCrystal);
const coreRing=new THREE.Mesh(new THREE.TorusGeometry(2.0,.09,12,48),new THREE.MeshBasicMaterial({color:0x9feeff,transparent:true,opacity:.7}));coreRing.rotation.x=Math.PI/2;coreRing.position.y=3.2;core.add(coreRing);

const marker=new THREE.Mesh(new THREE.TorusGeometry(.62,.08,10,28),new THREE.MeshBasicMaterial({color:0xa9edff}));marker.rotation.x=Math.PI/2;scene.add(marker);

// Enemy types
const enemies=[];
function enemy(x,z,type='guard'){
 const elite=type==='warden', eParts=character(elite?0x8f3d68:0x4d6670,elite?0x9a7067:0x8d6c62);
 eParts.g.position.set(x,0,z); const ring=new THREE.Mesh(new THREE.TorusGeometry(.55,.06,8,18),new THREE.MeshBasicMaterial({color:elite?0xffa7d4:0x8ce8ff}));ring.rotation.x=Math.PI/2;ring.position.y=.05;eParts.g.add(ring);
 const e={...eParts,g:eParts.g,hp:elite?180:60,max:elite?180:60,elite,dead:false,attackCd:0,hitFlash:0};enemies.push(e);scene.add(e.g);return e;
}
enemy(14,-12);enemy(-17,10);enemy(26,21);enemy(-34,-2,'warden');
let boss=null;

// Particles / fireflies
const particles=new THREE.Group();scene.add(particles);
for(let i=0;i<180;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.02+Math.random()*.055,6,6),new THREE.MeshBasicMaterial({color:0xbdefff,transparent:true,opacity:.45+Math.random()*.3}));p.position.set((Math.random()-.5)*125,.8+Math.random()*12,(Math.random()-.5)*125);particles.add(p)}

// Game state
let hp=100, stamina=100, quest=0, gameStarted=false, paused=false, dialogOpen=false, combo=0, comboTimer=0, bossSpawned=false;
const quests=["Ada Bekçisi'ni bul","Eski kuleye git","Koruyucuları yen","Işık Çekirdeği'ni uyandır","Sis Kapısı'na ulaş","Kayıp Işık'ın kaynağını bul"];
function setQuest(n){quest=n;$('quest').textContent=quests[n]||quests.at(-1);save()}
function bars(){$('hp').style.width=Math.max(0,hp)+'%';$('stamina').style.width=Math.max(0,stamina)+'%'}
function flash(s){$('message').textContent=s;$('message').style.opacity=1;clearTimeout(flash.t);flash.t=setTimeout(()=>$('message').style.opacity=0,1700)}
function save(){if(!gameStarted)return;localStorage.setItem('sisadasi-v2',JSON.stringify({x:player.position.x,z:player.position.z,hp,stamina,quest}))}
function load(){try{return JSON.parse(localStorage.getItem('sisadasi-v2'))}catch{return null}}
function reset(){localStorage.removeItem('sisadasi-v2');location.reload()}

function dialog(lines){
 dialogOpen=true;$('dialog').classList.remove('hidden');$('speaker').textContent=lines[0][0];$('dialogText').textContent=lines[0][1];$('choices').innerHTML='';$('dialogNext').style.display='block';let i=0;
 $('dialogNext').onclick=()=>{i++;if(i>=lines.length){closeDialog();return}$('speaker').textContent=lines[i][0];$('dialogText').textContent=lines[i][1]};
}
function closeDialog(){$('dialog').classList.add('hidden');dialogOpen=false}
function interact(){
 if(player.position.distanceTo(npc.position)<4&&quest===0){dialog([["Ada Bekçisi","Uyandın... Bu iyi bir şey. Sis seni de çağırmış demek."],["Ada Bekçisi","Merkezdeki eski kulede Işık Çekirdeği var. Onu uyandırırsan adanın kapıları açılabilir."],["Ada Bekçisi","Ama Koruyucular yolu tutuyor. Hazır ol."]]);setQuest(1);return}
 if(quest===1&&player.position.distanceTo(tower.position)<13){dialog([["Kule","Kapı kilitli. Çekirdeğe ulaşmak için Koruyucuların mühürlerini kırmalısın."]]);setQuest(2);return}
 if(quest===3&&player.position.distanceTo(tower.position)<13){coreCrystal.material.emissiveIntensity=4;flash('Işık Çekirdeği uyandı!');setQuest(4);return}
 if(quest===4&&player.position.distanceTo(hut.position)<11){dialog([["Sis Kapısı","Uzakta bir ışık... ama bu, adanın ışığı değil."],["Bilinmeyen Ses","Beni bulursan neden burada olduğunu öğreneceksin."]]);setQuest(5);return}
}

function effectRing(color=0xbfefff,size=2){const r=new THREE.Mesh(new THREE.RingGeometry(.25,size,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.65,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.copy(player.position);r.position.y=.08;scene.add(r);const s=performance.now();(function a(t){const k=Math.min(1,(t-s)/320);r.scale.setScalar(1+k*1.8);r.material.opacity=.65*(1-k);if(k<1)requestAnimationFrame(a);else scene.remove(r)})(s)}
function hitEnemy(e,amount){e.hp-=amount;e.hitFlash=.12;e.g.scale.setScalar(1.1);setTimeout(()=>!e.dead&&e.g.scale.setScalar(1),75);if(e.hp<=0){e.dead=true;e.g.visible=false;flash(e.elite?'Koruyucu düştü!':'Koruyucu yenildi!');if(enemies.filter(v=>!v.dead).length===0&&quest===2)setQuest(3)}}
function attack(){
 if(!gameStarted||paused||dialogOpen||stamina<12)return;stamina-=12;comboTimer=.7;combo=Math.min(3,combo+1);const damage=[32,45,68][combo-1];
 const forward=new THREE.Vector3(Math.sin(player.rotation.y),0,Math.cos(player.rotation.y));let best=null,bd=3.4;
 for(const e of enemies)if(!e.dead){const d=player.position.distanceTo(e.g.position);if(d<bd){const v=e.g.position.clone().sub(player.position).normalize();if(v.dot(forward)>.0){best=e;bd=d}}}
 if(best)hitEnemy(best,damage);effectRing(combo===3?0xffe6a5:0xbfefff,combo===3?2.7:1.6);if(combo===3)flash('Güçlü vuruş!');
}
function ability(){if(!gameStarted||paused||dialogOpen||stamina<35)return;stamina-=35;effectRing(0xa6eaff,7);enemies.forEach(e=>{if(!e.dead&&player.position.distanceTo(e.g.position)<7)hitEnemy(e,e.elite?42:55)});flash('SİS DARBESİ')}

function spawnBoss(){if(bossSpawned)return;bossSpawned=true;boss=enemy(40,-18,'warden');boss.hp=boss.max=420;boss.elite=true;boss.g.scale.setScalar(1.65);flash('Büyük Koruyucu ortaya çıktı!')}
function enemyAI(dt){
 for(const e of enemies)if(!e.dead){e.attackCd-=dt;if(e.hitFlash>0){e.hitFlash-=dt;e.body.material.emissive.setHex(0x884455)}else e.body.material.emissive.setHex(0x000000);const d=e.g.position.distanceTo(player.position);if(d<20){const v=player.position.clone().sub(e.g.position).normalize();e.g.position.addScaledVector(v,(e.elite?1.15:.72)*dt);e.g.lookAt(player.position.x,e.g.position.y,player.position.z)}if(d<2.2&&e.attackCd<=0){hp=Math.max(0,hp-(e.elite?14:7));e.attackCd=e.elite?.9:1.35;bars();if(hp<=0){hp=100;player.position.set(0,0,13);flash('Sis seni başlangıç noktasına geri itti.')}}}
}

// Input
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key==='Escape')pauseToggle();if(e.key.toLowerCase()==='e')interact();if(e.key===' ')attack()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let stick={x:0,y:0,active:false};const se=$('stick'),kn=$('knob');
function stickMove(e){const r=se.getBoundingClientRect();let x=(e.clientX-(r.left+r.width/2))/42,y=(e.clientY-(r.top+r.height/2))/42,l=Math.hypot(x,y);if(l>1){x/=l;y/=l}stick.x=x;stick.y=y;kn.style.transform=`translate(${x*30}px,${y*30}px)`}
se.addEventListener('pointerdown',e=>{stick.active=true;se.setPointerCapture(e.pointerId);stickMove(e)});se.addEventListener('pointermove',e=>{if(stick.active)stickMove(e)});se.addEventListener('pointerup',()=>{stick.active=false;stick.x=stick.y=0;kn.style.transform='translate(0,0)'});
$('attack').onclick=attack;$('ability').onclick=ability;$('jump').onclick=()=>{if(stamina>8){stamina-=8;player.position.y=.75;setTimeout(()=>player.position.y=0,180)}};
function pauseToggle(){if(!gameStarted)return;paused=!paused;$('pause').classList.toggle('hidden',!paused)}
$('resume').onclick=pauseToggle;$('save').onclick=()=>{save();flash('Oyun kaydedildi.');pauseToggle()};$('restart').onclick=reset;
$('start').onclick=()=>{gameStarted=true;$('menu').classList.add('hidden');$('hud').classList.remove('hidden');setQuest(0);bars();flash('Sis Adası seni bekliyor.')};
$('continue').onclick=()=>{const s=load();gameStarted=true;$('menu').classList.add('hidden');$('hud').classList.remove('hidden');if(s){player.position.set(s.x,0,s.z);hp=s.hp;stamina=s.stamina;setQuest(s.quest)}else setQuest(0);bars();flash('Kayıt yüklendi.')};

const clock=new THREE.Clock();let walk=0;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
 if(gameStarted&&!paused&&!dialogOpen){let x=(keys.d?1:0)-(keys.a?1:0)+stick.x,z=(keys.s?1:0)-(keys.w?1:0)+stick.y,l=Math.hypot(x,z);if(l>1){x/=l;z/=l}const sprint=keys.shift&&stamina>0;const speed=sprint?7.1:4.7;if(Math.hypot(x,z)>.05){player.position.x+=x*speed*dt;player.position.z+=z*speed*dt;player.rotation.y=Math.atan2(x,z);walk+=dt*(sprint?14:9);playerParts.body.position.y=1.15+Math.sin(walk)*.065;if(sprint)stamina=Math.max(0,stamina-dt*18)}else stamina=Math.min(100,stamina+dt*10);player.position.x=THREE.MathUtils.clamp(player.position.x,-92,92);player.position.z=THREE.MathUtils.clamp(player.position.z,-92,92);if(comboTimer>0)comboTimer-=dt;else combo=0;enemyAI(dt);bars();save();
   if(quest===3&&player.position.distanceTo(tower.position)<13){} if(quest===4&&player.position.distanceTo(hut.position)<11){} if(quest===5&&!bossSpawned&&player.position.distanceTo(new THREE.Vector3(40,0,-18))<25)spawnBoss();
 }
 marker.position.set((quest===0?npc.position.x:quest<4?tower.position.x:hut.position.x),3.4+Math.sin(t*2)*.18,(quest===0?npc.position.z:quest<4?tower.position.z:hut.position.z));marker.rotation.z=t*1.5;
 coreCrystal.rotation.y=t*.7;coreRing.rotation.z=t*.9;particles.rotation.y=t*.01;npc.rotation.y=Math.sin(t*.7)*.25;
 const off=new THREE.Vector3(0,4.0,8.2).applyAxisAngle(new THREE.Vector3(0,1,0),player.rotation.y);const desired=player.position.clone().add(off);camera.position.lerp(desired,1-Math.pow(.001,dt));camera.lookAt(player.position.x,player.position.y+1.5,player.position.z);
 const nearNpc=player.position.distanceTo(npc.position)<4;const nearTower=player.position.distanceTo(tower.position)<13;const nearHut=player.position.distanceTo(hut.position)<11;$('interaction').classList.toggle('hidden',dialogOpen||paused||!(nearNpc||nearTower||nearHut));$('interaction').textContent=nearNpc?'E — Konuş':'E — Etkileş';
 renderer.render(scene,camera);
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});bars();animate();

