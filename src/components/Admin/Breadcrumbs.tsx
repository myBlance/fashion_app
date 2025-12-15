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
    "/": "resources.dashboard.name",
    "/orders": "resources.orders.name",
    "/products": "resources.products.name",
    "/products/create": "ra.action.create",
    "/products/edit": "ra.action.edit",
    "/users": "resources.users.name",
    "/vouchers": "resources.vouchers.name",
    "/vouchers/create": "ra.action.create",
    "/vouchers/edit": "ra.action.edit",
    "/reviews": "resources.reviews.name",
    "/reviews/create": "ra.action.create",
    "/reviews/edit": "ra.action.edit",
    "/reviews/show": "ra.action.show",
    "/order-history": "Lịch sử đơn hàng", // Custom route, hardcoded or needs its own key
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

    // Check if we have a direct map for the full path
    const directMapKey = breadcrumbNameMap[lastPath];

    // Helper to translate common actions if not in map
    const commonLabels: Record<string, string> = {
        show: "ra.action.show",
        edit: "ra.action.edit",
        create: "ra.action.create"
    };

    // Try to resolve name from record context for Page Title
    const record = useRecordContext();
    let pageTitleKeys = directMapKey || commonLabels[lastSegment] || lastSegment;

    // Try to translate it.
    let pageTitle = translate(pageTitleKeys, { smart_count: 2, _: pageTitleKeys });

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
                    let translatedName = labelKey ? translate(labelKey, { smart_count: 2 }) : (commonLabels[value] || value);

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