"use client";

import { CssBaseline, createTheme, darken } from "@mui/material"
import { ThemeProvider } from "@emotion/react"
import { Mukta,Lilita_One,Monomaniac_One } from "next/font/google";

const calculateHoverColor = (baseColor) => darken(baseColor, 0.1); 

const mukta = Mukta({
    // weight: ["300", "400", "500", "700"],
    weight: ["400"],
    style: ["normal"],
    subsets: ["latin"],
});

export const lilita = Lilita_One({
    weight: ["400"],
    subsets: ["latin"],
    // display: 'swap',
    variable: '--lilita-font'
})


const custom_color_light = {
    primary1: {
        main: '#337ab7',
        contrastText: '#FFFFFF'
    },
    primary2: {
        main: '#5bc0de',
        contrastText: '#FFFFFF'
    },
    primary3: {
        main: '#5cb85c',
        contrastText: '#FFFFFF'
    },
    primary4: {
        main: '#f0ad4e',
        contrastText: '#FFFFFF'
    },
    primary5: {
        main: '#d9534f',
        contrastText: '#FFFFFF'
    },
    primary6: {
        main: '#7b5df1',
        contrastText: '#FFFFFF'
    },
}

const light_theme = {
    primary: {
        main: '#337ab7',
        contrastText: '#FFFFFF'
    },
    ...custom_color_light,
    background: {
        default: "#f7f7f7",
        paper: '#E1DFDF',
    },
    text: {
        primary: '#000000'
    },
}


const Themeregistry = ({ children }) => {
    const theme = createTheme({
        components: {
            MuiCard: {
                defaultProps: {
                    elevation: 3,
                },
                // styleOverrides:{
                //     root:{
                //         backgroundImage: 'unset'
                //     }
                // }
            },
            MuiButton: {
                variants: Object.keys(custom_color_light).map(c => {
                    return {
                        props: { color: c },
                        style: {
                            '&:hover': {
                                backgroundColor: calculateHoverColor(custom_color_light[c].main)
                            },
                        }
                    }
                }),
            },
            MuiAutocomplete: {
                styleOverrides: {
                  popper: {
                    zIndex: 1300,
                  },
                },
              },
        },
        typography: {
            fontSize: 14,
            fontFamily: mukta.style.fontFamily,
            h1: 'var(--h1-size)'
        },
        palette: {
            ...light_theme,
        },
    })
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default Themeregistry