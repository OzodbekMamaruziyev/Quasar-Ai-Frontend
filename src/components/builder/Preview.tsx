"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Tablet, Monitor, Download, Code2, Eye, RotateCcw, ExternalLink, Copy, Check } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { filesApi } from "@/lib/api";

const INITIAL_CODE = `import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
export default function App() {
  const [steps, setSteps] = useState(8432);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.title}>Fitness Tracker</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Steps</Text>
          <Text style={styles.cardValue}>{steps.toLocaleString()}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '84%' }]} />
          </View>
        </View>
        <View style={styles.grid}>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Calories</Text>
            <Text style={styles.smallCardValue}>420</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Workouts</Text>
            <Text style={styles.smallCardValue}>12</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setSteps(s => s + 100)}>
          <Text style={styles.buttonText}>Start New Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020205', padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  greeting: { color: '#a1a1aa', fontSize: 14 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: 'bold' },
  scrollContent: { gap: 16 },
  card: { backgroundColor: '#12141d', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardTitle: { color: '#a1a1aa', fontSize: 14, marginBottom: 8 },
  cardValue: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 3 },
  grid: { flexDirection: 'row', gap: 16 },
  smallCard: { flex: 1, backgroundColor: '#12141d', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  smallCardLabel: { color: '#a1a1aa', fontSize: 12, marginBottom: 4 },
  smallCardValue: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  button: { backgroundColor: '#3b82f6', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});`;

type DeviceType = "phone" | "tablet" | "desktop";
interface DeviceConfig { width: number; height: number; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; }
const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  phone:   { width: 375,  height: 812,  label: "iPhone",  icon: Smartphone },
  tablet:  { width: 768,  height: 1024, label: "iPad",    icon: Tablet },
  desktop: { width: 1280, height: 800,  label: "Desktop", icon: Monitor },
};
interface ProjectFile      { path: string; content: string; }
interface ProjectStructure { explanation?: string; files: ProjectFile[]; mainFile?: string; }
interface PreviewProps     { code?: string; projectId?: string; }
interface FrameProps       { html: string; }

