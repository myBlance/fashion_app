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

interface CustomBreadcrumbsProps {
    onCreate?: () => void;
    onExport?: () => void;
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

import { useLocation } from "react-router-dom";

// ...

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ onCreate, onExport }) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const location = useLocation();

    const pathname = location.pathname; // /admin/products/create
    const pathWithoutAdmin = pathname.replace(/^\/admin/, "");
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
                    {onCreate && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={onCreate}
                            sx={{ marginRight: 1, color: "#fff", backgroundColor: "#0052a9" }}
                        >
                            Add
                        </Button>
                    )}
                    {onExport && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={onExport}
                            sx={{ color: "#fff", backgroundColor: "#0052a9" }}
                        >
                            Export
                        </Button>
                    )}
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
                    const routeTo = buildFullPath(index);
                    const isLast = index === pathnames.length - 1;
                    const labelKey = breadcrumbNameMap[routeTo];
                    const translatedName = labelKey ? translate(labelKey) : value;

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