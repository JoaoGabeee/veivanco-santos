document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.btn-cta').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const title = btn.closest('.card-body').querySelector('.card-title').textContent.trim();
      if (title.includes('Imposto de Renda')) {
        abrirModalCalculadoraIR();
      } else {
        abrirModalEmBreve(title);
      }
    });
  });
});

function abrirModalCalculadoraIR() {
  fecharModalCalculadora();
  const modal = document.createElement('div');
  modal.className = 'calc-modal-bg';
  modal.innerHTML = `
      <div class="calc-modal card shadow-lg calc-modal-anim" id="modal-calc-ir">
        <div class="card-body">
          <button class="btn-close float-end" aria-label="Fechar" id="fechar-calc-modal"></button>
          <h4 class="mb-3">Calculadora de Imposto de Renda 2025</h4>
          <div class="d-flex flex-column flex-md-row gap-3 align-items-stretch">
            <form id="form-ir" class="flex-fill" style="min-width:220px;max-width:260px;">
              <div class="mb-3">
                <label for="rendaAnual" class="form-label">Renda anual (R$)</label>
                <input type="number" class="form-control" id="rendaAnual" min="0" step="0.01" required>
              </div>

              <div class="mb-3">
                <label for="dependentes" class="form-label">Número de dependentes</label>
                <input type="number" class="form-control" id="dependentes" min="0" value="0" required>
              </div>

              <button type="submit" class="btn btn-cta w-100">Calcular</button>
            </form>
            
            <div id="resultado-ir" class="flex-fill border-start ps-3 mt-3 mt-md-0" style="min-width:220px;max-width:320px;"></div>
          </div>
        </div>
      </div>
    `;
  document.body.appendChild(modal);
  document.getElementById('fechar-calc-modal').onclick = fecharModalCalculadora;

  document.getElementById('form-ir').onsubmit = function (e) {
    e.preventDefault();
    const renda = parseFloat(document.getElementById('rendaAnual').value);
    const dependentes = parseInt(document.getElementById('dependentes').value);

    const completo = calcularImpostoRenda(renda, dependentes, false);
    const simplificado = calcularImpostoRenda(renda, 0, true);

    const melhor = completo.valor < simplificado.valor ? "Completo (com dependentes)" : "Simplificado (20%)";
    const diferenca = Math.abs(completo.valor - simplificado.valor);

    document.getElementById('resultado-ir').innerHTML = `
  <div class="alert alert-success text-center mb-2" id="bloco-vantajoso">
    <h6 class="fw-bold mb-2">Mais vantajoso</h6>
    <p class="mb-1"><strong>${melhor}</strong></p>
    <p class="mb-1">Imposto: <strong>R$ ${completo.valor < simplificado.valor ? completo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : simplificado.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
    <p class="mb-2">Diferença: <strong>R$ ${diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
    <button class="btn btn-outline-secondary btn-sm" id="btn-ver-detalhes-ir">Ver detalhes</button>
  </div>

  <div id="detalhes-ir" style="display:none;">
    <div class="d-flex flex-column flex-md-row gap-3 align-items-start">
      <div id="coluna-direita" class="flex-fill d-flex flex-column gap-3" style="min-width:240px">
        <div class="alert alert-info flex-fill">
          <h6 class="fw-bold">Completo</h6>
          <p class="mb-1">Base: <strong>R$ ${completo.base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
          <p class="mb-1">Faixa: ${completo.faixa}</p>
          <p class="mb-1">Imposto: <strong>R$ ${completo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
          <p class="mb-0">Alíquota efetiva: ${completo.aliquotaEfetiva.toFixed(2)}%</p>
        </div>
        <div class="alert alert-info flex-fill">
          <h6 class="fw-bold">Simplificado (20%)</h6>
          <p class="mb-1">Base: <strong>R$ ${simplificado.base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
          <p class="mb-1">Faixa: ${simplificado.faixa}</p>
          <p class="mb-1">Imposto: <strong>R$ ${simplificado.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
          <p class="mb-0">Alíquota efetiva: ${simplificado.aliquotaEfetiva.toFixed(2)}%</p>
        </div>
      </div>
    </div>
    <button class="btn btn-outline-secondary btn-sm mt-2" id="btn-esconder-detalhes-ir">Ocultar detalhes</button>
  </div>
`;

    const modalBox = document.getElementById('modal-calc-ir');
    const blocoVantajoso = document.getElementById('bloco-vantajoso');
    const formIR = document.getElementById('form-ir');
    const resultadoIR = document.getElementById('resultado-ir');

    document.getElementById('btn-ver-detalhes-ir').onclick = function () {

      document.getElementById('detalhes-ir').style.display = '';

      formIR.insertAdjacentElement('afterend', blocoVantajoso);
      blocoVantajoso.classList.add('mt-3');

      this.style.display = 'none';
      if (modalBox) modalBox.classList.add('calc-modal-expand');
    };

    document.getElementById('btn-esconder-detalhes-ir').onclick = function () {

      document.getElementById('detalhes-ir').style.display = 'none';

      resultadoIR.prepend(blocoVantajoso);

      document.getElementById('btn-ver-detalhes-ir').style.display = '';
      if (modalBox) modalBox.classList.remove('calc-modal-expand');
    };

    if (!document.getElementById('calc-modal-style')) {
      const style = document.createElement('style');
      style.id = 'calc-modal-style';
      style.innerHTML = `
    .calc-modal-anim {
      transition: max-width 0.35s cubic-bezier(.4,1.3,.5,1), width 0.35s cubic-bezier(.4,1.3,.5,1);
      max-width: 520px;
      min-width: 320px;
    }
    .calc-modal-expand {
      max-width: 745px !important;
    }
    @media (max-width: 600px) {
      .calc-modal-anim, .calc-modal-expand { max-width: 98vw !important; }
    }

      #detalhes-ir {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  #coluna-direita {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    #detalhes-ir {
      flex-direction: column;
    }
  }
  `;
      document.head.appendChild(style);
    }
  };
}

