import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { useDataProvider, useNotify, useRefresh } from 'react-admin';
import { useNavigate } from 'react-router-dom';

interface AdminRowActionsProps {
    record: any;
    resource: string;
    onView?: () => void; // Optional override
    onEdit?: () => void; // Optional override
    onDeleteSuccess?: () => void;
}

const AdminRowActions: React.FC<AdminRowActionsProps> = ({ record, resource, onView, onEdit, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    // Default handlers
    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onView) {
            onView();
        } else {
            // Default view path: /admin/[resource]/[id]/show
            // Note: ProductList uses show?clone=... for some reason, we might need a prop for custom path
            // For now, standard behavior:
            navigate(`/admin/${resource}/${record.id}/show`);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit();
        } else {
            navigate(`/admin/${resource}/${record.id}`);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc muốn xoá mục này?')) {
            dataProvider.delete(resource, { id: record.id })
                .then(() => {
                    notify('Xoá thành công', { type: 'info' });
                    refresh();
                    if (onDeleteSuccess) onDeleteSuccess();
                })
                .catch((error) => {
                    console.error('Delete error:', error);
                    notify('Xoá thất bại: ' + (error?.message || 'Unknown error'), { type: 'warning' });
                });
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 0.1 }}>
            <Tooltip title="Xem">
                <IconButton size="small" color="primary" onClick={handleView}>
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Sửa">
                <IconButton size="small" color="info" onClick={handleEdit}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Xoá">
                <IconButton color="error" size="small" onClick={handleDelete}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default AdminRowActions;
