export type IconsName = 'bar-chart' | 'line-chart' | 'pie-chart' | 'table' | '';
export const icons = [
    {
        name: 'bar-chart',
        data: `
                <svg
                width="100%"
                height="100%"
                viewBox="0 0 48 36"
                xmlns="http://www.w3.org/2000/svg"
                fit=""
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
            >
                <path
                    d="M4.25 13.5H8v18H4.25zm9-9H17v27h-3.75zM21.5 18h3.75v13.5H21.5zm9-10.5h3.75v24H30.5zm9 9h3.75v15H39.5z"
                    fill="#4285f4"
                ></path>
            </svg>
        `
    },
    {
        name: 'line-chart',
        data: `
                <svg
            width="100%"
            height="100%"
            viewBox="0 0 48 36"
            xmlns="http://www.w3.org/2000/svg"
            fit=""
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
        >
            <path
                d="M4.75 30.75l5.67-.783 6.407-7.858 6.095 3.688 7.122-9.54 6.3 5.852L43.75 10.75"
                stroke="#4285f4"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="square"
            ></path>
        </svg>
        `
    },
    {
        name: 'pie-chart',
        data: `
                <svg
            viewBox="0 0 48 36"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:bx="https://boxy-svg.com"
        >
            <g
                transform="matrix(0.55975, 0, 0, 0.55975, 12.805008, 6.805007)"
                fill="none"
                fill-rule="evenodd"
                bx:origin="0.52 0.5"
            >
                <circle
                    cx="20"
                    cy="20"
                    r="14.386"
                    transform="matrix(-0.4999999999999998, 0.8660254037844387, -0.8660254037844387, -0.4999999999999998, 47.32050807568877, 12.679491924311222)"
                    stroke="#42f480"
                    mask="url('/u/0/explorer/temp#simple_piechart_default_d')"
                    stroke-width="28.772"
                    stroke-dasharray="30.14202117919922,143.8596598307292"
                    fill-rule="nonzero"
                />
                <g
                    stroke-dasharray="30.14202117919922,143.8596598307292"
                    fill-rule="nonzero"
                    mask="url('/u/0/explorer/temp#simple_piechart_default_f')"
                    stroke="#4285f4"
                    stroke-width="28.772"
                >
                    <circle
                        cx="20"
                        cy="20"
                        r="14.386"
                        transform="matrix(1, 0, 0, 1, 0, 0)"
                        mask="url('/u/0/explorer/temp#simple_piechart_default_g')"
                    />
                </g>
                <g
                    stroke-dasharray="30.14202117919922,143.8596598307292"
                    fill-rule="nonzero"
                    mask="url('/u/0/explorer/temp#simple_piechart_default_f')"
                    transform="rotate(-120 20 20)"
                    stroke="#e6271d"
                    stroke-width="28.772"
                >
                    <circle
                        cx="20"
                        cy="20"
                        r="14.386"
                        transform="matrix(1, 0, 0, 1, 0, 0)"
                        mask="url('/u/0/explorer/temp#simple_piechart_default_h')"
                    />
                </g>
            </g>
        </svg>
        `
    },
    {
        name: 'table',
        data: `
                <svg
            viewBox="0 0 48 36"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:bx="https://boxy-svg.com"
        >
            <g transform="matrix(1, 0, 0, 1, 3, 4)" fill="none">
                <g transform="translate(.233 .242)">
                    <path fill="#dadce0" d="M0 0h40.6v7.25H0z" />
                    <rect fill="#4a4a4a" x="1.867" y="2.758" width="9.333" height="2" />
                    <rect fill="#4a4a4a" x="14" y="2.758" width="12.133" height="2" />
                    <path fill="#dadce0" d="M0 14.5h40.6v1H0zm0 7.975h40.6v1H0z" />
                </g>
                <rect fill="#4a4a4a" x="34.533" y="3" width="4.667" height="2" bx:origin="0.5 0.6335" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="2.1" y="10" width="9.333" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="14.233" y="10" width="12.133" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="34.533" y="10" width="4.667" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="2.1" y="18" width="6.533" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="14.233" y="18" width="15.867" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="34.533" y="18" width="4.667" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="2.1" y="26" width="9.333" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="14.233" y="26" width="12.133" height="2" />
                <rect fill-opacity=".5" fill="#4a4a4a" x="35.467" y="26" width="3.733" height="2" />
            </g>
        </svg>
        `
    }
];
