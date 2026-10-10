const REFERENCE = { T1: 303, gamma: 0.25, Qsol: 1500 }
const W0 = [1.23, 0.4, 0.7, -0.15, 0.72, -0.12, 0.7, 0.01]
const RAW = [
  [20, 13, 310.8, 30.99],
  [20, 14.5, 308, 32.2],
  [20, 15.3, 306, 31.7],
  [20.2, 13, 310.8, 30.92],
  [20, 14.5, 308, 32.4],
  [20, 15.3, 306, 31.4],
  [24, 13, 310.8, 35.53],
  [36, 14.4, 308.1, 46.41],
]
const XY = RAW.map((row) => [row[0] / 20.2, row[1] / 14.5, row[2] / 308, row[3] / 32.4])
const SAVED = {
  fp: {
    label: "First principles",
    weights: [1.2018126099796123, 0.36846242977640614, 0.6805101097717444, -0.12954646384219662, 0.7054247009086284, -0.10537214627531703, 0.6931022009028446, 0.0202996019370773],
    error: "Squared error 0.000214",
  },
  keras: {
    label: "Keras",
    weights: [1.2122325897216797, 0.35797956585884094, 0.7119244933128357, -0.14370304346084595, 0.7058301568031311, -0.11044307053089142, 0.6823572516441345, 0.022925589233636856],
    error: "Mean absolute error 0.0118",
  },
  fp20: {
    label: "First principles, start +20%",
    weights: [1.0316461534515105, 0.2578915867174559, 0.7816533771894972, -0.1524177450105713, 0.7342589800235941, -0.1330542247249672, 0.7555099725274971, 0.02035239926708193],
    error: "Squared error 0.000208",
  },
  keras20: {
    label: "Keras, start +20%",
    weights: [1.2378066778182983, 0.3967772126197815, 0.8381450772285461, -0.19073833525180817, 0.709007203578949, -0.15334247052669525, 0.6648793816566467, 0.004263090901076794],
    error: "Mean absolute error 0.0119",
  },
}

const state = { ...REFERENCE, p1: "fp", live: null }
const journal = []
let lastRefusal = ""
let turbine = null
let referencePrediction = null

const $ = (id) => document.querySelector(id)

