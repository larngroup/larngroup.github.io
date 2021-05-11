//const dados = getData();
const alt = window.innerHeight;
const larg = window.innerWidth;
//console.log(graficos.length);

//dim = Math.min(alt, larg)

document.body.style.overflowY = 'scroll';
document.body.style.overflowX = 'scroll'; //talvez não seja a melhor maneira mas resolveu o reposicionamento
for(let i = 0; i < graficos.length; i++) {
    plotData("plot1", graficos[i].x, graficos[i].y, graficos[i].config, larg , alt-10);
}
