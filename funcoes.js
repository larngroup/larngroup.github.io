const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
  
      const table = document.createElement('table');
      table.style.margin = '0px';
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
};

const externalTooltipHandler = (context) => {
    //console.log("tooltip");
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }
    let max_img_width = 0;
    // Set Text
    if (tooltip.body) {
        const bodyLines = tooltip.body.map(b => b.lines);
        //console.log(tooltip);

        const tableHead = document.createElement('thead');
        
        const tableBody = document.createElement('tbody');
        bodyLines.forEach((body, i) => {
            const colors = tooltip.labelColors[i];
            const smile_label = tooltip.dataPoints[0].raw.smiles;
            const ihead = document.createElement('ihead');
            const smile_text = document.createTextNode(smile_label);
            ihead.appendChild(smile_text);
            const imagem = document.createElement('IMG');
            //console.log(tooltip.dataPoints[0].raw.id);
            imagem.src = "molecules/" + String(tooltip.dataPoints[0].raw.id) + ".png";
            imagem.onload = function() {
                max_img_width = Math.max(max_img_width, this.width);
                //console.log(width);

            }
            console.log(max_img_width);
            
            //console.log(max_img_width);
            tableBody.appendChild(ihead);
            tableBody.appendChild(imagem);
        });
  
        const tableRoot = tooltipEl.querySelector('table');
  
        // Remove old children
        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }
  
        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    //tooltipEl.style.right = positionX + tooltip.caretX + 'px';
    
    console.log(tooltipEl.querySelector('img').width);
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

async function getData() {
    const response = await fetch("molecules.csv");
    //console.log(response);
    const data = await response.text();
    //console.log(data);
    const rows = data.split('\n');
    let dados = {
        "id": [],
        "smiles": [],
        "pic50": [],
        "bbb": [],
        "mw": [],
        "logp": [],
        "sas": [],
        "qed": []
    }
    const startLine = 6;
    for(let i = startLine; i < rows.length - 1; i++) {
        const row = rows[i].split(',');
        dados.id.push(i - startLine + 1);
        dados.smiles.push(row[0]);
        dados.pic50.push(row[1]);
        dados.bbb.push(row[2]);
        dados.mw.push(row[3]);
        dados.logp.push(row[4]);
        dados.sas.push(row[5]);
        dados.qed.push(row[6]);
    }
    //console.log(dados);
    return dados;
}

async function plotData(id, xAxis, yAxis, config, larg, alt) {
    const dados = await getData();
    //console.log(dados[xAxis], dados[yAxis]);
    let eixos = [];
    for(let i = 0; i < dados.smiles.length; i++) {
        eixos.push({
        x: dados[xAxis][i],
        y: dados[yAxis][i],
        id: dados.id[i],
        smiles: dados.smiles[i]
        });
    }
    //console.log(config);
    let config_local = JSON.parse(JSON.stringify(config)); //perguntar se é assim q se faz deepcopy
    config_local.data.datasets[0].data = eixos;
    config_local.options.scales.x.title.text = xAxis
    config_local.options.scales.y.title.text = yAxis
    config_local.options.plugins.tooltip.external = externalTooltipHandler; //quando uso o stringify + parse em cima perde esta propriedade n sei pq
    //console.log(config_local);
    //let canvas = document.createElement("CANVAS");
    //canvas.id = id;
    //canvas.width = larg;
    //canvas.height = alt;
    //document.getElementById('div1').appendChild(canvas);
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext("2d");
    const plot = new Chart(ctx, config_local);
}


