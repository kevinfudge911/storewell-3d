(()=>{var ko=()=>{};var Yi={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};var p=function(n,e){if(!n)throw We(e)},We=function(n){return new Error("Firebase Database ("+Yi.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};var Ro=function(n){let e=[],t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Xl=function(n){let e=[],t=0,i=0;for(;t<n.length;){let s=n[t++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){let r=n[t++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){let r=n[t++],o=n[t++],a=n[t++],c=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[i++]=String.fromCharCode(55296+(c>>10)),e[i++]=String.fromCharCode(56320+(c&1023))}else{let r=n[t++],o=n[t++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Cn={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<n.length;s+=3){let r=n[s],o=s+1<n.length,a=o?n[s+1]:0,c=s+2<n.length,l=c?n[s+2]:0,d=r>>2,u=(r&3)<<4|a>>4,h=(a&15)<<2|l>>6,g=l&63;c||(g=64,o||(h=64)),i.push(t[d],t[u],t[h],t[g])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Ro(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Xl(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<n.length;){let r=t[n.charAt(s++)],a=s<n.length?t[n.charAt(s)]:0;++s;let l=s<n.length?t[n.charAt(s)]:64;++s;let u=s<n.length?t[n.charAt(s)]:64;if(++s,r==null||a==null||l==null||u==null)throw new Ji;let h=r<<2|a>>4;if(i.push(h),l!==64){let g=a<<4&240|l>>2;if(i.push(g),u!==64){let m=l<<6&192|u;i.push(m)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},Ji=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},Qi=function(n){let e=Ro(n);return Cn.encodeByteArray(e,!0)},Nt=function(n){return Qi(n).replace(/\./g,"")},ot=function(n){try{return Cn.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function No(n){return Po(void 0,n)}function Po(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:let t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(let t in e)!e.hasOwnProperty(t)||!Ql(t)||(n[t]=Po(n[t],e[t]));return n}function Ql(n){return n!=="__proto__"}function Zl(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var ed=()=>Zl().__FIREBASE_DEFAULTS__,td=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},nd=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&ot(n[1]);return e&&JSON.parse(e)},Zi=()=>{try{return ko()||ed()||td()||nd()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},es=n=>Zi()?.emulatorHosts?.[n],Oo=n=>{let e=es(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},ts=()=>Zi()?.config,ns=n=>Zi()?.[`_${n}`];var z=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}};function Do(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},i=e||"demo-project",s=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let o={iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Nt(JSON.stringify(t)),Nt(JSON.stringify(o)),""].join(".")}function H(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Pt(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(H())}function Lo(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Mo(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Sn(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Fo(){let n=H();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function ue(){return Yi.NODE_CLIENT===!0||Yi.NODE_ADMIN===!0}function Uo(){try{return typeof indexedDB=="object"}catch{return!1}}function Wo(){return new Promise((n,e)=>{try{let t=!0,i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}var id="FirebaseError",ie=class n extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=id,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_e.prototype.create)}},_e=class{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){let i=t[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?sd(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new ie(s,a,i)}};function sd(n,e){return n.replace(rd,(t,i)=>{let s=e[i];return s!=null?String(s):`<${i}?>`})}var rd=/\{\$([^}]+)}/g;function at(n){return JSON.parse(n)}function F(n){return JSON.stringify(n)}var Bo=function(n){let e={},t={},i={},s="";try{let r=n.split(".");e=at(ot(r[0])||""),t=at(ot(r[1])||""),s=r[2],i=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:i,signature:s}};var Vo=function(n){let e=Bo(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},zo=function(n){let e=Bo(n).claims;return typeof e=="object"&&e.admin===!0};function se(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Be(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function ct(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ot(n,e,t){let i={};for(let s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=e.call(t,n[s],s,n));return i}function he(n,e){if(n===e)return!0;let t=Object.keys(n),i=Object.keys(e);for(let s of t){if(!i.includes(s))return!1;let r=n[s],o=e[s];if(Ao(r)&&Ao(o)){if(!he(r,o))return!1}else if(r!==o)return!1}for(let s of i)if(!t.includes(s))return!1;return!0}function Ao(n){return n!==null&&typeof n=="object"}function Se(n){let e=[];for(let[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function lt(n){let e={};return n.replace(/^\?/,"").split("&").forEach(i=>{if(i){let[s,r]=i.split("=");e[decodeURIComponent(s)]=decodeURIComponent(r)}}),e}function dt(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}var Tn=class{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);let i=this.W_;if(typeof e=="string")for(let u=0;u<16;u++)i[u]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let u=0;u<16;u++)i[u]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let u=16;u<80;u++){let h=i[u-3]^i[u-8]^i[u-14]^i[u-16];i[u]=(h<<1|h>>>31)&4294967295}let s=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],c=this.chain_[4],l,d;for(let u=0;u<80;u++){u<40?u<20?(l=a^r&(o^a),d=1518500249):(l=r^o^a,d=1859775393):u<60?(l=r&o|a&(r|o),d=2400959708):(l=r^o^a,d=3395469782);let h=(s<<5|s>>>27)+l+c+d+i[u]&4294967295;c=a,a=o,o=(r<<30|r>>>2)&4294967295,r=s,s=h}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);let i=t-this.blockSize,s=0,r=this.buf_,o=this.inbuf_;for(;s<t;){if(o===0)for(;s<=i;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<t;)if(r[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}else for(;s<t;)if(r[o]=e[s],++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){let e=[],t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=t&255,t/=256;this.compress_(this.buf_);let i=0;for(let s=0;s<5;s++)for(let r=24;r>=0;r-=8)e[i]=this.chain_[s]>>r&255,++i;return e}};function Ho(n,e){let t=new Xi(n,e);return t.subscribe.bind(t)}var Xi=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let s;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");od(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:i},s.next===void 0&&(s.next=Ki),s.error===void 0&&(s.error=Ki),s.complete===void 0&&(s.complete=Ki);let r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function od(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Ki(){}function Ve(n,e){return`${n} failed: ${e} argument `}var $o=function(n){let e=[],t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);if(s>=55296&&s<=56319){let r=s-55296;i++,p(i<n.length,"Surrogate pair missing trail surrogate.");let o=n.charCodeAt(i)-56320;s=65536+(r<<10)+o}s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):s<65536?(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Dt=function(n){let e=0;for(let t=0;t<n.length;t++){let i=n.charCodeAt(t);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,t++):e+=3}return e};var Gm=4*60*60*1e3;function $(n){return n&&n._delegate?n._delegate:n}function ze(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function xn(n){return(await fetch(n,{credentials:"include"})).ok}var Z=class{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var He="[DEFAULT]";var kn=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let i=new z;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{let s=this.getOrInitializeService({instanceIdentifier:t});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),i=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(cd(e))try{this.getOrInitializeService({instanceIdentifier:He})}catch{}for(let[t,i]of this.instancesDeferred.entries()){let s=this.normalizeInstanceIdentifier(t);try{let r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=He){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=He){return this.instances.has(e)}getOptions(e=He){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let s=this.getOrInitializeService({instanceIdentifier:i,options:t});for(let[r,o]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(e,t){let i=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(i)??new Set;s.add(e),this.onInitCallbacks.set(i,s);let r=this.instances.get(i);return r&&e(r,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){let i=this.onInitCallbacks.get(t);if(i)for(let s of i)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:ad(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=He){return this.component?this.component.multipleInstances?e:He:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function ad(n){return n===He?void 0:n}function cd(n){return n.instantiationMode==="EAGER"}var Lt=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new kn(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};var ld=[],R;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(R||(R={}));var dd={debug:R.DEBUG,verbose:R.VERBOSE,info:R.INFO,warn:R.WARN,error:R.ERROR,silent:R.SILENT},ud=R.INFO,hd={[R.DEBUG]:"log",[R.VERBOSE]:"log",[R.INFO]:"info",[R.WARN]:"warn",[R.ERROR]:"error"},fd=(n,e,...t)=>{if(e<n.logLevel)return;let i=new Date().toISOString(),s=hd[e];if(s)console[s](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},xe=class{constructor(e){this.name=e,this._logLevel=ud,this._logHandler=fd,this._userLogHandler=null,ld.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in R))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?dd[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,R.DEBUG,...e),this._logHandler(this,R.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,R.VERBOSE,...e),this._logHandler(this,R.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,R.INFO,...e),this._logHandler(this,R.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,R.WARN,...e),this._logHandler(this,R.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,R.ERROR,...e),this._logHandler(this,R.ERROR,...e)}};var pd=(n,e)=>e.some(t=>n instanceof t),jo,qo;function md(){return jo||(jo=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function gd(){return qo||(qo=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Go=new WeakMap,ss=new WeakMap,Ko=new WeakMap,is=new WeakMap,os=new WeakMap;function _d(n){let e=new Promise((t,i)=>{let s=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(fe(n.result)),s()},o=()=>{i(n.error),s()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Go.set(t,n)}).catch(()=>{}),os.set(e,n),e}function yd(n){if(ss.has(n))return;let e=new Promise((t,i)=>{let s=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),s()},o=()=>{i(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});ss.set(n,e)}var rs={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return ss.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ko.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return fe(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Yo(n){rs=n(rs)}function wd(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let i=n.call(An(this),e,...t);return Ko.set(i,e.sort?e.sort():[e]),fe(i)}:gd().includes(n)?function(...e){return n.apply(An(this),e),fe(Go.get(this))}:function(...e){return fe(n.apply(An(this),e))}}function vd(n){return typeof n=="function"?wd(n):(n instanceof IDBTransaction&&yd(n),pd(n,md())?new Proxy(n,rs):n)}function fe(n){if(n instanceof IDBRequest)return _d(n);if(is.has(n))return is.get(n);let e=vd(n);return e!==n&&(is.set(n,e),os.set(e,n)),e}var An=n=>os.get(n);function Xo(n,e,{blocked:t,upgrade:i,blocking:s,terminated:r}={}){let o=indexedDB.open(n,e),a=fe(o);return i&&o.addEventListener("upgradeneeded",c=>{i(fe(o.result),c.oldVersion,c.newVersion,fe(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),a.then(c=>{r&&c.addEventListener("close",()=>r()),s&&c.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),a}var bd=["get","getKey","getAll","getAllKeys","count"],Id=["put","add","delete","clear"],as=new Map;function Jo(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(as.get(e))return as.get(e);let t=e.replace(/FromIndex$/,""),i=e!==t,s=Id.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(s||bd.includes(t)))return;let r=async function(o,...a){let c=this.transaction(o,s?"readwrite":"readonly"),l=c.store;return i&&(l=l.index(a.shift())),(await Promise.all([l[t](...a),s&&c.done]))[0]};return as.set(e,r),r}Yo(n=>({...n,get:(e,t,i)=>Jo(e,t)||n.get(e,t,i),has:(e,t)=>!!Jo(e,t)||n.has(e,t)}));var ls=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Ed(t)){let i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}};function Ed(n){return n.getComponent()?.type==="VERSION"}var ds="@firebase/app",Qo="0.15.0";var ye=new xe("@firebase/app"),Td="@firebase/app-compat",Cd="@firebase/analytics-compat",Sd="@firebase/analytics",xd="@firebase/app-check-compat",kd="@firebase/app-check",Ad="@firebase/auth",Rd="@firebase/auth-compat",Nd="@firebase/database",Pd="@firebase/data-connect",Od="@firebase/database-compat",Dd="@firebase/functions",Ld="@firebase/functions-compat",Md="@firebase/installations",Fd="@firebase/installations-compat",Ud="@firebase/messaging",Wd="@firebase/messaging-compat",Bd="@firebase/performance",Vd="@firebase/performance-compat",zd="@firebase/remote-config",Hd="@firebase/remote-config-compat",$d="@firebase/storage",jd="@firebase/storage-compat",qd="@firebase/firestore",Gd="@firebase/ai",Kd="@firebase/firestore-compat",Yd="firebase",Jd="12.15.0";var us="[DEFAULT]",Xd={[ds]:"fire-core",[Td]:"fire-core-compat",[Sd]:"fire-analytics",[Cd]:"fire-analytics-compat",[kd]:"fire-app-check",[xd]:"fire-app-check-compat",[Ad]:"fire-auth",[Rd]:"fire-auth-compat",[Nd]:"fire-rtdb",[Pd]:"fire-data-connect",[Od]:"fire-rtdb-compat",[Dd]:"fire-fn",[Ld]:"fire-fn-compat",[Md]:"fire-iid",[Fd]:"fire-iid-compat",[Ud]:"fire-fcm",[Wd]:"fire-fcm-compat",[Bd]:"fire-perf",[Vd]:"fire-perf-compat",[zd]:"fire-rc",[Hd]:"fire-rc-compat",[$d]:"fire-gcs",[jd]:"fire-gcs-compat",[qd]:"fire-fst",[Kd]:"fire-fst-compat",[Gd]:"fire-vertex","fire-js":"fire-js",[Yd]:"fire-js-all"};var Rn=new Map,Qd=new Map,hs=new Map;function Zo(n,e){try{n.container.addComponent(e)}catch(t){ye.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ae(n){let e=n.name;if(hs.has(e))return ye.debug(`There were multiple attempts to register component ${e}.`),!1;hs.set(e,n);for(let t of Rn.values())Zo(t,n);for(let t of Qd.values())Zo(t,n);return!0}function Ft(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function ee(n){return n==null?!1:n.settings!==void 0}var Zd={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ke=new _e("app","Firebase",Zd);var fs=class{constructor(e,t,i){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Z("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ke.create("app-deleted",{appName:this._name})}};var Re=Jd;function gs(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let i={name:us,automaticDataCollectionEnabled:!0,...e},s=i.name;if(typeof s!="string"||!s)throw ke.create("bad-app-name",{appName:String(s)});if(t||(t=ts()),!t)throw ke.create("no-options");let r=Rn.get(s);if(r){if(he(t,r.options)&&he(i,r.config))return r;throw ke.create("duplicate-app",{appName:s})}let o=new Lt(s);for(let c of hs.values())o.addComponent(c);let a=new fs(t,i,o);return Rn.set(s,a),a}function Nn(n=us){let e=Rn.get(n);if(!e&&n===us&&ts())return gs();if(!e)throw ke.create("no-app",{appName:n});return e}function re(n,e,t){let i=Xd[n]??n;t&&(i+=`-${t}`);let s=i.match(/\s|\//),r=e.match(/\s|\//);if(s||r){let o=[`Unable to register library "${i}" with version "${e}":`];s&&o.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&r&&o.push("and"),r&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ye.warn(o.join(" "));return}Ae(new Z(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}var eu="firebase-heartbeat-database",tu=1,Mt="firebase-heartbeat-store",cs=null;function ia(){return cs||(cs=Xo(eu,tu,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Mt)}catch(t){console.warn(t)}}}}).catch(n=>{throw ke.create("idb-open",{originalErrorMessage:n.message})})),cs}async function nu(n){try{let t=(await ia()).transaction(Mt),i=await t.objectStore(Mt).get(sa(n));return await t.done,i}catch(e){if(e instanceof ie)ye.warn(e.message);else{let t=ke.create("idb-get",{originalErrorMessage:e?.message});ye.warn(t.message)}}}async function ea(n,e){try{let i=(await ia()).transaction(Mt,"readwrite");await i.objectStore(Mt).put(e,sa(n)),await i.done}catch(t){if(t instanceof ie)ye.warn(t.message);else{let i=ke.create("idb-set",{originalErrorMessage:t?.message});ye.warn(i.message)}}}function sa(n){return`${n.name}!${n.options.appId}`}var iu=1024,su=30,ps=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new ms(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){try{let t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=ta();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(s=>s.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:t}),this._heartbeatsCache.heartbeats.length>su){let s=ou(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){ye.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=ta(),{heartbeatsToSend:t,unsentEntries:i}=ru(this._heartbeatsCache.heartbeats),s=Nt(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return ye.warn(e),""}}};function ta(){return new Date().toISOString().substring(0,10)}function ru(n,e=iu){let t=[],i=n.slice();for(let s of n){let r=t.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),na(t)>e){r.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),na(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}var ms=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Uo()?Wo().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await nu(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let i=await this.read();return ea(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let i=await this.read();return ea(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}};function na(n){return Nt(JSON.stringify({version:2,heartbeats:n})).length}function ou(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let i=1;i<n.length;i++)n[i].date<t&&(t=n[i].date,e=i);return e}function au(n){Ae(new Z("platform-logger",e=>new ls(e),"PRIVATE")),Ae(new Z("heartbeat",e=>new ps(e),"PRIVATE")),re(ds,Qo,n),re(ds,Qo,"esm2020"),re("fire-js","")}au("");var cu="firebase",lu="12.15.0";re(cu,lu,"app");var ra="@firebase/database",oa="1.1.3";var Tr="";function du(n){Tr=n}var Ts=class{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),F(t))}get(e){let t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:at(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}};var Cs=class{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return se(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}};var Ba=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){let e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Ts(e)}}catch{}return new Cs},je=Ba("localStorage"),Ss=Ba("sessionStorage");var ft=new xe("@firebase/database"),uu=function(){let n=1;return function(){return n++}}(),Va=function(n){let e=$o(n),t=new Tn;t.update(e);let i=t.digest();return Cn.encodeByteArray(i)},Zt=function(...n){let e="";for(let t=0;t<n.length;t++){let i=n[t];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=Zt.apply(null,i):typeof i=="object"?e+=F(i):e+=i,e+=" "}return e},Ge=null,aa=!0,hu=function(n,e){p(!e||n===!0||n===!1,"Can't turn on custom loggers persistently."),n===!0?(ft.logLevel=R.VERBOSE,Ge=ft.log.bind(ft),e&&Ss.set("logging_enabled",!0)):typeof n=="function"?Ge=n:(Ge=null,Ss.remove("logging_enabled"))},U=function(...n){if(aa===!0&&(aa=!1,Ge===null&&Ss.get("logging_enabled")===!0&&hu(!0)),Ge){let e=Zt.apply(null,n);Ge(e)}},en=function(n){return function(...e){U(n,...e)}},xs=function(...n){let e="FIREBASE INTERNAL ERROR: "+Zt(...n);ft.error(e)},ve=function(...n){let e=`FIREBASE FATAL ERROR: ${Zt(...n)}`;throw ft.error(e),new Error(e)},G=function(...n){let e="FIREBASE WARNING: "+Zt(...n);ft.warn(e)},fu=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&G("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},ni=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},pu=function(n){if(ue()||document.readyState==="complete")n();else{let e=!1,t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},gt="[MIN_NAME]",Ke="[MAX_NAME]",Xe=function(n,e){if(n===e)return 0;if(n===gt||e===Ke)return-1;if(e===gt||n===Ke)return 1;{let t=ca(n),i=ca(e);return t!==null?i!==null?t-i===0?n.length-e.length:t-i:-1:i!==null?1:n<e?-1:1}},mu=function(n,e){return n===e?0:n<e?-1:1},Ut=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+F(e))},Cr=function(n){if(typeof n!="object"||n===null)return F(n);let e=[];for(let i in n)e.push(i);e.sort();let t="{";for(let i=0;i<e.length;i++)i!==0&&(t+=","),t+=F(e[i]),t+=":",t+=Cr(n[e[i]]);return t+="}",t},za=function(n,e){let t=n.length;if(t<=e)return[n];let i=[];for(let s=0;s<t;s+=e)s+e>t?i.push(n.substring(s,t)):i.push(n.substring(s,s+e));return i};function W(n,e){for(let t in n)n.hasOwnProperty(t)&&e(t,n[t])}var Ha=function(n){p(!ni(n),"Invalid JSON number");let e=11,t=52,i=(1<<e-1)-1,s,r,o,a,c;n===0?(r=0,o=0,s=1/n===-1/0?1:0):(s=n<0,n=Math.abs(n),n>=Math.pow(2,1-i)?(a=Math.min(Math.floor(Math.log(n)/Math.LN2),i),r=a+i,o=Math.round(n*Math.pow(2,t-a)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-i-t))));let l=[];for(c=t;c;c-=1)l.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)l.push(r%2?1:0),r=Math.floor(r/2);l.push(s?1:0),l.reverse();let d=l.join(""),u="";for(c=0;c<64;c+=8){let h=parseInt(d.substr(c,8),2).toString(16);h.length===1&&(h="0"+h),u=u+h}return u.toLowerCase()},gu=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},_u=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function yu(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");let i=new Error(n+" at "+e._path.toString()+": "+t);return i.code=n.toUpperCase(),i}var wu=new RegExp("^-?(0*)\\d{1,10}$"),vu=-2147483648,bu=2147483647,ca=function(n){if(wu.test(n)){let e=Number(n);if(e>=vu&&e<=bu)return e}return null},Tt=function(n){try{n()}catch(e){setTimeout(()=>{let t=e.stack||"";throw G("Exception was thrown by user callback.",t),e},Math.floor(0))}},Iu=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},zt=function(n,e){let t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};var ks=class{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,ee(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t?.getImmediate({optional:!0}),this.appCheck||t?.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.appCheckProvider?.get().then(t=>t.addTokenListener(e))}notifyForInvalidToken(){G(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}};var As=class{constructor(e,t,i){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(U("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',G(e)}},Pe=class{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}};Pe.OWNER="owner";var On="5",$a="v",ja="s",qa="r",Ga="f",Ka=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Ya="ls",Ja="p",Rs="ac",Xa="websocket",Qa="long_polling";var Dn=class{constructor(e,t,i,s,r=!1,o="",a=!1,c=!1,l=null){this.secure=t,this.namespace=i,this.webSocketOnly=s,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=c,this.emulatorOptions=l,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=je.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&je.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){let e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}};function Eu(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function Za(n,e,t){p(typeof e=="string","typeof type must == string"),p(typeof t=="object","typeof params must == object");let i;if(e===Xa)i=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Qa)i=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);Eu(n)&&(t.ns=n.namespace);let s=[];return W(t,(r,o)=>{s.push(r+"="+o)}),i+s.join("&")}var Ns=class{constructor(){this.counters_={}}incrementCounter(e,t=1){se(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return No(this.counters_)}};var _s={},ys={};function Sr(n){let e=n.toString();return _s[e]||(_s[e]=new Ns),_s[e]}function Tu(n,e){let t=n.toString();return ys[t]||(ys[t]=e()),ys[t]}var Ps=class{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){let i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<i.length;++s)i[s]&&Tt(()=>{this.onMessage_(i[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}};var la="start",Cu="close",Su="pLPCommand",xu="pRTLPCB",ec="id",tc="pw",nc="ser",ku="cb",Au="seg",Ru="ts",Nu="d",Pu="dframe",ic=1870,sc=30,Ou=ic-sc,Du=25e3,Lu=3e4,Os=class n{constructor(e,t,i,s,r,o,a){this.connId=e,this.repoInfo=t,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=en(e),this.stats_=Sr(t),this.urlFn=c=>(this.appCheckToken&&(c[Rs]=this.appCheckToken),Za(t,Qa,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new Ps(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(Lu)),pu(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Ds((...r)=>{let[o,a,c,l,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===la)this.id=a,this.password=c;else if(o===Cu)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{let[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);let i={};i[la]="t",i[nc]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[ku]=this.scriptTagHolder.uniqueCallbackIdentifier),i[$a]=On,this.transportSessionId&&(i[ja]=this.transportSessionId),this.lastSessionId&&(i[Ya]=this.lastSessionId),this.applicationId&&(i[Ja]=this.applicationId),this.appCheckToken&&(i[Rs]=this.appCheckToken),typeof location<"u"&&location.hostname&&Ka.test(location.hostname)&&(i[qa]=Ga);let s=this.urlFn(i);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){n.forceAllow_=!0}static forceDisallow(){n.forceDisallow_=!0}static isAvailable(){return ue()?!1:n.forceAllow_?!0:!n.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!gu()&&!_u()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){let t=F(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);let i=Qi(t),s=za(i,Ou);for(let r=0;r<s.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){if(ue())return;this.myDisconnFrame=document.createElement("iframe");let i={};i[Pu]="t",i[ec]=e,i[tc]=t,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){let t=F(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}},Ds=class n{constructor(e,t,i,s){if(this.onDisconnect=i,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0,ue())this.commandCB=e,this.onMessageCB=t;else{this.uniqueCallbackIdentifier=uu(),window[Su+this.uniqueCallbackIdentifier]=e,window[xu+this.uniqueCallbackIdentifier]=t,this.myIFrame=n.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');let o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){U("frame writing exception"),a.stack&&U(a.stack),U(a)}}}static createIFrame_(){let e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||U("No IE domain setting required")}catch{let i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));let e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;let e={};e[ec]=this.myID,e[tc]=this.myPW,e[nc]=this.currentSerial;let t=this.urlFn(e),i="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+sc+i.length<=ic;){let o=this.pendingSegs.shift();i=i+"&"+Au+s+"="+o.seg+"&"+Ru+s+"="+o.ts+"&"+Nu+s+"="+o.d,s++}return t=t+i,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,i){this.pendingSegs.push({seg:e,ts:t,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);let i=()=>{this.outstandingRequests.delete(t),this.newRequest_()},s=setTimeout(i,Math.floor(Du)),r=()=>{clearTimeout(s),i()};this.addTag(e,r)}addTag(e,t){ue()?this.doNodeLongPoll(e,t):setTimeout(()=>{try{if(!this.sendNewPolls)return;let i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){let s=i.readyState;(!s||s==="loaded"||s==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),t())},i.onerror=()=>{U("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}};var Mu=16384,Fu=45e3,Ln=null;typeof MozWebSocket<"u"?Ln=MozWebSocket:typeof WebSocket<"u"&&(Ln=WebSocket);var we=class n{constructor(e,t,i,s,r,o,a){this.connId=e,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=en(this.connId),this.stats_=Sr(t),this.connURL=n.connectionURL_(t,o,a,s,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,i,s,r){let o={};return o[$a]=On,!ue()&&typeof location<"u"&&location.hostname&&Ka.test(location.hostname)&&(o[qa]=Ga),t&&(o[ja]=t),i&&(o[Ya]=i),s&&(o[Rs]=s),r&&(o[Ja]=r),Za(e,Xa,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,je.set("previous_websocket_failure",!0);try{let i;if(ue()){let s=this.nodeAdmin?"AdminNode":"Node";i={headers:{"User-Agent":`Firebase/${On}/${Tr}/${process.platform}/${s}`,"X-Firebase-GMPID":this.applicationId||""}},this.authToken&&(i.headers.Authorization=`Bearer ${this.authToken}`),this.appCheckToken&&(i.headers["X-Firebase-AppCheck"]=this.appCheckToken);let r=process.env,o=this.connURL.indexOf("wss://")===0?r.HTTPS_PROXY||r.https_proxy:r.HTTP_PROXY||r.http_proxy;o&&(i.proxy={origin:o})}this.mySock=new Ln(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");let s=i.message||i.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");let s=i.message||i.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){n.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){let t=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(t);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&Ln!==null&&!n.forceDisallow_}static previouslyFailed(){return je.isInMemoryStorage||je.get("previous_websocket_failure")===!0}markConnectionHealthy(){je.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){let t=this.frames.join("");this.frames=null;let i=at(t);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(p(this.frames===null,"We already have a frame buffer"),e.length<=6){let t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;let t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{let i=this.extractFrameCount_(t);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();let t=F(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);let i=za(t,Mu);i.length>1&&this.sendString_(String(i.length));for(let s=0;s<i.length;s++)this.sendString_(i[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Fu))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}};we.responsesRequiredToBeHealthy=2;we.healthyTimeout=3e4;var Mn=class n{static get ALL_TRANSPORTS(){return[Os,we]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){let t=we&&we.isAvailable(),i=t&&!we.previouslyFailed();if(e.webSocketOnly&&(t||G("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[we];else{let s=this.transports_=[];for(let r of n.ALL_TRANSPORTS)r&&r.isAvailable()&&s.push(r);n.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}};Mn.globalTransportInitialized_=!1;var Uu=6e4,Wu=5e3,Bu=10*1024,Vu=100*1024,ws="t",da="d",zu="s",ua="r",Hu="e",ha="o",fa="a",pa="n",ma="p",$u="h",Ls=class{constructor(e,t,i,s,r,o,a,c,l,d){this.id=e,this.repoInfo_=t,this.applicationId_=i,this.appCheckToken_=s,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=c,this.onKill_=l,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=en("c:"+this.id+":"),this.transportManager_=new Mn(t),this.log_("Connection created"),this.start_()}start_(){let e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;let t=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,i)},Math.floor(0));let s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=zt(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Vu?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Bu?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){let t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(ws in e){let t=e[ws];t===fa?this.upgradeIfSecondaryHealthy_():t===ua?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===ha&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){let t=Ut("t",e),i=Ut("d",e);if(t==="c")this.onSecondaryControl_(i);else if(t==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:ma,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:fa,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:pa,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){let t=Ut("t",e),i=Ut("d",e);t==="c"?this.onControl_(i):t==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){let t=Ut(ws,e);if(da in e){let i=e[da];if(t===$u){let s={...i};this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(t===pa){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===zu?this.onConnectionShutdown_(i):t===ua?this.onReset_(i):t===Hu?xs("Server Error: "+i):t===ha?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):xs("Unknown control packet command: "+t)}}onHandshake_(e){let t=e.ts,i=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),On!==i&&G("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){let e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;let t=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,i),zt(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Uu))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):zt(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Wu))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:ma,d:{}}}))}onSecondaryConnectionLost_(){let e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(je.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}};var Fn=class{put(e,t,i,s){}merge(e,t,i,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,i){}onDisconnectMerge(e,t,i){}onDisconnectCancel(e,t){}reportStats(e){}};var Un=class{constructor(e){this.allowedEvents_=e,this.listeners_={},p(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){let i=[...this.listeners_[e]];for(let s=0;s<i.length;s++)i[s].callback.apply(i[s].context,t)}}on(e,t,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:i});let s=this.getInitialEvent(e);s&&t.apply(i,s)}off(e,t,i){this.validateEventType_(e);let s=this.listeners_[e]||[];for(let r=0;r<s.length;r++)if(s[r].callback===t&&(!i||i===s[r].context)){s.splice(r,1);return}}validateEventType_(e){p(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}};var Wn=class n extends Un{static getInstance(){return new n}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Pt()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return p(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}};var ga=32,_a=768,A=class{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let i=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[i]=this.pieces_[s],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}};function k(){return new A("")}function T(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function De(n){return n.pieces_.length-n.pieceNum_}function O(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new A(n.pieces_,e)}function xr(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function ju(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function qt(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function rc(n){if(n.pieceNum_>=n.pieces_.length)return null;let e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new A(e,0)}function D(n,e){let t=[];for(let i=n.pieceNum_;i<n.pieces_.length;i++)t.push(n.pieces_[i]);if(e instanceof A)for(let i=e.pieceNum_;i<e.pieces_.length;i++)t.push(e.pieces_[i]);else{let i=e.split("/");for(let s=0;s<i.length;s++)i[s].length>0&&t.push(i[s])}return new A(t,0)}function C(n){return n.pieceNum_>=n.pieces_.length}function Y(n,e){let t=T(n),i=T(e);if(t===null)return e;if(t===i)return Y(O(n),O(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function qu(n,e){let t=qt(n,0),i=qt(e,0);for(let s=0;s<t.length&&s<i.length;s++){let r=Xe(t[s],i[s]);if(r!==0)return r}return t.length===i.length?0:t.length<i.length?-1:1}function kr(n,e){if(De(n)!==De(e))return!1;for(let t=n.pieceNum_,i=e.pieceNum_;t<=n.pieces_.length;t++,i++)if(n.pieces_[t]!==e.pieces_[i])return!1;return!0}function te(n,e){let t=n.pieceNum_,i=e.pieceNum_;if(De(n)>De(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[i])return!1;++t,++i}return!0}var Ms=class{constructor(e,t){this.errorPrefix_=t,this.parts_=qt(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=Dt(this.parts_[i]);oc(this)}};function Gu(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=Dt(e),oc(n)}function Ku(n){let e=n.parts_.pop();n.byteLength_-=Dt(e),n.parts_.length>0&&(n.byteLength_-=1)}function oc(n){if(n.byteLength_>_a)throw new Error(n.errorPrefix_+"has a key path longer than "+_a+" bytes ("+n.byteLength_+").");if(n.parts_.length>ga)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+ga+") or object contains a cycle "+$e(n))}function $e(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}var Fs=class n extends Un{static getInstance(){return new n}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{let i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return p(e==="visible","Unknown event type: "+e),[this.visible_]}};var Wt=1e3,Yu=60*5*1e3,ya=30*1e3,Ju=1.3,Xu=3e4,Qu="server_kill",wa=3,Ye=class n extends Fn{constructor(e,t,i,s,r,o,a,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=i,this.onConnectStatus_=s,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=c,this.id=n.nextPersistentConnectionId_++,this.log_=en("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Wt,this.maxReconnectDelay_=Yu,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c&&!ue())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Fs.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Wn.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,i){let s=++this.requestNumber_,r={r:s,a:e,b:t};this.log_(F(r)),p(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),i&&(this.requestCBHash_[s]=i)}get(e){this.initConnection_();let t=new z,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{let a=o.d;o.s==="ok"?t.resolve(a):t.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;let r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,i,s){this.initConnection_();let r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),p(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),p(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");let a={onComplete:s,hashFn:t,query:e,tag:i};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){let t=this.outstandingGets_[e];this.sendRequest("g",t.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(i)})}sendListen_(e){let t=e.query,i=t._path.toString(),s=t._queryIdentifier;this.log_("Listen on "+i+" for "+s);let r={p:i},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{let c=a.d,l=a.s;n.warnOnListenWarnings_(c,t),(this.listens.get(i)&&this.listens.get(i).get(s))===e&&(this.log_("listen response",a),l!=="ok"&&this.removeListen_(i,s),e.onComplete&&e.onComplete(l,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&se(e,"w")){let i=Be(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){let s='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();G(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||zo(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=ya)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){let e=this.authToken_,t=Vo(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(t,i,s=>{let r=s.s,o=s.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{let t=e.s,i=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,i)})}unlisten(e,t){let i=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+s),p(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,s)&&this.connected_&&this.sendUnlisten_(i,s,e._queryObject,t)}sendUnlisten_(e,t,i,s){this.log_("Unlisten on "+e+" for "+t);let r={p:e},o="n";s&&(r.q=i,r.t=s),this.sendRequest(o,r)}onDisconnectPut(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:i})}onDisconnectMerge(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:i})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,i,s){let r={p:t,d:i};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,t,i,s){this.putInternal("p",e,t,i,s)}merge(e,t,i,s){this.putInternal("m",e,t,i,s)}putInternal(e,t,i,s,r){this.initConnection_();let o={p:t,d:i};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;let a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+t)}sendPut_(e){let t=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,i,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(r.s,r.d)})}reportStats(e){if(this.connected_){let t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,i=>{if(i.s!=="ok"){let r=i.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+F(e));let t=e.r,i=this.requestCBHash_[t];i&&(delete this.requestCBHash_[t],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):xs("Unrecognized action received from server: "+F(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){p(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Wt,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Wt,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Xu&&(this.reconnectDelay_=Wt),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());let e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_),t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Ju)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;let e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+n.nextConnectionId_++,r=this.lastSessionId,o=!1,a=null,c=function(){a?a.close():(o=!0,i())},l=function(u){p(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(u)};this.realtime_={close:c,sendRequest:l};let d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{let[u,h]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?U("getToken() completed but was canceled"):(U("getToken() completed. Creating connection."),this.authToken_=u&&u.accessToken,this.appCheckToken_=h&&h.token,a=new Ls(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,i,g=>{G(g+" ("+this.repoInfo_.toString()+")"),this.interrupt(Qu)},r))}catch(u){this.log_("Failed to get token: "+u),o||(this.repoInfo_.nodeAdmin&&G(u),c())}}}interrupt(e){U("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){U("Resuming connection for reason: "+e),delete this.interruptReasons_[e],ct(this.interruptReasons_)&&(this.reconnectDelay_=Wt,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){let t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){let t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let i;t?i=t.map(r=>Cr(r)).join("$"):i="default";let s=this.removeListen_(e,i);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,t){let i=new A(e).toString(),s;if(this.listens.has(i)){let r=this.listens.get(i);s=r.get(t),r.delete(t),r.size===0&&this.listens.delete(i)}else s=void 0;return s}onAuthRevoked_(e,t){U("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=wa&&(this.reconnectDelay_=ya,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){U("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=wa&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(let e of this.listens.values())for(let t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){let e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){let e={},t="js";ue()&&(this.repoInfo_.nodeAdmin?t="admin_node":t="node"),e["sdk."+t+"."+Tr.replace(/\./g,"-")]=1,Pt()?e["framework.cordova"]=1:Sn()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){let e=Wn.getInstance().currentlyOnline();return ct(this.interruptReasons_)&&e}};Ye.nextPersistentConnectionId_=0;Ye.nextConnectionId_=0;var S=class n{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new n(e,t)}};var _t=class{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){let i=new S(gt,e),s=new S(gt,t);return this.compare(i,s)!==0}minPost(){return S.MIN}};var Pn,Bn=class extends _t{static get __EMPTY_NODE(){return Pn}static set __EMPTY_NODE(e){Pn=e}compare(e,t){return Xe(e.name,t.name)}isDefinedOn(e){throw We("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return S.MIN}maxPost(){return new S(Ke,Pn)}makePost(e,t){return p(typeof e=="string","KeyIndex indexValue must always be a string."),new S(e,Pn)}toString(){return".key"}},pt=new Bn;var ht=class{constructor(e,t,i,s,r=null){this.isReverse_=s,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?i(e.key,t):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}},q=class n{constructor(e,t,i,s,r){this.key=e,this.value=t,this.color=i??n.RED,this.left=s??ne.EMPTY_NODE,this.right=r??ne.EMPTY_NODE}copy(e,t,i,s,r){return new n(e??this.key,t??this.value,i??this.color,s??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let s=this,r=i(e,s.key);return r<0?s=s.copy(null,null,null,s.left.insert(e,t,i),null):r===0?s=s.copy(null,t,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,t,i)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return ne.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let i,s;if(i=this,t(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),t(e,i.key)===0){if(i.right.isEmpty())return ne.EMPTY_NODE;s=i.right.min_(),i=i.copy(s.key,s.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){let e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");let e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}};q.RED=!0;q.BLACK=!1;var Us=class{copy(e,t,i,s,r){return this}insert(e,t,i){return new q(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}},ne=class n{constructor(e,t=n.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new n(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,q.BLACK,null,null))}remove(e){return new n(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,q.BLACK,null,null))}get(e){let t,i=this.root_;for(;!i.isEmpty();){if(t=this.comparator_(e,i.key),t===0)return i.value;t<0?i=i.left:t>0&&(i=i.right)}return null}getPredecessorKey(e){let t,i=this.root_,s=null;for(;!i.isEmpty();)if(t=this.comparator_(e,i.key),t===0){if(i.left.isEmpty())return s?s.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else t<0?i=i.left:t>0&&(s=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ht(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new ht(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new ht(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new ht(this.root_,null,this.comparator_,!0,e)}};ne.EMPTY_NODE=new Us;function Zu(n,e){return Xe(n.name,e.name)}function Ar(n,e){return Xe(n,e)}var Ws;function eh(n){Ws=n}var ac=function(n){return typeof n=="number"?"number:"+Ha(n):"string:"+n},cc=function(n){if(n.isLeafNode()){let e=n.val();p(typeof e=="string"||typeof e=="number"||typeof e=="object"&&se(e,".sv"),"Priority must be a string or number.")}else p(n===Ws||n.isEmpty(),"priority of unexpected type.");p(n===Ws||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};var va,be=class n{static set __childrenNodeConstructor(e){va=e}static get __childrenNodeConstructor(){return va}constructor(e,t=n.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,p(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),cc(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new n(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:n.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return C(e)?this:T(e)===".priority"?this.priorityNode_:n.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:n.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){let i=T(e);return i===null?t:t.isEmpty()&&i!==".priority"?this:(p(i!==".priority"||De(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,n.__childrenNodeConstructor.EMPTY_NODE.updateChild(O(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+ac(this.priorityNode_.val())+":");let t=typeof this.value_;e+=t+":",t==="number"?e+=Ha(this.value_):e+=this.value_,this.lazyHash_=Va(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===n.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof n.__childrenNodeConstructor?-1:(p(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){let t=typeof e.value_,i=typeof this.value_,s=n.VALUE_TYPE_ORDER.indexOf(t),r=n.VALUE_TYPE_ORDER.indexOf(i);return p(s>=0,"Unknown leaf type: "+t),p(r>=0,"Unknown leaf type: "+i),s===r?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){let t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}};be.VALUE_TYPE_ORDER=["object","boolean","number","string"];var lc,dc;function th(n){lc=n}function nh(n){dc=n}var Bs=class extends _t{compare(e,t){let i=e.node.getPriority(),s=t.node.getPriority(),r=i.compareTo(s);return r===0?Xe(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return S.MIN}maxPost(){return new S(Ke,new be("[PRIORITY-POST]",dc))}makePost(e,t){let i=lc(e);return new S(t,new be("[PRIORITY-POST]",i))}toString(){return".priority"}},L=new Bs;var ih=Math.log(2),Vs=class{constructor(e){let t=r=>parseInt(Math.log(r)/ih,10),i=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;let s=i(this.count);this.bits_=e+1&s}nextBitIsOne(){let e=!(this.bits_&1<<this.current_);return this.current_--,e}},Vn=function(n,e,t,i){n.sort(e);let s=function(c,l){let d=l-c,u,h;if(d===0)return null;if(d===1)return u=n[c],h=t?t(u):u,new q(h,u.node,q.BLACK,null,null);{let g=parseInt(d/2,10)+c,m=s(c,g),v=s(g+1,l);return u=n[g],h=t?t(u):u,new q(h,u.node,q.BLACK,m,v)}},r=function(c){let l=null,d=null,u=n.length,h=function(m,v){let f=u-m,_=u;u-=m;let b=s(f+1,_),E=n[f],N=t?t(E):E;g(new q(N,E.node,v,null,b))},g=function(m){l?(l.left=m,l=m):(d=m,l=m)};for(let m=0;m<c.count;++m){let v=c.nextBitIsOne(),f=Math.pow(2,c.count-(m+1));v?h(f,q.BLACK):(h(f,q.BLACK),h(f,q.RED))}return d},o=new Vs(n.length),a=r(o);return new ne(i||e,a)};var vs,ut={},yt=class n{static get Default(){return p(ut&&L,"ChildrenNode.ts has not been loaded"),vs=vs||new n({".priority":ut},{".priority":L}),vs}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){let t=Be(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof ne?t:null}hasIndex(e){return se(this.indexSet_,e.toString())}addIndex(e,t){p(e!==pt,"KeyIndex always exists and isn't meant to be added to the IndexMap.");let i=[],s=!1,r=t.getIterator(S.Wrap),o=r.getNext();for(;o;)s=s||e.isDefinedOn(o.node),i.push(o),o=r.getNext();let a;s?a=Vn(i,e.getCompare()):a=ut;let c=e.toString(),l={...this.indexSet_};l[c]=e;let d={...this.indexes_};return d[c]=a,new n(d,l)}addToIndexes(e,t){let i=Ot(this.indexes_,(s,r)=>{let o=Be(this.indexSet_,r);if(p(o,"Missing index implementation for "+r),s===ut)if(o.isDefinedOn(e.node)){let a=[],c=t.getIterator(S.Wrap),l=c.getNext();for(;l;)l.name!==e.name&&a.push(l),l=c.getNext();return a.push(e),Vn(a,o.getCompare())}else return ut;else{let a=t.get(e.name),c=s;return a&&(c=c.remove(new S(e.name,a))),c.insert(e,e.node)}});return new n(i,this.indexSet_)}removeFromIndexes(e,t){let i=Ot(this.indexes_,s=>{if(s===ut)return s;{let r=t.get(e.name);return r?s.remove(new S(e.name,r)):s}});return new n(i,this.indexSet_)}};var Bt,I=class n{static get EMPTY_NODE(){return Bt||(Bt=new n(new ne(Ar),null,yt.Default))}constructor(e,t,i){this.children_=e,this.priorityNode_=t,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&cc(this.priorityNode_),this.children_.isEmpty()&&p(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Bt}updatePriority(e){return this.children_.isEmpty()?this:new n(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{let t=this.children_.get(e);return t===null?Bt:t}}getChild(e){let t=T(e);return t===null?this:this.getImmediateChild(t).getChild(O(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(p(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{let i=new S(e,t),s,r;t.isEmpty()?(s=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(i,this.children_)):(s=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(i,this.children_));let o=s.isEmpty()?Bt:this.priorityNode_;return new n(s,o,r)}}updateChild(e,t){let i=T(e);if(i===null)return t;{p(T(e)!==".priority"||De(e)===1,".priority must be the last token in a path");let s=this.getImmediateChild(i).updateChild(O(e),t);return this.updateImmediateChild(i,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;let t={},i=0,s=0,r=!0;if(this.forEachChild(L,(o,a)=>{t[o]=a.val(e),i++,r&&n.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):r=!1}),!e&&r&&s<2*i){let o=[];for(let a in t)o[a]=t[a];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+ac(this.getPriority().val())+":"),this.forEachChild(L,(t,i)=>{let s=i.hash();s!==""&&(e+=":"+t+":"+s)}),this.lazyHash_=e===""?"":Va(e)}return this.lazyHash_}getPredecessorChildName(e,t,i){let s=this.resolveIndex_(i);if(s){let r=s.getPredecessorKey(new S(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){let t=this.resolveIndex_(e);if(t){let i=t.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){let t=this.getFirstChildName(e);return t?new S(t,this.children_.get(t)):null}getLastChildName(e){let t=this.resolveIndex_(e);if(t){let i=t.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){let t=this.getLastChildName(e);return t?new S(t,this.children_.get(t)):null}forEachChild(e,t){let i=this.resolveIndex_(e);return i?i.inorderTraversal(s=>t(s.name,s.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){let i=this.resolveIndex_(t);if(i)return i.getIteratorFrom(e,s=>s);{let s=this.children_.getIteratorFrom(e.name,S.Wrap),r=s.peek();for(;r!=null&&t.compare(r,e)<0;)s.getNext(),r=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){let i=this.resolveIndex_(t);if(i)return i.getReverseIteratorFrom(e,s=>s);{let s=this.children_.getReverseIteratorFrom(e.name,S.Wrap),r=s.peek();for(;r!=null&&t.compare(r,e)>0;)s.getNext(),r=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===tn?-1:0}withIndex(e){if(e===pt||this.indexMap_.hasIndex(e))return this;{let t=this.indexMap_.addIndex(e,this.children_);return new n(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===pt||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{let t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){let i=this.getIterator(L),s=t.getIterator(L),r=i.getNext(),o=s.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=i.getNext(),o=s.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===pt?null:this.indexMap_.get(e.toString())}};I.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;var zs=class extends I{constructor(){super(new ne(Ar),I.EMPTY_NODE,yt.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return I.EMPTY_NODE}isEmpty(){return!1}},tn=new zs;Object.defineProperties(S,{MIN:{value:new S(gt,I.EMPTY_NODE)},MAX:{value:new S(Ke,tn)}});Bn.__EMPTY_NODE=I.EMPTY_NODE;be.__childrenNodeConstructor=I;eh(tn);nh(tn);var sh=!0;function M(n,e=null){if(n===null)return I.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),p(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){let t=n;return new be(t,M(e))}if(!(n instanceof Array)&&sh){let t=[],i=!1;if(W(n,(o,a)=>{if(o.substring(0,1)!=="."){let c=M(a);c.isEmpty()||(i=i||!c.getPriority().isEmpty(),t.push(new S(o,c)))}}),t.length===0)return I.EMPTY_NODE;let r=Vn(t,Zu,o=>o.name,Ar);if(i){let o=Vn(t,L.getCompare());return new I(r,M(e),new yt({".priority":o},{".priority":L}))}else return new I(r,M(e),yt.Default)}else{let t=I.EMPTY_NODE;return W(n,(i,s)=>{if(se(n,i)&&i.substring(0,1)!=="."){let r=M(s);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(i,r))}}),t.updatePriority(M(e))}}th(M);var Hs=class extends _t{constructor(e){super(),this.indexPath_=e,p(!C(e)&&T(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){let i=this.extractChild(e.node),s=this.extractChild(t.node),r=i.compareTo(s);return r===0?Xe(e.name,t.name):r}makePost(e,t){let i=M(e),s=I.EMPTY_NODE.updateChild(this.indexPath_,i);return new S(t,s)}maxPost(){let e=I.EMPTY_NODE.updateChild(this.indexPath_,tn);return new S(Ke,e)}toString(){return qt(this.indexPath_,0).join("/")}};var $s=class extends _t{compare(e,t){let i=e.node.compareTo(t.node);return i===0?Xe(e.name,t.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return S.MIN}maxPost(){return S.MAX}makePost(e,t){let i=M(e);return new S(t,i)}toString(){return".value"}},rh=new $s;function uc(n){return{type:"value",snapshotNode:n}}function wt(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function Gt(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function Kt(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function oh(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}var Yt=class{constructor(e){this.index_=e}updateChild(e,t,i,s,r,o){p(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");let a=e.getImmediateChild(t);return a.getChild(s).equals(i.getChild(s))&&a.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(t)?o.trackChildChange(Gt(t,a)):p(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(wt(t,i)):o.trackChildChange(Kt(t,i,a))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(t,i).withIndex(this.index_)}updateFullNode(e,t,i){return i!=null&&(e.isLeafNode()||e.forEachChild(L,(s,r)=>{t.hasChild(s)||i.trackChildChange(Gt(s,r))}),t.isLeafNode()||t.forEachChild(L,(s,r)=>{if(e.hasChild(s)){let o=e.getImmediateChild(s);o.equals(r)||i.trackChildChange(Kt(s,r,o))}else i.trackChildChange(wt(s,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?I.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}};var zn=class n{constructor(e){this.indexedFilter_=new Yt(e.getIndex()),this.index_=e.getIndex(),this.startPost_=n.getStartPost_(e),this.endPost_=n.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){let t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&i}updateChild(e,t,i,s,r,o){return this.matches(new S(t,i))||(i=I.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,i,s,r,o)}updateFullNode(e,t,i){t.isLeafNode()&&(t=I.EMPTY_NODE);let s=t.withIndex(this.index_);s=s.updatePriority(I.EMPTY_NODE);let r=this;return t.forEachChild(L,(o,a)=>{r.matches(new S(o,a))||(s=s.updateImmediateChild(o,I.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){let t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){let t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}};var js=class{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{let i=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=t=>{let i=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new zn(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,i,s,r,o){return this.rangedFilter_.matches(new S(t,i))||(i=I.EMPTY_NODE),e.getImmediateChild(t).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,i,s,r,o):this.fullLimitUpdateChild_(e,t,i,r,o)}updateFullNode(e,t,i){let s;if(t.isLeafNode()||t.isEmpty())s=I.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){s=I.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){let a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=t.withIndex(this.index_),s=s.updatePriority(I.EMPTY_NODE);let r;this.reverse_?r=s.getReverseIterator(this.index_):r=s.getIterator(this.index_);let o=0;for(;r.hasNext();){let a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,I.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,i,s,r){let o;if(this.reverse_){let u=this.index_.getCompare();o=(h,g)=>u(g,h)}else o=this.index_.getCompare();let a=e;p(a.numChildren()===this.limit_,"");let c=new S(t,i),l=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),d=this.rangedFilter_.matches(c);if(a.hasChild(t)){let u=a.getImmediateChild(t),h=s.getChildAfterChild(this.index_,l,this.reverse_);for(;h!=null&&(h.name===t||a.hasChild(h.name));)h=s.getChildAfterChild(this.index_,h,this.reverse_);let g=h==null?1:o(h,c);if(d&&!i.isEmpty()&&g>=0)return r?.trackChildChange(Kt(t,i,u)),a.updateImmediateChild(t,i);{r?.trackChildChange(Gt(t,u));let v=a.updateImmediateChild(t,I.EMPTY_NODE);return h!=null&&this.rangedFilter_.matches(h)?(r?.trackChildChange(wt(h.name,h.node)),v.updateImmediateChild(h.name,h.node)):v}}else return i.isEmpty()?e:d&&o(l,c)>=0?(r!=null&&(r.trackChildChange(Gt(l.name,l.node)),r.trackChildChange(wt(t,i))),a.updateImmediateChild(t,i).updateImmediateChild(l.name,I.EMPTY_NODE)):e}};var qs=class n{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=L}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return p(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return p(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:gt}hasEnd(){return this.endSet_}getIndexEndValue(){return p(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return p(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Ke}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return p(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===L}copy(){let e=new n;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}};function ah(n){return n.loadsAllData()?new Yt(n.getIndex()):n.hasLimit()?new js(n):new zn(n)}function ba(n){let e={};if(n.isDefault())return e;let t;if(n.index_===L?t="$priority":n.index_===rh?t="$value":n.index_===pt?t="$key":(p(n.index_ instanceof Hs,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=F(t),n.startSet_){let i=n.startAfterSet_?"startAfter":"startAt";e[i]=F(n.indexStartValue_),n.startNameSet_&&(e[i]+=","+F(n.indexStartName_))}if(n.endSet_){let i=n.endBeforeSet_?"endBefore":"endAt";e[i]=F(n.indexEndValue_),n.endNameSet_&&(e[i]+=","+F(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Ia(n){let e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==L&&(e.i=n.index_.toString()),e}var Gs=class n extends Fn{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(p(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,i,s){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=i,this.appCheckTokenProvider_=s,this.log_=en("p:rest:"),this.listens_={}}listen(e,t,i,s){let r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);let o=n.getListenId_(e,i),a={};this.listens_[o]=a;let c=ba(e._queryParams);this.restRequest_(r+".json",c,(l,d)=>{let u=d;if(l===404&&(u=null,l=null),l===null&&this.onDataUpdate_(r,u,!1,i),Be(this.listens_,o)===a){let h;l?l===401?h="permission_denied":h="rest_error:"+l:h="ok",s(h,null)}})}unlisten(e,t){let i=n.getListenId_(e,t);delete this.listens_[i]}get(e){let t=ba(e._queryParams),i=e._path.toString(),s=new z;return this.restRequest_(i+".json",t,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(i,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,t={},i){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,r])=>{s&&s.accessToken&&(t.auth=s.accessToken),r&&r.token&&(t.ac=r.token);let o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Se(t);this.log_("Sending REST request for "+o);let a=new XMLHttpRequest;a.onreadystatechange=()=>{if(i&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let c=null;if(a.status>=200&&a.status<300){try{c=at(a.responseText)}catch{G("Failed to parse JSON response for "+o+": "+a.responseText)}i(null,c)}else a.status!==401&&a.status!==404&&G("Got unsuccessful REST response for "+o+" Status: "+a.status),i(a.status);i=null}},a.open("GET",o,!0),a.send()})}};var Ks=class{constructor(){this.rootNode_=I.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}};function Hn(){return{value:null,children:new Map}}function Ct(n,e,t){if(C(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{let i=T(e);n.children.has(i)||n.children.set(i,Hn());let s=n.children.get(i);e=O(e),Ct(s,e,t)}}function Ys(n,e){if(C(e))return n.value=null,n.children.clear(),!0;if(n.value!==null){if(n.value.isLeafNode())return!1;{let t=n.value;return n.value=null,t.forEachChild(L,(i,s)=>{Ct(n,new A(i),s)}),Ys(n,e)}}else if(n.children.size>0){let t=T(e);return e=O(e),n.children.has(t)&&Ys(n.children.get(t),e)&&n.children.delete(t),n.children.size===0}else return!0}function Js(n,e,t){n.value!==null?t(e,n.value):ch(n,(i,s)=>{let r=new A(e.toString()+"/"+i);Js(s,r,t)})}function ch(n,e){n.children.forEach((t,i)=>{e(i,t)})}var Xs=class{constructor(e){this.collection_=e,this.last_=null}get(){let e=this.collection_.get(),t={...e};return this.last_&&W(this.last_,(i,s)=>{t[i]=t[i]-s}),this.last_=e,t}};var Ea=10*1e3,lh=30*1e3,dh=5*60*1e3,Qs=class{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new Xs(e);let i=Ea+(lh-Ea)*Math.random();zt(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){let e=this.statsListener_.get(),t={},i=!1;W(e,(s,r)=>{r>0&&se(this.statsToReport_,s)&&(t[s]=r,i=!0)}),i&&this.server_.reportStats(t),zt(this.reportStats_.bind(this),Math.floor(Math.random()*2*dh))}};var oe;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(oe||(oe={}));function Rr(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Nr(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Pr(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}var Zs=class n{constructor(e,t,i){this.path=e,this.affectedTree=t,this.revert=i,this.type=oe.ACK_USER_WRITE,this.source=Rr()}operationForChild(e){if(C(this.path)){if(this.affectedTree.value!=null)return p(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{let t=this.affectedTree.subtree(new A(e));return new n(k(),t,this.revert)}}else return p(T(this.path)===e,"operationForChild called for unrelated child."),new n(O(this.path),this.affectedTree,this.revert)}};var $n=class n{constructor(e,t){this.source=e,this.path=t,this.type=oe.LISTEN_COMPLETE}operationForChild(e){return C(this.path)?new n(this.source,k()):new n(this.source,O(this.path))}};var vt=class n{constructor(e,t,i){this.source=e,this.path=t,this.snap=i,this.type=oe.OVERWRITE}operationForChild(e){return C(this.path)?new n(this.source,k(),this.snap.getImmediateChild(e)):new n(this.source,O(this.path),this.snap)}};var Jt=class n{constructor(e,t,i){this.source=e,this.path=t,this.children=i,this.type=oe.MERGE}operationForChild(e){if(C(this.path)){let t=this.children.subtree(new A(e));return t.isEmpty()?null:t.value?new vt(this.source,k(),t.value):new n(this.source,k(),t)}else return p(T(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new n(this.source,O(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}};var Ie=class{constructor(e,t,i){this.node_=e,this.fullyInitialized_=t,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(C(e))return this.isFullyInitialized()&&!this.filtered_;let t=T(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}};var er=class{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}};function uh(n,e,t,i){let s=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(oh(o.childName,o.snapshotNode))}),Vt(n,s,"child_removed",e,i,t),Vt(n,s,"child_added",e,i,t),Vt(n,s,"child_moved",r,i,t),Vt(n,s,"child_changed",e,i,t),Vt(n,s,"value",e,i,t),s}function Vt(n,e,t,i,s,r){let o=i.filter(a=>a.type===t);o.sort((a,c)=>fh(n,a,c)),o.forEach(a=>{let c=hh(n,a,r);s.forEach(l=>{l.respondsTo(a.type)&&e.push(l.createEvent(c,n.query_))})})}function hh(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function fh(n,e,t){if(e.childName==null||t.childName==null)throw We("Should only compare child_ events.");let i=new S(e.childName,e.snapshotNode),s=new S(t.childName,t.snapshotNode);return n.index_.compare(i,s)}function ii(n,e){return{eventCache:n,serverCache:e}}function Ht(n,e,t,i){return ii(new Ie(e,t,i),n.serverCache)}function hc(n,e,t,i){return ii(n.eventCache,new Ie(e,t,i))}function tr(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function Je(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}var bs,ph=()=>(bs||(bs=new ne(mu)),bs),K=class n{static fromObject(e){let t=new n(null);return W(e,(i,s)=>{t=t.set(new A(i),s)}),t}constructor(e,t=ph()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:k(),value:this.value};if(C(e))return null;{let i=T(e),s=this.children.get(i);if(s!==null){let r=s.findRootMostMatchingPathAndValue(O(e),t);return r!=null?{path:D(new A(i),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(C(e))return this;{let t=T(e),i=this.children.get(t);return i!==null?i.subtree(O(e)):new n(null)}}set(e,t){if(C(e))return new n(t,this.children);{let i=T(e),r=(this.children.get(i)||new n(null)).set(O(e),t),o=this.children.insert(i,r);return new n(this.value,o)}}remove(e){if(C(e))return this.children.isEmpty()?new n(null):new n(null,this.children);{let t=T(e),i=this.children.get(t);if(i){let s=i.remove(O(e)),r;return s.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,s),this.value===null&&r.isEmpty()?new n(null):new n(this.value,r)}else return this}}get(e){if(C(e))return this.value;{let t=T(e),i=this.children.get(t);return i?i.get(O(e)):null}}setTree(e,t){if(C(e))return t;{let i=T(e),r=(this.children.get(i)||new n(null)).setTree(O(e),t),o;return r.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,r),new n(this.value,o)}}fold(e){return this.fold_(k(),e)}fold_(e,t){let i={};return this.children.inorderTraversal((s,r)=>{i[s]=r.fold_(D(e,s),t)}),t(e,this.value,i)}findOnPath(e,t){return this.findOnPath_(e,k(),t)}findOnPath_(e,t,i){let s=this.value?i(t,this.value):!1;if(s)return s;if(C(e))return null;{let r=T(e),o=this.children.get(r);return o?o.findOnPath_(O(e),D(t,r),i):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,k(),t)}foreachOnPath_(e,t,i){if(C(e))return this;{this.value&&i(t,this.value);let s=T(e),r=this.children.get(s);return r?r.foreachOnPath_(O(e),D(t,s),i):new n(null)}}foreach(e){this.foreach_(k(),e)}foreach_(e,t){this.children.inorderTraversal((i,s)=>{s.foreach_(D(e,i),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,i)=>{i.value&&e(t,i.value)})}};var ae=class n{constructor(e){this.writeTree_=e}static empty(){return new n(new K(null))}};function $t(n,e,t){if(C(e))return new ae(new K(t));{let i=n.writeTree_.findRootMostValueAndPath(e);if(i!=null){let s=i.path,r=i.value,o=Y(s,e);return r=r.updateChild(o,t),new ae(n.writeTree_.set(s,r))}else{let s=new K(t),r=n.writeTree_.setTree(e,s);return new ae(r)}}}function nr(n,e,t){let i=n;return W(t,(s,r)=>{i=$t(i,D(e,s),r)}),i}function Ta(n,e){if(C(e))return ae.empty();{let t=n.writeTree_.setTree(e,new K(null));return new ae(t)}}function ir(n,e){return Qe(n,e)!=null}function Qe(n,e){let t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(Y(t.path,e)):null}function Ca(n){let e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(L,(i,s)=>{e.push(new S(i,s))}):n.writeTree_.children.inorderTraversal((i,s)=>{s.value!=null&&e.push(new S(i,s.value))}),e}function Oe(n,e){if(C(e))return n;{let t=Qe(n,e);return t!=null?new ae(new K(t)):new ae(n.writeTree_.subtree(e))}}function sr(n){return n.writeTree_.isEmpty()}function bt(n,e){return fc(k(),n.writeTree_,e)}function fc(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let i=null;return e.children.inorderTraversal((s,r)=>{s===".priority"?(p(r.value!==null,"Priority writes must always be leaf nodes"),i=r.value):t=fc(D(n,s),r,t)}),!t.getChild(n).isEmpty()&&i!==null&&(t=t.updateChild(D(n,".priority"),i)),t}}function Or(n,e){return _c(e,n)}function mh(n,e,t,i,s){p(i>n.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),n.allWrites.push({path:e,snap:t,writeId:i,visible:s}),s&&(n.visibleWrites=$t(n.visibleWrites,e,t)),n.lastWriteId=i}function gh(n,e,t,i){p(i>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:i,visible:!0}),n.visibleWrites=nr(n.visibleWrites,e,t),n.lastWriteId=i}function _h(n,e){for(let t=0;t<n.allWrites.length;t++){let i=n.allWrites[t];if(i.writeId===e)return i}return null}function yh(n,e){let t=n.allWrites.findIndex(a=>a.writeId===e);p(t>=0,"removeWrite called with nonexistent writeId.");let i=n.allWrites[t];n.allWrites.splice(t,1);let s=i.visible,r=!1,o=n.allWrites.length-1;for(;s&&o>=0;){let a=n.allWrites[o];a.visible&&(o>=t&&wh(a,i.path)?s=!1:te(i.path,a.path)&&(r=!0)),o--}if(s){if(r)return vh(n),!0;if(i.snap)n.visibleWrites=Ta(n.visibleWrites,i.path);else{let a=i.children;W(a,c=>{n.visibleWrites=Ta(n.visibleWrites,D(i.path,c))})}return!0}else return!1}function wh(n,e){if(n.snap)return te(n.path,e);for(let t in n.children)if(n.children.hasOwnProperty(t)&&te(D(n.path,t),e))return!0;return!1}function vh(n){n.visibleWrites=pc(n.allWrites,bh,k()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function bh(n){return n.visible}function pc(n,e,t){let i=ae.empty();for(let s=0;s<n.length;++s){let r=n[s];if(e(r)){let o=r.path,a;if(r.snap)te(t,o)?(a=Y(t,o),i=$t(i,a,r.snap)):te(o,t)&&(a=Y(o,t),i=$t(i,k(),r.snap.getChild(a)));else if(r.children){if(te(t,o))a=Y(t,o),i=nr(i,a,r.children);else if(te(o,t))if(a=Y(o,t),C(a))i=nr(i,k(),r.children);else{let c=Be(r.children,T(a));if(c){let l=c.getChild(O(a));i=$t(i,k(),l)}}}else throw We("WriteRecord should have .snap or .children")}}return i}function mc(n,e,t,i,s){if(!i&&!s){let r=Qe(n.visibleWrites,e);if(r!=null)return r;{let o=Oe(n.visibleWrites,e);if(sr(o))return t;if(t==null&&!ir(o,k()))return null;{let a=t||I.EMPTY_NODE;return bt(o,a)}}}else{let r=Oe(n.visibleWrites,e);if(!s&&sr(r))return t;if(!s&&t==null&&!ir(r,k()))return null;{let o=function(l){return(l.visible||s)&&(!i||!~i.indexOf(l.writeId))&&(te(l.path,e)||te(e,l.path))},a=pc(n.allWrites,o,e),c=t||I.EMPTY_NODE;return bt(a,c)}}}function Ih(n,e,t){let i=I.EMPTY_NODE,s=Qe(n.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(L,(r,o)=>{i=i.updateImmediateChild(r,o)}),i;if(t){let r=Oe(n.visibleWrites,e);return t.forEachChild(L,(o,a)=>{let c=bt(Oe(r,new A(o)),a);i=i.updateImmediateChild(o,c)}),Ca(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{let r=Oe(n.visibleWrites,e);return Ca(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function Eh(n,e,t,i,s){p(i||s,"Either existingEventSnap or existingServerSnap must exist");let r=D(e,t);if(ir(n.visibleWrites,r))return null;{let o=Oe(n.visibleWrites,r);return sr(o)?s.getChild(t):bt(o,s.getChild(t))}}function Th(n,e,t,i){let s=D(e,t),r=Qe(n.visibleWrites,s);if(r!=null)return r;if(i.isCompleteForChild(t)){let o=Oe(n.visibleWrites,s);return bt(o,i.getNode().getImmediateChild(t))}else return null}function Ch(n,e){return Qe(n.visibleWrites,e)}function Sh(n,e,t,i,s,r,o){let a,c=Oe(n.visibleWrites,e),l=Qe(c,k());if(l!=null)a=l;else if(t!=null)a=bt(c,t);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){let d=[],u=o.getCompare(),h=r?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o),g=h.getNext();for(;g&&d.length<s;)u(g,i)!==0&&d.push(g),g=h.getNext();return d}else return[]}function xh(){return{visibleWrites:ae.empty(),allWrites:[],lastWriteId:-1}}function jn(n,e,t,i){return mc(n.writeTree,n.treePath,e,t,i)}function Dr(n,e){return Ih(n.writeTree,n.treePath,e)}function Sa(n,e,t,i){return Eh(n.writeTree,n.treePath,e,t,i)}function qn(n,e){return Ch(n.writeTree,D(n.treePath,e))}function kh(n,e,t,i,s,r){return Sh(n.writeTree,n.treePath,e,t,i,s,r)}function Lr(n,e,t){return Th(n.writeTree,n.treePath,e,t)}function gc(n,e){return _c(D(n.treePath,e),n.writeTree)}function _c(n,e){return{treePath:n,writeTree:e}}var rr=class{constructor(){this.changeMap=new Map}trackChildChange(e){let t=e.type,i=e.childName;p(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),p(i!==".priority","Only non-priority child changes can be tracked.");let s=this.changeMap.get(i);if(s){let r=s.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(i,Kt(i,e.snapshotNode,s.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(i);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(i,Gt(i,s.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(i,wt(i,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(i,Kt(i,e.snapshotNode,s.oldSnap));else throw We("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}};var or=class{getCompleteChild(e){return null}getChildAfterChild(e,t,i){return null}},yc=new or,Xt=class{constructor(e,t,i=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=i}getCompleteChild(e){let t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{let i=this.optCompleteServerCache_!=null?new Ie(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Lr(this.writes_,e,i)}}getChildAfterChild(e,t,i){let s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Je(this.viewCache_),r=kh(this.writes_,s,t,1,i,e);return r.length===0?null:r[0]}};function Ah(n){return{filter:n}}function Rh(n,e){p(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),p(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function Nh(n,e,t,i,s){let r=new rr,o,a;if(t.type===oe.OVERWRITE){let l=t;l.source.fromUser?o=ar(n,e,l.path,l.snap,i,s,r):(p(l.source.fromServer,"Unknown source."),a=l.source.tagged||e.serverCache.isFiltered()&&!C(l.path),o=Gn(n,e,l.path,l.snap,i,s,a,r))}else if(t.type===oe.MERGE){let l=t;l.source.fromUser?o=Oh(n,e,l.path,l.children,i,s,r):(p(l.source.fromServer,"Unknown source."),a=l.source.tagged||e.serverCache.isFiltered(),o=cr(n,e,l.path,l.children,i,s,a,r))}else if(t.type===oe.ACK_USER_WRITE){let l=t;l.revert?o=Mh(n,e,l.path,i,s,r):o=Dh(n,e,l.path,l.affectedTree,i,s,r)}else if(t.type===oe.LISTEN_COMPLETE)o=Lh(n,e,t.path,i,r);else throw We("Unknown operation type: "+t.type);let c=r.getChanges();return Ph(e,o,c),{viewCache:o,changes:c}}function Ph(n,e,t){let i=e.eventCache;if(i.isFullyInitialized()){let s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=tr(n);(t.length>0||!n.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&t.push(uc(tr(e)))}}function wc(n,e,t,i,s,r){let o=e.eventCache;if(qn(i,t)!=null)return e;{let a,c;if(C(t))if(p(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){let l=Je(e),d=l instanceof I?l:I.EMPTY_NODE,u=Dr(i,d);a=n.filter.updateFullNode(e.eventCache.getNode(),u,r)}else{let l=jn(i,Je(e));a=n.filter.updateFullNode(e.eventCache.getNode(),l,r)}else{let l=T(t);if(l===".priority"){p(De(t)===1,"Can't have a priority with additional path components");let d=o.getNode();c=e.serverCache.getNode();let u=Sa(i,t,d,c);u!=null?a=n.filter.updatePriority(d,u):a=o.getNode()}else{let d=O(t),u;if(o.isCompleteForChild(l)){c=e.serverCache.getNode();let h=Sa(i,t,o.getNode(),c);h!=null?u=o.getNode().getImmediateChild(l).updateChild(d,h):u=o.getNode().getImmediateChild(l)}else u=Lr(i,l,e.serverCache);u!=null?a=n.filter.updateChild(o.getNode(),l,u,d,s,r):a=o.getNode()}}return Ht(e,a,o.isFullyInitialized()||C(t),n.filter.filtersNodes())}}function Gn(n,e,t,i,s,r,o,a){let c=e.serverCache,l,d=o?n.filter:n.filter.getIndexedFilter();if(C(t))l=d.updateFullNode(c.getNode(),i,null);else if(d.filtersNodes()&&!c.isFiltered()){let g=c.getNode().updateChild(t,i);l=d.updateFullNode(c.getNode(),g,null)}else{let g=T(t);if(!c.isCompleteForPath(t)&&De(t)>1)return e;let m=O(t),f=c.getNode().getImmediateChild(g).updateChild(m,i);g===".priority"?l=d.updatePriority(c.getNode(),f):l=d.updateChild(c.getNode(),g,f,m,yc,null)}let u=hc(e,l,c.isFullyInitialized()||C(t),d.filtersNodes()),h=new Xt(s,u,r);return wc(n,u,t,s,h,a)}function ar(n,e,t,i,s,r,o){let a=e.eventCache,c,l,d=new Xt(s,e,r);if(C(t))l=n.filter.updateFullNode(e.eventCache.getNode(),i,o),c=Ht(e,l,!0,n.filter.filtersNodes());else{let u=T(t);if(u===".priority")l=n.filter.updatePriority(e.eventCache.getNode(),i),c=Ht(e,l,a.isFullyInitialized(),a.isFiltered());else{let h=O(t),g=a.getNode().getImmediateChild(u),m;if(C(h))m=i;else{let v=d.getCompleteChild(u);v!=null?xr(h)===".priority"&&v.getChild(rc(h)).isEmpty()?m=v:m=v.updateChild(h,i):m=I.EMPTY_NODE}if(g.equals(m))c=e;else{let v=n.filter.updateChild(a.getNode(),u,m,h,d,o);c=Ht(e,v,a.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function xa(n,e){return n.eventCache.isCompleteForChild(e)}function Oh(n,e,t,i,s,r,o){let a=e;return i.foreach((c,l)=>{let d=D(t,c);xa(e,T(d))&&(a=ar(n,a,d,l,s,r,o))}),i.foreach((c,l)=>{let d=D(t,c);xa(e,T(d))||(a=ar(n,a,d,l,s,r,o))}),a}function ka(n,e,t){return t.foreach((i,s)=>{e=e.updateChild(i,s)}),e}function cr(n,e,t,i,s,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,l;C(t)?l=i:l=new K(null).setTree(t,i);let d=e.serverCache.getNode();return l.children.inorderTraversal((u,h)=>{if(d.hasChild(u)){let g=e.serverCache.getNode().getImmediateChild(u),m=ka(n,g,h);c=Gn(n,c,new A(u),m,s,r,o,a)}}),l.children.inorderTraversal((u,h)=>{let g=!e.serverCache.isCompleteForChild(u)&&h.value===null;if(!d.hasChild(u)&&!g){let m=e.serverCache.getNode().getImmediateChild(u),v=ka(n,m,h);c=Gn(n,c,new A(u),v,s,r,o,a)}}),c}function Dh(n,e,t,i,s,r,o){if(qn(s,t)!=null)return e;let a=e.serverCache.isFiltered(),c=e.serverCache;if(i.value!=null){if(C(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return Gn(n,e,t,c.getNode().getChild(t),s,r,a,o);if(C(t)){let l=new K(null);return c.getNode().forEachChild(pt,(d,u)=>{l=l.set(new A(d),u)}),cr(n,e,t,l,s,r,a,o)}else return e}else{let l=new K(null);return i.foreach((d,u)=>{let h=D(t,d);c.isCompleteForPath(h)&&(l=l.set(d,c.getNode().getChild(h)))}),cr(n,e,t,l,s,r,a,o)}}function Lh(n,e,t,i,s){let r=e.serverCache,o=hc(e,r.getNode(),r.isFullyInitialized()||C(t),r.isFiltered());return wc(n,o,t,i,yc,s)}function Mh(n,e,t,i,s,r){let o;if(qn(i,t)!=null)return e;{let a=new Xt(i,e,s),c=e.eventCache.getNode(),l;if(C(t)||T(t)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=jn(i,Je(e));else{let u=e.serverCache.getNode();p(u instanceof I,"serverChildren would be complete if leaf node"),d=Dr(i,u)}d=d,l=n.filter.updateFullNode(c,d,r)}else{let d=T(t),u=Lr(i,d,e.serverCache);u==null&&e.serverCache.isCompleteForChild(d)&&(u=c.getImmediateChild(d)),u!=null?l=n.filter.updateChild(c,d,u,O(t),a,r):e.eventCache.getNode().hasChild(d)?l=n.filter.updateChild(c,d,I.EMPTY_NODE,O(t),a,r):l=c,l.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=jn(i,Je(e)),o.isLeafNode()&&(l=n.filter.updateFullNode(l,o,r)))}return o=e.serverCache.isFullyInitialized()||qn(i,k())!=null,Ht(e,l,o,n.filter.filtersNodes())}}var lr=class{constructor(e,t){this.query_=e,this.eventRegistrations_=[];let i=this.query_._queryParams,s=new Yt(i.getIndex()),r=ah(i);this.processor_=Ah(r);let o=t.serverCache,a=t.eventCache,c=s.updateFullNode(I.EMPTY_NODE,o.getNode(),null),l=r.updateFullNode(I.EMPTY_NODE,a.getNode(),null),d=new Ie(c,o.isFullyInitialized(),s.filtersNodes()),u=new Ie(l,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=ii(u,d),this.eventGenerator_=new er(this.query_)}get query(){return this.query_}};function Fh(n){return n.viewCache_.serverCache.getNode()}function Uh(n,e){let t=Je(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!C(e)&&!t.getImmediateChild(T(e)).isEmpty())?t.getChild(e):null}function Aa(n){return n.eventRegistrations_.length===0}function Wh(n,e){n.eventRegistrations_.push(e)}function Ra(n,e,t){let i=[];if(t){p(e==null,"A cancel should cancel all event registrations.");let s=n.query._path;n.eventRegistrations_.forEach(r=>{let o=r.createCancelEvent(t,s);o&&i.push(o)})}if(e){let s=[];for(let r=0;r<n.eventRegistrations_.length;++r){let o=n.eventRegistrations_[r];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=s}else n.eventRegistrations_=[];return i}function Na(n,e,t,i){e.type===oe.MERGE&&e.source.queryId!==null&&(p(Je(n.viewCache_),"We should always have a full cache before handling merges"),p(tr(n.viewCache_),"Missing event cache, even though we have a server cache"));let s=n.viewCache_,r=Nh(n.processor_,s,e,t,i);return Rh(n.processor_,r.viewCache),p(r.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,vc(n,r.changes,r.viewCache.eventCache.getNode(),null)}function Bh(n,e){let t=n.viewCache_.eventCache,i=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(L,(r,o)=>{i.push(wt(r,o))}),t.isFullyInitialized()&&i.push(uc(t.getNode())),vc(n,i,t.getNode(),e)}function vc(n,e,t,i){let s=i?[i]:n.eventRegistrations_;return uh(n.eventGenerator_,e,t,s)}var Kn,dr=class{constructor(){this.views=new Map}};function Vh(n){p(!Kn,"__referenceConstructor has already been defined"),Kn=n}function zh(){return p(Kn,"Reference.ts has not been loaded"),Kn}function Hh(n){return n.views.size===0}function Mr(n,e,t,i){let s=e.source.queryId;if(s!==null){let r=n.views.get(s);return p(r!=null,"SyncTree gave us an op for an invalid query."),Na(r,e,t,i)}else{let r=[];for(let o of n.views.values())r=r.concat(Na(o,e,t,i));return r}}function $h(n,e,t,i,s){let r=e._queryIdentifier,o=n.views.get(r);if(!o){let a=jn(t,s?i:null),c=!1;a?c=!0:i instanceof I?(a=Dr(t,i),c=!1):(a=I.EMPTY_NODE,c=!1);let l=ii(new Ie(a,c,!1),new Ie(i,s,!1));return new lr(e,l)}return o}function jh(n,e,t,i,s,r){let o=$h(n,e,i,s,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),Wh(o,t),Bh(o,t)}function qh(n,e,t,i){let s=e._queryIdentifier,r=[],o=[],a=Le(n);if(s==="default")for(let[c,l]of n.views.entries())o=o.concat(Ra(l,t,i)),Aa(l)&&(n.views.delete(c),l.query._queryParams.loadsAllData()||r.push(l.query));else{let c=n.views.get(s);c&&(o=o.concat(Ra(c,t,i)),Aa(c)&&(n.views.delete(s),c.query._queryParams.loadsAllData()||r.push(c.query)))}return a&&!Le(n)&&r.push(new(zh())(e._repo,e._path)),{removed:r,events:o}}function bc(n){let e=[];for(let t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function mt(n,e){let t=null;for(let i of n.views.values())t=t||Uh(i,e);return t}function Ic(n,e){if(e._queryParams.loadsAllData())return si(n);{let i=e._queryIdentifier;return n.views.get(i)}}function Ec(n,e){return Ic(n,e)!=null}function Le(n){return si(n)!=null}function si(n){for(let e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}var Yn;function Gh(n){p(!Yn,"__referenceConstructor has already been defined"),Yn=n}function Kh(){return p(Yn,"Reference.ts has not been loaded"),Yn}var Yh=1,Jn=class{constructor(e){this.listenProvider_=e,this.syncPointTree_=new K(null),this.pendingWriteTree_=xh(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}};function Tc(n,e,t,i,s){return mh(n.pendingWriteTree_,e,t,i,s),s?St(n,new vt(Rr(),e,t)):[]}function Jh(n,e,t,i){gh(n.pendingWriteTree_,e,t,i);let s=K.fromObject(t);return St(n,new Jt(Rr(),e,s))}function Ne(n,e,t=!1){let i=_h(n.pendingWriteTree_,e);if(yh(n.pendingWriteTree_,e)){let r=new K(null);return i.snap!=null?r=r.set(k(),!0):W(i.children,o=>{r=r.set(new A(o),!0)}),St(n,new Zs(i.path,r,t))}else return[]}function ri(n,e,t){return St(n,new vt(Nr(),e,t))}function Xh(n,e,t){let i=K.fromObject(t);return St(n,new Jt(Nr(),e,i))}function Qh(n,e){return St(n,new $n(Nr(),e))}function Zh(n,e,t){let i=Ur(n,t);if(i){let s=Wr(i),r=s.path,o=s.queryId,a=Y(r,e),c=new $n(Pr(o),a);return Br(n,r,c)}else return[]}function ur(n,e,t,i,s=!1){let r=e._path,o=n.syncPointTree_.get(r),a=[];if(o&&(e._queryIdentifier==="default"||Ec(o,e))){let c=qh(o,e,t,i);Hh(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));let l=c.removed;if(a=c.events,!s){let d=l.findIndex(h=>h._queryParams.loadsAllData())!==-1,u=n.syncPointTree_.findOnPath(r,(h,g)=>Le(g));if(d&&!u){let h=n.syncPointTree_.subtree(r);if(!h.isEmpty()){let g=nf(h);for(let m=0;m<g.length;++m){let v=g[m],f=v.query,_=xc(n,v);n.listenProvider_.startListening(jt(f),Xn(n,f),_.hashFn,_.onComplete)}}}!u&&l.length>0&&!i&&(d?n.listenProvider_.stopListening(jt(e),null):l.forEach(h=>{let g=n.queryToTagMap.get(oi(h));n.listenProvider_.stopListening(jt(h),g)}))}sf(n,l)}return a}function ef(n,e,t,i){let s=Ur(n,i);if(s!=null){let r=Wr(s),o=r.path,a=r.queryId,c=Y(o,e),l=new vt(Pr(a),c,t);return Br(n,o,l)}else return[]}function tf(n,e,t,i){let s=Ur(n,i);if(s){let r=Wr(s),o=r.path,a=r.queryId,c=Y(o,e),l=K.fromObject(t),d=new Jt(Pr(a),c,l);return Br(n,o,d)}else return[]}function Pa(n,e,t,i=!1){let s=e._path,r=null,o=!1;n.syncPointTree_.foreachOnPath(s,(h,g)=>{let m=Y(h,s);r=r||mt(g,m),o=o||Le(g)});let a=n.syncPointTree_.get(s);a?(o=o||Le(a),r=r||mt(a,k())):(a=new dr,n.syncPointTree_=n.syncPointTree_.set(s,a));let c;r!=null?c=!0:(c=!1,r=I.EMPTY_NODE,n.syncPointTree_.subtree(s).foreachChild((g,m)=>{let v=mt(m,k());v&&(r=r.updateImmediateChild(g,v))}));let l=Ec(a,e);if(!l&&!e._queryParams.loadsAllData()){let h=oi(e);p(!n.queryToTagMap.has(h),"View does not exist, but we have a tag");let g=rf();n.queryToTagMap.set(h,g),n.tagToQueryMap.set(g,h)}let d=Or(n.pendingWriteTree_,s),u=jh(a,e,t,d,r,c);if(!l&&!o&&!i){let h=Ic(a,e);u=u.concat(of(n,e,h))}return u}function Fr(n,e,t){let s=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,a)=>{let c=Y(o,e),l=mt(a,c);if(l)return l});return mc(s,e,r,t,!0)}function St(n,e){return Cc(e,n.syncPointTree_,null,Or(n.pendingWriteTree_,k()))}function Cc(n,e,t,i){if(C(n.path))return Sc(n,e,t,i);{let s=e.get(k());t==null&&s!=null&&(t=mt(s,k()));let r=[],o=T(n.path),a=n.operationForChild(o),c=e.children.get(o);if(c&&a){let l=t?t.getImmediateChild(o):null,d=gc(i,o);r=r.concat(Cc(a,c,l,d))}return s&&(r=r.concat(Mr(s,n,i,t))),r}}function Sc(n,e,t,i){let s=e.get(k());t==null&&s!=null&&(t=mt(s,k()));let r=[];return e.children.inorderTraversal((o,a)=>{let c=t?t.getImmediateChild(o):null,l=gc(i,o),d=n.operationForChild(o);d&&(r=r.concat(Sc(d,a,c,l)))}),s&&(r=r.concat(Mr(s,n,i,t))),r}function xc(n,e){let t=e.query,i=Xn(n,t);return{hashFn:()=>(Fh(e)||I.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return i?Zh(n,t._path,i):Qh(n,t._path);{let r=yu(s,t);return ur(n,t,null,r)}}}}function Xn(n,e){let t=oi(e);return n.queryToTagMap.get(t)}function oi(n){return n._path.toString()+"$"+n._queryIdentifier}function Ur(n,e){return n.tagToQueryMap.get(e)}function Wr(n){let e=n.indexOf("$");return p(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new A(n.substr(0,e))}}function Br(n,e,t){let i=n.syncPointTree_.get(e);p(i,"Missing sync point for query tag that we're tracking");let s=Or(n.pendingWriteTree_,e);return Mr(i,t,s,null)}function nf(n){return n.fold((e,t,i)=>{if(t&&Le(t))return[si(t)];{let s=[];return t&&(s=bc(t)),W(i,(r,o)=>{s=s.concat(o)}),s}})}function jt(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(Kh())(n._repo,n._path):n}function sf(n,e){for(let t=0;t<e.length;++t){let i=e[t];if(!i._queryParams.loadsAllData()){let s=oi(i),r=n.queryToTagMap.get(s);n.queryToTagMap.delete(s),n.tagToQueryMap.delete(r)}}}function rf(){return Yh++}function of(n,e,t){let i=e._path,s=Xn(n,e),r=xc(n,t),o=n.listenProvider_.startListening(jt(e),s,r.hashFn,r.onComplete),a=n.syncPointTree_.subtree(i);if(s)p(!Le(a.value),"If we're adding a query, it shouldn't be shadowed");else{let c=a.fold((l,d,u)=>{if(!C(l)&&d&&Le(d))return[si(d).query];{let h=[];return d&&(h=h.concat(bc(d).map(g=>g.query))),W(u,(g,m)=>{h=h.concat(m)}),h}});for(let l=0;l<c.length;++l){let d=c[l];n.listenProvider_.stopListening(jt(d),Xn(n,d))}}return o}var hr=class n{constructor(e){this.node_=e}getImmediateChild(e){let t=this.node_.getImmediateChild(e);return new n(t)}node(){return this.node_}},fr=class n{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){let t=D(this.path_,e);return new n(this.syncTree_,t)}node(){return Fr(this.syncTree_,this.path_)}},af=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},Oa=function(n,e,t){if(!n||typeof n!="object")return n;if(p(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return cf(n[".sv"],e,t);if(typeof n[".sv"]=="object")return lf(n[".sv"],e);p(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},cf=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:p(!1,"Unexpected server value: "+n)}},lf=function(n,e,t){n.hasOwnProperty("increment")||p(!1,"Unexpected server value: "+JSON.stringify(n,null,2));let i=n.increment;typeof i!="number"&&p(!1,"Unexpected increment value: "+i);let s=e.node();if(p(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;let o=s.getValue();return typeof o!="number"?i:o+i},kc=function(n,e,t,i){return Vr(e,new fr(t,n),i)},Ac=function(n,e,t){return Vr(n,new hr(e),t)};function Vr(n,e,t){let i=n.getPriority().val(),s=Oa(i,e.getImmediateChild(".priority"),t),r;if(n.isLeafNode()){let o=n,a=Oa(o.getValue(),e,t);return a!==o.getValue()||s!==o.getPriority().val()?new be(a,M(s)):n}else{let o=n;return r=o,s!==o.getPriority().val()&&(r=r.updatePriority(new be(s))),o.forEachChild(L,(a,c)=>{let l=Vr(c,e.getImmediateChild(a),t);l!==c&&(r=r.updateImmediateChild(a,l))}),r}}var Qt=class{constructor(e="",t=null,i={children:{},childCount:0}){this.name=e,this.parent=t,this.node=i}};function zr(n,e){let t=e instanceof A?e:new A(e),i=n,s=T(t);for(;s!==null;){let r=Be(i.node.children,s)||{children:{},childCount:0};i=new Qt(s,i,r),t=O(t),s=T(t)}return i}function xt(n){return n.node.value}function Rc(n,e){n.node.value=e,pr(n)}function Nc(n){return n.node.childCount>0}function df(n){return xt(n)===void 0&&!Nc(n)}function ai(n,e){W(n.node.children,(t,i)=>{e(new Qt(t,n,i))})}function Pc(n,e,t,i){t&&!i&&e(n),ai(n,s=>{Pc(s,e,!0,i)}),t&&i&&e(n)}function uf(n,e,t){let i=t?n:n.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function nn(n){return new A(n.parent===null?n.name:nn(n.parent)+"/"+n.name)}function pr(n){n.parent!==null&&hf(n.parent,n.name,n)}function hf(n,e,t){let i=df(t),s=se(n.node.children,e);i&&s?(delete n.node.children[e],n.node.childCount--,pr(n)):!i&&!s&&(n.node.children[e]=t.node,n.node.childCount++,pr(n))}var ff=/[\[\].#$\/\u0000-\u001F\u007F]/,pf=/[\[\].#$\u0000-\u001F\u007F]/,Is=10*1024*1024,Hr=function(n){return typeof n=="string"&&n.length!==0&&!ff.test(n)},Oc=function(n){return typeof n=="string"&&n.length!==0&&!pf.test(n)},mf=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),Oc(n)},Dc=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!ni(n)||n&&typeof n=="object"&&se(n,".sv")},Qn=function(n,e,t,i){i&&e===void 0||ci(Ve(n,"value"),e,t)},ci=function(n,e,t){let i=t instanceof A?new Ms(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+$e(i));if(typeof e=="function")throw new Error(n+"contains a function "+$e(i)+" with contents = "+e.toString());if(ni(e))throw new Error(n+"contains "+e.toString()+" "+$e(i));if(typeof e=="string"&&e.length>Is/3&&Dt(e)>Is)throw new Error(n+"contains a string greater than "+Is+" utf8 bytes "+$e(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,r=!1;if(W(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!Hr(o)))throw new Error(n+" contains an invalid key ("+o+") "+$e(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Gu(i,o),ci(n,a,i),Ku(i)}),s&&r)throw new Error(n+' contains ".value" child '+$e(i)+" in addition to actual children.")}},gf=function(n,e){let t,i;for(t=0;t<e.length;t++){i=e[t];let r=qt(i);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!Hr(r[o]))throw new Error(n+"contains an invalid key ("+r[o]+") in path "+i.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(qu);let s=null;for(t=0;t<e.length;t++){if(i=e[t],s!==null&&te(s,i))throw new Error(n+"contains a path "+s.toString()+" that is ancestor of another path "+i.toString());s=i}},Lc=function(n,e,t,i){if(i&&e===void 0)return;let s=Ve(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(s+" must be an object containing the children to replace.");let r=[];W(e,(o,a)=>{let c=new A(o);if(ci(s,a,D(t,c)),xr(c)===".priority"&&!Dc(a))throw new Error(s+"contains an invalid value for '"+c.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(c)}),gf(s,r)},_f=function(n,e,t){if(!(t&&e===void 0)){if(ni(e))throw new Error(Ve(n,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Dc(e))throw new Error(Ve(n,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")}};var Mc=function(n,e,t,i){if(!(i&&t===void 0)&&!Oc(t))throw new Error(Ve(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},yf=function(n,e,t,i){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),Mc(n,e,t,i)},qe=function(n,e){if(T(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},wf=function(n,e){let t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Hr(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!mf(t))throw new Error(Ve(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};var mr=class{constructor(){this.eventLists_=[],this.recursionDepth_=0}};function li(n,e){let t=null;for(let i=0;i<e.length;i++){let s=e[i],r=s.getPath();t!==null&&!kr(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(s)}t&&n.eventLists_.push(t)}function Fc(n,e,t){li(n,t),Uc(n,i=>kr(i,e))}function ce(n,e,t){li(n,t),Uc(n,i=>te(i,e)||te(e,i))}function Uc(n,e){n.recursionDepth_++;let t=!0;for(let i=0;i<n.eventLists_.length;i++){let s=n.eventLists_[i];if(s){let r=s.path;e(r)?(vf(n.eventLists_[i]),n.eventLists_[i]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function vf(n){for(let e=0;e<n.events.length;e++){let t=n.events[e];if(t!==null){n.events[e]=null;let i=t.getEventRunner();Ge&&U("event: "+t.toString()),Tt(i)}}}var bf="repo_interrupt",If=25,gr=class{constructor(e,t,i,s){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=i,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new mr,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Hn(),this.transactionQueueTree_=new Qt,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}};function Ef(n,e,t){if(n.stats_=Sr(n.repoInfo_),n.forceRestClient_||Iu())n.server_=new Gs(n.repoInfo_,(i,s,r,o)=>{Da(n,i,s,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>La(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{F(t)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}n.persistentConnection_=new Ye(n.repoInfo_,e,(i,s,r,o)=>{Da(n,i,s,r,o)},i=>{La(n,i)},i=>{Tf(n,i)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(i=>{n.server_.refreshAuthToken(i)}),n.appCheckProvider_.addTokenChangeListener(i=>{n.server_.refreshAppCheckToken(i.token)}),n.statsReporter_=Tu(n.repoInfo_,()=>new Qs(n.stats_,n.server_)),n.infoData_=new Ks,n.infoSyncTree_=new Jn({startListening:(i,s,r,o)=>{let a=[],c=n.infoData_.getNode(i._path);return c.isEmpty()||(a=ri(n.infoSyncTree_,i._path,c),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),$r(n,"connected",!1),n.serverSyncTree_=new Jn({startListening:(i,s,r,o)=>(n.server_.listen(i,r,s,(a,c)=>{let l=o(a,c);ce(n.eventQueue_,i._path,l)}),[]),stopListening:(i,s)=>{n.server_.unlisten(i,s)}})}function Wc(n){let t=n.infoData_.getNode(new A(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function di(n){return af({timestamp:Wc(n)})}function Da(n,e,t,i,s){n.dataUpdateCount++;let r=new A(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(s)if(i){let c=Ot(t,l=>M(l));o=tf(n.serverSyncTree_,r,c,s)}else{let c=M(t);o=ef(n.serverSyncTree_,r,c,s)}else if(i){let c=Ot(t,l=>M(l));o=Xh(n.serverSyncTree_,r,c)}else{let c=M(t);o=ri(n.serverSyncTree_,r,c)}let a=r;o.length>0&&(a=It(n,r)),ce(n.eventQueue_,a,o)}function La(n,e){$r(n,"connected",e),e===!1&&xf(n)}function Tf(n,e){W(e,(t,i)=>{$r(n,t,i)})}function $r(n,e,t){let i=new A("/.info/"+e),s=M(t);n.infoData_.updateSnapshot(i,s);let r=ri(n.infoSyncTree_,i,s);ce(n.eventQueue_,i,r)}function jr(n){return n.nextWriteId_++}function Cf(n,e,t,i,s){ui(n,"set",{path:e.toString(),value:t,priority:i});let r=di(n),o=M(t,i),a=Fr(n.serverSyncTree_,e),c=Ac(o,a,r),l=jr(n),d=Tc(n.serverSyncTree_,e,c,l,!0);li(n.eventQueue_,d),n.server_.put(e.toString(),o.val(!0),(h,g)=>{let m=h==="ok";m||G("set at "+e+" failed: "+h);let v=Ne(n.serverSyncTree_,l,!m);ce(n.eventQueue_,e,v),Me(n,s,h,g)});let u=Gr(n,e);It(n,u),ce(n.eventQueue_,u,[])}function Sf(n,e,t,i){ui(n,"update",{path:e.toString(),value:t});let s=!0,r=di(n),o={};if(W(t,(a,c)=>{s=!1,o[a]=kc(D(e,a),M(c),n.serverSyncTree_,r)}),s)U("update() called with empty data.  Don't do anything."),Me(n,i,"ok",void 0);else{let a=jr(n),c=Jh(n.serverSyncTree_,e,o,a);li(n.eventQueue_,c),n.server_.merge(e.toString(),t,(l,d)=>{let u=l==="ok";u||G("update at "+e+" failed: "+l);let h=Ne(n.serverSyncTree_,a,!u),g=h.length>0?It(n,e):e;ce(n.eventQueue_,g,h),Me(n,i,l,d)}),W(t,l=>{let d=Gr(n,D(e,l));It(n,d)}),ce(n.eventQueue_,e,[])}}function xf(n){ui(n,"onDisconnectEvents");let e=di(n),t=Hn();Js(n.onDisconnect_,k(),(s,r)=>{let o=kc(s,r,n.serverSyncTree_,e);Ct(t,s,o)});let i=[];Js(t,k(),(s,r)=>{i=i.concat(ri(n.serverSyncTree_,s,r));let o=Gr(n,s);It(n,o)}),n.onDisconnect_=Hn(),ce(n.eventQueue_,k(),i)}function kf(n,e,t){n.server_.onDisconnectCancel(e.toString(),(i,s)=>{i==="ok"&&Ys(n.onDisconnect_,e),Me(n,t,i,s)})}function Ma(n,e,t,i){let s=M(t);n.server_.onDisconnectPut(e.toString(),s.val(!0),(r,o)=>{r==="ok"&&Ct(n.onDisconnect_,e,s),Me(n,i,r,o)})}function Af(n,e,t,i,s){let r=M(t,i);n.server_.onDisconnectPut(e.toString(),r.val(!0),(o,a)=>{o==="ok"&&Ct(n.onDisconnect_,e,r),Me(n,s,o,a)})}function Rf(n,e,t,i){if(ct(t)){U("onDisconnect().update() called with empty data.  Don't do anything."),Me(n,i,"ok",void 0);return}n.server_.onDisconnectMerge(e.toString(),t,(s,r)=>{s==="ok"&&W(t,(o,a)=>{let c=M(a);Ct(n.onDisconnect_,D(e,o),c)}),Me(n,i,s,r)})}function Nf(n,e,t){let i;T(e._path)===".info"?i=Pa(n.infoSyncTree_,e,t):i=Pa(n.serverSyncTree_,e,t),Fc(n.eventQueue_,e._path,i)}function Fa(n,e,t){let i;T(e._path)===".info"?i=ur(n.infoSyncTree_,e,t):i=ur(n.serverSyncTree_,e,t),Fc(n.eventQueue_,e._path,i)}function Pf(n){n.persistentConnection_&&n.persistentConnection_.interrupt(bf)}function ui(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),U(t,...e)}function Me(n,e,t,i){e&&Tt(()=>{if(t==="ok")e(null);else{let s=(t||"error").toUpperCase(),r=s;i&&(r+=": "+i);let o=new Error(r);o.code=s,e(o)}})}function Bc(n,e,t){return Fr(n.serverSyncTree_,e,t)||I.EMPTY_NODE}function qr(n,e=n.transactionQueueTree_){if(e||hi(n,e),xt(e)){let t=zc(n,e);p(t.length>0,"Sending zero length transaction queue"),t.every(s=>s.status===0)&&Of(n,nn(e),t)}else Nc(e)&&ai(e,t=>{qr(n,t)})}function Of(n,e,t){let i=t.map(l=>l.currentWriteId),s=Bc(n,e,i),r=s,o=s.hash();for(let l=0;l<t.length;l++){let d=t[l];p(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;let u=Y(e,d.path);r=r.updateChild(u,d.currentOutputSnapshotRaw)}let a=r.val(!0),c=e;n.server_.put(c.toString(),a,l=>{ui(n,"transaction put response",{path:c.toString(),status:l});let d=[];if(l==="ok"){let u=[];for(let h=0;h<t.length;h++)t[h].status=2,d=d.concat(Ne(n.serverSyncTree_,t[h].currentWriteId)),t[h].onComplete&&u.push(()=>t[h].onComplete(null,!0,t[h].currentOutputSnapshotResolved)),t[h].unwatcher();hi(n,zr(n.transactionQueueTree_,e)),qr(n,n.transactionQueueTree_),ce(n.eventQueue_,e,d);for(let h=0;h<u.length;h++)Tt(u[h])}else{if(l==="datastale")for(let u=0;u<t.length;u++)t[u].status===3?t[u].status=4:t[u].status=0;else{G("transaction at "+c.toString()+" failed: "+l);for(let u=0;u<t.length;u++)t[u].status=4,t[u].abortReason=l}It(n,e)}},o)}function It(n,e){let t=Vc(n,e),i=nn(t),s=zc(n,t);return Df(n,s,i),i}function Df(n,e,t){if(e.length===0)return;let i=[],s=[],o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){let c=e[a],l=Y(t,c.path),d=!1,u;if(p(l!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)d=!0,u=c.abortReason,s=s.concat(Ne(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=If)d=!0,u="maxretry",s=s.concat(Ne(n.serverSyncTree_,c.currentWriteId,!0));else{let h=Bc(n,c.path,o);c.currentInputSnapshot=h;let g=e[a].update(h.val());if(g!==void 0){ci("transaction failed: Data returned ",g,c.path);let m=M(g);typeof g=="object"&&g!=null&&se(g,".priority")||(m=m.updatePriority(h.getPriority()));let f=c.currentWriteId,_=di(n),b=Ac(m,h,_);c.currentOutputSnapshotRaw=m,c.currentOutputSnapshotResolved=b,c.currentWriteId=jr(n),o.splice(o.indexOf(f),1),s=s.concat(Tc(n.serverSyncTree_,c.path,b,c.currentWriteId,c.applyLocally)),s=s.concat(Ne(n.serverSyncTree_,f,!0))}else d=!0,u="nodata",s=s.concat(Ne(n.serverSyncTree_,c.currentWriteId,!0))}ce(n.eventQueue_,t,s),s=[],d&&(e[a].status=2,function(h){setTimeout(h,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(u==="nodata"?i.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):i.push(()=>e[a].onComplete(new Error(u),!1,null))))}hi(n,n.transactionQueueTree_);for(let a=0;a<i.length;a++)Tt(i[a]);qr(n,n.transactionQueueTree_)}function Vc(n,e){let t,i=n.transactionQueueTree_;for(t=T(e);t!==null&&xt(i)===void 0;)i=zr(i,t),e=O(e),t=T(e);return i}function zc(n,e){let t=[];return Hc(n,e,t),t.sort((i,s)=>i.order-s.order),t}function Hc(n,e,t){let i=xt(e);if(i)for(let s=0;s<i.length;s++)t.push(i[s]);ai(e,s=>{Hc(n,s,t)})}function hi(n,e){let t=xt(e);if(t){let i=0;for(let s=0;s<t.length;s++)t[s].status!==2&&(t[i]=t[s],i++);t.length=i,Rc(e,t.length>0?t:void 0)}ai(e,i=>{hi(n,i)})}function Gr(n,e){let t=nn(Vc(n,e)),i=zr(n.transactionQueueTree_,e);return uf(i,s=>{Es(n,s)}),Es(n,i),Pc(i,s=>{Es(n,s)}),t}function Es(n,e){let t=xt(e);if(t){let i=[],s=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(p(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(p(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),s=s.concat(Ne(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&i.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Rc(e,void 0):t.length=r+1,ce(n.eventQueue_,nn(e),s);for(let o=0;o<i.length;o++)Tt(i[o])}}function Lf(n){let e="",t=n.split("/");for(let i=0;i<t.length;i++)if(t[i].length>0){let s=t[i];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function Mf(n){let e={};n.charAt(0)==="?"&&(n=n.substring(1));for(let t of n.split("&")){if(t.length===0)continue;let i=t.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):G(`Invalid query segment '${t}' in query '${n}'`)}return e}var Ua=function(n,e){let t=Ff(n),i=t.namespace;t.domain==="firebase.com"&&ve(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&t.domain!=="localhost"&&ve("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||fu();let s=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new Dn(t.host,t.secure,i,s,e,"",i!==t.subdomain),path:new A(t.pathString)}},Ff=function(n){let e="",t="",i="",s="",r="",o=!0,a="https",c=443;if(typeof n=="string"){let l=n.indexOf("//");l>=0&&(a=n.substring(0,l-1),n=n.substring(l+2));let d=n.indexOf("/");d===-1&&(d=n.length);let u=n.indexOf("?");u===-1&&(u=n.length),e=n.substring(0,Math.min(d,u)),d<u&&(s=Lf(n.substring(d,u)));let h=Mf(n.substring(Math.min(n.length,u)));l=e.indexOf(":"),l>=0?(o=a==="https"||a==="wss",c=parseInt(e.substring(l+1),10)):l=e.length;let g=e.slice(0,l);if(g.toLowerCase()==="localhost")t="localhost";else if(g.split(".").length<=2)t=g;else{let m=e.indexOf(".");i=e.substring(0,m).toLowerCase(),t=e.substring(m+1),r=i}"ns"in h&&(r=h.ns)}return{host:e,port:c,domain:t,subdomain:i,secure:o,scheme:a,pathString:s,namespace:r}};var Wa="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",Uf=function(){let n=0,e=[];return function(t){let i=t===n;n=t;let s,r=new Array(8);for(s=7;s>=0;s--)r[s]=Wa.charAt(t%64),t=Math.floor(t/64);p(t===0,"Cannot push at time == 0");let o=r.join("");if(i){for(s=11;s>=0&&e[s]===63;s--)e[s]=0;e[s]++}else for(s=0;s<12;s++)e[s]=Math.floor(Math.random()*64);for(s=0;s<12;s++)o+=Wa.charAt(e[s]);return p(o.length===20,"nextPushId: Length should be 20."),o}}();var Zn=class{constructor(e,t,i,s){this.eventType=e,this.eventRegistration=t,this.snapshot=i,this.prevName=s}getPath(){let e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+F(this.snapshot.exportVal())}},ei=class{constructor(e,t,i){this.eventRegistration=e,this.error=t,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}};var _r=class{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return p(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}};var yr=class{constructor(e,t){this._repo=e,this._path=t}cancel(){let e=new z;return kf(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){qe("OnDisconnect.remove",this._path);let e=new z;return Ma(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){qe("OnDisconnect.set",this._path),Qn("OnDisconnect.set",e,this._path,!1);let t=new z;return Ma(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}setWithPriority(e,t){qe("OnDisconnect.setWithPriority",this._path),Qn("OnDisconnect.setWithPriority",e,this._path,!1),_f("OnDisconnect.setWithPriority",t,!1);let i=new z;return Af(this._repo,this._path,e,t,i.wrapCallback(()=>{})),i.promise}update(e){qe("OnDisconnect.update",this._path),Lc("OnDisconnect.update",e,this._path,!1);let t=new z;return Rf(this._repo,this._path,e,t.wrapCallback(()=>{})),t.promise}};var wr=class n{constructor(e,t,i,s){this._repo=e,this._path=t,this._queryParams=i,this._orderByCalled=s}get key(){return C(this._path)?null:xr(this._path)}get ref(){return new Ee(this._repo,this._path)}get _queryIdentifier(){let e=Ia(this._queryParams),t=Cr(e);return t==="{}"?"default":t}get _queryObject(){return Ia(this._queryParams)}isEqual(e){if(e=$(e),!(e instanceof n))return!1;let t=this._repo===e._repo,i=kr(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return t&&i&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+ju(this._path)}};var Ee=class n extends wr{constructor(e,t){super(e,t,new qs,!1)}get parent(){let e=rc(this._path);return e===null?null:new n(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}},ti=class n{constructor(e,t,i){this._node=e,this.ref=t,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){let t=new A(e),i=Et(this.ref,e);return new n(this._node.getChild(t),i,L)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,s)=>e(new n(s,Et(this.ref,i),L)))}hasChild(e){let t=new A(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}};function J(n,e){return n=$(n),n._checkNotDeleted("ref"),e!==void 0?Et(n._root,e):n._root}function Et(n,e){return n=$(n),T(n._path)===null?yf("child","path",e,!1):Mc("child","path",e,!1),new Ee(n._repo,D(n._path,e))}function $c(n){return n=$(n),new yr(n._repo,n._path)}function fi(n,e){n=$(n),qe("push",n._path),Qn("push",e,n._path,!0);let t=Wc(n._repo),i=Uf(t),s=Et(n,i),r=Et(n,i),o;return e!=null?o=sn(r,e).then(()=>r):o=Promise.resolve(r),s.then=o.then.bind(o),s.catch=o.then.bind(o,void 0),s}function pi(n){return qe("remove",n._path),sn(n,null)}function sn(n,e){n=$(n),qe("set",n._path),Qn("set",e,n._path,!1);let t=new z;return Cf(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function jc(n,e){Lc("update",e,n._path,!1);let t=new z;return Sf(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}var vr=class n{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){let i=t._queryParams.getIndex();return new Zn("value",this,new ti(e.snapshotNode,new Ee(t._repo,t._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new ei(this,e,t):null}matches(e){return e instanceof n?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}},br=class n{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t=e==="children_added"?"child_added":e;return t=t==="children_removed"?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new ei(this,e,t):null}createEvent(e,t){p(e.childName!=null,"Child events should have a childName.");let i=Et(new Ee(t._repo,t._path),e.childName),s=t._queryParams.getIndex();return new Zn(e.type,this,new ti(e.snapshotNode,i,s),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof n?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}};function Wf(n,e,t,i,s){let r;if(typeof i=="object"&&(r=void 0,s=i),typeof i=="function"&&(r=i),s&&s.onlyOnce){let c=t,l=(d,u)=>{Fa(n._repo,n,a),c(d,u)};l.userCallback=t.userCallback,l.context=t.context,t=l}let o=new _r(t,r||void 0),a=e==="value"?new vr(o):new br(e,o);return Nf(n._repo,n,a),()=>Fa(n._repo,n,a)}function mi(n,e,t,i){return Wf(n,"value",e,t,i)}Vh(Ee);Gh(Ee);var Bf="FIREBASE_DATABASE_EMULATOR_HOST",Ir={},Vf=!1;function zf(n,e,t,i){let s=e.lastIndexOf(":"),r=e.substring(0,s),o=ze(r);n.repoInfo_=new Dn(e,o,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),i&&(n.authTokenProvider_=i)}function Hf(n,e,t,i,s){let r=i||n.options.databaseURL;r===void 0&&(n.options.projectId||ve("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),U("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=Ua(r,s),a=o.repoInfo,c,l;typeof process<"u"&&process.env&&(l=process.env[Bf]),l?(c=!0,r=`http://${l}?ns=${a.namespace}`,o=Ua(r,s),a=o.repoInfo):c=!o.repoInfo.secure;let d=s&&c?new Pe(Pe.OWNER):new As(n.name,n.options,e);wf("Invalid Firebase Database URL",o),C(o.path)||ve("Database URL must point to the root of a Firebase Database (not including a child path).");let u=jf(a,n,d,new ks(n,t));return new Er(u,n)}function $f(n,e){let t=Ir[e];(!t||t[n.key]!==n)&&ve(`Database ${e}(${n.repoInfo_}) has already been deleted.`),Pf(n),delete t[n.key]}function jf(n,e,t,i){let s=Ir[e.name];s||(s={},Ir[e.name]=s);let r=s[n.toURLString()];return r&&ve("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new gr(n,Vf,t,i),s[n.toURLString()]=r,r}var Er=class{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(Ef(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Ee(this._repo,k())),this._rootInternal}_delete(){return this._rootInternal!==null&&($f(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&ve("Cannot call "+e+" on a deleted database.")}};function qc(n=Nn(),e){let t=Ft(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){let i=Oo("database");i&&qf(t,...i)}return t}function qf(n,e,t,i={}){n=$(n),n._checkNotDeleted("useEmulator");let s=`${e}:${t}`,r=n._repoInternal;if(n._instanceStarted){if(s===n._repoInternal.repoInfo_.host&&he(i,r.repoInfo_.emulatorOptions))return;ve("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&ve('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Pe(Pe.OWNER);else if(i.mockUserToken){let a=typeof i.mockUserToken=="string"?i.mockUserToken:Do(i.mockUserToken,n.app.options.projectId);o=new Pe(a)}ze(e)&&xn(e),zf(r,s,i,o)}function Gf(n){du(Re),Ae(new Z("database",(e,{instanceIdentifier:t})=>{let i=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return Hf(i,s,r,t)},"PUBLIC").setMultipleInstances(!0)),re(ra,oa,n),re(ra,oa,"esm2020")}Ye.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};Ye.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};Gf();function hl(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var fl=hl,pl=new _e("auth","Firebase",hl());var Ii=new xe("@firebase/auth");function Kf(n,...e){Ii.logLevel<=R.WARN&&Ii.warn(`Auth (${Re}): ${n}`,...e)}function _i(n,...e){Ii.logLevel<=R.ERROR&&Ii.error(`Auth (${Re}): ${n}`,...e)}function le(n,...e){throw yo(n,...e)}function me(n,...e){return yo(n,...e)}function ml(n,e,t){let i={...fl(),[e]:t};return new _e("auth","Firebase",i).create(e,{appName:n.name})}function Ze(n){return ml(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function yo(n,...e){if(typeof n!="string"){let t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=n.name),n._errorFactory.create(t,...i)}return pl.create(n,...e)}function w(n,e,...t){if(!n)throw yo(e,...t)}function pe(n){let e="INTERNAL ASSERTION FAILED: "+n;throw _i(e),new Error(e)}function Ce(n,e){n||pe(e)}function Zr(){return typeof self<"u"&&self.location?.href||""}function Yf(){return Gc()==="http:"||Gc()==="https:"}function Gc(){return typeof self<"u"&&self.location?.protocol||null}function Jf(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Yf()||Mo()||"connection"in navigator)?navigator.onLine:!0}function Xf(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}var et=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ce(t>e,"Short delay should be less than long delay!"),this.isMobile=Pt()||Sn()}get(){return Jf()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};function wo(n,e){Ce(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}var Ei=class{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;pe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;pe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;pe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};var Qf={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};var Zf=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ep=new et(3e4,6e4);function B(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function j(n,e,t,i,s={}){return gl(n,s,async()=>{let r={},o={};i&&(e==="GET"?o=i:r={body:JSON.stringify(i)});let a=Se({...o,key:n.config.apiKey}).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);let l={method:e,headers:c,...r};return Lo()||(l.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&ze(n.emulatorConfig.host)&&(l.credentials="include"),Ei.fetch()(await _l(n,n.config.apiHost,t,a),l)})}async function gl(n,e,t){n._canInitEmulator=!1;let i={...Qf,...e};try{let s=new eo(n),r=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();let o=await r.json();if("needConfirmation"in o)throw on(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{let a=r.ok?o.errorMessage:o.error.message,[c,l]=a.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw on(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw on(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw on(n,"user-disabled",o);let d=i[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw ml(n,d,l);le(n,d)}}catch(s){if(s instanceof ie)throw s;le(n,"network-request-failed",{message:String(s)})}}async function rt(n,e,t,i,s={}){let r=await j(n,e,t,i,s);return"mfaPendingCredential"in r&&le(n,"multi-factor-auth-required",{_serverResponse:r}),r}async function _l(n,e,t,i){let s=`${e}${t}?${i}`,r=n,o=r.config.emulator?wo(n.config,s):`${n.config.apiScheme}://${s}`;return Zf.includes(t)&&(await r._persistenceManagerAvailable,r._getPersistenceType()==="COOKIE")?r._getPersistence()._getFinalTarget(o).toString():o}function tp(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var eo=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(me(this.auth,"network-request-failed")),ep.get())})}};function on(n,e,t){let i={appName:n.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);let s=me(n,e,i);return s.customData._tokenResponse=t,s}function Kc(n){return n!==void 0&&n.enterprise!==void 0}var Ti=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return tp(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};async function yl(n,e){return j(n,"GET","/v2/recaptchaConfig",B(n,e))}async function np(n,e){return j(n,"POST","/v1/accounts:delete",e)}async function Ci(n,e){return j(n,"POST","/v1/accounts:lookup",e)}function an(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function wl(n,e=!1){let t=$(n),i=await t.getIdToken(e),s=vo(i);w(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");let r=typeof s.firebase=="object"?s.firebase:void 0,o=r?.sign_in_provider;return{claims:s,token:i,authTime:an(Kr(s.auth_time)),issuedAtTime:an(Kr(s.iat)),expirationTime:an(Kr(s.exp)),signInProvider:o||null,signInSecondFactor:r?.sign_in_second_factor||null}}function Kr(n){return Number(n)*1e3}function vo(n){let[e,t,i]=n.split(".");if(e===void 0||t===void 0||i===void 0)return _i("JWT malformed, contained fewer than 3 sections"),null;try{let s=ot(t);return s?JSON.parse(s):(_i("Failed to decode base64 JWT payload"),null)}catch(s){return _i("Caught error parsing JWT payload as JSON",s?.toString()),null}}function Yc(n){let e=vo(n);return w(e,"internal-error"),w(typeof e.exp<"u","internal-error"),w(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}async function un(n,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof ie&&ip(i)&&n.auth.currentUser===n&&await n.auth.signOut(),i}}function ip({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}var to=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){let t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;let i=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};var hn=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=an(this.lastLoginAt),this.creationTime=an(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};async function Si(n){let e=n.auth,t=await n.getIdToken(),i=await un(n,Ci(e,{idToken:t}));w(i?.users.length,e,"internal-error");let s=i.users[0];n._notifyReloadListener(s);let r=s.providerUserInfo?.length?bl(s.providerUserInfo):[],o=sp(n.providerData,r),a=n.isAnonymous,c=!(n.email&&s.passwordHash)&&!o?.length,l=a?c:!1,d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new hn(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(n,d)}async function vl(n){let e=$(n);await Si(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function sp(n,e){return[...n.filter(i=>!e.some(s=>s.providerId===i.providerId)),...e]}function bl(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}async function rp(n,e){let t=await gl(n,{},async()=>{let i=Se({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:r}=n.config,o=await _l(n,s,"/v1/token",`key=${r}`),a=await n._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";let c={method:"POST",headers:a,body:i};return n.emulatorConfig&&ze(n.emulatorConfig.host)&&(c.credentials="include"),Ei.fetch()(o,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function op(n,e){return j(n,"POST","/v2/accounts:revokeToken",B(n,e))}var cn=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){w(e.idToken,"internal-error"),w(typeof e.idToken<"u","internal-error"),w(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Yc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){w(e.length!==0,"internal-error");let t=Yc(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(w(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:i,refreshToken:s,expiresIn:r}=await rp(e,t);this.updateTokensAndExpiration(i,s,Number(r))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){let{refreshToken:i,accessToken:s,expirationTime:r}=t,o=new n;return i&&(w(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),s&&(w(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),r&&(w(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return pe("not implemented")}};function Fe(n,e){w(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var Ue=class n{constructor({uid:e,auth:t,stsTokenManager:i,...s}){this.providerId="firebase",this.proactiveRefresh=new to(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new hn(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){let t=await un(this,this.stsTokenManager.getToken(this.auth,e));return w(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return wl(this,e)}reload(){return vl(this)}_assign(e){this!==e&&(w(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){w(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await Si(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ee(this.auth.app))return Promise.reject(Ze(this.auth));let e=await this.getIdToken();return await un(this,np(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){let i=t.displayName??void 0,s=t.email??void 0,r=t.phoneNumber??void 0,o=t.photoURL??void 0,a=t.tenantId??void 0,c=t._redirectEventId??void 0,l=t.createdAt??void 0,d=t.lastLoginAt??void 0,{uid:u,emailVerified:h,isAnonymous:g,providerData:m,stsTokenManager:v}=t;w(u&&v,e,"internal-error");let f=cn.fromJSON(this.name,v);w(typeof u=="string",e,"internal-error"),Fe(i,e.name),Fe(s,e.name),w(typeof h=="boolean",e,"internal-error"),w(typeof g=="boolean",e,"internal-error"),Fe(r,e.name),Fe(o,e.name),Fe(a,e.name),Fe(c,e.name),Fe(l,e.name),Fe(d,e.name);let _=new n({uid:u,auth:e,email:s,emailVerified:h,displayName:i,isAnonymous:g,photoURL:o,phoneNumber:r,tenantId:a,stsTokenManager:f,createdAt:l,lastLoginAt:d});return m&&Array.isArray(m)&&(_.providerData=m.map(b=>({...b}))),c&&(_._redirectEventId=c),_}static async _fromIdTokenResponse(e,t,i=!1){let s=new cn;s.updateFromServerResponse(t);let r=new n({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:i});return await Si(r),r}static async _fromGetAccountInfoResponse(e,t,i){let s=t.users[0];w(s.localId!==void 0,"internal-error");let r=s.providerUserInfo!==void 0?bl(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!r?.length,a=new cn;a.updateFromIdToken(i);let c=new n({uid:s.localId,auth:e,stsTokenManager:a,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:r,metadata:new hn(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!r?.length};return Object.assign(c,l),c}};var Jc=new Map;function Te(n){Ce(n instanceof Function,"Expected a class definition");let e=Jc.get(n);return e?(Ce(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Jc.set(n,e),e)}var xi=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};xi.type="NONE";var no=xi;function yi(n,e,t){return`firebase:${n}:${e}:${t}`}var ki=class n{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;let{config:s,name:r}=this.auth;this.fullUserKey=yi(this.userKey,s.apiKey,r),this.fullPersistenceKey=yi("persistence",s.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){let t=await Ci(this.auth,{idToken:e}).catch(()=>{});return t?Ue._fromGetAccountInfoResponse(this.auth,t,e):null}return Ue._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new n(Te(no),e,i);let s=(await Promise.all(t.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l),r=s[0]||Te(no),o=yi(i,e.config.apiKey,e.name),a=null;for(let l of t)try{let d=await l._get(o);if(d){let u;if(typeof d=="string"){let h=await Ci(e,{idToken:d}).catch(()=>{});if(!h)break;u=await Ue._fromGetAccountInfoResponse(e,h,d)}else u=Ue._fromJSON(e,d);l!==r&&(a=u),r=l;break}}catch{}let c=s.filter(l=>l._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new n(r,e,i):(r=c[0],a&&await r._set(o,a.toJSON()),await Promise.all(t.map(async l=>{if(l!==r)try{await l._remove(o)}catch{}})),new n(r,e,i))}};function Xc(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Cl(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Il(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(xl(e))return"Blackberry";if(kl(e))return"Webos";if(El(e))return"Safari";if((e.includes("chrome/")||Tl(e))&&!e.includes("edge/"))return"Chrome";if(Sl(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=n.match(t);if(i?.length===2)return i[1]}return"Other"}function Il(n=H()){return/firefox\//i.test(n)}function El(n=H()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Tl(n=H()){return/crios\//i.test(n)}function Cl(n=H()){return/iemobile/i.test(n)}function Sl(n=H()){return/android/i.test(n)}function xl(n=H()){return/blackberry/i.test(n)}function kl(n=H()){return/webos/i.test(n)}function bo(n=H()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function ap(n=H()){return bo(n)&&!!window.navigator?.standalone}function cp(){return Fo()&&document.documentMode===10}function Al(n=H()){return bo(n)||Sl(n)||kl(n)||xl(n)||/windows phone/i.test(n)||Cl(n)}function Rl(n,e=[]){let t;switch(n){case"Browser":t=Xc(H());break;case"Worker":t=`${Xc(H())}-${n}`;break;default:t=n}let i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Re}/${i}`}var io=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let i=r=>new Promise((o,a)=>{try{let c=e(r);o(c)}catch(c){a(c)}});i.onAbort=t,this.queue.push(i);let s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(let s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i?.message})}}};async function lp(n,e={}){return j(n,"GET","/v2/passwordPolicy",B(n,e))}var dp=6,so=class{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??dp,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){let i=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let s=0;s<e.length;s++)i=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,s,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}};var ro=class{constructor(e,t,i,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ai(this),this.idTokenSubscription=new Ai(this),this.beforeStateQueue=new io(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=pl,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(r=>this._resolvePersistenceManagerAvailable=r)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Te(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await ki.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await Ci(this,{idToken:e}),i=await Ue._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(ee(this.app)){let r=this.app.settings.authIdToken;return r?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(r).then(o,o))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),i=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let r=this.redirectUser?._redirectEventId,o=i?._redirectEventId,a=await this.tryRedirectSignIn(e);(!r||r===o)&&a?.user&&(i=a.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(r){i=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(r))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return w(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Si(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Xf()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ee(this.app))return Promise.reject(Ze(this));let t=e?$(e):null;return t&&w(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&w(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ee(this.app)?Promise.reject(Ze(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ee(this.app)?Promise.reject(Ze(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Te(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await lp(this),t=new so(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new _e("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await op(this,i)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&Te(e)||this._popupRedirectResolver;w(t,this,"argument-error"),this.redirectPersistenceManager=await ki.create(this,[Te(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,s){if(this._deleted)return()=>{};let r=typeof t=="function"?t:t.next.bind(t),o=!1,a=this._isInitialized?Promise.resolve():this._initializationPromise;if(w(a,this,"internal-error"),a.then(()=>{o||r(this.currentUser)}),typeof t=="function"){let c=e.addObserver(t,i,s);return()=>{o=!0,c()}}else{let c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return w(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Rl(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);let i=await this._getAppCheckToken();return i&&(e["X-Firebase-AppCheck"]=i),e}async _getAppCheckToken(){if(ee(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&Kf(`Error while retrieving App Check token: ${e.error}`),e?.token}};function Rt(n){return $(n)}var Ai=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ho(t=>this.observer=t)}get next(){return w(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};var qi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function up(n){qi=n}function Nl(n){return qi.loadJS(n)}function hp(){return qi.recaptchaEnterpriseScript}function fp(){return qi.gapiScript}function Pl(n){return`__${n}${Math.floor(Math.random()*1e6)}`}var oo=class{constructor(){this.enterprise=new ao}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},ao=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};var pp="recaptcha-enterprise",ln="NO_RECAPTCHA",Qc="onFirebaseAuthREInstanceReady",fn=class n{constructor(e){this.type=pp,this.auth=Rt(e)}async verify(e="verify",t=!1){async function i(r){if(!t){if(r.tenantId==null&&r._agentRecaptchaConfig!=null)return r._agentRecaptchaConfig.siteKey;if(r.tenantId!=null&&r._tenantRecaptchaConfigs[r.tenantId]!==void 0)return r._tenantRecaptchaConfigs[r.tenantId].siteKey}return new Promise(async(o,a)=>{yl(r,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{let l=new Ti(c);return r.tenantId==null?r._agentRecaptchaConfig=l:r._tenantRecaptchaConfigs[r.tenantId]=l,o(l.siteKey)}}).catch(c=>{a(c)})})}function s(r,o,a){let c=window.grecaptcha;Kc(c)?c.enterprise.ready(()=>{c.enterprise.execute(r,{action:e}).then(l=>{o(l)}).catch(()=>{o(ln)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new oo().execute("siteKey",{action:"verify"}):new Promise((r,o)=>{i(this.auth).then(async a=>{if(!t&&Kc(window.grecaptcha)&&n.scriptInjectionDeferred)await n.scriptInjectionDeferred.promise,s(a,r,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=hp();c.length!==0&&(c+=a+`&onload=${Qc}`),n.scriptInjectionDeferred=new z,window[Qc]=()=>{n.scriptInjectionDeferred?.resolve()},Nl(c).then(()=>n.scriptInjectionDeferred?.promise).then(()=>{s(a,r,o)}).catch(l=>{o(l)})}}).catch(a=>{o(a)})})}};fn.scriptInjectionDeferred=null;async function rn(n,e,t,i=!1,s=!1){let r=new fn(n),o;if(s)o=ln;else try{o=await r.verify(t)}catch{o=await r.verify(t,!0)}let a={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){let c=a.phoneEnrollmentInfo.phoneNumber,l=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){let c=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return i?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function dn(n,e,t,i,s){if(s==="EMAIL_PASSWORD_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let r=await rn(n,e,t,t==="getOobCode");return i(n,r)}else return i(n,e).catch(async r=>{if(r.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let o=await rn(n,e,t,t==="getOobCode");return i(n,o)}else return Promise.reject(r)});else if(s==="PHONE_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER")){let r=await rn(n,e,t);return i(n,r).catch(async o=>{if(n._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER")==="AUDIT"&&(o.code==="auth/missing-recaptcha-token"||o.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let a=await rn(n,e,t,!1,!0);return i(n,a)}return Promise.reject(o)})}else{let r=await rn(n,e,t,!1,!0);return i(n,r)}else return Promise.reject(s+" provider is not supported.")}async function mp(n){let e=Rt(n),t=await yl(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),i=new Ti(t);e.tenantId==null?e._agentRecaptchaConfig=i:e._tenantRecaptchaConfigs[e.tenantId]=i,i.isAnyProviderEnabled()&&new fn(e).verify()}function Ol(n,e){let t=Ft(n,"auth");if(t.isInitialized()){let s=t.getImmediate(),r=t.getOptions();if(he(r,e??{}))return s;le(s,"already-initialized")}return t.initialize({options:e})}function gp(n,e){let t=e?.persistence||[],i=(Array.isArray(t)?t:[t]).map(Te);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(i,e?.popupRedirectResolver)}function Dl(n,e,t){let i=Rt(n);w(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");let s=!!t?.disableWarnings,r=Ll(e),{host:o,port:a}=_p(e),c=a===null?"":`:${a}`,l={url:`${r}//${o}${c}/`},d=Object.freeze({host:o,port:a,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!i._canInitEmulator){w(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),w(he(l,i.config.emulator)&&he(d,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=l,i.emulatorConfig=d,i.settings.appVerificationDisabledForTesting=!0,ze(o)?xn(`${r}//${o}${c}`):s||yp()}function Ll(n){let e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function _p(n){let e=Ll(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};let i=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(i);if(s){let r=s[1];return{host:r,port:Zc(i.substr(r.length+1))}}else{let[r,o]=i.split(":");return{host:r,port:Zc(o)}}}function Zc(n){if(!n)return null;let e=Number(n);return isNaN(e)?null:e}function yp(){function n(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}var tt=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return pe("not implemented")}_getIdTokenResponse(e){return pe("not implemented")}_linkToIdToken(e,t){return pe("not implemented")}_getReauthenticationResolver(e){return pe("not implemented")}};async function wp(n,e){return j(n,"POST","/v1/accounts:signUp",e)}async function vp(n,e){return rt(n,"POST","/v1/accounts:signInWithPassword",B(n,e))}async function bp(n,e){return rt(n,"POST","/v1/accounts:signInWithEmailLink",B(n,e))}async function Ip(n,e){return rt(n,"POST","/v1/accounts:signInWithEmailLink",B(n,e))}var pn=class n extends tt{constructor(e,t,i,s=null){super("password",i),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new n(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return dn(e,t,"signInWithPassword",vp,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return bp(e,{email:this._email,oobCode:this._password});default:le(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let i={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return dn(e,i,"signUpPassword",wp,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Ip(e,{idToken:t,email:this._email,oobCode:this._password});default:le(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};async function kt(n,e){return rt(n,"POST","/v1/accounts:signInWithIdp",B(n,e))}var Ep="http://localhost",nt=class n extends tt{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):le("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:s,...r}=t;if(!i||!s)return null;let o=new n(i,s);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){let t=this.buildRequest();return kt(e,t)}_linkToIdToken(e,t){let i=this.buildRequest();return i.idToken=t,kt(e,i)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,kt(e,t)}buildRequest(){let e={requestUri:Ep,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Se(t)}return e}};async function el(n,e){return j(n,"POST","/v1/accounts:sendVerificationCode",B(n,e))}async function Tp(n,e){return rt(n,"POST","/v1/accounts:signInWithPhoneNumber",B(n,e))}async function Cp(n,e){let t=await rt(n,"POST","/v1/accounts:signInWithPhoneNumber",B(n,e));if(t.temporaryProof)throw on(n,"account-exists-with-different-credential",t);return t}var Sp={USER_NOT_FOUND:"user-not-found"};async function xp(n,e){let t={...e,operation:"REAUTH"};return rt(n,"POST","/v1/accounts:signInWithPhoneNumber",B(n,t),Sp)}var mn=class n extends tt{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return Tp(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Cp(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return xp(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:i,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:i,code:s}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:i,phoneNumber:s,temporaryProof:r}=e;return!i&&!t&&!s&&!r?null:new n({verificationId:t,verificationCode:i,phoneNumber:s,temporaryProof:r})}};function kp(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Ap(n){let e=lt(dt(n)).link,t=e?lt(dt(e)).deep_link_id:null,i=lt(dt(n)).deep_link_id;return(i?lt(dt(i)).link:null)||i||t||e||n}var Ri=class n{constructor(e){let t=lt(dt(e)),i=t.apiKey??null,s=t.oobCode??null,r=kp(t.mode??null);w(i&&s&&r,"argument-error"),this.apiKey=i,this.operation=r,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){let t=Ap(e);try{return new n(t)}catch{return null}}};var At=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return pn._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let i=Ri.parseLink(t);return w(i,"argument-error"),pn._fromEmailAndCode(e,i.code,i.tenantId)}};At.PROVIDER_ID="password";At.EMAIL_PASSWORD_SIGN_IN_METHOD="password";At.EMAIL_LINK_SIGN_IN_METHOD="emailLink";var Ni=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};var it=class extends Ni{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};var gn=class n extends it{constructor(){super("facebook.com")}static credential(e){return nt._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};gn.FACEBOOK_SIGN_IN_METHOD="facebook.com";gn.PROVIDER_ID="facebook.com";var _n=class n extends it{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return nt._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return n.credential(t,i)}catch{return null}}};_n.GOOGLE_SIGN_IN_METHOD="google.com";_n.PROVIDER_ID="google.com";var yn=class n extends it{constructor(){super("github.com")}static credential(e){return nt._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};yn.GITHUB_SIGN_IN_METHOD="github.com";yn.PROVIDER_ID="github.com";var wn=class n extends it{constructor(){super("twitter.com")}static credential(e,t){return nt._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return n.credential(t,i)}catch{return null}}};wn.TWITTER_SIGN_IN_METHOD="twitter.com";wn.PROVIDER_ID="twitter.com";var vn=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,s=!1){let r=await Ue._fromIdTokenResponse(e,i,s),o=tl(i);return new n({user:r,providerId:o,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);let s=tl(i);return new n({user:e,providerId:s,_tokenResponse:i,operationType:t})}};function tl(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}var co=class n extends ie{constructor(e,t,i,s){super(t.code,t.message),this.operationType=i,this.user=s,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,s){return new n(e,t,i,s)}};function Ml(n,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?co._fromErrorAndOperation(n,r,e,i):r})}async function Rp(n,e,t=!1){let i=await un(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return vn._forOperation(n,"link",i)}async function Np(n,e,t=!1){let{auth:i}=n;if(ee(i.app))return Promise.reject(Ze(i));let s="reauthenticate";try{let r=await un(n,Ml(i,s,e,n),t);w(r.idToken,i,"internal-error");let o=vo(r.idToken);w(o,i,"internal-error");let{sub:a}=o;return w(n.uid===a,i,"user-mismatch"),vn._forOperation(n,s,r)}catch(r){throw r?.code==="auth/user-not-found"&&le(i,"user-mismatch"),r}}async function Pp(n,e,t=!1){if(ee(n.app))return Promise.reject(Ze(n));let i="signIn",s=await Ml(n,i,e),r=await vn._fromIdTokenResponse(n,i,s);return t||await n._updateCurrentUser(r.user),r}function Fl(n,e,t,i){return $(n).onIdTokenChanged(e,t,i)}function Ul(n,e,t){return $(n).beforeAuthStateChanged(e,t)}function nl(n,e){return j(n,"POST","/v2/accounts/mfaEnrollment:start",B(n,e))}function Op(n,e){return j(n,"POST","/v2/accounts/mfaEnrollment:finalize",B(n,e))}function Dp(n,e){return j(n,"POST","/v2/accounts/mfaEnrollment:start",B(n,e))}function Lp(n,e){return j(n,"POST","/v2/accounts/mfaEnrollment:finalize",B(n,e))}var Pi="__sak";var Oi=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Pi,"1"),this.storage.removeItem(Pi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};var Mp=1e3,Fp=10,Di=class extends Oi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Al(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let i=this.storage.getItem(t),s=this.localCache[t];i!==s&&e(t,s,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,c)=>{this.notifyListeners(o,c)});return}let i=e.key;t?this.detachListener():this.stopPolling();let s=()=>{let o=this.storage.getItem(i);!t&&this.localCache[i]===o||this.notifyListeners(i,o)},r=this.storage.getItem(i);cp()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Fp):s()}notifyListeners(e,t){this.localCache[e]=t;let i=this.listeners[e];if(i)for(let s of Array.from(i))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},Mp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};Di.type="LOCAL";var Wl=Di;var Up=1e3;function Yr(n){let e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return document.cookie.match(t)?.[1]??null}function Jr(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}var lo=class{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=Jr(e);return window.cookieStore?(await window.cookieStore.get(t))?.value:Yr(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let i=Jr(e);document.cookie=`${i}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;let i=Jr(e);if(window.cookieStore){let a=l=>{let d=l.changed.find(h=>h.name===i);d&&t(d.value),l.deleted.find(h=>h.name===i)&&t(null)},c=()=>window.cookieStore.removeEventListener("change",a);return this.listenerUnsubscribes.set(t,c),window.cookieStore.addEventListener("change",a)}let s=Yr(i),r=setInterval(()=>{let a=Yr(i);a!==s&&(t(a),s=a)},Up),o=()=>clearInterval(r);this.listenerUnsubscribes.set(t,o)}_removeListener(e,t){let i=this.listenerUnsubscribes.get(t);i&&(i(),this.listenerUnsubscribes.delete(t))}};lo.type="COOKIE";var Li=class extends Oi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};Li.type="SESSION";var Io=Li;function Wp(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}var Mi=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;let i=new n(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:i,eventType:s,data:r}=t.data,o=this.handlersMap[s];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:s});let a=Array.from(o).map(async l=>l(t.origin,r)),c=await Wp(a);t.ports[0].postMessage({status:"done",eventId:i,eventType:s,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};Mi.receivers=[];function Eo(n="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return n+t}var uo=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){let s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let r,o;return new Promise((a,c)=>{let l=Eo("",20);s.port1.start();let d=setTimeout(()=>{c(new Error("unsupported_event"))},i);o={messageChannel:s,onMessage(u){let h=u;if(h.data.eventId===l)switch(h.data.status){case"ack":clearTimeout(d),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),a(h.data.response);break;default:clearTimeout(d),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}};function ge(){return window}function Bp(n){ge().location.href=n}function Bl(){return typeof ge().WorkerGlobalScope<"u"&&typeof ge().importScripts=="function"}async function Vp(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function zp(){return navigator?.serviceWorker?.controller||null}function Hp(){return Bl()?self:null}var Vl="firebaseLocalStorageDb",$p=1,Fi="firebaseLocalStorage",zl="fbase_key",st=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function Gi(n,e){return n.transaction([Fi],e?"readwrite":"readonly").objectStore(Fi)}function jp(){let n=indexedDB.deleteDatabase(Vl);return new st(n).toPromise()}function Hl(){let n=indexedDB.open(Vl,$p);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let i=n.result;try{i.createObjectStore(Fi,{keyPath:zl})}catch(s){t(s)}}),n.addEventListener("success",async()=>{let i=n.result;i.objectStoreNames.contains(Fi)?e(i):(i.close(),await jp(),e(await Hl()))})})}async function il(n,e,t){let i=Gi(n,!0).put({[zl]:e,value:t});return new st(i).toPromise()}async function qp(n,e){let t=Gi(n,!1).get(e),i=await new st(t).toPromise();return i===void 0?null:i.value}function sl(n,e){let t=Gi(n,!0).delete(e);return new st(t).toPromise()}var Gp=800,Kp=3,Ui=class{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Hl(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{let i=await this._openDb();return await e(i)}catch(i){if(t++>Kp)throw i;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Bl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Mi._getInstance(Hp()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await Vp(),!this.activeServiceWorker)return;this.sender=new uo(this.activeServiceWorker);let e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||zp()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await il(e,Pi,"1"),await sl(e,Pi)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>il(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(i=>qp(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>sl(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(s=>{let r=Gi(s,!1).getAll();return new st(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],i=new Set;if(e.length!==0)for(let{fbase_key:s,value:r}of e)i.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(r)&&(this.notifyListeners(s,r),t.push(s));for(let s of Object.keys(this.localCache))this.localCache[s]&&!i.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;let i=this.listeners[e];if(i)for(let s of Array.from(i))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Gp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}};Ui.type="LOCAL";var $l=Ui;function rl(n,e){return j(n,"POST","/v2/accounts/mfaSignIn:start",B(n,e))}function Yp(n,e){return j(n,"POST","/v2/accounts/mfaSignIn:finalize",B(n,e))}function Jp(n,e){return j(n,"POST","/v2/accounts/mfaSignIn:finalize",B(n,e))}var Sg=Pl("rcb"),xg=new et(3e4,6e4);var wi="recaptcha";async function Xp(n,e,t){if(!n._getRecaptchaConfig())try{await mp(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let i;if(typeof e=="string"?i={phoneNumber:e}:i=e,"session"in i){let s=i.session;if("phoneNumber"in i){w(s.type==="enroll",n,"internal-error");let r={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await dn(n,r,"mfaSmsEnrollment",async(l,d)=>{if(d.phoneEnrollmentInfo.captchaResponse===ln){w(t?.type===wi,l,"argument-error");let u=await Xr(l,d,t);return nl(l,u)}return nl(l,d)},"PHONE_PROVIDER").catch(l=>Promise.reject(l))).phoneSessionInfo.sessionInfo}else{w(s.type==="signin",n,"internal-error");let r=i.multiFactorHint?.uid||i.multiFactorUid;w(r,n,"missing-multi-factor-info");let o={mfaPendingCredential:s.credential,mfaEnrollmentId:r,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await dn(n,o,"mfaSmsSignIn",async(d,u)=>{if(u.phoneSignInInfo.captchaResponse===ln){w(t?.type===wi,d,"argument-error");let h=await Xr(d,u,t);return rl(d,h)}return rl(d,u)},"PHONE_PROVIDER").catch(d=>Promise.reject(d))).phoneResponseInfo.sessionInfo}}else{let s={phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await dn(n,s,"sendVerificationCode",async(c,l)=>{if(l.captchaResponse===ln){w(t?.type===wi,c,"argument-error");let d=await Xr(c,l,t);return el(c,d)}return el(c,l)},"PHONE_PROVIDER").catch(c=>Promise.reject(c))).sessionInfo}}finally{t?._reset()}}async function Xr(n,e,t){w(t.type===wi,n,"argument-error");let i=await t.verify();w(typeof i=="string",n,"argument-error");let s={...e};if("phoneEnrollmentInfo"in s){let r=s.phoneEnrollmentInfo.phoneNumber,o=s.phoneEnrollmentInfo.captchaResponse,a=s.phoneEnrollmentInfo.clientType,c=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:r,recaptchaToken:i,captchaResponse:o,clientType:a,recaptchaVersion:c}}),s}else if("phoneSignInInfo"in s){let r=s.phoneSignInInfo.captchaResponse,o=s.phoneSignInInfo.clientType,a=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:i,captchaResponse:r,clientType:o,recaptchaVersion:a}}),s}else return Object.assign(s,{recaptchaToken:i}),s}var bn=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=Rt(e)}verifyPhoneNumber(e,t){return Xp(this.auth,e,$(t))}static credential(e,t){return mn._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:i}=e;return t&&i?mn._fromTokenResponse(t,i):null}};bn.PROVIDER_ID="phone";bn.PHONE_SIGN_IN_METHOD="phone";function Qp(n,e){return e?Te(e):(w(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}var In=class extends tt{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return kt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return kt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return kt(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function Zp(n){return Pp(n.auth,new In(n),n.bypassAuthState)}function em(n){let{auth:e,user:t}=n;return w(t,e,"internal-error"),Np(t,new In(n),n.bypassAuthState)}async function tm(n){let{auth:e,user:t}=n;return w(t,e,"internal-error"),Rp(t,new In(n),n.bypassAuthState)}var Wi=class{constructor(e,t,i,s,r=!1){this.auth=e,this.resolver=i,this.user=s,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:i,postBody:s,tenantId:r,error:o,type:a}=e;if(o){this.reject(o);return}let c={auth:this.auth,requestUri:t,sessionId:i,tenantId:r||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(c))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Zp;case"linkViaPopup":case"linkViaRedirect":return tm;case"reauthViaPopup":case"reauthViaRedirect":return em;default:le(this.auth,"internal-error")}}resolve(e){Ce(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ce(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};var nm=new et(2e3,1e4);var ho=class n extends Wi{constructor(e,t,i,s,r){super(e,t,s,r),this.provider=i,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return w(e,this.auth,"internal-error"),e}async onExecution(){Ce(this.filter.length===1,"Popup operations only handle one event");let e=Eo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(me(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(me(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(me(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,nm.get())};e()}};ho.currentPopupAction=null;var im="pendingRedirect",vi=new Map,fo=class extends Wi{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=vi.get(this.auth._key());if(!e){try{let i=await sm(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}vi.set(this.auth._key(),e)}return this.bypassAuthState||vi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function sm(n,e){let t=am(e),i=om(n);if(!await i._isAvailable())return!1;let s=await i._get(t)==="true";return await i._remove(t),s}function rm(n,e){vi.set(n._key(),e)}function om(n){return Te(n._redirectPersistence)}function am(n){return yi(im,n.config.apiKey,n.name)}async function cm(n,e,t=!1){if(ee(n.app))return Promise.reject(Ze(n));let i=Rt(n),s=Qp(i,e),o=await new fo(i,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}var lm=10*60*1e3,po=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!dm(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!jl(e)){let i=e.error.code?.split("auth/")[1]||"internal-error";t.onError(me(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=lm&&this.cachedEventUids.clear(),this.cachedEventUids.has(ol(e))}saveEventToCache(e){this.cachedEventUids.add(ol(e)),this.lastProcessedEventTime=Date.now()}};function ol(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function jl({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function dm(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return jl(n);default:return!1}}async function um(n,e={}){return j(n,"GET","/v1/projects",e)}var hm=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,fm=/^https?/;async function pm(n){if(n.config.emulator)return;let{authorizedDomains:e}=await um(n);for(let t of e)try{if(mm(t))return}catch{}le(n,"unauthorized-domain")}function mm(n){let e=Zr(),{protocol:t,hostname:i}=new URL(e);if(n.startsWith("chrome-extension://")){let o=new URL(n);return o.hostname===""&&i===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===i}if(!fm.test(t))return!1;if(hm.test(n))return i===n;let s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(i)}var gm=new et(3e4,6e4);function al(){let n=ge().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function _m(n){return new Promise((e,t)=>{function i(){al(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{al(),t(me(n,"network-request-failed"))},timeout:gm.get()})}if(ge().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(ge().gapi?.load)i();else{let s=Pl("iframefcb");return ge()[s]=()=>{gapi.load?i():t(me(n,"network-request-failed"))},Nl(`${fp()}?onload=${s}`).catch(r=>t(r))}}).catch(e=>{throw bi=null,e})}var bi=null;function ym(n){return bi=bi||_m(n),bi}var wm=new et(5e3,15e3),vm="__/auth/iframe",bm="emulator/auth/iframe",Im={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Em=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Tm(n){let e=n.config;w(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?wo(e,bm):`https://${n.config.authDomain}/${vm}`,i={apiKey:e.apiKey,appName:n.name,v:Re},s=Em.get(n.config.apiHost);s&&(i.eid=s);let r=n._getFrameworks();return r.length&&(i.fw=r.join(",")),`${t}?${Se(i).slice(1)}`}async function Cm(n){let e=await ym(n),t=ge().gapi;return w(t,n,"internal-error"),e.open({where:document.body,url:Tm(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Im,dontclear:!0},i=>new Promise(async(s,r)=>{await i.restyle({setHideOnLeave:!1});let o=me(n,"network-request-failed"),a=ge().setTimeout(()=>{r(o)},wm.get());function c(){ge().clearTimeout(a),s(i)}i.ping(c).then(c,()=>{r(o)})}))}var Sm={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},xm=500,km=600,Am="_blank",Rm="http://localhost",Bi=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function Nm(n,e,t,i=xm,s=km){let r=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString(),a="",c={...Sm,width:i.toString(),height:s.toString(),top:r,left:o},l=H().toLowerCase();t&&(a=Tl(l)?Am:t),Il(l)&&(e=e||Rm,c.scrollbars="yes");let d=Object.entries(c).reduce((h,[g,m])=>`${h}${g}=${m},`,"");if(ap(l)&&a!=="_self")return Pm(e||"",a),new Bi(null);let u=window.open(e||"",a,d);w(u,n,"popup-blocked");try{u.focus()}catch{}return new Bi(u)}function Pm(n,e){let t=document.createElement("a");t.href=n,t.target=e;let i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}var Om="__/auth/handler",Dm="emulator/auth/handler",Lm=encodeURIComponent("fac");async function cl(n,e,t,i,s,r){w(n.config.authDomain,n,"auth-domain-config-required"),w(n.config.apiKey,n,"invalid-api-key");let o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:i,v:Re,eventId:s};if(e instanceof Ni){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",ct(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(let[d,u]of Object.entries(r||{}))o[d]=u}if(e instanceof it){let d=e.getScopes().filter(u=>u!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);let a=o;for(let d of Object.keys(a))a[d]===void 0&&delete a[d];let c=await n._getAppCheckToken(),l=c?`#${Lm}=${encodeURIComponent(c)}`:"";return`${Mm(n)}?${Se(a).slice(1)}${l}`}function Mm({config:n}){return n.emulator?wo(n,Dm):`https://${n.authDomain}/${Om}`}var Qr="webStorageSupport",mo=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Io,this._completeRedirectFn=cm,this._overrideRedirectResult=rm}async _openPopup(e,t,i,s){Ce(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");let r=await cl(e,t,i,Zr(),s);return Nm(e,r,Eo())}async _openRedirect(e,t,i,s){await this._originValidation(e);let r=await cl(e,t,i,Zr(),s);return Bp(r),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:s,promise:r}=this.eventManagers[t];return s?Promise.resolve(s):(Ce(r,"If manager is not set, promise should be"),r)}let i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){let t=await Cm(e),i=new po(e);return t.register("authEvent",s=>(w(s?.authEvent,e,"invalid-auth-event"),{status:i.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Qr,{type:Qr},s=>{let r=s?.[0]?.[Qr];r!==void 0&&t(!!r),le(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=pm(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Al()||El()||bo()}},ql=mo,Vi=class{constructor(e){this.factorId=e}_process(e,t,i){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,i);case"signin":return this._finalizeSignIn(e,t.credential);default:return pe("unexpected MultiFactorSessionType")}}},go=class n extends Vi{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,i){return Op(e,{idToken:t,displayName:i,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return Yp(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},zi=class{constructor(){}static assertion(e){return go._fromCredential(e)}};zi.FACTOR_ID="phone";var Hi=class{static assertionForEnrollment(e,t){return $i._fromSecret(e,t)}static assertionForSignIn(e,t){return $i._fromEnrollmentId(e,t)}static async generateSecret(e){let t=e;w(typeof t.user?.auth<"u","internal-error");let i=await Dp(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return ji._fromStartTotpMfaEnrollmentResponse(i,t.user.auth)}};Hi.FACTOR_ID="totp";var $i=class n extends Vi{constructor(e,t,i){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=i}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,i){return w(typeof this.secret<"u",e,"argument-error"),Lp(e,{idToken:t,displayName:i,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){w(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let i={verificationCode:this.otp};return Jp(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:i})}},ji=class n{constructor(e,t,i,s,r,o,a){this.sessionInfo=o,this.auth=a,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=i,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=r}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let i=!1;return(gi(e)||gi(t))&&(i=!0),i&&(gi(e)&&(e=this.auth.currentUser?.email||"unknownuser"),gi(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function gi(n){return typeof n>"u"||n?.length===0}var ll="@firebase/auth",dl="1.13.3";var _o=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(i=>{e(i?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){w(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};function Fm(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Um(n){Ae(new Z("auth",(e,{options:t})=>{let i=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=i.options;w(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});let c={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Rl(n)},l=new ro(i,s,r,c);return gp(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Ae(new Z("auth-internal",e=>{let t=Rt(e.getProvider("auth").getImmediate());return(i=>new _o(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),re(ll,dl,Fm(n)),re(ll,dl,"esm2020")}var Wm=5*60,Bm=ns("authIdTokenMaxAge")||Wm,ul=null,Vm=n=>async e=>{let t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>Bm)return;let s=t?.token;ul!==s&&(ul=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function To(n=Nn()){let e=Ft(n,"auth");if(e.isInitialized())return e.getImmediate();let t=Ol(n,{popupRedirectResolver:ql,persistence:[$l,Wl,Io]}),i=ns("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){let r=new URL(i,location.origin);if(location.origin===r.origin){let o=Vm(r.toString());Ul(t,o,()=>o(t.currentUser)),Fl(t,a=>o(a))}}let s=es("auth");return s&&Dl(t,`http://${s}`),t}function zm(){return document.getElementsByTagName("head")?.[0]??document}up({loadJS(n){return new Promise((e,t)=>{let i=document.createElement("script");i.setAttribute("src",n),i.onload=e,i.onerror=s=>{let r=me("internal-error");r.customData=s,t(r)},i.type="text/javascript",i.charset="UTF-8",zm().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Um("Browser");var Gl=gs({apiKey:"AIzaSyBdYyhNaNJs-Xv8Fe4bOuAoXWNOb_1D_94",authDomain:"storewell-3d.firebaseapp.com",databaseURL:"https://storewell-3d-default-rtdb.firebaseio.com",projectId:"storewell-3d",storageBucket:"storewell-3d.firebasestorage.app",messagingSenderId:"1093355976155",appId:"1:1093355976155:web:33b21794eaf968d006e3fe"}),X=qc(Gl),q_=To(Gl);window._swDB=X;window.__swMobileLook=function(){try{let r=localStorage.getItem("sw_look_sens");r!=null&&(window._swLookSens=parseFloat(r));let o=localStorage.getItem("sw_walk_spd");o!=null&&(window._swWalkSpd=parseFloat(o));let a=localStorage.getItem("sw_turn_spd");a!=null&&(window._swTurnSpd=parseFloat(a))}catch{}if(!(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||navigator.maxTouchPoints>0))return;let e=setInterval(()=>{let r=document.querySelector("#sw-joy-wrap > div:last-child"),o=window.__swApp;!r||!o||r._swTouchBound||(r._swTouchBound=!0,clearInterval(e),r.addEventListener("touchstart",a=>{a.preventDefault(),o._joyStart(a)},{passive:!1}))},300),t=null,i=0,s=0;document.addEventListener("touchstart",r=>{for(let o of r.changedTouches){let a=document.getElementById("sw-joy-wrap"),c=a?a.getBoundingClientRect():null,l=c&&o.clientX>=c.left-20&&o.clientX<=c.right+20&&o.clientY>=c.top-20&&o.clientY<=c.bottom+20,d=o.clientX<window.innerWidth*.42;!l&&!d&&t===null&&(t=o.identifier,i=o.clientX,s=o.clientY)}},{passive:!0}),document.addEventListener("touchmove",r=>{for(let o of r.changedTouches){if(o.identifier!==t)continue;let a=o.clientX-i,c=o.clientY-s;i=o.clientX,s=o.clientY;let l=window.__swApp;if(!l||!l.cur)continue;let d=window._swLookSens!=null?window._swLookSens:8e-4;l.cur.h-=a*d,l.lookPitch=Math.max(-.8,Math.min(.5,l.lookPitch+c*d))}},{passive:!0}),document.addEventListener("touchend",r=>{for(let o of r.changedTouches)o.identifier===t&&(t=null)},{passive:!0})}();window.__swClearLog=async function(){try{await pi(J(X,"lockLog")),console.log("Log cleared")}catch(n){console.warn("clear failed",n)}};var xo={Kevin:"#2a6fdb",Mike:"#1f9d4d",Brad:"#9b3fcf"};function Kl(){try{return localStorage.getItem("sw_staff_name")||""}catch{return""}}async function Yl(n,e,t){try{if(t||(t=await(await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig/_tbKey.json")).json()),!t){console.warn("No tbKey for SMS");return}let i=JSON.stringify({phone:String(n).replace(/\D/g,""),message:String(e).slice(0,160),key:t}),s=async()=>await(await fetch("/sms",{method:"POST",headers:{"Content-Type":"application/json"},body:i})).json().catch(()=>({})),r=await s();return(!r||!r.success)&&(await new Promise(o=>setTimeout(o,2500)),r=await s()),!r||!r.success?console.warn("SMS not sent after retry",r):console.log("SMS sent, quota",r.quotaRemaining),r}catch(i){console.error("SMS",i)}}try{window.__swSMS=Yl}catch{}async function Hm(n,e,t,i,s){if(!(!s||!n))try{await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:"service_storewell",template_id:"sw_notify",user_id:s,template_params:{to_email:n,to_name:e,from_name:t,message:i}})})}catch(r){console.warn("email err",r)}}function $m(n,e,t){let i=document.createElement("div");i.style.cssText="position:fixed;bottom:80px;right:14px;z-index:99999;background:#1f2a33;color:#fff;border-radius:12px;padding:12px 14px;max-width:260px;font-family:Segoe UI,Arial;box-shadow:0 6px 24px rgba(0,0,0,.4)";let s=xo[n]||"#888",r=new Date(t).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});i.innerHTML='<div style="font-weight:800;font-size:13px;margin-bottom:6px"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+s+';margin-right:5px"></span>'+n+" \xB7 "+r+"</div>"+e.map(o=>'<div style="font-size:11px;color:#c8d6e0;margin:2px 0">\u2022 Unit '+o.label+": "+o.from+" \u2192 "+o.to+"</div>").join("")+'<button onclick="this.parentElement.remove()" style="margin-top:8px;width:100%;border:none;background:rgba(255,255,255,.12);color:#fff;border-radius:6px;padding:4px;cursor:pointer;font-size:11px">Dismiss</button>',document.body.appendChild(i),setTimeout(()=>{try{i.remove()}catch{}},3e4)}var Co=Date.now();mi(J(X,"staffReports"),n=>{let e=n.val()||{},t=Kl(),i=Co;Object.values(e).filter(s=>s.ts>Co&&s.name!==t).sort((s,r)=>s.ts-r.ts).forEach(s=>{i=Math.max(i,s.ts),$m(s.name,s.changes||[],s.ts)}),Co=Math.max(i,...Object.values(e).map(s=>s.ts||0))});window.__swAdminLoad=async function(){let e=await(await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json")).json()||{},t=window.__swApp;if(!t)return;let i=["Kevin","Mike","Brad"].map(s=>({name:s,color:xo[s],initial:s[0],email:"",phone:"",carrier:"",pref:"email",...e[s]||{}}));t.setState({adminContacts:i,ejsKey:e._ejsKey||""}),setTimeout(()=>{i.forEach(r=>{document.querySelectorAll(`[data-name="${r.name}"]`).forEach(o=>{let a=o.dataset.field;a&&r[a]!==void 0&&(o.value=r[a])})});let s=document.querySelector('[data-field="ejsKey"]');s&&(s.value=e._ejsKey||"")},300)};window.__swPanelOpen=async function(){if(document.getElementById("sw-cmd-panel"))return;let n=window.__swApp,e={};try{let f=await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json");e=(f.ok?await f.json():{})||{}}catch{}if(!document.getElementById("sw-cmd-style")){let f=document.createElement("style");f.id="sw-cmd-style",f.textContent=`
      #sw-cmd-panel *{box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif;}
      #sw-cmd-panel ::-webkit-scrollbar{width:4px;}
      #sw-cmd-panel ::-webkit-scrollbar-track{background:transparent;}
      #sw-cmd-panel ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:4px;}
      .sw-tab-btn{border:none;cursor:pointer;padding:8px 16px;font-size:12px;font-weight:700;letter-spacing:.4px;border-radius:8px;transition:all .2s;background:transparent;color:#4a6380;}
      .sw-tab-btn.active{background:#fff;color:#FF6B6B;box-shadow:0 -2px 0 #FF6B6B inset;font-weight:800;}
      .sw-tab-btn:hover:not(.active){color:#333;background:#f0f0f0;}
      .sw-stat-card{background:#0d1f35;border:1px solid #1e3a5f;border-radius:12px;padding:16px;text-align:center;}
      .sw-stat-val{font-size:28px;font-weight:800;line-height:1;}
      .sw-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#4a6380;margin-top:4px;}
      .sw-input{width:100%;box-sizing:border-box;background:#f4f7fb;border:1.5px solid #dbe4ef;border-radius:8px;padding:9px 12px;font-size:13px;color:#1f2a37;outline:none;transition:border .2s;}
      .sw-input:focus{border-color:#2a6fdb;background:#fff;}
      .sw-select{width:100%;box-sizing:border-box;background:#f4f7fb;border:1.5px solid #dbe4ef;border-radius:8px;padding:9px 12px;font-size:13px;color:#1f2a37;outline:none;}
      .sw-btn-primary{border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 13px 'Segoe UI';padding:10px 20px;border-radius:9px;box-shadow:0 2px 12px rgba(0,180,255,.3);transition:opacity .2s;}
      .sw-btn-primary:hover{opacity:.85;}
      .sw-btn-ghost{border:1px solid #1e3a5f;cursor:pointer;background:transparent;color:#8ab4d4;font:600 12px 'Segoe UI';padding:7px 14px;border-radius:8px;transition:all .2s;}
      .sw-btn-ghost:hover{border-color:#00b4ff44;color:#00b4ff;}
      .sw-row-item{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:#f4f7fb;border:1.5px solid #e3eaf3;margin-bottom:7px;box-shadow:0 1px 3px rgba(20,40,80,.05);}
      .sw-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:.3px;}
      @keyframes sw-slidein{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
      @keyframes sw-flash-red{0%{background:#ff0000;box-shadow:0 0 0 6px #ff000066,0 0 40px #ff0000,0 0 80px #ff000099;}50%{background:#ff6666;box-shadow:0 0 0 2px #ff000033,0 0 10px #ff0000;}100%{background:#ff0000;box-shadow:0 0 0 6px #ff000066,0 0 40px #ff0000,0 0 80px #ff000099;}}
      @keyframes sw-flash-green{0%{background:#00ff44;box-shadow:0 0 0 6px #00ff4466,0 0 40px #00ff44,0 0 80px #00ff4499;}50%{background:#66ffaa;box-shadow:0 0 0 2px #00ff4433,0 0 10px #00ff44;}100%{background:#00ff44;box-shadow:0 0 0 6px #00ff4466,0 0 40px #00ff44,0 0 80px #00ff4499;}}
    `,document.head.appendChild(f)}let t=document.createElement("div");t.id="sw-cmd-panel";let i="auto",s="60px",r="16px";try{let f=JSON.parse(localStorage.getItem("sw_cmd_pos")||"null");f&&(i=f.left,s=f.top,r=f.right||"auto")}catch{}t.style.cssText="position:fixed;top:"+s+";right:"+r+";left:"+i+";width:280px;height:auto;max-height:82vh;background:#ffffff;border-radius:18px;z-index:9000;display:flex;flex-direction:column;animation:sw-slidein .25s ease;box-shadow:0 12px 48px rgba(0,0,0,.25);overflow:hidden;";let o=["Kevin","Mike","Brad"].map(f=>({name:f,email:e[f]&&e[f].email||"",phone:e[f]&&e[f].phone||"",pref:e[f]&&e[f].pref||"email",color:f==="Kevin"?"#2a6fdb":f==="Mike"?"#1f9d4d":"#9b3fcf"}));function a(f){return["email","text","both","none"].map(_=>`<option value="${_}"${_===f?" selected":""}>${{email:"Email only",text:"Text only",both:"Email + Text",none:"No notifications"}[_]}</option>`).join("")}function c(){if(!n||!n._locks)return'<div style="color:#999;font-size:12px;padding:16px;text-align:center;">No data</div>';let f={blue:"#00aaff",red:"#ff1111",green:"#00ff44",white:"#ffffff",black:"#aaaaaa",yellow:"#ffee00",flashred:"#ff0000",flashgreen:"#00ff44"},_=[];return Object.keys(n._locks).sort().forEach(b=>{let E=n._locks[b],N=n._statusOf?n._statusOf(E.label):"green",x=f[N]||"#1f9d4d",y=N==="flashred"?"animation:sw-flash-red .5s infinite;":N==="flashgreen"?"animation:sw-flash-green .5s infinite;":"",P="swc-"+E.label.replace(/[^a-z0-9]/gi,"");_.push(`<div onclick="window.__swCycleNext('${E.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${E.label}'.replace(/[-\\s]/g,'').toUpperCase());window.__swApp&&window.__swApp.setState&&window.__swApp.setState({showSearch:false});" title="Left-click: change status | Right-click: find on map" style="cursor:pointer;padding:4px 2px;user-select:none;transition:transform .15s;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${P}" style="width:46px;height:46px;border-radius:50%;background:${x};box-shadow:0 4px 12px ${x}99;${y}display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${E.label}</span></div></div>`)}),'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'+_.join("")+"</div>"}function l(f){return!f||!f.length?'<div style="color:#4a6380;font-size:13px;padding:20px;text-align:center;">No activity yet</div>':f.slice().reverse().map(_=>{let b=new Date(_.t),E=b.toLocaleDateString([],{month:"short",day:"numeric"}),N=b.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`<div class="sw-row-item">
        <div style="flex:1;">
          <div style="color:#1f2a37;font-size:13px;font-weight:800;">${_.label}</div>
          <div style="color:#5b6b7d;font-size:11px;margin-top:2px;">${_.from} \u2192 <b style="color:#2a6fdb;">${_.to}</b></div>
          <div style="color:#8493a4;font-size:10px;margin-top:2px;">by ${_.who||"Staff"}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="color:#5b6b7d;font-size:11px;">${N}</div>
          <div style="color:#8493a4;font-size:10px;">${E}</div>
        </div>
      </div>`}).join("")}async function d(){try{let _=await(await fetch("https://storewell-3d-default-rtdb.firebaseio.com/lockLog.json")).json()||{},b=Object.values(_||{}).sort((x,y)=>y.t-x.t).slice(0,200),E=document.getElementById("sw-log-list"),N=document.getElementById("sw-ov-log");E&&(E.innerHTML=l(b)),N&&(N.innerHTML=l(b.slice(0,5)))}catch(f){console.warn("log load error",f)}}function u(){if(!n||!n._locks)return"";let f={};Object.keys(n._locks).forEach(Q=>{let de=n._statusOf?n._statusOf(n._locks[Q].label):"green";f[de]=(f[de]||0)+1});let _=Object.keys(n._locks).length,b=(f.green||0)+(f.white||0),E=f.red||0,N=f.blue||0,x=f.black||0,y=f.flashred||0,P=f.flashgreen||0,V=(Q,de,En,Jl)=>`<div style="background:${Jl};border-radius:12px;padding:10px 8px;text-align:center;"><div style="font-size:26px;font-weight:900;color:${En};line-height:1;">${Q}</div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:${En}99;margin-top:3px;">${de}</div></div>`;return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
      <div style="grid-column:1/-1;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:10px;text-align:center;"><div style="font-size:32px;font-weight:900;color:#fff;line-height:1;">${_}</div><div style="font-size:10px;font-weight:800;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.5px;">Total Units</div></div>
      ${V(b,"Rented","#1f9d4d","#e8faf0")}
      ${V(E,"Locked Out","#cc2b2b","#fef0f0")}
      ${V(N,"Reserved","#2a6fdb","#eef3ff")}
      ${V(x,"Out of Svc","#888","#f5f5f5")}
      ${y?V(y,"Lock It!","#ff4400","#fff3ee"):""}
      ${P?V(P,"Remove","#00aa44","#efffef"):""}
    </div>`}t.innerHTML=`
    <div id="sw-panel-drag" style="background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF);padding:12px 14px;display:flex;align-items:center;justify-content:space-between;cursor:grab;user-select:none;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">\u{1F3EA}</span>
        <div>
          <div style="color:#fff;font-weight:900;font-size:14px;letter-spacing:.3px;text-shadow:0 1px 4px rgba(0,0,0,.3);">Command Center</div>
          <div style="color:rgba(255,255,255,.85);font-size:10px;font-weight:700;">${n&&n.state&&n.state.staffName||"Staff"} \xB7 Online</div>
        </div>
      </div>
      <button id="sw-panel-close" style="border:none;cursor:pointer;background:rgba(255,255,255,.35);color:#fff;border-radius:8px;width:26px;height:26px;font-size:15px;line-height:1;font-weight:800;">\xD7</button>
    </div>

    <div style="display:flex;background:#f8f9fa;border-bottom:2px solid #eee;">
      <button class="sw-tab-btn active" data-tab="overview" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">\u{1F4CA} Stats</button>
      <button class="sw-tab-btn" data-tab="inventory" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">\u{1F512} Units</button>
      <button class="sw-tab-btn" data-tab="log" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">\u{1F4CB} Log</button>
      <button class="sw-tab-btn" data-tab="contacts" style="flex:1;padding:9px 4px;font-size:10px;color:#666;border:none;background:transparent;cursor:pointer;font-weight:700;">\u{1F465} Team</button>
    </div>

    <div id="sw-panel-body" style="flex:1;overflow-y:auto;padding:12px;background:#fff;">

      <div id="sw-tab-overview">
        ${u()}
        <div style="color:#4a6380;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">Recent</div>
        <div id="sw-ov-log" style="max-height:120px;overflow-y:auto;"><div style="color:#4a6380;font-size:12px;text-align:center;padding:8px;">Loading...</div></div>
        <div style="margin-top:12px;display:flex;gap:6px;">
          <button id="sw-send-report" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#FF6B6B,#ee0979);color:#fff;font:700 12px Segoe UI;padding:9px;border-radius:8px;box-shadow:0 3px 10px rgba(238,9,121,.3);">\u{1F4E4} Save & Report</button>
          <button id="sw-logout-btn" style="border:2px solid #eee;cursor:pointer;background:#f8f9fa;color:#666;font:600 11px Segoe UI;padding:9px 10px;border-radius:8px;">Exit</button>
        </div>
      </div>

      <div id="sw-tab-inventory" style="display:none;">
        <input id="sw-inv-search" type="text" placeholder="\u{1F50D} Search unit..." style="width:100%;box-sizing:border-box;background:#f4f7fb;border:1.5px solid #dbe4ef;border-radius:10px;padding:10px 12px;font-size:13px;color:#1f2a37;outline:none;margin-bottom:10px;"/>
        <div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap;">
          ${[{f:"all",col:"#667eea",lbl:"All"},{f:"green",col:"#1f9d4d",lbl:"Rented"},{f:"red",col:"#cc2b2b",lbl:"Late"},{f:"flashred",col:"#ff4400",lbl:"Lock It"},{f:"flashgreen",col:"#00cc44",lbl:"Remove"},{f:"blue",col:"#2a6fdb",lbl:"Resv"},{f:"yellow",col:"#e6c01f",lbl:"Pend"},{f:"black",col:"#555",lbl:"N/A"}].map(({f,col:_,lbl:b})=>`<button class="sw-inv-filter" data-filter="${f}" style="border:2px solid ${f==="all"?_+"88":"#eee"};cursor:pointer;background:${f==="all"?_+"22":"#f8f9fa"};color:#333;font:700 9px Segoe UI;padding:3px 7px;border-radius:12px;display:flex;align-items:center;gap:4px;"><div style="width:8px;height:8px;border-radius:50%;background:${_};flex-shrink:0;"></div>${b}</button>`).join("")}
        </div>
        <div id="sw-inv-list">${c()}</div>
      </div>

      <div id="sw-tab-log" style="display:none;">
        <div id="sw-log-list"><div style="color:#4a6380;font-size:12px;text-align:center;padding:8px;">Loading...</div></div>
        <button id="sw-send-report2" style="margin-top:10px;width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#B22234,#8b1a1a);color:#fff;font:700 12px Segoe UI;padding:9px;border-radius:8px;">\u{1F4E4} Save & Report</button>
        <div id="sw-report-sent2" style="display:none;color:#00d68f;font-size:11px;font-weight:700;text-align:center;margin-top:6px;"></div>
      </div>

      <div id="sw-tab-contacts" style="display:none;">
        <div style="display:flex;flex-direction:column;gap:10px;" id="sw-contact-cards">
          ${o.map(f=>`<div style="background:#fff;border:1.5px solid #e3eaf3;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(20,40,80,.06);">
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:12px;">
              <div style="width:36px;height:36px;border-radius:50%;background:${f.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;box-shadow:0 3px 8px ${f.color}66;">${f.name[0]}</div>
              <div style="color:#1f2a37;font-weight:800;font-size:14px;">${f.name}</div>
            </div>
            <div style="display:grid;gap:7px;">
              <div><div style="color:#7a8aa0;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Email</div><input class="sw-input" data-name="${f.name}" data-field="email" value="${f.email}" placeholder="email@example.com"/></div>
              <div><div style="color:#7a8aa0;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Phone</div><input class="sw-input" data-name="${f.name}" data-field="phone" value="${f.phone}" placeholder="10-digit"/></div>
              <div><div style="color:#7a8aa0;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Notify Via</div><select class="sw-select" data-name="${f.name}" data-field="pref">${a(f.pref)}</select></div>
            </div>
          </div>`).join("")}
        </div>
        <button id="sw-save-contacts" style="margin-top:10px;width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#3C3B6E,#2a2a5a);color:#fff;font:700 12px Segoe UI;padding:9px;border-radius:8px;">\u{1F4BE} Save Contacts</button>
        <div id="sw-contacts-saved" style="display:none;color:#00d68f;font-size:11px;text-align:center;margin-top:6px;">\u2705 Saved!</div>
      </div>
    </div>
  `,document.body.appendChild(t),d(),function(){let f=document.getElementById("sw-panel-drag");if(!f)return;let _=0,b=0,E=0,N=0;f.addEventListener("pointerdown",x=>{if(x.target.id==="sw-panel-close")return;x.preventDefault(),f.setPointerCapture(x.pointerId),f.style.cursor="grabbing";let y=t.getBoundingClientRect();t.style.left=y.left+"px",t.style.top=y.top+"px",t.style.right="auto",t.style.bottom="auto",_=x.clientX-y.left,b=x.clientY-y.top}),f.addEventListener("pointermove",x=>{if(!f.hasPointerCapture(x.pointerId))return;let y=Math.max(0,Math.min(window.innerWidth-t.offsetWidth,x.clientX-_)),P=Math.max(0,Math.min(window.innerHeight-t.offsetHeight,x.clientY-b));t.style.left=y+"px",t.style.top=P+"px"}),f.addEventListener("pointerup",x=>{f.style.cursor="grab";try{localStorage.setItem("sw_cmd_pos",JSON.stringify({left:t.style.left,top:t.style.top,right:"auto"}))}catch{}})}(),t.querySelectorAll(".sw-tab-btn").forEach(f=>{f.addEventListener("click",()=>{t.querySelectorAll(".sw-tab-btn").forEach(b=>b.classList.remove("active")),f.classList.add("active");let _=f.dataset.tab;["overview","inventory","log","contacts"].forEach(b=>{document.getElementById("sw-tab-"+b).style.display=b===_?"block":"none"}),_==="log"&&d()})}),document.getElementById("sw-panel-close").onclick=()=>t.remove();let h=document.getElementById("sw-inv-search");h&&h.addEventListener("input",()=>{let f=h.value.trim().toLowerCase(),_=document.getElementById("sw-inv-list");if(!n||!n._locks||!_)return;let b={blue:"#00b4ff",red:"#ff4444",green:"#00d68f",white:"#94a3b8",black:"#475569",yellow:"#f59e0b",flashred:"#ff6666",flashgreen:"#66ff99"},E={blue:"Reserved",red:"Locked Out",green:"Rented",white:"Available",black:"Out of Service",yellow:"Pending",flashred:"Need to Lock",flashgreen:"Lock Off"},N=[];Object.keys(n._locks).sort().forEach(x=>{let y=n._locks[x];if(f&&!y.label.toLowerCase().includes(f))return;let P=n._statusOf?n._statusOf(y.label):"green",V=b[P]||"#00d68f",Q=E[P]||"Rented",de="swc-"+y.label.replace(/[^a-z0-9]/gi,""),En=P==="flashred"?"animation:sw-flash-red .5s infinite;":P==="flashgreen"?"animation:sw-flash-green .5s infinite;":"";N.push(`<div onclick="window.__swCycleNext('${y.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${y.label}'.replace(/[-\\s]/g,'').toUpperCase());window.__swApp&&window.__swApp.setState&&window.__swApp.setState({showSearch:false});" title="Left-click: change status | Right-click: find on map" style="cursor:pointer;padding:4px 2px;user-select:none;transition:transform .15s;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${de}" style="width:46px;height:46px;border-radius:50%;background:${V};box-shadow:0 4px 12px ${V}99;${En}display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${y.label}</span></div></div>`)}),_.innerHTML=N.join("")||'<div style="color:#4a6380;font-size:13px;padding:20px;text-align:center;">No units found</div>'});let g={blue:"#00aaff",red:"#ff1111",green:"#00ff44",white:"#ffffff",black:"#aaaaaa",yellow:"#ffee00",flashred:"#ff0000",flashgreen:"#00ff44"};function m(f){if(!n||!n._locks)return"";let _=[];return Object.keys(n._locks).sort().forEach(b=>{let E=n._locks[b],N=n._statusOf?n._statusOf(E.label):"green";if(f!=="all"&&N!==f)return;let x=g[N]||"#00ff44",y=N==="flashred"?"animation:sw-flash-red .5s infinite;":N==="flashgreen"?"animation:sw-flash-green .5s infinite;":"",P="swc-"+E.label.replace(/[^a-z0-9]/gi,"");_.push(`<div onclick="window.__swCycleNext('${E.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${E.label}'.replace(/[-s]/g,'').toUpperCase());" style="cursor:pointer;padding:4px 2px;user-select:none;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${P}" style="width:46px;height:46px;border-radius:50%;background:${x};box-shadow:0 4px 12px ${x}99;${y}display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${E.label}</span></div></div>`)}),_.length?'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'+_.join("")+"</div>":'<div style="color:#4a6380;font-size:13px;padding:20px;text-align:center;">No units with this status</div>'}t.querySelectorAll(".sw-inv-filter").forEach(f=>{f.addEventListener("click",()=>{t.querySelectorAll(".sw-inv-filter").forEach(E=>{E.style.borderColor="",E.style.color=""}),f.style.borderColor="#00b4ff44",f.style.color="#00b4ff";let _=f.dataset.filter,b=document.getElementById("sw-inv-list");b&&(b.innerHTML=m(_))})});function v(f){let _=n&&n.state&&n.state.sessionLog||[];if(!_.length){f.style.display="block",f.textContent="No changes to report.",setTimeout(()=>f.style.display="none",2e3);return}window.__swStaffReport&&window.__swStaffReport(n.state.staffName||"Staff",_),n&&n.setState&&n.setState({reportSent:"\u2705 Sent!",sessionLog:[]}),f.style.display="block",f.textContent="\u2705 Sent to team!",setTimeout(()=>f.style.display="none",2500)}document.getElementById("sw-send-report").onclick=()=>{t.remove(),window.__swSaveReport&&window.__swSaveReport()},document.getElementById("sw-send-report2").onclick=()=>{t.remove(),window.__swSaveReport&&window.__swSaveReport()},document.getElementById("sw-logout-btn").onclick=()=>{if(t.remove(),n&&n.setState){try{localStorage.removeItem("sw_staff_name"),localStorage.removeItem("sw_user")}catch{}n.setState({editMode:!1,staffName:"",pickUnit:null,showInv:!1})}},document.getElementById("sw-save-contacts").onclick=async()=>{let f={};t.querySelectorAll("[data-name][data-field]").forEach(b=>{let E=b.dataset.name,N=b.dataset.field;f[E]||(f[E]={}),f[E][N]=b.value}),await window.__swAdminSave(Object.entries(f).map(([b,E])=>({name:b,...E})),"");let _=document.getElementById("sw-contacts-saved");_.style.display="block",setTimeout(()=>_.style.display="none",2e3)}};window.__swAdminOpen=async function(){let e=await(await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json")).json()||{},t=["Kevin","Mike","Brad"].map(r=>({name:r,color:xo[r],email:"",phone:"",carrier:"",pref:"email",...e[r]||{}})),i=document.getElementById("sw-admin-modal");if(!i)return;let s=r=>["email","text","both","none"].map(o=>`<option value="${o}"${o===r?" selected":""}>${{email:"Email only",text:"Text only",both:"Email + Text",none:"No notifications"}[o]}</option>`).join("");i.innerHTML=`<div style="background:#f4f6f9;border-radius:18px;width:340px;max-height:92vh;overflow-y:auto;font-family:'Segoe UI',Arial;box-shadow:0 12px 40px rgba(0,0,0,.35);">
    <div style="background:#1f2a33;border-radius:18px 18px 0 0;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
      <div style="color:#fff;font-weight:800;font-size:16px;">\u{1F465} Staff Contacts</div>
      <button onclick="document.getElementById('sw-admin-modal').style.display='none'" style="border:none;background:rgba(255,255,255,.15);color:#fff;cursor:pointer;border-radius:8px;width:28px;height:28px;font-size:18px;line-height:1;">\xD7</button>
    </div>
    <div style="padding:14px 16px;">
      ${t.map(r=>`<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div style="width:40px;height:40px;border-radius:50%;background:${r.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:17px;">${r.name[0]}</div>
          <div style="font-weight:800;font-size:15px;color:#1f2a33;">${r.name}</div>
        </div>
        <div style="display:grid;gap:8px;">
          <div><div style="font-size:10px;font-weight:700;color:#8a9baa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Email</div>
          <input data-field="email" data-name="${r.name}" value="${r.email||""}" placeholder="email@example.com" style="width:100%;box-sizing:border-box;border:1.5px solid #e4e8ec;border-radius:8px;padding:8px 10px;font-size:13px;background:#f9fafc;"/></div>
          <div><div style="font-size:10px;font-weight:700;color:#8a9baa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Phone</div>
          <input data-field="phone" data-name="${r.name}" value="${r.phone||""}" placeholder="10-digit number" style="width:100%;box-sizing:border-box;border:1.5px solid #e4e8ec;border-radius:8px;padding:8px 10px;font-size:13px;background:#f9fafc;"/></div>
          <div><div style="font-size:10px;font-weight:700;color:#8a9baa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Notify via</div>
          <select data-field="pref" data-name="${r.name}" style="width:100%;box-sizing:border-box;border:1.5px solid #e4e8ec;border-radius:8px;padding:8px 10px;font-size:13px;background:#f9fafc;">${s(r.pref)}</select></div>
        </div>
      </div>`).join("")}
      <button id="sw-admin-save-btn" style="width:100%;border:none;cursor:pointer;background:#2a6fdb;color:#fff;font:700 14px 'Segoe UI';padding:12px;border-radius:10px;">\u{1F4BE} Save Changes</button>
      <div id="sw-admin-saved" style="display:none;text-align:center;font-size:13px;color:#1f9d4d;margin-top:10px;font-weight:700;">\u2705 Saved!</div>
    </div>
  </div>`,i.style.display="flex",document.getElementById("sw-admin-save-btn").onclick=async()=>{let r=document.querySelectorAll("[data-name]"),o={};r.forEach(a=>{let c=a.dataset.name,l=a.dataset.field;o[c]||(o[c]={}),o[c][l]=a.value}),await window.__swAdminSave(Object.entries(o).map(([a,c])=>({name:a,...c})),""),document.getElementById("sw-admin-saved").style.display="block",setTimeout(()=>{let a=document.getElementById("sw-admin-saved");a&&(a.style.display="none")},2e3)}};window.__swCommandCenter=async function(){let n=window.__swApp;if(n&&n.state&&n.state.editMode){window.__swPanelOpen&&window.__swPanelOpen();return}if(window.__swLoginGate){let e=n;await window.__swLoginGate(e),setTimeout(()=>{window.__swPanelOpen&&window.__swPanelOpen()},150)}};window.__swShowHelp=function(){if(document.getElementById("sw-help-modal"))return;let n=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);if(!document.getElementById("sw-help-style")){let r=document.createElement("style");r.id="sw-help-style",r.textContent=`
      #sw-help-modal{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9500;display:flex;align-items:center;justify-content:center;padding:16px;}
      @keyframes sw-popin{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
      .sw-help-box{background:#0f1923;border:1px solid #1e3a5f;border-radius:20px;width:100%;max-width:480px;overflow:hidden;animation:sw-popin .2s ease;box-shadow:0 24px 64px rgba(0,0,0,.8);font-family:'Segoe UI',Arial;}
      .sw-help-header{background:linear-gradient(135deg,#0d2d4a,#0a1e30);padding:24px 24px 20px;text-align:center;border-bottom:1px solid #1e3a5f;}
      .sw-control-row{display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid #0d1f35;}
      .sw-control-row:last-child{border-bottom:none;}
      .sw-key{background:#1a3050;border:1px solid #2a4a6a;color:#7dd3fc;font:700 11px monospace;padding:4px 9px;border-radius:6px;white-space:nowrap;flex-shrink:0;}
      .sw-ctrl-desc{color:#94a3b8;font-size:13px;}
    `,document.head.appendChild(r)}let i=n?[{key:"Joystick",desc:"Move around"},{key:"Drag screen",desc:"Look around"},{key:"Tap car/bird/UFO",desc:"Ride that vehicle"},{key:"Tap a lock",desc:"View or change status (staff)"},{key:"Tap a door",desc:"Open / close"},{key:"\u{1F3E0} Home",desc:"Return to front gate"}]:[{key:"\u2191 / W",desc:"Move forward"},{key:"\u2193 / S",desc:"Move backward"},{key:"\u2190 / \u2192",desc:"Turn left / right"},{key:"Mouse drag",desc:"Look around"},{key:"E",desc:"Enter car, bird, or UFO when nearby"},{key:"Click lock",desc:"View or change lock status (staff)"},{key:"Click door",desc:"Open / close a door"},{key:"\u{1F3E0} Home",desc:"Return to front gate"},{key:"\u{1F52D} Orbit",desc:"Switch to overhead view"}],s=document.createElement("div");s.id="sw-help-modal",s.innerHTML=`<div class="sw-help-box">
    <div class="sw-help-header">
      <div style="font-size:32px;margin-bottom:8px;">\u{1F3EA}</div>
      <div style="color:#e2e8f0;font-size:20px;font-weight:800;margin-bottom:4px;">Welcome to StoreWell</div>
      <div style="color:#4a7fa0;font-size:13px;">Your 3D storage facility</div>
    </div>
    <div style="padding:20px 24px;">
      <div style="color:#7dd3fc;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">${n?"\u{1F4F1} Mobile":"\u2328\uFE0F Desktop"} Controls</div>
      <div>
        ${i.map(r=>`<div class="sw-control-row"><span class="sw-key">${r.key}</span><span class="sw-ctrl-desc">${r.desc}</span></div>`).join("")}
      </div>
      <div style="margin-top:16px;background:#0d1f35;border:1px solid #1e3a5f;border-radius:12px;padding:12px 14px;">
        <div style="color:#f59e0b;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">\u{1F512} Lock Colors</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#1f9d4d;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Green</b> \u2014 Rented, good standing</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#cc2b2b;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Red</b> \u2014 Locked out, late on payments</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#cc2b2b;border:2px dashed #ff6666;flex-shrink:0;animation:pulse 1s infinite;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#ff6666;">Flashing Red</b> \u2014 Action needed: lock this unit</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#1f9d4d;border:2px dashed #66ff99;flex-shrink:0;animation:pulse 1s infinite;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#66ff99;">Flashing Green</b> \u2014 Action needed: remove lock</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#2a6fdb;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Blue</b> \u2014 Reserved</span></div>
          <div style="display:flex;align-items:center;gap:10px;"><div style="width:12px;height:12px;border-radius:50%;background:#181818;border:1px solid #444;flex-shrink:0;"></div><span style="color:#94a3b8;font-size:12px;"><b style="color:#e2e8f0;">Black</b> \u2014 Temporary out of service</span></div>
        </div>
      </div>
      <button id="sw-help-close" style="margin-top:18px;width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 15px 'Segoe UI';padding:13px;border-radius:12px;box-shadow:0 4px 16px rgba(0,140,255,.35);">Let's Go! \u{1F680}</button>
      <div style="text-align:center;margin-top:10px;color:#2a4a6a;font-size:11px;">Tap <b style="color:#4a7fa0;">\u2139\uFE0F How to Navigate</b> anytime to review</div>
    </div>
  </div>`,document.body.appendChild(s),document.getElementById("sw-help-close").onclick=()=>{s.remove();try{localStorage.setItem("sw_help_seen","1")}catch{}},s.addEventListener("click",r=>{if(r.target===s){s.remove();try{localStorage.setItem("sw_help_seen","1")}catch{}}})};window.__swSaveReport=async function(){let n=window.__swApp,e=n&&n.state&&n.state.sessionLog||[],t={};try{t=await(await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json")).json()||{}}catch{}let i=["Kevin","Mike","Brad"].map(c=>({name:c,email:t[c]&&t[c].email||"",phone:t[c]&&t[c].phone||"",pref:t[c]&&t[c].pref||"email",color:c==="Kevin"?"#2a6fdb":c==="Mike"?"#1f9d4d":"#9b3fcf"})).filter(c=>c.email||c.phone),s=document.getElementById("sw-save-report-modal");s&&s.remove();let r=document.createElement("div");r.id="sw-save-report-modal",r.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9200;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Segoe UI,Arial;";let o={};i.forEach(c=>{o[c.name]=c.pref!=="none"});function a(){let c={green:"#00d68f",red:"#ff4444",blue:"#00b4ff",yellow:"#f59e0b",black:"#94a3b8",flashred:"#ff6666",flashgreen:"#66ff99",white:"#94a3b8"};r.innerHTML=`<div style="background:#0f1923;border:1px solid #1e3a5f;border-radius:20px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.8);">
      <div style="padding:20px 20px 16px;border-bottom:1px solid #1e3a5f;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="color:#00b4ff;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Session Report</div>
          <div style="color:#e2e8f0;font-size:16px;font-weight:800;margin-top:2px;">Save & Notify</div>
        </div>
        <button id="sw-sr-close" style="border:none;cursor:pointer;background:#0d1f35;border:1px solid #1e3a5f;color:#8ab4d4;border-radius:8px;width:30px;height:30px;font-size:16px;">\xD7</button>
      </div>

      <div style="padding:16px 20px;border-bottom:1px solid #0d1f35;">
        <div style="color:#4a6380;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Changes This Session (${e.length})</div>
        ${e.length?e.slice().reverse().map(d=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #0d1f35;">
            <div>
              <div style="color:#e2e8f0;font-size:13px;font-weight:700;">${d.label}</div>
              <div style="color:#4a6380;font-size:11px;">${d.from} \u2192 <b style="color:#7dd3fc;">${d.to}</b></div>
            </div>
            <div style="color:#2a4a6a;font-size:10px;">${new Date(d.t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
          </div>`).join(""):'<div style="color:#4a6380;font-size:13px;text-align:center;padding:12px;">No changes this session</div>'}
      </div>

      <div style="padding:16px 20px;border-bottom:1px solid #0d1f35;">
        <div style="color:#4a6380;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Who to Notify</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${i.map(d=>`
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border-radius:10px;background:${o[d.name]?"#0d2d4a":"#0a1520"};border:1px solid ${o[d.name]?"#1e5080":"#1a2d46"};">
              <input type="checkbox" data-name="${d.name}" ${o[d.name]?"checked":""} style="width:16px;height:16px;accent-color:#00b4ff;cursor:pointer;flex-shrink:0;"/>
              <div style="width:32px;height:32px;border-radius:50%;background:${d.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px;flex-shrink:0;">${d.name[0]}</div>
              <div style="flex:1;">
                <div style="color:#e2e8f0;font-size:13px;font-weight:700;">${d.name}</div>
                <div style="color:#4a6380;font-size:11px;">${{email:"\u{1F4E7} Email only",text:"\u{1F4AC} Text only",both:"\u{1F4E7}\u{1F4AC} Email + Text",none:"\u{1F515} No notifications"}[d.pref]||"\u{1F4E7} Email"}</div>
              </div>
            </label>`).join("")}
        </div>
      </div>

      <div style="padding:16px 20px;display:flex;gap:8px;">
        <button id="sw-sr-send" class="sw-btn-primary" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 14px Segoe UI;padding:12px;border-radius:10px;box-shadow:0 4px 16px rgba(0,140,255,.3);">\u{1F4E4} Send Report</button>
        <button id="sw-sr-save" style="border:1px solid #1e3a5f;cursor:pointer;background:#0d1f35;color:#8ab4d4;font:600 13px Segoe UI;padding:12px 16px;border-radius:10px;">Save Only</button>
      </div>
      <div id="sw-sr-status" style="display:none;text-align:center;padding:0 20px 16px;font-size:13px;font-weight:700;color:#00d68f;"></div>
    </div>`,r.querySelectorAll("input[type=checkbox]").forEach(d=>{d.addEventListener("change",()=>{o[d.dataset.name]=d.checked,a()})});let l=()=>r.remove();document.getElementById("sw-sr-close").onclick=l,document.getElementById("sw-sr-save").onclick=()=>{n&&n.setState&&n.setState({sessionLog:[]}),l()},document.getElementById("sw-sr-send").onclick=async()=>{if(!e.length){l();return}let d=i.filter(y=>o[y.name]),u=document.getElementById("sw-sr-send");u.textContent="Sending...",u.disabled=!0;let h=new Date().toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),g=n&&n.state&&n.state.staffName||"Staff",m={Rented:["\u{1F7E2}","#00b341"],Late:["\u{1F534}","#ff1111"],Reserved:["\u{1F535}","#00aaff"],Pending:["\u{1F7E1}","#e6a700"],"Not rentable":["\u26AA","#8893a0"],"Lock It":["\u{1F512}\u{1F534}","#ff3d00"],"Lock Off":["\u{1F513}\u{1F7E2}","#00b341"]},v=y=>m[y]||["\u2022","#5b6b7d"],f=e.map(y=>{let P=v(y.to),V=v(y.from),Q=new Date(y.t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`<tr><td style="padding:10px 12px;border-bottom:1px solid #eef2f7;"><span style="font-weight:800;color:#1f2a37;font-size:15px;background:#eef4ff;border-radius:8px;padding:3px 10px;">${y.label}</span></td><td style="padding:10px 12px;border-bottom:1px solid #eef2f7;text-align:right;font-size:14px;color:#5b6b7d;">${V[0]} ${y.from} &nbsp;&rarr;&nbsp; <b style="color:${P[1]};">${P[0]} ${y.to}</b> <span style="color:#aab4c0;font-size:11px;">${Q}</span></td></tr>`}).join(""),_=e.filter(y=>y.to==="Lock It").length,b=_?`\u{1F512} ${_} unit${_!==1?"s":""} still need${_!==1?"":"s"} a lock \u2014 go get 'em!`:"\u2705 All caught up \u2014 nice work!",E=`<div style="font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;border-radius:18px;overflow:hidden;border:1px solid #e3eaf3;background:#fff;"><div style="background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF);padding:20px 22px;"><div style="font-size:24px;font-weight:900;color:#fff;text-shadow:0 1px 5px rgba(0,0,0,.35);">\u{1F3EA} StoreWell Report</div><div style="color:#fff;font-size:13px;font-weight:600;margin-top:3px;">${h} &middot; by ${g} \u{1F464}</div></div><div style="padding:18px 20px;"><div style="color:#5b6b7d;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px;">\u{1F4CB} ${e.length} change${e.length!==1?"s":""} this round</div><table style="width:100%;border-collapse:collapse;">${f}</table><div style="margin-top:14px;background:#f0f7ff;border:1.5px solid #d6e8ff;border-radius:10px;padding:10px 14px;color:#1f2a37;font-size:13px;font-weight:700;">${b}</div></div><div style="padding:14px 20px;background:#f4f7fb;color:#8493a4;font-size:11px;text-align:center;">\u{1F3EC} StoreWell Storage &middot; 1215 E Church St, Aurora MO &middot; sent automatically \u2728\u{1F916}</div></div>`,N=`\u{1F3EA} StoreWell Report
${h} - by ${g}

\u{1F4CB} Changes (${e.length}):
`+e.map(y=>`${v(y.to)[0]} ${y.label}: ${y.from} -> ${y.to}`).join(`
`)+`

${b}

\u2014 sent automatically by StoreWell \u2728`;for(let y of d){if((y.pref==="text"||y.pref==="both")&&y.phone){let P=e.map(Q=>`${Q.label}:${Q.to}`).join(", "),V=`StoreWell Report (${h}): ${P}`;try{let de=await(await fetch("/sms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:String(y.phone).replace(/\D/g,""),message:V.slice(0,300),key:t&&t._tbKey||""})})).json().catch(()=>({}));de.success?console.log("Report SMS sent to "+y.name+", quota",de.quotaRemaining):console.warn("Report SMS to "+y.name+" failed",de)}catch(Q){console.warn("Report SMS error",Q)}}if((y.pref==="email"||y.pref==="both")&&y.email)try{let V=await(await fetch("/email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:y.email,toName:y.name,subject:"\u{1F3EA} StoreWell Report "+h,body:N,html:E})})).json().catch(()=>({}));V.success?console.log("Report email sent to "+y.name):console.warn("Report email to "+y.name+" failed",V)}catch(P){console.warn("Report email error",P)}}n&&n.setState&&n.setState({sessionLog:[]});let x=document.getElementById("sw-sr-status");x.style.display="block",x.textContent=d.length?`\u2705 Sent to ${d.map(y=>y.name).join(", ")}`:"\u2705 Saved (no one notified)",setTimeout(l,2200)}}document.body.appendChild(r),a()};(function(){function n(){let e=document.getElementById("sw-joy-wrap"),t=document.getElementById("sw-joy-handle");if(!e||!t){setTimeout(n,300);return}try{let l=JSON.parse(localStorage.getItem("sw_joy_pos")||"null");l&&(e.style.left=l.left,e.style.bottom=l.bottom,e.style.top=l.top||"",e.style.right=l.right||"")}catch{}let i,s,r,o,a=l=>{let d=l.clientX!=null?l.clientX:l.touches&&l.touches[0]&&l.touches[0].clientX||0,u=l.clientY!=null?l.clientY:l.touches&&l.touches[0]&&l.touches[0].clientY||0,h=d-i,g=u-s,m=Math.max(10,Math.min(window.innerWidth-150,r+h)),v=Math.max(10,Math.min(window.innerHeight-150,o-g));e.style.left=m+"px",e.style.bottom=v+"px",e.style.right="",e.style.top=""},c=()=>{t.style.cursor="grab",document.removeEventListener("pointermove",a),document.removeEventListener("pointerup",c),document.removeEventListener("touchmove",a),document.removeEventListener("touchend",c);try{localStorage.setItem("sw_joy_pos",JSON.stringify({left:e.style.left,bottom:e.style.bottom}))}catch{}};t.addEventListener("pointerdown",l=>{l.stopPropagation(),l.preventDefault(),t.style.cursor="grabbing",i=l.clientX,s=l.clientY;let d=e.getBoundingClientRect();r=d.left,o=window.innerHeight-d.bottom,e.style.transition="none",document.addEventListener("pointermove",a),document.addEventListener("pointerup",c)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",n):n()})();window.__swLockPicker=function(n){let e=document.getElementById("sw-lock-pop");e&&e.remove();let t=window.__swApp,i=[{st:"green",col:"#1f9d4d",label:"Rented"},{st:"red",col:"#cc2b2b",label:"Late"},{st:"flashred",col:"#ff4400",label:"Lock It"},{st:"flashgreen",col:"#00cc44",label:"Lock Off"},{st:"blue",col:"#2a6fdb",label:"Reserved"},{st:"yellow",col:"#e6c01f",label:"Pending"},{st:"black",col:"#333333",label:"N/A"}],s=t&&t._statusOf?t._statusOf(n):"green",r=document.createElement("div");r.id="sw-lock-pop",r.style.cssText="position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:9999;background:rgba(255,255,255,.97);border-radius:20px;padding:12px 16px;box-shadow:0 8px 40px rgba(0,0,0,.35);font-family:Segoe UI,Arial;display:flex;flex-direction:column;align-items:center;gap:10px;border:2px solid #eee;",r.innerHTML=`
    <div style="font-weight:800;font-size:13px;color:#1f2a33;letter-spacing:.3px;">Unit ${n}</div>
    <div style="display:flex;gap:10px;align-items:center;">
      ${i.map(o=>`
        <div onclick="window.__swApplyLock('${n}','${o.st}')" title="${o.label}" style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px;">
          <div style="width:36px;height:36px;border-radius:50%;background:${o.col};box-shadow:0 3px 10px ${o.col}88;border:${o.st===s?"3px solid #1f2a33":"3px solid transparent"};transition:transform .15s;${o.st==="flashred"?"animation:sw-flash-red .5s infinite;":o.st==="flashgreen"?"animation:sw-flash-green .5s infinite;":""}" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
          <div style="font-size:9px;font-weight:700;color:#666;text-align:center;">${o.label}</div>
        </div>`).join("")}
    </div>
    <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:11.5px;font-weight:700;color:#1f7a3d;background:#eafff1;border:1px solid #c7f0d6;border-radius:10px;padding:6px 12px;">\u{1F4CB} <input type="checkbox" id="sw-ready-cb" style="width:15px;height:15px;accent-color:#00b341;cursor:pointer;"/> Application inside &middot; ready to rent</label>
    <button onclick="document.getElementById('sw-lock-pop')?.remove()" style="border:none;background:#f0f0f0;color:#888;font:600 11px Segoe UI;padding:4px 14px;border-radius:10px;cursor:pointer;">Cancel</button>
  `,document.body.appendChild(r);try{let o=(n||"").replace(/[-\s]/g,"").toUpperCase();fetch("https://storewell-3d-default-rtdb.firebaseio.com/lockReady/"+o+".json").then(a=>a.json()).then(a=>{let c=document.getElementById("sw-ready-cb");c&&(c.checked=!!(a&&a.ready))}).catch(()=>{}),setTimeout(()=>{let a=document.getElementById("sw-ready-cb");a&&(a.onchange=()=>{let c=window.__swApp&&window.__swApp.state&&window.__swApp.state.staffName||"Staff";fetch("https://storewell-3d-default-rtdb.firebaseio.com/lockReady/"+o+".json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(a.checked?{ready:!0,by:c,t:Date.now()}:null)}).catch(()=>{})})},200)}catch{}try{let o=(n||"").replace(/[-\s]/g,"").toUpperCase();fetch("https://storewell-3d-default-rtdb.firebaseio.com/lockNotes/"+o+".json").then(a=>a.json()).then(a=>{if(a&&a.note){let c=document.getElementById("sw-lock-pop");if(!c)return;let l=document.createElement("div");l.style.cssText="font-size:11px;color:#8a5a00;background:#fff7e6;border:1px solid #ffe2a8;border-radius:9px;padding:5px 10px;max-width:250px;text-align:center;font-weight:600;",l.textContent="\u{1F4DD} "+a.note,c.insertBefore(l,c.children[1]||null)}}).catch(()=>{})}catch{}setTimeout(()=>{let o=document.getElementById("sw-lock-pop");o&&o.remove()},12e3)};window.__swAskReason=function(n){let e=(n||"").replace(/[-\s]/g,"").toUpperCase(),t="https://storewell-3d-default-rtdb.firebaseio.com";document.getElementById("sw-reason-modal")?.remove();let i=document.createElement("div");i.id="sw-reason-modal",i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10001;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,Arial;padding:16px;",i.innerHTML=`<div style="background:#fff;border-radius:18px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.4);overflow:hidden;">
    <div style="background:linear-gradient(135deg,#8893a0,#5b6b7d);padding:16px 18px;"><div style="color:#fff;font-weight:800;font-size:16px;">\u26AA Unit ${n} \u2014 Out of Service</div><div style="color:#fff;opacity:.92;font-size:12px;margin-top:2px;">Add a reason (why it's not rentable)</div></div>
    <div style="padding:16px 18px;">
      <textarea id="sw-reason-txt" placeholder="e.g. broken latch, water damage, held for repair..." style="width:100%;box-sizing:border-box;min-height:84px;border:1.5px solid #dbe4ef;border-radius:10px;padding:10px 12px;font-size:14px;font-family:inherit;color:#1f2a37;outline:none;resize:vertical;"></textarea>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button id="sw-reason-save" style="flex:1;border:none;cursor:pointer;background:linear-gradient(135deg,#00b4ff,#0066cc);color:#fff;font:700 14px Segoe UI;padding:11px;border-radius:10px;">\u{1F4BE} Save reason</button>
        <button id="sw-reason-skip" style="border:1.5px solid #e3eaf3;cursor:pointer;background:#f4f7fb;color:#5b6b7d;font:600 13px Segoe UI;padding:11px 16px;border-radius:10px;">Skip</button>
      </div>
    </div></div>`,document.body.appendChild(i),fetch(t+"/lockNotes/"+e+".json").then(r=>r.json()).then(r=>{if(r&&r.note){let o=document.getElementById("sw-reason-txt");o&&!o.value&&(o.value=r.note)}}).catch(()=>{});let s=()=>i.remove();document.getElementById("sw-reason-skip").onclick=s,document.getElementById("sw-reason-save").onclick=()=>{let r=(document.getElementById("sw-reason-txt").value||"").trim(),o=window.__swApp&&window.__swApp.state&&window.__swApp.state.staffName||"Staff";fetch(t+"/lockNotes/"+e+".json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r?{note:r,by:o,t:Date.now()}:null)}).catch(()=>{}),s()},setTimeout(()=>{let r=document.getElementById("sw-reason-txt");r&&r.focus()},120)};window.__swApplyLock=function(n,e){let t=window.__swApp;if(t&&t.setStatus&&t.setStatus(n,e),document.getElementById("sw-lock-pop")?.remove(),e==="black")setTimeout(()=>{try{window.__swAskReason(n)}catch{}},350);else try{let a=(n||"").replace(/[-\s]/g,"").toUpperCase();fetch("https://storewell-3d-default-rtdb.firebaseio.com/lockNotes/"+a+".json",{method:"DELETE"}).catch(()=>{})}catch{}let i={green:"#1f9d4d",red:"#cc2b2b",flashred:"#ff4400",flashgreen:"#00cc44",blue:"#2a6fdb",yellow:"#e6c01f",black:"#333"},s={green:"Rented \u2713",red:"Late \u2713",flashred:"Lock It \u2713",flashgreen:"Lock Off \u2713",blue:"Reserved \u2713",yellow:"Pending \u2713",black:"N/A \u2713"},r=i[e]||"#1f9d4d",o=document.createElement("div");o.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);background:${r};color:#fff;font:800 18px Segoe UI;padding:12px 28px;border-radius:30px;z-index:10000;pointer-events:none;box-shadow:0 8px 32px ${r}88;transition:all .5s;`,o.textContent=s[e]||e,document.body.appendChild(o),setTimeout(()=>{o.style.transform="translate(-50%,-80%) scale(1.15)",o.style.opacity="0"},600),setTimeout(()=>o.remove(),1100),setTimeout(()=>{let a=document.getElementById("sw-inv-list");if(a&&window.__swApp){let c=[],l={blue:"#00aaff",red:"#ff1111",green:"#00ff44",white:"#ffffff",black:"#aaaaaa",yellow:"#ffee00",flashred:"#ff0000",flashgreen:"#00ff44"};Object.keys(window.__swApp._locks||{}).sort().forEach(d=>{let u=window.__swApp._locks[d],h=window.__swApp._statusOf?window.__swApp._statusOf(u.label):"green",g=l[h]||"#1f9d4d",m="swc-"+u.label.replace(/[^a-z0-9]/gi,"");c.push(`<div onclick="window.__swCycleNext('${u.label}')" oncontextmenu="event.preventDefault();window.__swApp&&window.__swApp.locate&&window.__swApp.locate('${u.label}'.replace(/[-\\s]/g,'').toUpperCase());window.__swApp&&window.__swApp.setState&&window.__swApp.setState({showSearch:false});" title="Left-click: change status | Right-click: find on map" style="cursor:pointer;padding:4px 2px;user-select:none;transition:transform .15s;" onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform='scale(1)'"><div id="${m}" style="width:46px;height:46px;border-radius:50%;background:${g};box-shadow:0 4px 12px ${g}99;display:flex;align-items:center;justify-content:center;"><span style="color:#000;font-size:11px;font-weight:900;font-family:'Arial Black',Impact,sans-serif;text-align:center;line-height:1.1;padding:2px;overflow:hidden;word-break:break-all;">${u.label}</span></div></div>`)}),a.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">'+c.join("")+"</div>"}},200)};window.__swCycleStatus=function(n){window.__swCycleNext(n)};window.__swCycleNext=function(n,e){document.getElementById("sw-drop-menu")?.remove();let t=window.__swApp;if(!t)return;let i={green:"#22c55e",red:"#ef4444",flashred:"#ff0000",flashgreen:"#00ff44",blue:"#3b82f6",yellow:"#eab308",black:"#6b7280"},s={green:"Rented",red:"Late",flashred:"Lock It",flashgreen:"Lock Off",blue:"Reserved",yellow:"Pending",black:"N/A"},r=t._statusOf?t._statusOf(n):"green",o="swc-"+n.replace(/[^a-z0-9]/gi,""),a=document.getElementById(o),c=document.createElement("div");c.id="sw-drop-menu",c.style.cssText="position:fixed;background:#fff;border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,.35);z-index:99999;min-width:180px;overflow:hidden;font-family:Arial Black,sans-serif;";let l=document.createElement("div");l.style.cssText="background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF);color:#fff;font-size:13px;font-weight:900;padding:10px 14px;text-align:center;letter-spacing:1px;",l.textContent="Unit "+n,c.appendChild(l);let d=document.createElement("div");d.style.cssText="padding:5px 14px;font-size:10px;color:#888;background:#f9f9f9;border-bottom:1px solid #eee;",d.textContent="Now: "+(s[r]||r),c.appendChild(d),Object.entries(s).forEach(([m,v])=>{let f=document.createElement("div"),_=m===r;f.style.cssText="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;background:"+(_?"#f0f9ff":"#fff")+";border-left:4px solid "+(_?i[m]:"transparent")+";",f.onmouseover=()=>f.style.background="#f5f5f5",f.onmouseout=()=>f.style.background=_?"#f0f9ff":"#fff";let b=m==="flashred"?"animation:sw-flash-red .5s infinite;":m==="flashgreen"?"animation:sw-flash-green .5s infinite;":"",E=document.createElement("div");E.style.cssText="width:16px;height:16px;border-radius:50%;background:"+i[m]+";flex-shrink:0;box-shadow:0 2px 6px "+i[m]+"88;"+b;let N=document.createElement("span");if(N.style.cssText="font-size:13px;font-weight:900;color:#222;flex:1;",N.textContent=v,f.appendChild(E),f.appendChild(N),_){let x=document.createElement("span");x.style.cssText="color:"+i[m]+";font-size:15px;",x.textContent="\u2713",f.appendChild(x)}f.onclick=x=>{x.stopPropagation(),t.setStatus(n,m);let y=document.getElementById(o);y&&(y.style.background=i[m],y.style.boxShadow="0 4px 12px "+i[m]+"99",y.style.animation=b||""),c.remove(),document.removeEventListener("click",window.__swDropClose),window.__swDropClose=null;let P=document.createElement("div");P.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);background:"+i[m]+";color:#fff;font-size:14px;font-weight:900;padding:11px 26px;border-radius:32px;box-shadow:0 6px 28px "+i[m]+"99;z-index:999999;pointer-events:none;white-space:nowrap;transition:opacity .3s;",P.textContent="Unit "+n+" \u2192 "+v,document.body.appendChild(P),setTimeout(()=>{P.style.opacity="0"},1800),setTimeout(()=>P.remove(),2200)},c.appendChild(f)});let u=document.createElement("div");u.style.cssText="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;background:#f0f8ff;border-top:2px solid #e0e0e0;",u.onmouseover=()=>u.style.background="#dbeafe",u.onmouseout=()=>u.style.background="#f0f8ff";let h=document.createElement("div");h.style.cssText="width:16px;height:16px;border-radius:50%;background:#0ea5e9;flex-shrink:0;";let g=document.createElement("span");if(g.style.cssText="font-size:13px;font-weight:900;color:#0ea5e9;",g.textContent="Find on Map",u.appendChild(h),u.appendChild(g),u.onclick=m=>{m.stopPropagation();let v=n.replace(/[-\s]/g,"").toUpperCase();t.locate&&t.locate(v),c.remove()},c.appendChild(u),document.body.appendChild(c),a){let m=a.getBoundingClientRect(),v=m.bottom+6,f=m.left-20;v+370>window.innerHeight&&(v=m.top-375),f+185>window.innerWidth&&(f=window.innerWidth-190),f<5&&(f=5),c.style.top=v+"px",c.style.left=f+"px"}else if(e&&e.clientX){let m=e.clientY+10,v=e.clientX-90;m+370>window.innerHeight&&(m=e.clientY-375),v+185>window.innerWidth&&(v=window.innerWidth-190),v<5&&(v=5),c.style.top=m+"px",c.style.left=v+"px"}else c.style.top="50%",c.style.left="50%",c.style.transform="translate(-50%,-50%)";window.__swDropClose&&document.removeEventListener("click",window.__swDropClose),window.__swDropClose=function(){c.remove(),document.removeEventListener("click",window.__swDropClose),window.__swDropClose=null},setTimeout(()=>{window.__swDropClose&&document.addEventListener("click",window.__swDropClose)},120)};window.__swCheckLogin=function(){return localStorage.getItem("sw_user")||null};window.__swLogout=function(){localStorage.removeItem("sw_user"),location.reload()};window.__swLoginGate=async function(n){let e=window.__swCheckLogin();if(e){if(n&&n.setState){try{localStorage.setItem("sw_staff_name",e)}catch{}n.setState({editMode:!0,staffName:e,showLogin:!1}),window.__swStaffOnline&&window.__swStaffOnline(e)}return}let t={};try{let i=await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json"),s=(i.ok?await i.json():{})||{};["Kevin","Mike","Brad"].forEach(r=>{s[r]&&s[r].email&&s[r].phone&&(t[s[r].email.toLowerCase()]={name:r,pin:s[r].phone.slice(-4)})})}catch{}return new Promise(i=>{if(!document.getElementById("sw-login-style")){let a=document.createElement("style");a.id="sw-login-style",a.textContent="@keyframes sw-lshake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}",document.head.appendChild(a)}let s=document.createElement("div");s.id="sw-login-overlay",s.style.cssText="position:fixed;inset:0;background:#0d1117;z-index:99999;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,Arial;",s.innerHTML=`<div style="background:#1f2a33;border-radius:20px;padding:32px 28px;width:320px;text-align:center;box-shadow:0 16px 56px rgba(0,0,0,.7);">
      <div style="font-size:40px;margin-bottom:8px;">\u{1F3EA}</div>
      <div style="color:#fff;font-size:19px;font-weight:800;margin-bottom:2px;">StoreWell</div>
      <div style="color:#8a9baa;font-size:12px;margin-bottom:24px;">Staff Login</div>
      <form id="sw-login-form" autocomplete="on" style="text-align:left;">
        <div style="margin-bottom:12px;">
          <label style="color:#8a9baa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px;">Email</label>
          <input id="sw-login-email" name="username" type="email" autocomplete="username" placeholder="your@email.com"
            style="width:100%;box-sizing:border-box;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;padding:11px 14px;font-size:14px;color:#fff;outline:none;" />
        </div>
        <div style="margin-bottom:20px;">
          <label style="color:#8a9baa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px;">Password</label>
          <input id="sw-login-pw" name="password" type="password" autocomplete="current-password" placeholder="\u2022\u2022\u2022\u2022"
            style="width:100%;box-sizing:border-box;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;padding:11px 14px;font-size:14px;color:#fff;outline:none;" />
        </div>
        <button type="submit" style="width:100%;border:none;cursor:pointer;background:#2a6fdb;color:#fff;font:700 14px 'Segoe UI';padding:12px;border-radius:10px;">Sign In</button>
      </form>
      <div id="sw-login-err" style="color:#e05555;font-size:12px;font-weight:700;min-height:16px;margin-top:10px;text-align:center;"></div>
      <button type="button" id="sw-login-cancel" style="min-height:44px;margin-top:8px;background:transparent;border:1px solid #526476;border-radius:8px;color:#cce8f6;width:100%;cursor:pointer;">Cancel</button>
    </div>`,document.body.appendChild(s),s.querySelector("#sw-login-cancel").onclick=()=>{s.remove(),i(null)};function r(){let a=s.querySelector("div");a.style.animation="sw-lshake .4s ease",setTimeout(()=>{a.style.animation=""},400)}function o(){let a=s.querySelector("#sw-login-email").value.trim().toLowerCase(),c=s.querySelector("#sw-login-pw").value.trim(),l=t[a];if(!l){s.querySelector("#sw-login-err").textContent="Email not recognized.",r();return}if(l.pin!==c){s.querySelector("#sw-login-err").textContent="Incorrect password.",r(),s.querySelector("#sw-login-pw").value="";return}if(localStorage.setItem("sw_user",l.name),s.remove(),i(l.name),n&&n.setState){try{localStorage.setItem("sw_staff_name",l.name)}catch{}n.setState({editMode:!0,staffName:l.name,showLogin:!1}),window.__swStaffOnline&&window.__swStaffOnline(l.name)}}s.querySelector("#sw-login-form").addEventListener("submit",function(a){a.preventDefault(),o()})})};window.__swAdminSave=async function(n,e){let i=await(await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json")).json()||{},s={_ejsKey:e,_tbKey:i._tbKey||""};n.forEach(r=>{s[r.name]={email:r.email||"",phone:r.phone||"",carrier:r.carrier||"",pref:r.pref||"email"}}),await sn(J(X,"staffConfig"),s)};window.__swStaffReport=async function(n,e){if(!n||!e?.length)return;fi(J(X,"staffReports"),{name:n,changes:e,ts:Date.now()});let i=await(await fetch("https://storewell-3d-default-rtdb.firebaseio.com/staffConfig.json")).json()||{},s=i._ejsKey||"",r=n+" updated StoreWell ("+new Date().toLocaleString()+`):
`+e.map(o=>"\u2022 Unit "+o.label+": "+o.from+" \u2192 "+o.to).join(`
`);for(let o of["Kevin","Mike","Brad"]){if(o===n)continue;let a=i[o]||{},c=a.pref||"none";(c==="email"||c==="both")&&a.email&&await Hm(a.email,o,n,r,s),(c==="text"||c==="both")&&a.phone&&a.phone&&i._tbKey&&await Yl(a.phone.replace(/\D/g,""),n+": "+r.slice(0,140),i._tbKey)}};window.__swStaffOnline=n=>{fi(J(X,"staffActivity"),{name:n,action:"logged in",ts:Date.now()})};var So=class{constructor(e,t){this.comp=e,this.uid=t,this.name="",this.avatars={},this._avatarHash={},this._lastMsgT=0,this._iv=null}join(e){this.name=e;let t=J(X,"players/"+this.uid);fetch("https://storewell-3d-default-rtdb.firebaseio.com/players.json").then(s=>s.json()).then(s=>{Object.entries(s||{}).forEach(([r,o])=>{r!==this.uid&&o.name===e&&pi(J(X,"players/"+r)).catch(()=>{})})}).catch(()=>{});let i=window._swGetChar?window._swGetChar():{};sn(t,{name:e,x:0,y:0,z:0,h:0,t:Date.now(),char:i}).catch(()=>{clearInterval(this._iv),this._iv=null}),$c(t).remove().catch(()=>{}),mi(J(X,"players"),s=>{let r=s.val()||{};try{this.comp.setState({online:Object.entries(r).map(([o,a])=>({name:a.name,me:o===this.uid}))})}catch{}this._sync(r)}),mi(J(X,"messages"),s=>{let r=s.val()||{};Object.values(r).filter(o=>o.t>this._lastMsgT&&o.uid!==this.uid).sort((o,a)=>o.t-a.t).forEach(o=>{this._lastMsgT=o.t;try{this.comp._pushMsg(o.name,o.text)}catch{}})}),this._iv=setInterval(()=>this._pos(),150)}send(e){fi(J(X,"messages"),{uid:this.uid,name:this.name,text:e,t:Date.now()});try{this.comp._pushMsg(this.name,e)}catch{}}notify(){}_pos(){if(window.__swDeckVisible||document.hidden)return;let e=this.comp.walker;if(!e||!e.g)return;let t=e.g.position,i=window._swGetChar?window._swGetChar():{};jc(J(X,"players/"+this.uid),{x:Math.round(t.x*10)/10,y:Math.round(t.y*10)/10,z:Math.round(t.z*10)/10,h:Math.round((e.h||0)*100)/100,t:Date.now(),char:i}).catch(()=>{clearInterval(this._iv),this._iv=null})}_sync(e){let t=this.comp.scene,i=window.THREE;if(!(!t||!i)){for(let[s,r]of Object.entries(e)){if(s===this.uid)continue;let o=JSON.stringify(r.char||{});if(!this.avatars[s]||this._avatarHash[s]!==o){this.avatars[s]&&t.remove(this.avatars[s]);let c=window._swBuildAvatar(i,s,r);t.add(c),this.avatars[s]=c,this._avatarHash[s]=o}let a=this.avatars[s];r.x!==void 0&&(a.position.set(r.x,r.y||0,r.z),a.rotation.y=r.h||0)}for(let s of Object.keys(this.avatars))e[s]||(t.remove(this.avatars[s]),delete this.avatars[s],delete this._avatarHash[s])}}destroy(){clearInterval(this._iv),pi(J(X,"players/"+this.uid)).catch(()=>{})}};window.__swSetup=function(n){let e=localStorage.getItem("sw_device_uid");e||(e="dev-"+Math.random().toString(36).slice(2)+"-"+Date.now().toString(36),localStorage.setItem("sw_device_uid",e));let t=new So(n,e);n._net=t,t.join(Kl()||"Guest");let i=/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)||navigator.maxTouchPoints>0;setTimeout(()=>{if(document.getElementById("sw-sens-ctrl"))return;let s=parseFloat(localStorage.getItem("sw_look_sens")||"0.0008");window._swLookSens=s;let r=document.createElement("div");r.id="sw-sens-ctrl",r.style.cssText="position:fixed;bottom:10px;left:10px;z-index:9999;background:rgba(0,0,0,.65);border-radius:10px;padding:8px 12px;color:#fff;font:600 11px Segoe UI,Arial;display:flex;align-items:center;gap:8px;";let o=parseFloat(localStorage.getItem("sw_walk_spd")||"0.012");window._swWalkSpd=o,r.innerHTML='\u{1F441} Look: <input id="sw-sens-sl" type="range" min="1" max="100" value="'+Math.round(s*1e4)+'" style="width:90px;accent-color:#00aaff;"> <span id="sw-sens-val">'+Math.round(s*1e4)+'</span>&nbsp;&nbsp;\u{1F6B6} Walk: <input id="sw-walk-sl" type="range" min="1" max="200" value="'+Math.round(o*1e3)+'" style="width:90px;accent-color:#00ff44;"> <span id="sw-walk-val">'+Math.round(o*1e3)+'</span>&nbsp;&nbsp;\u21A9 Turn: <input id="sw-turn-sl" type="range" min="1" max="100" value="'+Math.round(parseFloat(localStorage.getItem("sw_turn_spd")||"0.005")*1e3)+'" style="width:90px;accent-color:#ffee00;"> <span id="sw-turn-val">'+Math.round(parseFloat(localStorage.getItem("sw_turn_spd")||"0.005")*1e3)+"</span>",document.body.appendChild(r);let a=document.createElement("button");a.id="sw-ward-btn",a.textContent="\u{1F454} Wardrobe",a.style.cssText="position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9999;background:linear-gradient(90deg,#8b5cf6,#ec4899);color:#fff;border:none;border-radius:20px;padding:6px 16px;font-size:12px;font-weight:900;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.4);",a.onclick=function(){window._swShowWardrobe&&window._swShowWardrobe()},document.body.appendChild(a),document.getElementById("sw-sens-sl").addEventListener("input",function(){let l=parseInt(this.value)/1e4;window._swLookSens=l,document.getElementById("sw-sens-val").textContent=this.value;try{localStorage.setItem("sw_look_sens",l)}catch{}}),document.getElementById("sw-walk-sl").addEventListener("input",function(){let l=parseInt(this.value)/1e3;window._swWalkSpd=l,document.getElementById("sw-walk-val").textContent=this.value;try{localStorage.setItem("sw_walk_spd",l)}catch{}});let c=parseFloat(localStorage.getItem("sw_turn_spd")||"0.005");window._swTurnSpd=c,document.getElementById("sw-turn-sl").addEventListener("input",function(){let l=parseInt(this.value)/1e3;window._swTurnSpd=l,document.getElementById("sw-turn-val").textContent=this.value;try{localStorage.setItem("sw_turn_spd",l)}catch{}})},2e3),setTimeout(()=>{let s=document.getElementById("sw-joy-wrap");if(!s||s._swJoyTouchBound)return;s._swJoyTouchBound=!0,(s.querySelector("div:not(#sw-joy-handle)")||s).addEventListener("touchstart",a=>{a.preventDefault(),a.stopPropagation(),n._joyStart(a)},{passive:!1,capture:!0})},1500)};})();
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/index.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-d90d2ee5.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
