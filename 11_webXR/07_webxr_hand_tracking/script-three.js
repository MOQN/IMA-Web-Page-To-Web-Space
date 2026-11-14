export function showInstruction(text, code = "") {
  const instruction = document.createElement("div");
  instruction.className = "instruction";
  instruction.textContent = text;

  if (code) {
    const snippet = document.createElement("pre");
    snippet.className = "instruction-code";
    snippet.textContent = code;
    instruction.appendChild(snippet);
  }

  document.body.appendChild(instruction);
  return instruction;
}
