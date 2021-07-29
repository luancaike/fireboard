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
export const FaCustomIcons: any[] = [
    {
        prefix: 'custom',
        iconName: 'left-join',
        icon: [
            32,
            32,
            [],
            'U+E002',
            `M17.077 7.148A10.285 10.285 0 0 1 21.818 6C27.441 6 32 10.477 32 16s-4.559 10-10.182 10c-2.038 0-3.936-.588-5.528-1.6l.454-.31c.283-.194.555-.4.816-.617a8.842 8.842 0 0 0 4.258 1.083c4.832 0 8.738-3.836 8.738-8.556 0-4.72-3.906-8.556-8.738-8.556a8.865 8.865 0 0 0-3.546.733 10.65 10.65 0 0 0-1.195-1.03zM15.71 24.399A10.268 10.268 0 0 1 10.182 26C4.559 26 0 21.523 0 16S4.559 6 10.182 6c1.712 0 3.325.415 4.74 1.148-2.643 1.957-4.241 5.022-4.241 8.352 0 3.468 1.733 6.649 4.575 8.59l.454.31zM16 8c2.418 1.651 4 4.395 4 7.5 0 3.105-1.582 5.849-4 7.5-2.418-1.651-4-4.395-4-7.5 0-3.105 1.582-5.849 4-7.5z`
        ]
    },
    {
        prefix: 'custom',
        iconName: 'inner-join',
        icon: [
            32,
            32,
            [],
            'U+E002',
            `M14.923 7.148c-.427.315-.826.66-1.195 1.03a8.865 8.865 0 0 0-3.546-.734C5.35 7.444 1.444 11.28 1.444 16c0 4.72 3.906 8.556 8.738 8.556 1.547 0 2.999-.393 4.258-1.083.26.217.533.423.816.616l.454.31A10.268 10.268 0 0 1 10.182 26C4.559 26 0 21.523 0 16S4.559 6 10.182 6c1.712 0 3.325.415 4.74 1.148zm1.879 0c.434.315.84.66 1.217 1.03a9.172 9.172 0 0 1 3.611-.734c4.921 0 8.9 3.836 8.9 8.556 0 4.72-3.979 8.556-8.9 8.556a9.137 9.137 0 0 1-4.337-1.083c-.265.217-.543.423-.83.616L16 24.4A10.6 10.6 0 0 0 21.63 26C27.357 26 32 21.523 32 16S27.357 6 21.63 6c-1.743 0-3.386.415-4.828 1.148zM16 8c2.418 1.651 4 4.395 4 7.5 0 3.105-1.582 5.849-4 7.5-2.418-1.651-4-4.395-4-7.5 0-3.105 1.582-5.849 4-7.5z`
        ]
    },
    {
        prefix: 'custom',
        iconName: 'right-join',
        icon: [
            32,
            32,
            [],
            'U+E002',
            `M17.077 7.148A10.285 10.285 0 0 1 21.818 6C27.441 6 32 10.477 32 16s-4.559 10-10.182 10c-2.038 0-3.936-.588-5.528-1.6l.454-.31c.283-.194.555-.4.816-.617a8.842 8.842 0 0 0 4.258 1.083c4.832 0 8.738-3.836 8.738-8.556 0-4.72-3.906-8.556-8.738-8.556a8.865 8.865 0 0 0-3.546.733 10.65 10.65 0 0 0-1.195-1.03zM15.71 24.399A10.268 10.268 0 0 1 10.182 26C4.559 26 0 21.523 0 16S4.559 6 10.182 6c1.712 0 3.325.415 4.74 1.148-2.643 1.957-4.241 5.022-4.241 8.352 0 3.468 1.733 6.649 4.575 8.59l.454.31zM16 8c2.418 1.651 4 4.395 4 7.5 0 3.105-1.582 5.849-4 7.5-2.418-1.651-4-4.395-4-7.5 0-3.105 1.582-5.849 4-7.5z`
        ]
    }
];
