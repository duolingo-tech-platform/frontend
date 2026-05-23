import { useState, CSSProperties } from "react";

const COLORS = {
  bg: "#010d19",
  bg2: "#021a2e",
  accent: "#43e97b",
  accentDim: "rgba(67,233,123,0.12)",
  accentBorder: "rgba(67,233,123,0.3)",
  accentBorder2: "rgba(67,233,123,0.15)",
  text: "#ffffff",
  muted: "#5a7a8a",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.07)",
  danger: "#ff4d6d",
  dangerDim: "rgba(255,77,109,0.12)",
};

const s: Record<string, CSSProperties> = {
  screen: {
    background: `linear-gradient(160deg, ${COLORS.bg} 0%, ${COLORS.bg2} 50%, ${COLORS.bg} 100%)`,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px",
    gap: "22px",
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    boxSizing: "border-box",
  },
  badge: {
    background: COLORS.accentDim,
    border: `1px solid ${COLORS.accentBorder}`,
    padding: "6px 16px",
    borderRadius: "999px",
    color: COLORS.accent,
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.3px",
    alignSelf: "center",
  },
  progressBar: {
    width: "100%",
    height: "4px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "999px",
    overflow: "hidden",
  },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: "16px",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    color: COLORS.accent,
    letterSpacing: "2.5px",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 1.3,
    margin: 0,
  },
  titleHighlight: { color: COLORS.accent },
  desc: {
    fontSize: "14px",
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 1.6,
    margin: 0,
  },
  primaryBtn: {
    width: "100%",
    height: "52px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
    color: COLORS.bg,
    letterSpacing: "1px",
    background: "linear-gradient(90deg,#43e97b,#38f9d7)",
    boxShadow: "0 8px 32px rgba(67,233,123,0.3)",
  },
  secondaryBtn: {
    width: "100%",
    height: "52px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.accentBorder}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    color: COLORS.accent,
    background: COLORS.accentDim,
    letterSpacing: "0.5px",
  },
  chip: {
    background: "#0d2137",
    border: `1px solid ${COLORS.accentBorder}`,
    padding: "5px 12px",
    borderRadius: "999px",
    color: COLORS.accent,
    fontSize: "11px",
    fontWeight: 600,
  },
};

function ProgressBar({ value, total }: { value: number; total: number }) {
  return (
    <div style={{ ...s.progressBar, width: "100%" }}>
      <div
        style={{
          height: "100%",
          width: `${(value / total) * 100}%`,
          background: "linear-gradient(90deg,#43e97b,#38f9d7)",
          borderRadius: "999px",
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function TopBar({ label, step, total }: { label: string; step: number; total: number }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: COLORS.muted, fontWeight: 600 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: COLORS.accent,
            background: COLORS.accentDim,
            border: `1px solid ${COLORS.accentBorder}`,
            padding: "3px 10px",
            borderRadius: "999px",
          }}
        >
          {step}/{total}
        </span>
      </div>
      <ProgressBar value={step} total={total} />
    </div>
  );
}

// ─── TELA 1: Questão de Múltipla Escolha ───────────────────────────────────

function TelaQuestao({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: "a", text: "Organiza componentes em árvores virtuais para update eficiente do DOM" },
    { id: "b", text: "É um banco de dados em memória para armazenar estado global" },
    { id: "c", text: "Substitui o JavaScript no navegador com código binário" },
    { id: "d", text: "Gerencia requisições HTTP de forma assíncrona" },
  ];

  const getOptionStyle = (id: string): CSSProperties => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${selected === id ? COLORS.accentBorder : COLORS.cardBorder}`,
    background: selected === id ? COLORS.accentDim : COLORS.card,
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
  });

  return (
    <div style={s.screen}>
      <TopBar label="REACT NATIVE · MÓDULO 3" step={3} total={8} />

      <div style={{ ...s.badge }}>🎯 Questão Conceitual</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", textAlign: "center" }}>
        <p style={s.eyebrow}>PERGUNTA</p>
        <p style={{ ...s.title, fontSize: "20px" }}>
          O que é o{" "}
          <span style={s.titleHighlight}>Virtual DOM</span>
          {" "}no React?
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        {options.map((opt) => (
          <button
            key={opt.id}
            style={getOptionStyle(opt.id)}
            onClick={() => setSelected(opt.id)}
          >
            <div
              style={{
                minWidth: "28px",
                height: "28px",
                borderRadius: "50%",
                background: selected === opt.id ? COLORS.accent : "rgba(255,255,255,0.06)",
                border: `1px solid ${selected === opt.id ? COLORS.accent : COLORS.cardBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "12px",
                color: selected === opt.id ? COLORS.bg : COLORS.muted,
                transition: "all 0.2s",
              }}
            >
              {opt.id.toUpperCase()}
            </div>
            <span
              style={{
                fontSize: "13px",
                color: selected === opt.id ? COLORS.text : COLORS.muted,
                lineHeight: 1.5,
                textAlign: "left",
              }}
            >
              {opt.text}
            </span>
          </button>
        ))}
      </div>

      <div
        style={{
          ...s.card,
          display: "flex",
          justifyContent: "space-around",
          padding: "14px 24px",
        }}
      >
        {[["⏱️", "1:45", "Tempo"], ["💡", "2", "Dicas"], ["⭐", "+30", "XP"]].map(
          ([icon, val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px" }}>{icon}</div>
              <div style={{ fontSize: "17px", fontWeight: 800, color: COLORS.text }}>{val}</div>
              <div style={{ fontSize: "10px", color: COLORS.muted, marginTop: "2px" }}>{label}</div>
            </div>
          )
        )}
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button style={{ ...s.primaryBtn, opacity: selected ? 1 : 0.4 }} onClick={onNext}>
          CONFIRMAR RESPOSTA →
        </button>
      </div>
    </div>
  );
}

