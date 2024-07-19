"use client"

import { useEffect, useMemo, useState } from 'react';
import { CustomComponents } from '@/ui-component';
import { Box, Button, Card, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { AddCircleRounded } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setFormDialogOpen } from '@/lib/store/features/dialog/formDialogSlice';
import { getBlogPostsAction, deleteBlogPostAction } from '@/lib/store/thunks/blogPostAction';
import AddPost from '../add/addPost';


export default function PostsList() {
    const dispatch = useAppDispatch();
    const stateBlogPosts = useAppSelector((state)=> state.blogPost.blogPosts);

    const CustomFormDialog = CustomComponents.CustomFormDialog;
    const Breadcrumb = CustomComponents.Breadcrumb;
    const ListPageCard = CustomComponents.ListPageCard;
    const StatusChip = CustomComponents.StatusChip;
    const DataGridActions = CustomComponents.DataGridActions;

    const [recordForEdit, setRecordForEdit] = useState(null);

    useEffect(() => {
        if (stateBlogPosts.length > 0){
            return;
        }
        dispatch(getBlogPostsAction());
    }, []);

    // delete
    const deleteRecord = (id: string) => {
        dispatch(deleteBlogPostAction(id));
    }

    const columns: GridColDef<(typeof stateBlogPosts)[number]>[]= useMemo(
        () => [
            {
                field: 'title',
                headerName: 'Post Title',
                width: 400,
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 400,
                sortable: false
            },
            {
                field: 'is_active',
                headerName: 'Status',
                width: 150,
                renderCell: (params: any) => {
                    return (
                        <StatusChip params={params}/>
                    )
                }
            },
            {
                field: 'actions',
                headerName: 'Actions',
                type: 'actions',
                sortable: false,
                width: 150,
                renderCell: (params: any) => {
                    return (
                        <Box>
                             <DataGridActions
                                params={params}
                                setRecordForEdit={setRecordForEdit}
                                deleteFunction={deleteRecord}
                                dialogTitle= "Update Post"
                            />
                        </Box>
                    )
                }
            },
        ],
        []
    )

    return (
        <>
            <ListPageCard>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        variant="contained"
                        endIcon={< AddCircleRounded />}
                        onClick={() => {
                            dispatch(setFormDialogOpen({ isOpen: true, dialogTitle: "Add Post"}));
                            setRecordForEdit(null);
                        }}
                        sx={{ borderRadius: '10px' }}>
                        Add
                    </Button>
                </Box>

                <Box style={{ height: 400, width: '100%' }}>
                    {
                        stateBlogPosts.length > 0 &&
                        <DataGrid
                            autoHeight
                            columns={columns}
                            rows={stateBlogPosts}
                            slots={{ toolbar: GridToolbar }}
                            getRowId={(row) => row._id}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 500 },
                                },
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5, 10, 20]}
                            disableRowSelectionOnClick />
                    }
                </Box>
            </ListPageCard>

            <CustomFormDialog
                size='sm'
                isFullWidth={true}>
                <AddPost
                recordForEdit={recordForEdit}/>
            </CustomFormDialog>
        </>
    )
}