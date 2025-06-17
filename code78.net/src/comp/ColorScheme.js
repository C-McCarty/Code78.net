import {ThemeProvider, createGlobalStyle} from "styled-components";
import theme from "../data/theme.json";

export default function ColorScheme({children}) {

    const RootStyle = createGlobalStyle`
        :root {
            --bkg: ${({theme}) => theme.bkg};
            --color1: ${({theme}) => theme.color1};
            --color2: ${({theme}) => theme.color2};
            --color3: ${({theme}) => theme.color3};
            --nodeEmpty: ${({theme}) => theme.nodeEmpty};
            --nodeFilled: ${({theme}) => theme.nodeFilled};
            --terminal-bkg: ${({theme}) => theme.terminalBkg};
            --terminal-screen: ${({theme}) => theme.terminalScreen};
        }
    `;

    return (
        <ThemeProvider theme={theme}>
            <RootStyle />
            {children}
        </ThemeProvider>
    );
}