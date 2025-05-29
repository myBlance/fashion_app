import {
    Toolbar,
    IconButton,
    useMediaQuery,
    Theme,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
    HideOnScroll,
    LoadingIndicator,
    LocalesMenuButton,
    SidebarToggleButton,
    TitlePortal,
    ToggleThemeButton,
    UserMenu,
    useThemesContext
} from "react-admin";
import {
    FC,
    ReactNode,
    memo
} from "react";


interface CustomAppBarProps {
    onToggleSidebar?: () => void;
    userMenu?: ReactNode;
    alwaysOn?: boolean;
}

export const CustomAppBar: FC<CustomAppBarProps> = memo(({ onToggleSidebar, userMenu = <UserMenu /> }) => {
    const isXSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
    const { darkTheme } = useThemesContext();

    return (
        <HideOnScroll>
            <Box
                component="header"
                sx={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderBottom: "2px solid #ddd",
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                }}
            >
                <Toolbar
                    disableGutters
                    variant={isXSmall ? "regular" : "dense"}
                    sx={{ px: 2, minHeight: 56 }}
                >
                    {onToggleSidebar ? (
                        <IconButton onClick={onToggleSidebar} sx={{ color: "#000", marginRight: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <SidebarToggleButton />
                    )}

                    <TitlePortal />

                    <Box sx={{ flexGrow: 1 }} />

                    {darkTheme && <ToggleThemeButton />}
                    <LoadingIndicator />
                    <LocalesMenuButton languages={[
                        { locale: 'en', name: 'EN' },
                        { locale: 'vi', name: 'VI' },
                    ]} />

                    {typeof userMenu === "boolean" ? (userMenu ? <UserMenu /> : null) : userMenu}
                </Toolbar>
            </Box>
        </HideOnScroll>
    );
});
