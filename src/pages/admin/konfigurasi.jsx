import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import { Alert, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const initConfigData = {
  longitudeStore: "Loading...",
  latitudeStore: "Loading...",
  costPerKm: "Loading...",
  phoneStore: "Loading...",
};

const StoreConfigPage = () => {
  const [data, setData] = useState(initConfigData);
  const [originalData, setOriginalData] = useState(initConfigData);

  // HANDLING NOTIFICATION
  const [successNotify, setSuccessNotify] = useState(null);
  const [errorNotify, setErrorNotify] = useState(null);

  useEffect(() => {
    if (successNotify || errorNotify) {
      setTimeout(() => {
        setSuccessNotify(null);
        setErrorNotify(null);
      }, 3000);
    }
  }, [successNotify, errorNotify]);

  // FETCH CONFIGURATION DATA
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(`/configuration`);
      setData(data.data); // Assuming the response structure includes the `data` field
      setOriginalData(data.data); // Save original data for comparison
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE SAVE
  const handleSave = async () => {
    try {
      await axiosInstance.put(`/configuration`, {
        longitudeStore: data.longitudeStore,
        latitudeStore: data.latitudeStore,
        costPerKm: parseFloat(data.costPerKm), // Ensure the cost is a decimal
        phoneStore: data.phoneStore,
      });
      setSuccessNotify("Konfigurasi berhasil disimpan.");
      setOriginalData(data); // Update original data to match the saved state
    } catch (error) {
      setErrorNotify(error?.response?.data?.message || "Gagal menyimpan konfigurasi.");
    } finally {
      fetchData(); // Refresh data after saving
    }
  };

  // Check if there are any changes
  const isDataChanged = JSON.stringify(data) !== JSON.stringify(originalData);

  return (
    <LayoutAdmin title={"Konfigurasi Toko"}>
      <div className="w-full flex flex-col justify-center gap-4">
        <div className="bg-white w-full rounded-lg overflow-auto shadow p-4">
          <TableContainer component={Paper} className="mt-4">
            <Table aria-label="configuration table">
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold">Longitude Toko</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={data?.longitudeStore}
                      onChange={(e) => setData({ ...data, longitudeStore: e.target.value })}
                      className="w-full"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Latitude Toko</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={data?.latitudeStore}
                      onChange={(e) => setData({ ...data, latitudeStore: e.target.value })}
                      className="w-full"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Biaya per KM</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={data?.costPerKm}
                      onChange={(e) => setData({ ...data, costPerKm: e.target.value })}
                      className="w-full"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Nomor Telepon Toko</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={data?.phoneStore}
                      onChange={(e) => setData({ ...data, phoneStore: e.target.value })}
                      className="w-full"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {successNotify && (
            <Alert severity="info" className="mt-2" onClose={() => setSuccessNotify(null)}>
              {successNotify}
            </Alert>
          )}
          {errorNotify && (
            <Alert severity="error" className="mt-2" onClose={() => setErrorNotify(null)}>
              {errorNotify}
            </Alert>
          )}
          <Button
            variant="contained"
            className="w-fit mt-4"
            onClick={handleSave}
            disabled={!isDataChanged} // Disable button if no changes
          >
            Simpan
          </Button>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default StoreConfigPage;