function format(value, digits) {
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function elu(z) { return z >= 0 ? z : Math.exp(z) - 1 }
function eluPrime(z) { return z >= 0 ? 1 : Math.exp(z) }

function p1Forward(w, x) {
  const z1 = w[0] * x[0] + w[1] * x[1] + w[2] * x[2] + w[3]
  const a1 = elu(z1)
  const z2 = w[4] * a1 + w[5]
  const a2 = elu(z2)
  const z3 = w[6] * a2 + w[7]
  return { a1, a2, a3: elu(z3), sp1: eluPrime(z1), sp2: eluPrime(z2), sp3: eluPrime(z3) }
}

function p1Predict(w) {
  return XY.map((row) => p1Forward(w, row).a3 * 32.4)
}

function trainNewton(scale, gamma) {
  let w = W0.map((value) => value * scale)
  let best = { E: 1e9, w: w.slice(), epoch: 0 }
  let stall = 0
  let diverged = false
  for (let k = 0; k < 2500; k += 1) {
    let E = 0
    const d = [0, 0, 0, 0, 0, 0, 0, 0]
    XY.forEach((row) => {
      const f = p1Forward(w, row)
      const dE = 2 * (f.a3 - row[3])
      E += (f.a3 - row[3]) ** 2
      const g3 = dE * f.sp3
      const g2 = g3 * w[6] * f.sp2
      const g1 = g2 * w[4] * f.sp1
      d[0] += g1 * row[0]
      d[1] += g1 * row[1]
      d[2] += g1 * row[2]
      d[3] += g1
      d[4] += g2 * f.a1
      d[5] += g2
      d[6] += g3 * f.a2
      d[7] += g3
    })
    E /= 8
    if (E < best.E) {
      best = { E, w: w.slice(), epoch: k + 1 }
      stall = 0
    } else stall += 1
    const stepGain = E < 0.001 ? Math.min(gamma, 0.001) : gamma
    const step = d.map((partial) => stepGain * (-E) / (Math.abs(partial) < 1e-12 ? 1e-12 : partial / 8))
    if (!step.every(Number.isFinite) || Math.max(...step.map(Math.abs)) > 2) {
      diverged = true
      break
    }
    w = w.map((value, index) => value + step[index])
    if (best.E < 0.00035 && stall > 250) break
  }
  return { ...best, diverged }
}

function dense(vector, layer) {
  const { kernel, bias, activation } = layer
  const out = []
  for (let j = 0; j < bias.length; j += 1) {
    let sum = bias[j]
    for (let i = 0; i < vector.length; i += 1) sum += vector[i] * kernel[i][j]
    if (activation === "relu") sum = Math.max(0, sum)
    else if (activation === "elu") sum = elu(sum)
    out.push(sum)
  }
  return out
}

function predictTurbine(T1, gamma, Qsol) {
  const { medians } = turbine
  let hidden = [T1 / medians.T1, gamma / medians.gamma, Qsol / medians.Qsol]
  turbine.layers.forEach((layer) => { hidden = dense(hidden, layer) })
  return { alpha: hidden[0] * medians.alpha, eta: hidden[1] * medians.eta }
}

function onCorner(T1, gamma, Qsol) {
  return Math.abs(T1 - 318) <= 2 && Math.abs(gamma - 0.5) <= 0.03 && Math.abs(Qsol - 2500) <= 40
}

function insideEnvelope(T1, gamma, Qsol) {
  const box = turbine.envelope
  return T1 >= box.T1[0] && T1 <= box.T1[1]
    && gamma >= box.gamma[0] && gamma <= box.gamma[1]
    && Qsol >= box.Qsol[0] && Qsol <= box.Qsol[1]
}

function gate(pred) {
  const { T1, gamma, Qsol } = state
  if (!insideEnvelope(T1, gamma, Qsol)) {
    return { allow: false, reason: "This point is not in the 60 tests." }
  }
  if (onCorner(T1, gamma, Qsol)) {
    return {
      allow: false,
      reason: `Measured air–fuel ratio 131.3. This model says ${format(pred.alpha, 1)}.`,
    }
  }
  return { allow: true, reason: "Inside the tests, and not the hot corner." }
}

function settingLabel() {
  return `${format(state.T1, 0)} K, propane ${format(state.gamma, 2)}, ${format(state.Qsol, 0)} kW`
}

function pushJournal(kind, reason) {
  journal.unshift({
    time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    kind,
    reason,
    setting: settingLabel(),
  })
  if (journal.length > 8) journal.pop()
}

function paintJournal() {
  const list = $("#journal")
  if (journal.length === 0) {
    list.innerHTML = "<li>No setting sent yet.</li>"
    return
  }
  list.innerHTML = journal.map((entry) => (
    `<li class="${entry.kind}"><strong>${entry.kind === "proposed" ? "Proposed" : "Refused"}</strong> ${entry.time} — ${entry.setting}. ${entry.reason}</li>`
  )).join("")
}

function noteRefusal(reason) {
  const key = `${settingLabel()}|${reason}`
  if (key === lastRefusal) return
  lastRefusal = key
  pushJournal("refused", reason)
}

function canvasBox(canvas) {
  const ratio = window.devicePixelRatio || 1
  const width = canvas.clientWidth || 640
  const height = canvas.clientHeight || 320
  canvas.width = Math.floor(width * ratio)
  canvas.height = Math.floor(height * ratio)
  const ctx = canvas.getContext("2d")
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.clearRect(0, 0, width, height)
  return { ctx, width, height }
}

function colorScale(t) {
  const stops = [[68, 1, 84], [49, 104, 142], [31, 158, 137], [110, 206, 88], [253, 231, 37]]
  const x = Math.min(0.999, Math.max(0, t)) * (stops.length - 1)
  const i = Math.floor(x)
  const f = x - i
  const a = stops[i]
  const b = stops[Math.min(stops.length - 1, i + 1)]
  const mix = a.map((channel, index) => Math.round(channel + (b[index] - channel) * f))
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`
}

function axisText(ctx) {
  ctx.fillStyle = "#1c1915"
  ctx.font = "12px sans-serif"
}

function drawP1() {
  const canvas = $("#p1-plot")
  if (!canvas) return
  const { ctx, width, height } = canvasBox(canvas)
  const weights = state.live ? state.live.w : SAVED[state.p1].weights
  const predicted = p1Predict(weights)
  const measured = RAW.map((row) => row[3])
  const pad = { l: 52, r: 16, t: 16, b: 40 }
  const lo = 28
  const hi = 52
  const span = Math.log10(hi) - Math.log10(lo)
  const xOf = (value) => pad.l + ((Math.log10(value) - Math.log10(lo)) / span) * (width - pad.l - pad.r)
  const yOf = (value) => pad.t + (1 - (Math.log10(value) - Math.log10(lo)) / span) * (height - pad.t - pad.b)
  ctx.strokeStyle = "#1c1915"
  ctx.beginPath()
  ctx.moveTo(xOf(lo), yOf(lo))
  ctx.lineTo(xOf(hi), yOf(hi))
  ctx.stroke()
  axisText(ctx)
  ;[30, 40, 50].forEach((tick) => {
    ctx.fillText(String(tick), xOf(tick) - 8, height - 16)
    ctx.fillText(String(tick), 8, yOf(tick) + 4)
  })
  predicted.forEach((value, index) => {
    ctx.fillStyle = "#1f4e79"
    ctx.beginPath()
    ctx.arc(xOf(value), yOf(measured[index]), 5, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawSurface() {
  const canvas = $("#surface")
  const { ctx, width, height } = canvasBox(canvas)
  const nT = 42
  const nQ = 32
  const t0 = 268
  const t1 = 318
  const q0 = 500
  const q1 = 2500
  const pad = { l: 58, r: 78, t: 16, b: 46 }
  const plotW = width - pad.l - pad.r
  const plotH = height - pad.t - pad.b
  let min = Infinity
  let max = -Infinity
  const grid = []
  for (let iq = 0; iq < nQ; iq += 1) {
    for (let it = 0; it < nT; it += 1) {
      const T = t0 + ((t1 - t0) * it) / (nT - 1)
      const Q = q0 + ((q1 - q0) * iq) / (nQ - 1)
      const alpha = predictTurbine(T, state.gamma, Q).alpha
      grid.push(alpha)
      min = Math.min(min, alpha)
      max = Math.max(max, alpha)
    }
  }
  const cellW = plotW / nT
  const cellH = plotH / nQ
  grid.forEach((alpha, index) => {
    const it = index % nT
    const iq = Math.floor(index / nT)
    ctx.fillStyle = colorScale((alpha - min) / (max - min || 1))
    ctx.fillRect(pad.l + it * cellW, pad.t + plotH - (iq + 1) * cellH, cellW + 0.6, cellH + 0.6)
  })
  const xOfT = (T) => pad.l + ((T - t0) / (t1 - t0)) * plotW
  const yOfQ = (Q) => pad.t + plotH - ((Q - q0) / (q1 - q0)) * plotH
  if (state.T1 >= t0 && state.T1 <= t1 && state.Qsol >= q0 && state.Qsol <= q1) {
    const x = xOfT(state.T1)
    const y = yOfQ(state.Qsol)
    ctx.fillStyle = "#1c1915"
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.stroke()
  }
  axisText(ctx)
  ;[268, 293, 318].forEach((tick) => ctx.fillText(`${tick} K`, xOfT(tick) - 16, height - 22))
  ;[500, 1500, 2500].forEach((tick) => ctx.fillText(String(tick), 8, yOfQ(tick) + 4))
  ctx.fillText("Inlet temperature", pad.l, height - 6)
  ctx.save()
  ctx.translate(14, pad.t + 12)
  ctx.fillText("Solar kW", 0, 0)
  ctx.restore()
  const legendX = width - pad.r + 16
  for (let i = 0; i < plotH; i += 1) {
    ctx.fillStyle = colorScale(1 - i / plotH)
    ctx.fillRect(legendX, pad.t + i, 14, 1)
  }
  ctx.fillText(format(max, 0), legendX + 18, pad.t + 12)
  ctx.fillText(format(min, 0), legendX + 18, pad.t + plotH)
  ctx.fillText("Air–fuel", legendX, pad.t - 2)
  $("#surface-caption").textContent = `Air–fuel ratio from ${format(min, 0)} to ${format(max, 0)} at propane ${format(state.gamma, 2)}. Axes are inlet temperature and solar heat. The dot is the current setting.`
}

function drawScatter() {
  const canvas = $("#scatter")
  const { ctx, width, height } = canvasBox(canvas)
  const pad = { l: 56, r: 16, t: 28, b: 42 }
  const points = turbine.test.map((row) => ({
    predicted: predictTurbine(row.T1, row.gamma, row.Qsol).alpha,
    measured: row.alpha,
    corner: row.T1 === 318 && row.gamma === 0.5 && row.Qsol === 2500,
  }))
  const lo = 30
  const hi = 160
  const span = Math.log10(hi) - Math.log10(lo)
  const xOf = (value) => pad.l + ((Math.log10(value) - Math.log10(lo)) / span) * (width - pad.l - pad.r)
  const yOf = (value) => pad.t + (1 - (Math.log10(value) - Math.log10(lo)) / span) * (height - pad.t - pad.b)
  ctx.strokeStyle = "#1c1915"
  ctx.beginPath()
  ctx.moveTo(xOf(lo), yOf(lo))
  ctx.lineTo(xOf(hi), yOf(hi))
  ctx.stroke()
  axisText(ctx)
  ;[30, 50, 100, 150].forEach((tick) => {
    ctx.fillText(String(tick), xOf(tick) - 10, height - 18)
    ctx.fillText(String(tick), 12, yOf(tick) + 4)
  })
  ctx.fillText("Predicted air–fuel ratio", pad.l, height - 4)
  ctx.fillText("Measured", 12, 16)
  let cornerPoint = null
  points.forEach((point) => {
    ctx.fillStyle = point.corner ? "#9a3412" : "#1f4e79"
    ctx.beginPath()
    ctx.arc(xOf(point.predicted), yOf(point.measured), point.corner ? 7 : 4.5, 0, Math.PI * 2)
    ctx.fill()
    if (point.corner) cornerPoint = point
  })
  if (cornerPoint) {
    ctx.fillStyle = "#9a3412"
    ctx.fillText("131 measured, about 116 predicted", xOf(cornerPoint.predicted) - 150, yOf(cornerPoint.measured) - 14)
  }
}

function renderP1() {
  const saved = SAVED[state.p1]
  const weights = state.live ? state.live.w : saved.weights
  const names = ["w01", "w02", "w03", "b1", "w12", "b2", "w23", "b3"]
  $("#weight-head").textContent = state.live ? "Recomputed" : saved.label
  $("#weights").innerHTML = names.map((name, index) => `<tr><td>${name}</td><td>${weights[index].toFixed(4)}</td></tr>`).join("")
  if (state.live) {
    const mae = p1Predict(weights).reduce((sum, value, index) => sum + Math.abs(value - RAW[index][3]), 0) / RAW.length / 32.4
    $("#p1-error").textContent = state.live.diverged
      ? `This learning rate diverges. Best squared error reached: ${state.live.E.toFixed(5)}.`
      : `Recomputed. Squared error ${state.live.E.toFixed(6)} at epoch ${state.live.epoch}. Mean absolute error ${mae.toFixed(4)}.`
  } else {
    $("#p1-error").textContent = saved.error
  }
  document.querySelectorAll("#p1-modes button").forEach((button) => {
    button.classList.toggle("primary", button.dataset.mode === state.p1 && !state.live)
  })
  drawP1()
}

function renderConsole() {
  const { T1, gamma, Qsol } = state
  $("#t1").value = T1
  $("#gamma").value = gamma
  $("#qsol").value = Qsol
  $("#t1-out").textContent = `${format(T1, 0)} K`
  $("#gamma-out").textContent = format(gamma, 2)
  $("#q-out").textContent = `${format(Qsol, 0)} kW`
  const pred = predictTurbine(T1, gamma, Qsol)
  const ref = referencePrediction
  const alphaChange = ((pred.alpha - ref.alpha) / ref.alpha) * 100
  const etaPoints = (pred.eta - ref.eta) * 100
  const fuelChange = ((ref.alpha / pred.alpha) - 1) * 100
  $("#alpha").textContent = format(pred.alpha, 1)
  $("#eta").textContent = format(pred.eta * 100, 1)
  $("#alpha-delta").textContent = `${alphaChange >= 0 ? "+" : ""}${format(alphaChange, 1)}% vs reference`
  $("#eta-delta").textContent = `${etaPoints >= 0 ? "+" : ""}${format(etaPoints, 1)} points vs reference`
  const fuelLine = Math.abs(fuelChange) < 0.05
    ? "Fuel for the same air: the same as the reference setting."
    : `Fuel for the same air: ${format(Math.abs(fuelChange), 1)}% ${fuelChange < 0 ? "less" : "more"} than the reference setting.`
  $("#fuel-line").textContent = fuelLine

  const decision = gate(pred)
  const status = $("#status")
  const send = $("#send")
  status.className = "status"
  send.disabled = !decision.allow
  $("#send-reason").textContent = decision.reason
  if (!decision.allow && !insideEnvelope(T1, gamma, Qsol)) {
    status.classList.add("outside")
    status.textContent = "Outside the tests"
    $("#decision").textContent = "Do not send this setting."
  } else if (!decision.allow) {
    status.classList.add("caution")
    status.textContent = "Hot corner"
    $("#decision").textContent = "Do not send this air–fuel ratio."
  } else {
    status.classList.add("inside")
    status.textContent = "Inside the tests"
    $("#decision").textContent = "This setting can be sent."
  }
  $("#detail").textContent = decision.reason
  if (!decision.allow) noteRefusal(decision.reason)
  else lastRefusal = ""
  paintJournal()
  drawSurface()
  drawScatter()
}

function resetAll() {
  Object.assign(state, REFERENCE)
  state.p1 = "fp"
  state.live = null
  journal.length = 0
  lastRefusal = ""
  $("#newton-gamma").value = "0.015"
  $("#newton-out").textContent = "0.015"
  $("#newton-note").textContent = "Saved result. Move the learning rate to recompute this fit."
  renderP1()
  renderConsole()
}

function buildModes() {
  const box = $("#p1-modes")
  Object.entries(SAVED).forEach(([id, item]) => {
    const button = document.createElement("button")
    button.type = "button"
    button.dataset.mode = id
    button.textContent = item.label
    button.addEventListener("click", () => {
      state.p1 = id
      state.live = null
      $("#newton-note").textContent = "Saved result. Move the learning rate to recompute from this start."
      renderP1()
    })
    box.appendChild(button)
  })
}

async function main() {
  turbine = await (await fetch("model.json")).json()
  referencePrediction = predictTurbine(REFERENCE.T1, REFERENCE.gamma, REFERENCE.Qsol)
  buildModes()
  $("#reset").addEventListener("click", resetAll)
  $("#send").addEventListener("click", () => {
    const pred = predictTurbine(state.T1, state.gamma, state.Qsol)
    const decision = gate(pred)
    if (!decision.allow) return
    lastRefusal = ""
    pushJournal("proposed", decision.reason)
    paintJournal()
  })
  $("#newton-gamma").addEventListener("input", (event) => {
    const gamma = Number(event.target.value)
    $("#newton-out").textContent = gamma.toFixed(3)
    const scale = state.p1.endsWith("20") ? 1.2 : 1
    state.live = trainNewton(scale, gamma)
    $("#newton-note").textContent = "Eight-row fit recomputed in the page. The turbine model is unchanged."
    renderP1()
  })
  ;["#t1", "#gamma", "#qsol"].forEach((id) => {
    $(id).addEventListener("input", (event) => {
      const key = id === "#t1" ? "T1" : id === "#gamma" ? "gamma" : "Qsol"
      state[key] = Number(event.target.value)
      renderConsole()
    })
  })
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.preset === "corner") Object.assign(state, { T1: 318, gamma: 0.5, Qsol: 2500 })
      if (button.dataset.preset === "outside") Object.assign(state, { T1: 318, gamma: 0.75, Qsol: 500 })
      renderConsole()
    })
  })
  window.addEventListener("resize", () => {
    renderP1()
    drawSurface()
    drawScatter()
  })
  document.querySelector(".fold").addEventListener("toggle", () => {
    if (document.querySelector(".fold").open) renderP1()
  })
  const preset = new URLSearchParams(location.search).get("point")
  if (preset === "corner") Object.assign(state, { T1: 318, gamma: 0.5, Qsol: 2500 })
  if (preset === "outside") Object.assign(state, { T1: 318, gamma: 0.75, Qsol: 500 })
  renderP1()
  renderConsole()
}

main()