function buildPreviewHTML(code: string): string {
  // JSON.stringify — backtick/dollar/backslash muammolarini hal qiladi
  // code ni stringga aylantirib, escape qilish uchun
  const safeCode = (code || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:100%; height:100%; background:#020205; overflow:hidden; }
#root { width:100%; height:100%; display:flex; flex-direction:column; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.err { padding:16px; color:#f87171; font-family:monospace; font-size:11px;
  background:rgba(248,113,113,0.08); border:1px solid rgba(248,113,113,0.2);
  border-radius:12px; margin:12px; white-space:pre-wrap; word-break:break-all; }
</style>
</head>
<body>
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.23.10/babel.min.js"></script>
<script>
const SS = {
  create:s=>s,
  flatten:s=>Array.isArray(s)?Object.assign({},...s.filter(Boolean)):(s||{}),
  hairlineWidth:1,
  absoluteFillObject:{position:'absolute',top:0,left:0,right:0,bottom:0}
};
function px(v){return typeof v==='number'?v+'px':v}
function toCSS(style){
  if(!style)return{};
  const s=SS.flatten(style),r={};
  ['flex','flexDirection','flexWrap','alignItems','justifyContent','alignSelf','flexGrow','flexShrink',
   'backgroundColor','color','opacity','fontWeight','fontStyle','textAlign','textTransform',
   'position','overflow','zIndex','display','gap','rowGap','columnGap']
  .forEach(k=>{if(s[k]!==undefined)r[k]=s[k]});
  ['width','height','minWidth','minHeight','maxWidth','maxHeight',
   'margin','marginTop','marginBottom','marginLeft','marginRight',
   'padding','paddingTop','paddingBottom','paddingLeft','paddingRight',
   'top','bottom','left','right','fontSize','lineHeight','borderRadius',
   'borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius','borderWidth']
  .forEach(k=>{if(s[k]!==undefined)r[k]=px(s[k])});
  if(s.marginHorizontal!=null){r.marginLeft=px(s.marginHorizontal);r.marginRight=px(s.marginHorizontal)}
  if(s.marginVertical!=null){r.marginTop=px(s.marginVertical);r.marginBottom=px(s.marginVertical)}
  if(s.paddingHorizontal!=null){r.paddingLeft=px(s.paddingHorizontal);r.paddingRight=px(s.paddingHorizontal)}
  if(s.paddingVertical!=null){r.paddingTop=px(s.paddingVertical);r.paddingBottom=px(s.paddingVertical)}
  if(s.borderColor!=null)r.borderColor=s.borderColor;
  if(s.borderWidth!=null)r.borderStyle='solid';
  if(s.letterSpacing!=null)r.letterSpacing=s.letterSpacing+'px';
  if(s.textDecorationLine!=null)r.textDecoration=s.textDecorationLine;
  if(s.elevation!=null)r.boxShadow='0 '+s.elevation+'px '+(s.elevation*2)+'px rgba(0,0,0,0.35)';
  if(s.transform)r.transform=s.transform.map(t=>{const[k,v]=Object.entries(t)[0];return k+'('+(typeof v==='number'&&(k.startsWith('translate')||k==='perspective')?v+'px':v)+')'}).join(' ');
  return r;
}
const {createElement:h,useState,useEffect,useRef,useCallback,useMemo,useReducer,useContext,createContext,Fragment}=React;
const View=({style,children,...p})=>h('div',{style:{display:'flex',flexDirection:'column',...toCSS(style)},...p},children);
const Text=({style,children,numberOfLines,...p})=>h('span',{style:{display:'block',color:'#fff',fontSize:'14px',...toCSS(style),...(numberOfLines===1?{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}:{})},...p},children);
const ScrollView=({style,contentContainerStyle,children,horizontal,...p})=>h('div',{style:{display:'flex',flexDirection:horizontal?'row':'column',overflow:horizontal?'auto hidden':'hidden auto',flex:1,...toCSS(style)},...p},h('div',{style:{display:'flex',flexDirection:horizontal?'row':'column',...toCSS(contentContainerStyle)}},children));
const TouchableOpacity=({style,children,onPress,disabled,activeOpacity=0.7,...p})=>{const[op,setOp]=useState(1);return h('div',{style:{display:'flex',flexDirection:'column',cursor:disabled?'not-allowed':'pointer',userSelect:'none',opacity:disabled?0.5:op,transition:'opacity 0.1s',...toCSS(style)},onClick:disabled?undefined:onPress,onMouseDown:()=>setOp(activeOpacity),onMouseUp:()=>setOp(1),onMouseLeave:()=>setOp(1),...p},children)};
const Pressable=({style,children,onPress,disabled,...p})=>{const[st,setSt]=useState({pressed:false,hovered:false});const s=typeof style==='function'?style(st):style;return h('div',{style:{display:'flex',flexDirection:'column',cursor:'pointer',userSelect:'none',...toCSS(s)},onClick:disabled?undefined:onPress,onMouseEnter:()=>setSt(v=>({...v,hovered:true})),onMouseLeave:()=>setSt({pressed:false,hovered:false}),onMouseDown:()=>setSt(v=>({...v,pressed:true})),onMouseUp:()=>setSt(v=>({...v,pressed:false})),...p},children)};
const TouchableHighlight=({style,children,onPress,...p})=>h('div',{style:{display:'flex',flexDirection:'column',cursor:'pointer',...toCSS(style)},onClick:onPress,...p},children);
const TextInput=({style,value,onChangeText,placeholder,secureTextEntry,multiline,...p})=>h(multiline?'textarea':'input',{style:{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'14px',...toCSS(style)},value:value||'',type:secureTextEntry?'password':'text',placeholder,onChange:e=>onChangeText&&onChangeText(e.target.value),...p});
const Image=({style,source,resizeMode='cover',...p})=>h('img',{style:{objectFit:resizeMode,...toCSS(style)},src:typeof source==='object'?source?.uri:source,alt:'',...p});
const ImageBackground=({style,source,children,resizeMode='cover',...p})=>h('div',{style:{display:'flex',flexDirection:'column',backgroundImage:'url('+(typeof source==='object'?source?.uri:source)+')',backgroundSize:resizeMode,backgroundPosition:'center',...toCSS(style)},...p},children);
const SafeAreaView=({style,children,...p})=>h('div',{style:{display:'flex',flexDirection:'column',flex:1,paddingTop:'20px',...toCSS(style)},...p},children);
const KeyboardAvoidingView=({style,children,...p})=>h('div',{style:{display:'flex',flexDirection:'column',flex:1,...toCSS(style)},...p},children);
const FlatList=({data,renderItem,keyExtractor,style,contentContainerStyle,horizontal,ListHeaderComponent,ListFooterComponent,ListEmptyComponent,ItemSeparatorComponent})=>{const items=(data||[]).map((item,i)=>h(Fragment,{key:keyExtractor?keyExtractor(item,i):i},renderItem({item,index:i}),ItemSeparatorComponent&&i<data.length-1?h(ItemSeparatorComponent):null));return h('div',{style:{display:'flex',flexDirection:horizontal?'row':'column',overflow:'auto',flex:1,...toCSS(style)}},h('div',{style:{display:'flex',flexDirection:horizontal?'row':'column',...toCSS(contentContainerStyle)}},ListHeaderComponent&&h(Fragment,null,typeof ListHeaderComponent==='function'?h(ListHeaderComponent):ListHeaderComponent),items.length?items:(ListEmptyComponent?h(ListEmptyComponent):null),ListFooterComponent&&h(Fragment,null,typeof ListFooterComponent==='function'?h(ListFooterComponent):ListFooterComponent)))};
const SectionList=({sections,renderItem,renderSectionHeader,keyExtractor,style})=>h('div',{style:{overflow:'auto',flex:1,...toCSS(style)}},(sections||[]).map((sec,si)=>h(Fragment,{key:si},renderSectionHeader&&renderSectionHeader({section:sec}),sec.data.map((item,ii)=>h(Fragment,{key:keyExtractor?keyExtractor(item,ii):ii},renderItem({item,index:ii,section:sec}))))));
const Modal=({visible,children,transparent,onRequestClose})=>visible?h('div',{style:{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:1000,backgroundColor:transparent?'rgba(0,0,0,0.5)':'#000',display:'flex',alignItems:'center',justifyContent:'center'},onClick:onRequestClose},children):null;
const ActivityIndicator=({size='small',color='#3b82f6',style})=>h('div',{style:{width:size==='large'?'36px':'20px',height:size==='large'?'36px':'20px',border:'3px solid rgba(255,255,255,0.1)',borderTop:'3px solid '+color,borderRadius:'50%',animation:'spin 1s linear infinite',...toCSS(style)}});
const Switch=({value,onValueChange})=>h('input',{type:'checkbox',checked:!!value,onChange:e=>onValueChange&&onValueChange(e.target.checked),style:{cursor:'pointer',width:'40px',height:'20px'}});
const StatusBar=()=>null;
const Platform={OS:'web',Version:1,select:o=>o.web||o.default||o.ios||o.android};
const Dimensions={get:()=>({width:375,height:812,scale:2,fontScale:1}),addEventListener:()=>({remove:()=>{}})};
const useWindowDimensions=()=>({width:375,height:812,scale:2,fontScale:1});
const Alert={alert:(t,m,b)=>{if(b&&b[0]?.onPress)b[0].onPress();else alert(t+(m?'\\n'+m:''))}};
const Keyboard={dismiss:()=>{},addListener:()=>({remove:()=>{}})};
const Linking={openURL:url=>window.open(url,'_blank')};
const useColorScheme=()=>'dark';
const PixelRatio={get:()=>2,getFontScale:()=>1,getPixelSizeForLayoutSize:v=>v*2,roundToNearestPixel:v=>v};
class AV{constructor(v){this._v=v;this._l=[];}setValue(v){this._v=v;}addListener(cb){return{remove:()=>{}};}removeAllListeners(){}interpolate(c){return this;}}
const Animated={Value:AV,ValueXY:class{constructor(v){this.x=new AV(v?.x||0);this.y=new AV(v?.y||0);}getLayout(){return{};}},View:({style,children,...p})=>h('div',{style:{display:'flex',flexDirection:'column',...toCSS(style)},...p},children),Text:({style,children,...p})=>h('span',{style:{...toCSS(style)},...p},children),Image:({style,source,...p})=>h('img',{style:{...toCSS(style)},src:typeof source==='object'?source?.uri:source,...p}),ScrollView,FlatList,timing:(v,c)=>({start:cb=>{cb&&cb({finished:true})},stop:()=>{}}),spring:(v,c)=>({start:cb=>{cb&&cb({finished:true})},stop:()=>{}}),decay:(v,c)=>({start:cb=>{cb&&cb({finished:true})},stop:()=>{}}),sequence:a=>({start:cb=>{a.forEach(x=>x.start());cb&&cb({finished:true})},stop:()=>{}}),parallel:a=>({start:cb=>{a.forEach(x=>x.start());cb&&cb({finished:true})},stop:()=>{}}),loop:a=>({start:()=>{},stop:()=>{}}),delay:t=>({start:cb=>{setTimeout(()=>cb&&cb({finished:true}),t)},stop:()=>{}}),createAnimatedComponent:C=>C,event:()=>()=>{},add:(a,b)=>a,subtract:(a,b)=>a,multiply:(a,b)=>a,divide:(a,b)=>a,modulo:(a,b)=>a,diffClamp:(a,n,x)=>a};
const Easing={linear:t=>t,ease:t=>t,quad:t=>t*t,cubic:t=>t*t*t,poly:n=>t=>Math.pow(t,n),sin:t=>t,circle:t=>t,exp:t=>t,elastic:()=>t=>t,back:()=>t=>t,bounce:t=>t,bezier:()=>t=>t,in:f=>f,out:f=>t=>1-f(1-t),inOut:f=>t=>t<.5?f(t*2)/2:1-f((1-t)*2)/2};
const PanResponder={create:()=>({panHandlers:{}})};
const RN={StyleSheet:SS,View,Text,ScrollView,FlatList,SectionList,TouchableOpacity,TouchableHighlight,Pressable,TextInput,Image,ImageBackground,SafeAreaView,KeyboardAvoidingView,Modal,ActivityIndicator,Switch,StatusBar,Platform,Dimensions,useWindowDimensions,Alert,Keyboard,Linking,useColorScheme,PixelRatio,Animated,Easing,PanResponder};
window.__RN__=RN;
</script>
<script>
(function(){
  function showError(msg){document.getElementById('root').innerHTML='<div class="err"><strong>Preview Error</strong>\\n\\n'+(msg||'Unknown')+'</div>';}
  function init(){
    if(!window.React||!window.ReactDOM||!window.Babel||!window.__RN__){setTimeout(init,100);return;}
    try{
      const code=CODE_JSON_PLACEHOLDER;
      // ── require helper ──────────────────────────────────
      const makeModule = (obj) => {
        // _interopRequireDefault uchun __esModule flag qo'shish
        return Object.assign({ __esModule: true, default: obj }, obj);
      };
      const require = name => {
        if (name === 'react')                        return makeModule(React);
        if (name === 'react-dom')                    return makeModule(ReactDOM);
        if (name === 'react-native')                 return makeModule(window.__RN__);
        if (name === 'react-native-safe-area-context') return makeModule({ SafeAreaView: window.__RN__.SafeAreaView });
        if (name === 'expo-status-bar')              return makeModule({ StatusBar: window.__RN__.StatusBar });
        if (name.includes('expo-linear-gradient'))   return makeModule({ LinearGradient: ({style,children,...p}) => React.createElement('div',{style,...p},children) });
        if (name.includes('@expo/vector-icons'))     return makeModule(new Proxy({}, { get:(_,k) => ({size,color,...p}) => React.createElement('span',{style:{color:color||'#fff',fontSize:size||16},...p},'◆') }));
        if (name.includes('lucide'))                 return makeModule(new Proxy({}, { get:(_,k) => ({size,color,...p}) => React.createElement('span',{style:{color:color||'#888',fontSize:size||14},...p},'◆') }));
        // default: empty module with __esModule flag
        return { __esModule: true, default: {} };
      };

      // ── Babel transform — TypeScript + JSX ──────────────
      const out = Babel.transform(code, {
        presets: [
          ['react',  { runtime: 'classic' }],
          ['typescript', {}],
          ['env', { targets: { browsers: ['last 2 versions'] }, modules: 'commonjs' }],
        ],
        plugins: [],
        filename: 'App.tsx',
      }).code;

      // ── Execute ──────────────────────────────────────────
      const mod = { exports: {} };
      const fn  = new Function('React', 'require', 'module', 'exports', out);
      fn(React, require, mod, mod.exports);

      // exports.default YOKI module.exports ni olamiz
      let App = mod.exports && mod.exports.__esModule
        ? mod.exports.default
        : mod.exports;

      // Agar exports ichida default bo'lmasa, butun exports ni sinab ko'ramiz
      if (!App || typeof App !== 'function') {
        App = mod.exports;
      }
      if (!App || typeof App !== 'function') {
        throw new Error('Default export topilmadi.\nexport default function App() { ... } bo\'lishi kerak!');
      }
      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
    }catch(e){console.error(e);showError(e.message);}
  }
  setTimeout(init,400);
})();
</script>
</body>
</html>`.replace('CODE_JSON_PLACEHOLDER', safeCode);
}

export default function Preview({ code, projectId }: PreviewProps) {
  const [viewMode, setViewMode]                 = useState<"preview"|"code">("preview");
  const [device, setDevice]                     = useState<DeviceType>("phone");
  const [refreshKey, setRefreshKey]             = useState(0);
  const [copied, setCopied]                     = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string|null>(null);

  const project: ProjectStructure = (() => {
    try {
      if (!code) return { files: [{ path: "App.tsx", content: INITIAL_CODE }], mainFile: "App.tsx" };
      const parsed = JSON.parse(code);
      if (parsed.files) return parsed;
      return { files: [{ path: "App.tsx", content: code }], mainFile: "App.tsx" };
    } catch {
      return { files: [{ path: "App.tsx", content: code || INITIAL_CODE }], mainFile: "App.tsx" };
    }
  })();

  const currentFile = project.files.find(f => f.path === (selectedFilePath || project.mainFile || project.files[0]?.path)) || project.files[0];
  const displayCode = currentFile?.content || "";

  useEffect(() => {
    if (!selectedFilePath && project.files.length > 0)
      setSelectedFilePath(project.mainFile || project.files[0].path);
  }, [project, selectedFilePath]);

  const handleDownloadZip = useCallback(() => {
    if (!projectId) {
      const el = document.createElement("a");
      el.href  = URL.createObjectURL(new Blob([displayCode], { type: "text/javascript" }));
      el.download = currentFile?.path || "App.js";
      document.body.appendChild(el); el.click(); document.body.removeChild(el);
      return;
    }
    filesApi.downloadZip(projectId);
  }, [projectId, displayCode, currentFile]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [displayCode]);

  const mainContent = project.files.find(f => f.path.includes("App") || f.path === project.mainFile)?.content || project.files[0]?.content || "";
  const previewHTML = buildPreviewHTML(mainContent);

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      {/* Toolbar */}
      <div className="flex h-14 shrink-0 items-center justify-between px-3 sm:px-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm gap-2">
        <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-xl border border-white/8">
          {(["preview","code"] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)} className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              viewMode===m ? "bg-accent text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:text-zinc-300"
            )}>
              {m==="preview" ? <><Eye size={12}/> Preview</> : <><Code2 size={12}/> Code</>}
            </button>
          ))}
        </div>
        {viewMode==="preview" && (
          <div className="hidden sm:flex items-center gap-0.5 bg-white/5 p-1 rounded-xl border border-white/8">
            {(Object.entries(DEVICE_CONFIGS) as [DeviceType,DeviceConfig][]).map(([key,val]) => {
              const Icon = val.icon;
              return (
                <button key={key} onClick={() => setDevice(key)} title={val.label}
                  className={cn("flex items-center justify-center p-1.5 rounded-lg transition-all",
                    device===key ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-400")}>
                  <Icon size={14}/>
                </button>
              );
            })}
          </div>
        )}
        <div className="flex items-center gap-1">
          <button onClick={() => setRefreshKey(k=>k+1)} title="Refresh"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
            <RotateCcw size={14}/>
          </button>
          {viewMode==="code" && (
            <button onClick={handleCopy}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
              {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
            </button>
          )}
          <button onClick={handleDownloadZip}
            className="flex h-8 items-center justify-center gap-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all px-2">
            <Download size={14}/>
            <span className="text-[10px] uppercase font-bold hidden md:inline">ZIP</span>
          </button>
          <button onClick={() => alert("Publishing coming soon!")}
            className="hidden sm:flex h-8 items-center justify-center rounded-lg bg-white/8 border border-white/10 px-3 text-xs font-bold text-white hover:bg-white/15 transition-all gap-1.5">
            <ExternalLink size={12}/> Publish
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {viewMode==="code" ? (
            <motion.div key="code" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 flex divide-x divide-white/5">
              {project.files.length>1 && (
                <div className="w-48 lg:w-56 shrink-0 bg-zinc-950 flex flex-col pt-4 overflow-y-auto border-r border-white/5">
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-4 mb-2">Explorer</p>
                  {project.files.map(file => (
                    <button key={file.path} onClick={() => setSelectedFilePath(file.path)}
                      className={cn("flex items-center gap-2 px-4 py-1.5 text-xs transition-all border-l-2",
                        selectedFilePath===file.path ? "bg-accent/10 text-accent border-accent" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/3 border-transparent")}>
                      <Code2 size={12}/><span className="truncate">{file.path}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-900/50 border-b border-white/5 flex items-center px-4">
                  <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">{selectedFilePath}</p>
                </div>
                <textarea value={displayCode} readOnly spellCheck={false}
                  className="h-full w-full resize-none bg-zinc-950 text-zinc-200 p-4 pt-10 font-mono text-xs leading-relaxed focus:outline-none"/>
              </div>
            </motion.div>
          ) : (
            <motion.div key="preview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 flex items-center justify-center overflow-auto p-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent_70%)]">
              {device==="phone"   && <PhoneFrame   key={refreshKey} html={previewHTML}/>}
              {device==="tablet"  && <TabletFrame  key={refreshKey} html={previewHTML}/>}
              {device==="desktop" && <DesktopFrame key={refreshKey} html={previewHTML}/>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhoneFrame({html}: FrameProps) {
  return (
    <div className="relative shrink-0" style={{width:398,height:808}}>
      <div className="absolute inset-0 rounded-[3rem] border-[12px] border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/10">
        <div className="relative h-full overflow-hidden rounded-[2.3rem] bg-black">
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-[22px] w-[90px] rounded-full bg-black z-10 pointer-events-none flex items-center justify-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-800"/><div className="h-1.5 w-1.5 rounded-full bg-zinc-700"/>
          </div>
          <iframe srcDoc={html} sandbox="allow-scripts" className="absolute inset-0 w-full h-full border-0" style={{background:"#020205"}} title="Phone Preview"/>
        </div>
      </div>
      <div className="absolute right-[-14px] top-[130px] h-[60px] w-[3px] rounded-full bg-zinc-700"/>
      <div className="absolute left-[-14px] top-[120px] h-[35px] w-[3px] rounded-full bg-zinc-700"/>
      <div className="absolute left-[-14px] top-[165px] h-[55px] w-[3px] rounded-full bg-zinc-700"/>
      <div className="absolute left-[-14px] top-[230px] h-[55px] w-[3px] rounded-full bg-zinc-700"/>
    </div>
  );
}

function TabletFrame({html}: FrameProps) {
  return (
    <div className="relative shrink-0" style={{width:628,height:848}}>
      <div className="absolute inset-0 rounded-[2.5rem] border-[14px] border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/10">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-zinc-700 z-10"/>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-zinc-600 z-10"/>
        <div className="relative h-full overflow-hidden rounded-[2rem] bg-black">
          <iframe srcDoc={html} sandbox="allow-scripts" className="absolute inset-0 w-full h-full border-0" style={{background:"#020205"}} title="Tablet Preview"/>
        </div>
      </div>
      <div className="absolute right-[-14px] top-[200px] h-[50px] w-[3px] rounded-full bg-zinc-700"/>
    </div>
  );
}

function DesktopFrame({html}: FrameProps) {
  return (
    <div className="w-full max-w-4xl shrink-0">
      <div className="rounded-t-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex h-9 items-center gap-2 bg-zinc-900 px-4 border-b border-white/5">
          <div className="flex gap-1.5 shrink-0">
            <div className="h-3 w-3 rounded-full bg-red-500/60"/><div className="h-3 w-3 rounded-full bg-yellow-500/60"/><div className="h-3 w-3 rounded-full bg-green-500/60"/>
          </div>
          <div className="flex-1 mx-3 h-5 rounded-md bg-white/5 flex items-center px-3">
            <span className="text-[10px] text-zinc-600">localhost:8081</span>
          </div>
        </div>
        <div style={{height:"calc(100vh - 280px)",minHeight:400}}>
          <iframe srcDoc={html} sandbox="allow-scripts" className="w-full h-full border-0" style={{background:"#020205"}} title="Desktop Preview"/>
        </div>
      </div>
      <div className="flex justify-center"><div className="h-4 w-32 bg-zinc-800 rounded-b-lg"/></div>
    </div>
  );
}