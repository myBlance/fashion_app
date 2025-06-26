import React from "react";
import {
    Breadcrumbs,
    Link,
    Typography,
    Box,
    IconButton,
    Button,
    BoxProps,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { SelectColumnsButton, useRefresh, useTranslate } from "react-admin";
import CachedIcon from '@mui/icons-material/Cached';
import { useLocation, Link as RouterLink } from "react-router-dom";

interface CustomBreadcrumbsProps {
    onCreate?: () => void;
    onExport?: () => void;
    onRefresh?: () => void;
    containerProps?: BoxProps;
}


const breadcrumbNameMap: Record<string, string> = {
    "/": "Home",
    "/orders": "Orders",
    "/products": "Products",
    "/products/create": "Create",
    "/products/edit": "Edit",
    "/users": "Users",
};

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ onCreate, onExport, onRefresh }) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const location = useLocation();

    const fullPath = `${location.pathname}${location.hash.replace("#", "")}`;
    const pathWithoutAdmin = fullPath.replace(/^\/admin/, "");
    const pathnames = pathWithoutAdmin.split("/").filter(Boolean);

    const buildFullPath = (index: number) => `/${pathnames.slice(0, index + 1).join("/")}`;

    const lastPath = buildFullPath(pathnames.length - 1);
    const pageTitleKey = breadcrumbNameMap[lastPath] || pathnames[pathnames.length - 1];
    const pageTitle = translate(pageTitleKey);

    return (
        <Box sx={{ padding: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" fontWeight="bold">
                        {pageTitle}
                    </Typography>
                    <IconButton onClick={refresh} sx={{ marginLeft: 1 }}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <SelectColumnsButton />
                    {onRefresh && (
                        <Button
                            variant="contained"
                            startIcon={<CachedIcon />}
                            onClick={onRefresh}
                            sx={{ marginRight: 1, marginLeft: 1, backgroundColor: "#1c79dc", color: "#fff" 

                            }}
                        >
                            Đồng bộ
                        </Button>
                    )}
                    {onCreate && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onCreate}
                            sx={{ marginRight: 1, color: "#fff", backgroundColor: "#1c79dc" }}
                        >
                            Thêm mới
                        </Button>
                    )}
                    {onExport && (
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={onExport}
                            sx={{ color: "#fff", backgroundColor: "#1c79dc" }}
                        >
                            Xuất
                        </Button>
                    )}
                </Box>
            </Box>

            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ marginTop: "4px" }}
            >
                <Link color="inherit" href="/admin/" sx={{ display: "flex", alignItems: "center" }}>
                    <HomeIcon />
                </Link>
                {pathnames.map((value, index) => {
                    const routeTo = buildFullPath(index);
                    const isLast = index === pathnames.length - 1;
                    const labelKey = breadcrumbNameMap[routeTo];
                    const translatedName = labelKey ? translate(labelKey) : value;

                    return isLast ? (
                        <Typography key={routeTo} color="text.primary">
                            {translatedName}
                        </Typography>
                    ) : (
                        <Link
                            key={routeTo}
                            color="text.primary"
                            underline="hover"
                            component={RouterLink}
                            to={`/admin${routeTo}`}
                        >
                            {translatedName}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        </Box>
    );
};
export default CustomBreadcrumbs;