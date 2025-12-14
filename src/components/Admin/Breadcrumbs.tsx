import { Refresh as RefreshIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import CachedIcon from '@mui/icons-material/Cached';
import DownloadIcon from "@mui/icons-material/Download";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
    Box,
    BoxProps,
    Breadcrumbs,
    Button,
    IconButton,
    Link,
    Typography,
} from "@mui/material";
import React from "react";
import { SelectColumnsButton, useRecordContext, useRefresh, useTranslate } from "react-admin";
import { Link as RouterLink, useLocation } from "react-router-dom";

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
    "/vouchers": "Vouchers",
    "/vouchers/create": "Create",
    "/vouchers/edit": "Edit",
    "/reviews": "Reviews",
    "/reviews/create": "Create",
    "/reviews/edit": "Edit",
    "/reviews/show": "Show",
    "/order-history": "Order History",
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
    const lastSegment = pathnames[pathnames.length - 1];
    const labelKey = breadcrumbNameMap[lastPath];
    const commonLabels: Record<string, string> = { show: "Show", edit: "Edit", create: "Create" };

    // Try to resolve name from record context for Page Title
    const record = useRecordContext();
    let pageTitle = labelKey ? translate(labelKey) : (commonLabels[lastSegment] || lastSegment);

    if (record && record.id && String(record.id) === lastSegment) {
        pageTitle = record.username || record.name || record.title || record.code || lastSegment;
    }

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
                            sx={{
                                marginRight: 1, marginLeft: 1, backgroundColor: "#1c79dc", color: "#fff",
                                borderRadius: "8px",
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
                            sx={{ marginRight: 1, color: "#fff", backgroundColor: "#1c79dc", borderRadius: "8px", }}
                        >
                            Thêm mới
                        </Button>
                    )}
                    {onExport && (
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={onExport}
                            sx={{ color: "#fff", backgroundColor: "#1c79dc", borderRadius: "8px", }}
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
                    const commonLabels: Record<string, string> = { show: "Show", edit: "Edit", create: "Create" };
                    let translatedName = labelKey ? translate(labelKey) : (commonLabels[value] || value);

                    if (record && record.id && String(record.id) === value) {
                        translatedName = record.username || record.name || record.title || record.code || value;
                    }

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