// ─── TELA 2: Completar Código ───────────────────────────────────────────────

function TelaCompletarCodigo({ onNext }: { onNext: () => void }) {
  const [blanks, setBlanks] = useState<Record<string, string>>({ a: "", b: "", c: "" });

  const tokens = [
    "useState", "useEffect", "props", "return", "const", "async", "render", "import",
  ];

  const setBlank = (key: string, val: string) =>
    setBlanks((prev) => ({ ...prev, [key]: prev[key] === val ? "" : val }));

  const blank = (key: string) => (
    <button
      onClick={() => setBlank(key, "")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "90px",
        height: "22px",
        borderRadius: "6px",
        border: `1px dashed ${blanks[key] ? COLORS.accent : "rgba(67,233,123,0.4)"}`,
        background: blanks[key] ? COLORS.accentDim : "transparent",
        color: blanks[key] ? COLORS.accent : "rgba(67,233,123,0.5)",
        fontSize: "12px",
        fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
        fontWeight: 600,
        cursor: blanks[key] ? "pointer" : "default",
        padding: "0 8px",
        verticalAlign: "middle",
        margin: "0 2px",
      }}
    >
      {blanks[key] || "______"}
    </button>
  );

  const filled = Object.values(blanks).filter(Boolean).length;

  return (
    <div style={s.screen}>
      <TopBar label="AWS · MÓDULO 2" step={5} total={8} />

      <div style={s.badge}>💻 Complete o Código</div>

      <div style={{ textAlign: "center" }}>
        <p style={s.eyebrow}>DESAFIO</p>
        <p style={{ ...s.title, fontSize: "20px" }}>
          Preencha os{" "}
          <span style={s.titleHighlight}>espaços</span>{" "}
          em branco
        </p>
        <p style={{ ...s.desc, marginTop: "6px" }}>
          Arraste ou toque nos tokens abaixo para completar o código
        </p>
      </div>

      <div
        style={{
          ...s.card,
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          fontSize: "13px",
          lineHeight: 2,
        }}
      >
        <div style={{ color: COLORS.muted, marginBottom: "4px", fontSize: "11px" }}>
          Counter.tsx
        </div>
        <div>
          <span style={{ color: "#569cd6" }}>function</span>{" "}
          <span style={{ color: "#dcdcaa" }}>Counter</span>
          <span style={{ color: COLORS.text }}>() {"{"}</span>
        </div>
        <div style={{ paddingLeft: "20px" }}>
          <span style={{ color: "#c586c0" }}>const</span>{" "}
          <span style={{ color: COLORS.text }}>[count, setCount] = </span>
          {blank("a")}
          <span style={{ color: COLORS.text }}>(0);</span>
        </div>
        <div style={{ paddingLeft: "20px" }}>
          {blank("b")}
          <span style={{ color: COLORS.text }}>(() ={">"} {"{"}</span>
        </div>
        <div style={{ paddingLeft: "40px" }}>
          <span style={{ color: "#9cdcfe" }}>document</span>
          <span style={{ color: COLORS.text }}>.title = count;</span>
        </div>
        <div style={{ paddingLeft: "20px" }}>
          <span style={{ color: COLORS.text }}>{"}"}, [count]);</span>
        </div>
        <div style={{ paddingLeft: "20px" }}>
          <span style={{ color: "#c586c0" }}>return</span>{" "}
          <span style={{ color: COLORS.text }}>{"<"}</span>
          <span style={{ color: "#4ec9b0" }}>button</span>{" "}
          <span style={{ color: "#9cdcfe" }}>onClick</span>
          <span style={{ color: COLORS.text }}>={"{"}</span>
          {blank("c")}
          <span style={{ color: COLORS.text }}>{"}>"}</span>Count:{" "}<span style={{ color: COLORS.text }}>{"{"}</span>
          <span style={{ color: "#9cdcfe" }}>count</span>
          <span style={{ color: COLORS.text }}>{"}</"}</span>
          <span style={{ color: "#4ec9b0" }}>button</span>
          <span style={{ color: COLORS.text }}>{">"}</span>
        </div>
        <span style={{ color: COLORS.text }}>{"}"}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
        {tokens.map((t) => (
          <button
            key={t}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: `1px solid ${COLORS.accentBorder}`,
              background: Object.values(blanks).includes(t) ? "rgba(67,233,123,0.25)" : COLORS.accentDim,
              color: COLORS.accent,
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Fira Code', monospace",
              cursor: "pointer",
              opacity: Object.values(blanks).includes(t) ? 0.4 : 1,
            }}
            onClick={() => {
              const emptyKey = ["a", "b", "c"].find((k) => !blanks[k]);
              if (emptyKey && !Object.values(blanks).includes(t))
                setBlanks((prev) => ({ ...prev, [emptyKey]: t }));
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          style={{ ...s.primaryBtn, opacity: filled === 3 ? 1 : 0.4 }}
          onClick={onNext}
        >
          VERIFICAR CÓDIGO →
        </button>
        <button
          style={{
            ...s.secondaryBtn,
            fontSize: "12px",
            height: "40px",
          }}
          onClick={() => setBlanks({ a: "", b: "", c: "" })}
        >
          LIMPAR TUDO
        </button>
      </div>
    </div>
  );
}

// ─── TELA 3: Verdadeiro / Falso ─────────────────────────────────────────────

function TelaVerdadeiroFalso({ onNext }: { onNext: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <div style={s.screen}>
      <TopBar label="REACT NATIVE · MÓDULO 4" step={6} total={8} />

      <div style={s.badge}>⚡ Verdadeiro ou Falso</div>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
        <p style={s.eyebrow}>AFIRMAÇÃO</p>
        <p style={{ ...s.title, fontSize: "20px" }}>
          É possível usar{" "}
          <span style={s.titleHighlight}>Hooks</span>{" "}
          dentro de loops em React
        </p>
      </div>

      <div
        style={{
          ...s.card,
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            background: "rgba(67,233,123,0.1)",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          💡
        </div>
        <div>
          <p style={{ ...s.eyebrow, textAlign: "left", marginBottom: "4px" }}>DICA</p>
          <p style={{ ...s.desc, textAlign: "left", fontSize: "13px" }}>
            Pense nas Regras dos Hooks — React precisa garantir a mesma ordem de chamada em cada render.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", width: "100%" }}>
        {[
          { val: "true", label: "VERDADEIRO", icon: "✓", color: COLORS.accent, dimColor: COLORS.accentDim, borderColor: COLORS.accentBorder },
          { val: "false", label: "FALSO", icon: "✗", color: COLORS.danger, dimColor: COLORS.dangerDim, borderColor: "rgba(255,77,109,0.3)" },
        ].map(({ val, label, icon, color, dimColor, borderColor }) => (
          <button
            key={val}
            onClick={() => { setAnswer(val); }}
            style={{
              flex: 1,
              height: "120px",
              borderRadius: "16px",
              border: `2px solid ${answer === val ? borderColor : COLORS.cardBorder}`,
              background: answer === val ? dimColor : COLORS.card,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: answer === val ? color : "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                color: answer === val ? COLORS.bg : COLORS.muted,
                fontWeight: 800,
                transition: "all 0.2s",
              }}
            >
              {icon}
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                color: answer === val ? color : COLORS.muted,
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <div
        style={{
          ...s.card,
          display: "flex",
          justifyContent: "space-around",
          padding: "14px 24px",
        }}
      >
        {[["🔥", "5", "Sequência"], ["⚡", "+20", "XP"], ["🏆", "Top 12%", "Ranking"]].map(
          ([icon, val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px" }}>{icon}</div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: COLORS.text }}>{val}</div>
              <div style={{ fontSize: "10px", color: COLORS.muted, marginTop: "2px" }}>{label}</div>
            </div>
          )
        )}
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          style={{ ...s.primaryBtn, opacity: answer ? 1 : 0.4 }}
          onClick={onNext}
        >
          CONFIRMAR →
        </button>
      </div>
    </div>
  );
}

// ─── TELA 4: Feedback Resposta ──────────────────────────────────────────────

function TelaFeedback({ onNext, onRestart }: { onNext: () => void; onRestart: () => void }) {
  const isCorrect = true;

  return (
    <div style={s.screen}>
      <TopBar label="REACT NATIVE · MÓDULO 4" step={7} total={8} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: isCorrect ? "rgba(67,233,123,0.15)" : COLORS.dangerDim,
            border: `2px solid ${isCorrect ? COLORS.accentBorder : "rgba(255,77,109,0.3)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "42px",
            boxShadow: isCorrect
              ? "0 0 40px rgba(67,233,123,0.25)"
              : "0 0 40px rgba(255,77,109,0.2)",
          }}
        >
          {isCorrect ? "✓" : "✗"}
        </div>

        <div>
          <p style={{ ...s.eyebrow, marginBottom: "6px" }}>
            {isCorrect ? "RESPOSTA CORRETA!" : "RESPOSTA ERRADA"}
          </p>
          <p style={{ ...s.title, fontSize: "24px" }}>
            {isCorrect ? (
              <>
                Excelente{" "}
                <span style={s.titleHighlight}>raciocínio!</span>
              </>
            ) : (
              <>
                Quase{" "}
                <span style={{ color: COLORS.danger }}>lá!</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div style={{ ...s.card }}>
        <p
          style={{
            ...s.eyebrow,
            textAlign: "left",
            marginBottom: "10px",
            fontSize: "10px",
          }}
        >
          📖 EXPLICAÇÃO
        </p>
        <p style={{ ...s.desc, textAlign: "left", fontSize: "13px", lineHeight: 1.7 }}>
          O Virtual DOM é uma representação leve do DOM real mantida em memória. O React compara
          o estado anterior com o novo (diffing) e aplica apenas as mudanças necessárias no DOM
          real, tornando as atualizações muito mais eficientes.
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", width: "100%" }}>
        {[
          { icon: "⭐", label: "+30 XP", sub: "Ganhos" },
          { icon: "🔥", label: "6", sub: "Sequência" },
          { icon: "⚡", label: "1:12", sub: "Tempo" },
        ].map(({ icon, label, sub }) => (
          <div
            key={sub}
            style={{
              flex: 1,
              ...s.card,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "14px 8px",
            }}
          >
            <span style={{ fontSize: "20px" }}>{icon}</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: COLORS.text }}>{label}</span>
            <span style={{ fontSize: "10px", color: COLORS.muted }}>{sub}</span>
          </div>
        ))}
      </div>

      <div style={{ ...s.card }}>
        <p style={{ ...s.eyebrow, textAlign: "left", marginBottom: "10px", fontSize: "10px" }}>
          🔗 CONCEITOS RELACIONADOS
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["Reconciliation", "React Fiber", "Re-render", "Diffing Algorithm"].map((t) => (
            <span key={t} style={s.chip}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button style={s.primaryBtn} onClick={onNext}>
          PRÓXIMA QUESTÃO →
        </button>
        <button
          style={{
            ...s.secondaryBtn,
            height: "40px",
            fontSize: "12px",
          }}
          onClick={onRestart}
        >
          VER EXPLICAÇÃO COMPLETA
        </button>
      </div>
    </div>
  );
}

// ─── NAV / ROOT ─────────────────────────────────────────────────────────────

const SCREENS = ["questao", "codigo", "verdfalso", "feedback"];

export default function App() {
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((i) => Math.min(i + 1, SCREENS.length - 1));
  const restart = () => setIdx(0);

  const screen = SCREENS[idx];

  const navStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 24px 20px",
    background: "#010d19",
    width: "100%",
    boxSizing: "border-box",
  };

  const navBtn = (i: number) => ({
    padding: "6px 14px",
    borderRadius: "999px",
    border: `1px solid ${i === idx ? COLORS.accentBorder : COLORS.cardBorder}`,
    background: i === idx ? COLORS.accentDim : "transparent",
    color: i === idx ? COLORS.accent : COLORS.muted,
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.5px",
  });

  const LABELS = ["Questão", "Código", "V/F", "Feedback"];

  return (
    <div style={{ background: "#010d19", minHeight: "100vh" }}>
      <div style={navStyle}>
        {LABELS.map((l, i) => (
          <button key={l} style={navBtn(i)} onClick={() => setIdx(i)}>
            {l}
          </button>
        ))}
      </div>

      {screen === "questao" && <TelaQuestao onNext={next} />}
      {screen === "codigo" && <TelaCompletarCodigo onNext={next} />}
      {screen === "verdfalso" && <TelaVerdadeiroFalso onNext={next} />}
      {screen === "feedback" && <TelaFeedback onNext={next} onRestart={restart} />}
    </div>
  );
}