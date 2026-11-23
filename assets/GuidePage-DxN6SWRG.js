import{u as b,r as o,j as e,a as x,P as t,C as r,b as v,B as d,A as S}from"./index-Cry9YrXr.js";import{P as N,I as i}from"./PageHead-Bsq1WuLD.js";const y="npm install night-city-ui",T=`import "night-city-ui/style.css";
import {
  Badge,
  Button,
  Panel,
  Progress,
  ThemeProvider,
} from "night-city-ui";

export function App() {
  return (
    <ThemeProvider>
      <Panel kicker="// SYS.01" title="Terminal" telemetry="LINK: OK" accent>
        <Badge tone="ok" pulse>Online</Badge>
        <Progress label="RAM deck" value={75} segmented />
        <Button code="01">Engage</Button>
      </Panel>
    </ThemeProvider>
  );
}`,f=`import { useTheme } from "night-city-ui";

// 1) Cambiar tema global con useTheme()
const { theme, setTheme } = useTheme();
setTheme("kitsch");

// 2) O aplicar un tema distinto solo a una sección:
<section data-theme="neomilitarism">
  <Panel title="Tactical HUD">
    <Button>Deploy</Button>
  </Panel>
</section>`,P=[{token:"--bg / --bg-2",role:"Fondo principal y secundario del viewport"},{token:"--panel / --panel-2",role:"Superficie de paneles, tarjetas y modales"},{token:"--ink / --ink-dim / --ink-faint",role:"Texto principal, secundario y micro-etiquetas"},{token:"--line / --line-strong",role:"Bordes base y bordes enfatizados"},{token:"--accent / --accent-2",role:"Color principal neón y acento secundario"},{token:"--accent-ink",role:"Color de texto sobre botones o badges con fondo --accent"},{token:"--accent-ghost",role:"Fondo translúcido para hover y estados activos"},{token:"--ok / --warn / --danger",role:"Estados semánticos (junto a --ok-ink, --warn-ink, --danger-ink)"},{token:"--glow / --focus-glow",role:"Resplandor neón y anillo de foco accesible"}];function w(){const{meta:j}=b(),[s,h]=o.useState("#00f0ff"),[n,m]=o.useState("#041214"),[c,u]=o.useState("#121a2c"),[l,p]=o.useState("#fcee0a"),g=`[data-theme="custom"] {
  --accent: ${s};
  --accent-2: ${l};
  --accent-ink: ${n};
  --accent-ghost: color-mix(in oklch, ${s} 14%, transparent);
  --panel: ${c};
  --glow: 0 0 18px color-mix(in oklch, ${s} 32%, transparent);
}`,k={"--accent":s,"--accent-2":l,"--accent-ink":n,"--accent-ghost":`color-mix(in oklch, ${s} 14%, transparent)`,"--panel":c,"--glow":`0 0 18px color-mix(in oklch, ${s} 32%, transparent)`};return e.jsxs("div",{className:"page",children:[e.jsx(N,{eyebrow:"Documentation // v2.0.7.7",title:"Usage & color guide",lead:"How to integrate Night City UI in React, switch between the four skins, and customize CSS color tokens live.",children:e.jsxs(x,{tone:"accent",solid:!0,children:["Active: ",j.name]})}),e.jsxs("div",{className:"comp-grid",children:[e.jsx(t,{className:"span-6",kicker:"// 01 quickstart",title:"Wrap your app",telemetry:"REACT // TS",children:e.jsxs("div",{className:"demo-stack",children:[e.jsxs("p",{className:"muted",children:["Install the package, import its stylesheet once, and wrap your root with"," ",e.jsx("code",{children:"ThemeProvider"}),". Every component is a named export."]}),e.jsx(r,{code:y,label:"SHELL // INSTALL"}),e.jsx(r,{code:T,label:"TSX // APP.TSX"})]})}),e.jsx(t,{className:"span-6",kicker:"// 02 theming",title:"Switch or scope themes",telemetry:"4 SKINS",children:e.jsxs("div",{className:"demo-stack",children:[e.jsxs("p",{className:"muted",children:["Use ",e.jsx("code",{children:"useTheme()"})," to change the global skin (persisted in"," ",e.jsx("code",{children:"localStorage"}),") or pass ",e.jsx("code",{children:"data-theme"})," to any subtree."]}),e.jsx(r,{code:f,label:"TSX // THEME SWITCH"})]})}),e.jsx(t,{className:"span-12",kicker:"// 03 live color lab",title:"Customize colors & export CSS",telemetry:"TOKENS.CSS",accent:!0,children:e.jsxs("div",{className:"docs-grid",children:[e.jsxs("div",{className:"demo-stack",children:[e.jsxs("p",{className:"muted",children:["All components read CSS custom properties from the bundled"," ",e.jsx("code",{children:"tokens.css"}),". Adjust the tokens below to preview a custom palette and copy the CSS block."]}),e.jsxs("div",{className:"demo-grid",children:[e.jsxs("label",{className:"cp-field",children:[e.jsx("span",{className:"cp-field__label",children:"--accent"}),e.jsxs("div",{className:"guide-color-row",children:[e.jsx("input",{type:"color","aria-label":"Accent color",value:s,onChange:a=>h(a.target.value)}),e.jsx(i,{"aria-label":"Accent hex",value:s,onChange:a=>h(a.target.value)})]})]}),e.jsxs("label",{className:"cp-field",children:[e.jsx("span",{className:"cp-field__label",children:"--accent-2"}),e.jsxs("div",{className:"guide-color-row",children:[e.jsx("input",{type:"color","aria-label":"Secondary accent color",value:l,onChange:a=>p(a.target.value)}),e.jsx(i,{"aria-label":"Secondary accent hex",value:l,onChange:a=>p(a.target.value)})]})]}),e.jsxs("label",{className:"cp-field",children:[e.jsx("span",{className:"cp-field__label",children:"--accent-ink"}),e.jsxs("div",{className:"guide-color-row",children:[e.jsx("input",{type:"color","aria-label":"Accent ink color",value:n,onChange:a=>m(a.target.value)}),e.jsx(i,{"aria-label":"Accent ink hex",value:n,onChange:a=>m(a.target.value)})]})]}),e.jsxs("label",{className:"cp-field",children:[e.jsx("span",{className:"cp-field__label",children:"--panel"}),e.jsxs("div",{className:"guide-color-row",children:[e.jsx("input",{type:"color","aria-label":"Panel background color",value:c,onChange:a=>u(a.target.value)}),e.jsx(i,{"aria-label":"Panel background hex",value:c,onChange:a=>u(a.target.value)})]})]})]}),e.jsx(r,{code:g,label:"CSS // CUSTOM THEME"})]}),e.jsx("div",{className:"demo-stack",style:k,children:e.jsx(t,{kicker:"// LIVE OVERRIDE",title:"Custom skin preview",telemetry:"CUSTOM",accent:!0,actions:e.jsx(x,{tone:"accent",pulse:!0,children:"Linked"}),children:e.jsxs("div",{className:"demo-stack",children:[e.jsx(v,{label:"Neural buffer",value:78,segmented:!0}),e.jsxs("div",{className:"demo-row",children:[e.jsx(d,{code:"01",children:"Primary"}),e.jsx(d,{variant:"outline",children:"Outline"}),e.jsx(d,{variant:"ghost",children:"Ghost"})]}),e.jsxs(S,{tone:"info",title:"Contrast tip",children:["Keep ",e.jsx("code",{children:"--accent-ink"})," dark on bright neons so button labels stay crisp."]})]})})})]})}),e.jsx(t,{className:"span-12",kicker:"// 04 token reference",title:"Color variables in tokens.css",flush:!0,children:e.jsx("div",{className:"cp-table-wrap",children:e.jsxs("table",{className:"cp-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Variable"}),e.jsx("th",{children:"Role"})]})}),e.jsx("tbody",{children:P.map(a=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:a.token})}),e.jsx("td",{children:a.role})]},a.token))})]})})})]})]})}export{w as GuidePage};