function calcularImpostoRenda(renda, dependentes = 0, simplificado = false) {
  const DEDUCAO_DEPENDENTE = 2275.08; 
  const DESCONTO_SIMP_20 = 0.20; 
  const LIMITE_DESCONTO_SIMP = 16754.34; 
 
  const faixas = [
    { limite: 28467.20, aliquota: 0.00, deducao: 0.00, label: "Isento" },
    { limite: 33919.80, aliquota: 0.075, deducao: 2135.04, label: "7,5%" },
    { limite: 45012.60, aliquota: 0.15, deducao: 4679.03, label: "15%" },
    { limite: 55976.16, aliquota: 0.225, deducao: 8054.97, label: "22,5%" },
    { limite: Infinity, aliquota: 0.275, deducao: 10853.78, label: "27,5%" }
  ];

  let base = renda;
  if (simplificado) {
    const desconto = Math.min(renda * DESCONTO_SIMP_20, LIMITE_DESCONTO_SIMP);
    base -= desconto;
  } else if (dependentes > 0) {
    base -= dependentes * DEDUCAO_DEPENDENTE;
  }
  if (base < 0) base = 0;

  const faixa = faixas.find(f => base <= f.limite);
  const impostoBruto = base * faixa.aliquota - faixa.deducao;
  const impostoFinal = impostoBruto > 0 ? impostoBruto : 0;
  const aliquotaEfetiva = renda > 0 ? (impostoFinal / renda) * 100 : 0;

  return {
    valor: impostoFinal,
    faixa: faixa.label,
    base,
    aliquotaEfetiva
  };
}

function abrirModalEmBreve(title) {
  fecharModalCalculadora();
  const modal = document.createElement('div');
  modal.className = 'calc-modal-bg';
  modal.innerHTML = `
      <div class="calc-modal card shadow-lg">
        <div class="card-body text-center">
          <button class="btn-close float-end" aria-label="Fechar" id="fechar-calc-modal"></button>
          <h4 class="mb-3">${title}</h4>
          <p class="lead">Esta calculadora estará disponível em breve!</p>
        </div>
      </div>
    `;
  document.body.appendChild(modal);
  document.getElementById('fechar-calc-modal').onclick = fecharModalCalculadora;
}

function fecharModalCalculadora() {
  document.querySelectorAll('.calc-modal-bg').forEach(e => e.remove());
}
