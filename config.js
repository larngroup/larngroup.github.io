const config1 = {
    type: 'scatter',
    data: {
        datasets: [
            {
            borderColor: 'red',
            fill: false,
            stepped: true,
            showLine: false,
            pointBackgroundColor: 'red',
            pointHoverRadius: 5
            }
        ]
    },
    options: {
        interaction: {
            mode: 'point'
        },
        layout: {
            padding: {
                right: 0,
                left: 0,
                top: 0,
                bottom: 0
            }
        },
        plugins: {
            display: true,
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler,
                title: "lol"
            },
            legend: {
                display: false,
                labels:{
                    text: "teste"
                }
            },
            position:'top'
        },
        scales: {
            x: {
                title: {
                    display: true
                }
            },
            y: {
                title: {
                    display: true
                }
            }
        }
    }
};