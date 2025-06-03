import React from "react";
import {
    Breadcrumbs,
    Link,
    Typography,
    Box,
    IconButton,
    Button,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
    SelectColumnsButton,
    useTranslate,
    useRefresh,
} from "react-admin";

const breadcrumbNameMap: Record<string, string> = {
    "/": "Home",
    "/orders": "Orders",
    "/products": "Products",
    "/users": "pages.users",
    "/products/edit": "Edit",
};

interface CustomBreadcrumbsProps {
    onCreate?: () => void;
    onExport?: () => void;
    onRefresh?: () => void;
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ onCreate, onExport }) => {
    const translate = useTranslate();
    const refresh = useRefresh(); // Sử dụng hook refresh
    
    const hashPath = window.location.hash.replace(/^#/, '');
    const pathnames = hashPath.split("/").filter(Boolean);
    const lastPath = `/${pathnames.join("/")}`;
    const pageTitleKey = breadcrumbNameMap[lastPath] || pathnames[pathnames.length - 1];
    const pageTitle = translate(pageTitleKey);

    return (
        <Box sx={{ padding: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" fontWeight="bold">
                        {pageTitle}
                    </Typography>
                    {/* Thay đổi sự kiện onClick sử dụng refresh thay vì reload trang */}
                    <IconButton onClick={refresh} sx={{ marginLeft: 1 }}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <SelectColumnsButton />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={onCreate}
                        sx={{ marginRight: 1, color: "#fff", backgroundColor: "#0052a9" }}
                    >
                        {translate("buttons.add")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={onExport}
                        sx={{ color: "#fff", backgroundColor: "#0052a9" }}
                    >
                        {translate("buttons.export")}
                    </Button>
                </Box>
            </Box>

            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ marginTop: "4px" }}
            >
                <Link color="inherit" href="/" sx={{ display: "flex", alignItems: "center" }}>
                    <HomeIcon />
                </Link>
                {pathnames.map((value, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    const labelKey = breadcrumbNameMap[routeTo];
                    const translatedName = labelKey ? translate(labelKey) : translate(value);
                    return isLast ? (
                        <Typography key={routeTo} color="#000">
                            {translatedName}
                        </Typography>
                    ) : (
                        <Link key={routeTo} color="#000" href={`#${routeTo}`} underline="hover">
                            {translatedName}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </Box>
    );
};

export default CustomBreadcrumbs;