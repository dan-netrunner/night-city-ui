# Guía de Uso y Personalización de Colores — Night City UI

Esta guía explica cómo usar los componentes de **Night City UI**, cómo cambiar entre los 4 temas incluidos y cómo modificar los colores o crear tu propio tema.

---

## 1. Uso básico en React

### Envolver tu aplicación con `ThemeProvider`
Importa los estilos base (`tokens.css` y `ui.css`) y envuelve tu aplicación con `ThemeProvider` (definido en `src/theme.tsx`):

```tsx
import "./styles/tokens.css";
import "./styles/ui.css";
import { ThemeProvider } from "./theme";
import { Button, Panel, Progress, Badge } from "./components";

export function App() {
  return (
    <ThemeProvider>
      <Panel kicker="// SYS.01" title="Terminal" telemetry="LINK: OK" accent>
        <Badge tone="ok" pulse>Online</Badge>
        <Progress label="RAM deck" value={75} segmented />
        <Button code="01">Ejecutar</Button>
      </Panel>
    </ThemeProvider>
  );
}
```

### Cambiar de tema dinámicamente
Usa el hook `useTheme()` en cualquier componente hijo de `ThemeProvider`:

```tsx
import { useTheme, THEMES } from "./theme";

function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          aria-pressed={theme === t.id}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
```

### Aplicar un tema distinto a una sección específica
No necesitas cambiar el tema global: cualquier elemento HTML con el atributo `data-theme` aplica ese skin a todos los componentes dentro de él:

```tsx
<section data-theme="kitsch">
  <Panel title="Vista previa Tacky//Futurism">
    <Button>Botón Tacky//Futurism</Button>
  </Panel>
</section>
```

Temas disponibles: `"neokitsch"` | `"entropism"` | `"kitsch"` | `"neomilitarism"`.

---

## 2. Catálogo rápido de componentes y props destacadas

Todos los componentes se exportan desde `src/components/index.ts`:

- **`Button`**: `variant` (`"primary" | "ghost" | "outline" | "danger"`), `size` (`"sm" | "md" | "lg"`), `block`, `code` (etiqueta micro-telemétrica, ej. `"01"`).
- **`Panel`**: `title`, `kicker`, `telemetry` (etiqueta en cabecera, ej. `"SYS // 2077"`), `actions`, `footer`, `accent`, `flush`.
- **`Badge`**: `tone` (`"neutral" | "accent" | "ok" | "warn" | "danger"`), `solid`, `pulse` (nodo animado de estado).
- **`Progress`**: `value`, `max`, `label`, `showValue`, `tone` (`"accent" | "ok" | "warn" | "danger"`), `segmented` (barra segmentada estilo HUD), `segments` (cantidad de segmentos, por defecto `12`).
- **`Alert`**: `tone` (`"info" | "ok" | "warn" | "danger"`), `title`, `onDismiss`.
- **`Tabs`**: `items` (`{ id, label, count? }[]`), `value`, `onChange`, `label`.
- **`Modal`**: `open`, `onClose`, `title`, `kicker`, `footer`.
- **`Campos de formulario`**: `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Toggle`, `Slider`.
- **`Navegación`**: `Tabs`, `Breadcrumbs` (`items: { label, href? }[]`), `Pagination` (`page`, `pageCount`, `onChange`), `Accordion` (`items: { id, title, meta?, children }[]`, `defaultOpen`).
- **`Feedback`**: `Toast` y `ToastStack` (`items: ToastItem[]`, `onDismiss(id)`), `Tooltip` (`label`, `side`, envuelve un control focusable).
- **`Datos y estados`**: `Metric` (`label`, `value`, `unit`, `delta`, `tone`), `Avatar` (`name`, `src`, `status`, `size`), `Spinner`, `Skeleton`, `EmptyState`, `Divider` (con `label`), `Kbd`.
- **`CodeBlock`**: `code`, `label` (bloque de código con botón de copiado).
- **`Table`**: solo CSS; usa `.cp-table-wrap` y `.cp-table` en tu `<table>`.

> **Tip:** En la página **Components** de la app puedes probar estas props en tiempo real con el **Interactive Inspector** y copiar el JSX generado.

---

## 3. Cómo modificar los colores

Todos los colores, tipografías, bordes, sombras y recortes (`clip-path`) viven en **`src/styles/tokens.css`** como variables CSS (*custom properties*). Los componentes en `ui.css` solo consumen esas variables, por lo que cambiar un color actualiza toda la interfaz automáticamente.

### Variables de color principales

| Variable | Uso |
| :--- | :--- |
| `--bg`, `--bg-2` | Fondo principal y secundario de la página |
| `--panel`, `--panel-2` | Fondo de tarjetas y paneles |
| `--ink`, `--ink-dim`, `--ink-faint` | Texto principal, secundario y tenue |
| `--line`, `--line-strong` | Bordes normales y bordes enfatizados |
| `--accent`, `--accent-2` | Color principal de acento/neón y acento secundario |
| `--accent-ink` | Color de texto sobre botones o badges con fondo `--accent` |
| `--accent-ghost` | Fondo translúcido para estados hover/activos (ej. `rgb(124 198 186 / 0.12)`) |
| `--ok`, `--warn`, `--danger` | Colores semánticos de éxito, advertencia y peligro (junto a `--ok-ink`, `--warn-ink`, `--danger-ink`) |
| `--glow`, `--focus-glow` | Resplandor neón y anillo de foco accesible |
| `--page-bg` | Gradientes y textura de fondo del viewport |

### Opción A: Editar un tema existente
Abre `src/styles/tokens.css`, busca el bloque del tema que quieras ajustar (por ejemplo `[data-theme="neokitsch"]`) y cambia los valores hexadecimales o `rgb(...)`:

```css
:root,
[data-theme="neokitsch"] {
  --accent: #00f0ff;      /* Nuevo cyan neón */
  --accent-2: #fcee0a;    /* Amarillo Cyberpunk */
  --accent-ink: #041214;  /* Texto oscuro con buen contraste sobre --accent */
  --accent-ghost: rgb(0 240 255 / 0.14);
  --glow: 0 0 18px rgb(0 240 255 / 0.35);
}
```

> **Nota de contraste:** Si cambias `--accent`, `--ok`, `--warn` o `--danger` por un color muy claro o muy oscuro, ajusta también su `*-ink` correspondiente (`--accent-ink`, `--ok-ink`, etc.) para mantener buena legibilidad en botones y badges sólidos.

### Opción B: Sobrescribir colores solo en una parte de tu app
Si no quieres modificar `tokens.css`, puedes sobrescribir las variables en tu propio archivo CSS o en un contenedor:

```css
.mi-modulo-custom {
  --accent: #fcee0a;
  --accent-ink: #141200;
  --accent-ghost: rgb(252 238 10 / 0.14);
  --panel: #141418;
}
```

### Opción C: Agregar un 5.º tema completo
1. En **`src/styles/tokens.css`**, duplica un bloque `[data-theme="..."]` y renómbralo (ej. `[data-theme="arasaka"]`) con tu nueva paleta.
2. En **`src/theme.tsx`**:
   - Agrega `"arasaka"` al tipo `ThemeId`.
   - Añade su metadata (nombre, era, `swatches`, `traits`) al arreglo `THEMES`.
   - Añade su color de fondo a `THEME_COLORS`.
3. *(Opcional)* En **`index.html`**, incluye `"arasaka"` en el script inicial que lee `localStorage` (`nc-theme`) para evitar parpadeo de color antes del primer render.
