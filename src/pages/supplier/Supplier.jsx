import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, IconButton } from '@mui/material';
import { Trash2, Pencil } from 'lucide-react';
import { fetchSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../../services/supplierService';

import AddSupplierModal from './AddSupplierModal';
import EditSupplierModal from './EditSupplierModal';
export default function Supplier() {

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);


  useEffect(() => {
    return () => fetchAllSupplier();

  }, []);

  const fetchAllSupplier = async () => {
    try {
      const response = await fetchSuppliers();
      setSuppliers(response);
      console.log('Suppliers:', response);


    } catch (error) {
      console.log('Error fectching supplier', error);
    }
  };

  const columns = [

    { field: 'SupplierID', headerName: 'SupplierID', flex: 1 },
    { field: 'SupplierName', headerName: 'SupplierName', flex: 2 },
    { field: 'ContactName', headerName: 'ContactName', flex: 2 },
    { field: 'Address', headerName: 'Address', flex: 2 },
    { field: 'City', headerName: 'City', flex: 2 },
    { field: 'PostalCode', headerName: 'PostalCode', flex: 2 },
    { field: 'Country', headerName: 'Country', flex: 2 },
    { field: 'Phone', headerName: 'Phone', flex: 2 },
    {
      field: 'Mnage',
      headerName: 'Manage',
      width: 200,
      renderCell: (params) => (
        <div className="space-x-2">
          <IconButton
            onClick={() => handleEditOpen(params.row)}
            color='primary'
            size='large'
          >

            <Pencil size={20} />
          </IconButton>

          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color='error'
            size='large'
          >
            <Trash2 size={20} />
          </IconButton>

        </div>
      )
    }

  ];

  const rows = suppliers.map((supplier) => ({
    id: supplier.SupplierID,
    SupplierID: supplier.SupplierID,
    SupplierName: supplier.SupplierName,
    ContactName: supplier.ContactName,
    Address: supplier.Address,
    City: supplier.City,
    PostalCode: supplier.PostalCode,
    Country: supplier.Country,
    Phone: supplier.Phone,
  }));

  const handleAddOpen = () => {
    setOpenAddModal(true)
    console.log(openAddModal);
  }

  const handleAddClose = () => {
    setOpenAddModal(false)
    console.log(openAddModal);
  }

  const handleInsert = async (supplierData, reset) => {
    const response = await addSupplier(supplierData);
    if (response.status === 200) {
      alert('Added supplier successfully')
      handleAddClose();
      await fetchAllSupplier();
      reset();
    }
  }

  const handleEditOpen = (supplierData) => {
    setSelectedSupplier(supplierData)
    setOpenEditModal(true)

  }

  const handleEditClose = () => {
    setOpenEditModal(false);
  }

  const handleEdit = async (supplierData) => {

    let response = await updateSupplier(supplierData, supplierData.SupplierID);

    if (response.status === 200) {
      alert('แก้ไขสำเร็จ')
      handleEditClose();
      await fetchAllSupplier();
    }
  }

  const handleDelete = async (id) => {
    try {
      let confirmDelete = confirm('ยืนยันการลบ');
      if (confirmDelete) {
        await deleteSupplier(id);
        await fetchAllSupplier();
      }
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div>
      <h1>Supplier List</h1>
      <Button
        variant="contained"
        sx={{ marginBottom: 1 }}
        color="success"
        onClick={handleAddOpen}
      >
        Add Supplier +
      </Button>

      <AddSupplierModal
        open={openAddModal}
        handleClose={handleAddClose}
        onSubmit={handleInsert}
      />

      <EditSupplierModal
        open={openEditModal}
        handleClose={handleEditClose}
        supplier={selectedSupplier}
        onUpdate={handleEdit}
      />




      <Paper style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Paper>
    </div>
  )
}
