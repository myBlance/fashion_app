import MenuIcon from "@mui/icons-material/Menu";
import {
    IconButton,
    Theme,
    Toolbar,
    useMediaQuery
} from "@mui/material";
import {
    FC,
    ReactNode,
    memo
} from "react";
import {
    HideOnScroll,
    LoadingIndicator,
    LocalesMenuButton,
    SidebarToggleButton,
    ToggleThemeButton,
    useThemesContext
} from "react-admin";
import '../../styles/CustomAppBar.css';


interface CustomAppBarProps {
    onToggleSidebar?: () => void;
    userMenu?: ReactNode;
    alwaysOn?: boolean;
}

export const CustomAppBar: FC<CustomAppBarProps> = memo(({ onToggleSidebar, }) => {
    const isXSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
    const { darkTheme } = useThemesContext();

    return (
        <HideOnScroll >
            <Toolbar disableGutters variant={isXSmall ? "regular" : "dense"} className="custom-app-bar-toolbar">
                {onToggleSidebar ? (
                    <IconButton onClick={onToggleSidebar} className="custom-app-bar-icon-btn">
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <SidebarToggleButton />
                )}

                {/* Tiêu đề */}
                {/* <TitlePortal /> */}

                {/* Các chức năng bổ sung */}
                <div className="custom-app-bar-spacer"></div>

                {darkTheme && <ToggleThemeButton />}
                <LoadingIndicator />
                <LocalesMenuButton languages={[
                    { locale: 'en', name: 'EN' },
                    { locale: 'vi', name: 'VI ' },
                ]} />


            </Toolbar>
        </HideOnScroll>
    );
});


