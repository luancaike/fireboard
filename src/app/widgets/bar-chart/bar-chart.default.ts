import { ChartOptions } from 'chart.js';

export const defaultOptions: ChartOptions = {
    plugins: {
        datalabels: {
            offset: -5,
            color: '#66686b',
            clamp: true,
            display: 'auto',
            anchor: 'end',
            align: 'end',
            clip: false,
            font: {
                size: 14
            }
        }
    },
    layout: {
        padding: 30
    },
    title: {
        fontColor: '#66686b',
        fontSize: 12,
        display: false,
        text: 'Titulo',
        position: 'top'
    },
    legend: {
        fullWidth: true,
        display: true,
        position: 'bottom',
        align: 'center'
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        yAxes: [
            {
                gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: '#ddd'
                },
                ticks: {
                    display: true,
                    fontSize: 12,
                    fontColor: '#66686b',
                    maxTicksLimit: 5,
                    beginAtZero: true
                }
            }
        ],
        xAxes: [
            {
                ticks: {
                    display: true,
                    fontSize: 12,
                    fontColor: '#66686b'
                },
                gridLines: {
                    display: false,
                    lineWidth: 1,
                    color: '#ddd'
                }
            }
        ]
    }
};
