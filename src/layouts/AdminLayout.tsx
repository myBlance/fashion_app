import type { ReactNode } from "react";
import { Layout as RALayout, CheckForApplicationUpdate } from "react-admin";
import MyMenu from "../components/Admin/MyMenu";
import EmptyAppBar from "../components/Admin/EmptyAppBar";
import { Box } from "@mui/material";

export const AdminLayout = ({ children }: { children: ReactNode }) => (
    <RALayout
        appBar={EmptyAppBar}
        menu={MyMenu}
        
        sx={{
        // Layout chính
            backgroundColor: '#000',
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            "& .RaLayout-contentWithSidebar":{
                backgroundColor:'#000'
            },

            "& .RaLayout-content": {
                flexGrow: 1,
                overflow: "hidden",
                backgroundColor: "#000",
                marginTop: "-64px", // Tùy theo chiều cao AppBar
            },
        }}
    >
        <Box
            sx={{
                width: "100%",
                height: "100%",
                p: 2,
                boxSizing: "border-box",
                backgroundColor: "#000",
            }}
        >
            {children && <Box sx={{ width: "auto" }}>{children}</Box>}
            <CheckForApplicationUpdate />
        </Box>
    </RALayout>
);
